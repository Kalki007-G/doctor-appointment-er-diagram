import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor, DoctorStatus } from './doctor.entity';
import { User, UserRole } from '../users/user.entity';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { DoctorProfile } from './doctor-profile.entity';
import {
  CreateDoctorProfileDto,
  CreateSpecializationDto,
} from './dto/create-doctor-profile.dto';
import { randomUUID } from 'crypto';
import { DoctorVerificationToken } from './doctor-verification-token.entity';
import { Specialization } from './specialization.entity';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(DoctorProfile)
    private profileRepository: Repository<DoctorProfile>,

    @InjectRepository(DoctorVerificationToken)
    private verificationRepo: Repository<DoctorVerificationToken>,

    @InjectRepository(Specialization)
    private specializationRepo: Repository<Specialization>,
  ) {}

  async registerDoctor(dto: RegisterDoctorDto) {
    const { email, name } = dto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already registered');
    }

    const user = this.userRepository.create({
      email,
      name,
      role: UserRole.DOCTOR,
    });

    await this.userRepository.save(user);

    const doctor = this.doctorRepository.create({
      user,
      status: DoctorStatus.PENDING,
    });

    await this.doctorRepository.save(doctor);

    const token = this.verificationRepo.create({
      token: randomUUID(),
      doctor,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    await this.verificationRepo.save(token);

    return {
      message: 'Doctor registered successfully',
      doctorId: doctor.id,
      status: doctor.status,
      verificationToken: token.token,
    };
  }

  async createProfile(doctorId: number, dto: CreateDoctorProfileDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const profile = this.profileRepository.create({
      doctor,
      ...dto,
    });

    return this.profileRepository.save(profile);
  }
  async verifyDoctor(token: string) {
    const record = await this.verificationRepo.findOne({
      where: { token, isUsed: false },
      relations: ['doctor'],
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired token');
    }

    record.isUsed = true;
    record.doctor.status = DoctorStatus.ACTIVE;

    await this.verificationRepo.save(record);
    await this.doctorRepository.save(record.doctor);

    return { message: 'Doctor verified successfully' };
  }
  async addSpecialization(doctorId: number, dto: CreateSpecializationDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const specialization = this.specializationRepo.create({
      name: dto.name,
      doctor,
    });

    return this.specializationRepo.save(specialization);
  }
}
