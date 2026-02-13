import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

import {
  CreateDoctorProfileDto,
  CreateSpecializationDto,
} from './dto/create-doctor-profile.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // 🔐 Doctor Onboarding (Protected)
  @Post('onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  onboard(@Req() req: any) {
    return this.doctorService.onboardDoctor(req.user.sub);
  }

  // 🌐 Doctor Verification (Public - No JWT Required)
  @Post('verify/:token')
  async verifyDoctor(@Param('token') token: string) {
    return this.doctorService.verifyDoctor(token);
  }

  // 🔐 Create Doctor Profile (Protected)
  @Post(':id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  createProfile(@Param('id') id: number, @Body() dto: CreateDoctorProfileDto) {
    return this.doctorService.createProfile(Number(id), dto);
  }

  // 🔐 Add Specialization (Protected)
  @Post(':id/specializations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  addSpecialization(
    @Param('id') id: number,
    @Body() dto: CreateSpecializationDto,
  ) {
    return this.doctorService.addSpecialization(Number(id), dto);
  }

  // 🔐 Add Availability (Protected)
  @Post(':id/availability')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  addAvailability(@Param('id') id: number, @Body() dto: CreateAvailabilityDto) {
    return this.doctorService.addAvailability(Number(id), dto);
  }
}
