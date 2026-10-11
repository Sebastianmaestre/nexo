'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div className="app-shell">
      <div className="mobile-topbar">
        <button onClick={() => setMenuOpen(true)}>☰ Menú</button>
        <strong className="brand" style={{ fontSize: '1.05rem' }}>Nexo CRM</strong>
      </div>

      <div className={`sidebar-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      <main className="app-main">{children}</main>
    </div>
  );
}