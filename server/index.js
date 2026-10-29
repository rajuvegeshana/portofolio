import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hashSecret, verifySecret, signToken, verifyToken, randomSecret } from './lib/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 3001);
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_MODE = process.env.PUBLIC_MODE === '1';
const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data');
const bundledContentDir = path.join(__dirname, '../content');
const contentDir = process.env.DATA_DIR ? path.join(dataDir, 'content') : bundledContentDir;
const lockedFile = path.join(dataDir, 'locked-projects.json');
const accessFile = path.join(dataDir, 'access.json');
const adminFile = path.join(dataDir, 'admin.json');
const secretFile = path.join(dataDir, 'secret.key');

const ADMIN_COOKIE = 'hk_admin';
const UNLOCK_COOKIE = 'hk_unlock';
const ADMIN_TTL = 7 * 24 * 60 * 60 * 1000;
const UNLOCK_TTL = 30 * 24 * 60 * 60 * 1000;

fs.mkdirSync(dataDir, { recursive: true });
if (contentDir !== bundledContentDir) {
  fs.mkdirSync(contentDir, { recursive: true });
  for (const name of ['projects.json', 'experience.json', 'about.json']) {
    const target = path.join(contentDir, name);
    if (!fs.existsSync(target)) fs.copyFileSync(path.join(bundledContentDir, name), target);
  }
}

// ---------------------------------------------------------------- helpers

const readJSON = (file, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
};

const writeJSON = (file, value) => {
  const temporary = `${file}.${process.pid}.${randomSecret(6)}.tmp`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(temporary, file);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
};

function sessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (!fs.existsSync(secretFile)) fs.writeFileSync(secretFile, randomSecret(32), { mode: 0o600 });
  return fs.readFileSync(secretFile, 'utf8').trim();
}
const SECRET = sessionSecret();

function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie;
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

function setCookie(req, res, name, value, maxAge) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  let cross = false;
  if (origin) {
    try {
      cross = new URL(origin).host !== host;
    } catch {
      cross = false;
    }
  }
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    'HttpOnly',
    `Max-Age=${Math.floor(maxAge / 1000)}`,
  ];
  // Cross-origin sites only accept the cookie with SameSite=None; Secure is
  // required for that, and browsers treat localhost as a secure context.
  attrs.push(cross ? 'SameSite=None; Secure' : 'SameSite=Lax');
  res.setHeader('Set-Cookie', attrs.join('; '));
}

const isAdmin = (req) => {
  const token = parseCookies(req)[ADMIN_COOKIE];
  if (!token) return false;
  const payload = verifyToken(token, SECRET);
  return !!payload && payload.type === 'admin' && payload.version === readJSON(adminFile, {})?.updatedAt;
};

const isUnlocked = (req) => {
  const token = parseCookies(req)[UNLOCK_COOKIE];
  if (!token) return false;
  const payload = verifyToken(token, SECRET);
  return !!payload && payload.type === 'unlock' && payload.version === readJSON(accessFile, {})?.updatedAt;
};

const requireAdmin = (req, res, next) =>
  isAdmin(req) ? next() : res.status(401).json({ error: 'Admin sign-in required' });

// Brute-force guard for the two password endpoints.
const attempts = new Map();
function rateLimit(req, res, next) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return next();
  }
  entry.count += 1;
  if (entry.count > 12) {
    return res.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' });
  }
  next();
}

// ---------------------------------------------------------- content store

const readPublicProjects = () => readJSON(path.join(contentDir, 'projects.json'), []);
const readLockedProjects = () => readJSON(lockedFile, []);

const PUBLIC_STUB_FIELDS = [
  'slug',
  'title',
  'client',
  'category',
  'role',
  'year',
  'shortDescription',
  'tags',
  'isFeatured',
  'status',
  'locked',
];

const toStub = (project) => {
  const stub = {};
  for (const field of PUBLIC_STUB_FIELDS) if (field in project) stub[field] = project[field];
  stub.locked = true;
  return stub;
};

function validProjects(value) {
  if (!Array.isArray(value) || value.length > 100) return false;
  const slugs = new Set();
  for (const project of value) {
    if (!project || typeof project !== 'object' || Array.isArray(project)) return false;
    if (typeof project.slug !== 'string' || !/^[a-z0-9-]{1,80}$/.test(project.slug) || slugs.has(project.slug)) return false;
    if (typeof project.title !== 'string' || !project.title.trim()) return false;
    if (!['draft', 'published'].includes(project.status)) return false;
    if (project.locked && Object.keys(project).some((key) => !PUBLIC_STUB_FIELDS.includes(key))) return false;
    slugs.add(project.slug);
  }
  return true;
}

function validExperience(value) {
  return Array.isArray(value) && value.length <= 100 && value.every((entry) =>
    entry && typeof entry === 'object' && typeof entry.company === 'string' &&
    typeof entry.role === 'string' && Array.isArray(entry.highlights) &&
    entry.highlights.every((item) => typeof item === 'string')
  );
}

