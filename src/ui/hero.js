import { GEMS } from '../data/gems.js';
import { t } from '../app/i18n.js';

export function mountHero(container) {
  container.innerHTML = `
    <div class="hero-corner">${GEMS.length}</div>
    <button class="hero-settings-btn" id="heroSettingsBtn" aria-label="${t('settings.title')}">⚙</button>
    <div class="hero-eyebrow">${t('hero.eyebrow')}</div>
    <h1 class="hero-title">${t('hero.title')}<br><em>${t('hero.title.em')}</em> Kullan</h1>
    <p class="hero-sub">${t('hero.sub')}</p>
    <div class="hero-stats">
      <div class="stat"><span class="stat-num">${GEMS.length}</span><span class="stat-label">${t('hero.stat.gems')}</span></div>
      <div class="stat"><span class="stat-num">18</span><span class="stat-label">${t('hero.stat.cats')}</span></div>
      <div class="stat"><span class="stat-num">AI</span><span class="stat-label">${t('hero.stat.ai')}</span></div>
      <div class="stat"><span class="stat-num">∞</span><span class="stat-label">${t('hero.stat.inf')}</span></div>
      <div class="ai-badge"><span class="pulse"></span>${t('hero.badge')}</div>
    </div>`;

  container.querySelector('#heroSettingsBtn')?.addEventListener('click', () => {
    import('./modals/settings.js').then(({ openSettings }) => openSettings()).catch(() => {});
  });
}
