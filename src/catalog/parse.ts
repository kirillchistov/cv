export interface CaseBlock {
  title: string;
  body: string;
}

export interface CatalogCase {
  id: number;
  title: string;
  category: string;
  type: string;
  profile: string;
  period: string;
  kpi: string;
  strategy: string;
  sections: CaseBlock[];
}

interface SummaryRow {
  category: string;
  kpi: string;
  strategy: string;
}

// Table labels and the headings in the case body use different names for the same types.
const SAME_TYPE: Record<string, string> = {
  'mobile app': 'мобильное приложение',
  'b2b services': 'professional services',
};

function norm(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[·,./]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function caseType(category: string): string {
  const parts = category.split('·');
  return (parts.at(-1) ?? category).trim();
}

function categoriesAlign(tableCategory: string, sectionCategory: string): boolean {
  const table = norm(tableCategory);
  const section = norm(caseType(sectionCategory));
  if (table === section) return true;
  return SAME_TYPE[table] === section || SAME_TYPE[section] === table;
}

function plain(text: string): string {
  return text.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

function sentencesOf(text: string): string[] {
  const masked = text
    .replace(/п\. ?п\./gi, 'п\u0000п\u0000')
    .replace(/p\. ?p\./gi, 'p\u0000p\u0000')
    .replace(/(мес|тыс|млн|руб|стр)\./gi, (token) => token.replace('.', '\u0000'));
  return masked.split(/(?<=[.!])\s+/).map((part) => part.replace(/\u0000/g, '.'));
}

function firstSentence(text: string): string {
  return sentencesOf(plain(text))[0] ?? plain(text);
}

function aroundMetric(text: string, max: number): string {
  const marker = text.search(/%|→|->|п\. ?п|x\d|×/i);
  if (marker < 0 || text.length <= max) return text;
  const start = Math.max(0, marker - Math.floor(max * 0.65));
  let slice = text.slice(start, start + max).trim();
  if (start > 0) slice = slice.replace(/^\S*\s+/, '');
  if (start + max < text.length) slice = slice.replace(/\s+\S*$/, '');
  return slice.trim();
}

function kpiFromResult(body: string): string {
  const parts = sentencesOf(plain(body)).filter(Boolean);
  const chosen =
    parts.find((sentence) => /\d/.test(sentence) && /%|п\. ?п|→|->|x\d|×/i.test(sentence)) ??
    parts.find((sentence) => /\d/.test(sentence)) ??
    parts[0] ??
    '';
  return chosen.length > 120 ? aroundMetric(chosen, 120) : chosen;
}

function parseSummary(markdown: string): Map<number, SummaryRow> {
  const rows = new Map<number, SummaryRow>();
  for (const line of markdown.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 5) continue;
    const id = Number(cells[0]);
    if (!Number.isInteger(id) || id <= 0) continue;
    rows.set(id, { category: cells[1], kpi: cells[3], strategy: cells[4] });
  }
  return rows;
}

function field(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`\\*\\*${name}\\s*:\\*\\*\\s*(.+)`, 'i'));
    if (match) return match[1].trim();
  }
  return '';
}

function parseSections(block: string): CaseBlock[] {
  const sections: CaseBlock[] = [];
  const re = /(?:^|\n)\d+\)\s+\*\*([^*]+)\*\*\.?\s*([\s\S]*?)(?=\n\d+\)\s+\*\*|$)/g;
  for (const match of block.matchAll(re)) {
    const title = match[1].replace(/\.+$/, '').trim();
    const body = match[2].replace(/^\.\s*/, '').trim();
    if (title && body) sections.push({ title, body });
  }
  return sections;
}

export function parseCases(markdown: string): CatalogCase[] {
  const summary = parseSummary(markdown);
  const casesPart = markdown.split(/^## (?:Кейсы|Cases|Casos|Cas)\s*$/m)[1] ?? '';
  const cases: CatalogCase[] = [];

  for (const chunk of casesPart.split(/^### /m).slice(1)) {
    const header = chunk.match(/^(\d+)\.\s+([^\n]+)/);
    if (!header) continue;
    const id = Number(header[1]);
    const rest = chunk.slice(header[0].length);
    const category = field(rest, ['Категория', 'Category', 'Catégorie', 'Categoría']);
    const sections = parseSections(rest);
    const result = sections.find((section) => /решени|solution|résultat|resultado/i.test(section.title));
    const problem = sections.find((section) => /проблема|problem|problème|problema/i.test(section.title));
    const row = summary.get(id);
    const useTable = Boolean(row && categoriesAlign(row.category, category));

    cases.push({
      id,
      title: header[2].trim(),
      category,
      type: caseType(category),
      profile: field(rest, ['Профиль', 'Profile', 'Profil', 'Perfil']),
      period: field(rest, ['Период', 'Period', 'Période', 'Periodo']),
      kpi: useTable && row ? row.kpi : result ? kpiFromResult(result.body) : '',
      strategy: useTable && row ? row.strategy : problem ? clip(firstSentence(problem.body), 160) : '',
      sections,
    });
  }

  return cases;
}
