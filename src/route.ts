const REDUCE = '(prefers-reduced-motion: reduce)';

export function initRoute(): void {
  const root = document.querySelector<HTMLElement>('#route');
  if (!root) return;
  if (window.matchMedia(REDUCE).matches) {
    root.classList.add('is-played');
    return;
  }

  root.classList.add('is-armed');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      root.classList.add('is-played');
      observer.disconnect();
    },
    { threshold: 0.15 },
  );
  observer.observe(root);
}
