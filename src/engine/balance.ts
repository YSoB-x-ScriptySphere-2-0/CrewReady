// Balance check (BUILD_SEQUENCE.md F3). Run: `npm run balance`.
// It plays EVERY path of the mission with the real engine and the real levels (nothing is copied), once for each
// real storm size X (10, 20, 30) and dust case D (5, 15, 25), and prints:
//   · the win rate (a path wins when the mission is finished with no meter at 0)
//   · where losing paths end, by level and meter
//   · any option that sits in more than 70% of the winning paths ("always right")
//   · whether a careful player can win level 6
// It changes nothing. Numbers live in src/content/levels.ts and are changed there, only after a yes.
//
// How "every path" stays small: the mission is a graph of game states. States that are the same (same meters,
// crew and the flags later steps read) are one node, so paths are counted, not replayed one by one. A meter that
// can never again be emptied is clamped, so even more states merge. Neither changes who wins or loses.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

import { LEVELS } from '../content/levels';
import { checkOrder, chooseOption, crewMods, enterLevel, packCrates, pickCrew, resolve, setSliders, startMission, stow } from './engine';
import { METERS, METER_NAMES, type GameState, type Level, type Meter, type Step } from './types';

// ---------------------------------------------------------------- every move a player can make on a step
interface Move {
  label: string;
  next: GameState;
  lost: Meter | null;
}

/** All ways to pick k of items, in order. */
function combos<T>(items: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (items.length < k) return [];
  const [head, ...rest] = items;
  return [...combos(rest, k - 1).map((c) => [head, ...c]), ...combos(rest, k)];
}

/** All ways to split `n` crates over `bins` bins. */
function splits(n: number, bins: number): number[][] {
  if (bins === 1) return [[n]];
  const out: number[][] = [];
  for (let i = 0; i <= n; i++) for (const rest of splits(n - i, bins - 1)) out.push([i, ...rest]);
  return out;
}

/** Every choice on a step, as a label and a function that plays it on a state. The list does not depend on the state. */
interface Plan {
  label: string;
  play: (state: GameState) => Move;
}

function plansFor(step: Step, level: Level): Plan[] {
  const crewStep = level.steps.find((s) => s.kind === 'crew');
  const modsOf = (state: GameState) => crewMods(crewStep?.kind === 'crew' ? crewStep : undefined, state.crew);
  const mv = (o: { state: GameState; lost: Meter | null }): Move => ({ label: '', next: o.state, lost: o.lost });
  switch (step.kind) {
    case 'choice':
      return step.options.map((o) => ({ label: o.label, play: (st) => mv(chooseOption(st, o, modsOf(st))) }));
    case 'crates':
      return splits(step.crates, step.bins.length).map((c) => ({ label: step.bins.map((b, i) => `${c[i]}×${b.meter}`).join(' '), play: (st) => mv(packCrates(st, step, c)) }));
    case 'stow':
      return combos(step.items, step.pick).map((c) => ({
        label: c.map((i) => i.label).join(' + '),
        play: (st) =>
          mv(
            stow(
              st,
              step,
              c.map((i) => i.flag),
            ),
          ),
      }));
    case 'order':
      // Two kinds of player: right first time, or wrong once and then right (a slip can already end the mission).
      return [
        { label: 'Right order first time', play: (st) => mv(checkOrder(st, step, step.sequence)) },
        {
          label: 'Wrong once, then right',
          play: (st) => {
            const slip = checkOrder(st, step, [...step.sequence].reverse());
            return mv(slip.lost ? slip : checkOrder(slip.state, step, step.sequence));
          },
        },
      ];
    case 'sliders': {
      const out: Plan[] = [];
      const walk = (i: number, alloc: number[], left: number) => {
        if (i === step.systems.length) return void out.push({ label: `${alloc.join('/')} blocks`, play: (st) => mv(setSliders(st, step, alloc, modsOf(st))) });
        for (let a = 0; a <= Math.min(step.want, left); a++) walk(i + 1, [...alloc, a], left - a);
      };
      walk(0, [], step.units);
      return out;
    }
    case 'crew':
      return combos(step.members, step.pick).map((c) => ({
        label: c.map((m) => m.label).join(' + '),
        play: (st) =>
          mv(
            pickCrew(
              st,
              step,
              c.map((m) => m.id),
            ),
          ),
      }));
  }
}

