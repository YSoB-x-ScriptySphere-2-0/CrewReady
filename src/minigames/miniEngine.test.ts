import { describe, it, expect } from 'vitest';
import {
  initCountdown,
  tickCountdown,
  tapCountdown,
  initZapper,
  spawnRock,
  tickZapper,
  zapRock,
  initLeakPatrol,
  spawnLeak,
  sealLeak,
  tickLeakPatrol,
  initPanelWipe,
  wipePanel,
  isAllPanelsClean,
  initSeedMatch,
  flipCard,
  initRockSorter,
  sortRock,
  calculateStardustReward,
  MAX_BONUS_STARDUST,
} from './miniEngine';

describe('miniEngine (Task 2 & plan.md §5.6)', () => {
  describe('Level 1: Countdown', () => {
    it('ticks needle back and forth between 0 and 100', () => {
      let state = initCountdown();
      state = tickCountdown(state, 10);
      expect(state.needle).toBe(10);
      state.needle = 98;
      state.direction = 1;
      state = tickCountdown(state, 5);
      expect(state.needle).toBe(100);
      expect(state.direction).toBe(-1);
    });

    it('scores hit when needle is in green zone', () => {
      let state = initCountdown();
      state.needle = 50; // in 40-60
      const { state: next, hit } = tapCountdown(state);
      expect(hit).toBe(true);
      expect(next.score).toBe(1);
      expect(next.step).toBe(2);
    });
  });

  describe('Level 2: Zapper', () => {
    it('spawns and zaps rocks', () => {
      let state = initZapper();
      state = spawnRock(state, 50, 50, 40, 5);
      expect(state.rocks.length).toBe(1);

      const { state: zapped, pointsEarned } = zapRock(state, state.rocks[0].id);
      expect(pointsEarned).toBe(5);
      expect(zapped.score).toBe(5);
      expect(zapped.rocks.length).toBe(0);
    });

    it('despawns rocks when ttl reaches 0', () => {
      let state = initZapper();
      state = spawnRock(state, 50, 50);
      state.rocks[0].ttl = 1;
      state = tickZapper(state);
      expect(state.rocks.length).toBe(0);
    });
  });

  describe('Level 3: Leak Patrol', () => {
    it('spawns and seals leaks', () => {
      let state = initLeakPatrol();
      state = spawnLeak(state, 4);
      expect(state.leaks.length).toBe(1);

      const { state: sealed, sealed: ok } = sealLeak(state, state.leaks[0].id);
      expect(ok).toBe(true);
      expect(sealed.sealedCount).toBe(1);
      expect(sealed.leaks.length).toBe(0);
    });

    it('despawns unsealed leaks when ttl reaches 0', () => {
      let state = initLeakPatrol();
      state = spawnLeak(state, 2);
      state.leaks[0].ttl = 1;
      state = tickLeakPatrol(state);
      expect(state.leaks.length).toBe(0);
    });
  });

  describe('Level 4: Panel Wipe', () => {
    it('wipes panels up to 100%', () => {
      let state = initPanelWipe();
      state = wipePanel(state, 0, 50);
      expect(state.panels[0]).toBe(50);
      state = wipePanel(state, 0, 60);
      expect(state.panels[0]).toBe(100); // capped at 100
      expect(isAllPanelsClean(state)).toBe(false);

      state = wipePanel(state, 1, 100);
      state = wipePanel(state, 2, 100);
      state = wipePanel(state, 3, 100);
      expect(isAllPanelsClean(state)).toBe(true);
    });
  });

  describe('Level 5: Seed Match', () => {
    it('matches card pairs correctly', () => {
      let state = initSeedMatch();
      const first = state.cards[0];
      const matchingCard = state.cards.find((c) => c.pairKey === first.pairKey && c.id !== first.id)!;

      const res1 = flipCard(state, first.id);
      state = res1.state;
      expect(state.selectedId).toBe(first.id);

      const res2 = flipCard(state, matchingCard.id);
      expect(res2.isMatch).toBe(true);
      expect(res2.state.matchedPairs).toBe(1);
    });
  });

  describe('Level 6: Rock Sorter', () => {
    it('sorts rocks matching the current shape', () => {
      let state = initRockSorter();
      const neededShape = state.currentRock!.shape;
      const { state: next, correct } = sortRock(state, neededShape);
      expect(correct).toBe(true);
      expect(next.sortedCount).toBe(1);
    });
  });

  describe('calculateStardustReward', () => {
    it('caps stardust reward at MAX_BONUS_STARDUST (30)', () => {
      const reward1 = calculateStardustReward(1, 3);
      expect(reward1).toBe(30);

      const rewardHigh = calculateStardustReward(2, 999);
      expect(rewardHigh).toBe(MAX_BONUS_STARDUST);

      const rewardZero = calculateStardustReward(3, 0);
      expect(rewardZero).toBe(0);
    });
  });
});
