// Pure game rules: no React, no network. See plan.md §5.
import {
  METERS,
  type Amount,
  type Cond,
  type CratesStep,
  type CrewStep,
  type Effects,
  type Extra,
  type GameState,
  type Level,
  type Meter,
  type Option,
  type OrderStep,
  type Outcome,
  type OutpostResult,
  type SlidersStep,
  type StowStep,
} from './types';

export const START_METER = 40;
export const HEALTHY = 30;

export function startMission(X = 20, D = 15): GameState {
  return { meters: { P: START_METER, L: START_METER, F: START_METER, S: START_METER }, stars: 0, flags: [], crew: [], X, D };
}

export function holds(state: GameState, c: Cond): boolean {
  return (c.if ?? []).every((f) => state.flags.includes(f)) && !(c.unless ?? []).some((f) => state.flags.includes(f));
}

/** Turn "-(X+5)" into a number. Data-sized losses never become gains. */
export function resolve(a: Amount, state: GameState): number {
  if (typeof a === 'number') return a;
  const clean = a.replace(/\s|−/g, (c) => (c === '−' ? '-' : ''));
  const maxM = /^-\(?max\(([XD]),\s*(\d+)\)\)?$/i.exec(clean);
  if (maxM) {
    const base = maxM[1].toUpperCase() === 'X' ? state.X : state.D;
    const floorVal = Number(maxM[2]);
    return -Math.max(floorVal, base);
  }
  const m = /^-\(?([XD])(?:([+-])(\d+))?\)?$/.exec(clean);
  if (!m) throw new Error(`Bad amount: ${a}`);
  const base = m[1] === 'X' ? state.X : state.D;
  const add = m[3] ? (m[2] === '+' ? 1 : -1) * Number(m[3]) : 0;
  return -Math.max(0, base + add);
}

interface Mods {
  /** Meters whose losses are halved (crew specialists, level 6). */
  protect: Meter[];
  doubleStars: boolean;
}
const NO_MODS: Mods = { protect: [], doubleStars: false };

export function crewMods(step: CrewStep | undefined, crew: string[]): Mods {
  if (!step) return NO_MODS;
  const picked = step.members.filter((m) => crew.includes(m.id));
  return {
    protect: picked.flatMap((m) => (m.protects ? [m.protects] : [])),
    doubleStars: picked.some((m) => m.doublesStars),
  };
}

/** Apply a list of effect bundles and report what moved. */
function apply(
  state: GameState,
  bundles: { effects?: Effects; stars?: number; reason: string }[],
  mods: Mods = NO_MODS,
  flag?: string,
): Outcome {
  const meters = { ...state.meters };
  const delta: Partial<Record<Meter, number>> = {};
  let starsDelta = 0;
  for (const b of bundles) {
    for (const m of METERS) {
      const raw = b.effects?.[m];
      if (raw === undefined) continue;
      let v = resolve(raw, state);
      if (v < 0 && mods.protect.includes(m)) v = -Math.floor(-v / 2);
      delta[m] = (delta[m] ?? 0) + v;
    }
    if (b.stars) starsDelta += b.stars > 0 && mods.doubleStars ? b.stars * 2 : b.stars;
  }
  for (const m of METERS) {
    if (delta[m] === undefined) continue;
    const before = meters[m];
    meters[m] = Math.max(0, Math.min(100, before + delta[m]!));
    delta[m] = meters[m] - before;
  }
  const flags = flag && !state.flags.includes(flag) ? [...state.flags, flag] : state.flags;
  const next: GameState = { ...state, meters, stars: Math.max(0, state.stars + starsDelta), flags };
  return { state: next, delta, starsDelta, reasons: bundles.map((b) => b.reason).filter(Boolean), lost: lostMeter(next) };
}

export function lostMeter(state: GameState): Meter | null {
  return METERS.find((m) => state.meters[m] <= 0) ?? null;
}

/** Start a level: adjust X/D for earlier choices, then apply living costs, sunlight and consequences. */
export function enterLevel(state: GameState, level: Level): Outcome {
  let s = state;
  const notes: string[] = [];
  for (const a of level.adjust ?? []) {
    if (!holds(s, a)) continue;
    s = { ...s, [a.var]: Math.max(0, s[a.var] + a.add) };
    notes.push(a.reason);
  }
  const out = apply(s, level.onEnter.filter((e) => holds(s, e)));
  return { ...out, reasons: [...out.reasons, ...notes] };
}

/** One carry-over on entering a level: its reason, what it changed, and the meters after it. */
export interface EnterStep {
  reason: string;
  delta: Partial<Record<Meter, number>>;
  meters: Record<Meter, number>;
  /** The meters it is about: the ones it moved, or the one a reminder names. */
  about: Meter[];
}

/**
 * The same as `enterLevel`, one carry-over at a time, so the level opening can play each onto the HUD.
 * Same order as `enterLevel`'s reasons; storm and dust changes (X → Shield, D → Power) come last.
 */
export function enterSteps(state: GameState, level: Level): EnterStep[] {
  let s = state;
  const adjusts: EnterStep[] = [];
  for (const a of level.adjust ?? []) {
    if (!holds(s, a)) continue;
    s = { ...s, [a.var]: Math.max(0, s[a.var] + a.add) };
    adjusts.push({ reason: a.reason, delta: {}, meters: s.meters, about: [a.var === 'X' ? 'S' : 'P'] });
  }
  const steps: EnterStep[] = [];
  for (const e of level.onEnter.filter((x) => holds(s, x))) {
    const out = apply(s, [e]);
    s = out.state;
    const moved = METERS.filter((m) => out.delta[m]);
    steps.push({ reason: e.reason, delta: out.delta, meters: s.meters, about: moved.length ? moved : e.about ? [e.about] : [] });
  }
  return [...steps, ...adjusts.map((a) => ({ ...a, meters: s.meters }))];
}

