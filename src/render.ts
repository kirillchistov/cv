import type { Project } from './types';

function getGithubUrl(url: string): string {
  const githubMatch = url.match(/github\.com\/kirillchistov\/([^/?#]+)/);
  if (githubMatch) {
    return `https://github.com/kirillchistov/${githubMatch[1]}`;
  }

  const pagesMatch = url.match(/kirillchistov\.github\.io\/([^/?#]+)/);
  if (pagesMatch) {
    return `https://github.com/kirillchistov/${pagesMatch[1]}`;
  }

  return url;
}

export function renderProjects(projects: Project[]): void {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = 'project-card';

    card.innerHTML = `
      <h3 class="project-name">
        <a href="${project.url}" target="_blank" rel="noopener">${project.name}</a>
      </h3>
      <p class="project-desc">${project.description}</p>
      <div class="project-meta">
        <div class="project-tags">
          ${project.stack.map((tag) => `<span class="project-tag">${tag}</span>`).join('')}
        </div>
        <a href="${getGithubUrl(project.url)}" target="_blank" rel="noopener" class="project-link">
          GitHub
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}
