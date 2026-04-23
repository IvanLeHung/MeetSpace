import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' }
    });
  }
}
