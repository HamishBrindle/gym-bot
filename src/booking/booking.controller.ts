import {
  Controller, Post, UseGuards, Delete, Param, Patch, Body, Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { BookingService } from './booking.service';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly jobsService: JobsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() currentUser: User) {
    return this.jobsService.findInClient(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cron')
  async findOne(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.jobsService.findOneInClient(currentUser, cronExp);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':cron')
  async schedule(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.schedule(currentUser, cronExp);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':cron')
  async update(
  @Param('cron') cronExp: string,
    @CurrentUser() currentUser: User,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.update(currentUser, cronExp, updateBookingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':cron')
  async cancel(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.bookingService.cancel(currentUser, cronExp);
  }
}
