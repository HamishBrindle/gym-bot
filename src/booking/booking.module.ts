import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from 'src/jobs/jobs.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingClient } from './booking.client';

@Module({
  imports: [ConfigModule, JobsModule],
  controllers: [BookingController],
  providers: [BookingService, BookingClient.createProvider()],
})
export class BookingModule {}
