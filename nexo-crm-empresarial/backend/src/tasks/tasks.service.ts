import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany({
      include: { owner: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  create(data: { title: string; dueDate?: string; ownerId?: number }) {
    return this.prisma.task.create({ data });
  }

  updateStatus(id: number, status: string) {
    return this.prisma.task.update({ where: { id }, data: { status: status as any } });
  }

  remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
