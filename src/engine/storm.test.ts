// Tests for pure stormSize — docs/06 §3 / BUILD_SEQUENCE.md D2a
import { describe, it, expect } from 'vitest';
import { stormSize, stormTier, strongerStorm } from './storm';

describe('stormSize — docs/06 §3 table conversion', () => {
  describe('Row 1: Large storm (X = 30)', () => {
    it('returns 30 when a SEP event occurred in the window', () => {
      expect(stormSize({ hasSep: true })).toBe(30);
      expect(stormSize({ hasSep: true, kp: 1.0, cmeSpeed: 300 })).toBe(30);
    });

    it('returns 30 when geomagnetic Kp >= 8', () => {
      expect(stormSize({ kp: 8.0 })).toBe(30);
      expect(stormSize({ kp: 8.7 })).toBe(30);
      expect(stormSize({ kp: 9.0 })).toBe(30);
      // Alternative field kpIndex from DONKI GST
      expect(stormSize({ kpIndex: 8.0 })).toBe(30);
      expect(stormSize({ kpIndex: 9.0 })).toBe(30);
    });

    it('returns 30 when CME speed >= 1500 km/s', () => {
      expect(stormSize({ cmeSpeed: 1500 })).toBe(30);
      expect(stormSize({ cmeSpeed: 1650 })).toBe(30);
      expect(stormSize({ cmeSpeed: 2500 })).toBe(30);
    });
  });

  describe('Row 2: Medium storm (X = 20)', () => {
    it('returns 20 when Kp is between 6 and 7.9', () => {
      expect(stormSize({ kp: 6.0 })).toBe(20);
      expect(stormSize({ kp: 6.7 })).toBe(20);
      expect(stormSize({ kp: 7.0 })).toBe(20);
      expect(stormSize({ kp: 7.9 })).toBe(20);
      expect(stormSize({ kpIndex: 6.5 })).toBe(20);
    });

    it('returns 20 when CME speed is between 800 and 1499 km/s', () => {
      expect(stormSize({ cmeSpeed: 800 })).toBe(20);
      expect(stormSize({ cmeSpeed: 1000 })).toBe(20);
      expect(stormSize({ cmeSpeed: 1250 })).toBe(20);
      expect(stormSize({ cmeSpeed: 1499 })).toBe(20);
    });
  });

  describe('Row 3: Small storm (X = 10)', () => {
    it('returns 10 for readings weaker than threshold', () => {
      expect(stormSize({ kp: 5.9 })).toBe(10);
      expect(stormSize({ kp: 2.33 })).toBe(10);
      expect(stormSize({ kp: 0 })).toBe(10);
      expect(stormSize({ cmeSpeed: 799 })).toBe(10);
      expect(stormSize({ cmeSpeed: 450 })).toBe(10);
      expect(stormSize({ kp: 3.0, cmeSpeed: 500, hasSep: false })).toBe(10);
    });

    it('returns 10 when there are no events or empty input', () => {
      expect(stormSize(null)).toBe(10);
      expect(stormSize(undefined)).toBe(10);
      expect(stormSize({})).toBe(10);
    });
  });

  describe('Precedence / Strongest metric wins', () => {
    it('selects Large when any single metric reaches Large threshold', () => {
      // Low Kp, but high CME speed
      expect(stormSize({ kp: 2.0, cmeSpeed: 1800 })).toBe(30);
      // Low CME speed, but high Kp
      expect(stormSize({ kp: 8.5, cmeSpeed: 400 })).toBe(30);
      // Low Kp and Low CME speed, but SEP event occurred
      expect(stormSize({ kp: 1.0, cmeSpeed: 200, hasSep: true })).toBe(30);
    });

    it('selects Medium when one metric reaches Medium and none reaches Large', () => {
      expect(stormSize({ kp: 6.5, cmeSpeed: 400 })).toBe(20);
      expect(stormSize({ kp: 2.0, cmeSpeed: 950 })).toBe(20);
    });
  });

  describe('stormTier', () => {
    it('correctly maps X to kid-friendly tier', () => {
      expect(stormTier(30)).toBe('Large');
      expect(stormTier(20)).toBe('Medium');
      expect(stormTier(10)).toBe('Small');
    });
  });

  describe('strongerStorm (level 6 rule)', () => {
    it('always selects the stronger of live and archive', () => {
      expect(strongerStorm(10, 30)).toBe(30);
      expect(strongerStorm(30, 10)).toBe(30);
      expect(strongerStorm(20, 10)).toBe(20);
      expect(strongerStorm(20, 30)).toBe(30);
      expect(strongerStorm(10, 10)).toBe(10);
    });
  });
});
