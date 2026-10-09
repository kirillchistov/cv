import { initTheme } from './theme';
import { initLanguage } from './language';
import { initForm } from './form';
import { renderTopbar } from './topbar';
import { renderProjects } from './render';
import { projects } from './projects';

// Год в футере
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// PDF кнопка
function handlePdfClick(): void {
  window.print();
}

renderTopbar(['theme', 'lang', 'pdf', 'roadmap', 'tailor', 'contact'], 'cv');

['pdfButton', 'pdfButtonBottom'].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', handlePdfClick);
});

// Инициализация модулей
initTheme();
initLanguage();
initForm();
renderProjects(projects);
