// POST /api/admin-login  { password }  → sets an HttpOnly session cookie.
// The password lives only in the ADMIN_PASSWORD environment variable on Vercel.
const {
  requireEnv, clientIp, rateLimit, sendJson, tooMany, safeEqual,
  createSessionCookie, sameOrigin, log,
} = require('./_lib');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  const missing = requireEnv(['ADMIN_PASSWORD', 'ADMIN_SESSION_SECRET']);
  if (missing) {
    log('admin_login_misconfigured', { missing });
    return sendJson(res, 503, { error: 'admin_disabled', message: 'Acceso de administración no configurado.' });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // auth: 5 attempts / 15 min / IP
  if (!rl.ok) {
    log('admin_login_rate_limited', { ip });
    return tooMany(res, rl.retryAfter);
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password || password.length > 256 || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    log('admin_login_failed', { ip });
    return sendJson(res, 401, { error: 'invalid_credentials', message: 'Contraseña incorrecta.' });
  }

  log('admin_login_ok', { ip });
  return sendJson(res, 200, { ok: true }, { 'Set-Cookie': createSessionCookie() });
};
