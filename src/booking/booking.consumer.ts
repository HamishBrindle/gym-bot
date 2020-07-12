import { Processor, OnQueueActive, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LoggerService } from 'src/logger/logger.service';
import { GoldsService, IGoldsGymArguments } from './golds/golds.service';

@Processor('BOOKING_QUEUE')
export class BookingConsumer {
  constructor(
    private readonly goldsService: GoldsService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('BookingConsumer');
  }

  @OnQueueActive()
  onActive(queueJob: Job) {
    this.logger.log(`BOOKING_QUEUE: Processing job ${queueJob.id} of type ${queueJob.name} with data:`);
    this.logger.log(JSON.stringify(queueJob.data));
  }

  @Process('golds')
  async golds(queueJob: Job<IGoldsGymArguments>) {
    this.logger.log(`Executing task: "golds" - queueJob :>> ${JSON.stringify(queueJob)}`);
    await this.goldsService.reserve(queueJob.data);
    return {};
  }
}
