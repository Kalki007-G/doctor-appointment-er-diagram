import { IsEmail, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  name!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
