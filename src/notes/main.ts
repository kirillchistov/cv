import '../editorial/editorial.css';
import './notes.css';
import { initTheme } from '../theme';
import { renderTopbar } from '../topbar';
import { renderMarkdown, type Doc } from '../editorial/markdown';

// Every content/hindsight/*.md becomes a note; order comes from front matter.
const files = import.meta.glob('/content/hindsight/*.md', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

const notes: Doc[] = Object.values(files)
  .map(renderMarkdown)
  .sort((a, b) => Number(a.meta.order) - Number(b.meta.order));

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function current(): Doc {
  const slug = location.hash.slice(1);
  return notes.find((n) => n.meta.slug === slug) ?? notes[0];
}

function renderToc(active: Doc): void {
  const toc = document.getElementById('notesToc');
  if (!toc) return;
  toc.innerHTML = `<ol>${notes
    .map(
      (n, i) => `
      <li>
        <a href="#${n.meta.slug}" class="${n === active ? 'is-active' : ''}"${n === active ? ' aria-current="true"' : ''}>
          <span class="toc-num ed-mono">${String(i + 1).padStart(2, '0')} · ${esc(n.meta.period)}</span>
          <span class="toc-title">${esc(n.meta.title)}</span>
        </a>
      </li>`
    )
    .join('')}</ol>`;
}

function renderNote(note: Doc): void {
  const el = document.getElementById('note');
  if (!el) return;
  const i = notes.indexOf(note);
  const prev = notes[i - 1];
  const next = notes[i + 1];
  el.innerHTML = `
    <header class="note-head">
      <p class="ed-kicker">${esc(note.meta.period)} · ${esc(note.meta.company)}
        ${note.meta.status === 'draft' ? '<span class="ed-badge">черновик</span>' : ''}</p>
      <h2 class="note-title">${esc(note.meta.title)}</h2>
      <p class="note-lead">${esc(note.meta.lead)}</p>
      <p class="note-role ed-mono">${esc(note.meta.role)}</p>
    </header>
    <div class="note-body">${note.html}</div>
    <footer class="note-foot">
      ${note.meta.case ? `<a class="ed-arrow-link" href="./cases.html#${note.meta.case}">Кейс в картинках →</a>` : ''}
      <span class="note-nav">
        ${prev ? `<a class="ed-arrow-link" href="#${prev.meta.slug}">← ${esc(prev.meta.period)}</a>` : ''}
        ${next ? `<a class="ed-arrow-link" href="#${next.meta.slug}">${esc(next.meta.period)} →</a>` : ''}
      </span>
    </footer>`;
  document.title = `${note.meta.title} · Кирилл Чистов`;
}

function show(scroll: boolean): void {
  const note = current();
  renderToc(note);
  renderNote(note);
  if (scroll) document.getElementById('note')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

renderTopbar(['theme', 'roadmap', 'tailor', 'cv']);
initTheme();
show(false);
window.addEventListener('hashchange', () => show(true));
