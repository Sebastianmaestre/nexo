'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV_BY_ROLE: Record<string, { href: string; label: string }[]> = {
  ADMIN: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/pipeline', label: 'Pipeline' },
    { href: '/reuniones', label: 'Reuniones' },
    { href: '/tareas', label: 'Tareas' },
  ],
  VENTAS: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/pipeline', label: 'Pipeline' },
    { href: '/reuniones', label: 'Reuniones' },
    { href: '/tareas', label: 'Tareas' },
  ],
  SOPORTE: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/clientes', label: 'Clientes' },
    { href: '/tareas', label: 'Tareas' },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Administrador',
  VENTAS: 'Ventas',
  SOPORTE: 'Soporte',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  if (!user) return null;
  const items = NAV_BY_ROLE[user.role] || [];

  return (
    <aside style={{
      width: 230, flexShrink: 0, background: 'var(--ink)', color: '#F1F5F3',
      padding: '28px 20px', display: 'flex', flexDirection: 'column', minHeight: '100vh',
    }}>
      <p className="brand" style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: '0 0 2px' }}>Nexo CRM</p>
      <p style={{ color: '#9AAFA7', fontSize: '0.75rem', margin: '0 0 32px' }}>IRIS — demo empresarial</p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'block', padding: '11px 12px', fontSize: '0.92rem',
                color: active ? '#fff' : '#CBDAD4',
                borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                background: active ? 'rgba(255,255,255,0.05)' : 'none',
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: '0.78rem', color: '#9AAFA7' }}>
        <strong style={{ display: 'block', color: '#fff', fontSize: '0.88rem', fontWeight: 500 }}>{user.name}</strong>
        {ROLE_LABEL[user.role]}
        <br />
        <button onClick={logout} style={{ background: 'none', border: 'none', color: '#9AAFA7', fontSize: '0.75rem', cursor: 'pointer', padding: 0, marginTop: 10, textDecoration: 'underline' }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
