import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsNumber()
  experience!: number;

  @IsOptional()
  @IsString()
  bio?: string;
}
export class CreateSpecializationDto {
  @IsNotEmpty()
  name!: string;
}
