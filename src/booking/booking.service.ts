import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import date2cron from 'src/shared/date2Cron';
import constants from 'src/shared/constants';
import { User } from 'src/users/users.entity';
import { Booking } from 'src/shared/types/booking.type';
import { LoggerService } from 'src/logger/logger.service';
import Bluebird from 'bluebird';
import { ICreateBooking } from './interfaces/create-booking.interface';
import { IUpdateBooking } from './interfaces/update-booking.interface';

@Injectable()
export class BookingService implements OnModuleInit {
  constructor(
    @InjectQueue('BOOKING_QUEUE') private bookingQueue: Queue,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BookingService');
  }

  /**
   * Create a new Booking job for a User
   *
   * @param user
   * @param type  Which booking module we're using (ex. 'golds', etc)
   * @param args  Module-specific arguments
   */
  async create<T extends ICreateBooking>(user: User, type: Booking, args: T) {
    const defaultTimezone = constants.defaults.tz;

    const cron = date2cron(args.time, args.days, {
      offset: args.offset,
    });

    /**
     * Custom args to include User object
     */
    const params = {
      ...args,
      userId: user.id,
      tz: args.tz ?? defaultTimezone,
    };

    this.logger.log(`Creating a Booking with type "${type}" for User "${user.email}" with params: ${JSON.stringify(params)}`);

    return this.bookingQueue.add(type, params, {
      attempts: 1,
      repeat: {
        cron,
        tz: args.tz ?? defaultTimezone,
        startDate: args.startDate,
        endDate: args.endDate,
        limit: args.limit,
      },
    });
  }

  /**
   * Find a single Booking job using it's unique ID
   *
   * @param args
   * @param args.jobId
   */
  async findOne({ jobId }: { jobId: string }) {
    const job = await this.bookingQueue.getJob(jobId);
    if (!job) {
      throw Error(`Unable to find a Booking with provided id, "${jobId}"`);
    }
    return job;
  }

  /**
   * Find all the Booking jobs related to a User (ghetto query)
   * from the Booking Queue
   *
   * @param user
   * @param type
   */
  async find(user: User, type: Booking) {
    const jobs = await this.bookingQueue.getJobs([
      'active',
      'completed',
      'delayed',
      'failed',
      'paused',
      'waiting',
    ]);

    return (!jobs || !jobs.length)
      ? []
      : jobs.filter((job) => job.data.userId === user.id && job.name === type);
  }

  /**
   * Update a Booking job
   *
   * TODO: Not sure we've even tested this yet
   *
   * @param args
   */
  async update<T extends IUpdateBooking>(args: T) {
    const job = await this.findOne(args);
    if (!job) {
      throw Error(`Unable to update Booking with provided id, "${args.jobId}"`);
    }
    await job.update({
      ...job.data,
      ...args,
    });
    return true;
  }

  /**
   * Destroy a specific Booking job
   *
   * @param args
   * @param args.jobId Unique job ID in queue
   */
  async destroy({ jobId }: { jobId: string }) {
    const job = await this.findOne({ jobId });
    if (!job) {
      throw Error(`Unable to delete Booking with provided id, "${jobId}"`);
    }
    return job.remove();
  }

  /**
   * Destroy all the Booking jobs for this User and Booking type
   *
   * @param user
   * @param type
   */
  async destroyAll(user: User, type: Booking) {
    const jobs = await this.find(user, type);
    const jobIds = jobs.map((job) => job.id);
    return Bluebird.mapSeries(jobIds, (jobId) => this.bookingQueue.removeJobs(jobId as string));
  }

  /**
   * Hook-up all the queue listeners with our logger
   */
  onModuleInit() {
    this.bookingQueue.on('error', (error) => {
      // An error occured.
      this.logger.error(error);
    });

    this.bookingQueue.on('waiting', (jobId) => {
      // A Job is waiting to be processed as soon as a worker is idling.
      this.logger.log(`🤷‍♂️ Job is waiting: ${jobId}`);
    });

    this.bookingQueue.on('active', (job /* jobPromise */) => {
      // A job has started. You can use `jobPromise.cancel()`` to abort it.
      this.logger.log(`🏃‍♂️ Job "${job.id}" has been started with data: ${JSON.stringify(job.data, null, 2)}`);
    });

    this.bookingQueue.on('stalled', (job) => {
      // A job has been marked as stalled. This is useful for debugging job
      // workers that crash or pause the event loop.
      this.logger.warn(`🛑 Job has been stalled: ${job.id}`);
    });

    this.bookingQueue.on('progress', (job, progress) => {
      // A job's progress was updated!
      this.logger.log(`⏱ Job "${job.id}" has progressed: ${progress}`);
    });

    this.bookingQueue.on('completed', (job, result) => {
      // A job successfully completed with a `result`.
      this.logger.log(`✔ Job "${job.id}" has completed: ${JSON.stringify(result, null, 2)}`);
    });

    this.bookingQueue.on('failed', (job, err) => {
      this.logger.error(
        `❌ Job "${job.id}" has failed: ${err.message}: data: ${JSON.stringify(job.data)}`,
        err.stack,
      );
    });

    this.bookingQueue.on('paused', () => {
      // The queue has been paused.
      this.logger.log('⏸ Queue has been paused...');
    });

    this.bookingQueue.on('resumed', (job: Job) => {
      // The queue has been resumed.
      this.logger.log(`▶ Queue has been resumed with job: ${job.id || JSON.stringify(job, null, 2)}"`);
    });

    this.bookingQueue.on('cleaned', (jobs, type) => {
      // Old jobs have been cleaned from the queue. `jobs` is an array of cleaned
      // jobs, and `type` is the type of jobs cleaned.
      this.logger.log(`🧹 Some "${type}" Jobs have been cleaned: ${JSON.stringify(jobs, null, 2)}`);
    });

    this.bookingQueue.on('drained', () => {
      // Emitted every time the queue has processed all the waiting jobs
      // (even if there can be some delayed jobs not yet processed)
      this.logger.log('🍾🥂 All the Jobs in the queue have been processed!');
    });

    this.bookingQueue.on('removed', (job) => {
      // A job successfully removed.
      this.logger.log(`🙅‍♂️ Job has been removed: ${job.id}`);
    });
  }
}
