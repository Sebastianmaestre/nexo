import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const STAGES = ['PROSPECTO', 'CONTACTADO', 'PROPUESTA', 'CERRADO_GANADO', 'CERRADO_PERDIDO'];

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async findAllGrouped() {
    const deals = await this.prisma.deal.findMany({
      include: { client: true },
      orderBy: { updatedAt: 'desc' },
    });
    const grouped: Record<string, any[]> = {};
    STAGES.forEach((s) => (grouped[s] = []));
    deals.forEach((d) => grouped[d.stage].push(d));
    return grouped;
  }

  create(data: { title: string; value: number; clientId: number; stage?: string }) {
    return this.prisma.deal.create({ data: data as any });
  }

  updateStage(id: number, stage: string) {
    return this.prisma.deal.update({ where: { id }, data: { stage: stage as any } });
  }

  remove(id: number) {
    return this.prisma.deal.delete({ where: { id } });
  }
}
