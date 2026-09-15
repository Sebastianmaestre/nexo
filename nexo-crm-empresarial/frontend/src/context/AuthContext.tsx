'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, saveToken, clearToken, getStoredToken } from '@/lib/api';

type UserInfo = { sub: number; name: string; role: 'ADMIN' | 'VENTAS' | 'SOPORTE'; email: string };

type AuthContextType = {
  user: UserInfo | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getStoredToken();
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('crm_user') : null;
    if (token && stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const res = await api.login(email, password);
    saveToken(res.token);
    window.localStorage.setItem('crm_user', JSON.stringify(res.user));
    setUser(res.user);
    router.push('/dashboard');
  }

  function logout() {
    clearToken();
    window.localStorage.removeItem('crm_user');
    setUser(null);
    router.push('/login');
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
