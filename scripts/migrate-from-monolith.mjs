#!/usr/bin/env node
/**
 * Migrates data from gemvault-pro.html monolith to src/data/ modules.
 * Reads legacy/gemvault-pro.html (or gemvault-pro.html at root).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const CANDIDATES = [
  join(root, 'legacy', 'gemvault-pro.html'),
  join(root, 'gemvault-pro.html'),
];

const srcFile = CANDIDATES.find(existsSync);
if (!srcFile) {
  console.warn('⚠  Source HTML not found. Writing empty stubs.');
  writeStubs();
  process.exit(0);
}

console.log(`📖 Reading: ${srcFile}`);
const html = readFileSync(srcFile, 'utf8');

// ── Extract sections ────────────────────────────────────────────────────────

function extractBetween(text, startMark, endMark) {
  const si = text.indexOf(startMark);
  if (si === -1) throw new Error(`Start marker not found: ${startMark}`);
  const ei = text.indexOf(endMark, si + startMark.length);
  if (ei === -1) throw new Error(`End marker not found: ${endMark}`);
  return text.slice(si, ei + endMark.length);
}

// CATEGORIES (single-line objects, easy to extract)
const catsRaw = extractBetween(html, 'const CATEGORIES = [', '];');
const catsBody = catsRaw.replace('const CATEGORIES = ', '');

// GEMS
const gemsRaw = extractBetween(html, 'const GEMS = [', '];\n');
const gemsBody = gemsRaw.replace('const GEMS = ', '');

// RADAR_SOURCES
const radarRaw = extractBetween(html, 'const RADAR_SOURCES = [', '];\n\nlet radarSelectedSources');
const radarBody = radarRaw.replace('const RADAR_SOURCES = ', '');

// INSTRUCTIONS — large block from line 582 to end marker before CATEGORIES
const instrStart = html.indexOf('const INSTRUCTIONS = {');
const instrEnd = html.indexOf('\n};\nconst CATEGORIES');
if (instrStart === -1 || instrEnd === -1) throw new Error('Cannot locate INSTRUCTIONS block');
const instrBody = html.slice(instrStart + 'const INSTRUCTIONS = '.length, instrEnd + 2); // include `}`

console.log('✅ Sections extracted');

// ── Parse INSTRUCTIONS keys and split into chunks ──────────────────────────

function splitInstructions(body) {
  // The body starts with `{` and ends with `}`.
  // Each entry is `"N":` followed by a backtick string.
  // We find key positions by scanning for `"<digits>":` pattern at start of entries.
  const chunks = {};

  // State machine to find key boundaries
  // We look for the pattern: (start or comma-with-newline) "digits":
  const keyRegex = /(?:^|\n)"(\d+)":`/g;
  let match;
  const positions = [];

  while ((match = keyRegex.exec(body)) !== null) {
    positions.push({ key: parseInt(match[1]), pos: match.index });
  }

  console.log(`  Found ${positions.length} instruction keys`);

  for (let i = 0; i < positions.length; i++) {
    const { key, pos } = positions[i];
    const nextPos = i + 1 < positions.length ? positions[i + 1].pos : body.length - 1;
    // Extract the value: from `"key":` to next key's `,\n"key+1":`
    // Find the backtick that opens the value
    const btStart = body.indexOf('`', pos);
    // Find the closing backtick (the one followed by optional comma)
    let btEnd = btStart + 1;
    while (btEnd < body.length) {
      if (body[btEnd] === '`') {
        // Check it's the closing backtick by looking at what follows
        const after = body.slice(btEnd + 1, btEnd + 3).trimStart();
        if (after.startsWith(',') || after.startsWith('\n') || btEnd >= nextPos - 2) {
          break;
        }
      }
      btEnd++;
    }
    const value = body.slice(btStart + 1, btEnd);
    chunks[key] = value;
  }

  return chunks;
}

const instructions = splitInstructions(instrBody);
const instrKeys = Object.keys(instructions).map(Number).sort((a, b) => a - b);
console.log(`  Keys range: ${instrKeys[0]} .. ${instrKeys[instrKeys.length - 1]}`);

// ── Write output files ──────────────────────────────────────────────────────

function ensureDir(p) { mkdirSync(p, { recursive: true }); }

// categories.js
ensureDir(join(root, 'src/data'));
writeFileSync(join(root, 'src/data/categories.js'),
`export const CATEGORIES = ${catsBody};\n`);
console.log('✅ src/data/categories.js');

// gems.js
writeFileSync(join(root, 'src/data/gems.js'),
`export const GEMS = ${gemsBody};\n`);
console.log('✅ src/data/gems.js');

// radar-sources.js (with feed URLs added)
const radarBodyWithFeeds = radarBody
  .replace("id:'anthropic'", "id:'anthropic',feed:'https://www.anthropic.com/news/rss.xml'")
  .replace("id:'openai'", "id:'openai',feed:'https://openai.com/blog/rss.xml'")
  .replace("id:'google'", "id:'google',feed:'https://blog.google/products/google-deepmind/rss/'")
  .replace("id:'huggingface'", "id:'huggingface',feed:'https://huggingface.co/blog/feed.xml'")
  .replace("id:'prompting'", "id:'prompting',feed:'https://www.promptingguide.ai/feed.xml'")
  .replace("id:'arxiv'", "id:'arxiv',feed:'https://arxiv.org/rss/cs.AI'")
  .replace("id:'mistral'", "id:'mistral',feed:'https://mistral.ai/news/feed.xml'")
  .replace("id:'aitoolstracker'", "id:'aitoolstracker',feed:'https://theresanaiforthat.com/rss/'");

writeFileSync(join(root, 'src/data/radar-sources.js'),
`export const RADAR_SOURCES = ${radarBodyWithFeeds};\n`);
console.log('✅ src/data/radar-sources.js');

// instructions/*.js — split into chunks of 100
ensureDir(join(root, 'src/data/instructions'));
const CHUNK_SIZE = 100;
const chunkFiles = [];

for (let start = 1; start <= 500; start += CHUNK_SIZE) {
  const end = Math.min(start + CHUNK_SIZE - 1, 500);
  const label = `${String(start).padStart(3,'0')}-${String(end).padStart(3,'0')}`;
  const filename = `${label}.js`;
  chunkFiles.push({ filename, start, end });

  let content = `const chunk = {\n`;
  for (let k = start; k <= end; k++) {
    const val = instructions[k];
    if (val !== undefined) {
      // Escape any backticks in the value
      const escaped = val.replace(/`/g, '\\`').replace(/\${/g, '\\${');
      content += `"${k}":\`${escaped}\`,\n`;
    }
  }
  content += `};\nexport default chunk;\n`;

  writeFileSync(join(root, 'src/data/instructions', filename), content);
  console.log(`✅ src/data/instructions/${filename}`);
}

// instructions/index.js
const imports = chunkFiles.map(({ filename, start, end }, i) =>
  `import c${i} from './${filename}';`
).join('\n');
const merge = chunkFiles.map((_, i) => `...c${i}`).join(', ');
writeFileSync(join(root, 'src/data/instructions/index.js'),
`${imports}\nexport const INSTRUCTIONS = { ${merge} };\n`);
console.log('✅ src/data/instructions/index.js');

// src/data/index.js
writeFileSync(join(root, 'src/data/index.js'),
`export { GEMS } from './gems.js';
export { CATEGORIES } from './categories.js';
export { INSTRUCTIONS } from './instructions/index.js';
export { RADAR_SOURCES } from './radar-sources.js';
`);
console.log('✅ src/data/index.js');

console.log('\n🎉 Migration complete!');
console.log('Run: node scripts/verify-data.mjs');

function writeStubs() {
  ensureDir(join(root, 'src/data/instructions'));
  writeFileSync(join(root, 'src/data/categories.js'), 'export const CATEGORIES = [];\n');
  writeFileSync(join(root, 'src/data/gems.js'), 'export const GEMS = [];\n');
  writeFileSync(join(root, 'src/data/radar-sources.js'), 'export const RADAR_SOURCES = [];\n');
  writeFileSync(join(root, 'src/data/instructions/index.js'), 'export const INSTRUCTIONS = {};\n');
  writeFileSync(join(root, 'src/data/index.js'),
    `export { GEMS } from './gems.js';\nexport { CATEGORIES } from './categories.js';\nexport { INSTRUCTIONS } from './instructions/index.js';\nexport { RADAR_SOURCES } from './radar-sources.js';\n`);
}
