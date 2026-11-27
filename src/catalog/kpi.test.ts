import { describe, expect, it } from 'vitest';
import { findKpiBeat } from './kpi';

describe('findKpiBeat', () => {
  it('counts an arrow up to the result', () => {
    const text = 'Конверсия сайта 1,8% → 3,1%';
    const beat = findKpiBeat(text);
    expect(beat).not.toBeNull();
    expect(text.slice(0, beat!.start) + beat!.format(beat!.from) + text.slice(beat!.end)).toBe(
      'Конверсия сайта 1,8% → 1,8%',
    );
    expect(text.slice(0, beat!.start) + beat!.format(beat!.to) + text.slice(beat!.end)).toBe(text);
  });

  it('counts a signed percent from zero', () => {
    const text = 'Инкрементальные продажи +6,4%';
    const beat = findKpiBeat(text);
    expect(beat?.format(0)).toBe('+0,0');
    expect(beat?.format(beat.to)).toBe('+6,4');
  });

  it('counts a multiplier', () => {
    const text = 'увеличили выручку x12 при ROMI >300%';
    const beat = findKpiBeat(text);
    expect(text.slice(beat!.start, beat!.end)).toBe('12');
    expect(beat?.format(0)).toBe('0');
    expect(beat?.format(beat.to)).toBe('12');
  });

  it('counts percentage points and English decimals', () => {
    const points = findKpiBeat('Пенетрация домохозяйств +1,6 п.п.');
    expect(points?.format(points.to)).toBe('+1,6');
    const english = findKpiBeat('Site conversion 1.8% → 3.1%');
    expect(english?.format(english.from)).toBe('1.8');
    expect(english?.format(english.to)).toBe('3.1');
  });

  it('leaves a price comparison alone', () => {
    expect(findKpiBeat('Чек конфигуратора 38 400 ₽ vs 24 900 ₽')).toBeNull();
  });
});