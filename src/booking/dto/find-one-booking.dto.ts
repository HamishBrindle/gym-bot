import { IsString } from 'class-validator';

export class FindOneBooking {
  @IsString()
  readonly jobId!: string;
}
