import { Processor, OnQueueActive, Process } from '@nestjs/bull';
import { Job } from 'bull';
import reserveGolds, { IGoldsGymArguments } from './functions/golds-gym';

@Processor('BOOKING_QUEUE')
export class BookingConsumer {
  @OnQueueActive()
  onActive(queueJob: Job) {
    console.log(`BOOKING_QUEUE: Processing job ${queueJob.id} of type ${queueJob.name} with data:`);
    console.log(JSON.stringify(queueJob.data, null, 2));
  }

  @Process('golds')
  async golds(queueJob: Job<IGoldsGymArguments>) {
    await reserveGolds(queueJob.data);
    return {};
  }
}
