import { InstanceOf } from '@/lib/types';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

const BASE_STYLES = `
  color: white;
  font-weight: 800;
  padding: 2px 5px 2px 5px;
`;

const PREFIX_STYLE = `
  ${BASE_STYLES}
  background: #0C4767;
  border-radius: 50px 0 0 50px
`;

const CLEAR_STYLE = `
  background: transparent;
  background-image: none;
  font-weight: 400;
`;

const INFO_STYLE = `
  ${BASE_STYLES}
  background-image: linear-gradient(19deg, #FBDA61 0%, #FF5ACD 100%);
  border-radius: 0 50px 50px 0;
`;

const EVENT_STYLE = `
  ${BASE_STYLES}
  background-color: #08AEEA;
  background-image: linear-gradient(19deg, #08AEEA 0%, #2AF598 100%);
  border-radius: 0 50px 50px 0;
`;

const REQ_STYLE = `
  ${BASE_STYLES}
  background: rgb(0,134,255);
  background: linear-gradient(90deg, rgba(0,134,255,1) 0%, rgba(48,0,224,1) 100%);
  border-radius: 0 50px 50px 0;
`;

const RES_STYLE = `
  ${BASE_STYLES}
  background: rgb(120,0,218);
  background: linear-gradient(90deg, rgba(120,0,218,1) 0%, rgba(102,37,83,1) 100%);
  border-radius: 0 50px 50px 0;
`;

const WARN_STYLE = `
  ${BASE_STYLES}
  color: #B7972F;
  background-color: #FBDA61;
  background-image: linear-gradient(19deg, #FFF052 0%, #EDD892 100%);
  border-radius: 0 50px 50px 0;
`;

const ERROR_STYLE = `
  ${BASE_STYLES}
  color: #FFBCBC;
  background-color: #FBDA61;
  background-image: linear-gradient(19deg, #E64055 0%, #BC1900 100%);
  border-radius: 0 50px 50px 0;
`;

const SILLY_STYLE = `
  ${BASE_STYLES}
  background: linear-gradient(90deg, rgba(71,251,182,1) 0%, rgba(29,71,253,1) 50%, rgba(252,69,94,1) 100%);
  border-radius: 0 50px 50px 0;
`;

const SILLY_STYLE_BODY = `
  ${CLEAR_STYLE}
  font-weight: bold;
  font-size: 50px;
  color: #62fb47;
  padding: 0 20px 20px 0;
  text-shadow:
    3px 3px 0 rgb(64,215,183),
    6px 6px 0 rgb(47,146,217),
    9px 9px 0 rgb(29,71,253),
    12px 12px 0 rgb(136,70,222),
    15px 15px 0 rgb(252,69,189),
    18px 18px 0 rgb(252,69,94);
`;

const DEBUG = (process.env.VUE_APP_ENV !== 'production');

/**
 * Basic Logger
 */
export class Logger {

  /**
   * Debug flag turns logging on/off
   */
  private debug: boolean;

  /**
   * Prefix used in logging
   */
  private readonly prefix: string

  constructor(debug: boolean, prefix?: string) {
    this.debug = debug;
    this.prefix = prefix ?? 'Dash';
  }

  /**
   * Stringify with respect to formatting.
   *
   * @param {any} input
   * @returns {string} Output
   */
  private stringify(input: any) {
    if (input instanceof Error) {
      const obj = {
        ...input,
        name: input.name,
        message: input.message,
      };
      return JSON.stringify(obj, null, 2);
    }

    if (typeof input === 'string') {
      return input;
    }

    return JSON.stringify(input, null, 2);
  }

  /**
   * Vue entry point
   *
   * @param {object} Vue
   */
  public static install(Vue: InstanceOf<Vue>) {
    Vue.prototype.$logger = this;
  }

  /**
   * Silly
   *
   * @param input
   */
  public silly(input: any) {
    if (!this.debug) {
      return;
    }
    window.console.info(
      `%c${this.prefix}%cSilly%c ${this.stringify(input)}%c`,
      PREFIX_STYLE,
      SILLY_STYLE,
      SILLY_STYLE_BODY,
      CLEAR_STYLE,
    );
  }

  /**
   * Info
   *
   * @param input
   */
  public info(input: any) {
    if (!this.debug) {
      return;
    }
    window.console.info(
      `%c${this.prefix}%cInfo%c ${this.stringify(input)}`,
      PREFIX_STYLE,
      INFO_STYLE,
      CLEAR_STYLE,
    );
  }

  /**
   * Error
   *
   * @param input
   */
  public error(input: any) {
    if (!this.debug) {
      return;
    }
    window.console.error(
      `%c${this.prefix}%cError%c ${this.stringify(input)}`,
      PREFIX_STYLE,
      ERROR_STYLE,
      CLEAR_STYLE,
    );
  }

  /**
   * Warning
   *
   * @param input
   */
  public warn(input: any) {
    if (!this.debug) {
      return;
    }
    window.console.warn(
      `%c${this.prefix}%cWarning%c ${this.stringify(input)}`,
      PREFIX_STYLE,
      WARN_STYLE,
      CLEAR_STYLE,
    );
  }

  /**
   * Event
   *
   * @param input
   */
  public event(input: any) {
    if (!this.debug) {
      return;
    }
    window.console.info(
      `%c${this.prefix}%cEvent%c ${this.stringify(input)}`,
      PREFIX_STYLE,
      EVENT_STYLE,
      CLEAR_STYLE,
    );
  }

  /**
   * Request
   */
  public request(config: AxiosRequestConfig) {
    if (!this.debug) {
      return;
    }
    window.console.groupCollapsed(
      `%c${this.prefix}%cRequest%c ${config.method} %c: ${config.url}`,
      PREFIX_STYLE,
      REQ_STYLE,
      'font-weight: bold;',
      CLEAR_STYLE,
    );
    window.console.info(config);
    window.console.groupEnd();
  }

  /**
   * Response
   */
  public response(response: AxiosResponse<any>) {
    if (!this.debug) {
      return;
    }
    window.console.groupCollapsed(
      `%c${this.prefix}%cResponse%c ${response.config.method?.toLocaleUpperCase()} %c: ${response.config.url}`,
      PREFIX_STYLE,
      RES_STYLE,
      'font-weight: bold;',
      CLEAR_STYLE,
    );
    window.console.info({
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    window.console.groupEnd();
  }
}

export default new Logger(DEBUG);
