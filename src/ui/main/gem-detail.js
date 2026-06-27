import { INSTRUCTIONS } from '../../data/instructions/index.js';
import { CATEGORIES } from '../../data/categories.js';
import { GEMS } from '../../data/gems.js';
import { bus } from '../../app/bus.js';
import { state, setState } from '../../app/state.js';
import { escH } from '../../utils/escape.js';
import { getCatColor, getCatLabel } from '../../utils/format.js';
import { callGemini, isApiKeySet } from '../../services/gemini.js';
import { toast } from '../toast.js';
import { t } from '../../app/i18n.js';
import { injectDetailButtons } from '../../features/favorites.js';
import { injectIfReady as pteInject } from '../../features/pte.js';

const COPY_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><polyline points="20,6 9,17 4,12"/></svg>`;

export function mountGemDetail() {
  bus.on('gem:select', ({ id }) => {
    const gem = GEMS.find((g) => g.id === id);
    if (gem) renderDetail(gem);
  });
}

export async function renderDetail(gem) {
  const cc = getCatColor(gem.cat);

  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('allGrid').style.display = 'none';
  document.getElementById('genPanel').style.display = 'none';
  document.getElementById('radarPanel').style.display = 'none';

  setState({ activeGem: gem, curInstr: '' });

  const d = document.getElementById('gemDetail');
  d.style.display = 'block';

  const steps = [
    t('gem.setup.step1'),
    t('gem.setup.step2'),
    t('gem.setup.step3').replace('{name}', escH(gem.name)),
    t('gem.setup.step4'),
    t('gem.setup.step5'),
    t('gem.setup.step6'),
  ];

  d.innerHTML = `<div class="gem-detail" style="--cc:${cc}">
    <div class="gem-hdr">
      <div class="gem-hdr-top">
        <span class="gem-badge">${escH(gem.no)} · ${escH(getCatLabel(gem.cat))}</span>
        <button class="copy-btn" id="copyBtn">${COPY_SVG}${t('gem.copy')}</button>
      </div>
      <h2 class="gem-title">${escH(gem.name)}</h2>
      <p class="gem-desc">${escH(gem.desc)}</p>
    </div>
    <div class="meta-grid">
      <div class="meta-cell"><div class="meta-label">${t('gem.use_case')}</div><div class="meta-val">${escH(gem.useCase)}</div></div>
      <div class="meta-cell"><div class="meta-label">${t('gem.drive')}</div><div class="meta-val">${escH(gem.drive)}</div></div>
    </div>
    <div class="setup-sec">
      <div class="sec-label">${t('gem.setup')}</div>
      <div class="setup-steps">${steps.map((s, i) => `<div class="s-step" style="--cc:${cc}"><span class="s-num">${i + 1}</span><span class="s-text">${s}</span></div>${i < steps.length - 1 ? '<span class="s-arr">›</span>' : ''}`).join('')}</div>
    </div>
    <div class="instr-sec">
      <div class="instr-hdr">
        <div class="sec-label">${t('gem.instr')}</div>
        <button class="regen-btn" id="regenBtn">${t('gem.generate')}</button>
      </div>
      <div class="instr-box" id="instrBox" style="--cc:${cc}">
        <div class="instr-toolbar">
          <div class="t-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
          <div class="t-lbl">GEM · INSTRUCTION · ${escH(gem.no)}</div>
        </div>
        <div id="instrContent">
          <div style="padding:36px 22px;text-align:center;font-family:'DM Mono',monospace;font-size:11px;color:var(--text4)">
            <div style="font-size:18px;margin-bottom:10px;color:var(--border2)">◇</div>
            <div style="margin-bottom:14px">${t('gem.no_instr')}</div>
            <button class="regen-btn" id="instrPlaceholderBtn" style="margin:0 auto">${t('gem.generate')}</button>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  d.querySelector('#copyBtn').addEventListener('click', copyInstr);
  d.querySelector('#regenBtn').addEventListener('click', generateInstr);
  d.querySelector('#instrPlaceholderBtn').addEventListener('click', generateInstr);

  injectDetailButtons(gem.id);

  document.getElementById('mainContent')?.scrollTo({ top: 0, behavior: 'smooth' });
  bus.emit('gem:rendered', { gem });
}

