import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5';

@Injectable()
export class AssistantService {
  constructor(private prisma: PrismaService) {}

  private async buildContext(): Promise<string> {
    const [clientsCount, pendingTasks, dealsWon, revenue] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.task.count({ where: { status: { not: 'COMPLETADA' } } }),
      this.prisma.deal.count({ where: { stage: 'CERRADO_GANADO' } }),
      this.prisma.deal.aggregate({ where: { stage: 'CERRADO_GANADO' }, _sum: { value: true } }),
    ]);
    return `Datos actuales del CRM: ${clientsCount} clientes registrados, ${pendingTasks} tareas pendientes, ${dealsWon} negocios cerrados con ingresos totales de $${revenue._sum.value || 0}.`;
  }

  async chat(message: string, history: { role: string; content: string }[] = []) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return { reply: 'Tyron no está conectado todavía (falta la API key en el servidor).' };
    }

    const context = await this.buildContext();
    const systemPrompt = `Sos Tyron, el asistente de Nexo CRM (una plataforma empresarial de IRIS). Ayudás al equipo a entender sus datos de ventas y a redactar mensajes (emails, notas de seguimiento). Respondé siempre en español, de forma breve y directa. ${context}`;

    const res = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: systemPrompt,
        messages: [...history, { role: 'user', content: message }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { reply: `Tyron tuvo un problema conectando con la IA (${res.status}). ${err.slice(0, 200)}` };
    }

    const data: any = await res.json();
    const textBlock = data.content?.find((c: any) => c.type === 'text');
    return { reply: textBlock?.text || 'No pude generar una respuesta.' };
  }
}
