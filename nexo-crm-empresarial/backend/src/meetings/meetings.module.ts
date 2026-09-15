import { Module } from '@nestjs/common';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { PrismaService } from '../common/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from '../realtime/events.gateway';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET || 'iris-crm-secret' })],
  controllers: [MeetingsController],
  providers: [MeetingsService, PrismaService, EventsGateway],
})
export class MeetingsModule {}
