import { initTheme } from './theme';
import { initLanguage } from './language';
import { initForm } from './form';
import { renderCatalog } from './catalog/render';
import { initCareer } from './career';
import { initRoute } from './route';
import { renderTopbar } from './topbar';

// Год в футере
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

// PDF кнопка
function handlePdfClick(): void {
  window.print();
}

renderTopbar(['theme', 'lang', 'pdf', 'tailor', 'contact'], 'cv');

['pdfButton', 'pdfButtonBottom'].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', handlePdfClick);
});

// Инициализация модулей
renderCatalog();
initCareer();
initRoute();
initTheme();
initLanguage();
initForm();
