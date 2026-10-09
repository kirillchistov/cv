// Inline line icons (24×24, stroke = currentColor) so they follow the theme.
// Drawn after the reference icons: PDF file with a download arrow, a route
// between two pins, and a head with a gear inside a cycle of arrows.

const svg = (body: string, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${body}</svg>`;

export const icons = {
  pdf: svg(`
    <path d="M6 9V4.5A1.5 1.5 0 0 1 7.5 3H14l4 4v13.5a1.5 1.5 0 0 1-1.5 1.5H11" />
    <path d="M14 3v4h4" />
    <rect x="8.6" y="9.2" width="13" height="6.4" rx="1.4" />
    <text x="15.1" y="14.15" font-size="5.2" font-weight="800" font-family="system-ui, sans-serif"
      text-anchor="middle" fill="currentColor" stroke="none" letter-spacing="-.2">PDF</text>
    <path d="M5 12v8M2.5 17.5 5 20l2.5-2.5" />`),

  roadmap: svg(`
    <path d="M17.5 2.5a3 3 0 0 0-3 3c0 2.2 3 5 3 5s3-2.8 3-5a3 3 0 0 0-3-3z" />
    <circle cx="17.5" cy="5.5" r=".9" />
    <path d="M6.5 11.5a3 3 0 0 0-3 3c0 2.2 3 5 3 5s3-2.8 3-5a3 3 0 0 0-3-3z" />
    <circle cx="6.5" cy="14.5" r=".9" />
    <path d="M17.5 10.5c0 1.5-2 1.5-5 1.5-2 0-2 3 1 3s5 1 3.5 3.5c-.8 1.3-3.5 2-6.5 1.8" />`),

  tailor: svg(
    `<path d="M5 9a7.5 7.5 0 0 1 6-5.4M13 3.6a7.5 7.5 0 0 1 6 5.4M19 15a7.5 7.5 0 0 1-6 5.4M11 20.4A7.5 7.5 0 0 1 5 15"
      stroke="url(#tailorGrad)" />
    <path d="M9.6 2.6 11 3.6l-1 1.4M14.4 21.4 13 20.4l1-1.4" stroke="url(#tailorGrad)" />
    <path d="M9.2 16.5v-1.8a4.2 4.2 0 1 1 5.3-.3v1.2" />
    <circle cx="11.8" cy="10.6" r="1.4" />
    <path d="M11.8 8.2v.9M11.8 12.1v.9M9.4 10.6h.9M13.3 10.6h.9" />
    <defs><linearGradient id="tailorGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#a855f7" /><stop offset=".5" stop-color="#22c55e" /><stop offset="1" stop-color="#06b6d4" />
    </linearGradient></defs>`
  ),

  mail: svg(`<rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" />`),

  cv: svg(`
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <circle cx="12" cy="9" r="2.5" />
    <path d="M8 16.5c.8-1.8 2.2-2.6 4-2.6s3.2.8 4 2.6" />`),

  reset: svg(`<path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.5h4.5" />`),
};
