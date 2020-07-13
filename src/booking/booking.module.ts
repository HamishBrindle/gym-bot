import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from 'src/logger/logger.module';
import { BullModule } from '@nestjs/bull';
import { BookingService } from './booking.service';
import { BookingConsumer } from './booking.consumer';
import { GoldsModule } from './golds/golds.module';

const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } = process.env;

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    LoggerModule,
    BullModule.registerQueue({
      name: 'BOOKING_QUEUE',
      redis: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT as string, 10),
        password: REDIS_PASSWORD,
      },
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
      },
    }),
    forwardRef(() => GoldsModule),
  ],
  providers: [BookingService, BookingConsumer],
  exports: [BookingService],
})
export class BookingModule {}
