import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsNotEmpty()
  specialization!: string;

  @IsNumber()
  experience!: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
