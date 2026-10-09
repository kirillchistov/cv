import './roadmap.css';
import { initTheme } from '../theme';
import { renderTopbar } from '../topbar';
import { projects } from '../projects';
import {
  TOTAL_WEEKS,
  bets,
  criteria,
  integrations,
  skills,
  stages,
  type Bet,
  type Scores,
  type Skill,
  type SkillId,
  type Stage,
} from './data';
import { renderRadar } from './radar';
import { clearState, loadState, saveState, type RoadmapState } from './store';

type Readiness = 'strong' | 'partial' | 'gap';

const READINESS_LABEL: Record<Readiness, string> = {
  strong: 'Strength',
  partial: 'Stretch',
  gap: 'Gap',
};

let state: RoadmapState = loadState();

const $ = <T extends HTMLElement = HTMLElement>(id: string) =>
  document.getElementById(id) as T | null;

// ---------- derived values ----------

function skillLevel(skill: Skill): { current: number; target: number } {
  return state.skills[skill.id] ?? { current: skill.current, target: skill.target };
}

function readiness(id: SkillId): Readiness {
  const skill = skills.find((s) => s.id === id)!;
  const { current, target } = skillLevel(skill);
  const gap = target - current;
  if (gap <= 0) return 'strong';
  if (gap <= 2) return 'partial';
  return 'gap';
}

function betScores(bet: Bet): Scores {
  return state.bets[bet.id] ?? bet.scores;
}

function betTotal(bet: Bet): number {
  return Object.values(betScores(bet)).reduce((a, b) => a + b, 0);
}

function stageProgress(stage: Stage): { done: number; total: number } {
  const done = stage.tasks.filter((t) => state.done[t.id]).length;
  return { done, total: stage.tasks.length };
}

