import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  roomId!: string;

  @IsString()
  createdById!: string;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsInt()
  @Min(1)
  attendeeCount!: number;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}
