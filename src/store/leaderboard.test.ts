import { describe, expect, it } from 'vitest';
import { startMission } from '../engine/engine';
import { addToBoard, recordRun, type BoardEntry } from './leaderboard';

const e = (result: BoardEntry['result'], stars: number, healthy: number, at: string): BoardEntry => ({ result, stars, healthy, at });

describe('best-five leaderboard', () => {
  it('sorts by result, then stars, then healthy systems, then the earlier run', () => {
    let b: BoardEntry[] = [];
    b = addToBoard(b, e('stable', 9, 2, '2026-11-12T10:00:00.000Z'));
    b = addToBoard(b, e('thriving', 6, 4, '2026-11-12T11:00:00.000Z'));
    b = addToBoard(b, e('stable', 9, 3, '2026-11-12T12:00:00.000Z'));
    b = addToBoard(b, e('survives', 12, 1, '2026-11-12T09:00:00.000Z'));
    b = addToBoard(b, e('stable', 9, 3, '2026-11-12T08:00:00.000Z'));
    expect(b.map((x) => [x.result, x.stars, x.healthy, x.at.slice(11, 13)])).toEqual([
      ['thriving', 6, 4, '11'],
      ['stable', 9, 3, '08'], // same score: the earlier one first
      ['stable', 9, 3, '12'],
      ['stable', 9, 2, '10'],
      ['survives', 12, 1, '09'], // more stars can't beat a better result
    ]);
  });

  it('keeps only the best five', () => {
    let b: BoardEntry[] = [];
    for (let i = 0; i < 8; i++) b = addToBoard(b, e('stable', i, 3, `2026-11-12T0${i}:00:00.000Z`));
    expect(b).toHaveLength(5);
    expect(b.map((x) => x.stars)).toEqual([7, 6, 5, 4, 3]);
    // a worse run does not get in
    expect(addToBoard(b, e('survives', 20, 0, '2026-11-13T00:00:00.000Z'))).toEqual(b);
  });

  it('does not change the board it was given', () => {
    const b = [e('stable', 4, 3, '2026-11-12T00:00:00.000Z')];
    addToBoard(b, e('thriving', 6, 4, '2026-11-12T01:00:00.000Z'));
    expect(b).toHaveLength(1);
  });

  it('saves a finished mission once, however often it is recorded', () => {
    const game = { ...startMission(), stars: 7, meters: { P: 33, L: 31, F: 31, S: 33 } };
    let s = { leaderboard: [] as BoardEntry[], runId: 3, lastSavedRun: -1 };
    s = { ...s, ...recordRun(s, game, '2026-11-12T10:00:00.000Z') };
    expect(s.leaderboard).toEqual([{ result: 'thriving', stars: 7, healthy: 4, at: '2026-11-12T10:00:00.000Z', run: 3 }]);
    expect(s.lastSavedRun).toBe(3);
    // a reload or a second call for the same run adds nothing
    s = { ...s, ...recordRun(s, game, '2026-11-12T10:05:00.000Z') };
    s = { ...s, ...recordRun(s, game, '2026-11-12T10:06:00.000Z') };
    expect(s.leaderboard).toHaveLength(1);
    // the next mission gets a new run id and is saved
    s = { ...s, runId: 4, ...recordRun({ ...s, runId: 4 }, game, '2026-11-12T11:00:00.000Z') };
    expect(s.leaderboard).toHaveLength(2);
    expect(s.lastSavedRun).toBe(4);
  });
});