export function generateInstr() {
  const gem = state.activeGem;
  if (!gem) return;

  const c = document.getElementById('instrContent');
  const staticInstr = INSTRUCTIONS[String(gem.id)];

  if (staticInstr) {
    setState({ curInstr: staticInstr });
    c.innerHTML = `<pre class="instr-text" id="instrText">${escH(staticInstr)}</pre>`;

    const regenBtn = document.getElementById('regenBtn');
    if (regenBtn) regenBtn.innerHTML = t('gem.regen');

    const instrBox = document.getElementById('instrBox');
    let apiBar = instrBox?.querySelector('#apiRegenBar');
    if (!apiBar && instrBox) {
      apiBar = document.createElement('div');
      apiBar.id = 'apiRegenBar';
      apiBar.style.cssText = 'padding:10px 22px;border-top:1px solid var(--border);background:var(--bg2);display:flex;align-items:center;gap:12px;';
      apiBar.innerHTML = `<span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text4)">${t('gem.from_template')}</span><button class="regen-btn" id="aiRegenBtn">${t('gem.regen_with_ai')}</button>`;
      instrBox.appendChild(apiBar);
      instrBox.querySelector('#aiRegenBtn').addEventListener('click', regenWithAI);
    }

    bus.emit('instr:ready', { gem, instr: staticInstr });
    return;
  }

  regenWithAI();
}

export async function regenWithAI() {
  const gem = state.activeGem;
  if (!gem) return;

  if (!isApiKeySet()) {
    toast.warn(t('api.disconnected'));
    return;
  }

  const btn = document.getElementById('regenBtn');
  if (btn) { btn.disabled = true; btn.textContent = t('gem.generating'); }

  const c = document.getElementById('instrContent');
  const shims = [80, 65, 90, 70, 55, 75].map((w) => `<div class="shimmer" style="width:${w}%"></div>`).join('');
  c.innerHTML = `<div class="loading-wrap"><div class="loading-lbl">${t('gem.generating.label')}</div>${shims}</div>`;

  const cat = CATEGORIES.find((x) => x.id === gem.cat);

  try {
    const instr = await callGemini(
      'Sen GemVault\'un uzman Gem talimatı yazarısın. Gemini Gems için Türkçe, profesyonel, kullanıma hazır sistem promptları yaz. Net rol tanımı, 6-8 adım metodoloji, çıktı formatı, [GİR]/[KONU] placeholder etiketleri içermeli. 200-350 kelime. Sadece talimat metnini yaz.',
      `Ad: ${gem.name}\nKategori: ${cat?.label || gem.cat}\nAçıklama: ${gem.desc}\nKullanım: ${gem.useCase}`
    );
    setState({ curInstr: instr });
    c.innerHTML = `<pre class="instr-text">${escH(instr)}</pre>`;
    if (btn) { btn.disabled = false; btn.innerHTML = t('gem.regen.ai'); }
    bus.emit('instr:ready', { gem, instr });
  } catch (e) {
    const staticInstr = INSTRUCTIONS[String(gem.id)];
    if (staticInstr) {
      setState({ curInstr: staticInstr });
      c.innerHTML = `<pre class="instr-text">${escH(staticInstr)}</pre>`;
      bus.emit('instr:ready', { gem, instr: staticInstr });
    } else {
      c.innerHTML = `<div style="padding:22px;font-family:'DM Mono',monospace;font-size:12px;color:#d47d7d">${t('gem.error').replace('{msg}', escH(e.message))}</div>`;
    }
    if (btn) { btn.disabled = false; btn.innerHTML = t('gem.generate'); }
    toast.error(e.message);
  }
}

export function copyInstr() {
  const instr = state.curInstr;
  if (!instr) {
    toast.warn(t('gem.copy.need_instr'));
    return;
  }
  navigator.clipboard.writeText(instr).then(() => {
    const b = document.getElementById('copyBtn');
    if (b) {
      b.classList.add('copied');
      b.innerHTML = `${CHECK_SVG} ${t('gem.copied')}`;
      setTimeout(() => {
        b.classList.remove('copied');
        b.innerHTML = `${COPY_SVG} ${t('gem.copy')}`;
      }, 2200);
    }
    toast.success(t('gem.copied'));
  });
}
