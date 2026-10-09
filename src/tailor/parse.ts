import {
  BULLET_RE,
  EMAIL_RE,
  LINK_RE,
  PHONE_RE,
  cleanLine,
  isDateRangeLine,
  normalize,
} from './text';

// ---------- resume ----------

export type ResumeSectionKind =
  | 'summary'
  | 'skills'
  | 'experience'
  | 'education'
  | 'courses'
  | 'languages'
  | 'projects'
  | 'achievements'
  | 'contacts'
  | 'other';

const RESUME_HEADINGS: [ResumeSectionKind, RegExp][] = [
  ['summary', /^(о себе|обо мне|профиль|краткое резюме|резюме|цель|кратко|summary|professional summary|profile|about me|about|objective)$/],
  ['skills', /^(навыки|ключевые навыки|профессиональные навыки|компетенции|ключевые компетенции|скиллы|стек|технологии|инструменты|skills|key skills|core skills|core competencies|competencies|tech stack|technical skills|expertise|tools)$/],
  ['experience', /^(опыт работы|опыт|профессиональный опыт|карьера|трудовая деятельность|места работы|experience|work experience|professional experience|employment|employment history|career|career history)$/],
  ['education', /^(образование|высшее образование|education)$/],
  ['courses', /^(курсы|повышение квалификации|сертификаты|сертификация|тренинги|дополнительное образование|certifications?|courses|training|licenses (and|&) certifications)$/],
  ['languages', /^(языки|иностранные языки|знание языков|владение языками|languages)$/],
  ['projects', /^(проекты|pet-проекты|pet проекты|projects|side projects|selected projects)$/],
  ['achievements', /^(достижения|ключевые достижения|награды|achievements|key achievements|awards)$/],
  ['contacts', /^(контакты|контактная информация|contacts?|contact information)$/],
  ['other', /^(дополнительно|дополнительная информация|хобби|интересы|увлечения|additional|additional information|interests|hobbies|other)$/],
];

