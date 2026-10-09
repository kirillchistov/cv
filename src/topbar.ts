import { icons } from './icons';
import { getText } from './i18n';
import { storedLang } from './language';

// Shared right-hand side of the topbar for every page (CV, roadmap, tailor).
// Each page lists the controls it needs; the current page gets aria-current.

export type TopbarItem = 'theme' | 'lang' | 'pdf' | 'roadmap' | 'tailor' | 'cv' | 'contact' | 'reset';

const LANG_OPTIONS = [
  ['ru', 'RU'],
  ['en', 'EN'],
  ['fr', 'FR'],
  ['es', 'ES'],
] as const;

function iconLink(href: string, key: string, icon: string, current: boolean): string {
  return `<a href="${href}" class="icon-btn" data-i18n-title="${key}"${current ? ' aria-current="page"' : ''}>${icon}</a>`;
}

function iconButton(id: string, key: string, icon: string): string {
  return `<button type="button" id="${id}" class="icon-btn" data-i18n-title="${key}">${icon}</button>`;
}

export function renderTopbar(items: TopbarItem[], current?: 'cv' | 'roadmap' | 'tailor'): void {
  const container = document.getElementById('topbarActions');
  if (!container) return;

  const html = items.map((item) => {
    switch (item) {
      case 'theme':
        return '<button type="button" class="icon-btn" data-theme-toggle></button>';
      case 'lang':
        return `<select class="lang-select" data-lang-select data-i18n-title="langLabel">
          ${LANG_OPTIONS.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}
        </select>`;
      case 'pdf':
        return iconButton('pdfButton', 'btnPdf', icons.pdf);
      case 'roadmap':
        return iconLink('./roadmap.html', 'navRoadmap', icons.roadmap, current === 'roadmap');
      case 'tailor':
        return iconLink('./tailor.html', 'navTailor', icons.tailor, current === 'tailor');
      case 'cv':
        return iconLink('./', 'navCv', icons.cv, current === 'cv');
      case 'reset':
        return iconButton('resetBtn', 'btnReset', icons.reset);
      case 'contact':
        return `<a href="${current === 'cv' ? '#contact' : './#contact'}" class="btn-primary topbar-contact">
          <span class="topbar-contact-text" data-i18n="btnContact"></span>
          <span class="topbar-contact-icon" aria-hidden="true">${icons.mail}</span>
        </a>`;
    }
  });

  container.innerHTML = html.join('');

  // fill labels now, so pages without the language switcher still get them
  const lang = storedLang();
  container.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const text = getText(el.dataset.i18nTitle || '', lang);
    el.title = text;
    el.setAttribute('aria-label', text);
  });
  container.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    el.textContent = getText(el.dataset.i18n || '', lang);
  });
  container.querySelectorAll<HTMLSelectElement>('[data-lang-select]').forEach((s) => {
    s.value = lang;
  });
}
