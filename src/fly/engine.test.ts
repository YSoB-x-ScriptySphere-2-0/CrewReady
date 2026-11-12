// Unit Tests for Fly Engine — BUILD_SEQUENCE.md S2
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  determineSpeedConfig,
  stepGame,
  HOP_DURATION,
} from './engine';
import type { FlyState } from './types';

// Helper to advance game by total seconds using realistic 16ms frame steps
function advanceTime(state: FlyState, totalSeconds: number): FlyState {
  let s = state;
  let remaining = totalSeconds;
  const dt = 0.016;
  while (remaining > 0) {
    const step = Math.min(dt, remaining);
    s = stepGame(s, step);
    remaining -= step;
  }
  return s;
}

describe('Fly Runner Engine (Pure Logic)', () => {
  describe('Speed Tiers from real NOAA Kp', () => {
    it('sets slow speed tier for Kp 0 to 3', () => {
      expect(determineSpeedConfig(0).speedTier).toBe('slow');
      expect(determineSpeedConfig(1.67).speedTier).toBe('slow');
      expect(determineSpeedConfig(3).speedTier).toBe('slow');
      expect(determineSpeedConfig(2).baseSpeed).toBe(13);
    });

    it('sets medium speed tier for Kp 4 to 6', () => {
      expect(determineSpeedConfig(4).speedTier).toBe('medium');
      expect(determineSpeedConfig(5.5).speedTier).toBe('medium');
      expect(determineSpeedConfig(6).speedTier).toBe('medium');
      expect(determineSpeedConfig(5).baseSpeed).toBe(17);
    });

    it('sets fast speed tier for Kp 7 to 9', () => {
      expect(determineSpeedConfig(7).speedTier).toBe('fast');
      expect(determineSpeedConfig(8.5).speedTier).toBe('fast');
      expect(determineSpeedConfig(9).speedTier).toBe('fast');
      expect(determineSpeedConfig(8).baseSpeed).toBe(21);
    });
  });

  describe('Deterministic generation with seeds', () => {
    it('produces identical obstacle coordinates for the same seed', () => {
      const stateA = createInitialState(undefined, 100);
      const stateB = createInitialState(undefined, 100);

      const steppedA = advanceTime(stateA, 1.0);
      const steppedB = advanceTime(stateB, 1.0);

      expect(steppedA.obstacles.length).toBe(steppedB.obstacles.length);
      expect(steppedA.items.length).toBe(steppedB.items.length);
      for (let i = 0; i < steppedA.obstacles.length; i++) {
        expect(steppedA.obstacles[i].lane).toBe(steppedB.obstacles[i].lane);
        expect(steppedA.obstacles[i].z).toBeCloseTo(steppedB.obstacles[i].z, 2);
      }
    });
  });

  describe('Movement & Clamping', () => {
    it('moves left and right within 3-lane bounds (-1, 0, 1)', () => {
      let state = createInitialState();
      expect(state.lane).toBe(0);

      // Move left to -1
      state = stepGame(state, 0.05, ['moveLeft']);
      expect(state.targetLane).toBe(-1);

      // Move left again: stays clamped at -1
      state = stepGame(state, 0.05, ['moveLeft']);
      expect(state.targetLane).toBe(-1);

      // Move right to 0
      state = stepGame(state, 0.05, ['moveRight']);
      expect(state.targetLane).toBe(0);

      // Move right to 1
      state = stepGame(state, 0.05, ['moveRight']);
      expect(state.targetLane).toBe(1);

      // Move right again: stays clamped at 1
      state = stepGame(state, 0.05, ['moveRight']);
      expect(state.targetLane).toBe(1);
    });
  });

  describe('Hopping Mechanics', () => {
    it('initiates hop and finishes after HOP_DURATION', () => {
      let state = createInitialState();
      expect(state.isHopping).toBe(false);

      state = stepGame(state, 0.016, ['hop']);
      expect(state.isHopping).toBe(true);

      // Advance to near apex (around halfway: ~0.32s)
      state = advanceTime(state, HOP_DURATION / 2);
      expect(state.isHopping).toBe(true);
      expect(state.hopHeight).toBeGreaterThan(0.7);

      // Advance past full duration
      state = advanceTime(state, HOP_DURATION / 2 + 0.1);
      expect(state.isHopping).toBe(false);
      expect(state.hopHeight).toBe(0);
    });

    it('safely hops over low rocks without taking damage', () => {
      let state = createInitialState();
      // Put a low rock 4 meters ahead
      state.obstacles = [{ id: 999, lane: 0, z: 4.0, kind: 'lowRock' }];

      // Jump!
      state = stepGame(state, 0.016, ['hop']);
      expect(state.isHopping).toBe(true);

      // Step until rock passes through pilot z range (~4m at 14m/s is ~0.28s, during mid-air)
      state = advanceTime(state, 0.28);

      expect(state.hull).toBe(3); // NO damage!
      expect(state.obstacles[0].passed).toBe(true);
    });
  });

  describe('Collisions and Health', () => {
    it('tall rock collision deducts 1 hull and triggers stumble', () => {
      let state = createInitialState();
      state.obstacles = [{ id: 888, lane: 0, z: 0.1, kind: 'tallRock' }];

      state = stepGame(state, 0.02);

      expect(state.hull).toBe(2);
      expect(state.stumbleTimer).toBeGreaterThan(0);
      expect(state.gameOver).toBe(false);
    });

    it('ending run when hull reaches 0', () => {
      let state = createInitialState();
      state.hull = 1;
      state.obstacles = [{ id: 777, lane: 0, z: 0.1, kind: 'tallRock' }];

      state = stepGame(state, 0.02);

      expect(state.hull).toBe(0);
      expect(state.gameOver).toBe(true);
    });
  });

  describe('Power Pickups', () => {
    it('Shield power absorbs a hit and protects hull', () => {
      let state = createInitialState();
      state.activePower = 'shield';
      state.powerRemaining = 4.0;
      state.obstacles = [{ id: 666, lane: 0, z: 0.1, kind: 'tallRock' }];

      state = stepGame(state, 0.02);

      expect(state.hull).toBe(3); // Protected!
      expect(state.activePower).toBeNull(); // Shield consumed
      expect(state.stumbleTimer).toBeGreaterThan(0);
    });

    it('Boost power smashes obstacles safely and doubles stardust', () => {
      let state = createInitialState();
      state.activePower = 'boost';
      state.powerRemaining = 5.0;
      state.obstacles = [{ id: 555, lane: 0, z: 0.1, kind: 'tallRock' }];
      state.items = [{ id: 444, lane: 0, z: 0.1, kind: 'stardust' }];

      state = stepGame(state, 0.02);

      expect(state.hull).toBe(3); // No damage
      expect(state.stardust).toBe(2); // Doubled from 1 to 2!
    });

    it('Magnet power pulls stardust towards pilot lane', () => {
      let state = createInitialState();
      state.activePower = 'magnet';
      state.laneX = 0;
      // Stardust located in lane 1
      state.items = [{ id: 333, lane: 1, z: 10, kind: 'stardust' }];

      state = stepGame(state, 0.05);

      // The stardust should have shifted inward toward lane 0
      expect(state.items[0].lane).toBeLessThan(1);
    });

    it('powers count down and expire after duration', () => {
      let state = createInitialState();
      state.activePower = 'shield';
      state.powerRemaining = 0.5;

      state = advanceTime(state, 0.6);

      expect(state.activePower).toBeNull();
      expect(state.powerRemaining).toBe(0);
    });

    it('stepGame is strictly pure and does not mutate input state (B2 item 4)', () => {
      const state = createInitialState();
      state.obstacles = [{ id: 99, lane: 0, z: 0.1, kind: 'tallRock' }];
      state.items = [{ id: 88, lane: 0, z: 0.1, kind: 'stardust' }];

      const run1 = stepGame(state, 0.05);
      expect(state.obstacles[0].passed).toBeUndefined();
      expect(state.items[0].collected).toBeUndefined();

      const run2 = stepGame(state, 0.05);
      expect(run1.hull).toBe(run2.hull);
      expect(run1.stardust).toBe(run2.stardust);
      expect(run1.distance).toBe(run2.distance);
    });

    it('detects swept obstacle collision on fast frame jumps (B2 item 3)', () => {
      const state = createInitialState();
      // Rock positioned at z = 1.2, speed = 25m/s with dt = 0.08 moves ~2.0m, skipping to -0.8
      state.obstacles = [{ id: 101, lane: 0, z: 1.2, kind: 'tallRock' }];
      state.speed = 25;

      const next = stepGame(state, 0.08); // deltaDistance = 2.0m, jumps from 1.2 to -0.8
      expect(next.hull).toBe(2); // Hit successfully detected via swept interval!
    });
  });
});
