import { Module } from '@nestjs/common';
import { JobsClient } from 'src/jobs/jobs.client';
import { JobsService } from 'src/jobs/jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
  ],
  providers: [
    JobsClient.createProvider(),
    JobsService,
  ],
  exports: [
    JobsService,
  ],
})
export class JobsModule {}
