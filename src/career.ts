const REDUCE = '(prefers-reduced-motion: reduce)';

export function initCareer(): void {
  const root = document.querySelector<HTMLElement>('.career');
  if (!root) return;

  const settle = () => root.classList.add('is-settled');
  if (window.matchMedia(REDUCE).matches) {
    settle();
    return;
  }

  root.classList.add('is-armed');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      root.classList.add('is-played');
      observer.disconnect();
      window.setTimeout(settle, 2300);
    },
    { threshold: 0.22 },
  );
  observer.observe(root);
}
