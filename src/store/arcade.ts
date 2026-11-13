// Arcade progress (best scores, daily plays, streak) and the one place a game result becomes stardust.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { EMPTY_STATS, dayKey, settle, type ArcadeStats, type GameId, type Settlement } from '../minigames/arcade/rewards';
import { useWallet } from './wallet';

interface ArcadeStore extends ArcadeStats {
  /** Record a finished game and pay the stardust into the wallet. */
  submit: (game: GameId, score: number, day?: string) => Settlement;
}

export const useArcade = create<ArcadeStore>()(
  persist(
    (set, get) => ({
      ...EMPTY_STATS,
      submit: (game, score, day = dayKey()) => {
        const { next, result } = settle(get(), game, score, day);
        set(next);
        if (result.total > 0) useWallet.getState().earn('arcade', result.total);
        return result;
      },
    }),
    {
      name: 'crewready_arcade_v1',
      storage: createJSONStorage(() =>
        typeof localStorage !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} },
      ),
      partialize: (s) => ({
        bests: s.bests,
        plays: s.plays,
        playsDay: s.playsDay,
        streak: s.streak,
        lastDay: s.lastDay,
        streakPaidDay: s.streakPaidDay,
        totalPlays: s.totalPlays,
      }),
    },
  ),
);
