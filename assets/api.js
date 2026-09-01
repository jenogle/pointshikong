import { SUPABASE_URL, SUPABASE_KEY } from './config.js';

export const DEFAULT_TIMEOUT_MS = 10000;
const TOKEN_KEY = 'psk_access_token';

export function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }
export function setToken(token) { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export async function request(path, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers, signal: controller.signal });
    const text = await response.text();
    let body = null;
    if (text) { try { body = JSON.parse(text); } catch { body = text; } }
    if (!response.ok) {
      const message = body?.message || body?.error_description || body?.error || (typeof body === 'string' ? body : '') || `HTTP ${response.status}`;
      const error = new Error(message);
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  } catch (error) {
    if (error?.name === 'AbortError') throw new Error('連線逾時，請確認網路後再試。');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function signIn(email, password) {
  const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (!data?.access_token) throw new Error('登入成功但未取得登入憑證。');
  setToken(data.access_token);
  return data;
}
export const getCurrentUser = () => request('/auth/v1/user');
export const rpc = (name, body = {}) => request(`/rest/v1/rpc/${name}`, { method: 'POST', body: JSON.stringify(body) });
export const select = (table, query = '') => request(`/rest/v1/${table}${query ? `?${query}` : ''}`);
export const insert = (table, body, prefer = 'return=minimal') => request(`/rest/v1/${table}`, { method: 'POST', headers: { Prefer: prefer }, body: JSON.stringify(body) });
export const update = (table, filter, body) => request(`/rest/v1/${table}?${filter}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(body) });
export const remove = (table, filter) => request(`/rest/v1/${table}?${filter}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
