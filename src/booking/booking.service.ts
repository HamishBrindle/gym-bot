import { Injectable, Inject } from '@nestjs/common';
import moment from 'moment-timezone';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/users/users.entity';
import { BookingClient } from './booking.client';

@Injectable()
export class BookingService {
  @Inject('BOOKING_CLIENT')
  private readonly bookingClient: BookingClient;

  constructor(
    private readonly jobsService: JobsService,
  ) {}

  /**
   * Schedule a cronjob for booking gym appointments
   *
   * @param user
   * @param cronExp Cron expression (ex. "45 17 * * 0-2,5-6")
   */
  async schedule(user: User, cronExp: string): Promise<boolean> {
    const timezone = 'America/Los_Angeles';
    return this.jobsService.add(user, cronExp, async () => {
      const parsed = this.jobsService.parseExpression(cronExp);
      const date = moment().add(3, 'days');
      const prev = moment(parsed.prev().toDate()).tz(timezone);
      const hours = prev.hours();
      const minutes = prev.minutes();
      const meridiem = (hours < 12) ? 'am' : 'pm';
      const time = `${(hours > 12) ? hours - 12 : hours}:${(minutes < 10) ? `0${minutes}` : minutes}${meridiem}`;
      return this.bookingClient.reserve(date.format('MM/DD/YYYY'), time);
    }, {
      timezone: 'America/Los_Angeles',
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
   *
   * @param date Date the reservation process will occur (3 days prior)
   * @param time Time of the session
   */
  async reserve(date: string, time: string) {
    return this.bookingClient.reserve(date, time);
  }
}