// ---------------------------------------------------------------- the graph of states
export const FLAT = LEVELS.flatMap((level, li) => level.steps.map((step, si) => ({ level, li, step, si })));
export const NSTEPS = FLAT.length;
export const PLANS = FLAT.map(({ step, level }) => plansFor(step, level));

/** Flags that anything reads. Flags nobody reads are dropped so equal states merge. */
const READ = new Set<string>();
const scan = (c?: { if?: string[]; unless?: string[] }) => [...(c?.if ?? []), ...(c?.unless ?? [])].forEach((f) => READ.add(f));
for (const l of LEVELS) {
  l.onEnter.forEach(scan);
  (l.adjust ?? []).forEach(scan);
  for (const s of l.steps) {
    if (s.kind === 'choice')
      s.options.forEach((o) => {
        scan(o.setFlagCond);
        (o.extras ?? []).forEach(scan);
      });
    if (s.kind === 'order') (s.wrongExtras ?? []).forEach(scan);
  }
}

/**
 * The most each meter can still lose from step g to the end, whatever is chosen (worst storm and dust, every
 * consequence counted, crew help ignored). A meter above this can never reach 0 again, so its exact value no
 * longer matters: it is clamped just above it, so more states merge and no win or loss changes.
 */
function worstLoss(): Record<Meter, number>[] {
  const big = startMission(30, 25);
  const neg = (e: Partial<Record<Meter, number | string>> | undefined, m: Meter) => {
    const v = e?.[m];
    return v === undefined ? 0 : Math.max(0, -resolve(v, big));
  };
  const stepLoss = (step: Step, m: Meter): number => {
    switch (step.kind) {
      case 'choice':
        return Math.max(...step.options.map((o) => neg(o.effects, m) + (o.extras ?? []).reduce((a, e) => a + neg(e.effects, m), 0)));
      case 'order':
        return 2 * (neg(step.wrong, m) + (step.wrongExtras ?? []).reduce((a, e) => a + neg(e.effects, m), 0));
      case 'sliders':
        return step.systems.some((sys) => sys.meter === m) ? step.want * step.costPerMissing : 0;
      case 'crew':
        return neg(step.costPerPerson, m) * step.pick;
      default:
        return 0;
    }
  };
  const entryLoss = (l: Level, m: Meter) => l.onEnter.reduce((a, e) => a + neg(e.effects, m), 0) + (l.adjust ?? []).length * 25;
  const out: Record<Meter, number>[] = [];
  for (let g = 0; g <= NSTEPS; g++) {
    const r = { P: 0, L: 0, F: 0, S: 0 } as Record<Meter, number>;
    for (let h = g; h < NSTEPS; h++)
      for (const m of METERS) {
        r[m] += stepLoss(FLAT[h].step, m);
        // Entering a level costs its carry-overs; the level that step g starts is entered before step g runs.
        if (FLAT[h].si === 0) r[m] += entryLoss(FLAT[h].level, m);
      }
    out.push(r);
  }
  return out;
}
const WORST = worstLoss();

/** Canonical state: only what later steps read, with safe meters clamped. Stars are not tracked (they cannot lose). */
function canon(s: GameState, g: number): GameState {
  const meters = { ...s.meters };
  for (const m of METERS) meters[m] = Math.min(meters[m], WORST[g][m] + 1);
  return { ...s, meters, stars: 0, flags: s.flags.filter((f) => READ.has(f)).sort() };
}
const keyOf = (s: GameState) => `${METERS.map((m) => s.meters[m]).join(',')}|${s.flags.join('.')}|${s.crew.join('.')}`;

