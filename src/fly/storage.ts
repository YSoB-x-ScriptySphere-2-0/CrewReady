// Storage for Fly runner stats — BUILD_SEQUENCE.md S2 / plan.md §7 row 2

import { useWallet } from '../store/wallet';

export const BEST_DIST_KEY = 'crewready_fly_best_distance';
export const FLY_RUNS_KEY = 'crewready_fly_runs';
export const FLY_BOARD_SIZE = 5;

export interface FlyStats {
  bestDistance: number;
  totalStardust: number;
}

export interface FlyRunEntry {
  distance: number;
  stardust: number;
  at: string;
}

export function getFlyLeaderboard(): FlyRunEntry[] {
  try {
    if (typeof localStorage === 'undefined') return [];
    const raw = localStorage.getItem(FLY_RUNS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Fallback: If best distance exists but no run list was recorded yet
    const distStr = localStorage.getItem(BEST_DIST_KEY);
    const bestDist = distStr ? Math.max(0, parseInt(distStr, 10) || 0) : 0;
    if (bestDist > 0) {
      return [{ distance: bestDist, stardust: 0, at: new Date().toISOString() }];
    }
    return [];
  } catch {
    return [];
  }
}

export function recordFlyRun(entry: FlyRunEntry): FlyRunEntry[] {
  let current: FlyRunEntry[] = [];
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(FLY_RUNS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) current = parsed;
      }
    }
  } catch {
    current = [];
  }

  const updated = [...current, entry]
    .sort((a, b) => b.distance - a.distance || b.stardust - a.stardust || a.at.localeCompare(b.at))
    .slice(0, FLY_BOARD_SIZE);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(FLY_RUNS_KEY, JSON.stringify(updated));
    }
  } catch {
    // Ignore storage quota
  }
  return updated;
}

export function getFlyStats(): FlyStats {
  try {
    if (typeof localStorage === 'undefined') {
      return { bestDistance: 0, totalStardust: useWallet.getState().stardust };
    }
    const distStr = localStorage.getItem(BEST_DIST_KEY);
    return {
      bestDistance: distStr ? Math.max(0, parseInt(distStr, 10) || 0) : 0,
      // The wallet is the single balance for every game (Fly, arcade, bonus rounds, hints, upgrades).
      totalStardust: useWallet.getState().stardust,
    };
  } catch {
    return { bestDistance: 0, totalStardust: 0 };
  }
}

export function recordRunEnd(distance: number, earnedStardust: number): { isNewBest: boolean; stats: FlyStats } {
  const current = getFlyStats();
  const roundedDist = Math.floor(distance);
  const isNewBest = roundedDist > current.bestDistance;
  const newBest = isNewBest ? roundedDist : current.bestDistance;
  useWallet.getState().earn('fly', earnedStardust);
  const newTotal = useWallet.getState().stardust;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BEST_DIST_KEY, newBest.toString());
    }
  } catch {
    // Ignore storage quota
  }

  if (roundedDist > 0) {
    recordFlyRun({
      distance: roundedDist,
      stardust: Math.floor(earnedStardust),
      at: new Date().toISOString(),
    });
  }

  return {
    isNewBest,
    stats: {
      bestDistance: newBest,
      totalStardust: newTotal,
    },
  };
}

export function spendStardust(amount: number): boolean {
  return useWallet.getState().spend(amount);
}
