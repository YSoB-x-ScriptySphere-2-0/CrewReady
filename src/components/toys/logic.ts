// Try-it toys (BUILD_SEQUENCE.md L1, plan §5.4): the pure rules. No store, no meters: a toy only shows an idea.

/** Levels that have a toy. Levels 1 and 6 need none: packing and picking a crew are the lesson. */
export const TOY_LEVELS = [2, 3, 4, 5] as const;
export const hasToy = (levelId: number) => (TOY_LEVELS as readonly number[]).includes(levelId);

/** One instruction per toy, ten words or fewer (the hands-on word budget, §4.1a). */
export const TOY_PROMPT: Record<number, string> = {
  2: 'Drag water bags between the Sun and the crew.',
  3: 'Tap Send. Watch the message go to Earth.',
  4: 'Dust is falling! Wipe the panel clean.',
  5: 'Tap to water the plant.',
};

/** Which sentence of the level's "I learned" line each toy ends on (plan §5.4: one line from it). */
const END_SENTENCE: Record<number, number> = { 2: 1, 3: 0, 4: 0, 5: 0 };

/** The end line: one sentence of the level's own "I learned" text, unchanged. */
export function toyLine(levelId: number, learned: string): string {
  const parts = learned.split(/(?<=[.!?])\s+/);
  return parts[END_SENTENCE[levelId] ?? 0] ?? learned;
}

// ---- Level 2: water bags between the Sun's rays and the crew ----
export const SHIELD_ROWS = 3;
export const emptyShield = (): boolean[] => Array.from({ length: SHIELD_ROWS }, () => false);
/** Put a bag in a row (or the first free one). Placing twice in one row changes nothing. */
export function placeBag(placed: boolean[], row?: number): boolean[] {
  const i = row ?? placed.indexOf(false);
  if (i < 0 || i >= placed.length || placed[i]) return placed;
  return placed.map((p, k) => (k === i ? true : p));
}
export const raysReachingCrew = (placed: boolean[]) => placed.filter((p) => !p).length;
export const shieldSolved = (placed: boolean[]) => raysReachingCrew(placed) === 0;

// ---- Level 4: dust on a solar panel ----
export const PANEL_CELLS = 6;
/** The order dust settles on the cells. */
export const DUST_ORDER = [0, 4, 2, 5, 1, 3];
export const cleanPanel = (): boolean[] => Array.from({ length: PANEL_CELLS }, () => false);
export const dustFall = (dusty: boolean[], n: number): boolean[] => dusty.map((_, i) => DUST_ORDER.indexOf(i) < n);
export const wipeCell = (dusty: boolean[], i: number): boolean[] => dusty.map((d, k) => (k === i ? false : d));
/** The power bar as a fraction (0–1). Display only: it never touches the game's Power meter. */
export const powerShown = (dusty: boolean[]) => 1 - (0.85 * dusty.filter(Boolean).length) / dusty.length;
export const panelSolved = (dusty: boolean[]) => dusty.every((d) => !d);

// ---- Level 5: water a plant ----
export const PLANT_STAGES = 4;
export const waterPlant = (stage: number) => Math.min(PLANT_STAGES, stage + 1);
/** The water bar as a fraction (0–1): it drops as the plant grows. */
export const waterShown = (stage: number) => 1 - stage / PLANT_STAGES;
export const plantSolved = (stage: number) => stage >= PLANT_STAGES;
