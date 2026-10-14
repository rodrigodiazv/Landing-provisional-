'use strict';
// FlowSuite landing — i18n, lead form, client area (beta, browser-local) and admin panel.
// Admin access is checked server-side (/api/admin-login); no password lives in this file.

// ══════ STATE & UTILS ══════
const S = 'fs_';
const LANGS = ['fr', 'de', 'it', 'en', 'es'];
const AVATAR = '/assets/flow-avatar.jpg';
let LANG = 'fr';
let curClient = null;
let favOpen = true;
let selTone = 'profesional', selVoice = 'Clara', selCtf = 'post_ig', selGoal = 'captar', selFlow = 'auto';
let kbEntries = [], changes = [];
let _toast;

function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function lsGet(k, def) { try { const v = localStorage.getItem(S + k); return v === null ? def : v; } catch { return def; } }
function lsSet(k, v) { try { localStorage.setItem(S + k, v); } catch { /* storage unavailable */ } }
function lsJSON(k, def) { try { const v = localStorage.getItem(S + k); return v ? JSON.parse(v) : def; } catch { return def; } }
function pick(obj, path) { return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj); }
function t(key) {
  const d = window.FS_I18N || {};
  const v = pick(d[LANG], key);
  if (v !== undefined) return v;
  const f = pick(d.es, key);
  return f !== undefined ? f : key;
}
function $(id) { return document.getElementById(id); }

// ══════ SECTORS (single list for showcase, ticker, form and builder) ══════
const SECTORS = [
  { g: 'crea', color: 'var(--coral)', border: 'var(--cob)', items: [['music', '🎸'], ['studio', '🎙️', 1], ['photo', '📷'], ['tattoo', '💉', 1], ['jewel', '💎', 1], ['visual', '🖼️'], ['design', '🎨'], ['writer', '✍️'], ['ceram', '🏺', 1], ['creator', '🎬', 1]] },
  { g: 'well', color: 'var(--green)', border: 'rgba(34,197,94,.35)', items: [['yoga', '🧘'], ['altth', '🌿', 1], ['naturo', '🌱', 1], ['coach', '⭐'], ['martial', '🥋'], ['fitness', '💪']] },
  { g: 'health', color: 'var(--blue)', border: 'rgba(59,130,246,.35)', items: [['clinic', '🏥'], ['physio', '🦴'], ['psych', '🧠'], ['pharma', '💊']] },
  { g: 'food', color: 'var(--gold)', border: 'var(--gob)', items: [['rest', '🍽️'], ['hotel', '🏨'], ['cater', '🚐'], ['wine', '🍷']] },
  { g: 'edu', color: 'var(--teal)', border: 'var(--tlb)', items: [['musiclass', '🎶', 1], ['dance', '💃', 1], ['langsch', '🗣️'], ['tutor', '📚']] },
  { g: 'pro', color: 'var(--vi)', border: 'var(--vib)', items: [['law', '⚖️'], ['acct', '📊'], ['realestate', '🏠'], ['startup', '🚀'], ['freelance', '💻']] },
  { g: 'beauty', color: 'var(--coral)', border: 'var(--cob)', items: [['hair', '✂️'], ['spa', '💆'], ['boutique', '👗'], ['stylist', '🧥']] },
  { g: 'trade', color: 'var(--gold)', border: 'var(--gob)', items: [['garage', '🔧'], ['electric', '⚡'], ['carpentry', '🪚'], ['retail', '🛍️']] },
];
const TICKER = [['music', '🎸'], ['tattoo', '💉'], ['yoga', '🧘'], ['photo', '📷'], ['rest', '🍽️'], ['altth', '🌿'], ['jewel', '💎'], ['studio', '🎙️'], ['visual', '🖼️'], ['clinic', '🏥'], ['dance', '💃'], ['musiclass', '🎶'], ['realestate', '🏠'], ['hair', '✂️'], ['garage', '🔧']];
const AGENTS = [
  { id: 'flow', ico: '🤖', nm: 'FLOW', st: 'active' }, { id: 'booking', ico: '📅', nm: 'BOOKING', st: 'active' },
  { id: 'support', ico: '💎', nm: 'SUPPORT', st: 'soon' }, { id: 'content', ico: '✨', nm: 'CONTENT', st: 'soon' },
  { id: 'store', ico: '🛒', nm: 'STORE', st: 'soon' }, { id: 'hunter', ico: '🎯', nm: 'HUNTER', st: 'soon' },
];
// Public list prices (CHF/month). Change here to publish new prices for every visitor.
const PLAN_PRICES = { voice: 49, suite: 199, elite: 599 };

// Recharge packs (CHF). Change here to publish new prices for every visitor.
const PACKS = {
  voz100: { ico: '🎙️', chf: 22 }, voz300: { ico: '🎙️', chf: 60 }, voz500: { ico: '🎙️', chf: 90 },
  video30: { ico: '🎬', chf: 15 }, video100: { ico: '🎬', chf: 40 }, multi: { ico: '⚡', chf: 75 },
};
function getPackPrices() {
  const local = lsJSON('pack_prices', null);
  const out = {}; for (const k in PACKS) out[k] = PACKS[k].chf;
  return Object.assign(out, local || {});
}
function renderPacks() {
  const el = $('packs-grid'); if (!el) return;
  const prices = getPackPrices();
  el.innerHTML = Object.keys(PACKS).map((k) => {
    const p = t('packs.' + k);
    return `<div class="plan ${p.badge ? 'hi' : ''}">
      ${p.badge ? `<div class="plan-badge">${esc(p.badge)}</div>` : ''}
      <div style="font-size:26px;margin-bottom:8px">${PACKS[k].ico}</div>
      <div class="plan-nm">${esc(p.nm)}</div>
      <div class="plan-desc">${esc(p.desc)}</div>
      <div class="plan-price">${Number(prices[k]) || 0}<small> CHF</small></div>
      <div class="plan-note">${esc(p.note)}</div>
      <div style="font-size:11.5px;color:var(--teal);background:var(--tla);border:1px solid var(--tlb);border-radius:7px;padding:6px 11px;margin-bottom:14px">✓ ${esc(p.best)}</div>
      <button class="plan-btn ${p.badge ? 'tl' : 'gh'}" onclick="goTo('#contacto')">${esc(t('pk_btn'))}</button>
    </div>`;
  }).join('');
}

function sectorCount() { return SECTORS.reduce((n, g) => n + g.items.length, 0); }

function sectorOptionsHTML(selected) {
  const es = window.FS_I18N.es.sec;
  let html = `<option value="">${esc(t('f_sector_ph'))}</option>`;
  for (const g of SECTORS) {
    html += `<optgroup label="${esc(t('sec_groups.' + g.g))}">`;
    for (const [id] of g.items) {
      const v = es[id];
      html += `<option value="${esc(v)}" data-id="${id}"${v === selected ? ' selected' : ''}>${esc(t('sec.' + id))}</option>`;
    }
    html += '</optgroup>';
  }
  const other = window.FS_I18N.es.f_other;
  html += `<option value="${esc(other)}"${other === selected ? ' selected' : ''}>${esc(t('f_other'))}</option>`;
  return html;
}

