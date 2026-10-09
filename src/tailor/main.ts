import './tailor.css';
import { i18n, getText } from '../i18n';
import { initLanguage, storedLang } from '../language';
import { initTheme } from '../theme';
import { renderTopbar } from '../topbar';
import type { Lang } from '../types';
import { analyze, keywordRanges, sectionTitle, type Analysis, type Check, type Keyword } from './engine';
import { toDocx, toMarkdown, toText, type Report } from './export';
import { tailorTexts } from './i18n';
import { sampleVacancy, siteResume } from './samples';
import { wordCount } from './text';

Object.assign(i18n, tailorTexts);

const CAREER_OS_URL = 'https://carrer-os-three.vercel.app/try';
const DRAFT_KEY = 'kch-tailor-draft';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const vacancyEl = $<HTMLTextAreaElement>('vacancy');
const resumeEl = $<HTMLTextAreaElement>('resume');
const resultsEl = $('results');

let last: Analysis | null = null;
let view: 'preview' | 'plain' = 'preview';

const lang = (): Lang => (document.documentElement.getAttribute('data-lang') as Lang | null) ?? storedLang();

function t(key: string, params: Record<string, string | number> = {}): string {
  return getText(key, lang()).replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? ''));
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Escape `text` and wrap keyword matches in <mark>. */
function highlight(text: string, keywords: Keyword[]): string {
  const ranges = keywordRanges(text, keywords);
  let html = '';
  let pos = 0;
  for (const [start, end] of ranges) {
    html += esc(text.slice(pos, start)) + `<mark>${esc(text.slice(start, end))}</mark>`;
    pos = end;
  }
  return html + esc(text.slice(pos));
}

// ---------- draft ----------

function saveDraft(): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ vacancy: vacancyEl.value, resume: resumeEl.value }));
  } catch {
    /* private mode — draft just isn't kept */
  }
}

function loadDraft(): void {
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    vacancyEl.value = draft.vacancy ?? '';
    resumeEl.value = draft.resume ?? '';
  } catch {
    /* ignore */
  }
}

function updateCounts(): void {
  $('vacancyCount').textContent = vacancyEl.value.trim() ? t('tlWords', { n: wordCount(vacancyEl.value) }) : '';
  $('resumeCount').textContent = resumeEl.value.trim() ? t('tlWords', { n: wordCount(resumeEl.value) }) : '';
}

// ---------- rendering ----------

const STATUS_ICON: Record<Check['status'], string> = { pass: '✓', warn: '!', fail: '✕' };

function statusDot(status: Check['status']): string {
  return `<span class="tl-status tl-status-${status}" aria-label="${status}">${STATUS_ICON[status]}</span>`;
}

const passed = (checks: Check[]) => checks.filter((c) => c.status === 'pass').length;

function ring(pct: number): string {
  const tone = pct >= 70 ? 'good' : pct >= 45 ? 'mid' : 'low';
  return `<div class="tl-ring tl-ring-${tone}" style="--pct:${pct}"><span>${pct}%</span></div>`;
}

function renderScores(a: Analysis): string {
  const atsPass = passed(a.ats);
  return `
  <section class="card tl-scores" aria-label="Scores">
    <div class="tl-score">${ring(a.coverage)}<div><p class="tl-score-label">${t('tlScoreCoverage')}</p></div></div>
    <div class="tl-score">${ring(a.mustCoverage)}<div><p class="tl-score-label">${t('tlScoreMust')}</p></div></div>
    <div class="tl-score">
      <div class="tl-score-num">${atsPass}<small>/${a.ats.length}</small></div>
      <div><p class="tl-score-label">${t('tlScoreAts')}</p></div>
    </div>
    <div class="tl-score">
      <div class="tl-score-num">${passed(a.fiveSec.after)}<small>/${a.fiveSec.after.length}</small></div>
      <div>
        <p class="tl-score-label">${t('tlScoreFive')}</p>
        <p class="tl-score-meta">${t('tlBeforeAfter', { a: passed(a.fiveSec.before), b: passed(a.fiveSec.after) })}</p>
      </div>
    </div>
    <p class="tl-disclaimer">${t('tlDisclaimer')}</p>
  </section>`;
}

