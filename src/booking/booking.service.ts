import { Injectable, OnModuleInit } from '@nestjs/common';
import moment from 'moment-timezone';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/users/users.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { JobsSummary } from 'src/jobs/jobs.client';
import { UsersService } from 'src/users/users.service';
import Bluebird from 'bluebird';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { IGoldsGymArguments } from './functions/golds-gym';

@Injectable()
export class BookingService implements OnModuleInit {
  constructor(
    @InjectQueue('BOOKING_QUEUE') private readonly bookingQueue: Queue,

    private readonly jobsService: JobsService,
    private readonly accountsService: AccountsService,
    private readonly usersService: UsersService,

  ) {}

  /**
   * Initialization lifecycle-hook
   */
  async onModuleInit(): Promise<void> {
    this.sync();
  }

  /**
   * Sync the `Job[]` persisted in the database and activate
   * the jobs and their remembered state.
   */
  public async sync(): Promise<(JobsSummary|null)[][]> {
    const users = await this.usersService.find();
    return Bluebird.map(users, async (user) => {
      const jobsFromDb = await this.jobsService.find({
        where: {
          user: {
            id: user.id,
          },
        },
      });
      return jobsFromDb.map((job) => this.jobsService.activate(
        user,
        job.expression,
        job.status,
        () => this.schedule(user, job.expression),
      ));
    });
  }

  /**
   * Schedule a cronjob for booking gym appointments
   *
   * @param user
   * @param cronExp Cron expression (ex. "45 17 * * 0-2,5-6")
   */
  async schedule(user: User, cronExp: string): Promise<JobsSummary> {
    const summary = await this.jobsService.add(user, cronExp, () => {
      const parsed = this.jobsService.parseExpression(cronExp);
      const date = moment().add(3, 'days');
      const prev = moment(parsed.prev().toDate()).tz('America/Los_Angeles');
      const hours = prev.hours();
      const minutes = prev.minutes();
      const meridiem = (hours < 12) ? 'am' : 'pm';
      const time = `${(hours > 12) ? hours - 12 : hours}:${(minutes < 10) ? `0${minutes}` : minutes}${meridiem}`;
      return this.reserve(user, date.format('MM/DD/YYYY'), time);
    });
    if (!summary) {
      throw Error('Unable to schedule this booking 🤷‍♂️');
    }
    return summary;
  }

  /**
   * Cancel a scheduled booking; destroy it.
   *
   * @param user
   * @param cronExp
   */
  async cancel(user: User, cronExp: string): Promise<JobsSummary> {
    const summary = await this.jobsService.destroy(user, cronExp);
    if (!summary) {
      throw Error('Unable to cancel this scheduled booking 🤦‍♂️');
    }
    return summary;
  }

  /**
   * Update the status of a booking
   *
   * @param user
   * @param cronExp
   * @param updateBookingDto
   */
  async update(
    user: User,
    cronExp: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<JobsSummary> {
    const summary = await this.jobsService.update(user, cronExp, updateBookingDto.status);
    if (!summary) {
      throw Error('Unable to update this existing booking 😭');
    }
    return summary;
  }

  /**
   * Reserve a gym appointment
   *
   * @param user
   * @param date Date the reservation process will occur (3 days prior)
   * @param time Time of the session
   */
  async reserve(user: User, date: string, time: string) {
    const account = await this.accountsService.get(user);
    if (!account) {
      throw Error('This User cannot make a reservation without an Account');
    }
    console.log('reserving :>>');
    return this.bookingQueue.add('test', {
      date,
      time,
      username: account.username,
      password: account.password,
    } as IGoldsGymArguments, {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 1,
    });
  }
}