/** The state a level starts in (the store's rule: level 6 always takes the stronger storm, docs/06 §3). */
function enter(state: GameState, level: Level): { state: GameState; lost: Meter | null } {
  const s = level.id === 6 ? { ...state, X: Math.max(state.X, 30) } : state;
  const out = enterLevel(s, level);
  return { state: out.state, lost: out.lost };
}

// ---------------------------------------------------------------- playing the mission
/** Small seeded random numbers, so every run prints the same report. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const MOVES = PLANS.map((p) => p.map((x) => x.label));

/** Every move on step g, played on a state. */
const movesFor = (g: number, state: GameState): Move[] => PLANS[g].map((p) => p.play(state));

/** A random move: one plan, one engine call. */
export function randomMove(g: number, state: GameState, r: () => number): { j: number; move: Move } {
  const j = Math.floor(r() * PLANS[g].length);
  return { j, move: PLANS[g][j].play(state) };
}

interface Run {
  won: boolean;
  /** Where it ended: the level and meter, when it lost. */
  lostLevel?: number;
  lostMeter?: Meter;
  /** The move taken on each step. */
  picks: number[];
  reachedLevel6: boolean;
}

export function run(X: number, D: number, pick: (g: number, state: GameState) => { j: number; move: Move }): Run {
  let state = startMission(X, D);
  const picks: number[] = [];
  let reachedLevel6 = false;
  for (let g = 0; g < NSTEPS; g++) {
    const { level, si } = FLAT[g];
    if (si === 0) {
      const en = enter(state, level);
      if (en.lost) return { won: false, lostLevel: level.id, lostMeter: en.lost, picks, reachedLevel6 };
      state = en.state;
    }
    if (level.id === 6) reachedLevel6 = true;
    const { j, move } = pick(g, state);
    picks.push(j);
    if (move.lost) return { won: false, lostLevel: level.id, lostMeter: move.lost, picks, reachedLevel6 };
    state = move.next;
  }
  return { won: true, picks, reachedLevel6 };
}

/** How safe a state is: the lowest meter, then the total. A careful player wants both high. */
const safety = (s: GameState) => Math.min(...METERS.map((m) => s.meters[m])) * 1000 + METERS.reduce((a, m) => a + s.meters[m], 0);

/** A careful player: on every step, looks at every move and takes the one that leaves the safest state. */
export function careful(g: number, state: GameState): { j: number; move: Move } {
  const all = movesFor(g, state);
  let best = 0;
  let bestScore = -Infinity;
  all.forEach((m, j) => {
    const score = m.lost ? -1e9 : safety(m.next);
    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  });
  return { j: best, move: all[best] };
}

/**
 * Is there ANY way to win? Depth-first over every move, safest first, remembering states already shown to lose
 * (same meters, crew and flags later steps read = same state). Stops at the first win, or gives up at `cap` states.
 */
function exists(X: number, D: number, fromLevel6 = false, cap = 4_000_000): { found: boolean; exhausted: boolean; states: number; picks?: number[] } {
  const dead = new Set<string>();
  const picks: number[] = [];
  const go = (g: number, state: GameState): boolean => {
    if (g === NSTEPS) return true;
    const { level, si } = FLAT[g];
    let s = state;
    if (si === 0) {
      const en = enter(s, level);
      if (en.lost) return false;
      s = en.state;
    }
    const c = canon(s, g);
    const key = `${g}|${keyOf(c)}`;
    if (dead.has(key)) return false;
    if (dead.size > cap) return false;
    const moves = movesFor(g, s)
      .map((m, j) => ({ m, j, score: m.lost ? -1e9 : safety(m.next) }))
      .filter((x) => !x.m.lost)
      .sort((a, b) => b.score - a.score);
    for (const { m, j } of moves) {
      picks[g] = j;
      if (go(g + 1, m.next)) return true;
    }
    dead.add(key);
    return false;
  };
  void fromLevel6;
  const found = go(0, startMission(X, D));
  return { found, exhausted: !found && dead.size <= cap, states: dead.size, picks: found ? [...picks] : undefined };
}

