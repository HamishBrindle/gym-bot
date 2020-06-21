import { Module } from '@nestjs/common';
import { JobsClient } from 'src/jobs/jobs.client';
import { JobsService } from 'src/jobs/jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  providers: [
    JobsClient.createProvider(),
    JobsService,
  ],
  exports: [
    JobsService,
  ],
  controllers: [JobsController],
})
export class JobsModule {}
