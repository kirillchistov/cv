import type { Scores, SkillId } from './data';

const STORAGE_KEY = 'kch-roadmap-v1';

export interface RoadmapState {
  done: Record<string, boolean>;
  skills: Partial<Record<SkillId, { current: number; target: number }>>;
  bets: Record<string, Scores>;
  activeStage: string;
}

const empty = (): RoadmapState => ({ done: {}, skills: {}, bets: {}, activeStage: 's0' });

// localStorage can be unavailable (private mode, blocked storage) — the page
// must still work, it just won't remember anything.
export function loadState(): RoadmapState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch {
    return empty();
  }
}

export function saveState(state: RoadmapState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

export function clearState(): RoadmapState {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  return empty();
}