// ------------------------------------------------------------------ CORS

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  let sameHost = false;
  try { sameHost = new URL(origin).host === req.get('host'); } catch { /* no Origin header */ }
  if (origin && !allowedOrigins.includes(origin) && !sameHost) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: '4mb' }));

// The static site is served under a path prefix, so the browser asks for
// /portofolio/api/... . The API itself lives at /api. The trailing slash
// leaves /portofolio/api-config.json alone.
app.use((req, res, next) => {
  if (req.url.startsWith('/portofolio/api/')) {
    req.url = req.url.replace('/portofolio/api/', '/api/');
  } else if (req.url === '/portofolio/api') {
    req.url = '/api';
  }
  next();
});

// ------------------------------------------------------------ public read

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mode: PUBLIC_MODE ? 'hosted' : 'local' });
});

// Public listing: locked case studies appear as a redacted stub only.
app.get('/api/projects', (req, res) => {
  try {
    const projects = readPublicProjects().map((p) => (p.locked ? toStub(p) : p));
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read projects' });
  }
});

app.get('/api/projects/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const projects = readPublicProjects();
    const entry = projects.find((p) => p.slug === slug);
    if (!entry) return res.status(404).json({ error: 'Project not found' });

    if (entry.locked) {
      const privateEntry = readLockedProjects().find((p) => p.slug === slug);
      if (!privateEntry) {
        return res.status(404).json({
          error: 'This case study is locked and its content has not been uploaded to this server yet.',
          locked: true,
          stub: toStub(entry),
        });
      }
      if (!isUnlocked(req)) {
        return res.status(401).json({ error: 'locked', locked: true, stub: toStub(entry) });
      }
      return res.json({ ...privateEntry, stub: toStub(entry) });
    }

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read project' });
  }
});

app.get('/api/experience', (req, res) => {
  try {
    res.json(readJSON(path.join(contentDir, 'experience.json'), []));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read experience' });
  }
});

app.get('/api/about', (req, res) => {
  try {
    res.json(readJSON(path.join(contentDir, 'about.json'), {}));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read about' });
  }
});

// ------------------------------------------------------------- unlocking

app.post('/api/unlock', rateLimit, (req, res) => {
  const key = String(req.body?.key || '');
  const access = readJSON(accessFile, null);
  if (!access?.keyHash) {
    return res.status(409).json({ error: 'No access key has been set on this server yet.' });
  }
  if (!verifySecret(key, access.keyHash)) {
    return res.status(401).json({ error: 'That key is not correct.' });
  }
  setCookie(req, res, UNLOCK_COOKIE, signToken({ type: 'unlock', version: access.updatedAt, exp: Date.now() + UNLOCK_TTL }, SECRET), UNLOCK_TTL);
  res.json({ ok: true });
});

app.get('/api/unlock/status', (req, res) => {
  res.json({ unlocked: isUnlocked(req), hasKey: !!readJSON(accessFile, null)?.keyHash });
});

// ----------------------------------------------------------- admin auth

function adminCredentials() {
  const stored = readJSON(adminFile, null);
  if (stored?.passwordHash) return stored;
  const bootstrap = process.env.ADMIN_PASSWORD || randomSecret(12);
  const created = { passwordHash: hashSecret(bootstrap), updatedAt: new Date().toISOString() };
  writeJSON(adminFile, created);
  if (!process.env.ADMIN_PASSWORD) {
    console.log('\n  ┌──────────────────────────────────────────────┐');
    console.log('  │  Admin password generated (shown once)        │');
    console.log(`  │  ${bootstrap.padEnd(44)} │`);
    console.log('  │  Change it in Admin → Access Control.         │');
    console.log('  └──────────────────────────────────────────────┘\n');
  }
  return created;
}
adminCredentials();

app.post('/api/auth/login', rateLimit, (req, res) => {
  const password = String(req.body?.password || '');
  if (!verifySecret(password, readJSON(adminFile, {}).passwordHash || '')) {
    return res.status(401).json({ error: 'That password is not correct.' });
  }
  setCookie(req, res, ADMIN_COOKIE, signToken({ type: 'admin', version: readJSON(adminFile, {}).updatedAt, exp: Date.now() + ADMIN_TTL }, SECRET), ADMIN_TTL);
  res.json({ ok: true });
});

app.post('/api/auth/logout', (req, res) => {
  setCookie(req, res, ADMIN_COOKIE, '', 0);
  setCookie(req, res, UNLOCK_COOKIE, '', 0);
  res.json({ ok: true });
});

app.get('/api/auth/session', (req, res) => {
  res.json({ admin: isAdmin(req) });
});

// ---------------------------------------------------------- admin writes

app.post('/api/projects', requireAdmin, (req, res) => {
  try {
    if (!validProjects(req.body)) return res.status(400).json({ error: 'Invalid projects or duplicate slugs' });
    writeJSON(path.join(contentDir, 'projects.json'), req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save projects' });
  }
});

app.post('/api/experience', requireAdmin, (req, res) => {
  try {
    if (!validExperience(req.body)) return res.status(400).json({ error: 'Invalid experience entries' });
    writeJSON(path.join(contentDir, 'experience.json'), req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save experience' });
  }
});

app.post('/api/about', requireAdmin, (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body) ||
        typeof req.body.hero?.title !== 'string' || typeof req.body.about?.summary !== 'string') {
      return res.status(400).json({ error: 'Invalid about content' });
    }
    writeJSON(path.join(contentDir, 'about.json'), req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save about' });
  }
});

