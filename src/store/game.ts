// Mission progress: which level and step the player is on, and what just happened.
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LEVELS } from '../content/levels';
import { costliest, enterLevel, enterSteps, startMission, type LogEntry } from '../engine/engine';
import type { GameState, Meter, Outcome } from '../engine/types';
import { recordRun, type BoardEntry } from './leaderboard';

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
  lost: { meter: Meter; reasons: string[]; /** The one entry that cost that meter the most (A8). */ blame: LogEntry | null } | null;
  /** Everything that moved the meters in this level, in order: carry-overs on entering, then each action. */
  log: LogEntry[];
  badges: number[];
  /** True once the player has finished or skipped the opening hook. */
  seenIntro: boolean;
  /** True when the last action must be repeated (wrong checklist order). */
  retryStep: boolean;
  /** Which mission this is. Goes up by one each time a mission starts from level 1 (A9). */
  runId: number;
  /** The run already saved to the leaderboard, so a finished mission is saved once. */
  lastSavedRun: number;
  /** The best five finished missions, best first. */
  leaderboard: BoardEntry[];

  startMission: (X?: number) => void;
  beginLevel: () => void;
  act: (outcome: Outcome, opts?: { stay?: boolean; /** What the player did, for Mission Replay. */ label?: string }) => void;
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
  const level = LEVELS[levelIndex];
  const entered = enterLevel(game, level);
  const log: LogEntry[] = enterSteps(game, level).map((s) => ({ label: s.reason, delta: s.delta, living: true }));
  return { checkpoint: game, game: entered.state, entered, log, stepIndex: 0, outcome: null, lost: null, retryStep: false };
}

/** Why the mission paused: the meter, every reason from the last hit, and the entry that cost it the most. */
const pause = (meter: Meter, reasons: string[], log: LogEntry[]) => ({ meter, reasons, blame: costliest(log, meter) });

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
      log: [],
      badges: [],
      retryStep: false,
      seenIntro: false,
      runId: 0,
      lastSavedRun: -1,
      leaderboard: [],

      startMission: (X = 20) => {
        const D = DUST_CASES[Math.floor(Math.random() * DUST_CASES.length)];
        set({ levelIndex: 0, badges: [], screen: 'level', runId: get().runId + 1, ...enter(startMission(X, D), 0) });
      },
      beginLevel: () => set({ screen: 'play' }),
      act: (outcome, opts) => {
        const log = [...get().log, { label: opts?.label ?? outcome.reasons[0] ?? 'Your choice', delta: outcome.delta }];
        if (outcome.lost) {
          set({ game: outcome.state, outcome: null, log, lost: pause(outcome.lost, outcome.reasons, log), screen: 'replay' });
          return;
        }
        set({ game: outcome.state, outcome, log, retryStep: !!opts?.stay });
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
          // Mission finished: save it to the best-five board, once per run.
          set({ badges: earned, outcome: null, screen: 'success', ...recordRun(get(), game, new Date().toISOString()) });
          return;
        }
        const e = enter(game, levelIndex + 1);
        if (e.entered.lost) {
          set({ badges: earned, levelIndex: levelIndex + 1, ...e, lost: pause(e.entered.lost, e.entered.reasons, e.log), screen: 'replay' });
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
          set({ levelIndex: 0, badges: [], screen: 'level', runId: get().runId + 1, ...enter(startMission(restart.X, restart.D), 0) });
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
      // Saves from before A9 have no leaderboard or run ids: `current` supplies the defaults.
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<Store>) };
        if (!Array.isArray(merged.leaderboard)) merged.leaderboard = [];
        if (typeof merged.runId !== 'number') merged.runId = 0;
        if (typeof merged.lastSavedRun !== 'number') merged.lastSavedRun = -1;
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
