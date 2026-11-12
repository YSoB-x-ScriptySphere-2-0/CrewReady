// Stage geometry (BUILD_SEQUENCE.md §4.2). Pure helpers, so the maths can be tested without a browser.

/** Stage shape is held between 4:3 and 21:9; outside that the scene colour fills the edges. */
export const MIN_ASPECT = 4 / 3;
export const MAX_ASPECT = 21 / 9;

export type StageGeometry = {
  /** The stage's own width and height, in the stage's own (landscape) frame. */
  w: number;
  h: number;
  /** True when the window is upright and the stage is drawn a quarter-turn. */
  turned: boolean;
  /** Root font size in px: about 16 at 375 tall, capped near 30. */
  rootPx: number;
};

/** Work out the stage for a window of `vw` × `vh` pixels. */
export function stageGeometry(vw: number, vh: number): StageGeometry {
  const turned = vh > vw;
  const long = turned ? vh : vw;
  const short = turned ? vw : vh;
  const w = Math.min(long, short * MAX_ASPECT);
  const h = Math.min(short, w / MIN_ASPECT);
  const rootPx = Math.min(30, Math.max(12, (h / 375) * 16));
  return { w, h, turned, rootPx };
}

/**
 * Turn a screen-space movement into stage space. On an upright phone the stage is rotated 90° clockwise,
 * so the stage's right is the screen's down. Swipe code must read direction through this, so "left" stays left.
 */
export function toStageDelta(dx: number, dy: number, turned: boolean): { dx: number; dy: number } {
  return turned ? { dx: dy || 0, dy: -dx || 0 } : { dx, dy };
}

let turnedNow = false;
export const setStageTurned = (v: boolean) => {
  turnedNow = v;
  if (typeof document !== 'undefined') document.documentElement.dataset.stage = v ? 'turned' : 'flat';
};
export const isStageTurned = () => turnedNow;

/** Screen-space delta → stage-space delta, using whatever the stage is doing right now. */
export const stageDelta = (dx: number, dy: number) => toStageDelta(dx, dy, turnedNow);
