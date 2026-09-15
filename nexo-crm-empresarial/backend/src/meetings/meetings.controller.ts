import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private service: MeetingsService, private events: EventsGateway) {}

  @Get()
  findByDate(@Query('date') date: string) {
    return this.service.findByDate(date || new Date().toISOString().slice(0, 10));
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const meeting = await this.service.create({ ...body, ownerId: req.user?.sub });
    this.events.emitEvent('meeting:created', meeting);
    return meeting;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
