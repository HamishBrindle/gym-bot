import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { BullModule } from '@nestjs/bull';
import { LoggerModule } from 'src/logger/logger.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingConsumer } from './booking.consumer';

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    LoggerModule,
    BullModule.registerQueue({
      name: 'BOOKING_QUEUE',
      defaultJobOptions: {
        delay: 50,
        removeOnComplete: true,
        removeOnFail: true,
      },
      redis: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT as string, 10),
        password: REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingConsumer],
  exports: [BookingService],
})
export class BookingModule {}
