import { describe, expect, it } from 'vitest';
import { caseScheme, schemeCaption } from './scheme';

describe('caseScheme', () => {
  it('gives every case its own animated icon and caption', () => {
    const icons = new Set<string>();
    for (let id = 1; id <= 40; id += 1) {
      const svg = caseScheme(id);
      icons.add(svg);
      expect(svg.startsWith('<svg class="case-ico ico-')).toBe(true);
      expect(svg).toContain('ico-motion');
      expect(schemeCaption(id, 'ru').length).toBeGreaterThan(0);
      expect(schemeCaption(id, 'en').length).toBeGreaterThan(0);
      expect(schemeCaption(id, 'fr').length).toBeGreaterThan(0);
      expect(schemeCaption(id, 'es').length).toBeGreaterThan(0);
    }
    expect(icons.size).toBe(40);
  });
});
