import {
  Controller, UseGuards, Delete, Patch, Get, Body, Post, HttpException, HttpStatus, Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { Booking } from 'src/shared/types/booking.type';
import { LoggerService } from 'src/logger/logger.service';
import { BookingService } from './booking.service';
import { GoldsUpdateBookingDto } from './dto/golds/update-booking.dto';
import { GoldsCreateBookingDto } from './dto/golds/create-booking.dto';

const success = (data: any, message = 'Success!') => ({
  status: 200,
  data,
  message,
});

@Controller('booking')
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BookingController');
  }

  @UseGuards(JwtAuthGuard)
  @Post('golds')
  async create(@CurrentUser() user: User, @Body() body: GoldsCreateBookingDto) {
    this.logger.log(`create : params : ${JSON.stringify([user, body], null, 2)}`);

    try {
      const type: Booking = 'golds';
      const response = await this.bookingService.create<GoldsCreateBookingDto>(user, type, body);
      this.logger.log(`create : response: ${JSON.stringify(response, null, 2)}`);
      return success(response, `Successfully created Booking, "${response.id}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('golds')
  async findAll(@CurrentUser() user: User) {
    this.logger.log(`findAll : params : ${JSON.stringify([user], null, 2)}`);

    try {
      const type: Booking = 'golds';
      const response = await this.bookingService.find(user, type);
      this.logger.log(`findAll : response: ${JSON.stringify(response, null, 2)}`);
      return success(response, `Found Bookings for type, "${type}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('golds/:id')
  async findOne(@Param('id') jobId: string) {
    this.logger.log(`findOne : params : ${JSON.stringify([jobId], null, 2)}`);

    try {
      const response = await this.bookingService.findOne({ jobId });
      this.logger.log(`findOne : response: ${JSON.stringify(response, null, 2)}`);
      return success(response, `Found Booking, "${jobId}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('golds/:id')
  async update(@Body() body: GoldsUpdateBookingDto, @Param('id') jobId: string) {
    this.logger.log(`update : params : ${JSON.stringify([body, jobId], null, 2)}`);

    try {
      const response = await this.bookingService.update({ ...body, jobId });
      this.logger.log(`update : response: ${JSON.stringify(response, null, 2)}`);
      return success(response, `Successfully updated Booking, "${jobId}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('golds/:id')
  async destroy(@Param('id') jobId: string) {
    this.logger.log(`destroy : params : ${JSON.stringify([jobId], null, 2)}`);
    try {
      const response = await this.bookingService.destroy({ jobId });
      this.logger.log(`destroy : response: ${JSON.stringify(response, null, 2)}`);
      return success(null, `Successfully deleted Booking, "${jobId}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
