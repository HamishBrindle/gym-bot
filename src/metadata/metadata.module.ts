import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetadataService } from './metadata.service';
import { Metadata } from './metadata.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Metadata]),
  ],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
