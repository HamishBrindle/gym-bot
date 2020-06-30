import {
  IsString, MinLength,
} from 'class-validator';
import { JobsStatus } from 'src/jobs/jobs.client';

export class UpdateBookingDto {
  @IsString()
  readonly date: string;

  @IsString()
  readonly time: string;

  /**
   * Unique email address of User
   */
  @IsString()
  @MinLength(6) // Shortest status = 6
  readonly status: JobsStatus;
}
