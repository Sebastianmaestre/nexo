'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const DEMO_USERS = [
  { email: 'admin@iris.dev', label: 'Administrador' },
  { email: 'ventas@iris.dev', label: 'Ventas' },
  { email: 'soporte@iris.dev', label: 'Soporte' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@iris.dev');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'No se pudo iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="panel" style={{ maxWidth: 400, width: '100%' }}>
        <p className="brand" style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 4px' }}>Nexo CRM</p>
        <p style={{ color: 'var(--ink-soft)', margin: '0 0 28px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Demo empresarial de IRIS. Iniciá sesión con uno de los usuarios de ejemplo.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Correo</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p style={{ color: 'var(--warn)', fontSize: '0.85rem', marginBottom: 14 }}>{error}</p>}
          <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 8 }}>Usuarios de ejemplo (contraseña: demo1234)</p>
          {DEMO_USERS.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => setEmail(u.email)}
              className="btn ghost"
              style={{ width: '100%', marginBottom: 6, textAlign: 'left' }}
            >
              {u.label} — {u.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
