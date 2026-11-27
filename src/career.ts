const REDUCE = '(prefers-reduced-motion: reduce)';

function placeRail(root: HTMLElement): void {
  const rail = root.querySelector<HTMLElement>('.career-rail');
  const dots = [...root.querySelectorAll<HTMLElement>('.career-dot')];
  if (!rail || dots.length < 2) return;

  for (const dot of dots) {
    const job = dot.parentElement;
    const title = job?.querySelector<HTMLElement>('.job-title');
    if (!job || !title) continue;
    const jobBox = job.getBoundingClientRect();
    const titleBox = title.getBoundingClientRect();
    const mid = titleBox.top + titleBox.height / 2 - jobBox.top;
    dot.style.top = `${mid - dot.offsetHeight / 2}px`;
  }

  const rootBox = root.getBoundingClientRect();
  const first = dots[0].getBoundingClientRect();
  const last = dots[dots.length - 1].getBoundingClientRect();
  const firstMid = first.top + first.height / 2 - rootBox.top;
  const lastMid = last.top + last.height / 2 - rootBox.top;
  const centerX = first.left + first.width / 2 - rootBox.left;
  const railWidth = rail.offsetWidth || 4;
  rail.style.left = `${centerX - railWidth / 2}px`;
  rail.style.top = `${firstMid}px`;
  rail.style.height = `${Math.max(0, lastMid - firstMid)}px`;
  rail.style.bottom = 'auto';
}

function watchPulse(root: HTMLElement): void {
  const train = root.querySelector<HTMLElement>('.career-train');
  const jobs = [...root.querySelectorAll<HTMLElement>('.job')];
  if (!train || jobs.length === 0) return;

  const tick = () => {
    if (!root.classList.contains('is-played')) {
      requestAnimationFrame(tick);
      return;
    }
    const opacity = Number.parseFloat(getComputedStyle(train).opacity);
    const trainBox = train.getBoundingClientRect();
    const trainY = trainBox.top + trainBox.height / 2;
    if (opacity < 0.25) {
      for (const job of jobs) job.classList.remove('is-hot', 'is-lit');
      requestAnimationFrame(tick);
      return;
    }

    let active = 0;
    let best = Number.POSITIVE_INFINITY;
    const centers = jobs.map((job) => {
      const dot = job.querySelector<HTMLElement>('.career-dot');
      const box = dot?.getBoundingClientRect();
      return box ? box.top + box.height / 2 : 0;
    });
    centers.forEach((y, index) => {
      const distance = Math.abs(y - trainY);
      if (distance < best) {
        best = distance;
        active = index;
      }
    });
    jobs.forEach((job, index) => {
      job.classList.toggle('is-hot', index === active);
      job.classList.toggle('is-lit', trainY < centers[index] - 20 && index !== active);
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initCareer(): void {
  const root = document.querySelector<HTMLElement>('.career');
  if (!root) return;

  const align = () => placeRail(root);
  align();
  window.addEventListener('resize', align);
  document.addEventListener('langchange', () => requestAnimationFrame(align));

  if (window.matchMedia(REDUCE).matches) {
    root.classList.add('is-played');
    return;
  }

  watchPulse(root);
  root.classList.add('is-armed');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      root.classList.add('is-played');
      observer.disconnect();
    },
    { threshold: 0.18 },
  );
  observer.observe(root);
}
