// Best-five leaderboard (A9). Pure helpers: no React, no storage. The store saves each finished
// mission once, keyed by its run id, so reloading or re-rendering Success never saves it twice.
import { outpostCheck } from '../engine/engine';
import type { GameState, OutpostResult } from '../engine/types';

export interface BoardEntry {
  stars: number;
  result: OutpostResult;
  /** How many of the four systems were healthy (30 or more). */
  healthy: number;
  /** When the mission finished, as an ISO date string. */
  at: string;
  /** Which mission this was, so Success can highlight this run. */
  run?: number;
}

export const BOARD_SIZE = 5;
const RANK: Record<OutpostResult, number> = { thriving: 3, stable: 2, survives: 1 };

/** Best first: result, then stars, then healthy systems, then the earlier run. */
export function compareEntries(a: BoardEntry, b: BoardEntry): number {
  return RANK[b.result] - RANK[a.result] || b.stars - a.stars || b.healthy - a.healthy || a.at.localeCompare(b.at);
}

/** A new board with `entry` added, sorted best first, cut to five. Never changes `board`. */
export function addToBoard(board: readonly BoardEntry[], entry: BoardEntry): BoardEntry[] {
  return [...board, entry].sort(compareEntries).slice(0, BOARD_SIZE);
}

/** The board entry for a finished mission. */
export function entryFor(game: GameState, run: number, at: string): BoardEntry {
  const { healthy, result } = outpostCheck(game);
  return { stars: game.stars, result, healthy: healthy.length, at, run };
}

/**
 * Save run `runId` once. If it was already saved (`lastSavedRun === runId`) nothing changes,
 * so the same finished mission can never fill the board twice.
 */
export function recordRun(
  s: { leaderboard: readonly BoardEntry[]; runId: number; lastSavedRun: number },
  game: GameState,
  at: string,
): { leaderboard: BoardEntry[]; lastSavedRun: number } {
  if (s.lastSavedRun === s.runId) return { leaderboard: [...s.leaderboard], lastSavedRun: s.lastSavedRun };
  return { leaderboard: addToBoard(s.leaderboard, entryFor(game, s.runId, at)), lastSavedRun: s.runId };
}
