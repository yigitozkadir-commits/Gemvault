import { MOLO_SVG, MOLO_CHAT_SVG } from './molo-svg.js';
import { initTTS, toggleTTS, getTTSEnabled } from './molo-tts.js';
import { initSTT, startListening, stopListening, getIsListening } from './molo-stt.js';
import { sendMessage, clearHistory } from './molo-dialog.js';

let moloOpen = false;
let ttsSupported = false;
let sttSupported = false;

export function initMolo() {
  // Initialize speech features
  ttsSupported = initTTS();
  sttSupported = initSTT((transcript) => {
    const input = document.getElementById('molo-input');
    if (input) {
      input.value = transcript;
      input.dispatchEvent(new Event('input'));
    }
  });

  // Inject molo toggle button
  const hero = document.querySelector('.hero-wrap');
  if (hero) {
    const btn = document.createElement('button');
    btn.id = 'molo-toggle-btn';
    btn.className = 'molo-toggle-btn';
    btn.setAttribute('aria-label', 'Molo Asistanı');
    btn.innerHTML = MOLO_CHAT_SVG;
    btn.addEventListener('click', toggleMolo);
    hero.appendChild(btn);
  }

  // Inject molo panel
  const body = document.body;
  const panel = document.createElement('div');
  panel.id = 'molo-panel';
  panel.className = 'molo-panel';
  panel.innerHTML = `
    <div class="molo-container">
      <div class="molo-header">
        <div class="molo-header-title">Molo</div>
        <button class="molo-header-close" id="molo-close-btn">✕</button>
      </div>
      <div class="molo-char-box">${MOLO_SVG}</div>
      <div id="molo-messages" class="molo-messages"></div>
      <div class="molo-input-box">
        <input type="text" id="molo-input" class="molo-input" placeholder="Bir şey sor...">
        <button class="molo-send-btn" id="molo-send-btn">✓</button>
        ${sttSupported ? '<button class="molo-mic-btn" id="molo-mic-btn">🎤</button>' : ''}
      </div>
      <div class="molo-footer">
        ${ttsSupported ? '<button class="molo-footer-btn" id="molo-tts-btn">🔊 Ses</button>' : ''}
        <button class="molo-footer-btn" id="molo-clear-btn">Temizle</button>
      </div>
    </div>
  `;
  body.appendChild(panel);

  // Setup event listeners
  const closeBtn = document.getElementById('molo-close-btn');
  const sendBtn = document.getElementById('molo-send-btn');
  const input = document.getElementById('molo-input');
  const ttsBtn = document.getElementById('molo-tts-btn');
  const micBtn = document.getElementById('molo-mic-btn');
  const clearBtn = document.getElementById('molo-clear-btn');

  closeBtn.addEventListener('click', toggleMolo);
  sendBtn.addEventListener('click', () => {
    const text = input.value.trim();
    if (text) sendMessage(text);
  });
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const text = input.value.trim();
      if (text) sendMessage(text);
    }
  });

  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      const enabled = toggleTTS();
      ttsBtn.classList.toggle('active', enabled);
    });
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (getIsListening()) {
        stopListening();
        micBtn.classList.remove('listening');
      } else {
        startListening();
        micBtn.classList.add('listening');
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearHistory);
  }

  // Add initial greeting
  setTimeout(() => {
    const msg = document.getElementById('molo-messages');
    if (msg && msg.children.length === 0) {
      const greeting = document.createElement('div');
      greeting.className = 'molo-msg molo';
      greeting.innerHTML = `<div class="molo-msg-content">Merhaba! 👋 Ben Molo, GemVault Pro'nun asistanıyım. Gemini Gems hakkında soru sor!</div>`;
      msg.appendChild(greeting);
    }
  }, 500);
}

function toggleMolo() {
  const panel = document.getElementById('molo-panel');
  const btn = document.getElementById('molo-toggle-btn');
  if (!panel) return;

  moloOpen = !moloOpen;
  panel.classList.toggle('open', moloOpen);
  btn.classList.toggle('active', moloOpen);

  if (moloOpen) {
    const input = document.getElementById('molo-input');
    if (input) input.focus();
  }
}

// Make initMolo available globally for lazy loading
window.__initMolo = initMolo;
