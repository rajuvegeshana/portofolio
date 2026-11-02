import { createClient } from 'npm:@supabase/supabase-js@2.112.3';
import { Buffer } from 'node:buffer';
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const projectUrl = Deno.env.get('SUPABASE_URL');
const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}');
const serverKey = keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const publicKeys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}');
const publishableKey = publicKeys.default || Deno.env.get('SUPABASE_ANON_KEY');
if (!projectUrl || !serverKey || !publishableKey) throw new Error('Supabase server configuration is missing');

const db = createClient(projectUrl, serverKey, { auth: { persistSession: false } });
const authClient = () => createClient(projectUrl, publishableKey, { auth: { persistSession: false } });
const signingKey = createHmac('sha256', serverKey).update('portfolio-session-v1').digest();
const allowedOrigins = new Set([
  'https://rajuvegeshana.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);
const unlockTtl = 30 * 24 * 60 * 60 * 1000;
const stubFields = [
  'slug', 'title', 'client', 'category', 'role', 'year', 'shortDescription',
  'tags', 'isFeatured', 'status', 'locked',
];

function cors(req: Request) {
  const origin = req.headers.get('origin');
  return {
    'Access-Control-Allow-Origin': origin && allowedOrigins.has(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, authorization, x-portfolio-unlock',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
  };
}

function reply(req: Request, data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { ...cors(req), 'Cache-Control': 'no-store' },
  });
}

function fail(req: Request, message: string, status: number, extra = {}) {
  return reply(req, { error: message, ...extra }, status);
}

async function body(req: Request) {
  const raw = await req.text();
  if (raw.length > 4_000_000) throw new Error('Request body is too large');
  return raw ? JSON.parse(raw) : null;
}

async function readResumePdf(req: Request) {
  const maxBytes = 5 * 1024 * 1024;
  const declaredSize = Number(req.headers.get('content-length'));
  if (Number.isFinite(declaredSize) && declaredSize > maxBytes) return null;
  if (!req.body) return null;

  const chunks: Uint8Array[] = [];
  const reader = req.body.getReader();
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  if (size < 8) return null;
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  if (new TextDecoder().decode(bytes.subarray(0, 5)) !== '%PDF-') return null;
  return bytes;
}

function toStub(project: Record<string, unknown>) {
  const stub: Record<string, unknown> = {};
  for (const field of stubFields) if (field in project) stub[field] = project[field];
  stub.locked = true;
  return stub;
}

function validProjects(value: unknown) {
  if (!Array.isArray(value) || value.length > 100) return false;
  const slugs = new Set<string>();
  for (const project of value) {
    if (!project || typeof project !== 'object' || Array.isArray(project)) return false;
    if (typeof project.slug !== 'string' || !/^[a-z0-9-]{1,80}$/.test(project.slug) || slugs.has(project.slug)) return false;
    if (typeof project.title !== 'string' || !project.title.trim()) return false;
    if (!['draft', 'published'].includes(project.status)) return false;
    if (project.locked && Object.keys(project).some((key) => !stubFields.includes(key))) return false;
    slugs.add(project.slug);
  }
  return true;
}

function validExperience(value: unknown) {
  return Array.isArray(value) && value.length <= 100 && value.every((entry) =>
    entry && typeof entry === 'object' && typeof entry.company === 'string' &&
    typeof entry.role === 'string' && Array.isArray(entry.highlights) &&
    entry.highlights.every((item: unknown) => typeof item === 'string')
  );
}

function hashSecret(plain: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString('base64')}$${hash.toString('base64')}`;
}

function verifySecret(plain: string, stored: string) {
  try {
    const [scheme, N, r, p, salt, hash] = String(stored).split('$');
    if (scheme !== 'scrypt' || Number(N) !== 16384 || Number(r) !== 8 || Number(p) !== 1) return false;
    const expected = Buffer.from(hash, 'base64');
    const actual = scryptSync(plain, Buffer.from(salt, 'base64'), expected.length, { N: 16384, r: 8, p: 1 });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function signToken(payload: Record<string, unknown>) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', signingKey).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyToken(token: string | null) {
  if (!token) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;
  const expected = createHmac('sha256', signingKey).update(encoded).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

async function document(key: string, fallback: unknown) {
  const { data, error } = await db.from('portfolio_documents').select('body').eq('key', key).maybeSingle();
  if (error) throw error;
  return data?.body ?? fallback;
}

async function saveDocument(key: string, value: unknown) {
  const { error } = await db.from('portfolio_documents').upsert({ key, body: value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function setting(key: string) {
  const { data, error } = await db.from('portfolio_settings').select('body').eq('key', key).maybeSingle();
  if (error) throw error;
  return data?.body ?? null;
}

async function saveSetting(key: string, value: unknown) {
  const { error } = await db.from('portfolio_settings').upsert({ key, body: value, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function privateProjects() {
  const { data, error } = await db.from('portfolio_private_projects').select('body').order('slug');
  if (error) throw error;
  return (data || []).map((row) => row.body);
}

async function privateProject(slug: string) {
  const { data, error } = await db.from('portfolio_private_projects').select('body').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data?.body ?? null;
}

async function savePrivate(project: Record<string, unknown>) {
  const { error } = await db.from('portfolio_private_projects').upsert({
    slug: project.slug, body: project, updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function deletePrivate(slug: string) {
  const { error } = await db.from('portfolio_private_projects').delete().eq('slug', slug);
  if (error) throw error;
}

async function adminUser(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  const { data: auth, error: authError } = await db.auth.getUser(token);
  if (authError || !auth?.user) return null;
  const { data: approved, error: approvalError } = await db
    .from('portfolio_admin_users').select('user_id').eq('user_id', auth.user.id).maybeSingle();
  if (approvalError) throw approvalError;
  return approved ? auth.user : null;
}

async function isAdmin(req: Request) {
  return Boolean(await adminUser(req));
}

async function isUnlocked(req: Request) {
  const token = verifyToken(req.headers.get('x-portfolio-unlock'));
  if (token?.type !== 'unlock') return false;
  const access = await setting('access');
  return Boolean(access?.keyHash && token.version === access.updatedAt);
}

async function allowedAttempt(req: Request, kind: string) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const key = createHmac('sha256', signingKey).update(`${kind}:${ip}`).digest('hex');
  const { data, error } = await db.rpc('portfolio_check_attempt', { p_key: key });
  if (error) throw error;
  return data === true;
}

function routePath(req: Request) {
  const path = new URL(req.url).pathname;
  const marker = '/portfolio-api';
  const index = path.indexOf(marker);
  return index < 0 ? path : path.slice(index + marker.length) || '/';
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  if (origin && !allowedOrigins.has(origin)) return fail(req, 'Origin not allowed', 403);
  if (req.method === 'OPTIONS') return reply(req, { ok: true });

  const path = routePath(req);
  const method = req.method;
  try {
    if (method === 'GET' && path === '/api/health') return reply(req, { ok: true, mode: 'supabase' });

    if (method === 'GET' && path === '/api/projects') {
      const projects = await document('projects', []);
      return reply(req, projects.map((p: Record<string, unknown>) => p.locked ? toStub(p) : p));
    }
    const publicProject = path.match(/^\/api\/projects\/([a-z0-9-]{1,80})$/);
    if (method === 'GET' && publicProject) {
      const projects = await document('projects', []);
      const entry = projects.find((p: Record<string, unknown>) => p.slug === publicProject[1]);
      if (!entry) return fail(req, 'Project not found', 404);
      if (!entry.locked) return reply(req, entry);
      const privateEntry = await privateProject(publicProject[1]);
      if (!privateEntry) return fail(req, 'This protected case study has not been uploaded yet.', 404, { locked: true, stub: toStub(entry) });
      if (!await isUnlocked(req)) return fail(req, 'locked', 401, { locked: true, stub: toStub(entry) });
      return reply(req, { ...privateEntry, stub: toStub(entry) });
    }
    if (method === 'GET' && path === '/api/experience') return reply(req, await document('experience', []));
    if (method === 'GET' && path === '/api/about') return reply(req, await document('about', {}));

    if (method === 'POST' && path === '/api/unlock') {
      if (!await allowedAttempt(req, 'unlock')) return fail(req, 'Too many attempts. Try again in 15 minutes.', 429);
      const key = String((await body(req))?.key || '').trim();
      const access = await setting('access');
      if (!access?.keyHash) return fail(req, 'No access key has been set yet.', 409);
      if (!verifySecret(key, access.keyHash)) return fail(req, 'That key is not correct.', 401);
      return reply(req, { ok: true, token: signToken({ type: 'unlock', version: access.updatedAt, exp: Date.now() + unlockTtl }) });
    }
    if (method === 'GET' && path === '/api/unlock/status') {
      const access = await setting('access');
      return reply(req, { unlocked: await isUnlocked(req), hasKey: !!access?.keyHash });
    }

    if (method === 'POST' && path === '/api/auth/login') {
      if (!await allowedAttempt(req, 'admin')) return fail(req, 'Too many attempts. Try again in 15 minutes.', 429);
      const credentials = await body(req);
      const email = String(credentials?.email || '').trim();
      const password = String(credentials?.password || '');
      const client = authClient();
      const { data: signedIn, error: signInError } = await client.auth.signInWithPassword({ email, password });
      if (signInError || !signedIn?.session || !signedIn.user) return fail(req, 'Email or password is not correct.', 401);
      const { data: approved, error: approvalError } = await db
        .from('portfolio_admin_users').select('user_id').eq('user_id', signedIn.user.id).maybeSingle();
      if (approvalError) throw approvalError;
      if (!approved) return fail(req, 'This account is not enabled for portfolio administration.', 403);
      return reply(req, { ok: true, token: signedIn.session.access_token });
    }
    if (method === 'POST' && path === '/api/auth/logout') return reply(req, { ok: true });
    if (method === 'GET' && path === '/api/auth/session') return reply(req, { admin: await isAdmin(req) });

    if (method === 'POST' && path === '/api/auth/accept-invite') {
      const user = await adminUser(req);
      if (!user) return fail(req, 'Invitation is invalid or this account is not enabled.', 401);
      const password = String((await body(req))?.password || '');
      if (password.length < 12) return fail(req, 'Use a password of at least 12 characters.', 400);
      const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
      const changed = await fetch(`${projectUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      if (!changed.ok) return fail(req, 'Could not set the password. Request a new invitation.', 400);
      return reply(req, { success: true });
    }

    if (!await isAdmin(req)) return fail(req, 'Admin sign-in required', 401);

    if (method === 'POST' && path === '/api/projects') {
      const incoming = await body(req);
      if (!validProjects(incoming)) return fail(req, 'Invalid projects or duplicate slugs', 400);
      await saveDocument('projects', incoming);
      return reply(req, { success: true });
    }
    if (method === 'POST' && path === '/api/experience') {
      const incoming = await body(req);
      if (!validExperience(incoming)) return fail(req, 'Invalid experience entries', 400);
      await saveDocument('experience', incoming);
      return reply(req, { success: true });
    }
    if (method === 'POST' && path === '/api/about') {
      const incoming = await body(req);
      if (!incoming || Array.isArray(incoming) || typeof incoming.hero?.title !== 'string' || typeof incoming.about?.summary !== 'string') {
        return fail(req, 'Invalid about content', 400);
      }
      await saveDocument('about', incoming);
      return reply(req, { success: true });
    }
    if (method === 'POST' && path === '/api/resume') {
      if (req.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/pdf') {
        return fail(req, 'Choose a PDF file.', 415);
      }
      const bytes = await readResumePdf(req);
      if (!bytes) return fail(req, 'Choose a valid PDF under 5 MB.', 400);
      const current = await document('about', {});
      if (!current?.about || !current?.hero) return fail(req, 'About content is unavailable.', 409);

      const objectPath = `resumes/Harikrishna_Raju_CV_${Date.now()}_${randomBytes(4).toString('hex')}.pdf`;
      const bucket = db.storage.from('portfolio-documents');
      const { error: uploadError } = await bucket.upload(objectPath, bytes, {
        contentType: 'application/pdf', cacheControl: '3600', upsert: false,
      });
      if (uploadError) throw uploadError;

      const publicUrl = new URL(bucket.getPublicUrl(objectPath).data.publicUrl);
      publicUrl.searchParams.set('download', 'Harikrishna_Raju_Product_Designer_CV.pdf');
      const resumeUrl = publicUrl.toString();
      try {
        await saveDocument('about', { ...current, about: { ...current.about, resumeUrl } });
      } catch (error) {
        const { error: cleanupError } = await bucket.remove([objectPath]);
        if (cleanupError) console.error('Resume upload cleanup failed', cleanupError);
        throw error;
      }
      return reply(req, { success: true, resumeUrl });
    }
    if (method === 'GET' && path === '/api/private/projects') return reply(req, await privateProjects());

    const privateRoute = path.match(/^\/api\/private\/projects\/([a-z0-9-]{1,80})(\/lock)?$/);
    if (privateRoute && method === 'PUT' && !privateRoute[2]) {
      const incoming = { ...(await body(req)), slug: privateRoute[1], locked: true };
      await savePrivate(incoming);
      return reply(req, { success: true });
    }
    if (privateRoute && method === 'POST' && privateRoute[2]) {
      const projects = await document('projects', []);
      const index = projects.findIndex((p: Record<string, unknown>) => p.slug === privateRoute[1]);
      if (index < 0) return fail(req, 'Project not found', 404);
      const full = { ...projects[index] };
      delete full.locked;
      await savePrivate(full);
      projects[index] = toStub(full);
      await saveDocument('projects', projects);
      return reply(req, { success: true, locked: (await privateProjects()).map((p: { slug: string }) => p.slug) });
    }
    if (privateRoute && method === 'DELETE' && privateRoute[2]) {
      const full = await privateProject(privateRoute[1]);
      if (!full) return fail(req, 'Locked project not found', 404);
      const projects = await document('projects', []);
      const restored = { ...full };
      delete restored.locked;
      delete restored.stub;
      const index = projects.findIndex((p: Record<string, unknown>) => p.slug === privateRoute[1]);
      if (index >= 0) projects[index] = restored;
      else projects.push(restored);
      await saveDocument('projects', projects);
      await deletePrivate(privateRoute[1]);
      return reply(req, { success: true });
    }
    if (method === 'POST' && path === '/api/private/projects/import') {
      const incoming = await body(req);
      if (!Array.isArray(incoming) || !incoming.length || incoming.length > 100 ||
          incoming.some((p) => !p || typeof p.slug !== 'string' || !/^[a-z0-9-]{1,80}$/.test(p.slug))) {
        return fail(req, 'Invalid protected case studies', 400);
      }
      for (const project of incoming) await savePrivate({ ...project, locked: true });
      return reply(req, { success: true, count: incoming.length });
    }

    if (method === 'GET' && path === '/api/lock/status') {
      const access = await setting('access');
      return reply(req, {
        hasKey: !!access?.keyHash, updatedAt: access?.updatedAt || null,
        lockedSlugs: (await privateProjects()).map((p: { slug: string }) => p.slug),
      });
    }
    if (method === 'POST' && path === '/api/lock/key') {
      const key = String((await body(req))?.key || '').trim();
      if (!key) return fail(req, 'Enter an access key.', 400);
      await saveSetting('access', { keyHash: hashSecret(key), updatedAt: new Date().toISOString() });
      return reply(req, { success: true });
    }
    if (method === 'DELETE' && path === '/api/lock/key') {
      await saveSetting('access', { keyHash: null, updatedAt: new Date().toISOString() });
      return reply(req, { success: true });
    }
    if (method === 'POST' && path === '/api/admin/password') {
      const incoming = await body(req);
      const user = await adminUser(req);
      if (!user?.email) return fail(req, 'Admin sign-in required', 401);
      const next = String(incoming?.next || '');
      if (next.length < 8) return fail(req, 'Use a password of at least 8 characters.', 400);
      const client = authClient();
      const { data: confirmed, error: confirmError } = await client.auth.signInWithPassword({
        email: user.email, password: String(incoming?.current || ''),
      });
      if (confirmError || confirmed?.user?.id !== user.id || !confirmed.session) return fail(req, 'Current password is not correct.', 401);
      const changed = await fetch(`${projectUrl}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          apikey: publishableKey,
          Authorization: `Bearer ${confirmed.session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: next }),
      });
      if (!changed.ok) return fail(req, 'Failed to change the password.', 500);
      return reply(req, { success: true });
    }
    return fail(req, 'Not found', 404);
  } catch (error) {
    console.error('Portfolio API request failed', error);
    return fail(req, 'Request failed', 500);
  }
});
