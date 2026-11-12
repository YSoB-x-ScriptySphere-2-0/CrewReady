// The Space Book: which Space Words the player has collected (saved), and which word card is open.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { wordById } from '../content/words';
import { safeStorage } from './game';

interface WordStore {
  collected: string[];
  /** The word whose card is showing now, and whether this tap collected it. */
  open: { id: string; isNew: boolean } | null;
  show: (id: string) => void;
  close: () => void;
  reset: () => void;
}

export const useWords = create<WordStore>()(
  persist(
    (set, get) => ({
      collected: [],
      open: null,
      show: (id) => {
        if (!wordById(id)) return;
        const isNew = !get().collected.includes(id);
        set({ open: { id, isNew }, collected: isNew ? [...get().collected, id] : get().collected });
      },
      close: () => set({ open: null }),
      reset: () => set({ collected: [], open: null }),
    }),
    { name: 'crewready_words', version: 1, storage: createJSONStorage(() => safeStorage), partialize: (s) => ({ collected: s.collected }) as WordStore },
  ),
);
