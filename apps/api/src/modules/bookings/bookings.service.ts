import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ApprovalDecision, BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { DecideBookingDto } from './dto/decide-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(params: { date?: string; month?: string }) {
    const where: any = {};

    if (params.date) {
      const day = new Date(params.date);
      const start = new Date(day);
      start.setHours(0, 0, 0, 0);
      const end = new Date(day);
      end.setHours(23, 59, 59, 999);
      where.startTime = { gte: start, lte: end };
    }

    if (params.month) {
      const [year, month] = params.month.split('-').map(Number);
      const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));
      where.startTime = { gte: start, lte: end };
    }

    return this.prisma.booking.findMany({
      where,
      include: {
        room: true,
        createdBy: true,
        approvals: true
      },
      orderBy: { startTime: 'asc' }
    });
  }

  async create(dto: CreateBookingDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (end <= start) {
      throw new BadRequestException('endTime must be greater than startTime');
    }

    const room = await this.prisma.meetingRoom.findUnique({
      where: { id: dto.roomId }
    });

    if (!room) {
      throw new NotFoundException('Meeting room not found');
    }

    if (dto.attendeeCount > room.capacity) {
      throw new BadRequestException('Attendee count exceeds room capacity');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        roomId: dto.roomId,
        status: {
          in: ['PENDING', 'APPROVED', 'CHECKED_IN']
        },
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    if (conflict) {
      throw new BadRequestException('Room is already booked for this time range');
    }

    return this.prisma.booking.create({
      data: {
        title: dto.title,
        description: dto.description,
        roomId: dto.roomId,
        createdById: dto.createdById,
        startTime: start,
        endTime: end,
        attendeeCount: dto.attendeeCount,
        requiresApproval: dto.requiresApproval ?? dto.attendeeCount > 10,
        status: dto.requiresApproval ?? dto.attendeeCount > 10 ? BookingStatus.PENDING : BookingStatus.APPROVED
      },
      include: {
        room: true,
        createdBy: true
      }
    });
  }

  async decide(id: string, dto: DecideBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { approvals: true }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const status = dto.decision === 'APPROVED' ? BookingStatus.APPROVED : BookingStatus.REJECTED;

    return this.prisma.$transaction(async (tx) => {
      await tx.approval.create({
        data: {
          bookingId: id,
          approverId: dto.approverId,
          decision: dto.decision === 'APPROVED' ? ApprovalDecision.APPROVED : ApprovalDecision.REJECTED,
          comment: dto.comment
        }
      });

      return tx.booking.update({
        where: { id },
        data: { status },
        include: { room: true, createdBy: true, approvals: true }
      });
    });
  }
}
