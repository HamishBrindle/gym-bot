import { IsString } from 'class-validator';

export class DestroyBookingDto {
  @IsString()
  readonly jobId!: string;
}
