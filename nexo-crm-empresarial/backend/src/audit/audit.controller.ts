import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard, Roles } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private service: AuditService) {}

  @Roles('ADMIN')
  @Get()
  list() {
    return this.service.list();
  }
}