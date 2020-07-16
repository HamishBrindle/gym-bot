import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import Bluebird from 'bluebird';
import moment from 'moment-timezone';
import { LoggerService } from 'src/logger/logger.service';

/**
 * Get text from DOM element
 *
 * @param linkText
 */
function getText(linkText: any) {
  linkText = linkText.replace(/\r\n|\r/g, '\n');
  // eslint-disable-next-line no-useless-escape
  linkText = linkText.replace(/\ +/g, ' ');

  // Replace &nbsp; with a space
  const nbspPattern = new RegExp(String.fromCharCode(160), 'g');
  return linkText.replace(nbspPattern, ' ');
}

/**
 * Search for specific date string in DOM element
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

@Injectable()
export class GoldsService {
  constructor(
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext('GoldsService');
  }

  /**
   * Entry to Gold's login
   */
  private readonly url = 'https://www.myiclubonline.com/iclub/members/signin';

  /**
   * Reserve an appointment at the gym
   *
   * @param args
   * @param args.time Time in the format of HH:MM(am|pm)
   * @param args.username
   * @param args.password
   * @param args.tz
   */
  public async reserve(
    args: {
      username: string;
      password: string;
      time: string;
      tz: string,
    },
  ): Promise<void> {
    const {
      username,
      password,
      time,
      tz,
    } = args;

    this.logger.log(`Reservation parameters: ${JSON.stringify(args)}`);

    const bookingDate = moment()
      .utc()
      .add(72, 'hours')
      .tz(tz)
      .format('MM/DD/YYYY');

    const bookingTime = moment(time, 'H:mm:ss').format('h:mma');

    this.logger.log(`🙏 Attempting to make reservation on ${bookingDate} at ${bookingTime}`);

    // Initialize headless browser
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on('request', (req: any) => {
        if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font'
              || req.resourceType() === 'image') {
          req.abort();
        } else {
          req.continue();
        }
      });
      await page.goto(this.url, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#signIn');
      await page.type('#username', username, { delay: 10 });
      await page.type('#password', password, { delay: 10 });
      await Promise.all([
        page.waitForNavigation(),
        page.click('#signIn', { delay: 5 }),
      ]);
      await page.waitForSelector('#nav-classes > a');
      await Promise.all([
        page.waitForNavigation(),
        page.click('#nav-classes > a', { delay: 5 }),
      ]);
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
          throw Error(`Could not find timeslots on this date: ${bookingDate}`);
        }
      }
      const table = await page.$(`#classesList > table:nth-child(${idx + 2})`);
      if (!table) {
        throw Error('Didnt find the right table I guess');
      }

      const classesForDate = await table.$$('tbody > tr.classes');

      const [selectedRow] = await Bluebird.filter(classesForDate, async (classForDate) => {
      // Get the time of the class from the 1st TD element
        const classTime = await classForDate.$('td:nth-child(1)');
        if (!classTime) return false;
        const innerTextHandle = await classTime.getProperty('innerText');
        const innerTextJsonValue = await innerTextHandle.jsonValue();
        const innerText = getText(innerTextJsonValue);

        if (!innerText.startsWith(bookingTime)) return false;

        this.logger.debug(`Found class time of ${innerText}!`);

        // Get the type of event from the 3rd TD element
        const eventNameElement = await classForDate.$('td:nth-child(3) > a.eventName');
        if (!eventNameElement) return false;
        const eventNameHandle = await eventNameElement.getProperty('innerText');
        const eventNameJsonValue = await eventNameHandle.jsonValue();
        const eventName = getText(eventNameJsonValue);
        if (!eventName.includes('Workout')) return false;

        this.logger.debug(`Found class type of "${eventName}"!`);

        const enrollButtonElement = await classForDate.$('td.noprint.enrolledFull > button');

        if (!enrollButtonElement) return false;

        this.logger.debug('Found enroll button!');

        return true;
      });

      if (!selectedRow) {
        throw Error('Unable to find the enroll button for this class');
      }

      await selectedRow.evaluate((el) => el.querySelector<HTMLElement>('td.noprint.enrolledFull > button')?.click());
      await page.waitForSelector('body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-dialog-buttons', {
        timeout: 10000,
      });

      const agreeInputSelector = '#agreeToTerms';
      const agreeInput = await page.$(agreeInputSelector);
      if (!agreeInput) {
        throw Error('Unable to find input field for "Agree to Terms"');
      }

      // @ts-ignore
      await page.$eval(agreeInputSelector, (el) => el.click());

      // @ts-ignore
      const isChecked = await agreeInput.evaluate((el) => el.checked);
      if (!isChecked) throw Error('Unable to click checkbox before submitting');

      const scheduleEventDialogButtonSelector = 'body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-dialog-buttons > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button.calltoaction';
      const scheduleEventDialogButton = await page.$(scheduleEventDialogButtonSelector);
      if (!scheduleEventDialogButton) {
        throw Error('Unable to find submit button for agreeing to terms');
      }

      await page.waitFor(1000);

      // @ts-ignore
      await page.$eval(scheduleEventDialogButtonSelector, (el) => el.click());

      const confirmationSelector = '#content > div > div.large > strong';
      await page.waitForSelector(confirmationSelector);
      const confirmation = await page.$eval(
        confirmationSelector,
        (el) => el.innerHTML.toLocaleLowerCase(),
      );

      if (!confirmation.includes('thank you')) throw Error('Unable to get confirmation message');

      await browser.close();

      this.logger.log(`🎉🎊 Successfully booked Gold's Gym appointment on ${bookingDate} at ${bookingTime}`);
    } catch (error) {
      await browser.close();
      throw Error(error);
    }
  }
}

/**
 * Arguments sent to our reservation jobs
 */
export interface IGoldsGymArguments {
  username: string;
  password: string;
  date: string;
  time: string;
  url: string;
  tz: string;
}
