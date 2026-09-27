import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';
import { AuditService } from '../audit/audit.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private service: TasksService,
    private events: EventsGateway,
    private audit: AuditService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const task = await this.service.create({ ...body, ownerId: body.ownerId || req.user?.sub });
    this.events.emitEvent('task:created', task);
    this.audit.log({ action: 'CREATE', entity: 'Task', entityId: task.id, detail: task.title, userId: req.user?.sub, userName: req.user?.name });
    return task;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }, @Req() req: any) {
    const task = await this.service.updateStatus(+id, body.status);
    this.audit.log({ action: 'STATUS_CHANGE', entity: 'Task', entityId: task.id, detail: `${task.title} → ${body.status}`, userId: req.user?.sub, userName: req.user?.name });
    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const task = await this.service.remove(+id);
    this.audit.log({ action: 'DELETE', entity: 'Task', entityId: +id, detail: task.title, userId: req.user?.sub, userName: req.user?.name });
    return task;
  }
}