export function headingKind(line: string): ResumeSectionKind | null {
  const text = normalize(line)
    .replace(/^[#*_\s]+|[#*_\s:]+$/g, '')
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    .trim();
  if (!text || text.length > 40 || text.split(/\s+/).length > 5) return null;
  for (const [kind, re] of RESUME_HEADINGS) if (re.test(text)) return kind;
  return null;
}

export interface Job {
  header: string[];
  bullets: string[];
  hasDates: boolean;
}

export interface ParsedResume {
  name: string;
  title: string;
  contacts: string[];
  headerExtra: string[];
  sections: Partial<Record<ResumeSectionKind, string[]>>;
  sectionOrder: ResumeSectionKind[];
  jobs: Job[];
  skills: string[];
  foundHeadings: ResumeSectionKind[];
  rawText: string;
}

const isContact = (line: string) => EMAIL_RE.test(line) || PHONE_RE.test(line) || LINK_RE.test(line);
const isBullet = (line: string) => BULLET_RE.test(line);
const isLong = (line: string) => line.length > 90 || (line.length > 50 && /[.;]$/.test(line));

function splitLongLine(line: string): string[] {
  if (line.length <= 300) return [line];
  return line
    .split(/(?<=[.;])\s+(?=[A-ZА-ЯЁ])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseJobs(lines: string[]): Job[] {
  const anchors = lines.map((l, i) => (isDateRangeLine(l) && !isBullet(l) ? i : -1)).filter((i) => i >= 0);
  if (!anchors.length) {
    const bullets = lines.filter((l) => l.trim()).flatMap(splitLongLine).map(cleanLine).filter(Boolean);
    return bullets.length ? [{ header: [], bullets, hasDates: false }] : [];
  }

  // a job starts up to 2 short non-bullet lines before its date line
  const starts = anchors.map((a, n) => {
    const floor = n === 0 ? 0 : anchors[n - 1] + 1;
    let s = a;
    while (s - 1 >= floor && a - (s - 1) <= 2) {
      const prev = lines[s - 1];
      if (!prev.trim() || isBullet(prev) || isLong(prev)) break;
      s--;
    }
    return s;
  });

  // anything before the first job is kept as a free-text intro job (rare)
  const jobs: Job[] = [];
  starts.forEach((start, n) => {
    const end = n + 1 < starts.length ? starts[n + 1] : lines.length;
    const block = lines.slice(start, end).filter((l) => l.trim());
    const header: string[] = [];
    let i = 0;
    while (i < block.length && header.length < 5 && !isBullet(block[i]) && !isLong(block[i])) {
      header.push(cleanLine(block[i]));
      i++;
    }
    const bullets = block.slice(i).flatMap(splitLongLine).map(cleanLine).filter(Boolean);
    jobs.push({ header: header.filter(Boolean), bullets, hasDates: true });
  });
  return jobs;
}

export function splitSkills(lines: string[]): string[] {
  return lines
    .flatMap((l) => cleanLine(l).split(/\s*[,;•·|]\s*|\s+-\s+/))
    .map((s) => s.replace(/\.$/, '').trim())
    .filter((s) => s.length > 1 && s.length < 60);
}

export function parseResume(text: string): ParsedResume {
  const lines = text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, ''));

  const sections: Partial<Record<ResumeSectionKind, string[]>> = {};
  const sectionOrder: ResumeSectionKind[] = [];
  const header: string[] = [];
  let current: ResumeSectionKind | null = null;

  for (const line of lines) {
    const kind = headingKind(line);
    if (kind) {
      current = kind;
      if (!sections[kind]) {
        sections[kind] = [];
        sectionOrder.push(kind);
      }
      continue;
    }
    if (current) sections[current]!.push(line);
    else header.push(line);
  }

  const foundHeadings = [...sectionOrder];

  // No experience heading: find jobs by date lines in the free text after the header
  const headerLines = header.filter((l) => l.trim());
  let headTop = headerLines;
  if (!sections.experience) {
    const firstDate = headerLines.findIndex((l) => isDateRangeLine(l));
    if (firstDate >= 0) {
      let jobStart = firstDate;
      while (
        jobStart - 1 >= 1 &&
        firstDate - (jobStart - 1) <= 2 &&
        !isLong(headerLines[jobStart - 1]) &&
        !isContact(headerLines[jobStart - 1])
      ) {
        jobStart--;
      }
      sections.experience = headerLines.slice(jobStart);
      headTop = headerLines.slice(0, jobStart);
      sectionOrder.push('experience');
    }
  }

  const contacts: string[] = [];
  const headerExtra: string[] = [];
  let name = '';
  let title = '';
  for (const raw of headTop) {
    const line = cleanLine(raw);
    if (!line) continue;
    if (isContact(line)) contacts.push(line);
    else if (!name) name = line;
    else if (!title && line.length <= 90) title = line;
    else headerExtra.push(line);
  }
  // long free text in the header is effectively a summary
  if (!sections.summary && headerExtra.some(isLong)) {
    sections.summary = headerExtra.filter(isLong);
    sectionOrder.unshift('summary');
  }
  if (sections.contacts) contacts.push(...sections.contacts.map(cleanLine).filter(Boolean));

  return {
    name,
    title,
    contacts,
    headerExtra: headerExtra.filter((l) => !isLong(l)),
    sections,
    sectionOrder,
    jobs: parseJobs(sections.experience ?? []),
    skills: splitSkills(sections.skills ?? []),
    foundHeadings,
    rawText: text,
  };
}

// ---------- vacancy ----------

export type VacancyPart = 'title' | 'must' | 'duties' | 'nice' | 'about' | 'offer' | 'general';

const VACANCY_HEADINGS: [VacancyPart, RegExp][] = [
  ['nice', /^(будет плюсом|плюсом будет|будет преимуществом|преимуществом будет|желательно|дополнительным плюсом|nice to have|nice-to-have|bonus points|preferred( qualifications)?|plus(es)?)(?=$|[\s:,.(!])/],
  ['must', /^(требования|наши ожидания|что (мы )?(ждем|ожидаем)|мы ждем|мы ожидаем|ожидания|кого мы ищем|ты нам подходишь|вы нам подходите|необходимые навыки|что нужно|нам важно|требуемый опыт|requirements|qualifications|minimum qualifications|what you('ll)? bring|what we('re)? look(ing)? for|you have|you are|about you|who you are|must have|must-have|skills)(?=$|[\s:,.(!])/],
  ['duties', /^(обязанности|задачи|ваши задачи|твои задачи|чем (предстоит|нужно|вы будете|ты будешь) заниматься|что (предстоит )?делать|функционал|responsibilities|what you('ll)? do|the role|your role|your responsibilities|duties|key responsibilities|in this role)(?=$|[\s:,.(!])/],
  ['offer', /^(условия|мы предлагаем|что мы предлагаем|предлагаем|что мы даем|компенсация|бонусы|we offer|what we offer|benefits|perks|compensation|why join)(?=$|[\s:,.(!])/],
  ['about', /^(о компании|о нас|кто мы|about us|about the company|who we are|company)(?=$|[\s:,.(!])/],
];

export function vacancyHeading(line: string): VacancyPart | null {
  const text = normalize(line)
    .replace(/[\p{Extended_Pictographic}]/gu, '')
    .replace(/^[#*_\s-]+/, '')
    .trim();
  if (!text || text.length > 70) return null;
  // heading lines are short and either end with ":" or have no sentence punctuation
  if (text.split(/\s+/).length > 8) return null;
  for (const [part, re] of VACANCY_HEADINGS) if (re.test(text)) return part;
  return null;
}

export interface ParsedVacancy {
  title: string;
  parts: { part: VacancyPart; text: string }[];
}

export function cleanVacancyTitle(line: string): string {
  return line
    .replace(/^(вакансия|позиция|должность|position|role|job title|vacancy)\s*[:—-]\s*/i, '')
    .replace(/\s*[,(—|-]\s*(от|до|from|up to)?\s*\d[\d\s.,]*(₽|руб|\$|€|k)?.*$/i, '')
    .replace(/\s*\((remote|удаленно|москва|moscow|hybrid|гибрид)[^)]*\)\s*$/i, '')
    .replace(FANCY_TITLE_RE, '')
    .trim();
}

const FANCY_TITLE_RE = /[\p{Extended_Pictographic}]/gu;

export function parseVacancy(text: string): ParsedVacancy {
  const lines = text.replace(/\r/g, '').split('\n').map((l) => l.trim());
  const nonEmpty = lines.filter(Boolean);

  const explicit = nonEmpty.find((l) => /^(вакансия|позиция|должность|position|role|job title|vacancy)\s*[:—-]/i.test(l));
  const first = nonEmpty[0] ?? '';
  const title = cleanVacancyTitle(
    explicit ?? (first.length <= 90 && !vacancyHeading(first) && !/[.!?]$/.test(first) ? first : '')
  );

  const parts: { part: VacancyPart; text: string }[] = [];
  let current: VacancyPart = 'general';
  for (const line of lines) {
    if (!line) continue;
    const heading = vacancyHeading(line);
    if (heading) {
      current = heading;
      continue;
    }
    if (title && cleanVacancyTitle(line) === title) continue;
    parts.push({ part: current, text: line });
  }
  if (title) parts.unshift({ part: 'title', text: title });
  return { title, parts };
}
