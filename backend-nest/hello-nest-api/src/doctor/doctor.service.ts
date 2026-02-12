import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor, DoctorStatus } from './doctor.entity';
import { User, UserRole } from '../users/user.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { Availability } from './availability.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';

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

    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  async onboardDoctor(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user.role !== UserRole.DOCTOR) {
      throw new BadRequestException('Only doctors can onboard');
    }

    const existingDoctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (existingDoctor) {
      throw new BadRequestException('Doctor already onboarded');
    }

    const doctor = this.doctorRepository.create({
      user,
      status: DoctorStatus.PENDING,
    });

    await this.doctorRepository.save(doctor);

    const token = this.verificationRepo.create({
      token: randomUUID(),
      doctor,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.verificationRepo.save(token);

    return {
      message: 'Doctor onboarded successfully',
      doctorId: doctor.id,
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
  async addAvailability(doctorId: number, dto: CreateAvailabilityDto) {
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const availability = this.availabilityRepository.create({
      doctor,
      ...dto,
    });

    return this.availabilityRepository.save(availability);
  }
}
