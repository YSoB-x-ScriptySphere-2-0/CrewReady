// Storage for Fly runner stats — BUILD_SEQUENCE.md S2 / plan.md §7 row 2

import { useWallet } from '../store/wallet';

const BEST_DIST_KEY = 'crewready_fly_best_distance';

export interface FlyStats {
  bestDistance: number;
  totalStardust: number;
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
