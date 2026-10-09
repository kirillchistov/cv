import { describe, expect, it } from 'vitest';
import { analyze, extractKeywords, keywordRanges } from './engine';
import { parseResume, parseVacancy } from './parse';
import { sampleVacancy, siteResume } from './samples';
import { detectLang, stem, stems } from './text';

const resumeRu = `Иван Петров
Маркетолог
ivan@example.com, +7 900 123 45 67

Опыт работы
Руководитель отдела маркетинга — ООО Ромашка
03.2020 – по настоящее время
- Запустил контекстную рекламу и снизил CAC на 25%
- Вёл соцсети компании
- Отвечал за email-рассылки

Маркетолог — Агентство Ласточка
2016 – 2020
- Настраивал Яндекс Директ для 30 клиентов

Навыки
Яндекс Директ, Excel, копирайтинг

Образование
МГУ, экономика, 2016`;

describe('text helpers', () => {
  it('stems russian and english word forms to the same base', () => {
    expect(stem('аналитика')).toBe(stem('аналитики'));
    expect(stem('campaigns')).toBe(stem('campaign'));
    expect(stems('юнит-экономики')).toEqual(stems('юнит-экономика'));
  });

  it('detects language', () => {
    expect(detectLang(resumeRu)).toBe('ru');
    expect(detectLang(sampleVacancy.en)).toBe('en');
  });
});

describe('parsing', () => {
  it('splits a resume into header, jobs and skills', () => {
    const r = parseResume(resumeRu);
    expect(r.name).toBe('Иван Петров');
    expect(r.title).toBe('Маркетолог');
    expect(r.contacts[0]).toContain('ivan@example.com');
    expect(r.jobs).toHaveLength(2);
    expect(r.jobs[0].header[0]).toContain('Ромашка');
    expect(r.jobs[0].bullets).toHaveLength(3);
    expect(r.skills).toEqual(['Яндекс Директ', 'Excel', 'копирайтинг']);
  });

  it('finds the vacancy title and sections', () => {
    const v = parseVacancy(sampleVacancy.ru);
    expect(v.title).toBe('Head of Growth (B2B SaaS, MarTech)');
    expect(v.parts.some((p) => p.part === 'must')).toBe(true);
    expect(v.parts.some((p) => p.part === 'nice')).toBe(true);
  });

  it('parses the CV on this site in both languages', () => {
    for (const lang of ['ru', 'en'] as const) {
      const r = parseResume(siteResume(lang));
      expect(r.jobs).toHaveLength(5);
      expect(r.jobs.every((j) => j.hasDates)).toBe(true);
      expect(r.skills.length).toBeGreaterThan(5);
    }
  });
});

describe('keywords', () => {
  it('extracts must-have terms and ignores the benefits block', () => {
    const { keywords } = extractKeywords(sampleVacancy.ru);
    const labels = keywords.map((k) => k.label.toLowerCase());
    expect(labels).toContain('sql');
    expect(labels).toContain('cac');
    expect(labels.some((l) => l.includes('юнит'))).toBe(true);
    expect(labels).not.toContain('дмс');
    const sql = keywords.find((k) => k.label === 'SQL')!;
    expect(sql.importance).toBe('must');
  });

  it('matches synonyms across languages', () => {
    const a = analyze('Опыт: снизил стоимость привлечения клиента на 20%', 'Requirements:\n- CAC ownership');
    expect(a.keywords.find((k) => k.id === 'cac')?.coverage).toBe('full');
  });

  it('returns highlight ranges on the original text', () => {
    const text = 'Сквозная аналитика и CAC';
    const { keywords } = extractKeywords('Требования:\n- сквозная аналитика\n- CAC');
    const ranges = keywordRanges(text, keywords);
    expect(ranges.map(([s, e]) => text.slice(s, e))).toEqual(['Сквозная аналитика', 'CAC']);
  });
});

describe('analyze', () => {
  const a = analyze(resumeRu, sampleVacancy.ru);

  it('never adds missing skills to the tailored resume', () => {
    const missing = a.keywords.filter((k) => k.coverage === 'missing').map((k) => k.label);
    expect(missing).toContain('SQL');
    expect(a.tailored.skills).not.toContain('SQL');
  });

  it('aligns the headline with the vacancy and keeps original facts', () => {
    expect(a.tailored.headline).toBe('Head of Growth (B2B SaaS, MarTech)');
    expect(a.tailored.experience[0].bullets[0]).toBe('Запустил контекстную рекламу и снизил CAC на 25%');
    expect(a.changes.some((c) => c.code === 'headline')).toBe(true);
  });

  it('scores coverage and the 5-second rule', () => {
    expect(a.coverage).toBeGreaterThan(0);
    expect(a.coverage).toBeLessThan(60);
    const passed = (list: { status: string }[]) => list.filter((c) => c.status === 'pass').length;
    expect(passed(a.fiveSec.after)).toBeGreaterThanOrEqual(passed(a.fiveSec.before));
  });

  it('the site CV covers most of a martech growth vacancy', () => {
    const own = analyze(siteResume('ru'), sampleVacancy.ru);
    expect(own.coverage).toBeGreaterThan(50);
    expect(own.tailored.achievements.length).toBeGreaterThanOrEqual(2);
  });
});
