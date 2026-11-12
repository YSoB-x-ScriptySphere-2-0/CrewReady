// D2b: the real storm picks X, X reaches the game, and a different storm changes level 2's Shield loss.
import { beforeEach, describe, expect, it } from 'vitest';
import { LEVELS } from '../content/levels';
import { chooseOption, crewMods } from '../engine/engine';
import type { ChoiceStep } from '../engine/types';
import type { Result, StormEvent } from '../services/nasa';
import { useGame } from './game';
import { ARCHIVE_X, currentStormX, fmtDate, level6Storm, stormXFrom, useSpace } from './space';

const weather = (data: Partial<StormEvent>, badge: Result<StormEvent>['badge'] = 'NASA LIVE'): Result<StormEvent> => ({
  data: { startTime: '2026-11-01T00:00:00Z', kpIndex: 0, ...data },
  badge,
  fetchedAt: '2026-11-12T00:00:00Z',
});

describe('storm size from real data', () => {
  beforeEach(() => useSpace.setState({ weather: null }));

  it('is 20 until the data has loaded', () => expect(currentStormX()).toBe(20));
  it('follows docs/06 §3', () => {
    expect(stormXFrom(weather({ kpIndex: 5 }))).toBe(10);
    expect(stormXFrom(weather({ kpIndex: 6 }))).toBe(20);
    expect(stormXFrom(weather({ kpIndex: 4, cmeSpeed: 900 }))).toBe(20);
    expect(stormXFrom(weather({ kpIndex: 8 }))).toBe(30);
    expect(stormXFrom(weather({ kpIndex: 4, hasSep: true }))).toBe(30);
  });
  it('the May 2024 archive storm is Large', () => {
    expect(ARCHIVE_X).toBe(30);
    expect(stormXFrom(weather({ kpIndex: 9, hasSep: true, cmeSpeed: 1650 }, 'NASA ARCHIVE'))).toBe(30);
  });
  it('level 6 uses the stronger of live and archive', () => {
    expect(level6Storm(10)).toBe(30);
    expect(level6Storm(30)).toBe(30);
  });
});

describe('a different storm changes level 2', () => {
  const storm = LEVELS[1].steps[0] as ChoiceStep;
  const keepWorking = storm.options.find((o) => o.label === 'Keep working on the experiment')!;
  const shieldLoss = (kp: number) => {
    useSpace.setState({ weather: weather({ kpIndex: kp }) });
    useGame.getState().startMission();
    const g = useGame.getState().game;
    return g.meters.S - chooseOption(g, keepWorking, crewMods(undefined, [])).state.meters.S;
  };
  it('a bigger storm costs more Shield', () => {
    const small = shieldLoss(5);
    const big = shieldLoss(9);
    expect(useGame.getState().game.X).toBe(30);
    expect(big).toBeGreaterThan(small);
  });
});

describe('dates', () => {
  it('one style for every card', () => {
    expect(fmtDate('2026-11-12')).toBe('12 November 2026');
    expect(fmtDate('2024-05-10T15:00:00Z')).toBe('10 May 2024');
  });
});
