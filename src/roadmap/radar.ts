export interface RadarAxis {
  label: string;
  current: number;
  target: number;
}

const SIZE = 460;
const CENTER = SIZE / 2;
const RADIUS = 150;
const MAX = 10;

function point(i: number, n: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  const r = (value / MAX) * RADIUS;
  return [CENTER + r * Math.cos(angle), CENTER + r * Math.sin(angle)];
}

function polygon(values: number[]): string {
  return values
    .map((v, i) => point(i, values.length, v).map((c) => c.toFixed(1)).join(','))
    .join(' ');
}

export function renderRadar(axes: RadarAxis[]): string {
  const n = axes.length;
  const rings = [2, 4, 6, 8, 10]
    .map((v) => `<polygon class="radar-ring" points="${polygon(axes.map(() => v))}" />`)
    .join('');

  const spokes = axes
    .map((_, i) => {
      const [x, y] = point(i, n, MAX);
      return `<line class="radar-spoke" x1="${CENTER}" y1="${CENTER}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" />`;
    })
    .join('');

  const labels = axes
    .map((axis, i) => {
      const [x, y] = point(i, n, MAX + 1.9);
      const anchor = Math.abs(x - CENTER) < 8 ? 'middle' : x > CENTER ? 'start' : 'end';
      const gap = axis.target - axis.current;
      const cls = gap >= 3 ? 'radar-label is-gap' : 'radar-label';
      return `<text class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" dominant-baseline="middle">${axis.label}</text>`;
    })
    .join('');

  const dots = axes
    .map((axis, i) => {
      const [x, y] = point(i, n, axis.current);
      return `<circle class="radar-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5"><title>${axis.label}: ${axis.current} / target ${axis.target}</title></circle>`;
    })
    .join('');

  return `
    <svg viewBox="-80 -10 ${SIZE + 160} ${SIZE + 20}" class="radar" role="img"
      aria-label="Skill radar: current level vs. what a solo founder needs">
      ${rings}${spokes}
      <polygon class="radar-target" points="${polygon(axes.map((a) => a.target))}" />
      <polygon class="radar-current" points="${polygon(axes.map((a) => a.current))}" />
      ${dots}${labels}
    </svg>`;
}
