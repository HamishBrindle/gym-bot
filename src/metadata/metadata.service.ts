import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import { Metadata } from './metadata.entity';
import { CreateMetadataDto } from './dto/create-metadata.dto';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(Metadata) private readonly metadataRepository: Repository<Metadata>,
  ) {}

  public async create(createMetadataDto: CreateMetadataDto): Promise<Metadata> {
    const metadata = new CreateMetadataDto();
    metadata.entity = createMetadataDto.entity;
    metadata.recordId = createMetadataDto.recordId;
    metadata.field = createMetadataDto.field;
    metadata.value = createMetadataDto.value;
    const errors = await validate(metadata);
    if (errors.length) {
      console.error(errors);
      throw Error('Unable to create Metadata');
    }
    return this.metadataRepository.create(createMetadataDto).save();
  }
}
