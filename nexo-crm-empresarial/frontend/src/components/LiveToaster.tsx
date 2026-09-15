'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';

export default function LiveToaster() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ['websocket'] });
    socket.on('client:created', (c: any) => setMessage(`Nuevo cliente: ${c.name}`));
    socket.on('deal:won', (d: any) => setMessage(`Negocio cerrado: ${d.title}`));
    socket.on('meeting:created', (m: any) => setMessage(`Reunión agendada a las ${m.time}`));
    socket.on('task:created', (t: any) => setMessage(`Nueva tarea: ${t.title}`));
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, background: 'var(--ink)', color: '#fff',
      padding: '13px 20px', fontSize: '0.85rem', zIndex: 50,
    }}>
      {message}
    </div>
  );
}
