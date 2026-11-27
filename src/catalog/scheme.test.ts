import { describe, expect, it } from 'vitest';
import { caseScheme, schemeKind } from './scheme';

describe('caseScheme', () => {
  it('covers every case with one mechanic diagram', () => {
    const kinds = new Set<string>();
    for (let id = 1; id <= 40; id += 1) {
      const kind = schemeKind(id);
      kinds.add(kind);
      const svg = caseScheme(id);
      expect(svg.startsWith(`<svg class="scheme scheme-${kind}"`)).toBe(true);
      expect(svg).toContain('scheme-token');
    }
    expect(kinds.size).toBe(6);
  });
});
