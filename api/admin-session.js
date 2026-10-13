// GET /api/admin-session → 200 if the admin session cookie is valid, 401 otherwise.
// DELETE /api/admin-session → logs out (clears the cookie).
const { hasValidSession, sendJson, clearSessionCookie, sameOrigin, clientIp, rateLimit, tooMany } = require('./_lib');

module.exports = async (req, res) => {
  const rl = rateLimit(`session:${clientIp(req)}`, 100, 15 * 60 * 1000);
  if (!rl.ok) return tooMany(res, rl.retryAfter);

  if (req.method === 'DELETE') {
    if (!sameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });
    return sendJson(res, 200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });
  }
  if (req.method !== 'GET') return sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'GET, DELETE' });
  return hasValidSession(req) ? sendJson(res, 200, { ok: true }) : sendJson(res, 401, { error: 'unauthorized' });
};
