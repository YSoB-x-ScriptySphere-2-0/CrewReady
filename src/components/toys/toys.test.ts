// L1: the Try-it toys. Rules are pure, the words are within budget, and no toy can touch the game store.
import { describe, expect, it } from 'vitest';
import { LEVELS } from '../../content/levels';
import { useGame } from '../../store/game';
import indexSrc from './index.tsx?raw';
import logicSrc from './logic.ts?raw';
import {
  PANEL_CELLS,
  PLANT_STAGES,
  SHIELD_ROWS,
  TOY_LEVELS,
  TOY_PROMPT,
  cleanPanel,
  dustFall,
  emptyShield,
  hasToy,
  panelSolved,
  placeBag,
  plantSolved,
  powerShown,
  raysReachingCrew,
  shieldSolved,
  toyLine,
  waterPlant,
  waterShown,
  wipeCell,
} from './logic';

const words = (s: string) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

describe('which levels have a toy', () => {
  it('levels 2 to 5 only', () => {
    expect(TOY_LEVELS).toEqual([2, 3, 4, 5]);
    expect([1, 6].some(hasToy)).toBe(false);
  });
});

describe('level 2: water bags stop the rays', () => {
  it('each bag blocks one row, and three bags make the crew safe', () => {
    let p = emptyShield();
    expect(raysReachingCrew(p)).toBe(SHIELD_ROWS);
    p = placeBag(p);
    p = placeBag(p, 2);
    expect(raysReachingCrew(p)).toBe(1);
    expect(shieldSolved(p)).toBe(false);
    p = placeBag(p);
    expect(shieldSolved(p)).toBe(true);
  });
  it('a bag put in a full row changes nothing', () => {
    const p = placeBag(emptyShield(), 1);
    expect(placeBag(p, 1)).toBe(p);
  });
});

describe('level 4: dust, then wipe', () => {
  it('dust sinks the power bar and wiping brings it back', () => {
    const dirty = dustFall(cleanPanel(), PANEL_CELLS);
    expect(dirty.every(Boolean)).toBe(true);
    expect(powerShown(dirty)).toBeLessThan(0.2);
    expect(powerShown(cleanPanel())).toBe(1);
    let d = dirty;
    for (let i = 0; i < PANEL_CELLS; i++) d = wipeCell(d, i);
    expect(panelSolved(d)).toBe(true);
    expect(powerShown(d)).toBe(1);
  });
  it('the bar climbs with every cell wiped', () => {
    const d = dustFall(cleanPanel(), PANEL_CELLS);
    expect(powerShown(wipeCell(d, 0))).toBeGreaterThan(powerShown(d));
  });
});

describe('level 5: watering', () => {
  it('the water bar drops as the plant grows, and it is done at full size', () => {
    let stage = 0;
    expect(waterShown(stage)).toBe(1);
    for (let i = 0; i < PLANT_STAGES + 2; i++) stage = waterPlant(stage);
    expect(stage).toBe(PLANT_STAGES);
    expect(plantSolved(stage)).toBe(true);
    expect(waterShown(stage)).toBe(0);
  });
});

describe('words', () => {
  it('an instruction is 10 words or fewer', () => {
    for (const id of TOY_LEVELS) expect(words(TOY_PROMPT[id]), `level ${id}`).toBeLessThanOrEqual(10);
  });
  it('each toy ends on one real sentence of the level’s "I learned" line', () => {
    for (const id of TOY_LEVELS) {
      const level = LEVELS.find((l) => l.id === id)!;
      const line = toyLine(id, level.learned);
      expect(level.learned).toContain(line);
      expect(words(line), `level ${id}`).toBeLessThanOrEqual(12);
    }
  });
});

describe('a toy changes no meter', () => {
  it('no toy file reads or writes the game store', () => {
    for (const [f, src] of [['index.tsx', indexSrc], ['logic.ts', logicSrc]]) expect(src, f).not.toMatch(/store\/game|useGame|\.act\(|setState\(\{/);
  });
  it('the pure rules leave the game state exactly as it was', () => {
    const before = JSON.stringify(useGame.getState().game);
    placeBag(emptyShield());
    wipeCell(dustFall(cleanPanel(), 3), 0);
    waterPlant(0);
    expect(JSON.stringify(useGame.getState().game)).toBe(before);
  });
});
