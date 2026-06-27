#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const html = readFileSync(join(root, 'gemvault-pro.html'), 'utf8');

// Extract first <style> block (main app styles, lines 16-491)
const s1Start = html.indexOf('<style>') + '<style>'.length;
const s1End = html.indexOf('</style>');
const mainCss = html.slice(s1Start, s1End).trim();

// Extract second <style> block (Molo styles)
const s2Start = html.indexOf('<style>', s1End + 1) + '<style>'.length;
const s2End = html.indexOf('</style>', s2Start);
const moloCss = s2Start > '<style>'.length - 1 && s2End > s2Start
  ? html.slice(s2Start, s2End).trim()
  : '';

mkdirSync(join(root, 'src/styles/components'), { recursive: true });
mkdirSync(join(root, 'src/styles/themes'), { recursive: true });

// Split main CSS into sections
const sections = {
  tokens: [],
  reset: [],
  hero: [],
  sidebar: [],
  gemList: [],
  gemDetail: [],
  allGrid: [],
  genPanel: [],
  modals: [],
  toast: [],
  footer: [],
  animations: [],
  responsive: [],
  pte: [],
  favorites: [],
};

// Split by component based on class patterns
const lines = mainCss.split('\n');
let current = 'reset';
let tokensFound = false;

for (const line of lines) {
  const l = line.trim();

  if (l.startsWith(':root')) { current = 'tokens'; tokensFound = true; }
  else if (tokensFound && l === '}' && current === 'tokens') { sections.tokens.push(l); current = 'reset'; continue; }
  else if (l.match(/^\.hero|^\.stat|^\.ai-badge|^\.pulse/)) current = 'hero';
  else if (l.match(/^\.api-banner|^\.api-|^\.inst-banner|^\.inst-/)) current = 'hero';
  else if (l.match(/^\.sidebar|^\.srch-|^\.s-tabs|^\.s-tab|^\.cat-|^\.cdot|^\.cname|^\.ccount|^\.gems-list|^\.gem-item|^\.gem-no|^\.gem-info|^\.gem-name|^\.gem-desc|^\.ai-btn/)) current = 'sidebar';
  else if (l.match(/^\.gem-hdr|^\.gem-badge|^\.gem-title|^\.gem-desc|^\.meta-|^\.setup-|^\.instr-|^\.s-step|^\.s-num|^\.s-text|^\.s-arr|^\.copy-btn|^\.loading-|^\.shimmer|^\.regen-|^\.sec-label/)) current = 'gemDetail';
  else if (l.match(/^\.all-grid|^\.all-card/)) current = 'allGrid';
  else if (l.match(/^\.gen-panel|^\.gen-title|^\.gen-sub|^\.gen-form|^\.gen-field|^\.gen-lbl|^\.gen-input|^\.gen-select|^\.gen-textarea|^\.gen-btn|^\.gen-result|^\.gen-copy|^\.ai-badge-bar/)) current = 'genPanel';
  else if (l.match(/^\.pte-/)) current = 'pte';
  else if (l.match(/^#sidebarFavs|^\.fav-|^\.col-/)) current = 'favorites';
  else if (l.match(/^@keyframes/)) current = 'animations';
  else if (l.match(/^@media/)) current = 'responsive';
  else if (l.match(/^\.footer|^\.scroll-top|^\.main|^\.empty/)) current = 'footer';
  else if (l.match(/^mark\b/)) current = 'gemDetail';

  if (sections[current]) sections[current].push(line);
  else sections.reset.push(line);
}

// Write component CSS files
const componentMap = {
  'tokens': '_tokens.css',
  'reset': '_reset.css',
  'hero': 'components/hero.css',
  'sidebar': 'components/sidebar.css',
  'gemList': 'components/gem-list.css',
  'gemDetail': 'components/gem-detail.css',
  'allGrid': 'components/all-grid.css',
  'genPanel': 'components/gen-panel.css',
  'pte': 'components/pte.css',
  'favorites': 'components/favorites.css',
  'modals': 'components/modals.css',
  'toast': 'components/toast.css',
  'footer': 'components/footer.css',
  'animations': '_animations.css',
  'responsive': '_responsive.css',
};

for (const [key, file] of Object.entries(componentMap)) {
  const content = (sections[key] || []).join('\n').trim();
  if (content) {
    writeFileSync(join(root, 'src/styles', file), content + '\n');
    console.log(`✅ src/styles/${file}`);
  }
}

// Write molo styles
if (moloCss) {
  writeFileSync(join(root, 'src/styles/components/molo.css'), moloCss + '\n');
  console.log('✅ src/styles/components/molo.css');
}

// Write main.css that imports all
const imports = [
  './_tokens.css',
  './_reset.css',
  './_animations.css',
  './components/hero.css',
  './components/sidebar.css',
  './components/gem-list.css',
  './components/gem-detail.css',
  './components/all-grid.css',
  './components/gen-panel.css',
  './components/pte.css',
  './components/favorites.css',
  './components/modals.css',
  './components/toast.css',
  './components/molo.css',
  './components/footer.css',
  './_responsive.css',
].map(f => `@import '${f}';`).join('\n');

writeFileSync(join(root, 'src/styles/main.css'), imports + '\n');
console.log('✅ src/styles/main.css');

// Also write fonts.css (will use self-hosted woff2 later; for dev use system fonts as fallback)
const fontsCss = `
/* Fonts — self-hosted woff2 */
/* Cormorant Garamond */
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-300.woff2') format('woff2');
}
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: italic;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-300italic.woff2') format('woff2');
}
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: italic;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-italic.woff2') format('woff2');
}
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-600.woff2') format('woff2');
}
@font-face {
  font-family: 'Cormorant Garamond';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url('/fonts/cormorant-garamond-v22-latin-700.woff2') format('woff2');
}

/* DM Mono */
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 300;
  font-display: swap;
  src: url('/fonts/dm-mono-v14-latin-300.woff2') format('woff2');
}
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/dm-mono-v14-latin-regular.woff2') format('woff2');
}
@font-face {
  font-family: 'DM Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/dm-mono-v14-latin-500.woff2') format('woff2');
}

/* Instrument Sans */
@font-face {
  font-family: 'Instrument Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/instrument-sans-v1-latin-regular.woff2') format('woff2');
}
@font-face {
  font-family: 'Instrument Sans';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/instrument-sans-v1-latin-500.woff2') format('woff2');
}
@font-face {
  font-family: 'Instrument Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/instrument-sans-v1-latin-600.woff2') format('woff2');
}
`;
writeFileSync(join(root, 'src/styles/fonts.css'), fontsCss.trim() + '\n');
console.log('✅ src/styles/fonts.css');

console.log('\n🎉 CSS extraction complete!');
