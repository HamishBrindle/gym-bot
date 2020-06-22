import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Account } from 'src/accounts/accounts.entity';
import { Job } from 'src/jobs/jobs.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
    length: 64,
  })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToOne(() => Account, (account: Account) => account.user, {
    eager: true,
  })
  account: Account;

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
