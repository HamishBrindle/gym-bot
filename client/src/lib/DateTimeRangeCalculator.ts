import moment from 'moment';

/**
 * Calculates date time range.
 */
export class DateTimeRangeCalculator {
  /** Date time range format. */
  private readonly DATE_TIME_RANGE_FORMAT = 'YYYY-MM-DD HH:mm:ss:SSS';

  /** Day format. */
  private readonly DAY_FORMAT = 'YYYY-MM-DD';

  /**
   * Default timezone offset when not provided.
   * +3 hours because user lives in Pacific time, but data server is in Eastern time.
   */
  private readonly DEFAULT_TIMEZONE_OFFSET = 3;

  /** First day with inventory data. */
  readonly FIRST_DAY = '2020-04-06';

  /**
   * Return DateTimeRange for today.
   * @param [time]
   * @return DateTimeRange
   */
  getDateTimeRangeToday(time?: string): DateTimeRange {
    const startDate = moment().format(this.DAY_FORMAT);
    return {
      startDate,
      endDate: startDate,
      startEndTime: time ?? '14:00',
    };
  }

  /**
   * Return DateTimeRange for the this week (starting from Sunday).
   * @param [time]
   * @return DateTimeRange
   */
  getDateTimeRangeThisWeek(time?: string): DateTimeRange {
    return {
      startDate: moment().day(0).format(this.DAY_FORMAT),
      endDate: moment().format(this.DAY_FORMAT),
      startEndTime: time ?? '18:00',
    };
  }

  /**
   * Return DateTimeRange for last seven days.
   * @param [time]
   * @return DateTimeRange
   */
  getDateTimeRangeLastWeek(time?: string): DateTimeRange {
    return {
      startDate: moment().subtract(1, 'week').format(this.DAY_FORMAT),
      endDate: moment().format(this.DAY_FORMAT),
      startEndTime: time ?? '18:00',
    };
  }

  /**
   * Return DateTimeRange for this month.
   * @param [time]
   * @return DateTimeRange
   */
  getDateTimeRangeThisMonth(time?: string): DateTimeRange {
    return {
      startDate: moment().date(1).format(this.DAY_FORMAT),
      endDate: moment().format(this.DAY_FORMAT),
      startEndTime: time ?? '18:00',
    };
  }

  /**
   * Return DateTimeRange for all available data.
   * @param [time]
   * @return DateTimeRange
   */
  getDateTimeRangeAll(time?: string): DateTimeRange {
    return {
      startDate: this.FIRST_DAY,
      endDate: moment().format(this.DAY_FORMAT),
      startEndTime: time ?? '18:00',
    };
  }

  /**
   * Calculates the start and end date time with timezone offset, for inclusive SQL querying.
   * @param dateTimeRange
   * @return calculated date time ranges
   */
  calcDateTimeRange(dateTimeRange: DateTimeRange): CalculatedDateTimeRange {
    const {
      startDate,
      endDate,
      startEndTime,
      timezoneOffset,
    } = dateTimeRange;

    const offset = timezoneOffset ?? this.DEFAULT_TIMEZONE_OFFSET;
    let start = moment(`${startDate} ${startEndTime}:00`).add(-1, 'd').add(1, 'ms');
    let end = moment(`${endDate} ${startEndTime}:00`);
    start = start.add(offset, 'h');
    end = end.add(offset, 'h');

    return {
      startDateTime: start.format(this.DATE_TIME_RANGE_FORMAT),
      endDateTime: end.format(this.DATE_TIME_RANGE_FORMAT),
      totalDays: 1 + end.diff(start, 'd'),
    };
  }
}

/**
 * Date time range properties.
 * @param startDate with format 'YYYY-MM-DD'
 * @param endDate with format 'YYYY-MM-DD'
 * @param startEndTime with format 'HH:mm'
 * @param [timezoneOffset] in hours
 */
export type DateTimeRange = {
  startDate: string;
  endDate: string;
  startEndTime: string;
  timezoneOffset?: number;
};

/**
 * Calculated date time range.
 * @param startdateTime with format 'YYYY-MM-DD HH:mm:ss:SSS'
 * @param endDateTime with format 'YYYY-MM-DD HH:mm:ss:SSS'
 * @param totalDays total number of days in range
 */
export type CalculatedDateTimeRange = {
  startDateTime: string;
  endDateTime: string;
  totalDays: number;
};

export default new DateTimeRangeCalculator();
