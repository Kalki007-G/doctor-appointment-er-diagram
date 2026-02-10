import { Controller, Post, Body, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import {
  CreateDoctorProfileDto,
  CreateSpecializationDto,
} from './dto/create-doctor-profile.dto';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
  async registerDoctor(@Body() dto: RegisterDoctorDto) {
    return this.doctorService.registerDoctor(dto);
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
}
