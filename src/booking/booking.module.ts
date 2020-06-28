import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from 'src/jobs/jobs.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;

@Module({
  imports: [
    ConfigModule,
    JobsModule,
    AccountsModule,
    UsersModule,
    BullModule.registerQueue({
      name: 'BOOKING_QUEUE',
      redis: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT as string, 10),
        password: REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
