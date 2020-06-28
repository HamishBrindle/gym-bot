/* eslint-disable @typescript-eslint/no-empty-function */

type Executor<T> = (
  resolve: (value?: T | PromiseLike<T> | undefined) => void,
  reject: (reason?: any) => void
) => void;

/**
 * Lazy promise exposes it's own resolve and reject
 * callbacks to be called manually
 */
export class LazyPromise<T = any> extends Promise<T> {
  /**
   * Constructor creates a new promise and loops back it's
   * resolve/reject callbacks to it's own self to be used
   * manually
   */
  constructor(executor: Executor<T> = () => {}) {
    let res, rej;

    super((resolve, reject) => {
      res = resolve;
      rej = reject;
      return executor(resolve, reject);
    });

    if (!res || !rej) {
      throw Error('Resolve/Reject undefined');
    }

    this.resolve = res;
    this.reject = rej;
  }

  /**
   * Override `then` from Promise baseclass for use with extension
   * @param onfulfilled
   * @param onrejected
   */
  public then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ) {
    const returnValue = super.then(onfulfilled, onrejected);
    return returnValue;
  }

  /**
   * Resolve callback which can be used by passing in a value of type T
   */
  public resolve: (value?: T | PromiseLike<T>) => void;

  /**
   * Reject callback which can be used by passing in a reason for rejection
   */
  public reject: (reason?: any) => void;
}
