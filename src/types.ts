export type Lang = 'ru' | 'en' | 'fr' | 'es';
export type Theme = 'light' | 'dark';

export interface Project {
  name: string;
  description: string;
  stack: string[];
  url: string;
}

export type I18nDict = Record<string, Record<Lang, string>>;
