// Rules-only resume tailoring. Everything runs in the browser and nothing is
// invented: the tailored resume only reorders, re-labels and cleans what the
// candidate already wrote; gaps become recommendations instead of new claims.
// Field names (coverage, keywordHits/keywordMisses) mirror Career Evidence OS
// quick-tailor so a future hand-off to its AI flow is a straight mapping.

import { lexicon, type TermCategory } from './lexicon';
import {
  EMAIL_RE,
  FANCY_RE,
  METRIC_RE,
  PHONE_RE,
  YEARS_RE,
  YEAR_RE,
  capitalize,
  cleanLine,
  detectLang,
  isStop,
  normalize,
  stem,
  stems,
  tokenSpans,
  tokenize,
  wordCount,
  type TextLang,
} from './text';
import { parseResume, parseVacancy, type ParsedResume, type VacancyPart } from './parse';

export type Coverage = 'full' | 'partial' | 'missing';
export type Importance = 'must' | 'core' | 'nice';

export interface Keyword {
  id: string;
  label: string;
  cat: TermCategory | 'other';
  importance: Importance;
  weight: number;
  coverage: Coverage;
  seqs: string[][]; // stemmed aliases, used for matching and highlighting
}

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface Check {
  id: string;
  status: CheckStatus;
  fixed?: boolean; // the tailored version already fixes it
  params?: Record<string, string | number>;
}

export interface TailoredJob {
  header: string[];
  bullets: string[];
  trimmed: number;
}

export interface TailoredResume {
  lang: TextLang;
  name: string;
  headline: string;
  contacts: string[];
  summary: string;
  skills: string[];
  achievements: string[];
  experience: TailoredJob[];
  sections: { kind: string; title: string; lines: string[] }[];
}

export interface Change {
  code: 'headline' | 'summary' | 'skills' | 'achievements' | 'reordered' | 'trimmed' | 'headings' | 'cleaned';
  n?: number;
  from?: string;
  to?: string;
}

export interface Analysis {
  resumeLang: TextLang;
  vacancyTitle: string;
  keywords: Keyword[];
  keywordHits: string[];
  keywordMisses: string[];
  coverage: number; // 0–100, weighted
  mustCoverage: number; // 0–100, must-haves only
  ats: Check[];
  fiveSec: { before: Check[]; after: Check[] };
  topBlock: string[]; // what a recruiter sees first in the tailored version
  tailored: TailoredResume;
  changes: Change[];
  quantify: string[]; // relevant bullets without numbers
}

// ---------- keyword extraction ----------

const PART_WEIGHT: Record<VacancyPart, number> = {
  title: 3,
  must: 2.5,
  duties: 1.6,
  general: 1.2,
  nice: 0.8,
  about: 0.3,
  offer: 0,
};

const PART_IMPORTANCE: Record<VacancyPart, Importance> = {
  title: 'must',
  must: 'must',
  duties: 'core',
  general: 'core',
  nice: 'nice',
  about: 'nice',
  offer: 'nice',
};

const IMPORTANCE_RANK: Record<Importance, number> = { must: 0, core: 1, nice: 2 };

const LEX = lexicon.map((entry) => ({
  entry,
  aliases: entry.aliases.map((raw) => ({ raw, seq: stems(raw) })),
}));

function findSeq(hay: string[], needle: string[], from = 0): number {
  if (!needle.length) return -1;
  outer: for (let i = from; i <= hay.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return i;
  }
  return -1;
}

function hasSeq(hay: string[], needle: string[]): boolean {
  return findSeq(hay, needle) >= 0;
}

const ACRONYMS = new Set(['crm', 'seo', 'sem', 'smm', 'pr', 'ai', 'ml', 'ux', 'ui', 'ppc', 'roi', 'kpi', 'cdp', 'abm', 'cro', 'mvp', 'cjm', 'pmf', 'rfm', 'cvm', 'osa', 'sql', 'api', 'bi', 'p&l']);

function displayLabel(raw: string, canonical: string): string {
  if (raw.toLowerCase() === canonical.toLowerCase()) return canonical;
  if (/^[a-z0-9&/+.-]{2,4}$/.test(raw)) return raw.toUpperCase();
  // "b2b маркетинг" → "B2B маркетинг", "crm-маркетинг" → "CRM-маркетинг"
  const fixed = raw.replace(/\ba\/b\b/g, 'A/B').replace(/[a-z0-9&]+/g, (w) => (ACRONYMS.has(w) || (/\d/.test(w) && w.length <= 4) ? w.toUpperCase() : w));
  return capitalize(fixed);
}

