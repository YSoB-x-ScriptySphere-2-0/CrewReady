// Mission progress: which level and step the player is on, and what just happened.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LEVELS } from '../content/levels';
import { enterLevel, startMission } from '../engine/engine';
import type { GameState, Meter, Outcome } from '../engine/types';

/** Every place in the app. No router: the store holds which one is showing. */
export type Screen =
  | 'hook'
  | 'story'
  | 'home'
  | 'map'
  | 'level'
  | 'play'
  | 'replay'
  | 'success'
  | 'quickrun'
  | 'resources'
  | 'profile'
  | 'training'
  | 'sources';
/** Screens that exist so far. Buttons that lead elsewhere show as locked until their step is built. */
export const BUILT_SCREENS: ReadonlySet<Screen> = new Set<Screen>(['hook', 'story', 'home', 'map', 'level', 'play', 'replay', 'success']);
const DUST_CASES = [5, 15, 25];

interface Store {
  screen: Screen;
  levelIndex: number;
  stepIndex: number;
  game: GameState;
  /** State before the current level began — Mission Replay restarts from here. */
  checkpoint: GameState;
  /** What happened on entering the level (living costs, consequences). */
  entered: Outcome | null;
  /** Result of the last action, shown until the player taps Next. */
  outcome: Outcome | null;
  lost: { meter: Meter; reasons: string[] } | null;
  badges: number[];
  /** True once the player has finished or skipped the opening hook. */
  seenIntro: boolean;
  /** True when the last action must be repeated (wrong checklist order). */
  retryStep: boolean;

  startMission: (X?: number) => void;
  beginLevel: () => void;
  act: (outcome: Outcome, opts?: { stay?: boolean }) => void;
  next: () => void;
  retryLevel: () => void;
  goHome: () => void;
  go: (screen: Screen) => void;
  /** Leave the hook (finished or skipped) and never auto-play it again. */
  leaveIntro: (to: Screen) => void;
}

/** A mission has been started and not yet finished. */
export const missionInProgress = (s: { entered: Outcome | null; badges: number[] }) => s.entered !== null && s.badges.length < LEVELS.length;

function enter(game: GameState, levelIndex: number) {
  const entered = enterLevel(game, LEVELS[levelIndex]);
  return { checkpoint: game, game: entered.state, entered, stepIndex: 0, outcome: null, lost: null, retryStep: false };
}

export const useGame = create<Store>()(
  persist(
    (set, get) => ({
      screen: 'hook',
      levelIndex: 0,
      stepIndex: 0,
      game: startMission(),
      checkpoint: startMission(),
      entered: null,
      outcome: null,
      lost: null,
      badges: [],
      retryStep: false,
      seenIntro: false,

      startMission: (X = 20) => {
        const D = DUST_CASES[Math.floor(Math.random() * DUST_CASES.length)];
        set({ levelIndex: 0, badges: [], screen: 'level', ...enter(startMission(X, D), 0) });
      },
      beginLevel: () => set({ screen: 'play' }),
      act: (outcome, opts) => {
        if (outcome.lost) {
          set({ game: outcome.state, outcome: null, lost: { meter: outcome.lost, reasons: outcome.reasons }, screen: 'replay' });
          return;
        }
        set({ game: outcome.state, outcome, retryStep: !!opts?.stay });
      },
      next: () => {
        const { levelIndex, stepIndex, game, badges, retryStep } = get();
        const level = LEVELS[levelIndex];
        if (retryStep) {
          set({ outcome: null, retryStep: false }); // wrong checklist order: same step again
          return;
        }
        if (stepIndex + 1 < level.steps.length) {
          set({ stepIndex: stepIndex + 1, outcome: null });
          return;
        }
        const earned = badges.includes(level.id) ? badges : [...badges, level.id];
        if (levelIndex + 1 >= LEVELS.length) {
          set({ badges: earned, outcome: null, screen: 'success' });
          return;
        }
        const e = enter(game, levelIndex + 1);
        if (e.entered.lost) {
          set({ badges: earned, levelIndex: levelIndex + 1, ...e, lost: { meter: e.entered.lost, reasons: e.entered.reasons }, screen: 'replay' });
          return;
        }
        set({ badges: earned, levelIndex: levelIndex + 1, screen: 'level', ...e });
      },
      retryLevel: () => {
        const { checkpoint, levelIndex, game } = get();
        // Stars are kept; meters go back to what the player entered the level with.
        const restart = { ...checkpoint, stars: Math.max(checkpoint.stars, game.stars) };
        const e = enter(restart, levelIndex);
        if (e.entered.lost) {
          // Arrived with too little to survive even the living costs: the mission starts over.
          set({ levelIndex: 0, badges: [], screen: 'level', ...enter(startMission(restart.X, restart.D), 0) });
          return;
        }
        set({ screen: 'level', ...e });
      },
      goHome: () => set({ screen: 'home' }),
      go: (screen) => set({ screen: BUILT_SCREENS.has(screen) ? screen : 'home' }),
      leaveIntro: (to) => set({ seenIntro: true, screen: BUILT_SCREENS.has(to) ? to : 'home' }),
    }),
    {
      name: 'crewready_v1_mission',
      version: 2,
      // First launch (no save, or a save from before the hook existed) opens the hook.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<Store>) };
        if (!merged.seenIntro) merged.screen = 'hook';
        return merged;
      },
      // v1 called the level opening 'story'; that name now means the intro story cards.
      migrate: (old, version) => {
        const s = old as Partial<Store>;
        if (version < 2 && (s.screen as string) === 'story') s.screen = 'level';
        return s as Store;
      },
    },
  ),
);
