// R5: the word budget (BUILD_SEQUENCE.md §4.1a) and picture coverage for every decision.
import { describe, expect, it } from 'vitest';
import { hasEvent } from '../components/events';
import { LEVELS } from './levels';
import { CAPTION, PICTURES } from './pictures';

const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const choices = LEVELS.flatMap((l) => l.steps.map((s, i) => ({ l, s, i })).filter((x) => x.s.kind === 'choice')) as { l: (typeof LEVELS)[number]; s: Extract<(typeof LEVELS)[number]['steps'][number], { kind: 'choice' }>; i: number }[];

describe('pictures first', () => {
  it('every option has a picture, a short label and a one-line result', () => {
    const missing = choices.flatMap(({ s }) => s.options.map((o) => o.label)).filter((label) => !PICTURES[label]);
    expect(missing).toEqual([]);
  });
  it('every decision has a short caption and an event moment', () => {
    expect(choices.filter(({ s }) => !CAPTION[s.prompt]).map(({ s }) => s.prompt)).toEqual([]);
    expect(choices.filter(({ l, i }) => !hasEvent(l.id, i)).map(({ l, i }) => `${l.id}-${i}`)).toEqual([]);
  });
  it('every picture belongs to a real option', () => {
    const labels = new Set(choices.flatMap(({ s }) => s.options.map((o) => o.label)));
    expect(Object.keys(PICTURES).filter((k) => !labels.has(k))).toEqual([]);
  });
  it('a chain is two or three icons', () => {
    for (const [label, p] of Object.entries(PICTURES)) expect(p.chain.length, label).toBeGreaterThanOrEqual(2);
    for (const [label, p] of Object.entries(PICTURES)) expect(p.chain.length, label).toBeLessThanOrEqual(3);
  });
});

describe('word budget (§4.1a)', () => {
  it('a decision (bubble and all cards) is 20 words or fewer', () => {
    for (const { l, s } of choices) {
      const n = words(CAPTION[s.prompt] ?? s.prompt) + s.options.reduce((a, o) => a + words(PICTURES[o.label]?.short ?? o.label), 0);
      expect(n, `level ${l.id}: ${s.prompt}`).toBeLessThanOrEqual(20);
    }
  });
  it('a result line is 12 words or fewer', () => {
    for (const [label, p] of Object.entries(PICTURES)) expect(words(p.line), label).toBeLessThanOrEqual(12);
  });
  it('a level opening line is 15 words or fewer', () => {
    for (const l of LEVELS) expect(words(l.teaches), `level ${l.id}`).toBeLessThanOrEqual(15);
  });
  it('a short label is 2 to 5 words', () => {
    for (const [label, p] of Object.entries(PICTURES)) {
      expect(words(p.short), label).toBeGreaterThanOrEqual(2);
      expect(words(p.short), label).toBeLessThanOrEqual(5);
    }
  });
});
