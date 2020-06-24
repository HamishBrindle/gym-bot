import {
  Controller, Post, UseGuards, Delete, Param, Query, Get, Patch, Body,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { Crypto } from 'src/shared/Crypto';
import { ConfigService } from '@nestjs/config';
import { BookingService } from './booking.service';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  async reserve(@Query('date') date: string, @Query('time') time: string, @CurrentUser() user: User) {
    return this.bookingService.reserve(user, date, time);
  }

  @UseGuards(JwtAuthGuard)
  @Post('schedule/:cron')
  async schedule(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.schedule(currentUser, cronExp);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:cron')
  async update(
  @Param('cron') cronExp: string,
    @CurrentUser() currentUser: User,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(currentUser, cronExp, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel/:cron')
  async cancel(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.cancel(currentUser, cronExp);
  }

  @Get('debug')
  debug() {
    const key = this.configService.get<string>('SECRET') as string;
    const iv = 'd02fab74-8a54-4a13-a13d-f1403f791bf8';
    const crypto = new Crypto(key, iv);
    const encrypted = crypto.encrypt('redtruck1');
    console.log('encrypted :>> ', encrypted);
    const decrypted = crypto.decrypt(encrypted);
    console.log('decrypted :>> ', decrypted);
    return decrypted;
  }
}
