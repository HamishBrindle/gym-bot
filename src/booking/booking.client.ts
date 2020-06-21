import puppeteer from 'puppeteer';
import Bluebird from 'bluebird';
import moment from 'moment-timezone';
import { Injectable } from '@nestjs/common';

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
 * BookingClient is responsible for interacting with the actual website
 * and making the reservations through Puppeteer
 */
@Injectable()
export class BookingClient {
  private readonly url = 'https://www.myiclubonline.com/iclub/members/signin';

  /**
   * Create a BookingClient provider
   */
  public static createProvider() {
    return {
      provide: 'BOOKING_CLIENT',
      useFactory: () => new BookingClient(),
    };
  }

  /**
   * Reserve an appointment at the gym by providing date and time
   *
   * @param date Date in the format of MM/DD/YYYY
   * @param time Time in the format of HH:MM(am|pm)
   */
  public async reserve(date: string, time: string): Promise<string> {
    if (!this.url) throw Error('Cannot reserve without a properly defined URL');

    // TODO: Move all this info out into the DB for a User
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
}
