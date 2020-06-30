import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { JobsStatus } from './jobs.client';

@Entity()
@Unique(['expression', 'user'])
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  /**
   * When the job runs
   */
  @Column()
  expression: string;

  /**
   * What date the job is looking for
   */
  @Column()
  date: string;

  /**
   * What time the job is looking for
   */
  @Column()
  time: string;

  /**
   * Saved status of the job
   */
  @Column()
  status: JobsStatus;

  @ManyToOne(() => User, (user) => user.jobs)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
