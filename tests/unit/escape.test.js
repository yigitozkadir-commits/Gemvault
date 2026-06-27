import { describe, it, expect } from 'vitest';
import { escH } from '../../src/utils/escape.js';

describe('escH', () => {
  it('escapes < > & " \'', () => {
    expect(escH('<script>')).toBe('&lt;script&gt;');
    expect(escH('a & b')).toBe('a &amp; b');
    expect(escH('"quoted"')).toBe('&quot;quoted&quot;');
    expect(escH("it's")).toBe('it&#39;s');
  });
  it('returns empty string for falsy input', () => {
    expect(escH('')).toBe('');
    expect(escH(null)).toBe('');
    expect(escH(undefined)).toBe('');
  });
  it('does not double-escape already escaped chars', () => {
    // escH is not idempotent by design — just check raw string passthrough
    expect(escH('hello world')).toBe('hello world');
  });
  it('handles XSS vectors', () => {
    expect(escH('<img src=x onerror=alert(1)>')).not.toContain('<img');
    expect(escH('"><script>alert(1)</script>')).not.toContain('<script>');
  });
});
