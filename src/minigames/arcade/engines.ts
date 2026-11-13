// Pure rules for the five Space Arcade games. No timers, no React, no Math.random: every function takes an
// injected rng so the games are deterministic in tests. Tested in engines.test.ts.

export type Rng = () => number;

/** Small seeded generator (mulberry32). */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ==========================================================
// 1. Star Match: memory cards (the flip-back is explicit, so a mismatch is never stuck face-up)
// ==========================================================
export const MATCH_SYMBOLS = ['🪐', '🚀', '🌙', '☄️', '🛰️', '👩‍🚀'] as const;

export interface MatchCard {
  id: number;
  symbol: string;
  faceUp: boolean;
  matched: boolean;
}
export interface MatchState {
  cards: MatchCard[];
  /** Ids of the face-up, not-yet-matched cards (0, 1 or 2). */
  picks: number[];
  moves: number;
  pairs: number;
  total: number;
  /** True while a mismatched pair is showing. Call resolveMismatch to flip them back. */
  locked: boolean;
}

export function initMatch(rng: Rng): MatchState {
  const deck = shuffle(
    MATCH_SYMBOLS.flatMap((symbol) => [symbol, symbol]),
    rng,
  );
  return {
    cards: deck.map((symbol, id) => ({ id, symbol, faceUp: false, matched: false })),
    picks: [],
    moves: 0,
    pairs: 0,
    total: MATCH_SYMBOLS.length,
    locked: false,
  };
}

export function flipMatch(state: MatchState, id: number): MatchState {
  const card = state.cards.find((c) => c.id === id);
  if (!card || state.locked || card.faceUp || card.matched) return state;
  const cards = state.cards.map((c) => (c.id === id ? { ...c, faceUp: true } : c));
  const picks = [...state.picks, id];
  if (picks.length < 2) return { ...state, cards, picks };

  const [a, b] = picks.map((pid) => cards.find((c) => c.id === pid)!);
  if (a.symbol === b.symbol) {
    return {
      ...state,
      cards: cards.map((c) => (c.id === a.id || c.id === b.id ? { ...c, matched: true } : c)),
      picks: [],
      moves: state.moves + 1,
      pairs: state.pairs + 1,
    };
  }
  return { ...state, cards, picks, moves: state.moves + 1, locked: true };
}

export function resolveMismatch(state: MatchState): MatchState {
  if (!state.locked) return state;
  return {
    ...state,
    cards: state.cards.map((c) => (state.picks.includes(c.id) ? { ...c, faceUp: false } : c)),
    picks: [],
    locked: false,
  };
}

export const isMatchDone = (s: MatchState) => s.pairs >= s.total;

/** 20 points per pair, plus up to 40 for finishing with few extra moves. */
export function matchScore(s: MatchState): number {
  const bonus = isMatchDone(s) ? Math.max(0, 40 - Math.max(0, s.moves - s.total) * 4) : 0;
  return s.pairs * 20 + bonus;
}

// ==========================================================
// 2. Asteroid Blaster: shooter
// ==========================================================
export type RockKind = 'rock' | 'fast' | 'gold' | 'satellite';
export interface Rock {
  id: number;
  x: number; // 8..92 (%)
  y: number; // 0..100 (%), 100 is the Earth line
  vy: number; // % per second
  kind: RockKind;
}
export interface BlasterState {
  rocks: Rock[];
  score: number;
  lives: number;
  combo: number;
  nextId: number;
  time: number;
  spawnIn: number;
}

export const ROCK_POINTS: Record<RockKind, number> = { rock: 10, fast: 20, gold: 50, satellite: 0 };

export function initBlaster(): BlasterState {
  return { rocks: [], score: 0, lives: 3, combo: 0, nextId: 1, time: 0, spawnIn: 0.4 };
}

function pickKind(rng: Rng): RockKind {
  const r = rng();
  if (r < 0.08) return 'gold';
  if (r < 0.2) return 'satellite';
  if (r < 0.42) return 'fast';
  return 'rock';
}

export function tickBlaster(state: BlasterState, dt: number, rng: Rng): BlasterState {
  if (state.lives <= 0) return state;
  let { lives, combo, nextId, spawnIn } = state;
  const time = state.time + dt;
  const rocks: Rock[] = [];
  for (const r of state.rocks) {
    const y = r.y + r.vy * dt;
    if (y >= 100) {
      // A friendly satellite reaching Earth is fine; a rock reaching it is a hit.
      if (r.kind !== 'satellite' && r.kind !== 'gold') {
        lives -= 1;
        combo = 0;
      }
      continue;
    }
    rocks.push({ ...r, y });
  }
  spawnIn -= dt;
  if (spawnIn <= 0) {
    const kind = pickKind(rng);
    const base = kind === 'fast' ? 34 : kind === 'gold' ? 30 : 20;
    rocks.push({
      id: nextId++,
      x: 8 + rng() * 84,
      y: -4,
      vy: base + Math.min(14, time * 0.35),
      kind,
    });
    spawnIn = Math.max(0.35, 0.95 - time * 0.012);
  }
  return { ...state, rocks, lives, combo, nextId, time, spawnIn };
}

