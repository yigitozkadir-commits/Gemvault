import { t } from '../../app/i18n.js';

export function showEmptyState() {
  const el = document.getElementById('emptyState');
  if (!el) return;
  el.innerHTML = `<div class="glyph">◇</div><p>${t('empty.prompt')}</p>`;
  el.style.display = 'flex';
}

export function hideEmptyState() {
  const el = document.getElementById('emptyState');
  if (el) el.style.display = 'none';
}
