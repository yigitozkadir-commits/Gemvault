import { trapFocus } from '../../utils/a11y.js';

export function openShortcuts() {
  // Remove any existing overlay
  document.getElementById('shortcutsOverlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'shortcutsOverlay';
  overlay.className = 'settings-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Klavye Kısayolları');

  overlay.innerHTML = `
    <div class="settings-modal shortcuts-modal">
      <div class="settings-head">
        <h2 class="settings-title">Klavye Kısayolları</h2>
        <button class="settings-close-btn" aria-label="Kapat">×</button>
      </div>
      <div class="settings-body">
        <table class="shortcuts-table">
          <tbody>
            <tr><td><kbd>/</kbd></td><td>Arama kutusuna odaklan</td></tr>
            <tr><td><kbd>g g</kbd></td><td>Tüm Gemler ızgarasını aç</td></tr>
            <tr><td><kbd>g r</kbd></td><td>Radar sekmesine geç</td></tr>
            <tr><td><kbd>g f</kbd></td><td>Favoriler sekmesine geç</td></tr>
            <tr><td><kbd>j</kbd></td><td>Listede aşağı</td></tr>
            <tr><td><kbd>k</kbd></td><td>Listede yukarı</td></tr>
            <tr><td><kbd>Enter</kbd></td><td>Seçili Gem'i aç</td></tr>
            <tr><td><kbd>c</kbd></td><td>Talimatı kopyala</td></tr>
            <tr><td><kbd>?</kbd></td><td>Bu paneli aç/kapat</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Kapat</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const modal = overlay.querySelector('.shortcuts-modal');
  const cleanupTrap = trapFocus(modal);

  function close() {
    cleanupTrap();
    overlay.remove();
    document.removeEventListener('keydown', onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  // Close on Escape
  document.addEventListener('keydown', onKeyDown);

  // Close on × button
  overlay.querySelector('.settings-close-btn').addEventListener('click', close);

  // Close on click outside modal
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
}
