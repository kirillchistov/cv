import type { Lang } from './types';
import { getText } from './i18n';

const htmlEl = document.documentElement;
const STORAGE_KEY = 'kch-lang';
const LANGS: Lang[] = ['ru', 'en', 'fr', 'es'];

export function storedLang(): Lang {
  try {
    const value = localStorage.getItem(STORAGE_KEY) as Lang | null;
    return value && LANGS.includes(value) ? value : 'ru';
  } catch {
    return 'ru';
  }
}

export function applyLanguage(lang: Lang): void {
  htmlEl.setAttribute('data-lang', lang);
  htmlEl.setAttribute('lang', lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }

  document.querySelectorAll<HTMLSelectElement>('[data-lang-select]').forEach((select) => {
    select.value = lang;
  });

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;

    if (key === 'footerText') {
      el.innerHTML = getText(key, lang);
      const yearEl = document.getElementById('year');
      if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
    } else {
      el.innerHTML = getText(key, lang);
    }
  });

  // icon-only controls: translate tooltip + accessible name
  document.querySelectorAll<HTMLElement>('[data-i18n-title]').forEach((el) => {
    const text = getText(el.dataset.i18nTitle || '', lang);
    el.title = text;
    el.setAttribute('aria-label', text);
  });

  document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', getText(el.dataset.i18nPlaceholder || '', lang));
  });

  const titleKey = htmlEl.dataset.titleKey || 'metaTitle';
  document.title = getText(titleKey, lang);

  document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function initLanguage(): void {
  applyLanguage(storedLang());

  document.querySelectorAll<HTMLSelectElement>('[data-lang-select]').forEach((select) => {
    select.addEventListener('change', () => applyLanguage(select.value as Lang));
  });
}
