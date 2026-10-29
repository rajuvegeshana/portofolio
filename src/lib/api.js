const base = import.meta.env.BASE_URL || '/';

let apiUrl = '';
let basePromise = null;

// The content server can live on a different origin from the static site
// (GitHub Pages). public/api-config.json tells the bundle where to find it.
// With no apiUrl configured the API is expected on the site's own origin,
// under the same path prefix the app is served from.
export function loadApiBase() {
  if (!basePromise) {
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
  const res = await fetch(`${apiRoot()}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
export const login = (password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ password }) });
export const logout = () => apiFetch('/auth/logout', { method: 'POST' });
export const unlock = (key) => apiFetch('/unlock', { method: 'POST', body: JSON.stringify({ key }) });
export const unlockStatus = () => apiFetch('/unlock/status');
