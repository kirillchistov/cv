import type { Theme } from './types';

const htmlEl = document.documentElement;
const STORAGE_KEY = 'kch-theme';

export function applyTheme(theme: Theme): void {
  htmlEl.setAttribute('data-theme', theme);
  document
    .querySelectorAll('.theme-btn')
    .forEach((btn) => btn.classList.remove('theme-btn-active'));

  if (theme === 'dark') {
    document
      .querySelectorAll('#darkThemeBtn, #darkThemeBtnMobile')
      .forEach((btn) => btn.classList.add('theme-btn-active'));
  } else {
    document
      .querySelectorAll('#lightThemeBtn, #lightThemeBtnMobile')
      .forEach((btn) => btn.classList.add('theme-btn-active'));
  }

  localStorage.setItem(STORAGE_KEY, theme);
}

export function initTheme(): void {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  applyTheme(stored === 'dark' ? 'dark' : 'light');

  ['lightThemeBtn', 'darkThemeBtn', 'lightThemeBtnMobile', 'darkThemeBtnMobile'].forEach(
    (id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        applyTheme(id.includes('dark') ? 'dark' : 'light');
      });
    }
  );
}
