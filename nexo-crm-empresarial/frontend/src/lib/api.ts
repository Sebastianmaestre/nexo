const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('crm_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Error ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  clients: {
    list: (search?: string) => request(`/clients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    get: (id: number) => request(`/clients/${id}`),
    create: (data: any) => request('/clients', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(`/clients/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: number) => request(`/clients/${id}`, { method: 'DELETE' }),
    addActivity: (id: number, data: any) => request(`/clients/${id}/activities`, { method: 'POST', body: JSON.stringify(data) }),
  },

  deals: {
    list: () => request('/deals'),
    create: (data: any) => request('/deals', { method: 'POST', body: JSON.stringify(data) }),
    updateStage: (id: number, stage: string) => request(`/deals/${id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) }),
    remove: (id: number) => request(`/deals/${id}`, { method: 'DELETE' }),
  },

  meetings: {
    list: (date: string) => request(`/meetings?date=${date}`),
    create: (data: any) => request('/meetings', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => request(`/meetings/${id}`, { method: 'DELETE' }),
  },

  tasks: {
    list: () => request('/tasks'),
    create: (data: any) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: number, status: string) => request(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    remove: (id: number) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },

  dashboard: {
    summary: () => request('/dashboard/summary'),
  },
};

export function saveToken(token: string) {
  window.localStorage.setItem('crm_token', token);
}
export function clearToken() {
  window.localStorage.removeItem('crm_token');
}
export function getStoredToken() {
  return getToken();
}