export function shootRock(state: BlasterState, id: number): BlasterState {
  const rock = state.rocks.find((r) => r.id === id);
  if (!rock || state.lives <= 0) return state;
  const rocks = state.rocks.filter((r) => r.id !== id);
  if (rock.kind === 'satellite') {
    // Do not shoot the friendly satellites.
    return { ...state, rocks, lives: state.lives - 1, combo: 0 };
  }
  const mult = 1 + Math.floor(state.combo / 5);
  return { ...state, rocks, score: state.score + ROCK_POINTS[rock.kind] * mult, combo: state.combo + 1 };
}

export const isBlasterOver = (s: BlasterState) => s.lives <= 0;

// ==========================================================
// 3. Signal Focus: go / no-go attention game
// ==========================================================
export type FocusTrial = 'go' | 'nogo';
export interface FocusState {
  trials: FocusTrial[];
  index: number;
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejects: number;
  streak: number;
  bestStreak: number;
}

export function initFocus(rng: Rng, length = 30): FocusState {
  const trials: FocusTrial[] = [];
  for (let i = 0; i < length; i++) {
    // Never more than two no-go in a row so it stays fair.
    const last2 = trials.slice(-2);
    const forceGo = last2.length === 2 && last2.every((t) => t === 'nogo');
    trials.push(!forceGo && rng() < 0.3 ? 'nogo' : 'go');
  }
  return { trials, index: 0, hits: 0, misses: 0, falseAlarms: 0, correctRejects: 0, streak: 0, bestStreak: 0 };
}

/** Record the player's answer for the current trial. tapped=false means the signal timed out untouched. */
export function answerFocus(s: FocusState, tapped: boolean): { state: FocusState; correct: boolean } {
  const trial = s.trials[s.index];
  if (!trial) return { state: s, correct: false };
  const correct = (trial === 'go') === tapped;
  const streak = correct ? s.streak + 1 : 0;
  return {
    correct,
    state: {
      ...s,
      index: s.index + 1,
      hits: s.hits + (trial === 'go' && tapped ? 1 : 0),
      misses: s.misses + (trial === 'go' && !tapped ? 1 : 0),
      falseAlarms: s.falseAlarms + (trial === 'nogo' && tapped ? 1 : 0),
      correctRejects: s.correctRejects + (trial === 'nogo' && !tapped ? 1 : 0),
      streak,
      bestStreak: Math.max(s.bestStreak, streak),
    },
  };
}

export const isFocusDone = (s: FocusState) => s.index >= s.trials.length;

export function focusScore(s: FocusState): number {
  const raw = s.hits * 4 + s.correctRejects * 6 + s.bestStreak * 2 - s.falseAlarms * 6 - s.misses * 2;
  return Math.max(0, raw);
}

/** How long (ms) each signal stays up: it gets quicker as the run goes on. */
export function focusWindowMs(index: number): number {
  return Math.max(550, 1100 - index * 18);
}

// ==========================================================
// 4. Gem Swap: match-3
// ==========================================================
export const GEM_SIZE = 6;
export const GEM_KINDS = 5; // 0 planet, 1 star, 2 moon, 3 comet, 4 rocket
export type GemBoard = number[][];
export interface Cell {
  r: number;
  c: number;
}

export function findMatches(board: GemBoard): Set<string> {
  const out = new Set<string>();
  const n = board.length;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const v = board[r][c];
      if (v < 0) continue;
      if (c + 2 < n && board[r][c + 1] === v && board[r][c + 2] === v) {
        let k = c;
        while (k < n && board[r][k] === v) out.add(`${r},${k++}`);
      }
      if (r + 2 < n && board[r + 1][c] === v && board[r + 2][c] === v) {
        let k = r;
        while (k < n && board[k][c] === v) out.add(`${k++},${c}`);
      }
    }
  }
  return out;
}

function swapped(board: GemBoard, a: Cell, b: Cell): GemBoard {
  const next = board.map((row) => [...row]);
  [next[a.r][a.c], next[b.r][b.c]] = [next[b.r][b.c], next[a.r][a.c]];
  return next;
}

export const areAdjacent = (a: Cell, b: Cell) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;

export function hasMove(board: GemBoard): boolean {
  const n = board.length;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      for (const d of [
        { r: 0, c: 1 },
        { r: 1, c: 0 },
      ]) {
        const b = { r: r + d.r, c: c + d.c };
        if (b.r < n && b.c < n && findMatches(swapped(board, { r, c }, b)).size > 0) return true;
      }
    }
  }
  return false;
}

