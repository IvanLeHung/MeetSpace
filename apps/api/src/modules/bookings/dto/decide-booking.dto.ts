import { IsIn, IsOptional, IsString } from 'class-validator';

export class DecideBookingDto {
  @IsString()
  approverId!: string;

  @IsIn(['APPROVED', 'REJECTED'])
  decision!: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  comment?: string;
}
