// Unified Player Economy & Wallet Store (BUILD_SEQUENCE.md K3 & plan.md §5.7)
// Single source of truth for Stardust (✦) and Science Stars (⭐).
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getFlyStats } from '../fly/storage';

export type StardustSource = 'fly' | 'bonus' | 'level_clear' | 'explain_card';

export interface WalletState {
  stardust: number;
  lifetimeStardust: number;
  clearedLevelBonuses: number[];
  readExplainCards: string[];
  
  /** Earn stardust from any verified game activity */
  earn: (source: StardustSource, amount: number, meta?: { levelId?: number; cardId?: string }) => number;
  
  /** Spend stardust on upgrades or equipment; returns true if successful */
  spend: (amount: number) => boolean;

  /** Reset wallet for testing or fresh profile */
  resetWallet: () => void;
}

const FLY_STARDUST_KEY = 'crewready_fly_total_stardust';

export const useWallet = create<WalletState>()(
  persist(
    (set, get) => ({
      stardust: 0,
      lifetimeStardust: 0,
      clearedLevelBonuses: [],
      readExplainCards: [],

      earn: (source: StardustSource, amount: number, meta?: { levelId?: number; cardId?: string }) => {
        const cleanAmount = Math.max(0, Math.floor(amount));
        if (cleanAmount <= 0) return 0;

        // Level clear bonus (+10 ✦) can only be earned once per level
        if (source === 'level_clear' && meta?.levelId !== undefined) {
          if (get().clearedLevelBonuses.includes(meta.levelId)) {
            return 0;
          }
          set((s) => ({
            stardust: s.stardust + cleanAmount,
            lifetimeStardust: s.lifetimeStardust + cleanAmount,
            clearedLevelBonuses: [...s.clearedLevelBonuses, meta.levelId!],
          }));
          syncFlyStorage(get().stardust);
          return cleanAmount;
        }

        // Explain card bonus (+2 ✦) can only be earned once per card
        if (source === 'explain_card' && meta?.cardId) {
          if (get().readExplainCards.includes(meta.cardId)) {
            return 0;
          }
          set((s) => ({
            stardust: s.stardust + cleanAmount,
            lifetimeStardust: s.lifetimeStardust + cleanAmount,
            readExplainCards: [...s.readExplainCards, meta.cardId!],
          }));
          syncFlyStorage(get().stardust);
          return cleanAmount;
        }

        set((s) => ({
          stardust: s.stardust + cleanAmount,
          lifetimeStardust: s.lifetimeStardust + cleanAmount,
        }));

        syncFlyStorage(get().stardust);
        return cleanAmount;
      },

      spend: (amount: number) => {
        const cleanAmount = Math.max(0, Math.floor(amount));
        if (cleanAmount <= 0) return true;
        const current = get().stardust;
        if (current < cleanAmount) return false;

        set({ stardust: current - cleanAmount });
        syncFlyStorage(get().stardust);
        return true;
      },

      resetWallet: () => {
        set({
          stardust: 0,
          lifetimeStardust: 0,
          clearedLevelBonuses: [],
          readExplainCards: [],
        });
        syncFlyStorage(0);
      },
    }),
    {
      name: 'crewready_wallet_v1',
      storage: createJSONStorage(() => (typeof localStorage !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Migrate legacy Fly storage if wallet has 0 stardust
        try {
          const flyStats = getFlyStats();
          if (state.stardust === 0 && flyStats.totalStardust > 0) {
            state.stardust = flyStats.totalStardust;
            state.lifetimeStardust = flyStats.totalStardust;
          }
        } catch {
          // ignore
        }
      },
      merge: (persistedState: unknown, currentState: WalletState): WalletState => {
        if (!persistedState || typeof persistedState !== 'object') return currentState;
        const p = persistedState as Partial<WalletState>;
        const stardust = typeof p.stardust === 'number' && !isNaN(p.stardust) ? Math.max(0, p.stardust) : 0;
        const lifetime = typeof p.lifetimeStardust === 'number' && !isNaN(p.lifetimeStardust) ? Math.max(0, p.lifetimeStardust) : stardust;
        const clearedLevelBonuses = Array.isArray(p.clearedLevelBonuses) ? p.clearedLevelBonuses.filter((x): x is number => typeof x === 'number') : [];
        const readExplainCards = Array.isArray(p.readExplainCards) ? p.readExplainCards.filter((x): x is string => typeof x === 'string') : [];

        return {
          ...currentState,
          stardust,
          lifetimeStardust: lifetime,
          clearedLevelBonuses,
          readExplainCards,
        };
      },
    }
  )
);

function syncFlyStorage(stardust: number) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(FLY_STARDUST_KEY, stardust.toString());
    }
  } catch {
    // ignore
  }
}
