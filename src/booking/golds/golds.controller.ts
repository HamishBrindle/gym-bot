import {
  Controller,
  UseGuards,
  Delete,
  Patch,
  Get,
  Body,
  Post,
  HttpException,
  HttpStatus,
  Inject,
  forwardRef,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { Booking } from 'src/shared/types/booking.type';
import { LoggerService } from 'src/logger/logger.service';
import { BookingService } from '../booking.service';
import { GoldsUpdateBookingDto } from './dto/update-booking.dto';
import { GoldsCreateBookingDto } from './dto/create-booking.dto';
import { GoldsService } from './golds.service';

const success = (data: any, message = 'Success!') => ({
  status: 200,
  data,
  message,
});

@Controller('booking/golds')
export class GoldsController {
  constructor(
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
    private readonly goldsService: GoldsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BookingController');
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: User, @Body() body: GoldsCreateBookingDto) {
    // Specific offset logic for Golds gym Bookings
    if (!body?.offset) {
      body.offset = ['days', -3];
    }

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
  @Get()
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
  @Get(':id')
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
  @Patch(':id')
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
  @Delete(':id')
  async destroy(@Param('id') jobId: string) {
    this.logger.log(`destroy : params : ${JSON.stringify([jobId], null, 2)}`);

    try {
      await this.bookingService.destroy({ jobId });
      this.logger.log('destroy : success!');
      return success({ jobId }, `Successfully deleted Booking, "${jobId}"`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async destroyAll(@CurrentUser() user: User) {
    this.logger.log(`Destroying all jobs for User, ${user.email}`);

    try {
      const result = await this.bookingService.destroyAll(user, 'golds');
      return success(result, `Successfully deleted all Gold's Bookings for ${user.email}`);
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('debug')
  async debug(@Body() args: any) {
    return this.goldsService.reserve(args);
  }
}
