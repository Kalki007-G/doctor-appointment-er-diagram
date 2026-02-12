import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.specializations, {
    onDelete: 'CASCADE',
  })
  doctor!: Doctor;
}