export function chooseOption(state: GameState, option: Option, mods: Mods = NO_MODS): Outcome {
  const extras: Extra[] = (option.extras ?? []).filter((e) => holds(state, e));
  const flag = option.setFlag && holds(state, option.setFlagCond ?? {}) ? option.setFlag : undefined;
  return apply(state, [option, ...extras], mods, flag);
}

/** counts[i] crates go to step.bins[i]. */
export function packCrates(state: GameState, step: CratesStep, counts: number[]): Outcome {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total !== step.crates || counts.some((c) => c < 0)) throw new Error(`Pack exactly ${step.crates} crates`);
  const effects: Effects = {};
  step.bins.forEach((b, i) => (effects[b.meter] = counts[i] * step.perCrate));
  return apply(state, [{ effects, reason: 'The cargo bay is full. What you packed is what you have.' }]);
}

export function stow(state: GameState, step: StowStep, flags: string[]): Outcome {
  if (flags.length !== step.pick) throw new Error(`Pick exactly ${step.pick}`);
  const s = { ...state, flags: [...state.flags, ...flags.filter((f) => !state.flags.includes(f))] };
  const reasons = step.items.map((i) => (flags.includes(i.flag) ? `${i.label}: within reach.` : `${i.label}: deep in the hold.`));
  return { state: s, delta: {}, starsDelta: 0, reasons, lost: null };
}

export function checkOrder(state: GameState, step: OrderStep, answer: string[]): Outcome & { correct: boolean } {
  const correct = answer.length === step.sequence.length && answer.every((a, i) => a === step.sequence[i]);
  if (correct) return { ...apply(state, [{ stars: step.rightStars, reason: step.rightReason }]), correct };
  const extras = (step.wrongExtras ?? []).filter((e) => holds(state, e));
  return { ...apply(state, [{ effects: step.wrong, reason: step.wrongReason }, ...extras]), correct };
}

/** alloc[i] units go to step.systems[i]. Each unit short of `want` costs `costPerMissing`. */
export function setSliders(state: GameState, step: SlidersStep, alloc: number[], mods: Mods = NO_MODS): Outcome {
  const total = alloc.reduce((a, b) => a + b, 0);
  if (total > step.units || alloc.some((a) => a < 0 || a > step.want)) throw new Error('Bad power split');
  const effects: Effects = {};
  step.systems.forEach((sys, i) => {
    const missing = step.want - alloc[i];
    if (missing > 0) effects[sys.meter] = -missing * step.costPerMissing;
  });
  const short = step.systems.filter((_, i) => alloc[i] < step.want).map((s) => s.label.toLowerCase());
  const reason = short.length ? `Not enough power for: ${short.join(', ')}.` : 'Everything stayed on.';
  return apply(state, [{ effects, reason }], mods);
}

export function pickCrew(state: GameState, step: CrewStep, ids: string[]): Outcome {
  if (ids.length !== step.pick || new Set(ids).size !== ids.length) throw new Error(`Pick exactly ${step.pick}`);
  const effects: Effects = {};
  for (const m of METERS) {
    const per = step.costPerPerson[m];
    if (typeof per === 'number') effects[m] = per * ids.length;
  }
  const out = apply(state, [{ effects, reason: 'Three more people to feed and keep breathing.' }]);
  return { ...out, state: { ...out.state, crew: ids } };
}

/** One thing that changed the meters during a level: a choice, a hands-on step, or the costs of entering it. */
export interface LogEntry {
  label: string;
  delta: Partial<Record<Meter, number>>;
  /** Living costs and other carry-overs from entering the level. */
  living?: boolean;
}

/**
 * Mission Replay's "what cost the most": the entry with the biggest loss to `meter`.
 * A tie goes to the earlier entry. Living costs count only when no choice cost that meter.
 */
export function costliest(log: LogEntry[], meter: Meter): LogEntry | null {
  const losers = log.filter((e) => (e.delta[meter] ?? 0) < 0);
  const pool = losers.some((e) => !e.living) ? losers.filter((e) => !e.living) : losers;
  let best: LogEntry | null = null;
  for (const e of pool) if (!best || e.delta[meter]! < best.delta[meter]!) best = e; // strict: ties keep the earlier
  return best;
}

export function outpostCheck(state: GameState): { healthy: Meter[]; result: OutpostResult } {
  const healthy = METERS.filter((m) => state.meters[m] >= HEALTHY);
  const result: OutpostResult =
    healthy.length === 4 && state.stars >= 6 ? 'thriving' : healthy.length >= 3 || state.stars >= 4 ? 'stable' : 'survives';
  return { healthy, result };
}

/** How many things an option changes: meters, stars, a marker, or a later consequence. */
function changeCount(o: Option): number {
  return Object.keys(o.effects ?? {}).length + (o.stars ? 1 : 0) + (o.setFlag ? 1 : 0) + (o.extras?.length ? 1 : 0);
}

/** "No unlimited mode": every option must change at least two things. Throws on bad content. */
export function validateLevel(level: Level): void {
  for (const step of level.steps) {
    if (step.kind !== 'choice') continue;
    if (step.options.length < 2) throw new Error(`Level ${level.id}: "${step.prompt}" needs at least 2 options`);
    for (const o of step.options) {
      if (changeCount(o) < 2) throw new Error(`Level ${level.id}: option "${o.label}" must change at least two things`);
      if (!o.reason) throw new Error(`Level ${level.id}: option "${o.label}" needs a reason`);
      for (const v of Object.values(o.effects ?? {})) resolve(v!, startMission());
    }
  }
  if (!level.source) throw new Error(`Level ${level.id} needs a source line`);
}
