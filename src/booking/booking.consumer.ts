import { Processor, OnQueueActive, Process } from '@nestjs/bull';
import { Job as QueueJob } from 'bull';
import reserveGolds, { IGoldsGymArguments } from './functions/golds-gym';

@Processor('BOOKING_QUEUE')
export class BookingConsumer {
  @OnQueueActive()
  onActive(queueJob: QueueJob) {
    console.log(
      `BOOKING_QUEUE: Processing job ${queueJob.id} of type ${queueJob.name} with data ${queueJob.data}...`,
    );
  }

  @Process('golds')
  async golds(queueJob: QueueJob<IGoldsGymArguments>) {
    await reserveGolds(queueJob.data);
    return {};
  }

  @Process('test')
  async test(queueJob: QueueJob<IGoldsGymArguments>) {
    console.log('TESTING TESTING TESTING');
    console.log(queueJob.data);
    return {};
  }
}
