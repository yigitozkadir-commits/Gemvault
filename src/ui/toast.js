const MAX_TOASTS = 3;
const DEFAULT_DURATION = 3500;

let region = null;

function getRegion() {
  if (!region) region = document.getElementById('toast-region');
  return region;
}

function create(msg, type = 'info', opts = {}) {
  const r = getRegion();
  if (!r) return;

  const existing = r.querySelectorAll('.toast');
  if (existing.length >= MAX_TOASTS) existing[0].remove();

  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.setAttribute('role', 'alert');

  const icons = { success: '✓', error: '✕', info: 'ℹ', warn: '⚠' };
  const actionHtml = opts.action
    ? `<button class="toast-action" data-action>${opts.action}</button>`
    : '';

  el.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><div class="toast-body"><div class="toast-msg">${msg}</div>${actionHtml}</div><button class="toast-close" aria-label="Kapat">×</button>`;

  el.querySelector('.toast-close').addEventListener('click', () => dismiss(el));
  if (opts.action && opts.onAction) {
    el.querySelector('[data-action]').addEventListener('click', () => {
      opts.onAction();
      dismiss(el);
    });
  }

  r.appendChild(el);

  const duration = opts.duration ?? DEFAULT_DURATION;
  if (duration > 0) {
    setTimeout(() => dismiss(el), duration);
  }

  return el;
}

function dismiss(el) {
  if (!el.isConnected) return;
  el.classList.add('removing');
  el.addEventListener('animationend', () => el.remove(), { once: true });
  setTimeout(() => el.remove(), 300);
}

export const toast = {
  success: (msg, opts) => create(msg, 'success', opts),
  error: (msg, opts) => create(msg, 'error', { duration: 5000, ...opts }),
  info: (msg, opts) => create(msg, 'info', opts),
  warn: (msg, opts) => create(msg, 'warn', opts),
};
