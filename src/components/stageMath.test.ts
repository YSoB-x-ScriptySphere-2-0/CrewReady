import { describe, expect, it } from 'vitest';
import { stageGeometry, toStageDelta } from './stageMath';

describe('stageGeometry', () => {
  it('fills a sideways phone and uses about 16px at 375 tall', () => {
    const g = stageGeometry(812, 375);
    expect(g.turned).toBe(false);
    expect(g.h).toBe(375);
    expect(g.rootPx).toBeCloseTo(16, 1);
  });
  it('is capped at 30px on a big screen', () => {
    expect(stageGeometry(3840, 2160).rootPx).toBe(30);
  });
  it('turns an upright phone and swaps its sides', () => {
    const g = stageGeometry(390, 844);
    expect(g.turned).toBe(true);
    expect(g.h).toBeLessThanOrEqual(390);
    expect(g.w).toBeLessThanOrEqual(844);
    expect(g.w / g.h).toBeLessThanOrEqual(21 / 9 + 1e-9);
  });
  it('holds the shape between 4:3 and 21:9', () => {
    const wide = stageGeometry(2000, 500);
    expect(wide.w / wide.h).toBeCloseTo(21 / 9, 5);
    const squarish = stageGeometry(1000, 900);
    expect(squarish.w / squarish.h).toBeCloseTo(4 / 3, 5);
  });
});

describe('toStageDelta', () => {
  it('leaves a sideways stage alone', () => {
    expect(toStageDelta(30, -5, false)).toEqual({ dx: 30, dy: -5 });
  });
  it('keeps left as left on the turned stage', () => {
    // Turned 90° clockwise: a swipe down the screen is a swipe right on the stage.
    expect(toStageDelta(0, 40, true)).toEqual({ dx: 40, dy: 0 });
    // and a swipe to the screen's left is down the stage.
    expect(toStageDelta(-40, 0, true)).toEqual({ dx: 0, dy: 40 });
  });
});
