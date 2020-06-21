import {
  Controller, Post, UseGuards, Delete, Param, Query,
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
  async reserve(@Query('date') date: string, @Query('time') time: string) {
    return this.bookingService.reserve(date, time);
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule/:cron')
  async schedule(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.schedule(currentUser, cronExp);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:cron')
  async cancel(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.cancel(currentUser, cronExp);
  }
}
