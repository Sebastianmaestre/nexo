import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { DealsService } from './deals.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { EventsGateway } from '../realtime/events.gateway';

@UseGuards(JwtAuthGuard)
@Controller('deals')
export class DealsController {
  constructor(private service: DealsService, private events: EventsGateway) {}

  @Get()
  findAll() {
    return this.service.findAllGrouped();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id/stage')
  async updateStage(@Param('id') id: string, @Body() body: { stage: string }) {
    const deal = await this.service.updateStage(+id, body.stage);
    if (body.stage === 'CERRADO_GANADO') {
      this.events.emitEvent('deal:won', deal);
    }
    return deal;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
