import {
  Controller, UseGuards, Delete, Patch, Get, Body, Post, Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { Booking } from 'src/shared/types/booking.type';
import { BookingService } from './booking.service';
import { GoldsUpdateBookingDto } from './dto/golds/update-booking.dto';
import { GoldsCreateBookingDto } from './dto/golds/create-booking.dto';
import { FindOneBooking } from './dto/find-one-booking.dto';
import { DestroyBookingDto } from './dto/destroy-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('golds')
  async create(@CurrentUser() user: User, @Body() body: GoldsCreateBookingDto) {
    const type: Booking = 'golds';
    return this.bookingService.create<GoldsCreateBookingDto>(user, type, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('golds')
  async findAll(@CurrentUser() user: User) {
    return this.bookingService.find(user, 'golds');
  }

  @UseGuards(JwtAuthGuard)
  @Get('golds/:id')
  async findOne(@Query() query: FindOneBooking) {
    return this.bookingService.findOne(query);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('golds/:id')
  async update(@Body() body: GoldsUpdateBookingDto, @Query('id') jobId: string) {
    return this.bookingService.update({ ...body, jobId });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('golds/:id')
  async destroy(@Query() query: DestroyBookingDto) {
    return this.bookingService.destroy(query);
  }
}
