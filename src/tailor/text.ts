// Small text toolkit for RU/EN resumes and vacancies: normalization,
// tokenization and a deliberately light stemmer (enough to match
// "аналитика / аналитики / аналитику" or "campaign / campaigns").

export type TextLang = 'ru' | 'en';

export function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е').replace(/[‐‑‒–—―]/g, '-');
}

// keeps c++, c#, node.js, a/b, b2b, p&l, e-commerce as single tokens
const TOKEN_RE = /[a-zа-я0-9](?:[a-zа-я0-9+#&./-]*[a-zа-я0-9+#])?/g;

export interface TokenSpan {
  token: string;
  start: number;
  end: number;
}

/**
 * Tokens with their positions in the original text (normalize() keeps length).
 * "cac/cpa" and "cvm/retention" are split into words, while "a/b" and "ui/ux"-style
 * pairs of short parts stay whole.
 */
export function tokenSpans(text: string): TokenSpan[] {
  const spans: TokenSpan[] = [];
  for (const m of normalize(text).matchAll(TOKEN_RE)) {
    const token = m[0];
    const start = m.index!;
    const parts = token.split('/');
    if (parts.length > 1 && parts.every((p) => p.length >= 3)) {
      let offset = start;
      for (const part of parts) {
        spans.push({ token: part, start: offset, end: offset + part.length });
        offset += part.length + 1;
      }
    } else {
      spans.push({ token, start, end: start + token.length });
    }
  }
  return spans;
}

export function tokenize(text: string): string[] {
  return tokenSpans(text).map((s) => s.token);
}

export function detectLang(text: string): TextLang {
  const cyr = (text.match(/[а-яё]/gi) ?? []).length;
  const lat = (text.match(/[a-z]/gi) ?? []).length;
  return cyr >= lat * 0.6 ? 'ru' : 'en';
}

const RU_ENDINGS = [
  'иями', 'ями', 'ами', 'ией', 'иям', 'ием', 'ого', 'его', 'ому', 'ему', 'ыми', 'ими',
  'ость', 'ости', 'ться', 'ение', 'ения', 'ению', 'ением', 'ании', 'ание', 'ания',
  'ных', 'ной', 'ный', 'ная', 'ное', 'ные', 'ным', 'ах', 'ях', 'ов', 'ев', 'ей', 'ой',
  'ий', 'ый', 'ая', 'яя', 'ое', 'ее', 'ые', 'ие', 'ам', 'ям', 'ом', 'ем', 'ую', 'юю',
  'ть', 'а', 'я', 'о', 'е', 'и', 'ы', 'у', 'ю', 'ь', 'й',
];

const EN_ENDINGS = ['ations', 'ation', 'ings', 'ing', 'ies', 'ed', 'es', 's'];

export function stem(token: string): string {
  // "юнит-экономики" → stem each part, so it still matches "юнит-экономика"
  if (/^[a-zа-я]+(-[a-zа-я]+)+$/.test(token)) return token.split('-').map(stem).join('-');
  if (/[^a-zа-я]/.test(token)) return token; // acronyms with digits/symbols stay as is
  if (/[а-я]/.test(token)) {
    if (token.length <= 4) return token;
    for (const end of RU_ENDINGS) {
      if (token.endsWith(end) && token.length - end.length >= 4) return token.slice(0, -end.length);
    }
    return token;
  }
  if (token.length <= 4) return token;
  for (const end of EN_ENDINGS) {
    if (token.endsWith(end) && token.length - end.length >= 4) {
      return end === 'ies' ? token.slice(0, -3) + 'y' : token.slice(0, -end.length);
    }
  }
  return token;
}

export function stems(text: string): string[] {
  return tokenize(text).map(stem);
}

/** Does `needle` (already stemmed) occur as a contiguous run inside `hay`? */
export function containsSeq(hay: string[], needle: string[]): boolean {
  if (!needle.length || needle.length > hay.length) return false;
  outer: for (let i = 0; i <= hay.length - needle.length; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (hay[i + j] !== needle[j]) continue outer;
    }
    return true;
  }
  return false;
}

// Words that never make a useful keyword on their own: grammar, vacancy filler,
// generic adjectives. Compared after stemming, so list base forms.
const STOP_RAW = `
и в во не что он на я с со как а то все она так его но да ты к у же вы за бы по только ее мне было вот от меня еще нет о из ему теперь когда даже ну вдруг ли если уже или ни быть был него до вас нибудь опять уж вам ведь там потом себя ничего ей может они тут где есть надо ней для мы тебя их чем была сам чтоб без будто чего раз тоже себе под будет ж тогда кто этот того потому этого какой совсем ним здесь этом один почти мой тем чтобы нее сейчас были куда зачем всех никогда можно при наконец два об другой хоть после над больше тот через эти нас про всего них какая много разве три эту моя впрочем хорошо свою этой перед иногда лучше чуть том нельзя такой им более всегда конечно всю между
это наш наша наши ваш ваша ваши свой своя свои который которая которые которых также т.е т.д др г гг лет год года годы году месяц месяцев
опыт опыта опытом работа работы работе работать работаем работают умение умения навык навыки знание знания понимание уровень уровня наличие хороший хорошее отличный отличное сильный сильные высокий высокая готовность желание возможность возможности задача задачи цель цели
компания компании команда команды команду командой проект проекта проекты сотрудник сотрудники специалист специалиста менеджер менеджера руководитель руководителя директор директора отдел отдела направление направления
требование требования обязанности условия предлагаем ищем ищет нужно нужен нужна необходимо необходим необходимые плюсом будет будут преимуществом желательно
новый новые новых разных различных различные других основных ключевых текущих полный полная полностью рабочий рабочие рамках части участие участвовать вести ведение обеспечивать обеспечение осуществлять осуществление проводить проведение развивать развитие создавать создание формировать формирование помогать помощь выстраивать построение организация организовывать контроль
офис офисе удаленно удаленка удаленный гибрид гибридный график зарплата зп дмс оформление тк рф москва москве спб санкт-петербург россия
the a an and or of to in on for with at by from as is are be been being it its this that these those we you your our they their them he she his her will would can could should may might must not no yes if then than so such
experience experienced work working works job role position team teams company companies years year month months ability able skill skills knowledge understanding strong excellent good great solid proven track record level including include includes etc e.g i.e plus nice bonus preferred required requirement requirements responsibilities responsibility duties
new across within various other key main core based using use help helping build building drive driving own owning manage managing lead leading support supporting ensure develop developing create creating deliver delivering work closely partner partnering collaborate collaboration
we're you'll you're who what why how where when which about also more most well very just like
remote hybrid office salary benefits location full-time part-time time
`;

export const STOPWORDS = new Set(STOP_RAW.split(/\s+/).filter(Boolean).map((w) => stem(normalize(w))));

export function isStop(stemmed: string): boolean {
  return STOPWORDS.has(stemmed) || /^\d+([.,]\d+)?$/.test(stemmed) || stemmed.length < 2;
}

// --- misc helpers used by the engine ---

export const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/;
export const PHONE_RE = /(\+?\d[\d\s()-]{8,}\d)/;
export const LINK_RE = /(t\.me\/|@[a-z0-9_]{4,}|linkedin\.com|github\.com|https?:\/\/)/i;

export const METRIC_RE =
  /(\d+([.,]\d+)?\s*(%|процент|п\.\s?п\.|pp\b|₽|руб|\$|€|млн|млрд|тыс|k\b|m\b|mln|bn|x\b|×|раз)|[+−-]\s?\d+([.,]\d+)?\s*%|[$€₽]\s?\d|\d+\+?\s*(клиент|пользоват|сотрудник|человек|стартап|проект|магазин|бренд|client|customer|user|people|startup|project|brand))/i;

export const YEARS_RE = /(\d{1,2})\s*\+?\s*(лет|года|год|years?|yrs)/i;

const MONTH = '(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-zа-я.]*';
export const YEAR_RE = /(19[6-9]\d|20[0-4]\d)/g;
export const PRESENT_RE = /(по\s+)?(настоящее\s+время|н\.\s?в\.|сейчас|наст\.?\s*вр|present|now|current|today)/i;
export const MONTH_RE = new RegExp(MONTH, 'i');

/** "09.2019 – 04.2026", "Сентябрь 2019 — по настоящее время", "2015-2018" */
export function isDateRangeLine(line: string): boolean {
  if (line.length > 140) return false;
  const years = line.match(YEAR_RE) ?? [];
  return years.length >= 2 || (years.length === 1 && PRESENT_RE.test(line));
}

export const BULLET_RE = /^\s*([-–—•*·▪▫◦►▶✓✔→>]|\d{1,2}[.)])\s+/;

// emoji, pictographs and decorative glyphs that confuse ATS parsers
export const FANCY_RE = /[\p{Extended_Pictographic}☀-➿⬀-⯿-│┃║■□●○◆◇★☆]/gu;

export function cleanLine(line: string): string {
  return line
    .replace(BULLET_RE, '')
    .replace(FANCY_RE, '')
    .replace(/\t+/g, ' ')
    .replace(/\s*\|\s*/g, ' · ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function capitalize(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export function wordCount(text: string): number {
  return (text.match(/[\p{L}\p{N}]+/gu) ?? []).length;
}

export function plural(n: number, lang: TextLang, ru: [string, string, string], en: [string, string]): string {
  if (lang === 'en') return n === 1 ? en[0] : en[1];
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return ru[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return ru[1];
  return ru[2];
}
