import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('assistant')
export class AssistantController {
  constructor(private service: AssistantService) {}

  @Post('chat')
  chat(@Body() body: { message: string; history?: { role: string; content: string }[] }) {
    return this.service.chat(body.message, body.history || []);
  }
}
