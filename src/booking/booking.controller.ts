import {
  Controller, Post, UseGuards, Delete, Patch, Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    // TODO
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cron')
  async findOne() {
    // TODO
  }

  @UseGuards(JwtAuthGuard)
  @Post('reserve')
  async reserve() {
    // TODO
  }

  @UseGuards(JwtAuthGuard)
  @Post(':cron')
  async schedule() {
    // TODO
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cron')
  async update() {
    // TODO
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cron')
  async cancel() {
    // TODO
  }
}
