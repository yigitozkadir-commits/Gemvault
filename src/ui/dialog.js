import { trapFocus } from '../utils/a11y.js';

function createOverlay() {
  const ov = document.createElement('div');
  ov.className = 'modal-overlay';
  document.body.appendChild(ov);
  return ov;
}

export function confirm(msg, { title = 'Onay', ok = 'Tamam', cancel = 'İptal' } = {}) {
  return new Promise((resolve) => {
    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="modal-title">${title}</div>
        <p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:4px">${msg}</p>
        <div class="modal-btns">
          <button class="modal-btn-secondary" data-cancel>${cancel}</button>
          <button class="modal-btn-primary" data-ok>${ok}</button>
        </div>
      </div>`;

    const modal = overlay.querySelector('.modal');
    const cleanup = trapFocus(modal);

    const close = (value) => {
      cleanup();
      overlay.remove();
      resolve(value);
    };

    overlay.querySelector('[data-ok]').addEventListener('click', () => close(true));
    overlay.querySelector('[data-cancel]').addEventListener('click', () => close(false));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
    overlay.querySelector('[data-ok]').focus();
  });
}

export function prompt(msg, defaultVal = '', { title = '', placeholder = '' } = {}) {
  return new Promise((resolve) => {
    const overlay = createOverlay();
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        ${title ? `<div class="modal-title">${title}</div>` : ''}
        <p style="font-size:13px;color:var(--text2);margin-bottom:14px">${msg}</p>
        <input class="gen-input" data-input value="${defaultVal}" placeholder="${placeholder}" style="margin-bottom:4px">
        <div class="modal-btns">
          <button class="modal-btn-secondary" data-cancel>İptal</button>
          <button class="modal-btn-primary" data-ok>Tamam</button>
        </div>
      </div>`;

    const modal = overlay.querySelector('.modal');
    const input = overlay.querySelector('[data-input]');
    const cleanup = trapFocus(modal);

    const close = (value) => {
      cleanup();
      overlay.remove();
      resolve(value);
    };

    overlay.querySelector('[data-ok]').addEventListener('click', () => close(input.value));
    overlay.querySelector('[data-cancel]').addEventListener('click', () => close(null));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(null); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') close(input.value); });
    input.focus();
    input.select();
  });
}
