// Shared helpers for the Vercel serverless functions.
// Files prefixed with "_" inside /api are not exposed as routes by Vercel.
const crypto = require('crypto');

const SESSION_COOKIE = 'fs_admin';
const SESSION_TTL_SECONDS = 60 * 60; // 1 hour

// Fail closed: a missing secret means the feature is disabled, never open.
function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  return missing.length ? missing : null;
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

// Best-effort in-memory rate limiter. State lives per serverless instance, so it
// slows down abuse but is not a global guarantee; use Upstash/Redis for that.
const buckets = new Map();
function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, retryAfter: Math.ceil((entry.reset - now) / 1000) };
  }
  return { ok: true };
}

function sendJson(res, status, body, extraHeaders = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  for (const [k, v] of Object.entries(extraHeaders)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

function tooMany(res, retryAfter) {
  sendJson(res, 429, { error: 'too_many_requests', message: 'Demasiadas solicitudes. Inténtalo más tarde.' }, { 'Retry-After': String(retryAfter) });
}

function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function sign(payload) {
  return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('base64url');
}

function createSessionCookie() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return v.join('=');
  }
  return null;
}

function hasValidSession(req) {
  if (!process.env.ADMIN_SESSION_SECRET) return false;
  const token = readCookie(req, SESSION_COOKIE);
  if (!token || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!safeEqual(sig, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.role === 'admin' && Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

// Only accept requests whose Origin is this site (CSRF defence for cookie-auth endpoints).
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin GET/HEAD from some browsers omit Origin
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function log(event, details) {
  // Never log passwords, tokens or personal data.
  console.warn(JSON.stringify({ ts: new Date().toISOString(), event, ...details }));
}

module.exports = {
  requireEnv, clientIp, rateLimit, sendJson, tooMany, safeEqual,
  createSessionCookie, clearSessionCookie, hasValidSession, sameOrigin, log,
};
