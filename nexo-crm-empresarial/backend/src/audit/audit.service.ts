import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: { action: string; entity: string; entityId: number; detail?: string; userId?: number; userName?: string }) {
    return this.prisma.auditLog.create({ data: params });
  }

  async list(limit = 100) {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}