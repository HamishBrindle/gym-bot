import {
  IsString, MinLength,
} from 'class-validator';
import { JobsStatus } from 'src/jobs/jobs.client';

export class UpdateBookingDto {
  /**
   * Unique email address of User
   */
  @IsString()
  @MinLength(6) // Shortest status = 6
  readonly status: JobsStatus;
}
