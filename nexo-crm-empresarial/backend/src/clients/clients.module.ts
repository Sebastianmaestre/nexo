import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from '../common/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from '../realtime/events.gateway';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET || 'iris-crm-secret' }),
  ],
  controllers: [ClientsController],
  providers: [ClientsService, PrismaService, EventsGateway],
})
export class ClientsModule {}
