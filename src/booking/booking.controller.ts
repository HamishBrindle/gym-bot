import {
  Controller, Get, Query, Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('reserve')
  async reserve(
    @Query('date') date: string,
      @Query('time') time: string,
  ): Promise<string> {
    if (!date || !time) {
      throw Error('Unable to reserve appointments without `date` or `time` parameters');
    }
    return this.bookingService.reserve(date, time);
  }

  @Get('schedule')
  async schedule(
  @Query('cron') cron: string,
  ) {
    return this.bookingService.schedule(cron);
  }
}
