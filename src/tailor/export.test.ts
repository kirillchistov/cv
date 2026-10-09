import { describe, expect, it } from 'vitest';
import { analyze } from './engine';
import { toDocx, toMarkdown, toText } from './export';
import { sampleVacancy, siteResume } from './samples';

const a = analyze(siteResume('ru'), sampleVacancy.ru);
const report = { title: 'Рекомендации', groups: [{ title: 'Добавить', items: ['Power BI'] }] };

describe('exports', () => {
  it('plain text uses standard headings and plain bullets', () => {
    const txt = toText(a.tailored);
    expect(txt.startsWith('КИРИЛЛ ЧИСТОВ\nHead of Growth')).toBe(true);
    expect(txt).toContain('\nОПЫТ РАБОТЫ\n');
    expect(txt).toContain('\nКЛЮЧЕВЫЕ НАВЫКИ\n');
    expect(txt).not.toMatch(/\n{3,}/);
    expect(txt).not.toContain('Рекомендации');
    expect(toText(a.tailored, report)).toContain('- Power BI');
  });

  it('markdown has a title, sections and job headings', () => {
    const md = toMarkdown(a.tailored, report);
    expect(md.startsWith('# Кирилл Чистов')).toBe(true);
    expect(md).toContain('## Опыт работы');
    expect(md).toMatch(/### Директор по развитию продуктов/);
    expect(md).toContain('## Рекомендации');
  });

  it('builds a real .docx (zip) file', async () => {
    const blob = await toDocx(a.tailored, report);
    const bytes = new Uint8Array(await blob.arrayBuffer());
    expect(bytes.length).toBeGreaterThan(5000);
    expect(String.fromCharCode(bytes[0], bytes[1])).toBe('PK');
  });
});
