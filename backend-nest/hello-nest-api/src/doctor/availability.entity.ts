import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class Availability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  day!: string; // e.g. MONDAY

  @Column()
  startTime!: string; // "09:00"

  @Column()
  endTime!: string; // "13:00"

  @ManyToOne(() => Doctor, (doctor) => doctor.availabilities, {
    onDelete: 'CASCADE',
  })
  doctor!: Doctor;
}
