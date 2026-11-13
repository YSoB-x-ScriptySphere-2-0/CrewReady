import { describe, it, expect } from 'vitest';
import { EMERGENCIES, emergencyDistance, emergencyForIndex, emergencyKeys } from './emergencies';
import { stringsEn } from '../content/strings.en';
import { stringsBn } from '../content/strings.bn';

describe('fly emergencies', () => {
  it('cycles through all drills and spaces them out', () => {
    expect(emergencyForIndex(0).id).toBe(EMERGENCIES[0].id);
    expect(emergencyForIndex(EMERGENCIES.length).id).toBe(EMERGENCIES[0].id);
    expect(emergencyDistance(1)).toBeGreaterThan(emergencyDistance(0));
  });

  it('has valid answers and text in English and Bangla', () => {
    for (const e of EMERGENCIES) {
      expect(e.correct).toBeGreaterThanOrEqual(0);
      expect(e.correct).toBeLessThan(3);
      const k = emergencyKeys(e.id);
      for (const key of [k.title, k.alert, k.why, k.fact, ...k.options]) {
        expect(stringsEn[key], key).toBeTruthy();
        expect(stringsBn[key], key).toBeTruthy();
      }
    }
  });
});