// --------------------------------------------------- locked case studies

// Full private content for a locked case study (admin only).
app.get('/api/private/projects', requireAdmin, (req, res) => {
  res.json(readLockedProjects());
});

app.put('/api/private/projects/:slug', requireAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const locked = readLockedProjects();
    const idx = locked.findIndex((p) => p.slug === slug);
    const incoming = { ...req.body, slug, locked: true };
    if (idx >= 0) locked[idx] = incoming;
    else locked.push(incoming);
    writeJSON(lockedFile, locked);
    // The public listing is deliberately left alone: it stays redacted until
    // the case study is made public again.
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save locked case study' });
  }
});

// Move a public case study behind the lock.
app.post('/api/private/projects/:slug/lock', requireAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const projects = readPublicProjects();
    const idx = projects.findIndex((p) => p.slug === slug);
    if (idx < 0) return res.status(404).json({ error: 'Project not found' });

    const full = { ...projects[idx], locked: true };
    delete full.locked;
    const locked = readLockedProjects();
    const existing = locked.findIndex((p) => p.slug === slug);
    if (existing >= 0) locked[existing] = full;
    else locked.push(full);
    writeJSON(lockedFile, locked);

    projects[idx] = toStub(full);
    writeJSON(path.join(contentDir, 'projects.json'), projects);
    res.json({ success: true, locked: locked.map((p) => p.slug) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to lock project' });
  }
});

// Bring a locked case study back into the public portfolio.
app.delete('/api/private/projects/:slug/lock', requireAdmin, (req, res) => {
  try {
    const { slug } = req.params;
    const locked = readLockedProjects();
    const full = locked.find((p) => p.slug === slug);
    if (!full) return res.status(404).json({ error: 'Locked project not found' });

    const projects = readPublicProjects();
    const idx = projects.findIndex((p) => p.slug === slug);
    const restored = { ...full };
    delete restored.locked;
    delete restored.stub;
    if (idx >= 0) projects[idx] = restored;
    else projects.push(restored);
    writeJSON(path.join(contentDir, 'projects.json'), projects);

    writeJSON(
      lockedFile,
      locked.filter((p) => p.slug !== slug)
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unlock project' });
  }
});

// Import a full set of private case studies (used to seed a hosted server).
app.post('/api/private/projects/import', requireAdmin, (req, res) => {
  try {
    const incoming = Array.isArray(req.body) ? req.body : [];
    if (!incoming.length) return res.status(400).json({ error: 'Nothing to import' });
    writeJSON(lockedFile, incoming.map((p) => ({ ...p, locked: true })));
    res.json({ success: true, count: incoming.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to import locked case studies' });
  }
});

// ------------------------------------------------------------ access key

app.get('/api/lock/status', requireAdmin, (req, res) => {
  const access = readJSON(accessFile, null);
  res.json({
    hasKey: !!access?.keyHash,
    updatedAt: access?.updatedAt || null,
    lockedSlugs: readLockedProjects().map((p) => p.slug),
  });
});

app.post('/api/lock/key', requireAdmin, (req, res) => {
  try {
    const key = String(req.body?.key || '').trim();
    if (key.length < 16) return res.status(400).json({ error: 'Use a key of at least 16 characters.' });
    writeJSON(accessFile, { keyHash: hashSecret(key), updatedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save the access key' });
  }
});

app.delete('/api/lock/key', requireAdmin, (req, res) => {
  try {
    writeJSON(accessFile, { keyHash: null, updatedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear the access key' });
  }
});

app.post('/api/admin/password', requireAdmin, (req, res) => {
  try {
    const current = String(req.body?.current || '');
    const next = String(req.body?.next || '');
    if (!verifySecret(current, readJSON(adminFile, {}).passwordHash || '')) {
      return res.status(401).json({ error: 'Current password is not correct.' });
    }
    if (next.length < 8) return res.status(400).json({ error: 'Use a password of at least 8 characters.' });
    writeJSON(adminFile, { passwordHash: hashSecret(next), updatedAt: new Date().toISOString() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change the password' });
  }
});

// --------------------------------------------------------- static site

const distDir = path.join(__dirname, '../dist');
if (process.env.SERVE_STATIC !== '0' && fs.existsSync(distDir)) {
  app.use('/portofolio', express.static(distDir, { index: 'index.html' }));
  app.get(/^\/portofolio(\/.*)?$/, (req, res) => res.sendFile(path.join(distDir, 'index.html')));
  app.get('/', (req, res) => res.redirect('/portofolio/'));
}

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.listen(PORT, HOST, () => {
  console.log(`Content server running at http://${HOST}:${PORT}`);
  console.log(`  data directory: ${dataDir}`);
  if (PUBLIC_MODE) console.log('  mode: hosted (public interface)');
});
