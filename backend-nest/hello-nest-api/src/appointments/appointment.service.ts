import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { Doctor } from '../doctor/doctor.entity';
import { Patient } from '../patient/patient.entity';
import { Availability } from '../doctor/availability.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,

    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(Availability)
    private availabilityRepo: Repository<Availability>,
  ) {}

  async bookAppointment(userId: number, dto: CreateAppointmentDto) {
    // 1️⃣ Find patient by userId
    const patient = await this.patientRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    // 2️⃣ Find doctor
    const doctor = await this.doctorRepo.findOne({
      where: { id: dto.doctorId },
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    // 3️⃣ Extract weekday from date
    const dateObj = new Date(dto.date);
    const weekday = dateObj
      .toLocaleString('en-US', {
        weekday: 'long',
      })
      .toUpperCase(); // e.g. MONDAY

    // 4️⃣ Check doctor availability for that day
    const availability = await this.availabilityRepo.findOne({
      where: {
        doctor: { id: doctor.id },
        day: weekday,
      },
      relations: ['doctor'],
    });

    if (!availability) {
      throw new BadRequestException('Doctor is not available on selected day');
    }

    // 5️⃣ Validate time within availability
    if (
      dto.startTime < availability.startTime ||
      dto.endTime > availability.endTime
    ) {
      throw new BadRequestException(
        'Selected time is outside doctor availability',
      );
    }

    // 6️⃣ Prevent double booking
    const existingAppointment = await this.appointmentRepo.findOne({
      where: {
        doctor: { id: doctor.id },
        date: dto.date,
        status: Not(AppointmentStatus.CANCELLED),
      },
      relations: ['doctor'],
    });

    if (
      existingAppointment &&
      !(
        dto.endTime <= existingAppointment.startTime ||
        dto.startTime >= existingAppointment.endTime
      )
    ) {
      throw new BadRequestException('Time slot already booked');
    }

    // 7️⃣ Create appointment
    const appointment = this.appointmentRepo.create({
      doctor,
      patient,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: AppointmentStatus.PENDING,
    });

    await this.appointmentRepo.save(appointment);

    return {
      message: 'Appointment booked successfully',
      status: appointment.status,
    };
  }
  async getMyAppointments(userId: number) {
    const patient = await this.patientRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    return this.appointmentRepo.find({
      where: { patient: { id: patient.id } },
      relations: ['doctor'],
      order: { date: 'ASC' },
    });
  }
  async cancelAppointment(userId: number, appointmentId: number) {
    const patient = await this.patientRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!patient) {
      throw new BadRequestException('Patient not found');
    }

    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.patient.id !== patient.id) {
      throw new BadRequestException(
        'You are not allowed to cancel this appointment',
      );
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment already cancelled');
    }

    appointment.status = AppointmentStatus.CANCELLED;

    await this.appointmentRepo.save(appointment);

    return { message: 'Appointment cancelled successfully' };
  }
  async getDoctorAppointments(userId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    return this.appointmentRepo.find({
      where: { doctor: { id: doctor.id } },
      relations: ['patient'],
      order: { date: 'ASC' },
    });
  }
  async confirmAppointment(userId: number, appointmentId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.doctor.id !== doctor.id) {
      throw new BadRequestException('Not allowed');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Cannot confirm cancelled appointment');
    }

    appointment.status = AppointmentStatus.CONFIRMED;

    await this.appointmentRepo.save(appointment);

    return { message: 'Appointment confirmed successfully' };
  }

  async doctorCancelAppointment(userId: number, appointmentId: number) {
    const doctor = await this.doctorRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!doctor) {
      throw new BadRequestException('Doctor not found');
    }

    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new BadRequestException('Appointment not found');
    }

    if (appointment.doctor.id !== doctor.id) {
      throw new BadRequestException('Not allowed');
    }

    appointment.status = AppointmentStatus.CANCELLED;

    await this.appointmentRepo.save(appointment);

    // Simulated notification
    console.log(
      `Notification: Appointment ${appointment.id} cancelled by doctor`,
    );

    return { message: 'Appointment cancelled by doctor' };
  }
}