function renderKeywords(a: Analysis): string {
  const groups = (['must', 'core', 'nice'] as const)
    .map((imp) => ({ imp, list: a.keywords.filter((k) => k.importance === imp) }))
    .filter((g) => g.list.length);
  const label = { must: 'tlMust', core: 'tlCore', nice: 'tlNice' } as const;
  return `
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">${t('tlKeywordsTitle')}</h2>
      <p class="card-subtitle">${t('tlKeywordsSub')}</p>
    </div>
    <div class="tl-legend">
      <span><i class="tl-kw-dot tl-kw-full"></i>${t('tlFull')}</span>
      <span><i class="tl-kw-dot tl-kw-partial"></i>${t('tlPartial')}</span>
      <span><i class="tl-kw-dot tl-kw-missing"></i>${t('tlMissing')}</span>
    </div>
    ${groups
      .map(
        (g) => `
      <div class="tl-kw-group">
        <span class="tl-kw-group-label">${t(label[g.imp])}</span>
        <div class="tl-kws">
          ${g.list.map((k) => `<span class="tl-kw tl-kw-${k.coverage}" title="${t(k.coverage === 'full' ? 'tlFull' : k.coverage === 'partial' ? 'tlPartial' : 'tlMissing')}">${esc(k.label)}</span>`).join('')}
        </div>
      </div>`
      )
      .join('')}
  </section>`;
}

function renderFiveSec(a: Analysis): string {
  const matched = a.keywords.filter((k) => k.coverage === 'full');
  const [name, headline, contacts, ...rest] = a.topBlock;
  const rows = a.fiveSec.after
    .map((after, i) => {
      const before = a.fiveSec.before[i];
      const extra = after.id === 'keywords' ? ` <span class="tl-muted">(${after.params?.n}/${after.params?.total})</span>` : '';
      return `<tr><td>${t(`tlFive_${after.id}`)}${extra}</td><td>${statusDot(before.status)}</td><td>${statusDot(after.status)}</td></tr>`;
    })
    .join('');
  return `
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">${t('tlFiveTitle')}</h2>
      <p class="card-subtitle">${t('tlFiveSub')}</p>
    </div>
    <div class="tl-five">
      <div class="tl-five-view" aria-label="Top of the tailored resume">
        <p class="tl-five-name">${esc(name ?? '')}</p>
        <p class="tl-five-headline">${highlight(headline ?? '', matched)}</p>
        <p class="tl-five-contacts">${esc(contacts ?? '')}</p>
        ${rest.map((line, i) => `<p class="${i === 0 ? 'tl-five-summary' : 'tl-five-ach'}">${highlight(line, matched)}</p>`).join('')}
      </div>
      <table class="tl-table">
        <thead><tr><th></th><th>${t('tlBefore')}</th><th>${t('tlAfter')}</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </section>`;
}

function atsFix(c: Check): string {
  return t(`tlAtsFix_${c.id}`, c.params ?? {});
}

function renderAts(a: Analysis): string {
  return `
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">${t('tlAtsTitle')}</h2>
      <p class="card-subtitle">${t('tlAtsSub')}</p>
    </div>
    <ul class="tl-checks">
      ${a.ats
        .map(
          (c) => `
        <li class="tl-check">
          ${statusDot(c.status)}
          <div>
            <p class="tl-check-label">${t(`tlAts_${c.id}`)}
              ${c.status !== 'pass' && c.fixed ? `<span class="tl-fixed">${t('tlFixed')}</span>` : ''}</p>
            ${c.status !== 'pass' ? `<p class="tl-check-fix">${esc(atsFix(c))}</p>` : ''}
          </div>
        </li>`
        )
        .join('')}
    </ul>
  </section>`;
}

function renderPreview(a: Analysis): string {
  const r = a.tailored;
  const matched = a.keywords.filter((k) => k.coverage === 'full');
  const h = (s: string) => highlight(s, matched);
  const block = (title: string, body: string) => `<h3 class="tl-doc-h">${esc(title)}</h3>${body}`;
  // section titles follow the resume's language, not the UI language
  const titles = Object.fromEntries(
    ['summary', 'achievements', 'skills', 'experience'].map((k) => [k, sectionTitle(k, r.lang)])
  );
  return `
    <article class="tl-doc">
      <p class="tl-doc-name">${esc(r.name)}</p>
      <p class="tl-doc-headline">${h(r.headline)}</p>
      <p class="tl-doc-contacts">${esc(r.contacts.join(' · '))}</p>
      ${r.summary ? block(titles.summary, `<p>${h(r.summary)}</p>`) : ''}
      ${r.achievements.length ? block(titles.achievements, `<ul>${r.achievements.map((x) => `<li>${h(x)}</li>`).join('')}</ul>`) : ''}
      ${r.skills.length ? block(titles.skills, `<p class="tl-doc-skills">${r.skills.map((s) => `<span>${h(s)}</span>`).join('')}</p>`) : ''}
      ${
        r.experience.length
          ? block(
              titles.experience,
              r.experience
                .map(
                  (j) => `
          <div class="tl-doc-job">
            ${j.header.map((line, i) => `<p class="${i === 0 ? 'tl-doc-job-title' : 'tl-doc-job-meta'}">${esc(line)}</p>`).join('')}
            <ul>${j.bullets.map((b) => `<li>${h(b)}</li>`).join('')}</ul>
          </div>`
                )
                .join('')
            )
          : ''
      }
      ${r.sections.map((s) => block(s.title, s.lines.map((l) => `<p>${esc(l)}</p>`).join(''))).join('')}
    </article>`;
}

