export type SchemeKind = 'fan' | 'loop' | 'pulse' | 'relay' | 'funnel' | 'branch';

const KIND: Record<number, SchemeKind> = {
  1: 'fan',
  2: 'pulse',
  3: 'relay',
  4: 'loop',
  5: 'fan',
  6: 'loop',
  7: 'pulse',
  8: 'loop',
  9: 'relay',
  10: 'relay',
  11: 'loop',
  12: 'fan',
  13: 'funnel',
  14: 'pulse',
  15: 'loop',
  16: 'loop',
  17: 'fan',
  18: 'relay',
  19: 'pulse',
  20: 'relay',
  21: 'pulse',
  22: 'fan',
  23: 'relay',
  24: 'fan',
  25: 'relay',
  26: 'loop',
  27: 'relay',
  28: 'fan',
  29: 'pulse',
  30: 'loop',
  31: 'relay',
  32: 'pulse',
  33: 'loop',
  34: 'funnel',
  35: 'relay',
  36: 'funnel',
  37: 'branch',
  38: 'branch',
  39: 'branch',
  40: 'loop',
};

const BODY: Record<SchemeKind, string> = {
  fan: `
    <path class="scheme-track" d="M18 32 H92" />
    <path class="scheme-arm" d="M92 32 L156 14" />
    <path class="scheme-arm" d="M92 32 H176" style="animation-delay:0.15s" />
    <path class="scheme-arm" d="M92 32 L156 50" style="animation-delay:0.3s" />
    <circle class="scheme-node" cx="18" cy="32" r="6" />
    <circle class="scheme-node scheme-end" cx="160" cy="14" r="5" />
    <circle class="scheme-node scheme-end" cx="180" cy="32" r="5" />
    <circle class="scheme-node scheme-end" cx="160" cy="50" r="5" />
    <circle class="scheme-token" r="3.4" />
  `,
  loop: `
    <path class="scheme-track" d="M120 16 H188 A16 16 0 0 1 204 32 A16 16 0 0 1 188 48 H52 A16 16 0 0 1 36 32 A16 16 0 0 1 52 16 H120" />
    <circle class="scheme-node" cx="120" cy="16" r="5" />
    <circle class="scheme-token" r="3.4" />
  `,
  pulse: `
    <circle class="scheme-beacon" cx="28" cy="32" r="10" />
    <circle class="scheme-node" cx="28" cy="32" r="4.5" />
    <path class="scheme-track" d="M44 32 H196" />
    <circle class="scheme-node scheme-end" cx="208" cy="32" r="6" />
    <circle class="scheme-token" r="3.4" />
  `,
  relay: `
    <path class="scheme-track" d="M22 32 H218" />
    <circle class="scheme-node" cx="22" cy="32" r="6" />
    <circle class="scheme-node scheme-mid" cx="120" cy="32" r="6" />
    <circle class="scheme-node scheme-end" cx="218" cy="32" r="6" />
    <circle class="scheme-token" r="3.4" />
  `,
  funnel: `
    <path class="scheme-track" d="M20 14 V50" />
    <path class="scheme-arm" d="M24 14 C96 14 150 28 206 32" />
    <path class="scheme-arm" d="M24 50 C96 50 150 36 206 32" style="animation-delay:0.12s" />
    <path class="scheme-track scheme-guide" d="M36 32 H196" />
    <circle class="scheme-node scheme-end" cx="214" cy="32" r="6" />
    <circle class="scheme-token" r="3.4" />
  `,
  branch: `
    <path class="scheme-track" d="M20 40 H110" />
    <path class="scheme-arm" d="M110 40 L168 16" />
    <path class="scheme-arm" d="M110 40 H198" style="animation-delay:0.12s" />
    <path class="scheme-arm" d="M110 40 L168 56" style="animation-delay:0.24s" />
    <path class="scheme-arm" d="M66 40 V16" style="animation-delay:0.36s" />
    <circle class="scheme-node" cx="20" cy="40" r="6" />
    <circle class="scheme-node scheme-end" cx="172" cy="14" r="4.5" />
    <circle class="scheme-node scheme-end" cx="202" cy="40" r="4.5" />
    <circle class="scheme-node scheme-end" cx="172" cy="56" r="4.5" />
    <circle class="scheme-node scheme-end" cx="66" cy="14" r="4.5" />
    <circle class="scheme-token" r="3.4" />
  `,
};

export function schemeKind(id: number): SchemeKind {
  return KIND[id] ?? 'relay';
}

export function schemeCaptionKey(kind: SchemeKind): string {
  if (kind === 'fan') return 'schemeFan';
  if (kind === 'loop') return 'schemeLoop';
  if (kind === 'pulse') return 'schemePulse';
  if (kind === 'funnel') return 'schemeFunnel';
  if (kind === 'branch') return 'schemeBranch';
  return 'schemeRelay';
}

export function caseScheme(id: number): string {
  const kind = schemeKind(id);
  return `<svg class="scheme scheme-${kind}" viewBox="0 0 240 64" aria-hidden="true">${BODY[kind]}</svg>`;
}
