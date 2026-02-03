import type { Lang } from './types';
import { getText } from './i18n';

const htmlEl = document.documentElement;
const STORAGE_KEY = 'kch-lang';

export function applyLanguage(lang: Lang): void {
  htmlEl.setAttribute('data-lang', lang);
  localStorage.setItem(STORAGE_KEY, lang);

  document
    .querySelectorAll('.lang-btn')
    .forEach((btn) => btn.classList.remove('lang-btn-active'));
  document
    .querySelectorAll(`.lang-btn[data-lang="${lang}"]`)
    .forEach((btn) => btn.classList.add('lang-btn-active'));

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

  document.title = getText('metaTitle', lang);
}

export function initLanguage(): void {
  const stored = (localStorage.getItem(STORAGE_KEY) || 'ru') as Lang;
  applyLanguage(stored);

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang') as Lang;
      if (lang) applyLanguage(lang);
    });
  });
}
