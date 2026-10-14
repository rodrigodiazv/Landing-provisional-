'use strict';
// FLOW voice agent: official ElevenLabs widget, always visible bottom-right.
// The agent ID is public by design (public ElevenLabs agent). Allowed hosts are in vercel.json (CSP).
const FLOW_AGENT_ID = 'agent_6501m4vnzp04exjtrwnce2ryf5kt';
const EL_WIDGET_SRC = 'https://elevenlabs.io/convai-widget/index.js';
let _flowWidget = null;

function _widgetLabel() { return String(t('ov_btn')).replace(/^\S+\s/, ''); }
function updateFlowWidgetLang() {
  if (_flowWidget) _flowWidget.setAttribute('action-text', _widgetLabel());
}

function mountFlowWidget() {
  if (_flowWidget) return;
  const s = document.createElement('script');
  s.src = EL_WIDGET_SRC;
  document.head.appendChild(s);
  _flowWidget = document.createElement('elevenlabs-convai');
  _flowWidget.id = 'el-flow-widget';
  _flowWidget.setAttribute('agent-id', FLOW_AGENT_ID);
  _flowWidget.setAttribute('avatar-image-url', location.origin + '/assets/flow-voice.jpg');
  updateFlowWidgetLang();
  _flowWidget.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:800';
  document.body.appendChild(_flowWidget);
}

function _ov() { return document.getElementById('flow-overlay'); }
function _hideOv() {
  const ov = _ov(); if (!ov) return;
  ov.style.transition = 'opacity .35s'; ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; }, 360);
}

// Called from the invitation overlay and the hero mic button: opens the widget conversation.
function startFlowVoice() {
  _hideOv();
  mountFlowWidget();
  customElements.whenDefined('elevenlabs-convai').then(() => {
    setTimeout(() => {
      const btn = _flowWidget.shadowRoot && _flowWidget.shadowRoot.querySelector('button');
      if (btn) btn.click(); else _flowWidget.click();
    }, 200);
  });
}
function endFlowCall() { const ui = document.getElementById('flow-call-ui'); if (ui) ui.style.display = 'none'; }
function skipOverlay(e) {
  if (e) e.stopPropagation();
  try { sessionStorage.setItem('fs_ov_skip', '1'); } catch { /* ignore */ }
  _hideOv();
}

window.addEventListener('DOMContentLoaded', mountFlowWidget);
// Show the invitation once per browser session.
window.addEventListener('load', () => {
  let skipped = false;
  try { skipped = sessionStorage.getItem('fs_ov_skip') === '1'; } catch { /* ignore */ }
  const ov = _ov(); if (!ov || skipped) return;
  setTimeout(() => {
    ov.style.display = 'flex'; ov.style.opacity = '0'; ov.style.transition = 'opacity .5s';
    requestAnimationFrame(() => requestAnimationFrame(() => { ov.style.opacity = '1'; }));
  }, 1200);
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && _ov()?.style.display === 'flex') skipOverlay(); });
