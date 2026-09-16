import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { reply: 'Tyron no está conectado todavía (falta la API key en el servidor).' };
    }

    const context = await this.buildContext();
    const systemPrompt = `Sos Tyron, el asistente de Nexo CRM (una plataforma empresarial de IRIS). Ayudás al equipo a entender sus datos de ventas y a redactar mensajes (emails, notas de seguimiento). Respondé siempre en español, de forma breve y directa. ${context}`;

    const contents = [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { reply: `Tyron tuvo un problema conectando con la IA (${res.status}). ${err.slice(0, 200)}` };
    }

    const data: any = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return { reply: text || 'No pude generar una respuesta.' };
  }
}
