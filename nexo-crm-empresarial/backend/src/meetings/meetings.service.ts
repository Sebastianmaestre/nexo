import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];

@Injectable()
export class MeetingsService {
  constructor(private prisma: PrismaService) {}

  async findByDate(date: string) {
    const meetings = await this.prisma.meeting.findMany({
      where: { date },
      include: { client: true, owner: true },
    });
    const byTime: Record<string, any> = {};
    meetings.forEach((m) => (byTime[m.time] = m));
    return SLOTS.map((time) => ({ time, meeting: byTime[time] || null }));
  }

  create(data: { date: string; time: string; note?: string; clientId: number; ownerId?: number }) {
    return this.prisma.meeting.create({ data });
  }

  remove(id: number) {
    return this.prisma.meeting.delete({ where: { id } });
  }
}
