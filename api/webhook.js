// POST /api/webhook — receives the beta sign-up form and forwards it to Make.com.
// The Make webhook URL and its shared secret stay server-side (env vars), so they
// never appear in the public page source.
const { requireEnv, clientIp, rateLimit, sendJson, tooMany, sameOrigin, log } = require('./_lib');

const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,24}$/;
const PHONE_RE = /^[+()\d\s.-]{0,25}$/;
const PIN_RE = /^[A-Z0-9]{6,10}$/;
const LANGS = new Set(['es', 'fr', 'de', 'it', 'en']);

function cleanText(v, max) {
  if (typeof v !== 'string') return '';
  // Strip control chars and angle brackets so nothing renders as HTML downstream.
  return v.replace(/[\u0000-\u001f\u007f<>]/g, ' ').trim().slice(0, max);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'POST' });
  if (!sameOrigin(req)) return sendJson(res, 403, { error: 'forbidden' });

  const ip = clientIp(req);
  const rl = rateLimit(`lead:${ip}`, 10, 15 * 60 * 1000); // form: 10 / 15 min / IP
  if (!rl.ok) {
    log('lead_rate_limited', { ip });
    return tooMany(res, rl.retryAfter);
  }

  const missing = requireEnv(['MAKE_WEBHOOK_URL', 'MAKE_WEBHOOK_SECRET']);
  if (missing) {
    log('lead_webhook_misconfigured', { missing });
    return sendJson(res, 503, { error: 'unavailable', message: 'Formulario temporalmente no disponible. Escríbenos a info@flowsuite.ch.' });
  }

  const b = req.body && typeof req.body === 'object' ? req.body : {};
  // Honeypot: real users never fill this hidden field.
  if (b.website) {
    log('lead_rejected', { ip, reason: 'honeypot' });
    return sendJson(res, 200, { ok: true });
  }

  const lead = {
    nombre: cleanText(b.nombre, 120),
    negocio: cleanText(b.negocio, 160),
    email: cleanText(b.email, 254),
    telefono: cleanText(b.telefono, 25),
    sector: cleanText(b.sector, 120),
    detalle: cleanText(b.detalle, 1000),
    pin: cleanText(b.pin, 10),
    idioma: LANGS.has(b.idioma) ? b.idioma : 'es',
    consentimiento: b.consentimiento === true,
    fuente: 'flowsuite-landing',
    fecha: new Date().toISOString(),
  };

  const errors = [];
  if (!lead.nombre) errors.push('nombre');
  if (!lead.negocio) errors.push('negocio');
  if (!EMAIL_RE.test(lead.email)) errors.push('email');
  if (!PHONE_RE.test(lead.telefono)) errors.push('telefono');
  if (!lead.sector) errors.push('sector');
  if (!PIN_RE.test(lead.pin)) errors.push('pin');
  if (!lead.consentimiento) errors.push('consentimiento');
  if (errors.length) {
    log('lead_rejected', { ip, reason: 'validation', fields: errors });
    return sendJson(res, 400, { error: 'invalid_input', fields: errors });
  }

  try {
    const r = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-FlowSuite-Secret': process.env.MAKE_WEBHOOK_SECRET },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      log('lead_forward_failed', { status: r.status });
      return sendJson(res, 502, { error: 'forward_failed' });
    }
  } catch (e) {
    log('lead_forward_error', { name: e.name });
    return sendJson(res, 502, { error: 'forward_failed' });
  }
  return sendJson(res, 200, { ok: true });
};
