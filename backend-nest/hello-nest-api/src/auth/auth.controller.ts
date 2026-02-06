import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('google')
  async googleAuth(@Body() body: { idToken: string; role: UserRole }) {
    const token = await this.authService.googleLogin(body.idToken, body.role);

    return {
      accessToken: token,
    };
  }
}
