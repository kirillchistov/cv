import '../editorial/editorial.css';
import './cases.css';
import { initTheme } from '../theme';
import { renderTopbar } from '../topbar';

const SVG_NS = 'http://www.w3.org/2000/svg';

// 02: small "trains" running along the main line — one per startup batch
function startTrains(): void {
  const group = document.getElementById('metroTrains');
  if (!group || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 6; i++) {
    const train = document.createElementNS(SVG_NS, 'circle');
    train.setAttribute('r', '7');
    train.setAttribute('class', 'metro-train');
    const motion = document.createElementNS(SVG_NS, 'animateMotion');
    motion.setAttribute('dur', '9s');
    motion.setAttribute('begin', `-${i * 1.5}s`); // negative: every train is already on the line
    motion.setAttribute('repeatCount', 'indefinite');
    const path = document.createElementNS(SVG_NS, 'mpath');
    path.setAttribute('href', '#metroLine');
    motion.appendChild(path);
    train.appendChild(motion);
    group.appendChild(train);
  }
}

// 03: inbox — one open letter at a time
function bindInbox(): void {
  const items = document.querySelectorAll<HTMLButtonElement>('.inbox-item');
  items.forEach((item) =>
    item.addEventListener('click', () => {
      items.forEach((other) => {
        const active = other === item;
        other.classList.toggle('is-active', active);
        other.setAttribute('aria-selected', String(active));
        const mail = document.getElementById(other.dataset.mail!);
        if (mail) {
          mail.hidden = !active;
          mail.classList.toggle('is-active', active);
        }
      });
    })
  );
}

// 04: spreadsheet — two sheets (before / after); clicking a cell shows its "formula"
function bindSheet(): void {
  const ref = document.getElementById('sheetRef');
  const formula = document.getElementById('sheetFormula');
  const cells = document.querySelectorAll<HTMLTableCellElement>('.sh-c');
  const selectCell = (cell: HTMLTableCellElement) => cell.dispatchEvent(new Event('click'));

  const tabs = document.querySelectorAll<HTMLButtonElement>('[data-sheet-tab]');
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll<HTMLTableElement>('[data-sheet]').forEach((sheet) => {
        sheet.hidden = sheet.dataset.sheet !== tab.dataset.sheetTab;
      });
      const first = document.querySelector<HTMLTableCellElement>(`[data-sheet="${tab.dataset.sheetTab}"] .sh-c`);
      if (first) selectCell(first);
    })
  );

  cells.forEach((cell) => {
    cell.tabIndex = 0;
    const select = () => {
      cells.forEach((c) => c.classList.toggle('is-active', c === cell));
      const row = (cell.parentElement as HTMLTableRowElement).querySelector('th')?.textContent ?? '';
      const col = String.fromCharCode(64 + cell.cellIndex);
      if (ref) ref.textContent = `${col}${row}`;
      if (formula) formula.textContent = cell.dataset.f ?? '';
    };
    cell.addEventListener('click', select);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        select();
      }
    });
  });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

renderTopbar(['theme', 'roadmap', 'tailor', 'cv']);
initTheme();
startTrains();
bindInbox();
bindSheet();
document.getElementById('w98Ok')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
