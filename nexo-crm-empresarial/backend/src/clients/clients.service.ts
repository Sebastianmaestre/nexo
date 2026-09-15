import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    return this.prisma.client.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search } },
              { company: { contains: search } },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { deals: true, meetings: true, activities: { orderBy: { createdAt: 'desc' } } },
    });
  }

  create(data: { name: string; company?: string; email?: string; phone?: string; segment?: string }) {
    return this.prisma.client.create({ data });
  }

  update(id: number, data: any) {
    return this.prisma.client.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.client.delete({ where: { id } });
  }

  addActivity(clientId: number, data: { type: string; note: string; userId?: number }) {
    return this.prisma.activity.create({ data: { ...data, clientId } });
  }
}
