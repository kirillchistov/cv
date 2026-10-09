export type Lang = 'ru' | 'en' | 'fr' | 'es';
export type Theme = 'light' | 'dark';

export interface Project {
  name: string;
  description: string;
  stack: string[];
  url: string;
}

// `en` is the fallback, so other languages may be omitted (e.g. tool pages are RU + EN only)
export type I18nDict = Record<string, Partial<Record<Lang, string>> & { en: string }>;
