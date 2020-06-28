export class RequestError extends Error {
  /**
   * Status code of the Request error
   */
  public readonly status: number | string;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'RequestError';
  }

  /**
   * @override
   */
  public toString() {
    const obj = Object(this);
    if (obj !== this) {
      throw new TypeError();
    }

    let message = this.message;
    message = (message === undefined) ? '' : String(message);

    if (message === '') {
      return name;
    }

    return `${this.name}: [${this.status}] ${message}`;
  }
}
