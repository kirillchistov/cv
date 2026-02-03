import { initTheme } from './theme';
import { initLanguage } from './language';
import { initForm } from './form';
import { initMobileMenu } from './mobile-menu';
import { renderProjects } from './render';
import { projects } from './projects';

// Год в футере
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// PDF кнопка
function handlePdfClick(): void {
  window.print();
}

['pdfButton', 'pdfButtonBottom', 'pdfButtonMobile'].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', handlePdfClick);
});

// Инициализация модулей
initTheme();
initLanguage();
initForm();
initMobileMenu();
renderProjects(projects);
