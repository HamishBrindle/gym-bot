import { Injectable, Inject } from '@nestjs/common';
import moment from 'moment-timezone';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/users/users.entity';
import { AccountsService } from 'src/accounts/accounts.service';
import { BookingClient } from './booking.client';

@Injectable()
export class BookingService {
  @Inject('BOOKING_CLIENT')
  private readonly bookingClient: BookingClient;

  constructor(
    private readonly jobsService: JobsService,
    private readonly accountsService: AccountsService,
  ) {}

  /**
   * Schedule a cronjob for booking gym appointments
   *
   * @param user
   * @param cronExp Cron expression (ex. "45 17 * * 0-2,5-6")
   */
  async schedule(user: User, cronExp: string): Promise<boolean> {
    return this.jobsService.add(user, cronExp, async () => {
      const parsed = this.jobsService.parseExpression(cronExp);
      const date = moment().add(3, 'days');
      const prev = moment(parsed.prev().toDate()).tz('America/Los_Angeles');
      const hours = prev.hours();
      const minutes = prev.minutes();
      const meridiem = (hours < 12) ? 'am' : 'pm';
      const time = `${(hours > 12) ? hours - 12 : hours}:${(minutes < 10) ? `0${minutes}` : minutes}${meridiem}`;
      return this.reserve(user, date.format('MM/DD/YYYY'), time);
    });
  }

  /**
   * Cancel a scheduled booking
   *
   * @param user
   * @param cronExp
   */
  async cancel(user: User, cronExp: string): Promise<boolean> {
    return this.jobsService.destroy(user, cronExp);
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
    return this.bookingClient.reserve(account, date, time);
  }
}
