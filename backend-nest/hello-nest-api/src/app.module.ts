import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Doctor } from './doctor/doctor.entity';
import { User } from './users/user.entity';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorProfile } from './doctor/doctor-profile.entity';
import { DoctorVerificationToken } from './doctor/doctor-verification-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Doctor, DoctorProfile, DoctorVerificationToken],
        synchronize: true,
      }),
    }),

    DoctorModule,
  ],
})
export class AppModule {}
