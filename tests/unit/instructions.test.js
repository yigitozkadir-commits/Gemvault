import { describe, it, expect } from 'vitest';
import { INSTRUCTIONS } from '../../src/data/instructions/index.js';

describe('INSTRUCTIONS data', () => {
  it('has exactly 735 instruction entries', () => {
    expect(Object.keys(INSTRUCTIONS)).toHaveLength(735);
  });
  it('covers IDs 1 through 735', () => {
    for (let i = 1; i <= 735; i++) {
      expect(INSTRUCTIONS[String(i)], `missing instruction for gem ${i}`).toBeDefined();
    }
  });
  it('all instructions are at least 400 chars', () => {
    for (const [id, instr] of Object.entries(INSTRUCTIONS)) {
      expect(instr.length, `gem ${id} instruction too short (${instr.length} chars)`).toBeGreaterThanOrEqual(400);
    }
  });
});
