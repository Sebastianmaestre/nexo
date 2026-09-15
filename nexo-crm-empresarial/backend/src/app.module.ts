import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { DealsModule } from './deals/deals.module';
import { MeetingsModule } from './meetings/meetings.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [AuthModule, ClientsModule, DealsModule, MeetingsModule, TasksModule, DashboardModule],
})
export class AppModule {}
