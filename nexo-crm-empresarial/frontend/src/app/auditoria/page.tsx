'use client';
import { useEffect, useState } from 'react';
import AppShell from '@/components/AppShell';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const ACTION_LABEL: Record<string, string> = {
  CREATE: 'Creó',
  UPDATE: 'Actualizó',
  DELETE: 'Eliminó',
  STAGE_CHANGE: 'Movió etapa de',
  STATUS_CHANGE: 'Cambió estado de',
};

export default function AuditoriaPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.audit.list().then(setLogs).catch(() => {});
  }, []);

  if (user && user.role !== 'ADMIN') {
    return (
      <AppShell>
        <p className="empty-hint">Esta sección es solo para administradores.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Auditoría</h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Historial de acciones en el sistema</p>
      </div>

      <table>
        <thead>
          <tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Entidad</th><th>Detalle</th></tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{new Date(l.createdAt).toLocaleString('es-BO')}</td>
              <td>{l.userName || 'Sistema'}</td>
              <td>{ACTION_LABEL[l.action] || l.action}</td>
              <td>{l.entity}</td>
              <td style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>{l.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AppShell>
  );
}