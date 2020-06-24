import { Injectable, Inject } from '@nestjs/common';
import cron from 'node-cron';
import { User } from 'src/users/users.entity';
import Bluebird from 'bluebird';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobsClient, JobsStatus, JobsSummary } from './jobs.client';
import { Job } from './jobs.entity';

@Injectable()
export class JobsService {
  @Inject('JOBS_CLIENT')
  private readonly jobsClient: JobsClient;

  constructor(
    @InjectRepository(Job)
    private readonly jobsRepository: Repository<Job>,
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
   * Add a job
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
  ) {
    const job = this.jobsRepository.create();
    const jobSummary = this.jobsClient.add(user, cronExp, cb, options);
    if (!jobSummary) return null;
    try {
      job.user = user;
      job.expression = cronExp;
      job.status = jobSummary.status;
      await job.save();
    } catch (error) {
      console.error(error);
      this.jobsClient.destroy(user, cronExp);
    }
    return jobSummary;
  }

  /**
   * Destroy a job
   *
   * @param user
   * @param cronExp
   */
  public async destroy(user: User, cronExp: string) {
    const success = this.jobsClient.destroy(user, cronExp);
    if (success) {
      await this.jobsRepository.delete({
        user: {
          id: user.id,
        },
        expression: cronExp,
      });
    }
    return success;
  }

  /**
   * Remove a job
   *
   * @param user
   * @param cronExp
   */
  public start(user: User, cronExp: string): boolean {
    return this.jobsClient.start(user, cronExp);
  }

  /**
   * Remove a job
   *
   * @param user
   * @param cronExp
   */
  public stop(user: User, cronExp: string): boolean {
    return this.jobsClient.stop(user, cronExp);
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
   * Find all of the scheduled bookings
   *
   * @param user
   */
  async find(user: User) {
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
  async findOne(user: User, cronExp: string) {
    return this.getSummary(user, cronExp);
  }
}
