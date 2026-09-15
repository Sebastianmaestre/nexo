'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import LiveToaster from '@/components/LiveToaster';
import { api } from '@/lib/api';

const STATUS_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROGRESO: 'En progreso',
  COMPLETADA: 'Completada',
};

export default function TareasPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  async function load() {
    setTasks(await api.tasks.list());
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.tasks.create({ title });
    setTitle('');
    load();
  }

  async function cycleStatus(t: any) {
    const order = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA'];
    const next = order[(order.indexOf(t.status) + 1) % order.length];
    await api.tasks.updateStatus(t.id, next);
    load();
  }

  return (
    <AppShell>
      <LiveToaster />
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Tareas</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Clic en el estado para avanzarla</p>
      </div>

      <form onSubmit={handleCreate} className="panel" style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <input style={{ flex: 1, padding: '9px 10px', border: '1px solid var(--border)' }} placeholder="Nueva tarea…" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button className="btn" type="submit">Agregar</button>
      </form>

      <table>
        <thead><tr><th>Tarea</th><th>Responsable</th><th>Estado</th></tr></thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td>{t.owner?.name || '—'}</td>
              <td>
                <span className={t.status === 'COMPLETADA' ? 'badge' : t.status === 'EN_PROGRESO' ? 'badge gold' : 'badge warn'} style={{ cursor: 'pointer' }} onClick={() => cycleStatus(t)}>
                  {STATUS_LABEL[t.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}
