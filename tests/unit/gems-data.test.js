import { describe, it, expect } from 'vitest';
import { GEMS } from '../../src/data/gems.js';
import { CATEGORIES } from '../../src/data/categories.js';

describe('GEMS data', () => {
  it('has exactly 735 gems', () => {
    expect(GEMS).toHaveLength(735);
  });
  it('IDs run from 1 to 735 without gaps', () => {
    const ids = GEMS.map((g) => g.id).sort((a, b) => a - b);
    expect(ids[0]).toBe(1);
    expect(ids[734]).toBe(735);
    expect(new Set(ids).size).toBe(735);
  });
  it('every gem has required fields', () => {
    for (const g of GEMS) {
      expect(g.id, `gem ${g.id} missing id`).toBeDefined();
      expect(g.name, `gem ${g.id} missing name`).toBeTruthy();
      expect(g.cat, `gem ${g.id} missing cat`).toBeTruthy();
    }
  });
  it('every gem.cat is a valid category id', () => {
    const catIds = new Set(CATEGORIES.map((c) => c.id));
    for (const g of GEMS) {
      expect(catIds.has(g.cat), `gem ${g.id} has invalid cat "${g.cat}"`).toBe(true);
    }
  });
  it('has exactly 18 categories', () => {
    expect(CATEGORIES).toHaveLength(18);
  });
});
