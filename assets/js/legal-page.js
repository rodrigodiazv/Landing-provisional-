'use strict';
// Renders one legal document from legal.js in the visitor's language (shared with the landing modal).
(function () {
  const LANGS = ['fr', 'de', 'it', 'en', 'es'];
  const PAGES = { imprint: '/aviso-legal', privacy: '/privacidad', terms: '/terminos' };
  const doc = document.body.dataset.doc;
  let lang;
  try { lang = localStorage.getItem('fs_lang'); } catch { lang = null; }
  if (!LANGS.includes(lang)) {
    lang = (navigator.languages || [navigator.language || '']).map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => LANGS.includes(l)) || 'fr';
  }
  function render() {
    const L = window.FS_LEGAL[lang];
    document.documentElement.lang = lang;
    document.title = 'FlowSuite — ' + L.tabs[doc];
    document.getElementById('title').textContent = L.tabs[doc];
    document.getElementById('upd').textContent = L.updated;
    document.getElementById('content').innerHTML = L[doc];
    document.getElementById('langs').innerHTML = LANGS.map((l) => `<button class="${l === lang ? 'on' : ''}" data-l="${l}">${l.toUpperCase()}</button>`).join('');
    document.getElementById('docs').innerHTML = Object.keys(PAGES).map((d) => `<a href="${PAGES[d]}" class="${d === doc ? 'on' : ''}">${L.tabs[d]}</a>`).join('')
      + `<a href="/#legal-cookies">${L.tabs.cookies}</a><a href="/#legal-dpa">${L.tabs.dpa}</a>`;
  }
  document.getElementById('langs').addEventListener('click', (e) => {
    const l = e.target.dataset && e.target.dataset.l;
    if (!LANGS.includes(l)) return;
    lang = l;
    try { localStorage.setItem('fs_lang', l); } catch { /* ignore */ }
    render();
  });
  render();
})();