// ══════ RENDERERS (landing) ══════
function renderTicker() {
  const el = $('sector-ticker'); if (!el) return;
  el.innerHTML = TICKER.map(([id, ico], i) =>
    `<span class="sector-badge" style="color:var(--teal);border-color:var(--tlb);animation-delay:${i * 0.05}s">${ico} ${esc(t('tick.' + id))}</span>`).join('');
}
function renderSectors() {
  const el = $('sectors-cats'); if (!el) return;
  el.innerHTML = SECTORS.map((g) =>
    `<div><div class="sc-name" style="color:${g.color}">${esc(t('sec_groups.' + g.g))}</div>
     <div class="sc-grid">${g.items.map(([id, ico, isNew]) =>
       `<div class="sc-chip" style="border-color:${g.border};color:${g.color}"><span class="sc-ico">${ico}</span>${esc(t('sec.' + id))}${isNew ? `<span class="new-tag" style="background:${g.color}22;color:${g.color}">${esc(t('sec_new'))}</span>` : ''}</div>`
     ).join('')}</div></div>`).join('');
  const sc = $('st-sectors'); if (sc) sc.textContent = Math.floor(sectorCount() / 10) * 10 + '+';
}
function renderAgents() {
  const el = $('agents-grid'); if (!el) return;
  const colors = ['var(--teal)', 'var(--vi)', 'var(--coral)', 'var(--gold)', 'var(--blue)', 'var(--green)'];
  const borders = ['var(--tlb)', 'var(--vib)', 'var(--cob)', 'var(--gob)', 'rgba(59,130,246,.35)', 'rgba(34,197,94,.35)'];
  el.innerHTML = AGENTS.map((a, i) => {
    const [role, desc] = t('agents.' + a.id);
    return `<div class="card agent-card" style="border-color:${borders[i % borders.length]}">
      <div style="font-size:28px;margin-bottom:9px">${a.ico}</div>
      <div style="font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:${colors[i % colors.length]};margin-bottom:4px">${esc(role)}</div>
      <div class="ac-nm">${a.nm}</div>
      <div class="ac-desc">${esc(desc)}</div>
      <span class="ac-badge tg ${a.st === 'active' ? 'tg-ok' : 'tg-w'}" style="position:absolute;top:14px;right:14px">${esc(t(a.st === 'active' ? 'ag_active' : 'ag_soon'))}</span>
    </div>`;
  }).join('');
}
function getPlanPrices() {
  const local = lsJSON('plan_prices', null);
  return Object.assign({}, PLAN_PRICES, local || {});
}
function renderPlans() {
  const el = $('plans-grid'); if (!el) return;
  const prices = getPlanPrices();
  el.innerHTML = ['voice', 'suite', 'elite'].map((k) => {
    const p = t('plans.' + k);
    const nm = k.charAt(0).toUpperCase() + k.slice(1);
    // Plan texts come from translations.js (trusted, may contain <strong>).
    return `<div class="plan ${p.badge ? 'hi' : ''}">
      ${p.badge ? `<div class="plan-badge">${esc(p.badge)}</div>` : ''}
      <div class="plan-nm">${nm}</div>
      <div class="plan-desc">${esc(p.desc)}</div>
      <div class="plan-price">${Number(prices[k]) || 0}<small> ${esc(t('plan_month'))}</small></div>
      <div class="plan-note">${esc(p.note)}</div>
      <ul class="plan-feats">${p.feats.map((f) => `<li>${f}</li>`).join('')}</ul>
      <div style="font-size:11px;color:var(--t2);background:var(--tla);border:1px solid var(--tlb);border-radius:7px;padding:7px 11px;margin-bottom:14px">⏱ ${esc(p.overage)}</div>
      <button class="plan-btn ${p.badge ? 'tl' : 'gh'}" onclick="goTo('#contacto')">${esc(p.badge ? t('plan_trial_btn') : t('plan_choose') + ' ' + nm)}</button>
    </div>`;
  }).join('');
}
function renderFAQ() {
  const el = $('faq-list'); if (!el) return;
  el.innerHTML = t('faq').map(([q, a]) => `<details class="qa"><summary>${esc(q)}</summary><div class="qa-a">${esc(a)}</div></details>`).join('');
  el.querySelectorAll('details.qa').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) el.querySelectorAll('details.qa').forEach((o) => { if (o !== d) o.open = false; });
  }));
}
function renderLeadSectors() {
  const sel = $('f-sector'); if (!sel) return;
  const cur = sel.value;
  sel.innerHTML = sectorOptionsHTML(cur);
}
function renderFooterLegal() {
  const el = $('foot-legal-links'); if (!el || !window.FS_LEGAL) return;
  const tabs = window.FS_LEGAL[LANG].tabs;
  el.innerHTML = window.FS_LEGAL_DOCS.map((d) => `<li><span onclick="showLegal('${d}')">${esc(tabs[d])}</span></li>`).join('');
}

// ══════ HERO DEMO CHAT (fictitious examples) ══════
let demoIdx = 0, chatInterval;
function renderDemoTabs() {
  const el = $('demo-tabs'); if (!el) return;
  el.innerHTML = t('demos').map((d, i) => `<button class="dtab ${i === demoIdx ? 'on' : ''}" onclick="switchDemo(${i},this)">${esc(d.tab)}</button>`).join('');
  startChat(demoIdx);
}
function switchDemo(i, btn) {
  document.querySelectorAll('.dtab').forEach((b) => b.classList.remove('on'));
  if (btn) btn.classList.add('on');
  demoIdx = i;
  startChat(i);
}
function startChat(i) {
  clearInterval(chatInterval);
  const demo = t('demos')[i];
  const c = $('ab-msgs'); if (!c || !demo) return;
  c.innerHTML = '';
  $('ab-name').textContent = demo.name + ' · FLOW';
  let idx = 0;
  function next() {
    if (idx >= demo.msgs.length) { clearInterval(chatInterval); return; }
    const m = demo.msgs[idx++];
    const d = document.createElement('div');
    d.className = 'msg ' + (m.b ? 'bot' : 'usr');
    const who = document.createElement('span');
    who.className = 'who';
    who.textContent = m.b ? 'FLOW' : t('demo_client');
    if (!m.b) who.style.textAlign = 'right';
    d.append(who, document.createTextNode(m.b || m.u));
    c.appendChild(d);
    c.scrollTop = c.scrollHeight;
  }
  next();
  chatInterval = setInterval(next, 1800);
}

// ══════ LANGUAGE ══════
function detectLang() {
  const saved = lsGet('lang', '');
  if (LANGS.includes(saved)) return saved;
  for (const l of navigator.languages || [navigator.language || '']) {
    const code = String(l).slice(0, 2).toLowerCase();
    if (LANGS.includes(code)) return code;
  }
  return 'fr';
}
function applyLang(lang) {
  if (!LANGS.includes(lang) || !window.FS_I18N) return;
  LANG = lang;
  document.documentElement.lang = lang;
  document.title = t('meta_title');
  const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('meta_desc'));
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  document.querySelectorAll('[data-i18n-title]').forEach((el) => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('.lb').forEach((b) => { b.classList.toggle('on', b.dataset.l === lang); b.setAttribute('aria-pressed', b.dataset.l === lang); });
  const sm = $('lang-sel-m'); if (sm) sm.value = lang;
  ['f-err', 'adm-err', 'cl-err'].forEach((id) => { const e = $(id); if (e) e.textContent = ''; });
  renderTicker(); renderSectors(); renderAgents(); renderPlans(); renderPacks(); renderFAQ(); renderLeadSectors(); renderFooterLegal(); renderDemoTabs();
  if ($('legal-modal')?.classList.contains('open')) lTab(curLegal);
}
function setLang(lang) { lsSet('lang', lang); applyLang(lang); }

// ══════ MODALS & PANELS ══════
function openModal(type) {
  const el = $('modal-' + type); if (!el) return;
  el.classList.add('open'); document.body.style.overflow = 'hidden';
  const inp = el.querySelector('input');
  if (inp) { inp.value = ''; setTimeout(() => inp.focus(), 80); }
  if (type === 'client') $('cl-err').textContent = '';
  if (type === 'admin') $('adm-err').textContent = '';
}
function closeModal(id) { const el = $(id); if (el) { el.classList.remove('open'); document.body.style.overflow = ''; } }
function openPanel(id) { const el = $(id); if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; } }
function closePanel(id) { const el = $(id); if (el) { el.classList.remove('open'); document.body.style.overflow = ''; } }
document.addEventListener('click', (e) => { if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); document.body.style.overflow = ''; } });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.open').forEach((el) => el.classList.remove('open'));
  closeLegal();
  document.body.style.overflow = '';
});

// ══════ LEGAL ══════
let curLegal = 'privacy';
function showLegal(doc) { $('legal-modal').classList.add('open'); lTab(doc); }
function closeLegal() { $('legal-modal').classList.remove('open'); }
function lTab(doc) {
  const L = window.FS_LEGAL?.[LANG]; if (!L) return;
  curLegal = window.FS_LEGAL_DOCS.includes(doc) ? doc : 'privacy';
  $('legal-tabs').innerHTML = window.FS_LEGAL_DOCS.map((d) =>
    `<button class="lt ${d === curLegal ? 'on' : ''}" onclick="lTab('${d}')">${esc(L.tabs[d])}</button>`).join('');
  $('legal-content').innerHTML = `<p class="legal-upd">${esc(L.updated)}</p>` + L[curLegal];
}

// ══════ COOKIES (only strictly necessary storage) ══════
function hideCookies() { $('cookie-banner').style.display = 'none'; lsSet('cookies', 'ok'); }

