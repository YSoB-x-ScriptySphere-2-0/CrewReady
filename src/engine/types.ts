// Game rules data types. See plan.md §5 (rules) and §6 (levels).

export type Meter = 'P' | 'L' | 'F' | 'S';
export const METERS: Meter[] = ['P', 'L', 'F', 'S'];
export const METER_NAMES: Record<Meter, string> = {
  P: 'Power',
  L: 'Air & Water',
  F: 'Food',
  S: 'Shield',
};

/** A number, or an amount sized by real data: "-X", "-(X+5)", "-(D-10)". X = storm size, D = dust size. */
export type Amount = number | string;
export type Effects = Partial<Record<Meter, Amount>>;

/** True when the player has every flag in `if` and none in `unless`. */
export interface Cond {
  if?: string[];
  unless?: string[];
}

/** Something extra that happens only under a condition (a consequence of an earlier choice). */
export interface Extra extends Cond {
  effects?: Effects;
  stars?: number;
  reason: string;
}

export interface Option {
  label: string;
  effects?: Effects;
  stars?: number;
  /** One kid-level sentence: why the meters moved. */
  reason: string;
  /** Marker remembered for later levels. */
  setFlag?: string;
  /** Only set the marker when this condition holds. */
  setFlagCond?: Cond;
  extras?: Extra[];
  /** Show the Earth message clock before the outcome (level 3). */
  clock?: boolean;
}

interface StepBase {
  /** Two to four words for the level's task list ("Pack the rocket"). */
  task: string;
  prompt: string;
  hint: string;
}
export interface ChoiceStep extends StepBase {
  kind: 'choice';
  options: Option[];
}
export interface CratesStep extends StepBase {
  kind: 'crates';
  crates: number;
  perCrate: number;
  bins: { meter: Meter; label: string }[];
}
export interface StowStep extends StepBase {
  kind: 'stow';
  pick: number;
  items: { flag: string; label: string; inReach: string; inHold: string }[];
}
export interface OrderStep extends StepBase {
  kind: 'order';
  /** Steps in the correct order. */
  sequence: string[];
  rightStars: number;
  rightReason: string;
  wrong: Effects;
  wrongReason: string;
  wrongExtras?: Extra[];
}
export interface SlidersStep extends StepBase {
  kind: 'sliders';
  units: number;
  want: number;
  costPerMissing: number;
  systems: { meter: Meter; label: string }[];
}
export interface CrewStep extends StepBase {
  kind: 'crew';
  pick: number;
  costPerPerson: Effects;
  members: { id: string; label: string; protects?: Meter; doublesStars?: boolean; blurb: string }[];
}
export type Step = ChoiceStep | CratesStep | StowStep | OrderStep | SlidersStep | CrewStep;

export interface Level {
  id: number;
  title: string;
  place: string;
  teaches: string;
  story: string;
  /** Short citation shown under every screen of the level. */
  source: string;
  /** Applied when the level starts (living costs, sunlight, consequences). */
  onEnter: Extra[];
  /** Change X or D for this level when a condition holds. */
  adjust?: (Cond & { var: 'X' | 'D'; add: number; reason: string })[];
  steps: Step[];
  /** What Mission Replay says when this meter hits zero here. */
  replay: Partial<Record<Meter, string>> & { default: string };
  /** "I learned…" line for the success screen. */
  learned: string;
}

export interface GameState {
  meters: Record<Meter, number>;
  stars: number;
  flags: string[];
  crew: string[];
  /** Storm size from real space-weather data: 10, 20 or 30. */
  X: number;
  /** Dust size from a real storm case: 5, 15 or 25. */
  D: number;
}

/** What happened as the result of one action, for the outcome panel. */
export interface Outcome {
  state: GameState;
  delta: Partial<Record<Meter, number>>;
  starsDelta: number;
  reasons: string[];
  lost: Meter | null;
}

export type OutpostResult = 'survives' | 'stable' | 'thriving';
