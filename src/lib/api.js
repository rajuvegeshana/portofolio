const base = import.meta.env.BASE_URL || '/';

let apiUrl = '';
let basePromise = null;
const adminTokenKey = 'portfolio_admin_token';
const unlockTokenKey = 'portfolio_unlock_token';

// The content server can live on a different origin from the static site
// (GitHub Pages). public/api-config.json tells the bundle where to find it.
// With no apiUrl configured the API is expected on the site's own origin,
// under the same path prefix the app is served from.
export function loadApiBase() {
  if (!basePromise) {
    if (import.meta.env.DEV) {
      basePromise = Promise.resolve('');
      return basePromise;
    }
    basePromise = fetch(`${base}api-config.json`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : {}))
      .then((cfg) => {
        apiUrl = String(cfg.apiUrl || '').replace(/\/+$/, '');
        return apiUrl;
      })
      .catch(() => {
        apiUrl = '';
        return apiUrl;
      });
  }
  return basePromise;
}

export function getApiBase() {
  return apiUrl;
}

function apiRoot() {
  return apiUrl ? `${apiUrl}/api` : `${base}api`;
}

export async function apiFetch(path, options = {}) {
  await loadApiBase();
  const adminToken = sessionStorage.getItem(adminTokenKey);
  const unlockToken = sessionStorage.getItem(unlockTokenKey);
  const res = await fetch(`${apiRoot()}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...(unlockToken ? { 'X-Portfolio-Unlock': unlockToken } : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const getProjects = () => apiFetch('/projects');
export const getProject = (slug) => apiFetch(`/projects/${slug}`);
export const getExperience = () => apiFetch('/experience');
export const getAbout = () => apiFetch('/about');
export const getSession = () => apiFetch('/auth/session');
export async function login(email, password) {
  const result = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (result?.token) sessionStorage.setItem(adminTokenKey, result.token);
  return result;
}
export async function logout() {
  try {
    return await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    sessionStorage.removeItem(adminTokenKey);
    sessionStorage.removeItem(unlockTokenKey);
  }
}
export async function unlock(key) {
  const result = await apiFetch('/unlock', { method: 'POST', body: JSON.stringify({ key }) });
  if (result?.token) sessionStorage.setItem(unlockTokenKey, result.token);
  return result;
}
export const unlockStatus = () => apiFetch('/unlock/status');
