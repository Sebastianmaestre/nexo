import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Req } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private service: ClientsService, private events: EventsGateway) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  async create(@Body() body: any) {
    const client = await this.service.create(body);
    this.events.emitEvent('client:created', client);
    return client;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Post(':id/activities')
  addActivity(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.service.addActivity(+id, { ...body, userId: req.user?.sub });
  }
}
