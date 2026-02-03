import type { Project } from './types';

export function renderProjects(projects: Project[]): void {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    card.innerHTML = `
      <h3 class="project-name">${project.name}</h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-meta">
        <div class="project-tags">
          ${project.stack.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <a href="${project.url}" target="_blank" rel="noopener" class="project-link">
          GitHub
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}
