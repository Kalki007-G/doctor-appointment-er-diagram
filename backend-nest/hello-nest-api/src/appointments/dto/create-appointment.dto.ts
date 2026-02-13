import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  doctorId!: number;

  @IsString()
  @IsNotEmpty()
  date!: string; // "2026-02-20"

  @IsString()
  @IsNotEmpty()
  startTime!: string; // "10:00"

  @IsString()
  @IsNotEmpty()
  endTime!: string; // "10:30"
}
