import type { Lang, Theme } from './types';
import { getText } from './i18n';
import { storedLang } from './language';

const htmlEl = document.documentElement;
const STORAGE_KEY = 'kch-theme';

function currentLang(): Lang {
  return (htmlEl.getAttribute('data-lang') as Lang | null) ?? storedLang();
}

// One button: it shows the icon of the theme it switches to.
function syncToggle(theme: Theme): void {
  const next = theme === 'dark' ? 'light' : 'dark';
  const label = getText(next === 'dark' ? 'themeToDark' : 'themeToLight', currentLang());
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
    btn.textContent = next === 'dark' ? '🌙' : '☀';
    btn.title = label;
    btn.setAttribute('aria-label', label);
  });
}

export function applyTheme(theme: Theme): void {
  htmlEl.setAttribute('data-theme', theme);
  syncToggle(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable — theme still applies for this visit */
  }
}

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

export function initTheme(): void {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(storedTheme() ?? (prefersDark ? 'dark' : 'light'));

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  // labels depend on language; language.ts re-runs this after switching
  document.addEventListener('langchange', () =>
    syncToggle((htmlEl.getAttribute('data-theme') as Theme) || 'light')
  );
}
