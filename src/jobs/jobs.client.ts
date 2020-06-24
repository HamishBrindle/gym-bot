import cron from 'node-cron';
import cronParser from 'cron-parser';
import { User } from 'src/users/users.entity';
import { Injectable } from '@nestjs/common';

/**
 * JobsClient holds cron-jobs in a Redis-context
 */
@Injectable()
export class JobsClient {
  /**
   * Cron-job object
   */
  private client = cron;

  /**
   * Cron-job object
   */
  private parser = cronParser;

  /**
   * Map of jobs currently running in memory
   */
  public jobs: JobsMap = {};

  /**
   * Number of jobs that exist
   */
  public length: number = 0;

  /**
   * Create a JobsClient provider
   */
  public static createProvider() {
    return {
      provide: 'JOBS_CLIENT',
      useFactory: () => new JobsClient(),
    };
  }

  /**
   * Validate an cron-expression
   *
   * TODO: Wtf... this doesn't work
   *
   * @param cronExp
   */
  public validate(cronExp: string) {
    return this.client.validate(cronExp);
  }

  /**
   * Count the number of jobs a User has
   *
   * @param user
   */
  public count(user: User) {
    return Object.keys(this.jobs[user.id]).length;
  }

  /**
   * Schedule a new job with a cron-expression and callback
   * function
   *
   * @param user
   * @param cronExp
   * @param cb
   * @param options
   */
  public add(
    user: User,
    cronExp: string,
    cb: () => void,
    options?: cron.ScheduleOptions,
  ): JobsSummary | null {
    const existingJob = this.get(user, cronExp);
    if (existingJob) {
      throw Error('Unable to schedule another job with existing expression');
    }

    const isValid = this.validate(cronExp);
    if (!isValid) {
      throw Error(`Unable to validate the provided cron-expression: "${cronExp}"`);
    }

    try {
      /**
       * Because our validator doesn't seem to want to catch everything,
       * parse the expression before it goes in as a Job - the parser is
       * catching more issues and will throw an error
       */
      this.parseExpression(cronExp);

      if (!this.jobs[user.id]) {
        this.jobs[user.id] = {};
      }
      const job = this.client.schedule(cronExp, cb, options);
      this.jobs[user.id][cronExp] = job;
      this.length += 1;
      return this.getSummary(user, cronExp);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Remove an existing job using a cron-expression to identify it
   *
   * @param user
   * @param cronExp
   */
  public start(user: User, cronExp: string): JobsSummary | null {
    const job = this.get(user, cronExp);
    if (!job) {
      throw Error('Unable to start job because it doesn\'t exist');
    }
    try {
      job.start();
      return this.getSummary(user, cronExp);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Start an existing job
   *
   * @param user
   * @param cronExp
   */
  public stop(user: User, cronExp: string): JobsSummary | null {
    const job = this.get(user, cronExp);
    if (!job) {
      throw Error('Unable to stop job because it doesn\'t exist');
    }
    try {
      job.stop();
      return this.getSummary(user, cronExp);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Destroy an existing job
   *
   * @param user
   * @param cronExp
   */
  public destroy(user: User, cronExp: string): JobsSummary | null {
    const job = this.get(user, cronExp);
    if (!job) {
      throw Error('Unable to destroy job because it doesn\'t exist');
    }
    try {
      const summary = this.getSummary(user, cronExp);
      job.destroy();
      delete this.jobs[user.id][cronExp];
      if (Object.keys(this.jobs[user.id]).length === 0) {
        delete this.jobs[user.id];
      }
      this.length -= 1;
      summary.status = 'destroyed';
      return summary;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Return a cron-job using the cron-expression used to create it
   *
   * @param user
   * @param cronExp
   */
  public get(user: User, cronExp: string): cron.ScheduledTask | undefined {
    return this.jobs[user.id]?.[cronExp];
  }

  /**
   * Get all of the existing jobs' cron-expressions
   *
   * @param user
   */
  public getAllExpressions(user: User): string[] {
    if (!this.jobs[user.id]) {
      return [];
    }
    return Object.keys(this.jobs[user.id]);
  }

  /**
   * Providing a status, get a User's job and start/stop it
   *
   * @param user
   * @param cronExp
   * @param status
   */
  public updateStatus(user: User, cronExp: string, status: JobsStatus) {
    const job = this.get(user, cronExp);
    if (!job) throw Error('Cannot update status of non-existent job');
    switch (status) {
      case 'scheduled': {
        job.start();
        break;
      }
      case 'stopped': {
        job.stop();
        break;
      }
      default: {
        throw Error(`Unknown/unsupported status provided to update: ${status}`);
      }
    }
    return this.getSummary(user, cronExp);
  }

  /**
   * Get a job's status
   *
   * @param user
   * @param cronExp
   */
  public getStatus(user: User, cronExp: string): JobsStatus {
    const job = this.get(user, cronExp);
    if (!job) {
      throw Error('Unable to get status of job because it doesn\'t exist');
    }
    const status = job.getStatus();

    // There's a typo in the `node-cron` library lol
    return (status === 'stoped') ? 'stopped' : status as JobsStatus;
  }

  /**
   * Get a job's status
   *
   * @param user
   * @param cronExp
   */
  public getSummary(user: User, cronExp: string): JobsSummary {
    const parsed = this.parseExpression(cronExp);
    return {
      status: this.getStatus(user, cronExp),
      expression: cronExp,
      hasNext: parsed.hasNext(),
      hasPrevious: parsed.hasPrev(),
      next: parsed.next().toString(),
      previous: parsed.prev().toString(),
    };
  }

  /**
   * Parse a cron-expression and return an iterable CronExpression
   * object
   *
   * @param cronExp
   */
  public parseExpression(cronExp: string) {
    return this.parser.parseExpression(cronExp);
  }
}

/**
 * Jobs map
 */
export type JobsMap = {
  [userId: string]: {
    [cronExp: string]: cron.ScheduledTask,
  }
};

/**
 * All of the status' a job can have at any given time
 */
export type JobsStatus = 'stopped' | 'destroyed' | 'running' | 'scheduled' | 'failed';

export type JobsSummary = {
  /**
   * Current status of the job
   */
  status: JobsStatus;
  /**
   * Cron-job expression string
   */
  expression: string;
  /**
   * Expression as a `next` execution scheduled
   */
  hasNext: boolean;
  /**
   * Expression as a `previous` execution scheduled
   */
  hasPrevious: boolean;
  /**
   * Next scheduled execution date
   */
  next: string;
  /**
   * Previous scheduled execution date
   */
  previous: string;
};