interface Hit {
  id: string;
  label: string;
  cat: TermCategory | 'other';
  part: VacancyPart;
  seqs: string[][];
  fallback: boolean;
}

function lexiconHits(lineStems: string[], part: VacancyPart): { hits: Hit[]; covered: boolean[] } {
  // longest alias first, so "маркетинговая аналитика" wins over "аналитика"
  const found: { start: number; len: number; hit: Hit }[] = [];
  for (const { entry, aliases } of LEX) {
    for (const alias of aliases) {
      const at = findSeq(lineStems, alias.seq);
      if (at < 0) continue;
      found.push({
        start: at,
        len: alias.seq.length,
        hit: {
          id: entry.id,
          label: displayLabel(alias.raw, entry.aliases[0]),
          cat: entry.cat,
          part,
          seqs: aliases.map((a) => a.seq),
          fallback: false,
        },
      });
      break;
    }
  }
  found.sort((a, b) => b.len - a.len);
  const covered = lineStems.map(() => false);
  const hits: Hit[] = [];
  for (const f of found) {
    const span = covered.slice(f.start, f.start + f.len);
    if (span.every(Boolean)) continue; // fully inside a longer match
    span.forEach((_, k) => (covered[f.start + k] = true));
    hits.push(f.hit);
  }
  return { hits, covered };
}

