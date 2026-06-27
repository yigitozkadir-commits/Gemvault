import { storage } from '../services/storage.js';
import { t } from '../app/i18n.js';
import { toast } from './toast.js';

export async function mountApiBar(container) {
  container.innerHTML = `
    <span class="api-label">${t('api.label')}</span>
    <input class="api-input" id="apiKeyInput" type="password" placeholder="${t('api.placeholder')}" autocomplete="off" spellcheck="false">
    <button class="api-save" id="apiSaveBtn">${t('api.save')}</button>
    <div class="api-status"><div class="api-dot" id="apiDot"></div><span class="api-lbl" id="apiLbl"></span></div>
    <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style="font-family:'DM Mono',monospace;font-size:10px;color:var(--gold);text-decoration:none;opacity:.7">${t('api.get')}</a>`;

  const input = container.querySelector('#apiKeyInput');
  const saveBtn = container.querySelector('#apiSaveBtn');

  const existingKey = await storage.getApiKey();
  if (existingKey) {
    input.value = existingKey;
    setStatus(true);
  } else {
    setStatus(false);
  }

  saveBtn.addEventListener('click', async () => {
    const k = input.value.trim();
    if (!k) return;
    await storage.setApiKey(k);
    setStatus(true);
    toast.success(t('api.connected'));
    // Auto-hide after 5s
    setTimeout(() => {
      input.value = '';
    }, 5000);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBtn.click();
  });
}

function setStatus(ok) {
  const dot = document.getElementById('apiDot');
  const lbl = document.getElementById('apiLbl');
  if (!dot || !lbl) return;
  dot.className = 'api-dot' + (ok ? ' ok' : '');
  lbl.className = 'api-lbl' + (ok ? ' ok' : '');
  lbl.textContent = ok ? t('api.connected') : t('api.disconnected');
}

export async function refreshApiStatus() {
  setStatus(!!(await storage.getApiKey()));
}
