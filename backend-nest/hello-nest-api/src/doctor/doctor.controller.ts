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

@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  onboard(@Req() req: any) {
    return this.doctorService.onboardDoctor(req.user.sub);
  }

  @Post(':id/profile')
  createProfile(@Param('id') id: number, @Body() dto: CreateDoctorProfileDto) {
    return this.doctorService.createProfile(Number(id), dto);
  }
  @Post('verify/:token')
  async verifyDoctor(@Param('token') token: string) {
    return this.doctorService.verifyDoctor(token);
  }
  @Post(':id/specializations')
  addSpecialization(
    @Param('id') id: number,
    @Body() dto: CreateSpecializationDto,
  ) {
    return this.doctorService.addSpecialization(id, dto);
  }

  @Post(':id/availability')
  addAvailability(@Param('id') id: number, @Body() dto: CreateAvailabilityDto) {
    return this.doctorService.addAvailability(Number(id), dto);
  }
}