function buildReport(a: Analysis): Report {
  const groups = recommendationGroups(a).map((g) => ({ title: g.title, items: g.items }));
  groups.push({
    title: t('tlAtsTitle'),
    items: a.ats.map((c) => `${STATUS_ICON[c.status]} ${t(`tlAts_${c.id}`)}${c.status !== 'pass' ? `: ${atsFix(c)}` : ''}`),
  });
  groups.push({
    title: t('tlFiveTitle'),
    items: a.fiveSec.after.map((c) => `${STATUS_ICON[c.status]} ${t(`tlFive_${c.id}`)}`),
  });
  groups.push({ title: t('tlChangesTitle'), items: changeItems(a) });
  return { title: t('tlReportTitle'), groups };
}

function renderResult(a: Analysis): string {
  return `
  <section class="card" id="resultCard">
    <div class="card-header tl-result-head">
      <div>
        <h2 class="card-title">${t('tlResultTitle')}</h2>
        <p class="card-subtitle">${t('tlResultSub')}</p>
      </div>
      <div class="tl-tabs" role="tablist">
        <button type="button" role="tab" class="tl-tab${view === 'preview' ? ' is-active' : ''}" data-view="preview" aria-selected="${view === 'preview'}">${t('tlPreview')}</button>
        <button type="button" role="tab" class="tl-tab${view === 'plain' ? ' is-active' : ''}" data-view="plain" aria-selected="${view === 'plain'}">${t('tlPlain')}</button>
      </div>
    </div>
    <div class="tl-result-body">
      ${view === 'preview' ? renderPreview(a) : `<pre class="tl-plain">${esc(toText(a.tailored))}</pre>`}
    </div>
    <div class="tl-downloads">
      <span class="tl-muted">${t('tlDownload')}:</span>
      <button type="button" class="btn-secondary" data-download="txt">.txt</button>
      <button type="button" class="btn-secondary" data-download="md">.md</button>
      <button type="button" class="btn-primary" data-download="docx">.docx</button>
      <button type="button" class="btn-secondary" id="copyBtn">${t('tlCopy')}</button>
      <label class="tl-report-toggle">
        <input type="checkbox" id="withReport" /> <span>${t('tlWithReport')}</span>
      </label>
    </div>
  </section>`;
}

function recommendationGroups(a: Analysis): { title: string; items: string[] }[] {
  const missing = a.keywords.filter((k) => k.coverage === 'missing');
  const relevant = missing.filter((k) => k.importance !== 'nice');
  const groups = [
    {
      title: t('tlRecAdd'),
      items: relevant.filter((k) => k.cat === 'hard' || k.cat === 'domain' || k.cat === 'other').map((k) => t('tlRecAddItem', { kw: k.label })),
    },
    {
      title: t('tlRecWording'),
      items: a.keywords.filter((k) => k.coverage === 'partial').map((k) => t('tlRecWordingItem', { kw: k.label })),
    },
    {
      title: t('tlRecNumbers'),
      items: a.quantify.map((b) => `${b} → ${t('tlRecNumbersHint')}`),
    },
    {
      title: t('tlRecLearn'),
      items: relevant.filter((k) => k.cat === 'tool').map((k) => t('tlRecLearnItem', { kw: k.label })),
    },
    {
      title: t('tlRecSoft'),
      items: relevant.filter((k) => k.cat === 'soft').map((k) => t('tlRecSoftItem', { kw: k.label })),
    },
    {
      title: t('tlRecNice'),
      items: missing.filter((k) => k.importance === 'nice').map((k) => k.label),
    },
  ];
  return groups.filter((g) => g.items.length);
}

function renderRecs(a: Analysis): string {
  const groups = recommendationGroups(a);
  return `
  <section class="card">
    <div class="card-header">
      <h2 class="card-title">${t('tlRecsTitle')}</h2>
      <p class="card-subtitle">${t('tlRecsSub')}</p>
    </div>
    ${
      groups.length
        ? `<div class="tl-recs">${groups
            .map(
              (g) => `
          <div class="tl-rec">
            <h3 class="tl-rec-title">${esc(g.title)}</h3>
            <ul class="tl-rec-list">${g.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
          </div>`
            )
            .join('')}</div>`
        : `<p class="tl-muted">${t('tlRecNone')}</p>`
    }
  </section>`;
}

