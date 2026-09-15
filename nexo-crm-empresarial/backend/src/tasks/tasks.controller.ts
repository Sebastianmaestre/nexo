import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private service: TasksService, private events: EventsGateway) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const task = await this.service.create({ ...body, ownerId: body.ownerId || req.user?.sub });
    this.events.emitEvent('task:created', task);
    return task;
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.service.updateStatus(+id, body.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
