'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import LiveToaster from '@/components/LiveToaster';
import { api } from '@/lib/api';

const STAGE_LABEL: Record<string, string> = {
  PROSPECTO: 'Prospecto',
  CONTACTADO: 'Contactado',
  PROPUESTA: 'Propuesta',
  CERRADO_GANADO: 'Cerrado (ganado)',
  CERRADO_PERDIDO: 'Cerrado (perdido)',
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.dashboard.summary().then(setSummary).catch(() => {});
  }, []);

  return (
    <AppShell>
      <LiveToaster />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Dashboard</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Resumen general del CRM</p>
        </div>
      </div>

      {!summary ? (
        <p className="empty-hint">Cargando…</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 28 }}>
            <Kpi label="Clientes" value={summary.clientsCount} />
            <Kpi label="Reuniones hoy" value={summary.meetingsToday} />
            <Kpi label="Negocios cerrados" value={summary.dealsWon} />
            <Kpi label="Tareas pendientes" value={summary.pendingTasks} />
            <Kpi label="Ingresos cerrados" value={`$${summary.revenue.toLocaleString('es-BO')}`} accent />
          </div>

          <div className="panel">
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 600 }}>Pipeline por etapa</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {summary.pipelineByStage.map((s: any) => (
                <div key={s.stage} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 150, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{STAGE_LABEL[s.stage]}</span>
                  <div style={{ flex: 1, background: 'var(--accent-soft)', height: 10 }}>
                    <div style={{ background: 'var(--accent)', height: 10, width: `${Math.min(100, s._count * 20)}%` }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--muted)', width: 90, textAlign: 'right' }}>
                    {s._count} · ${(s._sum.value || 0).toLocaleString('es-BO')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

function Kpi({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
      <p style={{ fontSize: '1.8rem', fontFamily: 'Lora, serif', fontWeight: 600, margin: 0, color: accent ? 'var(--accent)' : 'var(--ink)' }}>{value}</p>
    </div>
  );
}
