import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { User } from '../users/user.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { DoctorVerificationToken } from './doctor-verification-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Doctor,
      User,
      DoctorProfile,
      DoctorVerificationToken,
    ]),
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
})
export class DoctorModule {}
