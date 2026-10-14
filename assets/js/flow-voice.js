'use strict';
// FLOW voice agent (ElevenLabs). The agent ID is public by design (public ElevenLabs agent).
// SDK pinned to a fixed version; allowed hosts are listed in vercel.json (CSP).
const FLOW_AGENT_ID = 'agent_6501m4vnzp04exjtrwnce2ryf5kt';
const EL_SDK_URL = 'https://cdn.jsdelivr.net/npm/@elevenlabs/client@1.27.0/+esm';
let _flowConv = null;
let _elConversation = null;

async function loadElevenLabs() {
  if (_elConversation) return _elConversation;
  const mod = await import(EL_SDK_URL);
  _elConversation = mod.Conversation;
  return _elConversation;
}
function _ov() { return document.getElementById('flow-overlay'); }
function _hideOv() {
  const ov = _ov(); if (!ov) return;
  ov.style.transition = 'opacity .35s'; ov.style.opacity = '0';
  setTimeout(() => { ov.style.display = 'none'; }, 360);
}
function _showCallUI() { const ui = document.getElementById('flow-call-ui'); if (ui) ui.style.display = 'flex'; }
function _setCallStatus(key) { const el = document.getElementById('call-status'); if (el) el.textContent = t(key); }
function _resetBtn(key) {
  const btn = document.getElementById('ov-start-btn');
  if (btn) { btn.disabled = false; btn.textContent = t(key || 'ov_btn'); }
}

async function startFlowVoice() {
  const btn = document.getElementById('ov-start-btn');
  if (btn) { btn.disabled = true; btn.textContent = t('ov_connecting'); }
  try {
    const Conversation = await loadElevenLabs();
    await navigator.mediaDevices.getUserMedia({ audio: true });
    _flowConv = await Conversation.startSession({
      agentId: FLOW_AGENT_ID,
      onConnect: () => { _hideOv(); _showCallUI(); _setCallStatus('call_on'); },
      onDisconnect: () => endFlowCall(),
      onError: () => { _resetBtn(); toast(t('call_error'), 'err'); },
      onModeChange: ({ mode }) => _setCallStatus(mode === 'speaking' ? 'call_speaking' : 'call_listening'),
    });
  } catch (e) {
    if (e && (e.name === 'NotAllowedError' || /denied|permission/i.test(e.message || ''))) {
      _showMicInstructions();
    } else {
      _resetBtn();
      toast(t('call_error'), 'err');
    }
  }
}
function _showMicInstructions() {
  const ov = _ov(); if (!ov) return;
  ov.style.display = 'flex'; ov.style.opacity = '1';
  const sub = document.getElementById('ov-sub'); if (sub) sub.innerHTML = t('ov_mic_blocked');
  _resetBtn('ov_retry');
}
function endFlowCall() {
  if (_flowConv) { try { _flowConv.endSession(); } catch { /* ignore */ } _flowConv = null; }
  const ui = document.getElementById('flow-call-ui'); if (ui) ui.style.display = 'none';
}
function skipOverlay(e) {
  if (e) e.stopPropagation();
  try { sessionStorage.setItem('fs_ov_skip', '1'); } catch { /* ignore */ }
  _hideOv();
}

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
