// Unit tests for Profile & astronaut logic — BUILD_SEQUENCE.md S3
import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadProfile,
  saveProfile,
  getRankTitle,
  shuffleCallsign,
  resetAllGameData,
  DEFAULT_PROFILE,
  CALLSIGNS,
} from './profile';

class MockStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

describe('Profile logic (S3)', () => {
  beforeEach(() => {
    (globalThis as unknown as { localStorage: Storage }).localStorage = new MockStorage() as unknown as Storage;
  });

  it('loads default profile when nothing is stored', () => {
    const profile = loadProfile();
    expect(profile).toEqual(DEFAULT_PROFILE);
    expect(profile.astronaut).toBe('orbit');
    expect(profile.sound).toBe(false); // sound off by default
  });

  it('persists and loads updated profile', () => {
    saveProfile({
      astronaut: 'nova',
      callsign: 'Comet',
      sound: true,
      reducedMotion: true,
      language: 'bn',
    });

    const loaded = loadProfile();
    expect(loaded.astronaut).toBe('nova');
    expect(loaded.callsign).toBe('Comet');
    expect(loaded.sound).toBe(true);
    expect(loaded.reducedMotion).toBe(true);
    expect(loaded.language).toBe('bn');
  });

  it('computes rank titles based on badge count', () => {
    expect(getRankTitle(0)).toBe('Cadet Astronaut');
    expect(getRankTitle(1)).toBe('Flight Specialist');
    expect(getRankTitle(2)).toBe('Flight Specialist');
    expect(getRankTitle(3)).toBe('Systems Officer');
    expect(getRankTitle(4)).toBe('Systems Officer');
    expect(getRankTitle(5)).toBe('Commander');
    expect(getRankTitle(6)).toBe('Mars Pioneer');
  });

  it('shuffles call-signs from 20 space words without picking current', () => {
    const current = 'Pioneer';
    const next = shuffleCallsign(current);
    expect(next).not.toBe(current);
    expect(CALLSIGNS).toContain(next);
  });

  it('resets all game data cleanly', () => {
    localStorage.setItem('crewready_profile_settings', JSON.stringify({ callsign: 'Test' }));
    localStorage.setItem('crewready_v1_mission', 'data');
    localStorage.setItem('crewready_fly_best_distance', '1000');
    localStorage.setItem('crewready_fly_runs', '[{"distance":1000,"stardust":50,"at":"2026-11-13"}]');

    resetAllGameData();

    expect(localStorage.getItem('crewready_profile_settings')).toBeNull();
    expect(localStorage.getItem('crewready_v1_mission')).toBeNull();
    expect(localStorage.getItem('crewready_fly_best_distance')).toBeNull();
    expect(localStorage.getItem('crewready_fly_runs')).toBeNull();
  });
});