function overallProgress(): { done: number; total: number } {
  return stages.reduce(
    (acc, s) => {
      const p = stageProgress(s);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
}

function sortedGaps(): Skill[] {
  return [...skills]
    .map((s) => ({ s, gap: skillLevel(s).target - skillLevel(s).current }))
    .filter((x) => x.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .map((x) => x.s);
}

function persist(): void {
  saveState(state);
}

// ---------- hero ----------

function renderHero(): void {
  const { done, total } = overallProgress();
  const pct = total ? Math.round((done / total) * 100) : 0;

  const ring = $('progressRing');
  if (ring) ring.style.setProperty('--pct', String(pct));
  const pctEl = $('progressPct');
  if (pctEl) pctEl.textContent = `${pct}%`;
  const countEl = $('progressCount');
  if (countEl) countEl.textContent = `${done} of ${total} steps done`;

  const gap = sortedGaps()[0];
  const gapEl = $('biggestGap');
  if (gapEl) gapEl.textContent = gap ? gap.label : 'None, nice work';

  const nextEl = $('nextStep');
  if (nextEl) {
    const stage = stages.find((s) => s.tasks.some((t) => !state.done[t.id]));
    const task = stage?.tasks.find((t) => !state.done[t.id]);
    nextEl.innerHTML = stage && task
      ? `<button type="button" class="rm-link" data-goto-stage="${stage.id}">${stage.title}</button>: ${task.text}`
      : 'All steps checked. Time to pick the next game.';
  }
}

// ---------- skills ----------

function renderSkillRows(): void {
  const list = $('skillRows');
  if (!list) return;

  list.innerHTML = skills
    .map((skill) => {
      const { current, target } = skillLevel(skill);
      return `
      <div class="rm-skill">
        <div class="rm-skill-head">
          <span class="rm-skill-name">${skill.label}</span>
          <span class="rm-chip" data-chip-for="${skill.id}"></span>
          <output class="rm-skill-value" data-skill-value="${skill.id}">${current}/${target}</output>
        </div>
        <div class="rm-skill-slider">
          <input type="range" min="0" max="10" step="1" value="${current}"
            data-skill-input="${skill.id}" aria-label="${skill.label}: current level (target ${target})" />
          <span class="rm-skill-target" style="--t:${target}" title="Target ${target}"></span>
        </div>
        <details class="rm-skill-more">
          <summary>Evidence &amp; how to close it</summary>
          <div class="rm-skill-body">
            <div>
              <h4 class="rm-mini-title">Evidence in the CV</h4>
              <ul class="rm-list">${skill.evidence.map((e) => `<li>${e}</li>`).join('')}</ul>
            </div>
            <div>
              <h4 class="rm-mini-title">How to close it</h4>
              <ul class="rm-list">${skill.close.map((e) => `<li>${e}</li>`).join('')}</ul>
            </div>
          </div>
        </details>
      </div>`;
    })
    .join('');
}

function updateSkillViews(): void {
  const radar = $('radar');
  if (radar) {
    radar.innerHTML = renderRadar(
      skills.map((s) => ({ label: s.short, ...skillLevel(s) }))
    );
  }

  skills.forEach((skill) => {
    const r = readiness(skill.id);
    document.querySelectorAll<HTMLElement>(`[data-chip-for="${skill.id}"]`).forEach((chip) => {
      chip.className = `rm-chip rm-chip-${r}`;
      chip.textContent = READINESS_LABEL[r];
    });
    const { current, target } = skillLevel(skill);
    const out = document.querySelector(`[data-skill-value="${skill.id}"]`);
    if (out) out.textContent = `${current}/${target}`;
  });

  const gapList = $('gapList');
  if (gapList) {
    const gaps = sortedGaps().slice(0, 3);
    gapList.innerHTML = gaps.length
      ? gaps
          .map((s) => {
            const { current, target } = skillLevel(s);
            const where = stages.filter((st) => st.skills.includes(s.id)).map((st) => st.title);
            return `<li><strong>${s.label}</strong> <span class="rm-muted">(+${target - current})</span>
              <div class="rm-muted rm-small">Needed in: ${where.join(' · ')}</div></li>`;
          })
          .join('')
      : '<li>No gaps left by your own estimate.</li>';
  }

  renderHero();
  renderStageDetail();
}

// ---------- stages ----------

function renderTimeline(): void {
  const gantt = $('gantt');
  if (gantt) {
    const months = [0, 3, 6, 9, 12, 15, 18];
    gantt.innerHTML = `
      <div class="rm-gantt-axis">
        ${months
          .map((m) => `<span style="left:${((m * 4.33) / TOTAL_WEEKS) * 100}%">${m === 0 ? 'Start' : `M${m}`}</span>`)
          .join('')}
      </div>
      ${stages
        .map((stage, i) => {
          const left = (stage.startWeek / TOTAL_WEEKS) * 100;
          const width = Math.max(((stage.endWeek - stage.startWeek) / TOTAL_WEEKS) * 100, 3);
          const { done, total } = stageProgress(stage);
          const active = stage.id === state.activeStage ? ' is-active' : '';
          return `
          <div class="rm-gantt-row">
            <span class="rm-gantt-label">${i}. ${stage.title}</span>
            <div class="rm-gantt-track">
              <button type="button" class="rm-gantt-bar${active}" data-stage="${stage.id}"
                style="left:${left}%;width:${width}%;--fill:${total ? (done / total) * 100 : 0}%"
                title="${stage.title}: ${stage.window}" aria-label="${stage.title}, ${stage.window}">
              </button>
            </div>
          </div>`;
        })
        .join('')}`;
  }

  const stepper = $('stepper');
  if (stepper) {
    stepper.innerHTML = stages
      .map((stage, i) => {
        const { done, total } = stageProgress(stage);
        const complete = done === total ? ' is-complete' : '';
        const active = stage.id === state.activeStage ? ' is-active' : '';
        return `
        <button type="button" class="rm-step${active}${complete}" data-stage="${stage.id}" role="tab"
          aria-selected="${stage.id === state.activeStage}">
          <span class="rm-step-num">${done === total ? '✓' : i}</span>
          <span class="rm-step-text">
            <span class="rm-step-title">${stage.title}</span>
            <span class="rm-step-meta">${stage.window} · ${done}/${total}</span>
          </span>
        </button>`;
      })
      .join('');

    // keep the active step visible without scrolling the page
    const active = stepper.querySelector<HTMLElement>('.rm-step.is-active');
    if (active) stepper.scrollLeft = active.offsetLeft - stepper.offsetLeft - 8;
  }
}

function renderStageDetail(): void {
  const el = $('stageDetail');
  if (!el) return;
  const index = stages.findIndex((s) => s.id === state.activeStage);
  const stage = stages[index] ?? stages[0];
  const related = integrations.filter((x) => x.stageId === stage.id);

  el.innerHTML = `
    <div class="rm-detail-head">
      <div>
        <p class="rm-eyebrow">Stage ${index} · ${stage.window}</p>
        <h3 class="rm-detail-title">${stage.title}</h3>
        <p class="rm-detail-goal">${stage.goal}</p>
      </div>
      <div class="rm-detail-nav">
        <button type="button" class="btn-secondary" data-stage-step="-1" ${index <= 0 ? 'disabled' : ''} aria-label="Previous stage">←</button>
        <button type="button" class="btn-secondary" data-stage-step="1" ${index >= stages.length - 1 ? 'disabled' : ''} aria-label="Next stage">→</button>
      </div>
    </div>

    <div class="rm-detail-grid">
      <section class="rm-panel">
        <h4 class="rm-mini-title">Checklist</h4>
        <ul class="rm-tasks">
          ${stage.tasks
            .map(
              (t) => `
            <li>
              <label class="rm-task">
                <input type="checkbox" data-task="${t.id}" ${state.done[t.id] ? 'checked' : ''} />
                <span>${t.text}</span>
              </label>
            </li>`
            )
            .join('')}
        </ul>
        <h4 class="rm-mini-title">Exit criteria</h4>
        <ul class="rm-list rm-exit">${stage.exit.map((e) => `<li>${e}</li>`).join('')}</ul>
      </section>

      <section class="rm-panel">
        <h4 class="rm-mini-title">Your unfair advantage here</h4>
        <ul class="rm-list">${stage.advantage.map((a) => `<li>${a}</li>`).join('')}</ul>

        <h4 class="rm-mini-title">Skills in play</h4>
        <div class="rm-chips">
          ${stage.skills
            .map((id) => {
              const s = skills.find((x) => x.id === id)!;
              return `<span class="rm-skill-pill"><span class="rm-dot" data-chip-for="${id}"></span>${s.label}</span>`;
            })
            .join('')}
        </div>

        <h4 class="rm-mini-title">Tooling</h4>
        <div class="rm-chips">${stage.tools.map((t) => `<span class="rm-tag">${t}</span>`).join('')}</div>

        <div class="rm-hook">
          <h4 class="rm-mini-title">Build it into the CV</h4>
          <p>${stage.cvHook}</p>
          ${
            related.length
              ? `<p class="rm-small rm-muted">See: ${related
                  .map((r) => `<a href="#int-${r.id}" class="rm-link">${r.title}</a>`)
                  .join(', ')}</p>`
              : ''
          }
        </div>
      </section>
    </div>`;

  // the dots above were just created — paint their readiness
  stage.skills.forEach((id) => {
    const r = readiness(id);
    el.querySelectorAll<HTMLElement>(`[data-chip-for="${id}"]`).forEach((dot) => {
      dot.className = `rm-dot rm-dot-${r}`;
      dot.title = READINESS_LABEL[r];
    });
  });
}

function selectStage(id: string, scroll = false): void {
  if (!stages.some((s) => s.id === id)) return;
  state.activeStage = id;
  persist();
  renderTimeline();
  renderStageDetail();
  if (scroll) $('stageDetail')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------- bets ----------

function projectLinks(urls: string[]): string {
  if (!urls.length) return '<span class="rm-muted rm-small">New idea, not in the portfolio yet</span>';
  return urls
    .map((url) => {
      const p = projects.find((x) => x.url === url);
      return `<a href="${url}" target="_blank" rel="noopener" class="rm-tag rm-tag-link">${p ? p.name : url} ↗</a>`;
    })
    .join('');
}

function renderBets(): void {
  const el = $('bets');
  if (!el) return;
  const ranked = [...bets].sort((a, b) => betTotal(b) - betTotal(a));
  const max = criteria.length * 5;

  el.innerHTML = ranked
    .map((bet, rank) => {
      const scores = betScores(bet);
      const total = betTotal(bet);
      return `
      <article class="rm-bet${rank === 0 ? ' is-top' : ''}">
        <div class="rm-bet-head">
          <span class="rm-bet-rank">#${rank + 1}</span>
          <h3 class="rm-bet-title">${bet.title}</h3>
          <span class="rm-bet-total" data-bet-total="${bet.id}">${total}<small>/${max}</small></span>
        </div>
        <div class="rm-bet-bar"><span data-bet-bar="${bet.id}" style="width:${(total / max) * 100}%"></span></div>
        <p class="rm-bet-thesis">${bet.thesis}</p>
        <p class="rm-small"><strong>First paid offer:</strong> ${bet.firstOffer}</p>
        <div class="rm-bet-scores">
          ${criteria
            .map(
              (c) => `
            <label class="rm-score" title="${c.hint}">
              <span>${c.label}</span>
              <input type="range" min="1" max="5" step="1" value="${scores[c.id]}"
                data-bet="${bet.id}" data-criterion="${c.id}" aria-label="${bet.title}: ${c.label}" />
              <output data-score-out="${bet.id}-${c.id}">${scores[c.id]}</output>
            </label>`
            )
            .join('')}
        </div>
        <div class="rm-chips">${projectLinks(bet.projectUrls)}</div>
      </article>`;
    })
    .join('');
}

// ---------- integrations ----------

function renderIntegrations(): void {
  const el = $('integrations');
  if (!el) return;
  el.innerHTML = integrations
    .map((item) => {
      const stageIndex = stages.findIndex((s) => s.id === item.stageId);
      const stage = stages[stageIndex];
      return `
      <article class="rm-int${item.done ? ' is-done' : ''}" id="int-${item.id}">
        <div class="rm-int-head">
          <h3 class="rm-int-title">${item.done ? '✓ ' : ''}${item.title}</h3>
          <span class="rm-effort rm-effort-${item.effort}" title="Effort">${item.effort}</span>
        </div>
        <p class="rm-int-why">${item.why}</p>
        <div class="rm-int-foot">
          <code class="rm-files">${item.files.join(' · ')}</code>
          <button type="button" class="rm-link" data-goto-stage="${item.stageId}">
            Stage ${stageIndex}: ${stage?.title ?? ''}
          </button>
        </div>
      </article>`;
    })
    .join('');
}

// ---------- events ----------

function bindEvents(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const stageBtn = target.closest<HTMLElement>('[data-stage]');
    if (stageBtn?.dataset.stage) {
      selectStage(stageBtn.dataset.stage);
      return;
    }

    const stepBtn = target.closest<HTMLElement>('[data-stage-step]');
    if (stepBtn) {
      const i = stages.findIndex((s) => s.id === state.activeStage);
      const next = stages[i + Number(stepBtn.dataset.stageStep)];
      if (next) selectStage(next.id);
      return;
    }

    const goto = target.closest<HTMLElement>('[data-goto-stage]');
    if (goto?.dataset.gotoStage) {
      selectStage(goto.dataset.gotoStage, true);
    }
  });

  document.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;

    if (input.dataset.task) {
      state.done[input.dataset.task] = input.checked;
      persist();
      renderTimeline();
      renderHero();
    }

    // re-rank only on release so cards don't jump mid-drag
    if (input.dataset.bet) renderBets();
  });

  document.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;

    const skillId = input.dataset.skillInput as SkillId | undefined;
    if (skillId) {
      const skill = skills.find((s) => s.id === skillId)!;
      state.skills[skillId] = { current: Number(input.value), target: skillLevel(skill).target };
      persist();
      updateSkillViews();
      return;
    }

    const betId = input.dataset.bet;
    const crit = input.dataset.criterion as keyof Scores | undefined;
    if (betId && crit) {
      const bet = bets.find((b) => b.id === betId)!;
      state.bets[betId] = { ...betScores(bet), [crit]: Number(input.value) };
      persist();
      const total = betTotal(bet);
      const max = criteria.length * 5;
      const out = document.querySelector(`[data-score-out="${betId}-${crit}"]`);
      if (out) out.textContent = input.value;
      const totalEl = document.querySelector(`[data-bet-total="${betId}"]`);
      if (totalEl) totalEl.innerHTML = `${total}<small>/${max}</small>`;
      const bar = document.querySelector<HTMLElement>(`[data-bet-bar="${betId}"]`);
      if (bar) bar.style.width = `${(total / max) * 100}%`;
    }
  });

  $('resetBtn')?.addEventListener('click', () => {
    if (!confirm('Reset checklist, skill estimates and bet scores to defaults?')) return;
    state = clearState();
    renderAll();
  });
}

function renderAll(): void {
  renderSkillRows();
  renderTimeline();
  renderBets();
  renderIntegrations();
  updateSkillViews(); // also renders hero + stage detail
}

const yearEl = $('year');
if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

renderTopbar(['theme', 'reset', 'roadmap', 'tailor', 'cv'], 'roadmap');
initTheme();
bindEvents();
renderAll();
