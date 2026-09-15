import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const today = new Date().toISOString().slice(0, 10);
    const [clientsCount, meetingsToday, dealsWon, dealsByStage, pendingTasks] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.meeting.count({ where: { date: today } }),
      this.prisma.deal.count({ where: { stage: 'CERRADO_GANADO' } }),
      this.prisma.deal.groupBy({ by: ['stage'], _count: true, _sum: { value: true } }),
      this.prisma.task.count({ where: { status: { not: 'COMPLETADA' } } }),
    ]);

    const revenue = await this.prisma.deal.aggregate({
      where: { stage: 'CERRADO_GANADO' },
      _sum: { value: true },
    });

    return {
      clientsCount,
      meetingsToday,
      dealsWon,
      pendingTasks,
      revenue: revenue._sum.value || 0,
      pipelineByStage: dealsByStage,
    };
  }
}
