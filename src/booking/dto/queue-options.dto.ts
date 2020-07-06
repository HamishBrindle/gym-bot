import { IsString, IsNumber } from 'class-validator';

export class QueueOptionsDto {
  /**
   * Cron string
   */
  @IsString()
  readonly cron?: string;

  /**
   * Timezone
   */
  @IsString()
  readonly tz?: string;

  /**
   * Start date when the repeat job should start repeating (only with cron).
   */
  @IsString()
  readonly startDate?: Date | string | number;

  /**
   * End date when the repeat job should stop repeating.
   */
  @IsString()
  readonly endDate?: Date | string | number;

  /**
   * Number of times the job should repeat at max.
   */
  @IsNumber()
  readonly limit?: number;

  /**
   * Repeat every millis (cron setting cannot be used together with this setting.)
   */
  @IsNumber()
  readonly every?: number;

  /**
   * The start value for the repeat iteration count.
   */
  @IsNumber()
  readonly count?: number;
}
