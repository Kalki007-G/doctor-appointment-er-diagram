import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDoctorDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
