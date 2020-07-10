/* eslint-disable no-await-in-loop */
import puppeteer from 'puppeteer';
import Bluebird from 'bluebird';
import moment from 'moment-timezone';

/**
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
 * Arguments sent to our reservation jobs
 */
export interface IGoldsGymArguments {
  username: string;
  password: string;
  date: string;
  time: string;
  url: string;
}

/**
 * Entry to Gold's login
 */
const URL = 'https://www.myiclubonline.com/iclub/members/signin';

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
 * Reserve an appointment at the gym
 *
 * @param args
 * @param args.date Date in the format of MM/DD/YYYY
 * @param args.time Time in the format of HH:MM(am|pm)
 * @param args.username
 * @param args.password
 */
export default async function reserveGolds(
  args: {
    username: string;
    password: string;
    date: string;
    time: string;
  },
): Promise<string> {
  const {
    username,
    password,
    date,
    time,
  } = args;

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
    await page.goto(URL, { waitUntil: 'networkidle2' });
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
        throw Error('Could not find the right timeslot using this date');
      }
    }
    const table = await page.$(`#classesList > table:nth-child(${idx + 2})`);
    if (!table) {
      throw Error('Didnt find the right table I guess');
    }

    const classesForDate = await table.$$('tbody > tr.classes');
    const [enrollButton] = await Bluebird.filter(classesForDate, async (classForDate) => {
      // Get the time of the class from the 1st TD element
      const classTime = await classForDate.$('td:nth-child(1)');
      if (!classTime) return false;
      const innerTextHandle = await classTime.getProperty('innerText');
      const innerTextJsonValue = await innerTextHandle.jsonValue();
      const innerText = getText(innerTextJsonValue);
      if (!innerText.startsWith(bookingTime)) return false;

      // Get the type of event from the 3rd TD element
      const eventNameElement = await classForDate.$('td:nth-child(3) > a.eventName');
      if (!eventNameElement) return false;
      const eventNameHandle = await eventNameElement.getProperty('innerText');
      const eventNameJsonValue = await eventNameHandle.jsonValue();
      const eventName = getText(eventNameJsonValue);
      if (!eventName.includes('Workout')) return false;

      const enrollButtonElement = await classForDate.$('td:nth-child(2) > button.enrollEvent');
      if (!enrollButtonElement) return false;
      return true;
    });

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
    return `${bookingDate}|${bookingTime}`;
  } catch (error) {
    await browser.close();
    throw Error(error);
  }
}
