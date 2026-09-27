import { Module } from '@nestjs/common';
import { DealsController } from './deals.controller';
import { DealsService } from './deals.service';
import { PrismaService } from '../common/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from '../realtime/events.gateway';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'iris-crm-secret' }),
    AuditModule,
  ],
  controllers: [DealsController],
  providers: [DealsService, PrismaService, EventsGateway],
})
export class DealsModule {}