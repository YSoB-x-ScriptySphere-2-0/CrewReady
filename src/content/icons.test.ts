import { describe, expect, it } from 'vitest';
import { LEVELS } from './levels';
import { OPTION_ICON } from './icons';

describe('option icons', () => {
  it('every choice option has its own icon', () => {
    const missing = LEVELS.flatMap((l) => l.steps.flatMap((s) => (s.kind === 'choice' || s.kind === 'stow' ? (s.kind === 'choice' ? s.options : s.items).map((o) => o.label) : []))).filter(
      (label) => !OPTION_ICON[label],
    );
    expect(missing).toEqual([]);
  });
  it('every step has a short task label', () => {
    for (const l of LEVELS) for (const s of l.steps) expect(s.task.split(' ').length).toBeLessThanOrEqual(4);
  });
});
