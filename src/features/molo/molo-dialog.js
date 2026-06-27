import { callGemini, isApiKeySet } from '../../services/gemini.js';
import { toast } from '../../ui/toast.js';
import { escH } from '../../utils/escape.js';
import { speak } from './molo-tts.js';

let conversationHistory = [];
let isThinking = false;

const SYSTEM_PROMPT = `Sen Molo, GemVault Pro'nun sevecen AI asistanısın. Kullanıcıya Gemini Gems hakkında yardım et, öneriler sun ve meraklı sorularını cevapla. Kısa ve samimi cevaplar ver (1-2 paragraf). Türkçe konuş. Gemler hakkında detaylı soru sorulursa, uygulamayı keşfetmeleri için cesaretlendir.`;

export function addMessage(text, isUser) {
  const container = document.getElementById('molo-messages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = `molo-msg ${isUser ? 'user' : 'molo'}`;
  msg.innerHTML = `<div class="molo-msg-content">${escH(text)}</div>`;
  container.appendChild(msg);
  container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });

  conversationHistory.push({ role: isUser ? 'user' : 'assistant', content: text });
}

export function addThinkingState() {
  const container = document.getElementById('molo-messages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'molo-msg molo molo-thinking';
  msg.id = 'molo-thinking-msg';
  msg.innerHTML = `<div class="molo-msg-content"><div class="molo-dots"><span></span><span></span><span></span></div></div>`;
  container.appendChild(msg);
  container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
}

export function removeThinkingState() {
  const msg = document.getElementById('molo-thinking-msg');
  if (msg) msg.remove();
}

export async function sendMessage(text) {
  if (!text.trim() || isThinking) return;

  const input = document.getElementById('molo-input');
  if (input) input.value = '';

  addMessage(text.trim(), true);
  addThinkingState();
  isThinking = true;

  try {
    if (!isApiKeySet()) {
      removeThinkingState();
      addMessage(`Önce API Key'ini ayarla! (Üst kısımda ✦ AI)`, false);
      isThinking = false;
      return;
    }

    const messages = conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await callGemini(SYSTEM_PROMPT, messages[messages.length - 1].content);

    removeThinkingState();
    addMessage(response, false);

    // Optional: speak response
    const settings = JSON.parse(localStorage.getItem('gv:settings') || '{}');
    if (settings.moloTTS) {
      speak(response);
    }
  } catch (e) {
    removeThinkingState();
    addMessage(`Hata: ${e.message}`, false);
    toast.error(`Molo hata: ${e.message}`);
  }

  isThinking = false;
}

export function clearHistory() {
  conversationHistory = [];
  const container = document.getElementById('molo-messages');
  if (container) container.innerHTML = '';
}

export function getIsThinking() {
  return isThinking;
}