// ---------------------------------------------------------------- the report
const pct = (a: number, b: number) => (b ? `${((100 * a) / b).toFixed(1)}%` : '–');

function main() {
  const started = Date.now();
  const per = Number(process.argv[2] ?? 200_000); // random missions per case
  const cases: [number, number][] = [10, 20, 30].flatMap((X) => [5, 15, 25].map((D): [number, number] => [X, D]));
  const total = { runs: 0, wins: 0, reach6: 0 };
  const lostAt = new Map<string, number>();
  /** Winning random missions through each move of each step. */
  const wins = FLAT.map((_, g) => new Float64Array(MOVES[g].length));
  const used = FLAT.map((_, g) => new Float64Array(MOVES[g].length));
  const rows: string[] = [];
  const carefulRows: string[] = [];
  const existRows: string[] = [];
  const r = rng(20261112);

  for (const [X, D] of cases) {
    let w = 0;
    let reach6 = 0;
    let won6 = 0;
    for (let i = 0; i < per; i++) {
      const res = run(X, D, (g, st) => randomMove(g, st, r));
      total.runs++;
      if (res.reachedLevel6) reach6++;
      if (res.won) {
        w++;
        won6++;
        res.picks.forEach((j, g) => wins[g][j]++);
      } else {
        const k = `L${res.lostLevel} ${METER_NAMES[res.lostMeter!]}`;
        lostAt.set(k, (lostAt.get(k) ?? 0) + 1);
      }
      res.picks.forEach((j, g) => used[g][j]++);
    }
    total.wins += w;
    total.reach6 += reach6;
    rows.push(`  ${String(X).padEnd(3)} ${String(D).padEnd(3)} ${pct(w, per).padStart(9)} ${pct(reach6, per).padStart(10)} ${pct(won6, reach6).padStart(10)}`);

    const c = run(X, D, careful);
    carefulRows.push(`  ${String(X).padEnd(3)} ${String(D).padEnd(3)}  ${c.won ? 'wins' : `loses at level ${c.lostLevel} (${METER_NAMES[c.lostMeter!]})`}${c.won ? '' : ''}`);

    const e = exists(X, D);
    existRows.push(`  ${String(X).padEnd(3)} ${String(D).padEnd(3)}  ${e.found ? 'yes, a winning path exists' : e.exhausted ? 'NO winning path exists (searched them all)' : 'not found within the search limit'}  (${e.states.toLocaleString('en-GB')} dead-end states looked at)`);
  }

  console.log('CrewReady balance check (BUILD_SEQUENCE F3)\n');
  console.log('The mission has about 10^19 paths, too many to list, so this plays random missions: every step picks any of its');
  console.log(`moves with equal chance (${per.toLocaleString('en-GB')} missions for each of the 9 storm and dust cases), and separately searches every`);
  console.log('path for a winning one. The real engine and the real levels are used. A mission is WON when all six levels are');
  console.log('finished with no meter at 0. Target: 20–60% win, no option in over 70% of wins, a careful player can win level 6.\n');

  console.log('RANDOM PLAYER, by real storm size X and dust case D');
  console.log('  X   D        won   reach L6     L6 won');
  rows.forEach((x) => console.log(x));
  console.log(`  all     ${pct(total.wins, total.runs).padStart(9)} ${pct(total.reach6, total.runs).padStart(10)} ${pct(total.wins, total.reach6).padStart(10)}\n`);

  console.log('WHERE PLAYERS LOSE (share of lost missions)');
  const lost = total.runs - total.wins;
  for (let id = 1; id <= LEVELS.length; id++) {
    const rowsL = [...lostAt.entries()].filter(([k]) => k.startsWith(`L${id} `)).map(([k, v]) => [k.slice(3), v] as [string, number]);
    const sum = rowsL.reduce((a, x) => a + x[1], 0);
    console.log(`  Level ${id}: ${pct(sum, lost).padStart(6)} of losses${rowsL.length ? ', usually ' + rowsL.sort((a, b) => b[1] - a[1]).map(([m, v]) => `${m} ${pct(v, sum)}`).join(', ') : ''}`);
  }

  console.log('\nEVERY CHOICE: its share of winning missions (a step with 3 options is balanced when each is near 33%)');
  const overall = FLAT.map((_, g) => wins[g].reduce((a, b) => a + b, 0));
  const always: string[] = [];
  FLAT.forEach(({ level, step }, g) => {
    if (step.kind !== 'choice') return;
    console.log(`  L${level.id} · ${step.task}`);
    MOVES[g].forEach((label, j) => {
      const sh = overall[g] ? wins[g][j] / overall[g] : 0;
      const win = used[g][j] ? wins[g][j] / used[g][j] : 0;
      console.log(`      ${pct(sh, 1).padStart(6)} of wins   ${pct(win, 1).padStart(6)} of its tries won   ${label}`);
      if (sh > 0.7) always.push(`L${level.id} · ${step.task} · ${label} (${pct(sh, 1)})`);
    });
  });
  console.log('\nOPTIONS IN MORE THAN 70% OF WINNING MISSIONS (an always-right choice)');
  console.log(always.length ? always.map((x) => '  ' + x).join('\n') : '  none');

  console.log('\nOTHER STEPS (share of winning missions)');
  FLAT.forEach(({ level, step }, g) => {
    if (step.kind === 'choice' || step.kind === 'crates' || step.kind === 'sliders') return;
    MOVES[g].forEach((label, j) => console.log(`  L${level.id} · ${step.task}: ${pct(overall[g] ? wins[g][j] / overall[g] : 0, 1).padStart(6)}  ${label}`));
  });
  for (const [g, name] of [[0, 'crates (best 5)'], [11, 'battery sliders (best 5)']] as const) {
    console.log(`  ${name}`);
    MOVES[g]
      .map((label, j) => ({ label, win: used[g][j] ? wins[g][j] / used[g][j] : 0, n: used[g][j] }))
      .filter((x) => x.n > 200)
      .sort((a, b) => b.win - a.win)
      .slice(0, 5)
      .forEach((x) => console.log(`      ${pct(x.win, 1).padStart(6)} of its tries won   ${x.label}`));
  }

  console.log('\nPLAYERS WHO ARE CAREFUL PART OF THE TIME (careful = looks at every move, takes the safest; otherwise a random move)');
  console.log('  careful on     all steps   only the choices   only the hands-on steps');
  const hands = (g: number) => FLAT[g].step.kind !== 'choice';
  const mixedRate = (p: number, mode: 'all' | 'choices' | 'hands', n: number) => {
    let w = 0;
    let t = 0;
    const rr = rng(77 + Math.round(p * 100));
    for (const [X, D] of cases)
      for (let i = 0; i < n; i++) {
        const res = run(X, D, (g, st) => {
          const eligible = mode === 'all' || (mode === 'choices' ? !hands(g) : hands(g));
          return eligible && rr() < p ? careful(g, st) : randomMove(g, st, rr);
        });
        t++;
        if (res.won) w++;
      }
    return pct(w, t);
  };
  for (const p of [0, 0.25, 0.5, 0.75, 1]) console.log(`  ${String(Math.round(p * 100) + '%').padEnd(10)} ${mixedRate(p, 'all', 3000).padStart(9)} ${mixedRate(p, 'choices', 3000).padStart(18)} ${mixedRate(p, 'hands', 3000).padStart(25)}`);

  console.log('\nA CAREFUL PLAYER (looks at every move, takes the one that leaves the safest state)');
  carefulRows.forEach((x) => console.log(x));
  console.log('\nCAN ANY PLAYER WIN? (search of every path, safest first)');
  existRows.forEach((x) => console.log(x));
  console.log(`\n${((Date.now() - started) / 1000).toFixed(1)} s`);
}

// Run the report only when this file is started directly (so other scripts can reuse the functions above).
if (process.argv[1]?.endsWith('balance.ts')) main();
