import { CATEGORIES } from '../data/categories.js';
import { callGemini, isApiKeySet } from '../services/gemini.js';
import { escH } from '../utils/escape.js';
import { getCatColor } from '../utils/format.js';
import { toast } from '../ui/toast.js';
import { state, setState } from '../app/state.js';
import { t } from '../app/i18n.js';

export function renderGenPanel() {
  const p = document.getElementById('genPanel');
  if (!p) return;
  const opts = CATEGORIES.map((c) => `<option value="${c.id}">${escH(c.emoji + ' ' + c.label)}</option>`).join('');
  p.innerHTML = `<div class="gen-panel">
    <h2 class="gen-title">${t('gen.title.h')} <em>${t('gen.title.em')}</em></h2>
    <p class="gen-sub">${t('gen.sub')}</p>
    <div class="gen-form">
      <div class="gen-field"><label class="gen-lbl">${t('gen.name.label')}</label><input class="gen-input" id="genName" placeholder="${t('gen.name.placeholder')}"></div>
      <div class="gen-field"><label class="gen-lbl">${t('gen.cat.label')}</label><select class="gen-select" id="genCat">${opts}</select></div>
      <div class="gen-field"><label class="gen-lbl">${t('gen.usecase.label')}</label><textarea class="gen-textarea" id="genUseCase" placeholder="${t('gen.usecase.placeholder')}"></textarea></div>
      <div class="gen-field"><label class="gen-lbl">${t('gen.ctx.label')}</label><input class="gen-input" id="genCtx" placeholder="${t('gen.ctx.placeholder')}"></div>
      <button class="gen-btn" id="genBtn">${t('gen.btn')}</button>
    </div>
    <div id="genResult"></div>
  </div>`;

  p.querySelector('#genBtn').addEventListener('click', generateCustomGem);
}

async function generateCustomGem() {
  if (!isApiKeySet()) { toast.warn(t('gen.need_key')); return; }
  const name = document.getElementById('genName').value.trim();
  const cat = document.getElementById('genCat').value;
  const uc = document.getElementById('genUseCase').value.trim();
  const ctx = document.getElementById('genCtx').value.trim();
  if (!name || !uc) { toast.warn(t('gen.need_fields')); return; }

  const btn = document.getElementById('genBtn');
  btn.disabled = true; btn.textContent = t('gem.generating');

  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label || cat;

  try {
    const instr = await callGemini(
      'Kullanıcının istediği özel Gem için Türkçe, profesyonel Gemini sistem promptu yaz. İçermeli: açık rol tanımı, 5-8 adım metodoloji, çıktı formatı, [GİR]/[KONU] etiketleri. 200-400 kelime. Sadece talimat.',
      `Gem: ${name}\nKategori: ${catLabel}\nKullanım: ${uc}${ctx ? '\nBağlam: ' + ctx : ''}`
    );
    setState({ genResult: instr });
    const cc = getCatColor(cat);
    document.getElementById('genResult').innerHTML = `<div class="gen-result" style="--cc:${cc}"><div class="gen-result-hdr"><div class="gen-result-title">${escH(name)}</div><div style="display:flex;gap:8px;align-items:center"><div class="gen-result-badge">✦ AI ÜRETILDI</div><button class="gen-copy" id="genCopyBtn">${t('gen.copy')}</button></div></div><pre class="gen-result-body">${escH(instr)}</pre></div>`;
    document.getElementById('genCopyBtn').addEventListener('click', copyGenerated);
  } catch (e) {
    document.getElementById('genResult').innerHTML = `<div style="padding:20px;color:#d47d7d;font-family:'DM Mono',monospace;font-size:12px">Hata: ${escH(e.message)}</div>`;
    toast.error(e.message);
  }
  btn.disabled = false; btn.innerHTML = t('gen.btn.regen');
}

function copyGenerated() {
  const instr = state.genResult;
  if (!instr) return;
  navigator.clipboard.writeText(instr).then(() => {
    const b = document.querySelector('.gen-copy');
    if (b) { b.textContent = t('gen.copied'); setTimeout(() => { b.textContent = t('gen.copy'); }, 2000); }
    toast.success(t('gen.copied'));
  });
}
