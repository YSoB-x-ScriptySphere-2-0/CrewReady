// Tests for space music engine
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { spaceMusic } from './audio';

describe('SpaceMusicEngine', () => {
  beforeEach(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  it('can toggle mute and persist state', () => {
    const initialMuted = spaceMusic.getMuted();
    const newMuted = spaceMusic.toggleMute();
    expect(newMuted).toBe(!initialMuted);
    expect(spaceMusic.getMuted()).toBe(newMuted);

    // Toggle back
    const restored = spaceMusic.toggleMute();
    expect(restored).toBe(initialMuted);
  });

  it('allows changing music mode', () => {
    spaceMusic.setMode('fly');
    spaceMusic.setMode('alarm');
    spaceMusic.setMode('calm');
    spaceMusic.setMode('normal');
    // Does not throw in non-DOM/node environment
    expect(true).toBe(true);
  });

  it('allows subscription to state changes', () => {
    const listener = vi.fn();
    const unsubscribe = spaceMusic.subscribe(listener);
    expect(listener).toHaveBeenCalled();

    spaceMusic.toggleMute();
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    spaceMusic.toggleMute();
    expect(listener).toHaveBeenCalledTimes(2); // no more calls after unsubscribe
  });
});
