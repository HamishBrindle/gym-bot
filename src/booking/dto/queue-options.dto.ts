import { IsString, IsNumber, IsOptional } from 'class-validator';

export class QueueOptionsDto {
  /**
   * Cron string
   */
  @IsString()
  @IsOptional()
  readonly cron?: string;

  /**
   * Timezone
   */
  @IsString()
  @IsOptional()
  readonly tz?: string;

  /**
   * Start date when the repeat job should start repeating (only with cron).
   */
  @IsString()
  @IsOptional()
  readonly startDate?: Date | string | number;

  /**
   * End date when the repeat job should stop repeating.
   */
  @IsString()
  @IsOptional()
  readonly endDate?: Date | string | number;

  /**
   * Number of times the job should repeat at max.
   */
  @IsNumber()
  @IsOptional()
  readonly limit?: number;

  /**
   * Repeat every millis (cron setting cannot be used together with this setting.)
   */
  @IsNumber()
  @IsOptional()
  readonly every?: number;

  /**
   * The start value for the repeat iteration count.
   */
  @IsNumber()
  @IsOptional()
  readonly count?: number;
}
