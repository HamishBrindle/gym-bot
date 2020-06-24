import {
  Injectable, Inject,
} from '@nestjs/common';
import cron from 'node-cron';
import { User } from 'src/users/users.entity';
import Bluebird from 'bluebird';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsClient, JobsStatus, JobsSummary } from './jobs.client';
import { Job } from './jobs.entity';

@Injectable()
export class JobsService {
  @Inject('JOBS_CLIENT')
  private readonly jobsClient: JobsClient;

  constructor(
    @InjectRepository(Job) private readonly jobsRepository: Repository<Job>,
  ) {}

  /**
   * Get a job's status
   *
   * @param user
   * @param cronExp
   */
  public getStatus(user: User, cronExp: string): JobsStatus {
    return this.jobsClient.getStatus(user, cronExp);
  }

  /**
   * Get a job's status
   *
   * @param user
   * @param cronExp
   */
  public getSummary(user: User, cronExp: string): JobsSummary {
    return this.jobsClient.getSummary(user, cronExp);
  }

  /**
   * Validate a job
   *
   * @param cronExp
   */
  public validate(cronExp: string) {
    return this.jobsClient.validate(cronExp);
  }

  /**
   * Activate an existing, non-active `Job` (probably from DB).
   * Basically, it activates a `Job` through the `JobsClient` but
   * doesn't interact with persisted data in the database.
   *
   * @param user
   * @param cronExp
   * @param status
   * @param cb
   * @param options
   */
  public activate(
    user: User,
    cronExp: string,
    status: JobsStatus,
    cb: () => void,
    options?: cron.ScheduleOptions,
  ): JobsSummary | null {
    const jobSummary = this.jobsClient.add(user, cronExp, cb, options);
    if (!jobSummary) return null;
    return this.jobsClient.updateStatus(user, cronExp, status);
  }

  /**
   * Add a Job and persist to the database
   *
   * @param user
   * @param cronExp
   * @param cb
   * @param options
   */
  public async add(
    user: User,
    cronExp: string,
    cb: () => void,
    options?: cron.ScheduleOptions,
  ): Promise<JobsSummary | null> {
    const jobSummary = this.jobsClient.add(user, cronExp, cb, options);
    if (!jobSummary) return null;
    try {
      // See if existing job
      let job = await this.jobsRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
          expression: cronExp,
        },
      });

      // We only persist to DB if non-existent
      if (!job) {
        job = this.jobsRepository.create();
        job.user = user;
        job.expression = cronExp;
        job.status = jobSummary.status;
        await job.save();
      }
    } catch (error) {
      console.error(error);
      this.jobsClient.destroy(user, cronExp);
      return null;
    }
    return jobSummary;
  }

  /**
   * Destroy a Job and remove from the database
   *
   * @param user
   * @param cronExp
   */
  public async destroy(user: User, cronExp: string) {
    const summary = this.jobsClient.destroy(user, cronExp);
    if (summary) {
      await this.jobsRepository.delete({
        user: {
          id: user.id,
        },
        expression: cronExp,
      });
    }
    return summary;
  }

  /**
   * Update a Job and persist to the database
   *
   * @param user
   * @param cronExp
   * @param status
   */
  public async update(
    user: User,
    cronExp: string,
    status: JobsStatus,
  ): Promise<JobsSummary | null> {
    const initialStatus = this.jobsClient.getStatus(user, cronExp);
    const summary = this.jobsClient.updateStatus(user, cronExp, status);
    if (!summary) {
      throw Error('Unable to start scheduled task again 🙇‍♂️');
    }
    try {
      await this.jobsRepository.update({
        user: {
          id: user.id,
        },
        expression: cronExp,
      }, {
        status: summary.status,
      });
      return summary;
    } catch (error) {
      console.error(error);
      this.jobsClient.updateStatus(user, cronExp, initialStatus);
      return null;
    }
  }

  /**
   * Parse a job's expression and get a interactable object to
   * explore the expression's upcoming dates/times
   *
   * @param cronExp
   */
  public parseExpression(cronExp: string) {
    return this.jobsClient.parseExpression(cronExp);
  }

  /**
   * Find Jobs persisted to the database
   *
   * @param options
   */
  public async find(options?: FindManyOptions) {
    return this.jobsRepository.find(options);
  }

  /**
   * Find a Job persisted to the database
   *
   * @param options
   */
  public async findOne(options?: FindOneOptions) {
    return this.jobsRepository.findOne(options);
  }

  /**
   * Find all of the scheduled bookings
   *
   * @param user
   */
  public async findInClient(user: User) {
    const expressions = this.jobsClient.getAllExpressions(user);
    return Bluebird.mapSeries(
      expressions,
      (expression) => this.getSummary(user, expression),
    );
  }

  /**
   * Find a single scheduled booking
   *
   * @param user
   * @param cronExp
   */
  public async findOneInClient(user: User, cronExp: string) {
    return this.getSummary(user, cronExp);
  }
}
