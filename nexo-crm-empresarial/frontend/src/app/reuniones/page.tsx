'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import LiveToaster from '@/components/LiveToaster';
import { api } from '@/lib/api';

export default function ReunionesPage() {
  const [date] = useState(new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [booking, setBooking] = useState<string | null>(null);
  const [form, setForm] = useState({ clientId: '', note: '' });

  async function load() {
    setSlots(await api.meetings.list(date));
  }

  useEffect(() => {
    load();
    api.clients.list().then(setClients);
  }, []);

  async function handleBook(e: React.FormEvent) {
    e.preventDefault();
    if (!booking || !form.clientId) return;
    await api.meetings.create({ date, time: booking, clientId: Number(form.clientId), note: form.note });
    setBooking(null);
    setForm({ clientId: '', note: '' });
    load();
  }

  const label = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <AppShell>
      <LiveToaster />
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Reuniones</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0', textTransform: 'capitalize' }}>{label}</p>
      </div>

      <div className="panel" style={{ padding: 0 }}>
        {slots.map((s) => (
          <div key={s.time}>
            <div
              style={{
                display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid var(--border)',
                fontSize: '0.85rem', cursor: s.meeting ? 'default' : 'pointer',
              }}
              onClick={() => !s.meeting && setBooking(booking === s.time ? null : s.time)}
            >
              <span style={{ width: 70, color: 'var(--muted)', flexShrink: 0 }}>{s.time}</span>
              <span style={{ flex: 1 }}>
                {s.meeting ? (
                  <><span className="badge">{s.meeting.client.name}</span> — {s.meeting.note}</>
                ) : (
                  <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Disponible — clic para agendar</span>
                )}
              </span>
            </div>
            {booking === s.time && (
              <form onSubmit={handleBook} style={{ padding: 16, background: 'var(--accent-soft)', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Cliente</label>
                  <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
                    <option value="">Seleccioná un cliente</option>
                    {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field" style={{ flex: 1, marginBottom: 0 }}>
                  <label>Motivo</label>
                  <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Ej. Seguimiento propuesta" />
                </div>
                <button className="btn" type="submit">Agendar</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
