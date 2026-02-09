import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsNotEmpty()
  specialization!: string;

  @IsNumber()
  experience!: number;

  @IsNumber()
  consultationFee!: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
