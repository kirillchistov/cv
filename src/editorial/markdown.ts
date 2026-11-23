// Minimal Markdown for the notes: front matter, ## / ### headings, paragraphs,
// "-" lists, "> " quotes, **bold**, *italic*, `code`, [links](url).
// Content is ours (content/*.md), but HTML is still escaped first.

export interface Doc {
  meta: Record<string, string>;
  html: string;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function inline(text: string): string {
  return esc(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) =>
      /^(https?:|\.\/|#|\/)/.test(href) ? `<a class="ed-link" href="${href}">${label}</a>` : label
    );
}

export function parseFrontMatter(source: string): { meta: Record<string, string>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { meta: {}, body: source };
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: source.slice(match[0].length) };
}

export function renderMarkdown(source: string): Doc {
  const { meta, body } = parseFrontMatter(source.replace(/\r/g, ''));
  const out: string[] = [];
  const blocks = body.split(/\n{2,}/);
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith('### ')) out.push(`<h3>${inline(block.slice(4))}</h3>`);
    else if (block.startsWith('## ')) out.push(`<h2>${inline(block.slice(3))}</h2>`);
    else if (/^- /.test(block)) {
      const items = block.split(/\n(?=- )/).map((li) => `<li>${inline(li.replace(/^- /, '').replace(/\n/g, ' '))}</li>`);
      out.push(`<ul>${items.join('')}</ul>`);
    } else if (block.startsWith('> ')) {
      out.push(`<blockquote>${inline(block.replace(/^> ?/gm, '').replace(/\n/g, ' '))}</blockquote>`);
    } else out.push(`<p>${inline(block.replace(/\n/g, ' '))}</p>`);
  }
  return { meta, html: out.join('\n') };
}
