'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import LiveToaster from '@/components/LiveToaster';
import { api } from '@/lib/api';

const STAGES = ['PROSPECTO', 'CONTACTADO', 'PROPUESTA', 'CERRADO_GANADO', 'CERRADO_PERDIDO'];
const STAGE_LABEL: Record<string, string> = {
  PROSPECTO: 'Prospecto',
  CONTACTADO: 'Contactado',
  PROPUESTA: 'Propuesta',
  CERRADO_GANADO: 'Ganado',
  CERRADO_PERDIDO: 'Perdido',
};

export default function PipelinePage() {
  const [grouped, setGrouped] = useState<Record<string, any[]>>({});
  const [clients, setClients] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', value: '', clientId: '' });

  async function load() {
    const data = await api.deals.list();
    setGrouped(data);
  }

  useEffect(() => {
    load();
    api.clients.list().then(setClients);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.clientId) return;
    await api.deals.create({ title: form.title, value: Number(form.value) || 0, clientId: Number(form.clientId) });
    setForm({ title: '', value: '', clientId: '' });
    setShowForm(false);
    load();
  }

  async function moveStage(id: number, stage: string) {
    await api.deals.updateStage(id, stage);
    load();
  }

  return (
    <AppShell>
      <LiveToaster />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Pipeline de ventas</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Arrastrá negocios entre etapas cambiando su estado</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>+ Nuevo negocio</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="panel" style={{ marginBottom: 20, display: 'flex', gap: 14, alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 2, marginBottom: 0 }}>
            <label>Título del negocio</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field" style={{ flex: 1, marginBottom: 0 }}>
            <label>Valor ($)</label>
            <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} type="number" />
          </div>
          <div className="field" style={{ flex: 2, marginBottom: 0 }}>
            <label>Cliente</label>
            <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} required>
              <option value="">Seleccioná un cliente</option>
              {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="btn" type="submit">Crear</button>
        </form>
      )}

      <div style={{ display: 'flex', gap: 14, overflowX: 'auto' }}>
        {STAGES.map((stage) => (
          <div key={stage} style={{ minWidth: 220, flex: 1 }}>
            <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, letterSpacing: '0.04em' }}>
              {STAGE_LABEL[stage]} ({(grouped[stage] || []).length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(grouped[stage] || []).map((d: any) => (
                <div key={d.id} className="panel" style={{ padding: 14 }}>
                  <p style={{ margin: '0 0 4px', fontSize: '0.88rem', fontWeight: 600 }}>{d.title}</p>
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', color: 'var(--muted)' }}>{d.client.name} · ${d.value.toLocaleString('es-BO')}</p>
                  <select
                    value={d.stage}
                    onChange={(e) => moveStage(d.id, e.target.value)}
                    style={{ width: '100%', fontSize: '0.78rem', padding: '5px 6px', border: '1px solid var(--border)' }}
                  >
                    {STAGES.map((s) => <option key={s} value={s}>{STAGE_LABEL[s]}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