export function initGems(rng: Rng, size = GEM_SIZE): GemBoard {
  for (let attempt = 0; attempt < 50; attempt++) {
    const board: GemBoard = [];
    for (let r = 0; r < size; r++) {
      board.push([]);
      for (let c = 0; c < size; c++) {
        let v = Math.floor(rng() * GEM_KINDS);
        // Re-roll while this gem would complete a line of three.
        while (
          (c >= 2 && board[r][c - 1] === v && board[r][c - 2] === v) ||
          (r >= 2 && board[r - 1][c] === v && board[r - 2][c] === v)
        ) {
          v = (v + 1) % GEM_KINDS;
        }
        board[r].push(v);
      }
    }
    if (hasMove(board)) return board;
  }
  return Array.from({ length: size }, (_, r) => Array.from({ length: size }, (_, c) => (r + c * 2) % GEM_KINDS));
}

export interface SwapResult {
  board: GemBoard;
  valid: boolean;
  cleared: number;
  cascades: number;
  points: number;
}

/** Swap two neighbouring gems. A swap that makes no match is rejected (board unchanged). */
export function trySwap(board: GemBoard, a: Cell, b: Cell, rng: Rng): SwapResult {
  const invalid: SwapResult = { board, valid: false, cleared: 0, cascades: 0, points: 0 };
  if (!areAdjacent(a, b)) return invalid;
  let cur = swapped(board, a, b);
  let matches = findMatches(cur);
  if (matches.size === 0) return invalid;

  let cleared = 0;
  let cascades = 0;
  let points = 0;
  const n = cur.length;
  while (matches.size > 0) {
    cascades += 1;
    cleared += matches.size;
    points += matches.size * 10 * cascades;
    for (const key of matches) {
      const [r, c] = key.split(',').map(Number);
      cur[r][c] = -1;
    }
    for (let c = 0; c < n; c++) {
      const col: number[] = [];
      for (let r = n - 1; r >= 0; r--) if (cur[r][c] >= 0) col.push(cur[r][c]);
      while (col.length < n) col.push(Math.floor(rng() * GEM_KINDS));
      for (let r = n - 1, i = 0; r >= 0; r--, i++) cur[r][c] = col[i];
    }
    matches = findMatches(cur);
  }
  if (!hasMove(cur)) cur = initGems(rng, n); // no moves left: fresh board
  return { board: cur, valid: true, cleared, cascades, points };
}

// ==========================================================
// 5. Cosmic Merge: 2048 with planets. Tiles hold an exponent (0 = empty, 1 = 2, 2 = 4, ...)
// ==========================================================
export const MERGE_SIZE = 4;
export const MERGE_NAMES = ['', 'Dust', 'Moon', 'Mars', 'Earth', 'Neptune', 'Saturn', 'Jupiter', 'Sun', 'Pulsar', 'Galaxy', 'Cosmos'];
export type MergeBoard = number[][];
export type Dir = 'left' | 'right' | 'up' | 'down';

function addTile(board: MergeBoard, rng: Rng): MergeBoard {
  const empty: Cell[] = [];
  board.forEach((row, r) => row.forEach((v, c) => v === 0 && empty.push({ r, c })));
  if (!empty.length) return board;
  const cell = empty[Math.floor(rng() * empty.length)];
  const next = board.map((row) => [...row]);
  next[cell.r][cell.c] = rng() < 0.9 ? 1 : 2;
  return next;
}

export function initMerge(rng: Rng): MergeBoard {
  const blank: MergeBoard = Array.from({ length: MERGE_SIZE }, () => Array(MERGE_SIZE).fill(0));
  return addTile(addTile(blank, rng), rng);
}

function slideRow(row: number[]): { row: number[]; gain: number } {
  const tiles = row.filter((v) => v > 0);
  const out: number[] = [];
  let gain = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      out.push(tiles[i] + 1);
      gain += 2 ** (tiles[i] + 1);
      i++;
    } else out.push(tiles[i]);
  }
  while (out.length < row.length) out.push(0);
  return { row: out, gain };
}

export function moveMerge(board: MergeBoard, dir: Dir, rng: Rng): { board: MergeBoard; gain: number; moved: boolean } {
  const n = board.length;
  const get = (i: number, j: number) => (dir === 'left' ? board[i][j] : dir === 'right' ? board[i][n - 1 - j] : dir === 'up' ? board[j][i] : board[n - 1 - j][i]);
  const next: MergeBoard = Array.from({ length: n }, () => Array(n).fill(0));
  let gain = 0;
  for (let i = 0; i < n; i++) {
    const line = Array.from({ length: n }, (_, j) => get(i, j));
    const res = slideRow(line);
    gain += res.gain;
    for (let j = 0; j < n; j++) {
      if (dir === 'left') next[i][j] = res.row[j];
      else if (dir === 'right') next[i][n - 1 - j] = res.row[j];
      else if (dir === 'up') next[j][i] = res.row[j];
      else next[n - 1 - j][i] = res.row[j];
    }
  }
  const moved = next.some((row, r) => row.some((v, c) => v !== board[r][c]));
  return moved ? { board: addTile(next, rng), gain, moved } : { board, gain: 0, moved: false };
}

export function canMoveMerge(board: MergeBoard): boolean {
  const rng = () => 0;
  return (['left', 'right', 'up', 'down'] as Dir[]).some((d) => moveMerge(board, d, rng).moved);
}

export const highestTile = (board: MergeBoard) => Math.max(0, ...board.flat());
