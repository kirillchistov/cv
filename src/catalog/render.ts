import ruSource from '../../docs/all-cases.md?raw';
import enSource from '../../docs/all-cases.en.md?raw';
import frSource from '../../docs/all-cases.fr.md?raw';
import esSource from '../../docs/all-cases.es.md?raw';
import { getText } from '../i18n';
import { storedLang } from '../language';
import type { Lang } from '../types';
import { parseCases, type CatalogCase } from './parse';

const ru = parseCases(ruSource);

function sameCatalog(items: CatalogCase[]): CatalogCase[] {
  if (items.length !== ru.length) return ru;
  const byId = new Map(items.map((item) => [item.id, item]));
  if (ru.some((item) => !byId.has(item.id))) return ru;
  return ru.map((item) => byId.get(item.id)!);
}

const catalogs: Record<Lang, CatalogCase[]> = {
  ru,
  en: sameCatalog(parseCases(enSource)),
  fr: sameCatalog(parseCases(frSource)),
  es: sameCatalog(parseCases(esSource)),
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
}

function rich(text: string): string {
  return escapeHtml(text.replace(/\s*\n\s*/g, ' ').trim()).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function renderCatalog(): void {
  const root = document.getElementById('caseCatalog');
  if (!root || ru.length === 0) return;

  const filters = document.createElement('div');
  filters.className = 'case-filters';
  filters.setAttribute('role', 'toolbar');

  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'case-filter is-active';
  all.dataset.caseFilter = '';
  all.dataset.i18n = 'casesAll';
  all.textContent = getText('casesAll', storedLang());
  all.setAttribute('aria-pressed', 'true');
  filters.append(all);

  const types = [...new Set(ru.map((item) => item.type).filter(Boolean))];
  for (const type of types) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'case-filter';
    button.dataset.caseFilter = type;
    button.textContent = type;
    button.setAttribute('aria-pressed', 'false');
    filters.append(button);
  }

  const wrap = document.createElement('div');
  wrap.className = 'case-carousel-wrap';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'icon-btn case-nav';
  prev.dataset.casePrev = '';
  prev.dataset.i18nTitle = 'casesPrev';
  prev.innerHTML = '<span aria-hidden="true">‹</span>';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'icon-btn case-nav';
  next.dataset.caseNext = '';
  next.dataset.i18nTitle = 'casesNext';
  next.innerHTML = '<span aria-hidden="true">›</span>';

  const carousel = document.createElement('div');
  carousel.className = 'case-carousel';
  carousel.tabIndex = 0;
  carousel.dataset.i18nTitle = 'casesCarousel';

  for (const item of ru) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'case-card';
    card.dataset.caseType = item.type;
    card.dataset.caseId = String(item.id);

    const kicker = document.createElement('span');
    kicker.className = 'case-card-kicker';
    const num = document.createElement('span');
    num.className = 'case-card-num';
    num.textContent = String(item.id);
    const type = document.createElement('span');
    type.className = 'case-card-type';
    kicker.append(num, type);

    const title = document.createElement('span');
    title.className = 'case-card-title';
    const kpi = document.createElement('span');
    kpi.className = 'case-card-kpi';
    const strategy = document.createElement('span');
    strategy.className = 'case-card-strategy';

    card.append(kicker, title, kpi, strategy);
    carousel.append(card);
  }

  wrap.append(prev, carousel, next);

  const dialog = document.createElement('dialog');
  dialog.className = 'case-dialog';
  dialog.innerHTML = `
    <div class="case-dialog-head">
      <div>
        <p class="case-dialog-meta" data-case-meta></p>
        <h2 class="case-dialog-title" data-case-title></h2>
      </div>
      <button type="button" class="icon-btn" data-case-close data-i18n-title="casesClose">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <p class="case-dialog-profile" data-case-profile></p>
    <div class="case-dialog-body" data-case-body></div>
  `;

  root.append(filters, wrap, dialog);

  const metaEl = dialog.querySelector<HTMLElement>('[data-case-meta]')!;
  const titleEl = dialog.querySelector<HTMLElement>('[data-case-title]')!;
  const profileEl = dialog.querySelector<HTMLElement>('[data-case-profile]')!;
  const bodyEl = dialog.querySelector<HTMLElement>('[data-case-body]')!;
  let opener: HTMLElement | null = null;
  let openId: number | null = null;

  const scrollByCard = (direction: number) => {
    const card = carousel.querySelector<HTMLElement>('.case-card:not(.is-filtered-out)');
    const gap = 12;
    const width = card ? card.getBoundingClientRect().width + gap : 300;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    carousel.scrollBy({ left: direction * width, behavior: reduce ? 'auto' : 'smooth' });
  };

  const updateNav = () => {
    const max = carousel.scrollWidth - carousel.clientWidth;
    prev.disabled = carousel.scrollLeft <= 2;
    next.disabled = max <= 2 || carousel.scrollLeft >= max - 2;
  };

  const applyFilter = (type: string) => {
    filters.querySelectorAll<HTMLButtonElement>('.case-filter').forEach((button) => {
      const active = (button.dataset.caseFilter ?? '') === type;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    carousel.querySelectorAll<HTMLElement>('.case-card').forEach((card) => {
      card.classList.toggle('is-filtered-out', Boolean(type) && card.dataset.caseType !== type);
    });
    carousel.scrollLeft = 0;
    updateNav();
  };

  const fillDialog = (item: CatalogCase) => {
    titleEl.textContent = item.title;
    metaEl.textContent = [item.category, item.period].filter(Boolean).join(' · ');
    profileEl.textContent = item.profile;
    bodyEl.innerHTML = item.sections
      .map((section) => `<section><h3>${escapeHtml(section.title)}</h3><p>${rich(section.body)}</p></section>`)
      .join('');
  };

  const paint = (lang: Lang) => {
    const items = catalogs[lang] ?? ru;
    const byId = new Map(items.map((item) => [item.id, item]));

    filters.querySelectorAll<HTMLButtonElement>('[data-case-filter]').forEach((button) => {
      const key = button.dataset.caseFilter ?? '';
      if (!key) return;
      const index = ru.findIndex((item) => item.type === key);
      const label = index >= 0 ? items[index]?.type : '';
      if (label) button.textContent = label;
    });

    carousel.querySelectorAll<HTMLElement>('.case-card').forEach((card) => {
      const item = byId.get(Number(card.dataset.caseId));
      if (!item) return;
      const typeEl = card.querySelector('.case-card-type');
      const cardTitle = card.querySelector('.case-card-title');
      const kpiEl = card.querySelector('.case-card-kpi');
      const strategyEl = card.querySelector<HTMLElement>('.case-card-strategy');
      if (typeEl) typeEl.textContent = item.type;
      if (cardTitle) cardTitle.textContent = item.title;
      if (kpiEl) kpiEl.textContent = item.kpi;
      if (strategyEl) {
        strategyEl.textContent = item.strategy;
        strategyEl.hidden = !item.strategy;
      }
    });

    if (dialog.open && openId != null) {
      const item = byId.get(openId);
      if (item) fillDialog(item);
    }
  };

  filters.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-case-filter]');
    if (!button) return;
    applyFilter(button.dataset.caseFilter ?? '');
  });

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
  carousel.addEventListener('scroll', updateNav, { passive: true });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollByCard(-1);
    }
  });
  window.addEventListener('resize', updateNav);

  const showCase = (id: number, returnFocus: HTMLElement) => {
    const lang = (document.documentElement.getAttribute('data-lang') as Lang | null) ?? storedLang();
    const item = (catalogs[lang] ?? ru).find((entry) => entry.id === id);
    const card = carousel.querySelector<HTMLButtonElement>(`.case-card[data-case-id="${id}"]`);
    if (!item || !card) return;
    if (card.classList.contains('is-filtered-out')) applyFilter('');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = card.getBoundingClientRect().left - carousel.getBoundingClientRect().left + carousel.scrollLeft;
    carousel.scrollTo({ left: Math.max(0, left - 8), behavior: reduce ? 'auto' : 'smooth' });
    openId = item.id;
    fillDialog(item);
    opener = returnFocus;
    dialog.showModal();
  };

  carousel.addEventListener('click', (event) => {
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.case-card');
    if (!card) return;
    const id = Number(card.dataset.caseId);
    if (Number.isInteger(id)) showCase(id, card);
  });

  document.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('[data-open-case]');
    if (!link) return;
    const id = Number(link.dataset.openCase);
    if (!Number.isInteger(id)) return;
    event.preventDefault();
    showCase(id, link);
  });

  dialog.querySelector('[data-case-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    openId = null;
    opener?.focus();
    opener = null;
  });

  document.addEventListener('langchange', (event) => {
    const lang = (event as CustomEvent<Lang>).detail;
    if (lang) paint(lang);
  });

  paint(storedLang());
  applyFilter('');
  requestAnimationFrame(updateNav);
}
