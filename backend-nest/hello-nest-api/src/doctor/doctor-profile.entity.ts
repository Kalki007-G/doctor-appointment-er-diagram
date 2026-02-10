import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class DoctorProfile {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn()
  doctor!: Doctor;

  @Column()
  specialization!: string;

  @Column()
  experience!: number;

  @Column({ nullable: true })
  bio?: string;
}