// ══════ LEAD FORM ══════
function genPIN() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const r = new Uint32Array(7); crypto.getRandomValues(r);
  let pin = '';
  for (let i = 0; i < 3; i++) pin += letters[r[i] % letters.length];
  for (let i = 3; i < 7; i++) pin += String(r[i] % 10);
  return pin;
}
function getClients() { return lsJSON('clients', {}); }
function saveClients(d) { lsSet('clients', JSON.stringify(d)); }
const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,190}\.[A-Za-z]{2,24}$/;

async function submitLead(e) {
  e.preventDefault();
  const v = (id) => $(id).value.trim();
  const nm = v('f-name'), bz = v('f-biz'), em = v('f-email'), tel = v('f-tel'), sc = $('f-sector').value, det = v('f-detail');
  const err = $('f-err'), btn = $('f-submit');
  if (!nm || !bz || !em || !sc) { err.textContent = t('f_err_required'); return; }
  if (!EMAIL_RE.test(em)) { err.textContent = t('f_err_email'); return; }
  if (!$('f-consent').checked) { err.textContent = t('f_err_consent'); return; }
  err.textContent = '';
  const pin = genPIN();
  const payload = { nombre: nm, negocio: bz, email: em, telefono: tel, sector: sc, detalle: det, pin, idioma: LANG, consentimiento: true, website: $('f-website').value };
  btn.disabled = true; btn.textContent = t('f_sending');
  try {
    const res = await fetch('/api/webhook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.status === 429) { err.textContent = t('f_err_rate'); return; }
    if (!res.ok) { err.textContent = t('f_err_send'); return; }
  } catch {
    err.textContent = t('f_err_send'); return;
  } finally {
    btn.disabled = false; btn.textContent = t('f_submit');
  }
  const cls = getClients();
  cls[pin] = { pin, name: nm, biz: bz, email: em, tel, plan: 'beta', startDate: new Date().toISOString(), sector: sc,
    agent: { nm: 'FLOW', gr: `¡Hola! Soy el asistente de ${bz}. ¿En qué puedo ayudarte?`, tone: 'profesional', voice: 'Iris Warm', lang: LANG, web: '' },
    kb: [], changes: [], sections: {} };
  saveClients(cls);
  $('form-wrap').style.display = 'none';
  $('form-ok').style.display = 'block';
  $('pin-val').textContent = pin;
}

// ══════ CLIENT LOGIN (beta: data stored in this browser) ══════
function doLogin() {
  const pin = $('cl-pin').value.trim().toUpperCase();
  if (!pin) { toast(t('cl_err_empty'), 'err'); return; }
  const clients = getClients();
  let c = clients[pin];
  if (!c && (pin === 'DEMO1234' || pin === 'FLOWDEMO')) {
    c = { pin, name: 'Demo', biz: 'Estudio de ejemplo', email: 'demo@flowsuite.ch', plan: 'beta', sector: 'Tatuador / Body art',
      startDate: new Date().toISOString(),
      agent: { nm: 'FLOW', gr: '¡Hola! Soy el asistente del estudio. ¿Cita, presupuesto o información?', tone: 'creativo', voice: 'Iris Warm', lang: 'es', web: '' },
      kb: [], changes: [], sections: {} };
    clients[pin] = c; saveClients(clients);
  }
  if (!c) { $('cl-err').textContent = t('cl_err_nf'); return; }
  curClient = c; closeModal('modal-client'); initClientPanel(); openPanel('client-panel');
}

// ══════ CLIENT PANEL ══════
function initClientPanel() {
  const c = curClient;
  $('cp-init').textContent = (c.name || c.biz || '?').charAt(0).toUpperCase();
  // No invented metrics: real numbers appear once the agent is connected.
  $('kp1').textContent = '—';
  $('kp2').textContent = '—';
  $('cp-ag-nm').textContent = (c.agent?.nm || 'FLOW') + ' · ' + (c.biz || 'tu negocio');
  $('cp-biz-desc').textContent = c.offer || 'Configura tu negocio para personalizar tu agente.';
  const pL = { beta: 'Beta', voice: 'Voice', suite: 'Suite', elite: 'Elite' }[c.plan] || c.plan;
  $('cp-plan').textContent = pL; $('cp-plan2').textContent = pL;
  $('cp-feed').innerHTML = '<p style="padding:14px 18px;font-size:13px;color:var(--t2)">Sin actividad registrada todavía. Las métricas aparecerán cuando tu agente esté conectado.</p>';
  ['cp-av-img', 'ag-av-dash'].forEach((id) => { const im = $(id); if (im) im.src = AVATAR; });
  const ag = c.agent || {};
  $('ag-nm').value = ag.nm || '';
  $('ag-gr').value = ag.gr || '';
  $('ag-lang').value = ag.lang || 'es';
  $('ag-web').value = ag.web || '';
  $('ag-preview').textContent = ag.gr || '—';
  selTone = ag.tone || 'profesional'; selVoice = ag.voice || 'Clara';
  document.querySelectorAll('#tone-opts .opt').forEach((b) => b.classList.toggle('on', b.textContent.toLowerCase().includes(selTone)));
  document.querySelectorAll('#voice-opts .voice-card').forEach((b) => b.classList.toggle('on', b.dataset.voice === selVoice));
  if ($('ag-sector') && c.sector) $('ag-sector').value = c.sector;
  if ($('ag-avoid')) $('ag-avoid').value = ag.avoid || '';
  if ($('ag-instructions')) $('ag-instructions').value = ag.instructions || '';
  ['fr', 'de', 'it', 'en', 'es'].forEach((l) => { const cb = $('alng-' + l); if (cb) cb.checked = (ag.extraLangs || []).includes(l); });
  setImg('ag-av-wrap', ag.avatar, '🤖', true); setImg('ag-prev-av', ag.avatar, '🤖', true);
  clientMedia = { logo: c.logo || null, photos: (c.photos || []).slice() };
  setImg('logo-preview', clientMedia.logo, '🏷️', false);
  renderPhotosGrid();
  updateAgentPreview();
  renderSectionEditor();
  renderAgentRosterCP();
  kbEntries = c.kb || []; changes = c.changes || [];
  renderKB(); renderKBAgent(); renderChgHist();
  renderNLExamples();
  renderIntegrations();
  $('biz-nm').value = c.biz || '';
  $('biz-city').value = c.city || '';
  $('biz-offer').value = c.offer || '';
  $('biz-tel').value = c.tel || '';
  $('biz-web').value = c.web || '';
}
function cpNav(id, el) {
  document.querySelectorAll('#client-panel .ppanel').forEach((p) => p.classList.remove('on'));
  document.querySelectorAll('#client-panel .sni').forEach((n) => n.classList.remove('on'));
  const panel = $('cpp-' + id); if (panel) panel.classList.add('on');
  if (el) el.classList.add('on');
  const ts = { dash: 'Panel de control', web: 'Mi landing page', agent: 'Mi agente', content: 'Contenido', kb: 'Base de conocimiento', changes: 'Solicitar cambios', int: 'Integraciones', settings: 'Ajustes' };
  $('cp-pbar').textContent = ts[id] || id;
}
function persistClient() { const cls = getClients(); if (curClient && cls[curClient.pin]) { cls[curClient.pin] = curClient; saveClients(cls); } }

const SECTIONS_DEF = [
  { id: 'hero', ico: '🦸', nm: 'Hero — Titular y CTA', color: 'var(--teal)',
    fields: [{ id: 'title', label: 'Titular principal', ph: 'Tu estudio. Tu arte. Tu mundo.' }, { id: 'subtitle', label: 'Subtítulo', ph: 'Descripción breve de tu negocio…', multiline: true },
      { id: 'cta', label: 'Texto del botón', ph: 'Reservar cita · Contactar…' }, { id: 'badge', label: 'Etiqueta destacada', ph: 'Abierto de martes a sábado' }] },
  { id: 'services', ico: '⭐', nm: 'Servicios y precios', color: 'var(--vi)',
    fields: [{ id: 'services_text', label: 'Lista de servicios (uno por línea)', ph: 'Sesión de estudio\nReportaje de eventos', multiline: true }, { id: 'price_note', label: 'Nota de precios', ph: 'Presupuesto sin compromiso' }] },
  { id: 'about', ico: '👤', nm: 'Sobre mí / Nosotros', color: 'var(--coral)',
    fields: [{ id: 'about_text', label: 'Tu historia (2–3 párrafos)', ph: 'Cuéntanos cómo empezaste…', multiline: true }, { id: 'certifications', label: 'Certificaciones / reconocimientos reales', ph: 'Solo datos verificables' }] },
  { id: 'gallery', ico: '📸', nm: 'Galería y portfolio', color: 'var(--gold)',
    fields: [{ id: 'gallery_note', label: 'Nota de la galería', ph: 'Últimos trabajos' }, { id: 'gallery_ig', label: 'Instagram / URL del portfolio', ph: '@tuinstagram · https://…' }] },
  { id: 'contact', ico: '💬', nm: 'Contacto y WhatsApp', color: 'var(--green)',
    fields: [{ id: 'cta_msg', label: 'Mensaje del botón de WhatsApp', ph: '¡Hola! Me interesa una cita…' }, { id: 'address', label: 'Dirección / zona', ph: 'Calle, ciudad · Online disponible' }, { id: 'hours', label: 'Horario de atención', ph: 'Mar–Sáb 10h–20h' }] },
  { id: 'testimonials', ico: '⭐', nm: 'Testimonios reales', color: 'var(--blue)',
    fields: [{ id: 't1', label: 'Testimonio 1 (nombre: texto) — solo con permiso del cliente', ph: 'Nombre: «texto real»' }, { id: 't2', label: 'Testimonio 2', ph: 'Nombre: «texto real»' }, { id: 't3', label: 'Testimonio 3', ph: 'Nombre: «texto real»' }] },
];
function renderSectionEditor() {
  const el = $('sections-editor'); if (!el) return;
  const saved = curClient?.sections || {};
  el.innerHTML = SECTIONS_DEF.map((s) => {
    const sv = saved[s.id] || {};
    return `<div class="sec-editor" id="se-${s.id}">
      <div class="se-hd" onclick="toggleSection('${s.id}')">
        <span class="se-ico">${s.ico}</span><span class="se-nm">${esc(s.nm)}</span>
        <span class="se-status tg" style="color:${s.color};background:${s.color}15;border-color:${s.color}33">${Object.keys(sv).length ? 'Personalizado' : 'Predeterminado'}</span>
        <span class="se-toggle" style="color:var(--t2)">›</span>
      </div>
      <div class="se-body">
        ${s.fields.map((f) => `<div class="pfg"><label style="color:${s.color}" for="se-${s.id}-${f.id}">${esc(f.label)}</label>
          ${f.multiline
            ? `<textarea id="se-${s.id}-${f.id}" rows="3" maxlength="2000" placeholder="${esc(f.ph)}">${esc(sv[f.id])}</textarea>`
            : `<input type="text" id="se-${s.id}-${f.id}" maxlength="300" placeholder="${esc(f.ph)}" value="${esc(sv[f.id])}">`}
        </div>`).join('')}
        <div style="display:flex;gap:8px;margin-top:4px"><button class="pbtn" onclick="saveSection('${s.id}')">💾 Guardar sección</button></div>
      </div>
    </div>`;
  }).join('');
}
function toggleSection(id) { const el = $('se-' + id); if (el) el.classList.toggle('open'); }
function saveSection(id, silent) {
  if (!curClient) return;
  const sd = SECTIONS_DEF.find((s) => s.id === id); if (!sd) return;
  curClient.sections = curClient.sections || {};
  curClient.sections[id] = {};
  sd.fields.forEach((f) => { const el = $(`se-${id}-${f.id}`); if (el) curClient.sections[id][f.id] = el.value.trim(); });
  persistClient();
  const st = document.querySelector(`#se-${id} .se-status`); if (st) st.textContent = 'Guardado ✓';
  if (!silent) toast('✅ Sección guardada', 'ok');
}
function saveAllSections() { SECTIONS_DEF.forEach((s) => saveSection(s.id, true)); toast('✅ Todas las secciones guardadas', 'ok'); }
function previewWeb() { toast('La vista previa estará disponible cuando FlowSuite publique tu web.'); }

function renderAgentRosterCP() {
  const el = $('agent-roster-cp'); if (!el) return;
  el.innerHTML = AGENTS.map((a) => {
    const [, desc] = t('agents.' + a.id);
    return `<div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--bd)">
      <span style="font-size:18px">${a.ico}</span>
      <div style="flex:1"><div style="font-size:13px;font-weight:700">${a.nm}</div><div style="font-size:11px;color:var(--t2)">${esc(desc)}</div></div>
      <span class="tg ${a.st === 'active' ? 'tg-ok' : 'tg-dim'}">${esc(t(a.st === 'active' ? 'ag_active' : 'ag_soon'))}</span>
    </div>`;
  }).join('');
}

// Template-based drafts (no AI call): the user reviews them before publishing.
function generateContent() {
  const prompt = $('ct-prompt').value.trim();
  if (!prompt) { toast('Describe qué quieres comunicar', 'err'); return; }
  const tag = (s) => String(s || '').split('/')[0].trim().replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
  const templates = {
    post_ig: `📸 ${prompt}\n\n¿Te identificas? 👇 Cuéntanos en comentarios.\n\n#${tag(curClient?.sector) || 'arte'} #${tag(curClient?.biz) || 'minegocio'}`,
    story: `🔥 ${prompt}\n\nDesliza para saber más →`,
    tiktok: `${prompt} 🎵\n\n¿Lo sabías? Comenta si quieres más contenido así 👇`,
    linkedin: `${prompt}\n\nEsto es lo que aprendí trabajando en el sector…\n\n¿Qué opinas? Deja tu comentario.`,
    email: `Asunto: ${prompt}\n\nHola [Nombre],\n\nQuería contarte que ${prompt.toLowerCase()}.\n\nSi te interesa saber más, responde a este email.\n\nUn saludo,\n${curClient?.name || 'FlowSuite'}`,
    wa_msg: `¡Hola! Soy ${curClient?.biz || 'FlowSuite'}. ${prompt} ¿Te puedo ayudar? 😊`,
  };
  $('ct-text').textContent = templates[selCtf] || templates.post_ig;
  $('ct-result').classList.add('on');
}
function copyContent() { cpCopy($('ct-text').textContent); }

function addKBTxt() { const v = $('kb-txt').value.trim(); if (!v) { toast('Escribe algo', 'err'); return; } kbEntries.push({ type: 'text', content: v.slice(0, 2000) }); $('kb-txt').value = ''; renderKB(); }
function addKBUrl() {
  const u = $('kb-url').value.trim(); if (!u) return;
  try { const p = new URL(u); if (!/^https?:$/.test(p.protocol)) throw 0; } catch { toast('URL no válida', 'err'); return; }
  kbEntries.push({ type: 'url', content: u }); $('kb-url').value = ''; renderKB(); toast('🌐 URL añadida', 'ok');
}
function kbDel(i) { kbEntries.splice(i, 1); renderKB(); }
function handleFiles(inp) { Array.from(inp.files).forEach((f) => kbEntries.push({ type: 'file', content: f.name + ' (' + (f.size / 1024).toFixed(0) + ' KB)' })); renderKB(); toast('📎 Archivo(s) añadido(s) a la lista', 'ok'); inp.value = ''; }
function renderKB() {
  renderKBAgent();
  const w = $('kb-list'); if (!w) return;
  if (!kbEntries.length) { w.innerHTML = '<p style="font-size:13px;color:var(--t2);padding:8px 0">Sin contenido añadido aún.</p>'; return; }
  w.innerHTML = kbEntries.map((e, i) =>
    `<div style="display:flex;gap:8px;align-items:flex-start;padding:9px;background:rgba(2,3,13,.4);border:1px solid var(--bd);border-radius:8px;margin-bottom:6px">
      <span>${e.type === 'url' ? '🌐' : e.type === 'file' ? '📎' : '📝'}</span>
      <div style="flex:1;font-size:13px;line-height:1.5;word-break:break-word">${esc(e.content)}</div>
      <button onclick="kbDel(${i})" aria-label="Eliminar" style="background:none;border:none;color:var(--t2);cursor:pointer;font-size:14px">✕</button>
    </div>`).join('');
}
function saveKB() { if (!curClient) return; curClient.kb = kbEntries; persistClient(); toast('✅ Base de conocimiento guardada', 'ok'); }

const NL_EXAMPLES = ['Cambia el titular por…', 'Añade que estamos cerrados los lunes', 'El precio del servicio X es…', 'Cambia el estilo a más profesional', 'Añade nuevo servicio de…', 'Responde solo en inglés'];
function renderNLExamples() {
  const el = $('nl-examples'); if (!el) return;
  el.innerHTML = NL_EXAMPLES.map((e, i) => `<button class="opt" onclick="$('nl-inp').value=NL_EXAMPLES[${i}]" style="font-size:11.5px;padding:5px 11px">${esc(e)}</button>`).join('');
}
function renderChgHist() {
  const w = $('chg-hist'); if (!w) return;
  if (!changes.length) { w.innerHTML = '<p style="font-size:13px;color:var(--t2);padding:10px 0">Sin cambios registrados.</p>'; return; }
  w.innerHTML = changes.slice(0, 8).map((c) =>
    `<div style="display:flex;gap:9px;padding:10px 0;border-bottom:1px solid var(--bd)"><span>✍️</span><div>
      <div style="font-size:13px">${esc(c.text)}</div>
      <div style="font-size:11px;color:var(--t2);margin-top:1px">${esc(c.desc)} · ${new Date(c.date).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</div></div></div>`).join('');
}
function applyNL() {
  const text = $('nl-inp').value.trim();
  if (!text) { toast('Describe el cambio', 'err'); return; }
  const l = text.toLowerCase();
  let desc = 'Solicitud registrada para el equipo FlowSuite.';
  if (l.includes('titular') || l.includes('título')) {
    const tt = $('se-hero-title'); const nt = text.split(' por ').slice(1).join(' por ').trim();
    if (tt && nt) { tt.value = nt; saveSection('hero', true); desc = 'Titular actualizado en tu borrador.'; }
  } else if (l.includes('horario') || l.includes('cerrado')) {
    const h = $('se-contact-hours'); if (h) { h.value = text; saveSection('contact', true); desc = 'Horario actualizado en tu borrador.'; }
  } else {
    kbEntries.push({ type: 'text', content: text }); renderKB(); desc = 'Añadido a tu base de conocimiento.';
  }
  changes.unshift({ text: text.slice(0, 1000), desc, date: new Date().toISOString() });
  if (curClient) { curClient.changes = changes; curClient.kb = kbEntries; persistClient(); }
  $('nl-res-txt').textContent = desc;
  $('nl-result').classList.add('on');
  $('nl-inp').value = '';
  renderChgHist();
}

const ALL_CHANNELS = [
  { id: 'wa', nm: 'WhatsApp Biz', ico: '💬' }, { id: 'tg', nm: 'Telegram', ico: '✈️' }, { id: 'fbm', nm: 'Messenger', ico: '💙' }, { id: 'sms', nm: 'SMS / Twilio', ico: '📨' },
  { id: 'ig', nm: 'Instagram', ico: '📸' }, { id: 'fb', nm: 'Facebook', ico: '👤' }, { id: 'tt', nm: 'TikTok', ico: '🎵' }, { id: 'yt', nm: 'YouTube', ico: '▶️' },
  { id: 'li', nm: 'LinkedIn', ico: '💼' }, { id: 'x', nm: 'X / Twitter', ico: '𝕏' }, { id: 'pin', nm: 'Pinterest', ico: '📌' }, { id: 'th', nm: 'Threads', ico: '🔗' },
  { id: 'gm', nm: 'Gmail', ico: '📧' }, { id: 'ot', nm: 'Outlook', ico: '📮' }, { id: 'gc', nm: 'G. Calendar', ico: '📅' }, { id: 'gb', nm: 'Google Biz', ico: '🗺️' },
  { id: 'hs', nm: 'HubSpot', ico: '🔶' }, { id: 'at', nm: 'Airtable', ico: '📋' }, { id: 'st', nm: 'Stripe', ico: '💳' }, { id: 'sp', nm: 'Shopify', ico: '🛒' },
  { id: 'mk', nm: 'Make.com', ico: '⚡' }, { id: 'zp', nm: 'Zapier', ico: '🔗' }, { id: 'tw', nm: 'Twint', ico: '🇨🇭' }, { id: 'pp', nm: 'PayPal', ico: '💰' },
  { id: 'ca', nm: 'Calendly', ico: '🗓️' }, { id: 'zo', nm: 'Zoom', ico: '📹' },
];
const CH_CATS = ['💬 Mensajería', '📱 Redes sociales', '📧 Email y agenda', '📅 CRM', '💳 Pagos y automatización', '🗓️ Reuniones'];
const CH_CHUNKS = [[0, 4], [4, 12], [12, 16], [16, 20], [20, 24], [24, 26]];
function renderIntegrations() {
  const el = $('int-grid-cp'); if (!el) return;
  const saved = curClient?.integrations || {};
  el.innerHTML = CH_CATS.map((cat, ci) => {
    const items = ALL_CHANNELS.slice(...CH_CHUNKS[ci]);
    return `<div style="margin-bottom:18px"><div style="font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--t2);margin-bottom:9px">${cat}</div>
      <div class="int-grid3">${items.map((c) => {
        const on = !!saved[c.id];
        return `<div class="int-c ${on ? 'conn' : ''}" onclick="toggleInt(this,'${c.id}')"><span class="int-ico">${c.ico}</span><div><div class="int-nm">${c.nm}</div>
          <div class="int-st ${on ? 'ok' : ''}">${on ? 'Solicitado' : 'No solicitado'}</div></div></div>`;
      }).join('')}</div></div>`;
  }).join('');
}
function toggleInt(el, id) {
  if (!curClient) return;
  const on = !el.classList.contains('conn');
  el.classList.toggle('conn', on);
  const st = el.querySelector('.int-st'); if (st) { st.className = 'int-st' + (on ? ' ok' : ''); st.textContent = on ? 'Solicitado' : 'No solicitado'; }
  curClient.integrations = Object.assign({}, curClient.integrations, { [id]: on });
  persistClient();
  const ch = ALL_CHANNELS.find((c) => c.id === id);
  toast(on ? `✅ ${ch.nm}: solicitud registrada` : `○ ${ch.nm}: solicitud retirada`, on ? 'ok' : '');
}
function saveAgent() {
  if (!curClient) return;
  const web = $('ag-web').value.trim();
  const ag = { nm: $('ag-nm').value.trim().slice(0, 40) || 'FLOW', gr: $('ag-gr').value.trim().slice(0, 500), lang: $('ag-lang').value, web, tone: selTone, voice: selVoice };
  curClient.agent = ag; persistClient();
  $('ag-preview').textContent = ag.gr || ag.nm;
  $('cp-ag-nm').textContent = ag.nm + ' · ' + (curClient.biz || 'tu negocio');
  toast('✅ Agente guardado', 'ok');
}
function saveBiz() {
  if (!curClient) return;
  Object.assign(curClient, { biz: $('biz-nm').value.trim(), city: $('biz-city').value.trim(), offer: $('biz-offer').value.trim(), tel: $('biz-tel').value.trim(), web: $('biz-web').value.trim() });
  persistClient();
  $('cp-biz-desc').textContent = curClient.offer || 'Configura tu negocio para personalizar tu agente.';
  toast('✅ Negocio guardado', 'ok');
}
function changePIN() {
  const np = $('new-pin').value.trim().toUpperCase();
  if (!/^[A-Z0-9]{6,10}$/.test(np)) { toast('El PIN debe tener 6–10 letras o números', 'err'); return; }
  const cls = getClients();
  if (cls[np]) { toast('Ese PIN no está disponible', 'err'); return; }
  cls[np] = { ...cls[curClient.pin], pin: np }; delete cls[curClient.pin]; saveClients(cls); curClient.pin = np;
  $('new-pin').value = '';
  toast('✅ PIN cambiado', 'ok');
}
function selOpt(el, type, val) {
  const p = el.closest('.opt-row');
  p.querySelectorAll('.opt').forEach((b) => b.classList.remove('on'));
  el.classList.add('on');
  if (type === 'tone') selTone = val; else if (type === 'voice') selVoice = val; else if (type === 'ctf') selCtf = val;
  else if (type === 'goal') selGoal = val; else if (type === 'flow') selFlow = val;
}

// ══════ CLIENT: AGENT TABS, MEDIA (beta, stored in this browser) ══════
let clientMedia = { logo: null, photos: [] };
const MAX_PHOTOS = 6;
function setImg(id, src, fallback, round) {
  const el = $(id); if (!el) return;
  el.textContent = '';
  if (src && /^data:image\/(png|jpeg|webp);base64,/.test(src)) {
    const im = document.createElement('img');
    im.src = src; im.alt = '';
    im.style.cssText = 'width:100%;height:100%;object-fit:' + (round ? 'cover;border-radius:50%' : 'contain;border-radius:10px');
    el.appendChild(im);
  } else { el.textContent = fallback; }
}
// Downscale images before storing them so they fit in browser storage.
function readImage(file, maxSide, cb) {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { toast('Formato no admitido (PNG, JPG o WebP)', 'err'); return; }
  if (file.size > 15 * 1024 * 1024) { toast('Imagen demasiado grande (máx. 15 MB)', 'err'); return; }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, maxSide / Math.max(img.width, img.height));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    cb(cv.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.82));
  };
  img.onerror = () => { URL.revokeObjectURL(url); toast('No se pudo leer la imagen', 'err'); };
  img.src = url;
}
function agTab(id, btn) {
  document.querySelectorAll('.ag-tab').forEach((b) => b.classList.remove('on'));
  document.querySelectorAll('.ag-panel').forEach((p) => p.classList.remove('on'));
  if (btn) btn.classList.add('on');
  const panel = $('agtab-' + id); if (panel) panel.classList.add('on');
}
function pickVoice(btn, voice) {
  document.querySelectorAll('.voice-card').forEach((b) => b.classList.remove('on'));
  btn.classList.add('on');
  selVoice = voice;
  if (voice === 'custom') toast('🎙️ La clonación de voz se activa bajo consulta', 'ok');
}
function updateAgentPreview() {
  const nm = $('ag-nm')?.value.trim() || 'tu agente';
  const gr = $('ag-gr')?.value.trim();
  const prev = $('ag-preview'); if (prev) prev.textContent = gr || `¡Hola! Soy ${nm}. ¿En qué puedo ayudarte?`;
}
function handleAgentAvatar(inp) {
  const f = inp.files[0]; inp.value = ''; if (!f || !curClient) return;
  readImage(f, 256, (src) => {
    curClient.agent = Object.assign({}, curClient.agent, { avatar: src });
    setImg('ag-av-wrap', src, '🤖', true); setImg('ag-prev-av', src, '🤖', true);
    persistClientSafe('✅ Avatar guardado');
  });
}
function addKBEntry() {
  const v = $('kb-txt-ag')?.value.trim(); if (!v) { toast('Escribe algo primero', 'err'); return; }
  kbEntries.push({ type: 'text', content: v.slice(0, 4000) }); $('kb-txt-ag').value = ''; renderKB();
  toast('✅ Añadido al conocimiento del agente', 'ok');
}
function addKBUrlAgent() {
  const u = $('kb-url-ag')?.value.trim(); if (!u) return;
  try { const p = new URL(u); if (!/^https?:$/.test(p.protocol)) throw 0; } catch { toast('URL no válida', 'err'); return; }
  kbEntries.push({ type: 'url', content: u }); $('kb-url-ag').value = ''; renderKB(); toast('🌐 URL añadida', 'ok');
}
function handleKBFiles(inp) {
  const files = Array.from(inp.files); inp.value = '';
  files.forEach((f) => kbEntries.push({ type: 'file', content: f.name + ' (' + (f.size / 1024).toFixed(0) + ' KB)' }));
  renderKB(); toast(`📎 ${files.length} archivo(s) añadido(s) a la lista`, 'ok');
}
function renderKBAgent() {
  const el = $('kb-list-ag'); if (!el) return;
  if (!kbEntries.length) { el.innerHTML = '<div style="font-size:12.5px;color:var(--t2);padding:8px">Sin entradas todavía.</div>'; return; }
  el.innerHTML = kbEntries.map((e, i) =>
    `<div style="display:flex;align-items:center;gap:8px;padding:7px 8px;border-bottom:1px solid var(--bd);font-size:12.5px">
      <span style="opacity:.6">${e.type === 'file' ? '📎' : e.type === 'url' ? '🌐' : '✏️'}</span>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(e.content)}</span>
      <button onclick="kbDel(${i})" aria-label="Eliminar" style="background:none;border:none;color:var(--t2);cursor:pointer;font-size:14px;padding:2px">✕</button></div>`).join('');
}
function persistClientSafe(okMsg) {
  try {
    const cls = getClients(); cls[curClient.pin] = curClient;
    localStorage.setItem(S + 'clients', JSON.stringify(cls));
    if (okMsg) toast(okMsg, 'ok');
  } catch {
    toast('No hay espacio suficiente en este navegador. Usa menos fotos o más pequeñas.', 'err');
  }
}
function saveAndApplyAgent() {
  if (!curClient) return;
  const extraLangs = ['fr', 'de', 'it', 'en', 'es'].filter((l) => $('alng-' + l)?.checked);
  curClient.agent = Object.assign({}, curClient.agent, {
    nm: $('ag-nm').value.trim().slice(0, 40) || 'FLOW', gr: $('ag-gr').value.trim().slice(0, 500), lang: $('ag-lang').value,
    web: $('ag-web').value.trim().slice(0, 200), tone: selTone, voice: selVoice, goal: selGoal, flow: selFlow, extraLangs,
    avoid: $('ag-avoid')?.value.trim().slice(0, 1000) || '', instructions: $('ag-instructions')?.value.trim().slice(0, 2000) || '',
  });
  curClient.sector = $('ag-sector')?.value || curClient.sector;
  curClient.kb = kbEntries;
  $('cp-ag-nm').textContent = curClient.agent.nm + ' · ' + (curClient.biz || 'tu negocio');
  persistClientSafe('✅ Cambios guardados. FlowSuite los aplicará a tu agente de voz.');
}
// Template only (no AI call): a starting point the client can edit.
function generateAgentPrompt() {
  const nm = $('ag-nm')?.value.trim() || 'el agente';
  const sector = $('ag-sector')?.value || 'el negocio';
  const extra = $('ag-instructions')?.value.trim() || '';
  const avoid = $('ag-avoid')?.value.trim() || '';
  const goals = { captar: 'captar contactos interesados', agenda: 'agendar citas', info: 'informar y cualificar', vender: 'cerrar ventas' };
  const text = `Eres ${nm}, el asistente de voz de un negocio del sector «${sector}». Eres un sistema de inteligencia artificial y lo dices si te lo preguntan. Hablas en el idioma del usuario con un tono ${selTone}.

Objetivo principal: ${goals[selGoal] || goals.captar}.

Flujo:
1. Saluda y pregunta en qué puedes ayudar.
2. Identifica la necesidad principal con 2 preguntas.
3. Explica en una frase cómo puede ayudar el negocio.
4. Propón el siguiente paso concreto.
5. Pide nombre y forma de contacto, solo con permiso del usuario.
${avoid ? '\nNunca digas: ' + avoid : ''}${extra ? '\nInstrucciones adicionales: ' + extra : ''}

Nunca inventes información: si no sabes algo, dilo y ofrece que el equipo responda. Nunca prometas resultados garantizados. Máximo 2–3 frases por turno.`;
  const el = $('guion-result'); if (el) { el.style.display = 'block'; el.textContent = text; }
  const ins = $('ag-instructions'); if (ins && !ins.value.trim()) ins.value = text.slice(0, 2000);
}
function handleLogoUpload(inp) {
  const f = inp.files[0]; inp.value = ''; if (!f) return;
  readImage(f, 512, (src) => { clientMedia.logo = src; setImg('logo-preview', src, '🏷️', false); toast('Logo listo. Pulsa «Guardar».', 'ok'); });
}
function handlePhotosUpload(inp) {
  const files = Array.from(inp.files); inp.value = '';
  const room = MAX_PHOTOS - clientMedia.photos.length;
  if (room <= 0) { toast(`Máximo ${MAX_PHOTOS} fotos`, 'err'); return; }
  files.slice(0, room).forEach((f) => readImage(f, 1000, (src) => { clientMedia.photos.push({ name: f.name.slice(0, 80), src }); renderPhotosGrid(); }));
  if (files.length > room) toast(`Solo se añadieron ${room} foto(s) (máximo ${MAX_PHOTOS})`, 'err');
}
function renderPhotosGrid() {
  const el = $('photos-grid'); if (!el) return;
  if (!clientMedia.photos.length) { el.innerHTML = '<div style="grid-column:1/-1;font-size:12.5px;color:var(--t2);padding:8px 0">Sin fotos cargadas aún.</div>'; return; }
  el.innerHTML = '';
  clientMedia.photos.forEach((p, i) => {
    const box = document.createElement('div');
    box.style.cssText = 'position:relative;border-radius:9px;overflow:hidden;aspect-ratio:1;background:var(--s2)';
    const im = document.createElement('img'); im.src = p.src; im.alt = p.name; im.style.cssText = 'width:100%;height:100%;object-fit:cover';
    const b = document.createElement('button'); b.textContent = '✕'; b.setAttribute('aria-label', 'Eliminar');
    b.style.cssText = 'position:absolute;top:4px;right:4px;background:rgba(0,0,0,.7);border:none;color:white;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer';
    b.onclick = () => removePhoto(i);
    box.append(im, b); el.appendChild(box);
  });
}
function removePhoto(i) { clientMedia.photos.splice(i, 1); renderPhotosGrid(); }
function saveMedia() {
  if (!curClient) return;
  curClient.logo = clientMedia.logo; curClient.photos = clientMedia.photos;
  if (clientMedia.logo) { const av = $('cp-av-img'); if (av) av.src = clientMedia.logo; }
  persistClientSafe('✅ Logo y fotos guardados');
}

