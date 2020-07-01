import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

export type MetadataEntity = 'account' | 'user' | 'booking';
export const MetadataEntity = ['account', 'user', 'booking'];

@Entity()
@Unique(['entity', 'recordId', 'field'])
export class Metadata extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column()
  entity: MetadataEntity;

  @Column()
  recordId: string;

  @Column()
  field: string;

  @Column()
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
