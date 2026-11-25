import { describe, expect, it } from 'vitest';
import source from '../../docs/all-cases.md?raw';
import english from '../../docs/all-cases.en.md?raw';
import french from '../../docs/all-cases.fr.md?raw';
import spanish from '../../docs/all-cases.es.md?raw';
import { parseCases } from './parse';

const fixture = `
## Сводка

| # | Категория | Профиль | Главный KPI | Мини-стратегия | Инструменты |
|---|---|---|---|---|---|
| 1 | FMCG Food | Кисломолочка | Инкрементальные продажи +6,4% | Один SKU в трёх бытовых поводах | Ритейл-медиа |
| 2 | Mobile app | Тренировки | Удержание D7 27% → 38% | Голос тренера | Онбординг |
| 36 | FMCG Food | Растительное масло | Вовлеченность 7% → 24% | Рецепты под настроение | Каталог |

## Кейсы

### 1. Повод в корзине
**Категория:** B2C · FMCG Food
**Профиль:** федеральный производитель.
**Период:** март–август

1) **Проблема.** Скидка учит ждать купон.
2) **Решение и результат.** Инкремент **+6,4%**.
3) **Креатив и инструменты.** QR на стакане.
4) **Как измеряли.** Геохолдаут.

### 2. Голос тренера
**Категория:** B2C · мобильное приложение
**Профиль:** приложение тренировок.
**Период:** квартал

1) **Проблема.** Онбординг один на всех.
2) **Решение и результат.** Удержание D7 **27% → 38%**.
3) **Креатив и инструменты.** Ролик голосом тренера.

### 36. Поиск лучших клиентов
**Категория:** B2C · Financial services
**Профиль:** Финтех-сервис.
**Период:** 1 год

1) **Проблема.** Высокий уровень фрода.
2) **Решение и результат.** Повысили **LTV** на **+25%**, **ROI +20%**.
3) **Креатив и инструменты.**. Сквозная аналитика.
`;

describe('parseCases', () => {
  const cases = parseCases(fixture);

  it('reads case sections and keeps the orphan table row out', () => {
    expect(cases.map((item) => item.id)).toEqual([1, 2, 36]);
    expect(cases[0].title).toBe('Повод в корзине');
    expect(cases[0].type).toBe('FMCG Food');
    expect(cases[0].sections.map((section) => section.title)).toEqual([
      'Проблема',
      'Решение и результат',
      'Креатив и инструменты',
      'Как измеряли',
    ]);
    expect(cases[2].sections.map((section) => section.title)).not.toContain('Как измеряли');
    expect(cases[2].sections[2].body).toBe('Сквозная аналитика.');
  });

  it('uses the summary table only when the row is the same case', () => {
    expect(cases[0].kpi).toBe('Инкрементальные продажи +6,4%');
    expect(cases[0].strategy).toBe('Один SKU в трёх бытовых поводах');
    expect(cases[1].kpi).toBe('Удержание D7 27% → 38%');
    expect(cases[1].strategy).toBe('Голос тренера');
    expect(cases[1].type).toBe('мобильное приложение');
    expect(cases[2].kpi).toBe('Повысили LTV на +25%, ROI +20%.');
    expect(cases[2].kpi).not.toContain('Вовлеченность');
    expect(cases[2].strategy).toBe('Высокий уровень фрода.');
  });

  it('reads the catalog document', () => {
    const catalog = parseCases(source);
    expect(catalog).toHaveLength(40);
    expect(catalog[0].kpi).toBe('Инкрементальные продажи +6,4%');
    expect(catalog.find((item) => item.id === 28)?.strategy).toBe('Голос тренера выбран на первом экране');
    expect(catalog.find((item) => item.id === 35)?.sections.some((section) => section.title === 'Как измеряли')).toBe(
      true,
    );
    const fintech = catalog.find((item) => item.id === 36);
    expect(fintech?.title).toContain('дедукции');
    expect(fintech?.kpi).toContain('+25%');
    expect(fintech?.kpi).not.toMatch(/^2\+/);
    expect(fintech?.kpi).not.toContain('Вовлеченность');
    expect(fintech?.sections.some((section) => section.title === 'Как измеряли')).toBe(false);
  });

  it('reads the English, French and Spanish catalogs with the same numbers', () => {
    const en = parseCases(english);
    const fr = parseCases(french);
    const es = parseCases(spanish);

    expect(en).toHaveLength(40);
    expect(fr).toHaveLength(40);
    expect(es).toHaveLength(40);

    expect(en[0].title).toBe('An occasion in the basket');
    expect(en[0].kpi).toBe('Incremental sales +6.4%');
    expect(en.find((item) => item.id === 28)?.strategy).toBe("The coach's voice chosen on the first screen");
    expect(fr[0].title).toBe('Une occasion dans le panier');
    expect(fr[0].kpi).toBe('Ventes incrémentales +6,4 %');
    expect(fr.find((item) => item.id === 28)?.strategy).toBe('La voix du coach choisie au premier écran');
    expect(es[0].title).toBe('Una ocasión en la cesta');
    expect(es[0].kpi).toBe('Ventas incrementales +6,4 %');
    expect(es.find((item) => item.id === 28)?.strategy).toBe('La voz del entrenador elegida en la primera pantalla');

    for (const catalog of [en, fr, es]) {
      const fintech = catalog.find((item) => item.id === 36);
      expect(fintech?.kpi).toContain('+25');
      expect(fintech?.kpi).not.toMatch(/engagement|вовлеченность|participation/i);
      expect(fintech?.sections.some((section) => /measured|mesuré|midió/i.test(section.title))).toBe(false);
      expect(catalog.find((item) => item.id === 35)?.sections.some((section) => /measured|mesuré|midió/i.test(section.title))).toBe(
        true,
      );
    }
  });
});
