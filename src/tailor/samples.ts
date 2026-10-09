import { getText } from '../i18n';
import type { Lang } from '../types';

export const sampleVacancy: Record<'ru' | 'en', string> = {
  ru: `Head of Growth (B2B SaaS, MarTech)

О компании
Мы делаем SaaS-платформу для маркетинговой аналитики и автоматизации для брендов и ритейла. Команда 60 человек, работаем в России и Казахстане.

Задачи
- Построить и масштабировать систему привлечения клиентов: performance-маркетинг, контекстная реклама, контент, партнёрства
- Отвечать за маркетинговый бюджет и P&L маркетинга, управлять CAC, LTV и окупаемостью каналов
- Запустить lifecycle- и CRM-маркетинг: онбординг, удержание, апсейл
- Выстроить сквозную аналитику и атрибуцию вместе с продуктовой аналитикой
- Проводить A/B-тесты и проверку гипотез, масштабировать работающие механики
- Руководить командой из 6 человек и подрядчиками

Требования
- Опыт в B2B маркетинге или growth от 7 лет, из них от 3 лет на руководящей позиции
- Опыт в SaaS, MarTech или AdTech
- Глубокое понимание юнит-экономики, воронки продаж и когортного анализа
- Уверенный SQL, опыт работы с Power BI или Looker Studio
- Опыт работы с HubSpot или amoCRM
- Английский язык на уровне B2+

Будет плюсом
- Опыт выхода на международные рынки
- Опыт внедрения AI и автоматизации маркетинга
- Опыт ABM-кампаний

Условия
- Удалённо или гибрид, ДМС, опцион`,
  en: `Head of Growth (B2B SaaS, MarTech)

About us
We build a SaaS platform for marketing analytics and automation used by brands and retailers.

What you'll do
- Build and scale customer acquisition: performance marketing, paid search, content, partnerships
- Own the marketing budget and marketing P&L; manage CAC, LTV and channel ROI
- Launch lifecycle and CRM marketing: onboarding, retention, upsell
- Set up end-to-end analytics and attribution together with product analytics
- Run A/B testing and hypothesis testing, scale what works
- Lead a team of 6 plus agencies

Requirements
- 7+ years in B2B marketing or growth, 3+ years in a leadership role
- Experience in SaaS, MarTech or AdTech
- Deep understanding of unit economics, sales pipeline and cohort analysis
- Confident SQL; Power BI or Looker Studio
- Hands-on with HubSpot or Salesforce
- Fluent English

Nice to have
- International markets experience
- AI and marketing automation rollouts
- ABM campaigns

We offer
- Remote or hybrid, health insurance, equity`,
};

/** The CV on this site as plain text, built from the same i18n strings the page renders. */
export function siteResume(lang: Lang): string {
  const t = (key: string) => getText(key, lang).replace(/<[^>]+>/g, '');
  const en = lang !== 'ru';
  const job = (n: number, bullets: number) =>
    [
      `${t(`exp${n}Role`)} — ${t(`exp${n}Company`)}`,
      t(`exp${n}Dates`),
      ...Array.from({ length: bullets }, (_, i) => `- ${t(`exp${n}P${i + 1}`)}`),
    ].join('\n');

  return [
    t('name'),
    t('role'),
    'kchistov@gmail.com · +7 985 774 21 50 · t.me/kirchistov',
    '',
    en ? 'Summary' : 'О себе',
    `${t('heroP1')}. ${t('heroP2')}.`,
    '',
    en ? 'Experience' : 'Опыт работы',
    job(1, 4),
    '',
    job(2, 2),
    '',
    job(3, 2),
    '',
    job(4, 2),
    '',
    job(5, 1),
    '',
    en ? 'Skills' : 'Навыки',
    [t('skillsPg1'), t('skillsPg2'), t('skillsPg3'), t('skillsAm1'), t('skillsAm2'), t('skillsAm3'), t('skillsLead3')].join(', '),
    '',
    en ? 'Education' : 'Образование',
    t('eduDegree'),
    t('eduAuxiliary'),
    '',
    en ? 'Languages' : 'Языки',
    `${t('langSp')}; ${t('langDev')}`,
  ].join('\n');
}
