#!/usr/bin/env node
import { GEMS } from '../src/data/gems.js';
import { INSTRUCTIONS } from '../src/data/instructions/index.js';

let errors = 0;
let passes = 0;
const err = (msg) => { console.error('  FAIL:', msg); errors++; };
const ok  = (msg) => { console.log('  PASS:', msg); passes++; };

console.log('\n=== GemVault Data Verification ===\n');

// 1. GEMS count
if (GEMS.length === 735) {
  ok(`GEMS.length === 735`);
} else {
  err(`GEMS.length expected 735, got ${GEMS.length}`);
}

// 2. All 18 unique cats are present
const uniqueCats = [...new Set(GEMS.map(g => g.cat))];
if (uniqueCats.length === 18) {
  ok(`18 unique categories present: ${uniqueCats.sort().join(', ')}`);
} else {
  err(`Expected 18 unique categories, got ${uniqueCats.length}: ${uniqueCats.sort().join(', ')}`);
}

// 3. Every gem ID 1-735 has a key in INSTRUCTIONS
const instrKeys = new Set(Object.keys(INSTRUCTIONS));
const totalInstr = instrKeys.size;
if (totalInstr === 735) {
  ok(`INSTRUCTIONS has 735 keys`);
} else {
  err(`INSTRUCTIONS expected 735 keys, got ${totalInstr}`);
}

const missingIds = [];
for (let i = 1; i <= 735; i++) {
  if (!instrKeys.has(String(i))) missingIds.push(i);
}
if (missingIds.length === 0) {
  ok(`Every gem ID 1-735 has an instruction entry`);
} else {
  err(`Missing instruction keys for IDs: ${missingIds.slice(0, 20).join(', ')}${missingIds.length > 20 ? ` ... (${missingIds.length} total)` : ''}`);
}

// 4. Every instruction is >= 400 chars
const shortInstr = [];
for (const [k, v] of Object.entries(INSTRUCTIONS)) {
  if (typeof v !== 'string') {
    err(`INSTRUCTIONS["${k}"] is not a string (got ${typeof v})`);
  } else if (v.length < 400) {
    shortInstr.push({ key: k, len: v.length });
  }
}
if (shortInstr.length === 0) {
  ok(`All instructions are >= 400 chars`);
} else {
  err(`${shortInstr.length} instruction(s) under 400 chars: ${shortInstr.slice(0, 5).map(x => `${x.key}(${x.len})`).join(', ')}`);
}

// Summary
console.log(`\n=== Results ===`);
console.log(`  Passed: ${passes}`);
console.log(`  Failed: ${errors}`);
if (errors === 0) {
  console.log('\n  All checks passed!\n');
} else {
  console.log(`\n  ${errors} check(s) failed.\n`);
}
process.exit(errors > 0 ? 1 : 0);
