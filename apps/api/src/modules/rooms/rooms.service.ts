import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRooms() {
    const rooms = await this.prisma.meetingRoom.findMany({
      include: { amenities: true },
      orderBy: { name: 'asc' }
    });

    return rooms.map((room) => ({
      ...room,
      amenities: room.amenities.map((a) => a.name)
    }));
  }
}