// ══════ ADMIN (session verified by the server) ══════
async function openAdmin() {
  try {
    const r = await fetch('/api/admin-session', { credentials: 'same-origin', cache: 'no-store' });
    if (r.ok) { initAdmin(); openPanel('admin-panel'); return; }
  } catch { /* fall through to login */ }
  openModal('admin');
}
async function doAdmin() {
  const pwEl = $('adm-pw'), err = $('adm-err'), btn = $('adm-btn');
  const password = pwEl.value;
  if (!password) return;
  btn.disabled = true; err.textContent = '';
  try {
    const r = await fetch('/api/admin-login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    pwEl.value = '';
    if (r.ok) { closeModal('modal-admin'); initAdmin(); openPanel('admin-panel'); return; }
    err.textContent = t({ 401: 'adm_err', 429: 'adm_err_rate', 503: 'adm_err_off' }[r.status] || 'adm_err_net');
  } catch {
    err.textContent = t('adm_err_net');
  } finally {
    btn.disabled = false;
  }
}
async function adminLogout() {
  try { await fetch('/api/admin-session', { method: 'DELETE', credentials: 'same-origin' }); } catch { /* ignore */ }
  closePanel('admin-panel');
  toast('Sesión cerrada', 'ok');
}
function initAdmin() {
  const cls = Object.values(getClients());
  const prices = getPlanPrices();
  const active = cls.filter((c) => c.plan !== 'beta');
  $('a-mrr').textContent = active.reduce((s, c) => s + (Number(prices[c.plan]) || 0), 0) || '—';
  $('a-cl').textContent = active.length || '—';
  $('a-beta').textContent = cls.filter((c) => c.plan === 'beta').length || '—';
  const recent = cls.slice().sort((a, b) => String(b.startDate).localeCompare(String(a.startDate))).slice(0, 5);
  $('a-feed').innerHTML = recent.length
    ? recent.map((c) => `<div class="feed-item"><div class="feed-ico">👤</div><div><div class="feed-tx">${esc(c.biz || c.name)} · ${esc(c.plan)}</div><div class="feed-time">${new Date(c.startDate).toLocaleString('es-ES')}</div></div></div>`).join('')
    : '<p style="padding:14px 18px;font-size:13px;color:var(--t2)">Sin actividad registrada en este navegador. Los leads del formulario llegan a Make.com.</p>';
  renderClients(); renderAdminAgents(); renderAdminChannels(); renderPlanEditor(); renderPacksAdminEditor(); builderInit();
}
function apNav(id, el) {
  document.querySelectorAll('#admin-panel .ppanel').forEach((p) => p.classList.remove('on'));
  document.querySelectorAll('#admin-panel .sni').forEach((n) => n.classList.remove('on'));
  const panel = $('app-' + id); if (panel) panel.classList.add('on');
  if (el) el.classList.add('on');
  const ts = { dash: 'Dashboard', clients: 'Clientes', 'agents-admin': 'Agentes', 'builder-admin': 'Builder', plans: 'Planes y tarifas', 'channels-admin': 'Canales', config: 'Configuración' };
  $('ap-pbar').textContent = ts[id] || id;
}
let showCF = false;
function toggleCreateForm() { showCF = !showCF; $('create-form-card').style.display = showCF ? 'block' : 'none'; $('new-pin-box').style.display = 'none'; }
function createClient() {
  const nm = $('cc-nm').value.trim(), em = $('cc-email').value.trim(), bz = $('cc-biz').value.trim(), pl = $('cc-plan').value;
  if (!nm || !EMAIL_RE.test(em)) { toast('Nombre y email válidos obligatorios', 'err'); return; }
  const cls = getClients();
  let pin = genPIN(); while (cls[pin]) pin = genPIN();
  cls[pin] = { pin, name: nm, email: em, biz: bz, plan: pl, startDate: new Date().toISOString(),
    agent: { nm: 'FLOW', gr: `¡Hola! Soy el asistente de ${bz || nm}.`, tone: 'profesional', voice: 'Iris Warm', lang: 'es', web: '' }, kb: [], changes: [], sections: {} };
  saveClients(cls);
  $('new-pin-code').textContent = pin;
  $('new-pin-box').style.display = 'block';
  renderClients();
  toast('✅ Cliente creado', 'ok');
}
function renderClients() {
  const cls = Object.values(getClients());
  const lm = { beta: 'Beta', voice: 'Voice', suite: 'Suite', elite: 'Elite' };
  const tm = { beta: 'tg-w', voice: 'tg-tl', suite: 'tg-vi', elite: 'tg-ok' };
  if (!cls.length) { $('clients-tbl').innerHTML = '<p style="padding:20px;text-align:center;font-size:13px;color:var(--t2)">Sin clientes en este navegador. Crea el primero.</p>'; return; }
  $('clients-tbl').innerHTML = '<table><thead><tr><th>Cliente / Negocio</th><th>Plan</th><th>Inicio</th><th>PIN</th><th></th></tr></thead><tbody>' +
    cls.map((c) => `<tr><td><strong>${esc(c.biz || c.name)}</strong><div style="font-size:11px;color:var(--t2)">${esc(c.email)}</div></td>
      <td><span class="tg ${tm[c.plan] || 'tg-dim'}">${esc(lm[c.plan] || c.plan)}</span></td>
      <td style="font-size:12px;color:var(--t2)">${new Date(c.startDate).toLocaleDateString('es-ES')}</td>
      <td style="font-family:monospace;font-size:12px;color:var(--teal)">${esc(c.pin)}</td>
      <td><button class="pbtn-g" onclick="cpCopy(${esc(JSON.stringify(c.pin))})">Copiar</button></td></tr>`).join('') + '</tbody></table>';
}
function renderAdminAgents() {
  const el = $('admin-agent-roster'); if (!el) return;
  el.innerHTML = AGENTS.map((a) => {
    const [role, desc] = window.FS_I18N.es.agents[a.id];
    return `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--s1);border:1px solid var(--bd);border-radius:10px;margin-bottom:8px">
      <span style="font-size:22px">${a.ico}</span>
      <div style="flex:1"><div style="font-size:13.5px;font-weight:800;font-family:var(--serif)">${a.nm} — ${esc(role)}</div><div style="font-size:12px;color:var(--t2)">${esc(desc)}</div></div>
      <span class="tg ${a.st === 'active' ? 'tg-ok' : 'tg-w'}">${a.st === 'active' ? 'Disponible' : 'Próximamente'}</span></div>`;
  }).join('');
}
function renderAdminChannels() {
  const el = $('channels-admin-grid'); if (!el) return;
  const saved = lsJSON('adm_ch', {});
  el.innerHTML = CH_CATS.map((cat, ci) => {
    const items = ALL_CHANNELS.slice(...CH_CHUNKS[ci]);
    return `<div style="margin-bottom:18px"><div style="font-size:10.5px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--t2);margin-bottom:9px">${cat}</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${items.map((c) => {
        const on = !!saved[c.id];
        return `<div style="background:var(--s1);border:1px solid ${on ? 'rgba(34,197,94,.28)' : 'var(--bd)'};border-radius:10px;padding:11px 8px;text-align:center">
          <div style="font-size:20px;margin-bottom:4px">${c.ico}</div><div style="font-size:10px;font-weight:700;color:${on ? 'var(--ok)' : 'var(--t2)'}">${c.nm}</div>
          <div style="display:flex;justify-content:center;margin-top:6px"><div class="toggle ${on ? 'on' : ''}" onclick="toggleAdmCh('${c.id}',this)"></div></div></div>`;
      }).join('')}</div></div>`;
  }).join('');
}
function toggleAdmCh(id, el) {
  el.classList.toggle('on');
  const saved = lsJSON('adm_ch', {}); saved[id] = el.classList.contains('on'); lsSet('adm_ch', JSON.stringify(saved));
  renderAdminChannels();
}
function renderPlanEditor() {
  const p = getPlanPrices();
  $('plan-editor').innerHTML = ['voice', 'suite', 'elite'].map((k) =>
    `<div style="background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:16px">
      <div style="font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:12px">${k}</div>
      <div class="pfg"><label for="pp-${k}">CHF/mes</label><input id="pp-${k}" type="number" min="0" max="100000" step="1" value="${Number(p[k]) || 0}"></div>
      <div style="font-size:11.5px;color:var(--t2)">Textos del plan: <code>translations.js</code> (5 idiomas).</div>
    </div>`).join('');
}
function savePlansAdmin() {
  const out = {};
  for (const k of ['voice', 'suite', 'elite']) { const n = Math.round(Number($('pp-' + k).value)); if (Number.isFinite(n) && n >= 0) out[k] = n; }
  lsSet('plan_prices', JSON.stringify(out)); renderPlans(); toast('✅ Precios guardados en este navegador', 'ok');
}

function renderPacksAdminEditor() {
  const el = $('packs-admin-editor'); if (!el) return;
  const p = getPackPrices();
  const names = window.FS_I18N.es.packs;
  el.innerHTML = Object.keys(PACKS).map((k) =>
    `<div style="background:var(--s1);border:1px solid var(--bd);border-radius:var(--r);padding:16px">
      <div style="font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);margin-bottom:10px">${PACKS[k].ico} ${esc(names[k].nm)}</div>
      <div class="pfg"><label for="pk-${k}">CHF</label><input id="pk-${k}" type="number" min="0" max="100000" step="1" value="${Number(p[k]) || 0}"></div>
    </div>`).join('');
}
function savePacksAdmin() {
  const out = {};
  for (const k of Object.keys(PACKS)) { const n = Math.round(Number($('pk-' + k).value)); if (Number.isFinite(n) && n >= 0) out[k] = n; }
  lsSet('pack_prices', JSON.stringify(out)); renderPacks(); toast('✅ Precios de packs guardados en este navegador', 'ok');
}

// ══════ BUILDER (admin only) ══════
const builderState = { url: '', wa: '', tel: '' };
const BUILDER_WA = {
  es: (n, c, s, url) => `¡Hola!\n\nHe preparado una demo de FlowSuite para ${n}${c ? ' en ' + c : ''}.\n\n• Asistente de IA 24/7 en 5 idiomas\n• Captación de contactos\n• Adaptado a: ${s}\n\n${url}\n\nIncluye 14 días de prueba gratis, sin tarjeta ni compromiso.\n¿Tienes 5 minutos para verla?\n\n— FlowSuite · flowsuite.ch`,
  fr: (n, c, s, url) => `Bonjour !\n\nJ’ai préparé une démo FlowSuite pour ${n}${c ? ' à ' + c : ''}.\n\n• Assistant IA 24/7 en 5 langues\n• Acquisition de contacts\n• Adapté à : ${s}\n\n${url}\n\n14 jours d’essai gratuit, sans carte ni engagement.\nTu as 5 minutes pour la voir ?\n\n— FlowSuite · flowsuite.ch`,
  de: (n, c, s, url) => `Hallo!\n\nIch habe eine FlowSuite-Demo für ${n}${c ? ' in ' + c : ''} vorbereitet.\n\n• KI-Assistent 24/7 in 5 Sprachen\n• Kontaktgewinnung\n• Angepasst an: ${s}\n\n${url}\n\n14 Tage kostenlos testen, ohne Karte und unverbindlich.\nHast du 5 Minuten, um sie anzuschauen?\n\n— FlowSuite · flowsuite.ch`,
  it: (n, c, s, url) => `Ciao!\n\nHo preparato una demo di FlowSuite per ${n}${c ? ' a ' + c : ''}.\n\n• Assistente IA 24/7 in 5 lingue\n• Acquisizione contatti\n• Adattato a: ${s}\n\n${url}\n\n14 giorni di prova gratuita, senza carta né impegno.\nHai 5 minuti per vederla?\n\n— FlowSuite · flowsuite.ch`,
  en: (n, c, s, url) => `Hi!\n\nI’ve prepared a FlowSuite demo for ${n}${c ? ' in ' + c : ''}.\n\n• AI assistant 24/7 in 5 languages\n• Lead capture\n• Tailored to: ${s}\n\n${url}\n\nIncludes a 14-day free trial, no card, no commitment.\nDo you have 5 minutes to take a look?\n\n— FlowSuite · flowsuite.ch`,
};
function builderInit() {
  const sel = $('bd-sector'); if (!sel || sel.options.length) return;
  sel.innerHTML = sectorOptionsHTML('');
}
function httpsUrlOrEmpty(v) {
  if (!v) return '';
  try { const u = new URL(v); return u.protocol === 'https:' ? u.href : null; } catch { return null; }
}
function builderGenerate() {
  const err = $('bd-err');
  const n = $('bd-name').value.trim();
  const opt = $('bd-sector').selectedOptions[0];
  const lang = $('bd-lang').value;
  if (!n || !opt || !opt.value) { err.textContent = 'Nombre y sector son obligatorios.'; return; }
  const web = httpsUrlOrEmpty($('bd-web').value.trim());
  const logo = httpsUrlOrEmpty($('bd-logo').value.trim());
  if (web === null || logo === null) { err.textContent = 'La web y el logo deben ser URLs https:// válidas.'; return; }
  if (typeof LZString === 'undefined') { err.textContent = 'No se pudo cargar el compresor (lz-string).'; return; }
  err.textContent = '';
  const id = opt.dataset.id;
  const sectorText = id ? window.FS_I18N[lang].sec[id] : window.FS_I18N[lang].f_other;
  const col = /^#[0-9a-f]{6}$/i.test($('bd-color').value) ? $('bd-color').value : '#00d4aa';
  const data = {
    n, s: sectorText, c: $('bd-city').value.trim(), sl: $('bd-slogan').value.trim(), l: lang,
    t: $('bd-tel').value.trim().replace(/[^\d+\s]/g, ''), w: web, ig: $('bd-ig').value.trim(), col, logo,
    sv: $('bd-services').value.split('\n').map((x) => x.trim()).filter(Boolean).join('\n'),
    trial: new Date().toISOString().split('T')[0],
  };
  builderState.url = location.origin + '/demo#' + LZString.compressToEncodedURIComponent(JSON.stringify(data));
  builderState.wa = BUILDER_WA[lang](n, data.c, sectorText, builderState.url);
  builderState.tel = data.t;
  $('bd-url').textContent = builderState.url;
  $('bd-wa').textContent = builderState.wa;
  $('bd-out').style.display = 'block';
  $('bd-out').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function builderSendWA() {
  const raw = builderState.tel.replace(/[\s+]/g, '');
  const num = raw.startsWith('0') ? '41' + raw.slice(1) : raw;
  window.open('https://wa.me/' + (num || '') + '?text=' + encodeURIComponent(builderState.wa), '_blank', 'noopener');
}

// ══════ UTILS ══════
function goTo(sel) { document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' }); }
function cpCopy(v) { navigator.clipboard.writeText(String(v)).then(() => toast('📋 Copiado', 'ok')).catch(() => {}); }
function toast(msg, type) {
  const el = $('toast-el'); if (!el) return;
  el.textContent = msg; el.className = 'toast on ' + (type || '');
  clearTimeout(_toast); _toast = setTimeout(() => { el.className = 'toast'; }, 2700);
}
function toggleFav() { favOpen = !favOpen; const b = $('fav-bubble'); if (b) b.style.display = favOpen ? 'block' : 'none'; }
function activateVoice() {
  const ov = $('flow-overlay');
  if (!ov) { toast(t('demo_voice_toast'), 'ok'); return; }
  ov.style.display = 'flex'; ov.style.opacity = '1';
}

// ══════ INIT ══════
document.addEventListener('DOMContentLoaded', () => {
  if (lsGet('cookies', '')) hideCookies();
  applyLang(detectLang());
  const m = location.hash.match(/^#legal-(\w+)$/);
  if (m) showLegal(m[1]);
  setTimeout(() => { const f = $('fav-wrap'); if (f) f.style.opacity = '1'; }, 3000);
});
