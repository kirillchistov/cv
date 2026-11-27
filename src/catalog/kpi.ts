export interface KpiBeat {
  start: number;
  end: number;
  from: number;
  to: number;
  format: (value: number) => string;
}

interface NumberStyle {
  decimals: number;
  comma: boolean;
  sign: '' | '+' | '-' | '−';
  grouped: boolean;
}

function readNumber(raw: string): { value: number; style: NumberStyle } {
  const trimmed = raw.trim();
  const sign = trimmed.startsWith('+') ? '+' : trimmed.startsWith('−') ? '−' : trimmed.startsWith('-') ? '-' : '';
  const body = (sign ? trimmed.slice(1) : trimmed).trim();
  const comma = body.includes(',');
  const grouped = /\d\s+\d/.test(body);
  const fraction = body.match(/[.,](\d+)/);
  const decimals = fraction ? fraction[1].length : 0;
  const magnitude = Number(body.replace(/\s/g, '').replace(',', '.'));
  const value = sign === '+' || sign === '' ? magnitude : -Math.abs(magnitude);
  return { value, style: { decimals, comma, sign, grouped } };
}

function writeNumber(style: NumberStyle, value: number): string {
  const negative = value < 0;
  const absolute = Math.abs(value);
  let body = style.decimals > 0 ? absolute.toFixed(style.decimals) : String(Math.round(absolute));
  if (style.comma) body = body.replace('.', ',');
  if (style.grouped) {
    const splitAt = body.search(/[.,]/);
    const whole = splitAt === -1 ? body : body.slice(0, splitAt);
    const rest = splitAt === -1 ? '' : body.slice(splitAt);
    body = `${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${rest}`;
  }
  if (negative) return `${style.sign === '-' ? '-' : '−'}${body}`;
  if (style.sign === '+') return `+${body}`;
  return body;
}

function beatFor(token: string, tokenStart: number, from: number, to: number): KpiBeat {
  const { style } = readNumber(token);
  return {
    start: tokenStart,
    end: tokenStart + token.length,
    from,
    to,
    format: (value) => writeNumber(style, value),
  };
}

const NUMBER = '[+−-]?\\d(?:[\\d\\s]*\\d)?(?:[.,]\\d+)?';

export function findKpiBeat(text: string): KpiBeat | null {
  const arrow = new RegExp(`(${NUMBER})\\s*%?\\s*(?:→|->)\\s*(${NUMBER})`).exec(text);
  if (arrow?.[1] && arrow[2] && arrow.index != null) {
    const destination = arrow[2];
    const start = arrow.index + arrow[0].length - destination.length;
    return beatFor(destination, start, readNumber(arrow[1]).value, readNumber(destination).value);
  }

  const multiplier = /[x×]\s*(\d+(?:[.,]\d+)?)/i.exec(text);
  if (multiplier?.[1] && multiplier.index != null) {
    const token = multiplier[1];
    const start = multiplier.index + multiplier[0].length - token.length;
    return beatFor(token, start, 0, readNumber(token).value);
  }

  const metric = new RegExp(`(${NUMBER})\\s*(?:%|п\\.\\s*п\\.|p\\.\\s*p\\.)`, 'gi');
  let last: RegExpExecArray | null = null;
  for (let match = metric.exec(text); match; match = metric.exec(text)) last = match;
  if (last?.[1] && last.index != null) {
    return beatFor(last[1], last.index, 0, readNumber(last[1]).value);
  }

  return null;
}
