import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, Req } from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';
import { AuditService } from '../audit/audit.service';

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(
    private service: DealsService,
    private events: EventsGateway,
    private audit: AuditService,
  ) {}

  @Get()
  findAll() {
    return this.service.findAllGrouped();
  }

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    const deal = await this.service.create(body);
    this.audit.log({ action: 'CREATE', entity: 'Deal', entityId: deal.id, detail: deal.title, userId: req.user?.sub, userName: req.user?.name });
    return deal;
  }

  @Patch(':id/stage')
  async updateStage(@Param('id') id: string, @Body() body: { stage: string }, @Req() req: any) {
    const deal = await this.service.updateStage(+id, body.stage);
    this.audit.log({ action: 'STAGE_CHANGE', entity: 'Deal', entityId: deal.id, detail: `${deal.title} → ${body.stage}`, userId: req.user?.sub, userName: req.user?.name });
    if (body.stage === 'CERRADO_GANADO') {
      this.events.emitEvent('deal:won', deal);
    }
    return deal;
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const deal = await this.service.remove(+id);
    this.audit.log({ action: 'DELETE', entity: 'Deal', entityId: +id, detail: deal.title, userId: req.user?.sub, userName: req.user?.name });
    return deal;
  }
}