const ACRONYM_RE = /(?<![\p{L}\d])[A-ZА-ЯЁ][A-ZА-ЯЁ0-9&]{1,5}(?![\p{L}\d])/gu;
const LATIN_WORD_RE = /(?<![\p{L}\d])[A-Za-z][A-Za-z0-9.+#-]{2,}(?![\p{L}\d])/gu;
const CAMEL_RE = /(?<![\p{L}\d])[A-Z][a-z]+[A-Z][A-Za-z]+(?![\p{L}\d])/gu;
const NOT_TERMS = new Set([
  'ооо', 'зао', 'ип', 'рф', 'тк', 'дмс', 'нко', 'llc', 'inc', 'ltd', 'the', 'and', 'etc', 'usd', 'rub', 'eur', 'hr', 'cv',
  // role words: they belong to the headline, not to the skills list
  'head', 'lead', 'senior', 'junior', 'middle', 'manager', 'director', 'chief', 'officer', 'vp', 'ceo', 'cmo', 'cto', 'coo', 'of',
]);
const CEFR_RE = /^[abc][12]\+?$/i;

function fallbackHits(line: string, lineStems: string[], covered: boolean[], part: VacancyPart, vacancyLang: TextLang): Hit[] {
  const hits: Hit[] = [];
  const coveredStems = new Set(lineStems.filter((_, i) => covered[i]));
  const add = (surface: string) => {
    const seq = stems(surface);
    if (!seq.length || seq.every((s) => isStop(s) || coveredStems.has(s))) return;
    if (NOT_TERMS.has(normalize(surface)) || CEFR_RE.test(surface)) return;
    hits.push({ id: `x:${seq.join(' ')}`, label: surface, cat: 'other', part, seqs: [seq], fallback: true });
  };
  for (const m of line.matchAll(ACRONYM_RE)) add(m[0]);
  for (const m of line.matchAll(CAMEL_RE)) add(m[0]);
  // in a Russian vacancy, Latin words are almost always tools or terms
  if (vacancyLang === 'ru') for (const m of line.matchAll(LATIN_WORD_RE)) add(m[0]);
  return hits;
}

/** Repeated content words in requirements/duties that no dictionary covered. */
function frequentTerms(lines: { part: VacancyPart; text: string }[], known: Set<string>): Hit[] {
  const counts = new Map<string, { n: number; part: VacancyPart; surface: Map<string, number> }>();
  for (const { part, text } of lines) {
    if (part !== 'must' && part !== 'duties' && part !== 'title') continue;
    const seen = new Set<string>();
    for (const token of tokenize(text)) {
      const s = stem(token);
      if (s.length < 5 || isStop(s) || known.has(s) || seen.has(s) || /\d/.test(s)) continue;
      seen.add(s);
      const c = counts.get(s) ?? { n: 0, part, surface: new Map() };
      c.n++;
      c.surface.set(token, (c.surface.get(token) ?? 0) + 1);
      if (PART_WEIGHT[part] > PART_WEIGHT[c.part]) c.part = part;
      counts.set(s, c);
    }
  }
  return [...counts.entries()]
    .filter(([, c]) => c.n >= 2)
    .sort((a, b) => b[1].n - a[1].n)
    .slice(0, 6)
    .map(([s, c]) => {
      const surface = [...c.surface.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return { id: `f:${s}`, label: capitalize(surface), cat: 'other' as const, part: c.part, seqs: [[s]], fallback: true };
    });
}

export function extractKeywords(vacancyText: string): { title: string; keywords: Omit<Keyword, 'coverage'>[] } {
  const vacancy = parseVacancy(vacancyText);
  const vacancyLang = detectLang(vacancyText);
  const all: Hit[] = [];
  const knownStems = new Set<string>();

  for (const { part, text } of vacancy.parts) {
    if (PART_WEIGHT[part] === 0) continue;
    const lineStems = stems(text);
    const { hits, covered } = lexiconHits(lineStems, part);
    hits.forEach((h) => h.seqs.forEach((seq) => seq.forEach((s) => knownStems.add(s))));
    all.push(...hits, ...fallbackHits(text, lineStems, covered, part, vacancyLang));
  }
  all.forEach((h) => h.seqs.forEach((seq) => seq.forEach((s) => knownStems.add(s))));
  all.push(...frequentTerms(vacancy.parts, knownStems));

  const byId = new Map<string, { hit: Hit; parts: VacancyPart[] }>();
  for (const hit of all) {
    const cur = byId.get(hit.id);
    if (cur) cur.parts.push(hit.part);
    else byId.set(hit.id, { hit, parts: [hit.part] });
  }

  const keywords = [...byId.values()].map(({ hit, parts }) => {
    const best = parts.reduce((a, b) => (PART_WEIGHT[b] > PART_WEIGHT[a] ? b : a));
    const repeat = Math.min(parts.length - 1, 4) * 0.4;
    const weight = (PART_WEIGHT[best] + repeat) * (hit.fallback ? 0.75 : 1);
    return {
      id: hit.id,
      label: hit.label,
      cat: hit.cat,
      importance: PART_IMPORTANCE[best],
      weight: Math.round(weight * 100) / 100,
      seqs: hit.seqs,
    };
  });

  keywords.sort(
    (a, b) => IMPORTANCE_RANK[a.importance] - IMPORTANCE_RANK[b.importance] || b.weight - a.weight
  );
  return { title: vacancy.title, keywords: keywords.slice(0, 30) };
}

// ---------- coverage ----------

function coverageOf(seqs: string[][], resumeStems: string[], resumeSet: Set<string>): Coverage {
  if (seqs.some((seq) => hasSeq(resumeStems, seq))) return 'full';
  const multi = seqs.filter((seq) => seq.length > 1);
  const partial = multi.some((seq) => {
    const content = seq.filter((s) => !isStop(s));
    const found = content.filter((s) => resumeSet.has(s)).length;
    return found >= 2 && found / content.length >= 0.5; // all words present, just not together
  });
  return partial ? 'partial' : 'missing';
}

function relevance(text: string, keywords: Keyword[]): number {
  const s = stems(text);
  let score = 0;
  for (const k of keywords) if (k.seqs.some((seq) => hasSeq(s, seq))) score += k.weight;
  if (METRIC_RE.test(text)) score += 1.2;
  return score;
}

/** Character ranges of keyword matches in `text`, for highlighting. */
export function keywordRanges(text: string, keywords: Pick<Keyword, 'seqs'>[]): [number, number][] {
  const toks = tokenSpans(text).map((t) => ({ ...t, stem: stem(t.token) }));
  const hay = toks.map((t) => t.stem);
  const ranges: [number, number][] = [];
  for (const k of keywords) {
    for (const seq of k.seqs) {
      let at = findSeq(hay, seq);
      while (at >= 0) {
        ranges.push([toks[at].start, toks[at + seq.length - 1].end]);
        at = findSeq(hay, seq, at + 1);
      }
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const last = merged[merged.length - 1];
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]);
    else merged.push([...r]);
  }
  return merged;
}

// ---------- tailored resume ----------

const TITLES: Record<string, Record<TextLang, string>> = {
  summary: { ru: 'Профиль', en: 'Summary' },
  skills: { ru: 'Ключевые навыки', en: 'Key skills' },
  achievements: { ru: 'Ключевые достижения', en: 'Key achievements' },
  experience: { ru: 'Опыт работы', en: 'Work experience' },
  projects: { ru: 'Проекты', en: 'Projects' },
  education: { ru: 'Образование', en: 'Education' },
  courses: { ru: 'Курсы и сертификаты', en: 'Courses & certifications' },
  languages: { ru: 'Языки', en: 'Languages' },
  other: { ru: 'Дополнительно', en: 'Additional information' },
};

export const sectionTitle = (kind: string, lang: TextLang) => TITLES[kind]?.[lang] ?? kind;

function yearsOfExperience(resume: ParsedResume): number | null {
  const top = [resume.title, ...resume.headerExtra, ...(resume.sections.summary ?? [])].join(' ');
  const stated = top.match(YEARS_RE);
  if (stated) return Number(stated[1]);
  const years = (resume.sections.experience ?? []).join(' ').match(YEAR_RE)?.map(Number) ?? [];
  if (!years.length) return null;
  const span = new Date().getFullYear() - Math.min(...years);
  return span >= 1 && span <= 50 ? span : null;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-ZА-ЯЁ0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
}

const sameSkill = (a: string, b: string) => stems(a).join(' ') === stems(b).join(' ');

function inSentence(k: Keyword, lang: TextLang): string {
  if (k.cat === 'tool' || k.cat === 'other') return k.label;
  const re = lang === 'ru' ? /^[А-ЯЁ][а-яё]/ : /^[A-Z][a-z]+(\s[a-z][\w-]*)*$/;
  return re.test(k.label) ? k.label.charAt(0).toLowerCase() + k.label.slice(1) : k.label;
}

function buildSummary(lang: TextLang, headline: string, years: number | null, focus: string[], original: string[], keywords: Keyword[]): string {
  const list = focus.slice(0, 4);
  // the original summary already says how many years — don't repeat it
  if (YEARS_RE.test(original.join(' '))) years = null;
  headline = headline.replace(/\s*\([^)]*\)\s*$/, '');
  let first = '';
  if (lang === 'ru') {
    const yearsWord = years !== null ? (years % 10 === 1 && years % 100 !== 11 ? 'года' : 'лет') : '';
    if (years !== null && list.length) first = `${headline} с опытом более ${years} ${yearsWord}: ${list.join(', ')}.`;
    else if (years !== null) first = `${headline} с опытом более ${years} ${yearsWord}.`;
    else if (list.length) first = `${headline}. Ключевая экспертиза: ${list.join(', ')}.`;
  } else {
    if (years !== null && list.length) first = `${headline} with ${years}+ years of experience in ${list.join(', ')}.`;
    else if (years !== null) first = `${headline} with ${years}+ years of experience.`;
    else if (list.length) first = `${headline}. Core expertise: ${list.join(', ')}.`;
  }
  if (!headline) first = first.replace(/^\.\s*/, '');

  const sentences = splitSentences(original.map(cleanLine).join(' '));
  const ranked = sentences
    .map((s, i) => ({ s, i, score: relevance(s, keywords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s);
  return [first, ...ranked].filter(Boolean).join(' ');
}

function buildTailored(resume: ParsedResume, keywords: Keyword[], vacancyTitle: string, lang: TextLang, changes: Change[]): TailoredResume {
  const matched = keywords.filter((k) => k.coverage === 'full');

  const headline = vacancyTitle || resume.title;
  if (vacancyTitle && normalize(vacancyTitle) !== normalize(resume.title)) {
    changes.push({ code: 'headline', from: resume.title, to: vacancyTitle });
  }

  const years = yearsOfExperience(resume);
  const titleStems = new Set(stems(vacancyTitle));
  const focus = matched
    .filter((k) => k.importance !== 'nice' && k.cat !== 'soft')
    .filter((k) => !k.seqs.some((seq) => seq.every((st) => titleStems.has(st)))) // already in the headline
    .map((k) => inSentence(k, lang));
  const summary = buildSummary(lang, headline, years, focus, resume.sections.summary ?? [], keywords);
  if (summary) changes.push({ code: 'summary' });

  // skills: vacancy wording first (exact match for ATS), then the rest of the original list
  const skills: string[] = [];
  for (const label of [...matched.filter((k) => k.cat !== 'soft').map((k) => k.label), ...resume.skills.map(capitalize)]) {
    if (skills.length >= 24) break;
    if (!skills.some((s) => sameSkill(s, label))) skills.push(label);
  }
  const fromVacancy = matched.filter((k) => k.cat !== 'soft').length;
  if (fromVacancy) changes.push({ code: 'skills', n: Math.min(fromVacancy, 24) });

  // experience: most relevant bullets first; long tail of early jobs trimmed
  let reordered = 0;
  let trimmedTotal = 0;
  const experience: TailoredJob[] = resume.jobs.map((job, index) => {
    const scored = job.bullets.map((b, i) => ({ b, i, score: relevance(b, keywords) }));
    const sorted = [...scored].sort((a, b) => b.score - a.score || a.i - b.i);
    if (sorted.some((x, i) => x.i !== i)) reordered++;
    const limit = index >= 3 ? 3 : sorted.length;
    const trimmed = Math.max(0, sorted.length - limit);
    trimmedTotal += trimmed;
    return { header: job.header, bullets: sorted.slice(0, limit).map((x) => x.b), trimmed };
  });
  if (reordered) changes.push({ code: 'reordered', n: reordered });
  if (trimmedTotal) changes.push({ code: 'trimmed', n: trimmedTotal });

  // key achievements: existing quantified bullets, most relevant first
  const originalAchievements = (resume.sections.achievements ?? []).map(cleanLine).filter(Boolean);
  const candidates = experience
    .slice(0, 3)
    .flatMap((j) => j.bullets)
    .filter((b) => METRIC_RE.test(b) && b.length <= 220)
    .map((b) => ({ b, score: relevance(b, keywords) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.b);
  const achievements = [...originalAchievements];
  for (const c of candidates) {
    if (achievements.length >= 3) break;
    if (!achievements.includes(c)) achievements.push(c);
  }
  if (achievements.length < 2) achievements.length = 0;
  if (achievements.length > originalAchievements.length) {
    changes.push({ code: 'achievements', n: achievements.length - originalAchievements.length });
  }

  const sections = (['projects', 'education', 'courses', 'languages', 'other'] as const)
    .filter((kind) => resume.sections[kind]?.some((l) => l.trim()))
    .map((kind) => ({
      kind,
      title: sectionTitle(kind, lang),
      lines: resume.sections[kind]!.map(cleanLine).filter(Boolean),
    }));

  changes.push({ code: 'headings' });
  const fancy = (resume.rawText.match(FANCY_RE) ?? []).length + (resume.rawText.match(/\t|\|/g) ?? []).length;
  if (fancy) changes.push({ code: 'cleaned', n: fancy });

  return {
    lang,
    name: resume.name,
    headline,
    contacts: resume.contacts,
    summary,
    skills,
    achievements,
    experience,
    sections,
  };
}

// ---------- checks ----------

function fiveSecondChecks(top: string, keywords: Keyword[], vacancyTitle: string, summaryWords: number): Check[] {
  const topStems = stems(top);
  const titleStems = stems(vacancyTitle).filter((s) => !isStop(s));
  const titleHit = titleStems.length
    ? titleStems.filter((s) => topStems.includes(s)).length / titleStems.length
    : 0;
  const topMust = keywords.filter((k) => k.importance === 'must').slice(0, 5);
  const mustInTop = topMust.filter((k) => k.seqs.some((seq) => hasSeq(topStems, seq))).length;
  const need = Math.min(3, topMust.length);
  return [
    { id: 'headline', status: !vacancyTitle ? 'warn' : titleHit >= 0.6 ? 'pass' : 'fail' },
    { id: 'years', status: YEARS_RE.test(top) ? 'pass' : 'fail' },
    { id: 'metric', status: METRIC_RE.test(top) ? 'pass' : 'fail' },
    {
      id: 'keywords',
      status: need === 0 ? 'warn' : mustInTop >= need ? 'pass' : mustInTop > 0 ? 'warn' : 'fail',
      params: { n: mustInTop, total: topMust.length },
    },
    { id: 'contacts', status: EMAIL_RE.test(top) || PHONE_RE.test(top) ? 'pass' : 'fail' },
    { id: 'concise', status: summaryWords === 0 ? 'warn' : summaryWords <= 75 ? 'pass' : 'warn', params: { n: summaryWords } },
  ];
}

function atsChecks(resume: ParsedResume, mustCoverage: number, vacancyTitle: string): Check[] {
  const text = resume.rawText;
  const bullets = resume.jobs.flatMap((j) => j.bullets);
  const quantified = bullets.filter((b) => METRIC_RE.test(b)).length;
  const words = wordCount(text);
  const missingSections = (['experience', 'skills', 'education'] as const).filter(
    (k) => !resume.foundHeadings.includes(k)
  );
  const fancy = (text.match(FANCY_RE) ?? []).length + (text.match(/\t|\|/g) ?? []).length;
  const longBullets = bullets.filter((b) => b.length > 250).length;
  const titleStems = stems(vacancyTitle).filter((s) => !isStop(s));
  const headStems = stems([resume.title, ...(resume.sections.summary ?? [])].join(' '));
  const titleHit = titleStems.length ? titleStems.filter((s) => headStems.includes(s)).length / titleStems.length : 0;
  const jobsWithDates = resume.jobs.filter((j) => j.hasDates).length;

  return [
    {
      id: 'contacts',
      status: EMAIL_RE.test(text) && PHONE_RE.test(text) ? 'pass' : EMAIL_RE.test(text) || PHONE_RE.test(text) ? 'warn' : 'fail',
    },
    {
      id: 'sections',
      status: missingSections.length === 0 ? 'pass' : missingSections.length === 1 ? 'warn' : 'fail',
      fixed: missingSections.length > 0 && missingSections.every((k) => k !== 'experience' || resume.jobs.length > 0),
      params: { missing: missingSections.join(', ') },
    },
    { id: 'dates', status: resume.jobs.length && jobsWithDates === resume.jobs.length ? 'pass' : resume.jobs.length ? 'warn' : 'fail' },
    { id: 'special', status: fancy === 0 ? 'pass' : 'warn', fixed: fancy > 0, params: { n: fancy } },
    { id: 'length', status: words >= 250 && words <= 1100 ? 'pass' : 'warn', params: { n: words } },
    {
      id: 'quantified',
      status: !bullets.length ? 'fail' : quantified / bullets.length >= 0.3 ? 'pass' : 'warn',
      params: { n: quantified, total: bullets.length },
    },
    { id: 'longBullets', status: longBullets === 0 ? 'pass' : 'warn', params: { n: longBullets } },
    { id: 'title', status: !vacancyTitle ? 'warn' : titleHit >= 0.6 ? 'pass' : 'fail', fixed: !!vacancyTitle && titleHit < 0.6 },
    {
      id: 'keywords',
      status: mustCoverage >= 70 ? 'pass' : mustCoverage >= 45 ? 'warn' : 'fail',
      params: { n: mustCoverage },
    },
  ];
}

// ---------- main ----------

export function analyze(resumeText: string, vacancyText: string): Analysis {
  const resume = parseResume(resumeText);
  const resumeLang = detectLang(resumeText);
  const { title: vacancyTitle, keywords: raw } = extractKeywords(vacancyText);

  const resumeStems = stems(resumeText);
  const resumeSet = new Set(resumeStems);
  const keywords: Keyword[] = raw.map((k) => ({ ...k, coverage: coverageOf(k.seqs, resumeStems, resumeSet) }));

  const pct = (list: Keyword[]) => {
    const total = list.reduce((a, k) => a + k.weight, 0);
    if (!total) return 0;
    const got = list.reduce((a, k) => a + (k.coverage === 'full' ? k.weight : k.coverage === 'partial' ? k.weight / 2 : 0), 0);
    return Math.round((got / total) * 100);
  };
  const coverage = pct(keywords);
  const mustCoverage = pct(keywords.filter((k) => k.importance === 'must'));

  const changes: Change[] = [];
  const tailored = buildTailored(resume, keywords, vacancyTitle, resumeLang, changes);

  const topBlock = [
    tailored.name,
    tailored.headline,
    tailored.contacts.join(' · '),
    tailored.summary,
    ...tailored.achievements.slice(0, 2),
  ].filter(Boolean);

  const originalTop = resumeText.split(/\s+/).slice(0, 80).join(' ');
  const originalSummaryWords = wordCount((resume.sections.summary ?? []).join(' '));

  const quantify = resume.jobs
    .slice(0, 2)
    .flatMap((j) => j.bullets)
    .filter((b) => !METRIC_RE.test(b) && relevance(b, keywords) > 0)
    .slice(0, 3);

  return {
    resumeLang,
    vacancyTitle,
    keywords,
    keywordHits: keywords.filter((k) => k.coverage === 'full').map((k) => k.label),
    keywordMisses: keywords.filter((k) => k.coverage === 'missing').map((k) => k.label),
    coverage,
    mustCoverage,
    ats: atsChecks(resume, mustCoverage, vacancyTitle),
    fiveSec: {
      before: fiveSecondChecks(originalTop, keywords, vacancyTitle, originalSummaryWords),
      after: fiveSecondChecks(topBlock.join(' '), keywords, vacancyTitle, wordCount(tailored.summary)),
    },
    topBlock,
    tailored,
    changes,
    quantify,
  };
}
