import {
  Controller, Query, Post, UseGuards, Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  async reserve(
    @Query('date') date: string, @Query('time') time: string,
  ): Promise<string> {
    if (!date || !time) {
      throw Error('Unable to reserve appointments without `date` or `time` parameters');
    }
    return this.bookingService.reserve(date, time);
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule')
  async schedule(
  @Query('cron') cron: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.bookingService.schedule(currentUser, cron);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel')
  async cancel(
  @Query('cron') cron: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.bookingService.cancel(currentUser, cron);
  }
}