function changeItems(a: Analysis): string[] {
  return a.changes.map((c) => t(`tlChange_${c.code}`, { n: c.n ?? '', from: c.from || '—', to: c.to ?? '' }));
}

function renderChanges(a: Analysis): string {
  return `
  <section class="card tl-split">
    <div>
      <h2 class="card-title">${t('tlChangesTitle')}</h2>
      <ul class="tl-rec-list tl-changes">${changeItems(a).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>
    <aside class="tl-cos">
      <h3 class="tl-rec-title">${t('tlCosTitle')}</h3>
      <p>${t('tlCosText')}</p>
      <a class="btn-secondary" href="${CAREER_OS_URL}" target="_blank" rel="noopener">${t('tlCosCta')} ↗</a>
    </aside>
  </section>`;
}

function render(): void {
  if (!last) return;
  resultsEl.hidden = false;
  resultsEl.innerHTML = [
    renderScores(last),
    renderResult(last),
    renderRecs(last),
    renderKeywords(last),
    renderFiveSec(last),
    renderAts(last),
    renderChanges(last),
  ].join('');
}

// ---------- actions ----------

function run(): void {
  const vacancy = vacancyEl.value.trim();
  const resume = resumeEl.value.trim();
  $('vacancyError').textContent = wordCount(vacancy) < 15 ? t('tlNeedVacancy') : '';
  $('resumeError').textContent = wordCount(resume) < 15 ? t('tlNeedResume') : '';
  if (wordCount(vacancy) < 15 || wordCount(resume) < 15) return;

  const analysis = analyze(resume, vacancy);
  if (!analysis.keywords.length) {
    $('vacancyError').textContent = t('tlNoKeywords');
    return;
  }
  last = analysis;
  render();
  resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fileBase(): string {
  const title = last?.vacancyTitle || 'resume';
  const slug = title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 40);
  return `resume-${slug || 'tailored'}`;
}

function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function download(kind: string): Promise<void> {
  if (!last) return;
  const withReport = ($('withReport') as HTMLInputElement | null)?.checked;
  const report = withReport ? buildReport(last) : undefined;
  if (kind === 'txt') saveBlob(new Blob([toText(last.tailored, report)], { type: 'text/plain;charset=utf-8' }), `${fileBase()}.txt`);
  if (kind === 'md') saveBlob(new Blob([toMarkdown(last.tailored, report)], { type: 'text/markdown;charset=utf-8' }), `${fileBase()}.md`);
  if (kind === 'docx') saveBlob(await toDocx(last.tailored, report), `${fileBase()}.docx`);
}

function bind(): void {
  $('tailorForm').addEventListener('submit', (e) => {
    e.preventDefault();
    run();
  });

  for (const el of [vacancyEl, resumeEl]) {
    el.addEventListener('input', () => {
      updateCounts();
      saveDraft();
    });
  }

  $('sampleVacancyBtn').addEventListener('click', () => {
    vacancyEl.value = sampleVacancy[lang() === 'ru' ? 'ru' : 'en'];
    vacancyEl.dispatchEvent(new Event('input'));
  });
  $('siteResumeBtn').addEventListener('click', () => {
    resumeEl.value = siteResume(lang());
    resumeEl.dispatchEvent(new Event('input'));
  });
  document.querySelectorAll<HTMLButtonElement>('[data-clear]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const el = $<HTMLTextAreaElement>(btn.dataset.clear!);
      el.value = '';
      el.dispatchEvent(new Event('input'));
      el.focus();
    })
  );

  resultsEl.addEventListener('click', async (e) => {
    const target = e.target as HTMLElement;
    const tab = target.closest<HTMLElement>('[data-view]');
    if (tab) {
      view = tab.dataset.view as typeof view;
      render();
      return;
    }
    const dl = target.closest<HTMLElement>('[data-download]');
    if (dl) {
      await download(dl.dataset.download!);
      return;
    }
    if (target.closest('#copyBtn') && last) {
      const btn = target.closest<HTMLButtonElement>('#copyBtn')!;
      try {
        await navigator.clipboard.writeText(toText(last.tailored));
        btn.textContent = t('tlCopied');
        setTimeout(() => (btn.textContent = t('tlCopy')), 1500);
      } catch {
        view = 'plain';
        render();
      }
    }
  });

  // UI strings of the results depend on the interface language
  document.addEventListener('langchange', () => {
    updateCounts();
    render();
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

renderTopbar(['theme', 'lang', 'roadmap', 'tailor', 'cv'], 'tailor');
initTheme();
loadDraft();
bind();
initLanguage();
updateCounts();
