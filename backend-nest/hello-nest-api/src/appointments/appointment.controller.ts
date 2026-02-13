import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  book(@Req() req: any, @Body() dto: CreateAppointmentDto) {
    return this.appointmentService.bookAppointment(req.user.sub, dto);
  }
  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  getMy(@Req() req: any) {
    return this.appointmentService.getMyAppointments(req.user.sub);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PATIENT)
  cancel(@Req() req: any, @Param('id') id: number) {
    return this.appointmentService.cancelAppointment(req.user.sub, Number(id));
  }

  @Get('doctor')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  getDoctorAppointments(@Req() req: any) {
    return this.appointmentService.getDoctorAppointments(req.user.sub);
  }

  @Patch(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  confirm(@Req() req: any, @Param('id') id: number) {
    return this.appointmentService.confirmAppointment(req.user.sub, Number(id));
  }

  @Patch(':id/doctor-cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.DOCTOR)
  doctorCancel(@Req() req: any, @Param('id') id: number) {
    return this.appointmentService.doctorCancelAppointment(
      req.user.sub,
      Number(id),
    );
  }
}
