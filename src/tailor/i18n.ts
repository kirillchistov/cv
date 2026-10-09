import type { I18nDict } from '../types';

// UI strings for the tailor page. RU + EN; FR/ES fall back to EN via getText.
// {placeholders} are filled in main.ts.
export const tailorTexts: I18nDict = {
  tlMetaTitle: {
    ru: 'Адаптация резюме под вакансию: бесплатно и без регистрации',
    en: 'Tailor your resume to a job: free, no sign-up',
  },
  tlRole: { ru: 'Адаптация резюме', en: 'Resume tailor' },
  tlTagline: { ru: 'ATS · правило 5 секунд · без регистрации', en: 'ATS · 5-second rule · no sign-up' },

  tlEyebrow: {
    ru: 'Бесплатно · без регистрации · тексты не покидают браузер',
    en: 'Free · no sign-up · your text never leaves the browser',
  },
  tlTitle: { ru: 'Адаптируйте резюме под вакансию', en: 'Tailor your resume to a job' },
  tlLead: {
    ru: 'Вставьте вакансию и своё резюме. Сервис найдёт ключевые слова, которые ищет ATS, проверит, что рекрутер увидит в первые 5 секунд, и соберёт версию резюме под эту вакансию. Ничего не выдумывается: меняются порядок, заголовки и форматирование, а то, чего не хватает, попадает в рекомендации.',
    en: 'Paste a job post and your resume. The tool finds the keywords an ATS looks for, checks what a recruiter sees in the first 5 seconds and builds a version of your resume for this job. Nothing is invented: it reorders, re-labels and cleans up; whatever is missing goes into recommendations.',
  },
  tlStep1: { ru: 'Вставьте вакансию', en: 'Paste the job post' },
  tlStep2: { ru: 'Вставьте резюме', en: 'Paste your resume' },
  tlStep3: { ru: 'Скачайте новую версию', en: 'Download the new version' },

  tlVacancy: { ru: 'Вакансия', en: 'Job post' },
  tlVacancyPh: {
    ru: 'Скопируйте сюда текст вакансии целиком: название, задачи, требования, «будет плюсом»…',
    en: 'Paste the whole job post: title, responsibilities, requirements, nice-to-haves…',
  },
  tlResume: { ru: 'Резюме', en: 'Resume' },
  tlResumePh: {
    ru: 'Вставьте текст резюме из hh.ru, LinkedIn, Word или PDF (Ctrl+A → Ctrl+C)',
    en: 'Paste your resume text from LinkedIn, Word or PDF (Ctrl+A → Ctrl+C)',
  },
  tlSampleVacancy: { ru: 'Пример вакансии', en: 'Sample job' },
  tlSiteResume: { ru: 'Резюме с этого сайта', en: 'CV from this site' },
  tlClear: { ru: 'Очистить', en: 'Clear' },
  tlWords: { ru: 'слов: {n}', en: '{n} words' },
  tlRun: { ru: 'Адаптировать резюме', en: 'Tailor my resume' },
  tlNeedVacancy: { ru: 'Вставьте текст вакансии, хотя бы пару абзацев', en: 'Paste the job post, at least a couple of paragraphs' },
  tlNeedResume: { ru: 'Вставьте текст резюме', en: 'Paste your resume text' },
  tlNoKeywords: {
    ru: 'В тексте вакансии не нашлось требований. Проверьте, что вставлена вакансия целиком.',
    en: 'No requirements found in the job post. Make sure you pasted the whole thing.',
  },

  tlScoreCoverage: { ru: 'Совпадение с вакансией', en: 'Match with the job' },
  tlScoreMust: { ru: 'Обязательные требования', en: 'Must-have requirements' },
  tlScoreAts: { ru: 'ATS-чеклист', en: 'ATS checklist' },
  tlScoreFive: { ru: 'Правило 5 секунд', en: '5-second rule' },
  tlBeforeAfter: { ru: 'было {a} → стало {b}', en: 'before {a} → after {b}' },
  tlDisclaimer: {
    ru: 'Это оценка по правилам, а не балл конкретной ATS: системы ранжируют по-разному, но почти все опираются на совпадение ключевых слов.',
    en: 'This is a rules-based estimate, not the score of a specific ATS: systems rank differently, but almost all rely on keyword matches.',
  },

  tlKeywordsTitle: { ru: 'Ключевые слова вакансии', en: 'Job keywords' },
  tlKeywordsSub: {
    ru: 'Что ищут ATS и рекрутер. Порядок: сначала обязательные требования, затем задачи и «плюсы».',
    en: 'What the ATS and the recruiter look for: must-haves first, then responsibilities and nice-to-haves.',
  },
  tlFull: { ru: 'есть в резюме', en: 'in your resume' },
  tlPartial: { ru: 'частично', en: 'partly' },
  tlMissing: { ru: 'нет в резюме', en: 'missing' },
  tlMust: { ru: 'обязательно', en: 'must-have' },
  tlCore: { ru: 'задачи', en: 'role' },
  tlNice: { ru: 'плюс', en: 'nice to have' },

  tlFiveTitle: { ru: 'Правило 5 секунд', en: 'The 5-second rule' },
  tlFiveSub: {
    ru: 'За первые секунды рекрутер решает, читать ли дальше. Вот верх адаптированной версии, ключевые слова вакансии подсвечены.',
    en: 'In the first few seconds a recruiter decides whether to keep reading. This is the top of the tailored version, with job keywords highlighted.',
  },
  tlBefore: { ru: 'Было', en: 'Before' },
  tlAfter: { ru: 'Стало', en: 'After' },
  tlFive_headline: { ru: 'Заголовок совпадает с названием вакансии', en: 'Headline matches the job title' },
  tlFive_years: { ru: 'Опыт указан в годах', en: 'Years of experience stated' },
  tlFive_metric: { ru: 'Есть результат в цифрах', en: 'A result in numbers' },
  tlFive_keywords: { ru: 'Главные требования видны сразу', en: 'Top requirements visible at once' },
  tlFive_contacts: { ru: 'Контакты в шапке', en: 'Contacts in the header' },
  tlFive_concise: { ru: 'Короткий профиль (до 75 слов)', en: 'Short summary (≤ 75 words)' },

  tlAtsTitle: { ru: 'ATS-проверка исходного резюме', en: 'ATS check of your original resume' },
  tlAtsSub: {
    ru: 'ATS разбирает резюме на поля до того, как его увидит человек. Что мешает разбору:',
    en: 'An ATS parses your resume into fields before a human sees it. What gets in the way:',
  },
  tlFixed: { ru: 'исправлено в новой версии', en: 'fixed in the new version' },
  tlAts_contacts: { ru: 'Email и телефон', en: 'Email and phone' },
  tlAtsFix_contacts: { ru: 'Добавьте email и телефон текстом в шапку, не картинкой.', en: 'Put your email and phone as text in the header, not as an image.' },
  tlAts_sections: { ru: 'Стандартные разделы', en: 'Standard sections' },
  tlAtsFix_sections: {
    ru: 'Не найдено: {missing}. ATS ищет разделы по привычным названиям: «Опыт работы», «Навыки», «Образование».',
    en: 'Not found: {missing}. An ATS looks for familiar names: “Experience”, “Skills”, “Education”.',
  },
  tlAts_dates: { ru: 'Даты у каждого места работы', en: 'Dates for every job' },
  tlAtsFix_dates: { ru: 'Укажите период для каждой позиции: ММ.ГГГГ – ММ.ГГГГ.', en: 'Give each role a period: MM/YYYY – MM/YYYY.' },
  tlAts_special: { ru: 'Без эмодзи, таблиц и спецсимволов', en: 'No emoji, tables or special symbols' },
  tlAtsFix_special: { ru: 'Найдено символов, которые мешают разбору: {n}.', en: 'Symbols that break parsing: {n}.' },
  tlAts_length: { ru: 'Объём 250–1100 слов', en: 'Length 250–1100 words' },
  tlAtsFix_length: { ru: 'Сейчас слов: {n}. Оптимально 1–2 страницы.', en: 'Currently {n} words. Aim for 1–2 pages.' },
  tlAts_quantified: { ru: 'Достижения в цифрах', en: 'Quantified achievements' },
  tlAtsFix_quantified: {
    ru: 'С цифрами {n} из {total} пунктов. Цель: хотя бы треть.',
    en: '{n} of {total} bullets have numbers. Aim for at least a third.',
  },
  tlAts_longBullets: { ru: 'Короткие пункты', en: 'Short bullets' },
  tlAtsFix_longBullets: { ru: 'Пунктов длиннее 250 символов: {n}. Разбейте их.', en: '{n} bullets are longer than 250 characters. Split them.' },
  tlAts_title: { ru: 'Заголовок совпадает с вакансией', en: 'Headline matches the job' },
  tlAtsFix_title: {
    ru: 'В новой версии заголовок равен названию вакансии. Проверьте, что это честно.',
    en: 'The new version uses the job title as the headline. Make sure that is honest.',
  },
  tlAts_keywords: { ru: 'Покрытие обязательных требований', en: 'Must-have coverage' },
  tlAtsFix_keywords: {
    ru: 'Покрыто {n}%. Чем ниже, тем выше риск автоматического отсева.',
    en: '{n}% covered. The lower it is, the higher the risk of an automatic reject.',
  },

  tlResultTitle: { ru: 'Адаптированное резюме', en: 'Tailored resume' },
  tlResultSub: {
    ru: 'Только ваши факты: новый порядок, стандартные разделы, формулировки из вакансии там, где опыт уже есть.',
    en: 'Only your facts: new order, standard sections, the job’s wording where you already have the experience.',
  },
  tlPreview: { ru: 'Просмотр', en: 'Preview' },
  tlPlain: { ru: 'Текст', en: 'Plain text' },
  tlCopy: { ru: 'Копировать', en: 'Copy' },
  tlCopied: { ru: 'Скопировано', en: 'Copied' },
  tlDownload: { ru: 'Скачать', en: 'Download' },
  tlWithReport: { ru: 'Добавить в файл рекомендации и чек-листы', en: 'Include recommendations and checklists' },
  tlReportTitle: { ru: 'Рекомендации и проверки', en: 'Recommendations and checks' },

  tlRecsTitle: { ru: 'Что дополнить в резюме или в навыках', en: 'What to add to your resume or skill set' },
  tlRecsSub: {
    ru: 'Сервис не добавляет то, чего нет в вашем тексте. Добавьте сами, если это правда.',
    en: 'The tool never adds what is not in your text. Add it yourself if it is true.',
  },
  tlRecAdd: { ru: 'Добавьте в резюме, если у вас есть этот опыт', en: 'Add to your resume if you have this experience' },
  tlRecAddItem: {
    ru: '«{kw}»: опишите задачу и результат в цифрах, используя формулировку из вакансии.',
    en: '“{kw}”: describe a task and a measurable result, using the job’s wording.',
  },
  tlRecWording: { ru: 'Перепишите формулировки как в вакансии', en: 'Reword to match the job' },
  tlRecWordingItem: {
    ru: '«{kw}»: похожие слова в резюме есть, но ATS ищет точную фразу.',
    en: '“{kw}”: similar words are in your resume, but an ATS looks for the exact phrase.',
  },
  tlRecNumbers: { ru: 'Добавьте цифры в релевантные пункты', en: 'Add numbers to relevant bullets' },
  tlRecNumbersHint: { ru: 'сколько, на сколько процентов, за какой срок?', en: 'how many, by what percent, how fast?' },
  tlRecLearn: { ru: 'Навыки и инструменты, которые стоит прокачать', en: 'Skills and tools worth learning' },
  tlRecLearnItem: {
    ru: '{kw}: если не работали, освойте базу и укажите учебный или пет-проект.',
    en: '{kw}: if you have not used it, learn the basics and mention a learning or side project.',
  },
  tlRecSoft: { ru: 'Soft skills: покажите на примере', en: 'Soft skills: show, don’t tell' },
  tlRecSoftItem: {
    ru: '«{kw}»: пример по схеме «ситуация → действия → результат».',
    en: '“{kw}”: an example as situation → action → result.',
  },
  tlRecNice: { ru: 'Будет плюсом (если есть)', en: 'Nice to have (if true)' },
  tlRecNone: { ru: 'Серьёзных пробелов не найдено.', en: 'No major gaps found.' },

  tlChangesTitle: { ru: 'Что изменено', en: 'What changed' },
  tlChange_headline: {
    ru: 'Заголовок: «{from}» → «{to}». Проверьте, что он честно отражает ваш опыт.',
    en: 'Headline: “{from}” → “{to}”. Make sure it honestly reflects your experience.',
  },
  tlChange_summary: {
    ru: 'Профиль: ключевые требования вакансии в первом предложении, дальше самые релевантные фразы из вашего текста.',
    en: 'Summary: the job’s key requirements in the first sentence, then the most relevant sentences from your text.',
  },
  tlChange_skills: {
    ru: 'Формулировок из вакансии в начале блока навыков: {n}. Все они уже есть в вашем опыте.',
    en: 'Job phrases moved to the top of the skills list: {n}. All of them already appear in your experience.',
  },
  tlChange_achievements: {
    ru: 'Блок «Ключевые достижения»: пунктов с цифрами из вашего опыта: {n}.',
    en: '“Key achievements” block: {n} quantified bullets from your experience.',
  },
  tlChange_reordered: {
    ru: 'Мест работы, где самые релевантные пункты подняты наверх: {n}.',
    en: 'Jobs where the most relevant bullets now come first: {n}.',
  },
  tlChange_trimmed: {
    ru: 'Скрыто нерелевантных пунктов в ранних местах работы (оставлены 3 главных): {n}.',
    en: 'Less relevant bullets hidden in early jobs (top 3 kept): {n}.',
  },
  tlChange_headings: {
    ru: 'Разделы названы стандартно и выстроены в удобном для ATS порядке.',
    en: 'Sections use standard names in an ATS-friendly order.',
  },
  tlChange_cleaned: { ru: 'Убрано спецсимволов (эмодзи, таблицы, разделители): {n}.', en: 'Special symbols removed (emoji, tables, separators): {n}.' },

  tlCosTitle: { ru: 'Нужен разбор глубже?', en: 'Need a deeper review?' },
  tlCosText: {
    ru: 'Career Evidence OS делает то же самое с помощью AI: разбирает каждое требование, задаёт уточняющие вопросы, чтобы закрыть пробелы без выдумок, и пишет сопроводительное письмо.',
    en: 'Career Evidence OS does the same with AI: it reviews every requirement, asks follow-up questions to close gaps without inventing facts and writes a cover letter.',
  },
  tlCosCta: { ru: 'Открыть Career OS', en: 'Open Career OS' },
  tlPrivacy: {
    ru: 'Тексты обрабатываются в вашем браузере и никуда не отправляются. Черновик хранится только на этом устройстве.',
    en: 'Your text is processed in your browser and never sent anywhere. The draft is stored on this device only.',
  },
};
