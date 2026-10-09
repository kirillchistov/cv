import { sectionTitle, type TailoredResume } from './engine';

// Optional appendix (recommendations, checklists) rendered by the UI in its language.
export interface Report {
  title: string;
  groups: { title: string; items: string[] }[];
}

function sections(r: TailoredResume): { title: string; lines: string[]; bullets?: boolean }[] {
  const out: { title: string; lines: string[]; bullets?: boolean }[] = [];
  if (r.summary) out.push({ title: sectionTitle('summary', r.lang), lines: [r.summary] });
  if (r.achievements.length) out.push({ title: sectionTitle('achievements', r.lang), lines: r.achievements, bullets: true });
  if (r.skills.length) out.push({ title: sectionTitle('skills', r.lang), lines: [r.skills.join(', ')] });
  return out;
}

export function toText(r: TailoredResume, report?: Report): string {
  const out: string[] = [r.name.toUpperCase(), r.headline, r.contacts.join(' | '), ''];
  for (const s of sections(r)) {
    out.push(s.title.toUpperCase(), ...s.lines.map((l) => (s.bullets ? `- ${l}` : l)), '');
  }
  if (r.experience.length) {
    out.push(sectionTitle('experience', r.lang).toUpperCase());
    for (const job of r.experience) out.push(...job.header, ...job.bullets.map((b) => `- ${b}`), '');
  }
  for (const s of r.sections) out.push(s.title.toUpperCase(), ...s.lines, '');
  if (report) {
    out.push('='.repeat(40), report.title.toUpperCase(), '');
    for (const g of report.groups) out.push(g.title, ...g.items.map((i) => `- ${i}`), '');
  }
  return out.filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n').trim() + '\n';
}

const mdEscape = (s: string) => s.replace(/([*_`#[\]])/g, '\\$1');

export function toMarkdown(r: TailoredResume, report?: Report): string {
  const out: string[] = [`# ${mdEscape(r.name)}`, '', `**${mdEscape(r.headline)}**`, '', r.contacts.map(mdEscape).join(' · '), ''];
  for (const s of sections(r)) {
    out.push(`## ${s.title}`, '', ...s.lines.map((l) => (s.bullets ? `- ${mdEscape(l)}` : mdEscape(l))), '');
  }
  if (r.experience.length) {
    out.push(`## ${sectionTitle('experience', r.lang)}`, '');
    for (const job of r.experience) {
      const [first, ...rest] = job.header;
      if (first) out.push(`### ${mdEscape(first)}`);
      if (rest.length) out.push('', `*${rest.map(mdEscape).join(' · ')}*`);
      out.push('', ...job.bullets.map((b) => `- ${mdEscape(b)}`), '');
    }
  }
  for (const s of r.sections) out.push(`## ${s.title}`, '', ...s.lines.map((l) => `${mdEscape(l)}  `), '');
  if (report) {
    out.push('---', '', `## ${report.title}`, '');
    for (const g of report.groups) out.push(`### ${g.title}`, '', ...g.items.map((i) => `- ${mdEscape(i)}`), '');
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

// docx is ~300 KB, so it is loaded only when someone actually downloads a .docx
export async function toDocx(r: TailoredResume, report?: Report): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } = await import('docx');

  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 280, after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'BBBBBB', space: 2 } },
    });
  const para = (text: string, opts: { bold?: boolean; italics?: boolean; size?: number } = {}) =>
    new Paragraph({ children: [new TextRun({ text, ...opts })], spacing: { after: 80 } });
  const bullet = (text: string) => new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } });

  const children: InstanceType<typeof Paragraph>[] = [
    new Paragraph({ children: [new TextRun({ text: r.name, bold: true, size: 36 })], spacing: { after: 60 } }),
    para(r.headline, { bold: true, size: 24 }),
    para(r.contacts.join(' | '), { size: 20 }),
  ];
  for (const s of sections(r)) {
    children.push(heading(s.title), ...s.lines.map((l) => (s.bullets ? bullet(l) : para(l))));
  }
  if (r.experience.length) {
    children.push(heading(sectionTitle('experience', r.lang)));
    for (const job of r.experience) {
      const [first, ...rest] = job.header;
      if (first) children.push(new Paragraph({ children: [new TextRun({ text: first, bold: true })], spacing: { before: 160, after: 40 } }));
      if (rest.length) children.push(para(rest.join(' · '), { italics: true }));
      children.push(...job.bullets.map(bullet));
    }
  }
  for (const s of r.sections) children.push(heading(s.title), ...s.lines.map((l) => para(l)));

  if (report) {
    children.push(new Paragraph({ text: report.title, heading: HeadingLevel.HEADING_1, pageBreakBefore: true }));
    for (const g of report.groups) children.push(heading(g.title), ...g.items.map(bullet));
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
    sections: [{ properties: { page: { margin: { top: 1000, bottom: 1000, left: 1100, right: 1100 } } }, children }],
  });
  return Packer.toBlob(doc);
}
