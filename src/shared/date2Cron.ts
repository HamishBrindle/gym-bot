import moment from 'moment-timezone';
import cronParser from 'cron-parser';

type SupportedOffsetUnits = 'milliseconds'|'seconds'|'minutes'|'hours'|'days'|'weeks'|'months'|'years';

const defaultOptions = {
  tz: 'America/Los_Angeles',
  offset: ['hours', 0] as [SupportedOffsetUnits, number],
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
    console.error('Invalid `tz` provided. Ensure your timezone is correct');
    return false;
  }

  const supportedOffsetUnits = [
    'milliseconds',
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'months',
    'years',
  ];

  if (!options.offset
    || !Array.isArray(options.offset)
    || typeof options.offset[0] !== 'string'
    || typeof options.offset[1] !== 'number'
  ) {
    console.error('Invalid `offset` provided. Ensure parameter is of type [string, number]');
    return false;
  } if (!supportedOffsetUnits.includes(options.offset[0])) {
    console.error('Invalid `offset` provided. [0] Element must be supported:', supportedOffsetUnits);
    return false;
  }

  return true;
}

/**
 * Convert time and date strings to a single cronjob expression
 *
 * @param {string} time 24Hr time
 * @param {(number|string)[]} [days] Days of the week (0-6). Optional.
 * @param {object} [options] Options specifying timezone, offset, etc. Optional.
 * @returns {string} Cron expression
 */
function date2cron(time: string, days: (number|string)[] = [], options = defaultOptions) {
  const optionsValid = validateOptions(options);

  if (!optionsValid) {
    console.error('Invalid options provided. Options: ', options);
    return '';
  }

  const { tz, offset } = options;
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
      console.error('Unable to use `days` params - Weekdays must be within 0 - 6');
      return '';
    }
    day = days.join(',');
  }

  const expression = `${minute} ${hour} * * ${day}`;

  try {
    const parsedCron = cronParser.parseExpression(expression, { tz });
    const n = moment(parsedCron.next().toISOString()).tz(tz);

    const a = m.format('hh:mm');
    const b = n.format('hh:mm');

    if (a === b) {
      return expression;
    }

    return '';
  } catch (error) {
    console.error('Unable to parse expression:', error);
    return '';
  }
}

export default date2cron;
