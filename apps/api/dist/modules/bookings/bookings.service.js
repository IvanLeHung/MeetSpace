"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(params) {
        const where = {};
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
    async create(dto) {
        const start = new Date(dto.startTime);
        const end = new Date(dto.endTime);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (end <= start) {
            throw new common_1.BadRequestException('endTime must be greater than startTime');
        }
        const room = await this.prisma.meetingRoom.findUnique({
            where: { id: dto.roomId }
        });
        if (!room) {
            throw new common_1.NotFoundException('Meeting room not found');
        }
        if (dto.attendeeCount > room.capacity) {
            throw new common_1.BadRequestException('Attendee count exceeds room capacity');
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
            throw new common_1.BadRequestException('Room is already booked for this time range');
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
                status: dto.requiresApproval ?? dto.attendeeCount > 10 ? client_1.BookingStatus.PENDING : client_1.BookingStatus.APPROVED
            },
            include: {
                room: true,
                createdBy: true
            }
        });
    }
    async decide(id, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: { approvals: true }
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        const status = dto.decision === 'APPROVED' ? client_1.BookingStatus.APPROVED : client_1.BookingStatus.REJECTED;
        return this.prisma.$transaction(async (tx) => {
            await tx.approval.create({
                data: {
                    bookingId: id,
                    approverId: dto.approverId,
                    decision: dto.decision === 'APPROVED' ? client_1.ApprovalDecision.APPROVED : client_1.ApprovalDecision.REJECTED,
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
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
