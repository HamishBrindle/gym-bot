import {
  IsString, IsIn, IsNotEmpty, MinLength,
} from 'class-validator';
import { MetadataEntity } from '../metadata.entity';

export class CreateMetadataDto {
  @IsString()
  @IsIn(MetadataEntity)
  entity: MetadataEntity;

  @IsString()
  @IsNotEmpty()
  recordId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  field: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  value: string;
}
