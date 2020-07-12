import moment from 'moment-timezone';
import cronParser from 'cron-parser';
import { SupportedOffsetUnits } from 'src/booking/interfaces/create-booking.interface';

const defaultOptions: Options = {
  tz: 'Etc/GMT',
  offset: ['days', 0],
};

/**
 * Validate the options passed to date2cron
 *
 * @param {object} options date2Cron options object
 * @param {string} [options.tz] Timezone
 * @param {[string, number]} [options.offset] Timezone string
 * @returns {boolean} Options are valid
 */
function validateOptions(options: any) {
  if (options === defaultOptions) return true;

  // Override defaults with options param
  if (!options.tz) options.tz = defaultOptions.tz;
  if (!options.offset) options.offset = defaultOptions.offset;

  if (!options.tz
    || typeof options.tz !== 'string'
  ) {
    throw Error('Invalid `tz` provided. Ensure your timezone is correct');
  }

  const supportedOffsetUnits = [
    'days',
    // 'milliseconds',
    // 'seconds',
    // 'minutes',
    // 'hours',
    // 'weeks',
    // 'months',
    // 'years',
  ];

  if (!options.offset
    || !Array.isArray(options.offset)
    || typeof options.offset[0] !== 'string'
    || typeof options.offset[1] !== 'number'
  ) {
    throw Error('Invalid `offset` provided. Ensure parameter is of type [string, number]');
  } if (!supportedOffsetUnits.includes(options.offset[0])) {
    throw Error(`Invalid \`offset\` provided. [0] Element must be supported: ${supportedOffsetUnits}`);
  }

  return true;
}

/**
 * @param day
 * @param offset
 */
function applyOffset(day: string|number, offset: [SupportedOffsetUnits, number]) {
  let d = day;
  if (typeof d === 'string') {
    d = parseInt(day as string, 10);
  }

  switch (offset[0]) {
    case 'days': {
      const r = Math.abs(offset[1]) % 7;
      if (offset[1] >= 0) {
        const s = d + r;
        return (s > 6) ? s - 7 : s;
      }
      const s = d - r;
      return (s < 0) ? s + 7 : s;
    }
    default: {
      throw Error(`Cannot apply offset with unknown/unsupported unit: ${offset[0]}`);
    }
  }
}

/**
 * Convert time and date strings to a single cronjob expression
 *
 * @param {string} time 24Hr time
 * @param {(number|string)[]} [days] Days of the week (0-6). Optional.
 * @param {object} [options] Options specifying timezone, offset, etc. Optional.
 * @returns {string} Cron expression
 */
function date2cron(time: string, days: (number|string)[] = [], options?: Options) {
  if (!options) options = defaultOptions;

  const optionsValid = validateOptions(options);

  if (!optionsValid) {
    throw Error(`Invalid options provided. Options: ${options}`);
  }

  const { tz, offset } = options as Required<Options>;
  const [offsetUnit, offsetAmount] = offset;
  const offsetOperation = (offsetAmount >= 0) ? 'add' : 'subtract';

  // Parse time string with moment using provided timezone and run any operations
  // on the returned datestring (add/minus days or minutes, etc)
  let m;
  try {
    m = moment(time, 'hh:mm').tz(tz)[offsetOperation](offsetAmount, offsetUnit);
  } catch (error) {
    return '';
  }

  // TODO: Apply offset to the dates

  let minute = m.minute();
  let hour = m.hour();
  let day = '*';

  if (typeof minute !== 'number') minute = 0;
  if (typeof hour !== 'number') hour = 0;

  // Ensure the days of the week provided are valid and in range of 0 - 6
  if (days.length) {
    const validDays = days.every(
      (d) => parseInt(d as string, 10) <= 6 && parseInt(d as string, 10) >= 0,
    );
    if (!validDays) {
      throw Error('Unable to use `days` params - Weekdays must be within 0 - 6');
    }
    days.forEach((d, index) => {
      days[index] = applyOffset(d, offset);
    });
    day = days.join(',');
  }

  const expression = `${minute} ${hour} * * ${day}`;

  const parsedCron = cronParser.parseExpression(expression, { tz });
  const n = moment(parsedCron.next().toISOString()).tz(tz);

  const a = m.format('hh:mm');
  const b = n.format('hh:mm');

  if (a === b) {
    return expression;
  }

  throw Error('Unable to ensure generated cron-expression is valid');
}

export default date2cron;

type Options = {
  /**
   * Most likely leave this as `Etc/GMT` because our queue system
   * will take care of the conversion for us from GMT. Honestly,
   * don't change this.
   */
  tz?: string;
  offset?: [SupportedOffsetUnits, number];
};
