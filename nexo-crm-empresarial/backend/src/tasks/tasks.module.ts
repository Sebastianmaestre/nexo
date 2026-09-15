import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../common/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from '../realtime/events.gateway';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'iris-crm-secret' })],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, EventsGateway],
})
export class TasksModule {}
