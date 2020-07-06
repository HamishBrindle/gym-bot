import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import date2cron from 'src/shared/date2Cron';
import constants from 'src/shared/constants';
import { User } from 'src/users/users.entity';
import { Booking } from 'src/shared/types/booking.type';
import { LoggerService } from 'src/logger/logger.service';
import { CreateBookingDto } from './dto/golds/create-booking.dto';

/**
 * Create a unique job ID for a queue task to be fetched later
 *
 * @param user
 * @param type
 * @param cronExpression
 */
function createJobId(user: User, type: string, cronExpression: string): string {
  return `${user.id}|${type}|${cronExpression}`.replace(' ', '-');
}

@Injectable()
export class BookingService implements OnModuleInit {
  constructor(
    @InjectQueue('BOOKING_QUEUE') private bookingQueue: Queue,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BookingService');
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
      this.logger.error(`❌ Job "${job.id}" has failed: ${err.message}`, err.stack);
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

  /**
   * Create a new Booking
   *
   * @param user
   * @param createBookingDto
   */
  async create(user: User, createBookingDto: CreateBookingDto) {
    const defaultTimezone = constants.defaults.tz;
    const cron = date2cron(createBookingDto.time, createBookingDto.days, {
      tz: createBookingDto.tz ?? defaultTimezone,
      offset: ['hours', -72],
    });

    const jobId = createJobId(user, createBookingDto.type, cron);

    const existing = await this.bookingQueue.getJob(jobId);
    if (existing) {
      throw Error('A job with this ID already exists in the queue');
    }

    return this.bookingQueue.add(createBookingDto.type, {
      time: createBookingDto.time,
      days: createBookingDto.days,
      username: createBookingDto.username,
      password: createBookingDto.password,
    }, {
      jobId,
      repeat: {
        cron,
        tz: createBookingDto.tz ?? defaultTimezone,
        startDate: createBookingDto.startDate,
        endDate: createBookingDto.endDate,
        limit: createBookingDto.limit,
      },
    });
  }

  async findOne(user: User, type: Booking, expression: string) {
    const jobId = createJobId(user, type, expression);
    const job = await this.bookingQueue.getJob(jobId);
    if (!job) {
      return null;
    }
    return job;
  }

  async find(user: User, type: Booking) {
    const jobs = await this.bookingQueue.getJobs([
      'waiting',
      'active',
      'paused',
      'delayed',
      'active',
    ]);
    if (!jobs || !jobs.length) {
      return null;
    }
    return jobs.filter((job) => job.id.toString().startsWith(`${user.id}|${type}`));
  }

  // TODO: Update?

  // TODO: Delete
}
