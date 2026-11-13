import { describe, expect, it } from 'vitest';
import {
  answerFocus, canMoveMerge, findMatches, flipMatch, focusScore, hasMove, initBlaster, initFocus, initGems, initMatch,
  initMerge, isMatchDone, makeRng, matchScore, moveMerge, resolveMismatch, shootRock, tickBlaster, trySwap, type Rock,
} from './engines';
import { EMPTY_STATS, FEATURED_BONUS, baseStardust, featuredGame, settle } from './rewards';

describe('Star Match', () => {
  it('deals 6 pairs', () => {
    const s = initMatch(makeRng(1));
    expect(s.cards).toHaveLength(12);
    const counts = new Map<string, number>();
    s.cards.forEach((c) => counts.set(c.symbol, (counts.get(c.symbol) ?? 0) + 1));
    expect([...counts.values()].every((n) => n === 2)).toBe(true);
  });
  it('flips a mismatch back after resolve, and locks input meanwhile', () => {
    let s = initMatch(makeRng(2));
    const a = s.cards[0];
    const b = s.cards.find((c) => c.symbol !== a.symbol)!;
    s = flipMatch(s, a.id);
    s = flipMatch(s, b.id);
    expect(s.locked).toBe(true);
    const third = s.cards.find((c) => !c.faceUp)!;
    expect(flipMatch(s, third.id)).toBe(s);
    s = resolveMismatch(s);
    expect(s.cards.every((c) => !c.faceUp)).toBe(true);
    expect(s.locked).toBe(false);
    expect(s.moves).toBe(1);
  });
  it('keeps a matched pair and finishes', () => {
    let s = initMatch(makeRng(3));
    for (const sym of new Set(s.cards.map((c) => c.symbol))) {
      for (const c of s.cards.filter((x) => x.symbol === sym)) s = flipMatch(s, c.id);
    }
    expect(isMatchDone(s)).toBe(true);
    expect(matchScore(s)).toBe(6 * 20 + 40);
  });
});

describe('Asteroid Blaster', () => {
  const rock = (kind: Rock['kind'], y = 50): Rock => ({ id: 1, x: 50, y, vy: 20, kind });
  it('scores rocks, with a combo multiplier', () => {
    const s = shootRock({ ...initBlaster(), rocks: [rock('rock')], combo: 5 }, 1);
    expect(s.score).toBe(20);
  });
  it('costs a life to shoot a satellite or let a rock land', () => {
    const shot = shootRock({ ...initBlaster(), rocks: [rock('satellite')] }, 1);
    expect(shot.lives).toBe(2);
    const landed = tickBlaster({ ...initBlaster(), rocks: [rock('rock', 99)], spawnIn: 9 }, 1, makeRng(1));
    expect(landed.lives).toBe(2);
  });
  it('spawns rocks over time', () => {
    let s = initBlaster();
    const rng = makeRng(4);
    for (let i = 0; i < 40; i++) s = tickBlaster(s, 0.1, rng);
    expect(s.rocks.length + (3 - s.lives)).toBeGreaterThan(0);
  });
});

describe('Signal Focus', () => {
  it('rewards correct answers and punishes false alarms', () => {
    let s = initFocus(makeRng(5), 10);
    while (s.index < s.trials.length) s = answerFocus(s, s.trials[s.index] === 'go').state;
    expect(s.falseAlarms + s.misses).toBe(0);
    let bad = initFocus(makeRng(5), 10);
    while (bad.index < bad.trials.length) bad = answerFocus(bad, true).state;
    expect(focusScore(bad)).toBeLessThan(focusScore(s));
  });
});

describe('Gem Swap', () => {
  it('starts with no matches and at least one move', () => {
    const b = initGems(makeRng(6));
    expect(findMatches(b).size).toBe(0);
    expect(hasMove(b)).toBe(true);
  });
  it('rejects a swap that makes no match', () => {
    const b = [
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 0, 1],
      [1, 0, 1, 0],
    ];
    const r = trySwap(b, { r: 0, c: 0 }, { r: 0, c: 1 }, makeRng(1));
    expect(r.valid).toBe(false);
    expect(r.board).toBe(b);
  });
  it('clears a valid match, refills and scores', () => {
    const b = [
      [1, 1, 2, 1],
      [3, 4, 1, 3],
      [2, 3, 4, 2],
      [4, 2, 3, 4],
    ];
    const r = trySwap(b, { r: 0, c: 2 }, { r: 1, c: 2 }, makeRng(7));
    expect(r.valid).toBe(true);
    expect(r.cleared).toBeGreaterThanOrEqual(3);
    expect(r.points).toBeGreaterThanOrEqual(30);
    expect(r.board.flat().every((v) => v >= 0 && v < 5)).toBe(true);
  });
});

describe('Cosmic Merge', () => {
  it('merges equal planets once per move and adds a tile', () => {
    const b = [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const r = moveMerge(b, 'left', makeRng(1));
    expect(r.board[0].slice(0, 2)).toEqual([2, 2]);
    expect(r.gain).toBe(8);
    expect(r.board.flat().filter(Boolean).length).toBe(3);
  });
  it('ignores a move that changes nothing', () => {
    const stuck = [
      [1, 2, 1, 2],
      [2, 1, 2, 1],
      [1, 2, 1, 2],
      [2, 1, 2, 1],
    ];
    expect(canMoveMerge(stuck)).toBe(false);
    expect(moveMerge(stuck, 'up', makeRng(1)).moved).toBe(false);
    expect(canMoveMerge(initMerge(makeRng(2)))).toBe(true);
  });
});

describe('arcade rewards', () => {
  const day = '2026-11-13';
  it('pays nothing for a zero score and caps the base', () => {
    expect(baseStardust('blaster', 0)).toBe(0);
    expect(baseStardust('blaster', 99999)).toBe(25);
  });
  it('adds the featured-game bonus, and a streak bonus once a day', () => {
    const feat = featuredGame(day);
    const first = settle(EMPTY_STATS, feat, 99999, day);
    expect(first.result.base).toBe(25);
    expect(first.result.featuredBonus).toBe(FEATURED_BONUS);
    expect(first.result.streakBonus).toBe(1);
    expect(settle(first.next, feat, 99999, day).result.streakBonus).toBe(0);
  });
  it('grows the streak on consecutive days and resets after a gap', () => {
    const d1 = settle(EMPTY_STATS, 'match', 150, '2026-11-12');
    const d2 = settle(d1.next, 'match', 150, '2026-11-13');
    expect(d2.result.streak).toBe(2);
    expect(settle(d2.next, 'match', 150, '2026-11-16').result.streak).toBe(1);
  });
  it('halves pay after three plays of one game in a day', () => {
    let st = EMPTY_STATS;
    const game = (['match', 'blaster', 'focus', 'gems', 'merge'] as const).find((g) => g !== featuredGame(day))!;
    for (let i = 0; i < 3; i++) st = settle(st, game, 99999, day).next;
    const r = settle(st, game, 99999, day).result;
    expect(r.halfPay).toBe(true);
    expect(r.base).toBe(12);
  });
  it('tracks the best score', () => {
    const a = settle(EMPTY_STATS, 'gems', 300, day);
    expect(a.result.isBest).toBe(true);
    expect(settle(a.next, 'gems', 100, day).result.isBest).toBe(false);
  });
});
