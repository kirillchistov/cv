import type { Lang } from '../types';

type Motion = 'bob' | 'pulse' | 'draw';
type Caption = Record<Lang, string>;

function ico(motion: Motion, body: string): string {
  return `<svg class="case-ico ico-${motion}" viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;
}

const ICONS: Record<number, string> = {
  1: ico('bob', `
    <path class="ico-stroke" d="M22 28h20l-2 22H24z"/>
    <path class="ico-stroke ico-motion" d="M26 28c1-8 11-8 12 0"/>
    <path class="ico-soft" d="M18 28h28"/>
  `),
  2: ico('pulse', `
    <ellipse class="ico-stroke" cx="32" cy="40" rx="16" ry="6"/>
    <path class="ico-stroke" d="M16 40c2-10 8-16 16-16s14 6 16 16"/>
    <circle class="ico-stroke ico-motion" cx="46" cy="18" r="7"/>
    <path class="ico-stroke" d="M46 15v3l2 2"/>
  `),
  3: ico('pulse', `
    <rect class="ico-stroke" x="14" y="28" width="36" height="22" rx="2"/>
    <path class="ico-stroke" d="M14 36h36M32 28v22"/>
    <path class="ico-stroke ico-motion" d="M32 28c-4-8-14-6-8 0 4-3 8 0 8 0s4-3 8 0c6-6-4-8-8 0z"/>
  `),
  4: ico('pulse', `
    <rect class="ico-stroke" x="14" y="16" width="36" height="34" rx="3"/>
    <path class="ico-stroke" d="M14 26h36M24 12v8M40 12v8"/>
    <circle class="ico-fill ico-motion" cx="26" cy="36" r="2.4"/>
    <circle class="ico-soft" cx="36" cy="36" r="2.4"/>
    <circle class="ico-soft" cx="26" cy="44" r="2.4"/>
  `),
  5: ico('bob', `
    <path class="ico-stroke" d="M28 24h10l2 26H26z"/>
    <path class="ico-stroke" d="M30 24V16h8"/>
    <path class="ico-stroke ico-motion" d="M42 18c5 2 7 8 4 12M46 16c2-1 5 0 6 2"/>
  `),
  6: ico('bob', `
    <rect class="ico-stroke" x="24" y="18" width="16" height="30" rx="5"/>
    <path class="ico-stroke" d="M28 18v-5h8v5"/>
    <path class="ico-stroke ico-motion" d="M32 28c5 4 5 12 0 16"/>
  `),
  7: ico('pulse', `
    <path class="ico-stroke ico-motion" d="M32 10v44M12 22l40 20M12 42L52 22"/>
    <circle class="ico-fill" cx="32" cy="32" r="4"/>
  `),
  8: ico('pulse', `
    <rect class="ico-stroke" x="12" y="16" width="30" height="32" rx="3"/>
    <path class="ico-fill ico-motion" d="M22 26l12 6-12 6z"/>
    <path class="ico-soft" d="M48 20v24M54 24v16"/>
  `),
  9: ico('bob', `
    <path class="ico-soft" d="M16 40c0 7 8 9 8 0 0-9-8-16-8-16s-8 7-8 16z"/>
    <path class="ico-stroke ico-motion" d="M32 38c0 8 8 10 8 0 0-10-8-18-8-18s-8 8-8 18z"/>
    <path class="ico-soft" d="M48 40c0 7 8 9 8 0 0-9-8-16-8-16s-8 7-8 16z"/>
  `),
  10: ico('bob', `
    <path class="ico-stroke ico-motion" d="M32 14a5 5 0 015 5c0 3-5 5-5 5s-5-2-5-5a5 5 0 015-5z"/>
    <path class="ico-stroke" d="M32 24L50 36H14z"/>
    <path class="ico-soft" d="M20 36c2 8 6 12 12 12s10-4 12-12"/>
  `),
  11: ico('bob', `
    <path class="ico-stroke" d="M24 24l8-6 8 6 6 4-5 5-3-2v18H26V31l-3 2-5-5z"/>
    <path class="ico-stroke ico-motion" d="M48 42V26m0 0l-4 4m4-4l4 4"/>
  `),
  12: ico('pulse', `
    <rect class="ico-stroke" x="10" y="14" width="44" height="28" rx="2"/>
    <path class="ico-stroke" d="M26 50h12M32 42v8"/>
    <rect class="ico-fill ico-motion" x="18" y="20" width="18" height="12" rx="1"/>
  `),
  13: ico('pulse', `
    <rect class="ico-stroke" x="16" y="10" width="26" height="40" rx="3"/>
    <path class="ico-stroke" d="M22 20h14M22 28h10M22 36h12"/>
    <circle class="ico-stroke ico-motion" cx="44" cy="44" r="8"/>
    <path class="ico-stroke" d="M44 40v4l3 2"/>
  `),
  14: ico('pulse', `
    <rect class="ico-stroke ico-motion" x="8" y="20" width="48" height="28" rx="4"/>
    <path class="ico-stroke" d="M8 30h48"/>
    <rect class="ico-fill" x="14" y="36" width="10" height="6" rx="1"/>
  `),
  15: ico('pulse', `
    <circle class="ico-stroke" cx="32" cy="32" r="18"/>
    <circle class="ico-stroke" cx="32" cy="32" r="10"/>
    <circle class="ico-fill ico-motion" cx="32" cy="32" r="3.5"/>
  `),
  16: ico('pulse', `
    <path class="ico-stroke" d="M32 10l18 7v14c0 12-8 18-18 22C22 49 14 43 14 31V17z"/>
    <path class="ico-stroke ico-motion" d="M24 32l6 6 12-14"/>
  `),
  17: ico('draw', `
    <path class="ico-stroke" d="M12 50h40"/>
    <path class="ico-stroke ico-motion" d="M16 42l10-12 8 6 14-18"/>
    <circle class="ico-fill" cx="48" cy="18" r="2.5"/>
  `),
  18: ico('bob', `
    <path class="ico-stroke ico-motion" d="M32 52s16-14 16-26a16 16 0 10-32 0c0 12 16 26 16 26z"/>
    <circle class="ico-fill" cx="32" cy="26" r="5"/>
  `),
  19: ico('bob', `
    <path class="ico-stroke ico-motion" d="M8 36l46-14-12 8 8 14-10-8-8 8-2-10z"/>
  `),
  20: ico('bob', `
    <path class="ico-stroke" d="M14 36l6-12h20l8 12"/>
    <path class="ico-stroke" d="M10 36h44v8H10z"/>
    <circle class="ico-fill ico-motion" cx="20" cy="46" r="3.5"/>
    <circle class="ico-fill" cx="46" cy="46" r="3.5"/>
  `),
  21: ico('draw', `
    <path class="ico-stroke" d="M12 42a20 20 0 0140 0"/>
    <path class="ico-stroke" d="M32 42V28"/>
    <path class="ico-stroke ico-motion" d="M32 42l12-8"/>
    <circle class="ico-fill" cx="32" cy="42" r="2.5"/>
  `),
  22: ico('pulse', `
    <rect class="ico-stroke" x="14" y="12" width="36" height="40"/>
    <path class="ico-stroke" d="M14 28h36M32 28v24"/>
    <rect class="ico-fill ico-motion" x="20" y="16" width="8" height="7"/>
    <rect class="ico-soft" x="36" y="34" width="8" height="10"/>
  `),
  23: ico('bob', `
    <path class="ico-stroke" d="M8 30L32 12l24 18"/>
    <path class="ico-stroke" d="M16 28v22h32V28"/>
    <path class="ico-stroke ico-motion" d="M28 50V36h8v14"/>
  `),
  24: ico('bob', `
    <circle class="ico-stroke" cx="24" cy="26" r="9"/>
    <circle class="ico-fill" cx="24" cy="26" r="3"/>
    <path class="ico-stroke ico-motion" d="M31 32l18 12-5 5-5-4-4 5-5-5"/>
  `),
  25: ico('bob', `
    <path class="ico-stroke" d="M12 34v12h40V34"/>
    <path class="ico-stroke ico-motion" d="M14 34c0-8 8-10 12-2h12c4-8 12-6 12 2"/>
    <path class="ico-soft" d="M18 46v6M46 46v6"/>
  `),
  26: ico('bob', `
    <path class="ico-stroke" d="M18 46L36 28"/>
    <path class="ico-stroke ico-motion" d="M34 16l14 6-8 8-12-8z"/>
    <path class="ico-soft" d="M16 50h14"/>
  `),
  27: ico('pulse', `
    <path class="ico-stroke" d="M10 18h18c3 3 7 3 10 0h16v30H38c-3 3-7 3-10 0H10z"/>
    <path class="ico-stroke ico-motion" d="M32 18v30"/>
  `),
  28: ico('pulse', `
    <path class="ico-stroke ico-motion" d="M16 24v16M24 18v28M40 18v28M48 24v16M24 32h16"/>
  `),
  29: ico('bob', `
    <path class="ico-stroke ico-motion" d="M12 20h40v8a5 5 0 000 10v8H12v-8a5 5 0 000-10z"/>
    <path class="ico-soft" d="M32 22v22" stroke-dasharray="2 3"/>
  `),
  30: ico('pulse', `
    <path class="ico-stroke" d="M12 14h30a4 4 0 014 4v14a4 4 0 01-4 4H26l-8 8v-8h-6a4 4 0 01-4-4V18a4 4 0 014-4z"/>
    <path class="ico-stroke ico-motion" d="M22 34l6-14 6 14M25 28h6"/>
  `),
  31: ico('draw', `
    <path class="ico-stroke" d="M18 10h18l12 12v30H18z"/>
    <path class="ico-stroke" d="M36 10v12h12"/>
    <path class="ico-stroke ico-motion" d="M24 32h16M24 38h12M24 44h14"/>
  `),
  32: ico('bob', `
    <path class="ico-stroke" d="M32 14v32M20 50h24"/>
    <path class="ico-stroke ico-motion" d="M14 22h36"/>
    <path class="ico-stroke" d="M14 22l-6 12h12zM50 22l-6 12h12z"/>
  `),
  33: ico('pulse', `
    <rect class="ico-stroke" x="16" y="8" width="32" height="48" rx="3"/>
    <rect class="ico-fill ico-motion" x="22" y="14" width="20" height="10" rx="1"/>
    <path class="ico-soft" d="M24 32h4M32 32h4M40 32h4M24 40h4M32 40h4M40 40h4M24 48h4M32 48h4"/>
  `),
  34: ico('pulse', `
    <rect class="ico-soft" x="12" y="12" width="12" height="12"/>
    <rect class="ico-soft" x="26" y="12" width="12" height="12"/>
    <rect class="ico-fill ico-motion" x="40" y="12" width="12" height="12"/>
    <rect class="ico-soft" x="12" y="26" width="12" height="12"/>
    <rect class="ico-fill" x="26" y="26" width="12" height="12"/>
    <rect class="ico-soft" x="40" y="26" width="12" height="12"/>
    <rect class="ico-soft" x="12" y="40" width="12" height="12"/>
    <rect class="ico-soft" x="26" y="40" width="12" height="12"/>
    <rect class="ico-fill" x="40" y="40" width="12" height="12"/>
  `),
  35: ico('draw', `
    <rect class="ico-stroke" x="12" y="14" width="40" height="36"/>
    <path class="ico-stroke" d="M12 32h18M30 14v18"/>
    <path class="ico-stroke ico-motion" d="M18 44c8-14 14-2 22-16"/>
  `),
  36: ico('pulse', `
    <circle class="ico-stroke ico-motion" cx="28" cy="28" r="12"/>
    <path class="ico-stroke" d="M36 36l14 14"/>
    <path class="ico-soft" d="M22 28h12M28 22v12"/>
  `),
  37: ico('bob', `
    <circle class="ico-stroke" cx="18" cy="40" r="7"/>
    <circle class="ico-stroke ico-motion" cx="34" cy="28" r="7"/>
    <circle class="ico-stroke" cx="50" cy="18" r="7"/>
    <path class="ico-soft" d="M23 36l6-4M39 24l6-3"/>
  `),
  38: ico('pulse', `
    <circle class="ico-stroke" cx="16" cy="42" r="5"/>
    <circle class="ico-stroke" cx="32" cy="20" r="5"/>
    <circle class="ico-fill ico-motion" cx="50" cy="36" r="5"/>
    <path class="ico-stroke" d="M20 38l8-14M36 22l10 11"/>
  `),
  39: ico('draw', `
    <rect class="ico-stroke" x="10" y="12" width="44" height="36" rx="2"/>
    <path class="ico-stroke ico-motion" d="M16 38l8-10 7 5 12-14"/>
  `),
  40: ico('pulse', `
    <circle class="ico-stroke" cx="24" cy="20" r="6"/>
    <circle class="ico-stroke ico-motion" cx="42" cy="22" r="6"/>
    <path class="ico-stroke" d="M10 48c2-10 8-14 14-14s12 4 14 14"/>
    <path class="ico-stroke" d="M32 48c1-8 6-12 12-12s10 3 12 12"/>
  `),
};

const CAPTIONS: Record<number, Caption> = {
  1: { ru: 'Повод в корзине', en: 'Occasion in the basket', fr: 'Occasion dans le panier', es: 'Ocasión en la cesta' },
  2: { ru: 'Ужин сегодня', en: 'Dinner tonight', fr: 'Dîner ce soir', es: 'Cena de hoy' },
  3: { ru: 'Именной вкладыш', en: 'Named insert', fr: 'Mot dans le coffret', es: 'Nota con nombre' },
  4: { ru: 'Календарь прикорма', en: 'Feeding calendar', fr: 'Calendrier de diversification', es: 'Calendario de alimentación' },
  5: { ru: 'Три быта', en: 'Three households', fr: 'Trois foyers', es: 'Tres hogares' },
  6: { ru: 'Ритуал на 14 дней', en: '14-day ritual', fr: 'Rituel de 14 jours', es: 'Ritual de 14 días' },
  7: { ru: 'Первый холодный день', en: 'First cold day', fr: 'Premier jour froid', es: 'Primer día frío' },
  8: { ru: 'Курс как сериал', en: 'Course as a series', fr: 'Cure en série', es: 'Curso en serie' },
  9: { ru: 'Три шага ухода', en: 'Three-step routine', fr: 'Routine en trois gestes', es: 'Rutina en tres pasos' },
  10: { ru: 'Разговор о посадке', en: 'A conversation about fit', fr: 'Parler de la coupe', es: 'Hablar del ajuste' },
  11: { ru: 'Следующий размер', en: 'Next size', fr: 'Taille suivante', es: 'Talla siguiente' },
  12: { ru: 'Сцена, не характеристики', en: 'A scene, not specs', fr: 'Une scène, pas des specs', es: 'Una escena, no fichas' },
  13: { ru: 'Месяц обычными словами', en: 'The month in plain words', fr: 'Le mois en mots simples', es: 'El mes en palabras llanas' },
  14: { ru: 'Карта под крупный повод', en: 'A card for a big occasion', fr: 'Une carte pour une grande occasion', es: 'Tarjeta para una gran ocasión' },
  15: { ru: 'Копилка как сюжет', en: 'Savings as a story', fr: 'Une tirelire qui a une histoire', es: 'Una hucha con historia' },
  16: { ru: 'Год с полисом', en: 'A year with the policy', fr: 'Une année avec la police', es: 'Un año con la póliza' },
  17: { ru: 'Два издания недели', en: 'Two editions of the week', fr: 'Deux éditions de la semaine', es: 'Dos ediciones de la semana' },
  18: { ru: 'Три маршрута', en: 'Three routes', fr: 'Trois itinéraires', es: 'Tres rutas' },
  19: { ru: 'Один рейс, один повод', en: 'One flight, one reason', fr: 'Un vol, une raison', es: 'Un vuelo, un motivo' },
  20: { ru: 'Тест-драйв рядом с домом', en: 'A test drive near home', fr: 'Un essai près de chez soi', es: 'Una prueba cerca de casa' },
  21: { ru: 'Веха пробега', en: 'A mileage milestone', fr: 'Un palier de kilométrage', es: 'Un hito de kilometraje' },
  22: { ru: 'Одна планировка', en: 'One floor plan', fr: 'Un seul plan', es: 'Un solo plano' },
  23: { ru: 'Участок на выходные', en: 'A plot for the weekend', fr: 'Une parcelle pour le week-end', es: 'Una parcela para el fin de semana' },
  24: { ru: 'Ключ от аренды', en: 'The rental key', fr: 'La clé de la location', es: 'La llave del alquiler' },
  25: { ru: 'Доска комнаты', en: 'A board of the room', fr: 'La planche de la pièce', es: 'El tablero de la habitación' },
  26: { ru: 'Ремонт по календарю', en: 'A renovation on a calendar', fr: 'Des travaux au calendrier', es: 'Una obra con calendario' },
  27: { ru: 'Зеркало вакансии', en: 'A mirror of the job post', fr: "Le miroir de l'offre", es: 'El espejo de la vacante' },
  28: { ru: 'Голос тренера', en: "The coach's voice", fr: "La voix de l'entraîneur", es: 'La voz del entrenador' },
  29: { ru: 'Афиша на четверг', en: 'A bill for Thursday', fr: 'L’affiche du jeudi', es: 'La cartelera del jueves' },
  30: { ru: 'Урок из вчерашней ошибки', en: "Yesterday's mistake as a lesson", fr: "La leçon de l'erreur d'hier", es: 'La lección del error de ayer' },
  31: { ru: 'Служебная записка', en: 'An internal memo', fr: 'Une note de service', es: 'Una nota interna' },
  32: { ru: 'Что это значит в понедельник', en: 'What it means on Monday', fr: 'Ce que cela change lundi', es: 'Qué significa el lunes' },
  33: { ru: 'Закрытие месяца', en: 'Month close', fr: 'La clôture du mois', es: 'El cierre del mes' },
  34: { ru: 'Карта навыков', en: 'A skill map', fr: 'Une carte des compétences', es: 'Un mapa de habilidades' },
  35: { ru: 'Обход этажа', en: 'A walk through the floor', fr: "La visite de l'étage", es: 'El recorrido de la planta' },
  36: { ru: 'Поиск лучших клиентов', en: 'Finding the best clients', fr: 'Trouver les meilleurs clients', es: 'Buscar a los mejores clientes' },
  37: { ru: 'Денежный поток', en: 'Cash flow', fr: "Le flux d'argent", es: 'El flujo de dinero' },
  38: { ru: 'Сеть дилеров', en: 'A dealer network', fr: 'Un réseau de revendeurs', es: 'Una red de distribuidores' },
  39: { ru: 'Сквозная аналитика', en: 'End-to-end analytics', fr: 'L’analytique de bout en bout', es: 'Analítica de extremo a extremo' },
  40: { ru: 'Сообщество', en: 'Community', fr: 'La communauté', es: 'La comunidad' },
};

export function caseScheme(id: number): string {
  return ICONS[id] ?? ICONS[1]!;
}

export function schemeCaption(id: number, lang: Lang): string {
  const row = CAPTIONS[id];
  if (!row) return '';
  return row[lang] || row.en;
}
