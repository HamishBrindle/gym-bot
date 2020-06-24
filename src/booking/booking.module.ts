import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from 'src/jobs/jobs.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingClient } from './booking.client';

@Module({
  imports: [ConfigModule, JobsModule, AccountsModule, UsersModule],
  controllers: [BookingController],
  providers: [BookingService, BookingClient.createProvider()],
  exports: [BookingService],
})
export class BookingModule {}
