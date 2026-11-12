// A8 — Mission Replay names the one choice that cost the failed meter the most.
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../content/levels';
import { chooseOption, costliest, enterLevel, startMission, type LogEntry } from './engine';
import type { ChoiceStep } from './types';

const level2 = LEVELS[1];
const choice = (i: number) => level2.steps[i] as ChoiceStep;
const option = (i: number, label: string) => choice(i).options.find((o) => o.label === label)!;

describe('costliest: what cost the failed meter the most', () => {
  it('level 2: names the experiment, even though the filter swap landed the last hit', () => {
    // Shield 35 going in, spare filter left in the hold. Storm size X = 20.
    const start = { ...startMission(20, 15), meters: { P: 50, L: 50, F: 50, S: 35 } };
    const entered = enterLevel(start, level2);
    const log: LogEntry[] = [{ label: 'Time passes', delta: entered.delta, living: true }];

    const storm = chooseOption(entered.state, option(0, 'Keep working on the experiment'));
    log.push({ label: 'Keep working on the experiment', delta: storm.delta });
    expect(storm.lost).toBeNull();

    const filter = chooseOption(storm.state, option(1, 'Put in the spare filter'));
    log.push({ label: 'Put in the spare filter', delta: filter.delta });
    expect(filter.lost).toBe('S'); // the filter swap is the last hit…

    expect(costliest(log, 'S')?.label).toBe('Keep working on the experiment'); // …but the storm choice cost the most
  });

  it('a tie goes to the earlier choice', () => {
    const log: LogEntry[] = [
      { label: 'First', delta: { P: -10 } },
      { label: 'Second', delta: { P: -10, L: -5 } },
    ];
    expect(costliest(log, 'P')?.label).toBe('First');
  });

  it('living costs count only when nothing else cost that meter', () => {
    const log: LogEntry[] = [
      { label: 'Time passes', delta: { L: -20, F: -5 }, living: true },
      { label: 'Patch it yourself', delta: { L: -5 } },
    ];
    expect(costliest(log, 'L')?.label).toBe('Patch it yourself');
    expect(costliest(log, 'F')?.label).toBe('Time passes');
    expect(costliest(log, 'S')).toBeNull();
  });
});
