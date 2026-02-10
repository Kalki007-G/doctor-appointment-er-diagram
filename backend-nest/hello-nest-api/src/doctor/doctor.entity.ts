import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Specialization } from './specialization.entity';
import { User } from '../users/user.entity';

export enum DoctorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ACTIVE = 'ACTIVE',
}

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column({
    type: 'enum',
    enum: DoctorStatus,
    default: DoctorStatus.PENDING,
  })
  status!: DoctorStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => Specialization, (spec) => spec.doctor)
  specializations!: Specialization[];
}
