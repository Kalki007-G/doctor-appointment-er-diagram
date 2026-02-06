import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: this.configService.get('GOOGLE_CLIENT_ID'),
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error('Invalid Google token');
    }

    return payload;
  }

  async googleLogin(idToken: string, role: UserRole) {
    const payload = await this.verifyGoogleToken(idToken);

    let user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        role,
      });

      await this.userRepository.save(user);
    }

    return this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
