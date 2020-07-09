export interface IUpdateBooking {
  /**
   * Job identifer
   */
  jobId: string;
  /**
   * 24hr time of day
   */
  time?: string;
  /**
   * Days of the week
   */
  days?: (string|number)[];
  /**
   * Cron string
   */
  cron?: string;
  /**
   * Timezone
   */
  tz?: string;
  /**
   * Start date when the repeat job should start repeating (only with cron).
   */
  startDate?: Date | string | number;
  /**
   * End date when the repeat job should stop repeating.
   */
  endDate?: Date | string | number;
  /**
   * Number of times the job should repeat at max.
   */
  limit?: number;
  /**
   * Repeat every millis (cron setting cannot be used together with this setting.)
   */
  every?: number;
  /**
   * The start value for the repeat iteration count.
   */
  count?: number;
}
