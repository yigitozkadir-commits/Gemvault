import { t, setLocale, locale } from '../../app/i18n.js';
import { storage } from '../../services/storage.js';
import { toast } from '../toast.js';
import { trapFocus } from '../../utils/a11y.js';
import { escH } from '../../utils/escape.js';
import * as dialog from '../dialog.js';

const APP_VERSION = 'v6.0.0';

function close() {
  const ov = document.getElementById('settingsOverlay');
  if (ov) ov.remove();
}

function renderApiKeyStatus(key) {
  if (!key) return `<span style="color:var(--text4);font-style:italic">${escH('—')}</span>`;
  const masked = key.slice(0, 8) + '••••••••' + key.slice(-4);
  return `<span style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text2)">${escH(masked)}</span>`;
}

export async function openSettings() {
  // Remove any existing overlay
  const existing = document.getElementById('settingsOverlay');
  if (existing) { existing.remove(); return; }

  const currentKey = await storage.getApiKey();

  const overlay = document.createElement('div');
  overlay.id = 'settingsOverlay';
  overlay.className = 'settings-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', t('settings.title'));

  overlay.innerHTML = `
    <div class="settings-modal">
      <div class="settings-head">
        <span class="settings-title">${escH(t('settings.title'))}</span>
        <button class="settings-close-btn" aria-label="${escH(t('settings.close'))}">×</button>
      </div>
      <div class="settings-body">

        <section class="settings-section">
          <div class="settings-section-title">${escH(t('settings.language'))}</div>
          <div class="settings-lang-row">
            <button class="settings-lang-btn${locale === 'tr' ? ' active' : ''}" data-lang="tr">
              TR 🇹🇷 <span class="settings-lang-name">${escH(t('settings.lang.tr'))}</span>
            </button>
            <button class="settings-lang-btn${locale === 'en' ? ' active' : ''}" data-lang="en">
              EN 🇬🇧 <span class="settings-lang-name">${escH(t('settings.lang.en'))}</span>
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-title">${escH(t('settings.api'))}</div>
          <div class="settings-row">
            <span class="settings-row-label" id="apiKeyStatus">${renderApiKeyStatus(currentKey)}</span>
            <button class="settings-danger-btn" id="clearApiKeyBtn">${escH(t('settings.api.clear'))}</button>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-title">${escH(t('settings.clear_data'))}</div>
          <div class="settings-row">
            <button class="settings-danger-btn" id="clearAllBtn" style="width:100%">${escH(t('settings.clear_data'))}</button>
          </div>
        </section>

        <section class="settings-section">
          <div class="settings-section-title">${escH(t('settings.version'))}</div>
          <div class="settings-row">
            <span class="settings-row-label" style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text3)">${escH(APP_VERSION)}</span>
          </div>
        </section>

      </div>
    </div>`;

  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.settings-modal');
  const cleanup = trapFocus(modal);

  // Close handlers
  overlay.querySelector('.settings-close-btn').addEventListener('click', () => {
    cleanup();
    close();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) { cleanup(); close(); }
  });

  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape') { cleanup(); close(); document.removeEventListener('keydown', onEsc); }
  }, { once: true });

  // Language buttons
  overlay.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const code = btn.dataset.lang;
      await setLocale(code);
      storage.patchSettings({ locale: code });
      toast.success(t('settings.language') + ': ' + t(`settings.lang.${code}`));
      cleanup();
      close();
    });
  });

  // Clear API key
  overlay.querySelector('#clearApiKeyBtn').addEventListener('click', async () => {
    await storage.clearApiKey();
    overlay.querySelector('#apiKeyStatus').innerHTML = renderApiKeyStatus('');
    toast.info(t('settings.api.clear'));
  });

  // Clear all data
  overlay.querySelector('#clearAllBtn').addEventListener('click', async () => {
    const confirmed = await dialog.confirm(t('settings.clear_confirm'));
    if (confirmed) {
      storage.clearAll();
      window.location.reload();
    }
  });
}
