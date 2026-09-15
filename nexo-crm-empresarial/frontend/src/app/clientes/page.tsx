'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import LiveToaster from '@/components/LiveToaster';
import { api } from '@/lib/api';

const SEGMENT_CLASS: Record<string, string> = {
  VIP: 'badge gold',
  'En riesgo': 'badge warn',
  Nuevo: 'badge',
};

export default function ClientesPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', segment: 'Nuevo' });
  const [selected, setSelected] = useState<any>(null);

  async function load(q?: string) {
    const data = await api.clients.list(q);
    setClients(data);
  }

  useEffect(() => { load(); }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(search);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await api.clients.create(form);
    setForm({ name: '', company: '', email: '', phone: '', segment: 'Nuevo' });
    setShowForm(false);
    load(search);
  }

  async function openDetail(id: number) {
    const detail = await api.clients.get(id);
    setSelected(detail);
  }

  return (
    <AppShell>
      <LiveToaster />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Clientes</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>{clients.length} clientes registrados</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Buscar por nombre o empresa" value={search} onChange={(e) => setSearch(e.target.value)} style={{ padding: '9px 10px', border: '1px solid var(--border)' }} />
            <button className="btn ghost" type="submit">Buscar</button>
          </form>
          <button className="btn" onClick={() => setShowForm(!showForm)}>+ Nuevo cliente</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="panel" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600 }}>Nuevo cliente</h3>
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Nombre</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Empresa</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Email</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Teléfono</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Segmento</label>
              <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })}>
                <option>Nuevo</option>
                <option>VIP</option>
                <option>En riesgo</option>
              </select>
            </div>
          </div>
          <button className="btn" type="submit">Guardar cliente</button>
        </form>
      )}

      <table>
        <thead>
          <tr><th>Nombre</th><th>Empresa</th><th>Teléfono</th><th>Segmento</th><th></th></tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.company || '—'}</td>
              <td>{c.phone || '—'}</td>
              <td><span className={SEGMENT_CLASS[c.segment] || 'badge'}>{c.segment}</span></td>
              <td><span className="link" style={{ color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => openDetail(c.id)}>Ver ficha</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="panel" style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 600 }}>{selected.name}</h3>
            <button className="btn ghost" onClick={() => setSelected(null)}>Cerrar</button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 16px' }}>{selected.company} · {selected.email || 'sin email'} · {selected.phone || 'sin teléfono'}</p>

          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--muted)', margin: '18px 0 8px' }}>Negocios</h4>
          {selected.deals.length === 0 ? <p className="empty-hint">Sin negocios asociados.</p> : (
            <ul style={{ paddingLeft: 18, margin: '0 0 8px' }}>
              {selected.deals.map((d: any) => <li key={d.id} style={{ fontSize: '0.88rem' }}>{d.title} — ${d.value.toLocaleString('es-BO')} ({d.stage})</li>)}
            </ul>
          )}

          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--muted)', margin: '18px 0 8px' }}>Actividad reciente</h4>
          {selected.activities.length === 0 ? <p className="empty-hint">Sin actividad registrada.</p> : (
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {selected.activities.map((a: any) => <li key={a.id} style={{ fontSize: '0.88rem' }}>[{a.type}] {a.note}</li>)}
            </ul>
          )}
        </div>
      )}
    </AppShell>
  );
}
