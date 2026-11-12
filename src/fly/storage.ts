// Storage for Fly runner stats — BUILD_SEQUENCE.md S2 / plan.md §7 row 2

const BEST_DIST_KEY = 'crewready_fly_best_distance';
const TOTAL_STARDUST_KEY = 'crewready_fly_total_stardust';

export interface FlyStats {
  bestDistance: number;
  totalStardust: number;
}

export function getFlyStats(): FlyStats {
  try {
    if (typeof localStorage === 'undefined') {
      return { bestDistance: 0, totalStardust: 0 };
    }
    const distStr = localStorage.getItem(BEST_DIST_KEY);
    const dustStr = localStorage.getItem(TOTAL_STARDUST_KEY);
    return {
      bestDistance: distStr ? Math.max(0, parseInt(distStr, 10) || 0) : 0,
      totalStardust: dustStr ? Math.max(0, parseInt(dustStr, 10) || 0) : 0,
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
  const newTotal = current.totalStardust + Math.max(0, earnedStardust);

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(BEST_DIST_KEY, newBest.toString());
      localStorage.setItem(TOTAL_STARDUST_KEY, newTotal.toString());
    }
  } catch {
    // Ignore storage quota
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
  const current = getFlyStats();
  if (current.totalStardust < amount) return false;
  const updated = current.totalStardust - amount;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOTAL_STARDUST_KEY, updated.toString());
    }
  } catch {
    return false;
  }
  return true;
}
