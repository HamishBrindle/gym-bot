import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { BookingModule } from '../booking.module';
import { GoldsController } from './golds.controller';
import { GoldsService } from './golds.service';

@Module({
  imports: [
    BookingModule,
    LoggerModule,
  ],
  controllers: [GoldsController],
  providers: [GoldsService],
  exports: [GoldsService],
})
export class GoldsModule {}
