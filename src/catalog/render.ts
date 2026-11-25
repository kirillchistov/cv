import source from '../../docs/all-cases.md?raw';
import { getText } from '../i18n';
import { parseCases, type CatalogCase } from './parse';

const cases = parseCases(source);

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
}

function rich(text: string): string {
  return escapeHtml(text.replace(/\s*\n\s*/g, ' ').trim()).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function renderCatalog(): void {
  const root = document.getElementById('caseCatalog');
  if (!root || cases.length === 0) return;

  const filters = document.createElement('div');
  filters.className = 'case-filters';
  filters.setAttribute('role', 'toolbar');

  const all = document.createElement('button');
  all.type = 'button';
  all.className = 'case-filter is-active';
  all.dataset.caseFilter = '';
  all.dataset.i18n = 'casesAll';
  all.textContent = getText('casesAll', 'ru');
  all.setAttribute('aria-pressed', 'true');
  filters.append(all);

  const types = [...new Set(cases.map((item) => item.type).filter(Boolean))];
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

  for (const item of cases) {
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
    type.textContent = item.type;
    kicker.append(num, type);

    const title = document.createElement('span');
    title.className = 'case-card-title';
    title.textContent = item.title;

    const kpi = document.createElement('span');
    kpi.className = 'case-card-kpi';
    kpi.textContent = item.kpi;

    card.append(kicker, title, kpi);
    if (item.strategy) {
      const strategy = document.createElement('span');
      strategy.className = 'case-card-strategy';
      strategy.textContent = item.strategy;
      card.append(strategy);
    }
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

  const openCase = (item: CatalogCase, card: HTMLElement) => {
    titleEl.textContent = item.title;
    metaEl.textContent = [item.category, item.period].filter(Boolean).join(' · ');
    profileEl.textContent = item.profile;
    bodyEl.innerHTML = item.sections
      .map((section) => `<section><h3>${escapeHtml(section.title)}</h3><p>${rich(section.body)}</p></section>`)
      .join('');
    opener = card;
    dialog.showModal();
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

  carousel.addEventListener('click', (event) => {
    const card = (event.target as HTMLElement).closest<HTMLButtonElement>('.case-card');
    if (!card) return;
    const item = cases.find((entry) => String(entry.id) === card.dataset.caseId);
    if (item) openCase(item, card);
  });

  dialog.querySelector('[data-case-close]')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    opener?.focus();
    opener = null;
  });

  applyFilter('');
  requestAnimationFrame(updateNav);
}
