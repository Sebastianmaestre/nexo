import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';
import { AuditService } from '../audit/audit.service';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private service: ClientsService,
    private events: EventsGateway,
    private audit: AuditService,
  ) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const client = await this.service.create(body);
    this.events.emitEvent('client:created', client);
    this.audit.log({ action: 'CREATE', entity: 'Client', entityId: client.id, detail: client.name, userId: req.user?.sub, userName: req.user?.name });
    return client;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    const client = await this.service.update(+id, body);
    this.audit.log({ action: 'UPDATE', entity: 'Client', entityId: client.id, detail: client.name, userId: req.user?.sub, userName: req.user?.name });
    return client;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const client = await this.service.remove(+id);
    this.audit.log({ action: 'DELETE', entity: 'Client', entityId: +id, detail: client.name, userId: req.user?.sub, userName: req.user?.name });
    return client;
  }

  @Post(':id/activities')
  addActivity(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.addActivity(+id, { ...body, userId: req.user?.sub });
  }
}