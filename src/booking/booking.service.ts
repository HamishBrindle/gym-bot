import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import Bluebird from 'bluebird';
import moment from 'moment-timezone';
import cron from 'node-cron';
import cronParser from 'cron-parser';
import { ConfigService } from '@nestjs/config';

/**
 * Search Dates
 *
 * @param page
 * @param selector
 */
async function searchDates(page: puppeteer.Page, selector: string) {
  const elements = await page.$$(selector);
  return Bluebird.mapSeries(elements.map((element: puppeteer.ElementHandle<Element>) => (
    element.evaluate((innerElement: Element) => innerElement.innerHTML.split('&nbsp;&nbsp;')[1], element)
  )), (p) => p);
}

/**
 * Jobs map
 */
declare type JobMap = {
  [cronExp: string]: cron.ScheduledTask,
};

const jobs: JobMap = {};
const timezone = 'America/Los_Angeles';

@Injectable()
export class BookingService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Reserve an appointment at the gym by providing date and time
   *
   * @param date Date in the format of MM/DD/YYYY
   * @param time Time in the format of HH:MM(am|pm)
   */
  async reserve(date: string, time: string): Promise<string> {
    const url = this.configService.get<string>('GYM_URL');

    if (!url) throw Error('Cannot reserve without a properly defined URL');

    const username = 'hamishbrindle';
    const password = 'Yellow6188';

    const bookingMoment = moment(date, 'MM/DD/YYYY').locale('en-ca');
    const bookingDate = bookingMoment.format('MM/DD/YYYY');
    const bookingTime = time;

    // Initialize headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    try {
      // Make a new page to work with
      const page = await browser.newPage();

      await page.setRequestInterception(true);

      // Disable images and css while scraping
      page.on('request', (req: any) => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font'
              || req.resourceType() === 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Go to our Gym's booking page and wait until the "Sign In"
      // button is visible
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#signIn');

      // Type account name and password into the login fields
      await page.type('#username', username, { delay: 10 });
      await page.type('#password', password, { delay: 10 });

      await Promise.all([
        page.waitForNavigation(),
        page.click('#signIn', { delay: 5 }),
      ]);

      // Should login and load the main dashboard
      // Wait for the "Classes" button in the navbar and
      // click it
      await page.waitForSelector('#nav-classes > a');

      await Promise.all([
        page.waitForNavigation(),
        page.click('#nav-classes > a', { delay: 5 }),
      ]);

      // Should be on the list of classes now
      // Find the table containing all the classes and try to
      // read some of the table dates
      await page.waitForSelector('#classesInfo');

      const datesSelector = '#classesList > table > thead > tr.nonGridTableHeader.listRowDark > th:nth-child(1)';
      const d1 = await searchDates(page, datesSelector);
      let idx = d1.indexOf(bookingDate);

      if (idx < 0) {
        await page.click('#classesNextButton', { delay: 5 });
        await page.waitForSelector('#classesList > table:nth-child(2)');

        const d2 = await searchDates(page, datesSelector);

        idx = d2.indexOf(bookingDate);

        if (idx < 0) {
          throw Error('Didnt fucking work man');
        }
      }

      const table = await page.$(`#classesList > table:nth-child(${idx + 2})`);
      if (!table) {
        throw Error('Didnt find the right table I guess');
      }

      const classesOnSpecificDay = await table.$$('tbody > tr.classes');
      const classAtSpecificTime = await Bluebird.mapSeries(classesOnSpecificDay, async (tr) => {
        const cls = await tr.evaluate((element, t) => {
          const isCorrectTime = element.children[0]?.textContent?.split('-')[0].trim().includes(t);
          const isFull = element.children[1]?.textContent?.includes('Class full');
          const isWorkoutReservation = element.children[2]?.firstChild?.textContent?.includes('Workout Reservation');

          if (isCorrectTime && !isFull && isWorkoutReservation) {
            return true;
          }

          return false;
        }, bookingTime);

        if (cls) {
          return tr;
        }
        return null;
      });

      const [targetClass] = classAtSpecificTime.filter(Boolean);

      const enrollButton = await targetClass?.$('td.enrolledFull > button');
      if (!enrollButton) {
        throw Error('Unable to find the enroll button for this class');
      }

      await enrollButton.click({ delay: 5 });

      await page.waitForSelector('#scheduleEventDialog', {
        timeout: 10000,
      });

      const agreeInputSelector = '#agreeToTerms';
      const agreeInput = await page.$(agreeInputSelector);
      if (!agreeInput) {
        throw Error('Unable to find input field for "Agree to Terms"');
      }

      await agreeInput.click();

      const scheduleEventDialogButton = await page.$('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-dialog-buttons > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button.calltoaction');
      if (!scheduleEventDialogButton) {
        throw Error('Unable to find submit button for agreeing to terms');
      }

      await page.waitFor(1000);

      await scheduleEventDialogButton.click({
        delay: 50,
      });

      await page.waitFor(2000);

      await browser.close();

      console.info('Made reservation:', `${bookingDate} at ${bookingTime}`);

      return `${bookingDate}|${bookingTime}`;
    } catch (error) {
      console.error(error);
      await browser.close();
      return error.message;
    }
  }

  /**
   * Schedule a cronjob for booking gym appointments
   *
   * @param cronExp Cron expression (ex. "45 17 * * 0-2,5-6")
   */
  async schedule(cronExp: string): Promise<boolean> {
    const isValid = cron.validate(cronExp);
    if (!isValid) {
      console.error(`Cannot schedule cron job using expression, "${cronExp}"`);
      return false;
    }

    if (jobs[cronExp]) {
      jobs[cronExp].destroy();
    }

    const job = cron.schedule(cronExp, async () => {
      const parsed = cronParser.parseExpression(cronExp);
      const date = moment().add(3, 'days');
      const prev = moment(parsed.prev().toDate()).tz(timezone);
      const hours = prev.hours();
      const minutes = prev.minutes();
      const meridiem = (hours < 12) ? 'am' : 'pm';
      const time = `${(hours > 12) ? hours - 12 : hours}:${(minutes < 10) ? `0${minutes}` : minutes}${meridiem}`;
      return this.reserve(date.format('MM/DD/YYYY'), time);
    }, {
      timezone: 'America/Los_Angeles',
    });
    jobs[cronExp] = job;
    return true;
  }

  /**
   * TODO: Delete this
   *
   * @param cronExp
   */
  async debug(cronExp: string): Promise<boolean> {
    cron.schedule(cronExp, async () => {
      console.log('Hey! This cron-job is popping off!');
    });

    const parsed = cronParser.parseExpression(cronExp);
    const date = moment().add(3, 'days');
    const prev = moment(parsed.prev().toDate()).tz(timezone);
    const hours = prev.hours();
    const minutes = prev.minutes();
    const meridiem = (hours < 12) ? 'am' : 'pm';
    const time = `${(hours > 12) ? hours - 12 : hours}:${(minutes < 10) ? `0${minutes}` : minutes}${meridiem}`;

    console.log('Scheduling task for:', date, time);

    return true;
  }
}
