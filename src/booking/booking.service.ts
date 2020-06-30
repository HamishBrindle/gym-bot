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
import reserveGolds, { IGoldsGymArguments } from './functions/golds-gym';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingService implements OnModuleInit {
  constructor(
    @InjectQueue('BOOKING_QUEUE') private bookingQueue: Queue,

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
        job,
        () => this.reserve(user, job),
      ));
    });
  }

  /**
   * Schedule a cronjob for booking gym appointments
   *
   * @param user
   * @param cronExp Cron expression (ex. "45 17 * * 0-2,5-6")
   * @param createBookingDto
   */
  async schedule(
    user: User,
    cronExp: string,
    createBookingDto: CreateBookingDto,
  ): Promise<JobsSummary> {
    const summary = await this.jobsService.add(
      user,
      cronExp,
      createBookingDto,
      () => this.reserve(user, createBookingDto),
    );
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
    const summary = await this.jobsService.update(user, cronExp, updateBookingDto);
    if (!summary) {
      throw Error('Unable to update this existing booking 😭');
    }
    return summary;
  }

  /**
   * Reserve a gym appointment
   *
   * @param user
   * @param cronExp
   * @param createBookingDto
   */
  async reserve(user: User, createBookingDto: CreateBookingDto) {
    const account = await this.accountsService.get(user);
    if (!account) {
      throw Error('This User cannot make a reservation without an Account');
    }

    const date = moment(createBookingDto.date, 'MM/DD/YYYY');
    const { time } = createBookingDto;

    await this.bookingQueue.add('golds', {
      date: date.format('MM/DD/YYYY'),
      time,
      username: account.username,
      password: account.password,
    } as IGoldsGymArguments);

    return true;
  }

  /**
   * Reserve a gym appointment
   *
   * @param user
   * @param date
   * @param time
   */
  async debug(user: User, date: string, time: string) {
    const account = await this.accountsService.get(user);
    if (!account) {
      throw Error('This User cannot make a reservation without an Account');
    }

    await reserveGolds({
      date,
      time,
      username: account.username,
      password: account.password,
    } as IGoldsGymArguments);

    return true;
  }
}
