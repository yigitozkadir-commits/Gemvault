import { state } from '../app/state.js';
import { bus } from '../app/bus.js';
import { escH } from '../utils/escape.js';
import { getCatColor } from '../utils/format.js';
import { toast } from '../ui/toast.js';

export function detectPlaceholders(text) {
  const re = /\[([^\]]+)\]/g;
  const seen = new Set();
  const list = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const key = m[1].trim();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(key);
    }
  }
  return list;
}

export function applyValues(text, values) {
  let result = text;
  for (const [key, val] of Object.entries(values)) {
    if (!val.trim()) continue;
    const re = new RegExp(`\\[${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`, 'gi');
    result = result.replace(re, val.trim());
  }
  return result;
}

export function render(instrText, catColor, container) {
  const prev = container.querySelector('#pteWidget');
  if (prev) prev.remove();

  const placeholders = detectPlaceholders(instrText);
  if (!placeholders.length) return;

  const color = catColor || 'var(--gold)';
  const widgetId = 'pteWidget';

  function inputType(key) {
    const k = key.toLowerCase();
    if (k.includes('açıkla') || k.includes('bağlam') || k.includes('metin') ||
        k.includes('konu') || k.includes('senaryo') || k.includes('hedef')) {
      return 'textarea';
    }
    return 'input';
  }

  const fields = placeholders.map(p => {
    const isTA = inputType(p) === 'textarea';
    const tag = `pte_field_${p.replace(/\s+/g, '_')}`;
    return `
      <div class="pte-field">
        <label class="pte-label">
          <span class="pte-label-tag" style="--cc:${color}">[${p}]</span>
          ${p}
        </label>
        ${isTA
          ? `<textarea class="pte-input pte-textarea" id="${tag}" placeholder="${p} değerini girin..."></textarea>`
          : `<input class="pte-input" id="${tag}" type="text" placeholder="${p} değerini girin...">`
        }
      </div>`;
  }).join('');

  const html = `
    <div id="${widgetId}" class="pte-wrap">
      <div class="pte-header" style="--cc:${color}">
        <span class="pte-title">Şablon Editörü</span>
        <span class="pte-count">${placeholders.length} alan</span>
      </div>
      <div class="pte-body">${fields}</div>
      <div class="pte-footer">
        <button class="pte-apply-btn" id="pteApplyBtn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><polyline points="20,6 9,17 4,12"/></svg>
          Doldur &amp; Kopyala
        </button>
        <button class="pte-reset-btn">Sıfırla</button>
        <span class="pte-hint">Alanları doldur → talimatı hazır kopyala</span>
      </div>
    </div>`;

  container.insertAdjacentHTML('beforeend', html);

  const pteWidget = container.querySelector('#pteWidget');
  const applyBtn = pteWidget.querySelector('#pteApplyBtn');
  const resetBtn = pteWidget.querySelector('.pte-reset-btn');

  applyBtn.addEventListener('click', () => apply(color));
  resetBtn.addEventListener('click', reset);

  pteWidget.querySelectorAll('.pte-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && input.tagName !== 'TEXTAREA') {
        apply(color);
      }
    });
  });
}

export function apply(catColor) {
  const curInstr = state.curInstr;
  if (!curInstr) return;

  const placeholders = detectPlaceholders(curInstr);
  const values = {};

  for (const p of placeholders) {
    const tag = `pte_field_${p.replace(/\s+/g, '_')}`;
    const el = document.getElementById(tag);
    if (el) values[p] = el.value;
  }

  const filled = applyValues(curInstr, values);

  const preview = document.getElementById('instrContent');
  if (preview) {
    let highlighted = escH(filled);
    highlighted = highlighted.replace(/\[([^\]]+)\]/g,
      `<span style="background:#d47d7d22;color:#d47d7d;border-radius:2px;padding:0 2px">[$1]</span>`);
    for (const [key, val] of Object.entries(values)) {
      if (!val.trim()) continue;
      const escaped = escH(val.trim());
      const re = new RegExp(escaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      highlighted = highlighted.replace(re,
        `<span class="pte-filled-mark">${escaped}</span>`);
    }
    preview.innerHTML = `<pre class="instr-text" style="white-space:pre-wrap">${highlighted}</pre>`;
  }

  navigator.clipboard.writeText(filled).then(() => {
    const btn = document.getElementById('pteApplyBtn');
    if (btn) {
      btn.classList.add('success');
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><polyline points="20,6 9,17 4,12"/></svg> Kopyalandı!`;
      setTimeout(() => {
        btn.classList.remove('success');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><polyline points="20,6 9,17 4,12"/></svg> Doldur &amp; Kopyala`;
      }, 2400);
    }
    toast.success('Talimat kopyalandı!');
  }).catch(() => {
    toast.error('Clipboard yazılamadı');
  });
}

export function reset() {
  document.querySelectorAll('#pteWidget .pte-input').forEach(el => el.value = '');
  const curInstr = state.curInstr;
  const preview = document.getElementById('instrContent');
  if (preview && curInstr) {
    preview.innerHTML = `<pre class="instr-text">${escH(curInstr)}</pre>`;
  }
}

export function injectIfReady() {
  const curInstr = state.curInstr;
  if (!curInstr) return;

  const box = document.querySelector('.instr-box');
  if (!box) return;

  const activeGem = state.activeGem;
  const cc = (activeGem) ? getCatColor(activeGem.cat) : 'var(--gold)';
  render(curInstr, cc, box);
}

// Wire up to gem:rendered and instr:ready events
bus.on('gem:rendered', () => {
  setTimeout(injectIfReady, 100);
});

bus.on('instr:ready', () => {
  setTimeout(injectIfReady, 100);
});
