import { IsNotEmpty } from 'class-validator';

export class CreateAvailabilityDto {
  @IsNotEmpty()
  day!: string;

  @IsNotEmpty()
  startTime!: string;

  @IsNotEmpty()
  endTime!: string;
}
