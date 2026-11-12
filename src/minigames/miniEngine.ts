// Pure Rules and State Machines for the 6 Level Bonus Mini-Games (plan.md §5.6 & BUILD_SEQUENCE.md K5)
// Fully deterministic, pure functions, zero side-effects, tested in miniEngine.test.ts.

export const MAX_BONUS_STARDUST = 30;

// ==========================================
// 1. Level 1: Countdown (Timing)
// ==========================================
export interface CountdownState {
  step: 3 | 2 | 1 | 0; // 3 -> 2 -> 1 -> 0 (Lift-off)
  needle: number; // 0 to 100
  direction: 1 | -1;
  greenMin: number;
  greenMax: number;
  score: number; // 0 to 3
}

export function initCountdown(): CountdownState {
  return {
    step: 3,
    needle: 0,
    direction: 1,
    greenMin: 40,
    greenMax: 60,
    score: 0,
  };
}

export function tickCountdown(state: CountdownState, speed = 2.5): CountdownState {
  if (state.step === 0) return state;
  let nextNeedle = state.needle + state.direction * speed;
  let nextDir = state.direction;
  if (nextNeedle >= 100) {
    nextNeedle = 100;
    nextDir = -1;
  } else if (nextNeedle <= 0) {
    nextNeedle = 0;
    nextDir = 1;
  }
  return { ...state, needle: nextNeedle, direction: nextDir };
}

export function tapCountdown(state: CountdownState): { state: CountdownState; hit: boolean } {
  if (state.step === 0) return { state, hit: false };
  const hit = state.needle >= state.greenMin && state.needle <= state.greenMax;
  const nextStep = (state.step - 1) as 3 | 2 | 1 | 0;
  const nextScore = hit ? state.score + 1 : state.score;
  return {
    state: {
      ...state,
      step: nextStep,
      score: nextScore,
      // Move green zone slightly for each step to make it playful
      greenMin: nextStep === 2 ? 35 : nextStep === 1 ? 45 : 40,
      greenMax: nextStep === 2 ? 55 : nextStep === 1 ? 65 : 60,
    },
    hit,
  };
}

// ==========================================
// 2. Level 2: Space Rock Zapper
// ==========================================
export interface RockTarget {
  id: number;
  x: number; // 10 to 90 %
  y: number; // 10 to 90 %
  size: number;
  points: number;
  ttl: number; // ticks before despawn
}

export interface ZapperState {
  rocks: RockTarget[];
  score: number;
  nextId: number;
}

export function initZapper(): ZapperState {
  return {
    rocks: [],
    score: 0,
    nextId: 1,
  };
}

export function spawnRock(state: ZapperState, x: number, y: number, size = 48, points = 3): ZapperState {
  const rock: RockTarget = {
    id: state.nextId,
    x: Math.min(90, Math.max(10, x)),
    y: Math.min(85, Math.max(15, y)),
    size,
    points,
    ttl: 30, // ~3 seconds at 10 ticks/sec
  };
  return {
    ...state,
    nextId: state.nextId + 1,
    rocks: [...state.rocks, rock],
  };
}

export function tickZapper(state: ZapperState): ZapperState {
  const alive = state.rocks
    .map((r) => ({ ...r, ttl: r.ttl - 1 }))
    .filter((r) => r.ttl > 0);
  return { ...state, rocks: alive };
}

export function zapRock(state: ZapperState, id: number): { state: ZapperState; pointsEarned: number } {
  const target = state.rocks.find((r) => r.id === id);
  if (!target) return { state, pointsEarned: 0 };
  return {
    state: {
      ...state,
      score: state.score + target.points,
      rocks: state.rocks.filter((r) => r.id !== id),
    },
    pointsEarned: target.points,
  };
}

// ==========================================
// 3. Level 3: Air Leak Patrol
// ==========================================
export interface LeakNode {
  id: number;
  slotIndex: number; // 0 to 8 (3x3 grid)
  ttl: number;
}

export interface LeakState {
  leaks: LeakNode[];
  sealedCount: number;
  nextId: number;
}

export function initLeakPatrol(): LeakState {
  return {
    leaks: [],
    sealedCount: 0,
    nextId: 1,
  };
}

export function spawnLeak(state: LeakState, slotIndex: number): LeakState {
  if (state.leaks.some((l) => l.slotIndex === slotIndex)) return state;
  const leak: LeakNode = {
    id: state.nextId,
    slotIndex,
    ttl: 25,
  };
  return {
    ...state,
    nextId: state.nextId + 1,
    leaks: [...state.leaks, leak],
  };
}

export function sealLeak(state: LeakState, id: number): { state: LeakState; sealed: boolean } {
  const exists = state.leaks.some((l) => l.id === id);
  if (!exists) return { state, sealed: false };
  return {
    state: {
      ...state,
      sealedCount: state.sealedCount + 1,
      leaks: state.leaks.filter((l) => l.id !== id),
    },
    sealed: true,
  };
}

export function tickLeakPatrol(state: LeakState): LeakState {
  return {
    ...state,
    leaks: state.leaks
      .map((l) => ({ ...l, ttl: l.ttl - 1 }))
      .filter((l) => l.ttl > 0),
  };
}

// ==========================================
// 4. Level 4: Solar Panel Wiper
// ==========================================
export interface PanelWipeState {
  panels: number[]; // 4 panels, clean percent 0 to 100
  wipesDone: number;
}

export function initPanelWipe(): PanelWipeState {
  return {
    panels: [0, 0, 0, 0],
    wipesDone: 0,
  };
}

