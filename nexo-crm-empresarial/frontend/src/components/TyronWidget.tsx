'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function TyronWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: 'Hola, soy Tyron. Preguntame sobre tus clientes, ventas o tareas, o pedime ayuda para redactar algo.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.assistant.chat(text, history);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Tuve un problema respondiendo. Intentá de nuevo.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, width: 56, height: 56, borderRadius: '50%',
          background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '1.4rem', cursor: 'pointer',
          zIndex: 60, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {open ? '×' : '💬'}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, width: 340, maxHeight: 460, background: 'var(--surface)',
          border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', zIndex: 60,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}>
          <div style={{ background: 'var(--ink)', color: '#fff', padding: '12px 16px' }}>
            <strong style={{ fontFamily: 'Lora, serif' }}>Tyron</strong>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9AAFA7' }}>Asistente del CRM</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'var(--accent)' : 'var(--accent-soft)',
                  color: m.role === 'user' ? '#fff' : 'var(--ink)',
                  padding: '8px 12px', borderRadius: 10, fontSize: '0.85rem', maxWidth: '85%',
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Tyron está escribiendo…</div>}
          </div>

          <div style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Preguntale algo a Tyron…"
              style={{ flex: 1, border: 'none', padding: '10px 12px', fontSize: '0.85rem' }}
            />
            <button onClick={send} className="btn" style={{ borderRadius: 0 }}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
}