export function wipePanel(state: PanelWipeState, panelIndex: number, amount = 25): PanelWipeState {
  if (panelIndex < 0 || panelIndex >= state.panels.length) return state;
  const current = state.panels[panelIndex];
  if (current >= 100) return state;
  const updated = Math.min(100, current + amount);
  const newPanels = [...state.panels];
  newPanels[panelIndex] = updated;
  return {
    ...state,
    panels: newPanels,
    wipesDone: state.wipesDone + 1,
  };
}

export function isAllPanelsClean(state: PanelWipeState): boolean {
  return state.panels.every((p) => p >= 100);
}

// ==========================================
// 5. Level 5: Seed & Plant Matcher
// ==========================================
export interface MatchCard {
  id: number;
  pairKey: string; // 'wheat' | 'tomato' | 'lettuce' | 'berry'
  kind: 'seed' | 'crop';
  revealed: boolean;
  matched: boolean;
}

export interface SeedMatchState {
  cards: MatchCard[];
  selectedId: number | null;
  matchedPairs: number;
}

export function initSeedMatch(): SeedMatchState {
  const pairs = ['lettuce', 'tomato', 'wheat', 'potato'];
  const cards: MatchCard[] = [];
  let id = 1;
  pairs.forEach((key) => {
    cards.push({ id: id++, pairKey: key, kind: 'seed', revealed: false, matched: false });
    cards.push({ id: id++, pairKey: key, kind: 'crop', revealed: false, matched: false });
  });

  // Pre-shuffled in deterministic pattern
  const shuffled = [...cards].sort((a, b) => (a.id * 7) % 11 - (b.id * 7) % 11);

  return {
    cards: shuffled,
    selectedId: null,
    matchedPairs: 0,
  };
}

export function flipCard(state: SeedMatchState, cardId: number): { state: SeedMatchState; isMatch?: boolean } {
  const card = state.cards.find((c) => c.id === cardId);
  if (!card || card.revealed || card.matched) return { state };

  // First pick
  if (state.selectedId === null) {
    const cards = state.cards.map((c) => (c.id === cardId ? { ...c, revealed: true } : c));
    return {
      state: { ...state, cards, selectedId: cardId },
    };
  }

  // Second pick
  const firstCard = state.cards.find((c) => c.id === state.selectedId);
  if (!firstCard) return { state: { ...state, selectedId: null } };

  if (firstCard.pairKey === card.pairKey && firstCard.id !== card.id) {
    // MATCH!
    const cards = state.cards.map((c) =>
      c.id === firstCard.id || c.id === card.id
        ? { ...c, revealed: true, matched: true }
        : c
    );
    return {
      state: {
        ...state,
        cards,
        selectedId: null,
        matchedPairs: state.matchedPairs + 1,
      },
      isMatch: true,
    };
  }

  // NO MATCH
  const cards = state.cards.map((c) => (c.id === cardId ? { ...c, revealed: true } : c));
  return {
    state: { ...state, cards, selectedId: null },
    isMatch: false,
  };
}

// ==========================================
// 6. Level 6: Jezero Rock Sorter
// ==========================================
export type ShapeSymbol = 'circle' | 'triangle' | 'star' | 'diamond';

export interface RockSample {
  id: number;
  shape: ShapeSymbol;
  colorName: string;
}

export interface RockSorterState {
  currentRock: RockSample | null;
  targetCanisters: ShapeSymbol[];
  sortedCount: number;
  nextId: number;
}

export function initRockSorter(): RockSorterState {
  const shapes: ShapeSymbol[] = ['circle', 'triangle', 'star', 'diamond'];
  return {
    currentRock: { id: 1, shape: 'circle', colorName: 'emerald' },
    targetCanisters: shapes,
    sortedCount: 0,
    nextId: 2,
  };
}

export function sortRock(state: RockSorterState, chosenShape: ShapeSymbol): { state: RockSorterState; correct: boolean } {
  if (!state.currentRock) return { state, correct: false };
  const correct = state.currentRock.shape === chosenShape;
  const shapes: ShapeSymbol[] = ['circle', 'triangle', 'star', 'diamond'];
  const nextShape = shapes[(state.nextId * 3) % shapes.length];

  return {
    state: {
      ...state,
      sortedCount: correct ? state.sortedCount + 1 : state.sortedCount,
      currentRock: {
        id: state.nextId,
        shape: nextShape,
        colorName: nextShape === 'circle' ? 'emerald' : nextShape === 'triangle' ? 'amber' : nextShape === 'star' ? 'cyan' : 'rose',
      },
      nextId: state.nextId + 1,
    },
    correct,
  };
}

// ==========================================
// Stardust Reward Calculator (Capped at 30 ✦)
// ==========================================
export function calculateStardustReward(levelId: number, score: number): number {
  let earned = 0;
  switch (levelId) {
    case 1:
      // Countdown: 3 hits = 30 ✦, 2 = 20 ✦, 1 = 10 ✦
      earned = score * 10;
      break;
    case 2:
      // Zapper: 10 rocks = 30 ✦
      earned = Math.min(30, Math.floor(score * 1.5));
      break;
    case 3:
      // Leak patrol: 6 leaks sealed = 30 ✦
      earned = Math.min(30, score * 5);
      break;
    case 4:
      // Panel wipe: 4 clean panels = 30 ✦
      earned = Math.min(30, Math.floor(score * 7.5));
      break;
    case 5:
      // Seed match: 4 pairs = 30 ✦
      earned = Math.min(30, score * 7.5);
      break;
    case 6:
      // Rock sorter: 6 correct rocks = 30 ✦
      earned = Math.min(30, score * 5);
      break;
    default:
      earned = Math.min(30, score * 5);
  }
  return Math.min(MAX_BONUS_STARDUST, Math.max(0, Math.floor(earned)));
}
