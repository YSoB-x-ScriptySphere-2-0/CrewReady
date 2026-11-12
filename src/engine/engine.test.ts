import { describe, expect, it } from 'vitest';
import { LEVELS } from '../content/levels';
import {
  checkOrder,
  chooseOption,
  crewMods,
  enterLevel,
  enterSteps,
  outpostCheck,
  packCrates,
  pickCrew,
  resolve,
  setSliders,
  startMission,
  stow,
  validateLevel,
} from './engine';
import type { ChoiceStep, CratesStep, CrewStep, GameState, Level, OrderStep, SlidersStep, StowStep } from './types';

const step = <T,>(level: number, index: number) => LEVELS[level - 1].steps[index] as T;
const withFlags = (s: GameState, ...flags: string[]): GameState => ({ ...s, flags: [...s.flags, ...flags] });

describe('content', () => {
  it('every level passes the "no free choice" rule', () => {
    for (const l of LEVELS) expect(() => validateLevel(l)).not.toThrow();
  });
  it('rejects an option that changes only one thing', () => {
    const bad: Level = {
      ...LEVELS[2],
      steps: [{ kind: 'choice', task: 't', prompt: 'p', hint: 'h', options: [
        { label: 'free lunch', effects: { F: 10 }, reason: 'r' },
        { label: 'ok', effects: { F: 10, P: -5 }, reason: 'r' },
      ] }],
    };
    expect(() => validateLevel(bad)).toThrow(/at least two/);
  });
  it('has six levels in order', () => {
    expect(LEVELS.map((l) => l.id)).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe('amounts sized by real data', () => {
  const s = startMission(20, 15);
  it('resolves storm and dust expressions', () => {
    expect(resolve('-(X-10)', s)).toBe(-10);
    expect(resolve('-(X+5)', s)).toBe(-25);
    expect(resolve('-D', s)).toBe(-15);
    expect(resolve('-(D+10)', s)).toBe(-25);
  });
  it('a loss never turns into a gain', () => {
    expect(resolve('-(X-10)', startMission(5, 15))).toBe(-0);
  });
});

describe('level 1', () => {
  it('each crate adds 10', () => {
    const out = packCrates(startMission(), step<CratesStep>(1, 0), [4, 2, 1, 1]);
    expect(out.state.meters).toEqual({ P: 80, L: 60, F: 50, S: 50 });
  });
  it('needs exactly 8 crates', () => {
    expect(() => packCrates(startMission(), step<CratesStep>(1, 0), [4, 2, 1, 0])).toThrow();
  });
  it('the last seat sets a marker for later', () => {
    const seat = step<ChoiceStep>(1, 1);
    const out = chooseOption(startMission(), seat.options[2]);
    expect(out.state.flags).toContain('seeds');
    expect(out.delta).toEqual({ L: -5, F: 5 });
  });
  it('stowing remembers what is within reach', () => {
    const out = stow(startMission(), step<StowStep>(1, 2), ['reachWater', 'reachTools']);
    expect(out.state.flags).toEqual(['reachWater', 'reachTools']);
  });
});

describe('consequences come back', () => {
  it('water bags in the hold make the shelter late', () => {
    const shelter = step<ChoiceStep>(2, 0).options[0];
    const base = startMission(20);
    expect(chooseOption(withFlags(base, 'reachWater'), shelter).delta.S).toBe(-10);
    expect(chooseOption(base, shelter).delta.S).toBe(-15);
  });
  it('a bigger real storm costs more shield', () => {
    const work = step<ChoiceStep>(2, 0).options[1];
    expect(chooseOption(startMission(10), work).delta.S).toBe(-15);
    expect(chooseOption(startMission(30), work).delta.S).toBe(-35);
  });
  it('leaving the panels out stops the sunlight recharge, unless spare parts were packed', () => {
    const leave = step<ChoiceStep>(4, 0).options[1];
    const buried = chooseOption(startMission(), leave).state;
    expect(buried.flags).toContain('panelsBuried');
    expect(enterLevel(buried, LEVELS[4]).delta.P).toBeUndefined();
    const saved = chooseOption(withFlags(startMission(), 'spareParts'), leave).state;
    expect(saved.flags).not.toContain('panelsBuried');
    expect(enterLevel(saved, LEVELS[4]).delta.P).toBe(10);
  });
  it('the cliff landing reduces dust; a buried habitat reduces the last storm', () => {
    expect(enterLevel(withFlags(startMission(20, 15), 'cliff'), LEVELS[3]).state.D).toBe(10);
    expect(enterLevel(withFlags(startMission(20, 15), 'buried'), LEVELS[5]).state.X).toBe(10);
  });
  it('packed seeds grow extra food', () => {
    const big = step<ChoiceStep>(5, 0).options[0];
    expect(chooseOption(withFlags(startMission(), 'seeds'), big).delta.F).toBe(40);
  });
});

describe('hands-on steps', () => {
  it('landing checklist: right order earns a star, wrong order costs', () => {
    const s = step<OrderStep>(2, 3);
    expect(checkOrder(startMission(), s, s.sequence).starsDelta).toBe(1);
    const wrong = checkOrder(startMission(), s, [...s.sequence].reverse());
    expect(wrong.correct).toBe(false);
    expect(wrong.delta).toEqual({ P: -5, L: -5, S: -5 });
  });
  it('power sliders: every missing unit costs 5, and no split keeps everything', () => {
    const s = step<SlidersStep>(4, 1);
    expect(setSliders(startMission(), s, [3, 2, 2]).delta).toEqual({ F: -5, S: -5 });
    expect(() => setSliders(startMission(), s, [3, 3, 3])).toThrow();
  });
});

describe('level 6 crew', () => {
  const crew = step<CrewStep>(6, 0);
  it('three people cost air and food', () => {
    const out = pickCrew(startMission(), crew, ['engineer', 'medic', 'botanist']);
    expect(out.delta).toEqual({ L: -9, F: -9 });
    expect(out.state.crew).toHaveLength(3);
  });
  it('a specialist halves losses to their meter', () => {
    const shelter = step<ChoiceStep>(6, 1).options[0];
    const s = startMission(20);
    expect(chooseOption(s, shelter).delta).toEqual({ S: -10, P: -20 });
    expect(chooseOption(s, shelter, crewMods(crew, ['engineer', 'medic', 'botanist'])).delta).toEqual({ S: -5, P: -10 });
  });
  it('the scientist doubles stars earned', () => {
    const rover = step<ChoiceStep>(6, 3).options[1];
    expect(chooseOption(startMission(), rover, crewMods(crew, ['scientist', 'medic', 'engineer'])).starsDelta).toBe(2);
  });
});

describe('failure and success', () => {
  it('a meter at zero loses the level', () => {
    const s = { ...startMission(30), meters: { P: 50, L: 50, F: 50, S: 20 } };
    expect(chooseOption(s, step<ChoiceStep>(2, 0).options[1]).lost).toBe('S');
  });
  it('meters never go above 100', () => {
    const s = { ...startMission(), meters: { P: 95, L: 50, F: 50, S: 50 } };
    expect(chooseOption(s, step<ChoiceStep>(4, 2).options[0]).state.meters.P).toBe(100);
  });
  it('outpost check gives three results', () => {
    const at = (v: number, stars: number) => ({ ...startMission(), stars, meters: { P: v, L: v, F: v, S: v } });
    expect(outpostCheck(at(10, 0)).result).toBe('survives');
    expect(outpostCheck(at(10, 4)).result).toBe('stable');
    expect(outpostCheck(at(40, 2)).result).toBe('stable');
    expect(outpostCheck(at(40, 6)).result).toBe('thriving');
  });
});

describe('the mission can be won and lost', () => {
  /** Play every level picking option `pick(stepIndex, options)`; return final state or the level lost on. */
  function play(choose: (opts: number) => number, crates: number[], crewIds: string[], X = 20, D = 15) {
    let s = startMission(X, D);
    for (const level of LEVELS) {
      let out = enterLevel(s, level);
      if (out.lost) return { lostAt: level.id };
      s = out.state;
      const mods = crewMods(level.steps.find((st): st is CrewStep => st.kind === 'crew'), crewIds);
      for (const st of level.steps) {
        if (st.kind === 'crates') out = packCrates(s, st, crates);
        else if (st.kind === 'stow') out = stow(s, st, ['reachWater', 'reachTools']);
        else if (st.kind === 'order') out = checkOrder(s, st, st.sequence);
        else if (st.kind === 'sliders') out = setSliders(s, st, [3, 2, 2], mods);
        else if (st.kind === 'crew') out = pickCrew(s, st, crewIds);
        else out = chooseOption(s, st.options[choose(st.options.length)], level.id === 6 ? mods : undefined);
        if (out.lost) return { lostAt: level.id };
        s = out.state;
      }
    }
    return { state: s };
  }
  it('careful, balanced play reaches Sol 500', () => {
    // level-by-level safe picks: spare parts; shelter, clean, plain; soil bags, patch, sunlight;
    // fold, brush; big farm, recycler, carry water; shelter, build, near habitat
    const picks = [1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2];
    let i = 0;
    const r = play(() => picks[i++], [2, 2, 2, 2], ['engineer', 'medic', 'lifesupport']);
    expect(r.state, `lost at level ${r.lostAt}`).toBeDefined();
  });
  it('always chasing stars fails before the end', () => {
    // science kit, keep working, ..., finish experiment: pick the star option whenever it is first/second
    const picks = [0, 1, 1, 2, 0, 0, 0, 1, 0, 0, 2, 0, 2, 0, 0];
    let i = 0;
    const r = play(() => picks[i++], [2, 2, 2, 2], ['scientist', 'engineer', 'botanist'], 30, 25);
    expect(r.lostAt).toBeDefined();
  });

  // A9: each Outpost Check result is reached by really playing all six levels (storm X 20, dust D 15,
  // two crates per meter, water bags and tool kit in reach, landing checklist right, power split 3/2/2).
  // `picks` is one option index per choice, in play order:
  // L1 last seat · L2 storm, water, landing · L3 radiation, leak, oxygen · L4 panels, cleaning ·
  // L5 farm, water, pump · L6 storm, air machine, samples.
  const reach = (picks: number[], crewIds: string[]) => {
    let i = 0;
    const r = play(() => picks[i++], [2, 2, 2, 2], crewIds);
    expect(r.state, `lost at level ${r.lostAt}`).toBeDefined();
    expect(i).toBe(15);
    return outpostCheck(r.state!);
  };
  it('reaches Outpost Survives: 3 stars, only Food healthy', () => {
    // spare parts; experiment, drink less, crater cliff; soil bags, patch, sunlight; leave panels out,
    // robot; big farm, drill for ice, give plants drinking water; two hide, new machine, rover
    const out = reach([1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 0, 1, 0, 1], ['engineer', 'medic', 'botanist']);
    expect(out.result).toBe('survives');
    expect(out.healthy).toEqual(['F']);
  });
  it('reaches Outpost Stable through stars: 7 stars, only Air & Water healthy', () => {
    // science kit; experiment, spare filter, plain; bury the base, ask Earth, sunlight; leave panels out,
    // wait for wind; small garden, full-power cleaning, fix the pump; two hide, new machine, rover
    const out = reach([0, 1, 2, 0, 2, 0, 1, 1, 1, 1, 0, 2, 1, 0, 1], ['engineer', 'medic', 'lifesupport']);
    expect(out.result).toBe('stable');
    expect(out.healthy).toEqual(['L']);
  });
  it('reaches Outpost Thriving: all four systems healthy and 6+ stars', () => {
    // seeds; experiment, drink less, plain; bury the base, patch, sunlight; fold, robot;
    // small garden, full-power cleaning, lettuce early; finish the experiment, new machine, rover
    const out = reach([2, 1, 1, 0, 2, 1, 1, 0, 2, 1, 0, 1, 2, 0, 1], ['scientist', 'engineer', 'medic']);
    expect(out.result).toBe('thriving');
    expect(out.healthy).toHaveLength(4);
  });
});

describe('enterSteps (level opening plays carry-overs one by one)', () => {
  it('ends where enterLevel ends, for every level and flag mix', () => {
    const flagSets = [[], ['panelsBuried'], ['cliff', 'buried'], ['panelsBuried', 'cliff', 'buried']];
    for (const l of LEVELS)
      for (const f of flagSets) {
        const s = withFlags(startMission(20, 15), ...f);
        const steps = enterSteps(s, l);
        const end = steps.length ? steps[steps.length - 1].meters : s.meters;
        expect(end).toEqual(enterLevel(s, l).state.meters);
        expect(steps.map((x) => x.reason)).toEqual(enterLevel(s, l).reasons);
      }
  });
  it('gives each carry-over its own change and the meter it is about', () => {
    const steps = enterSteps(withFlags(startMission(20, 15), 'panelsBuried', 'cliff'), LEVELS[3]);
    expect(steps.map((s) => s.delta)).toEqual([{ L: -5, F: -5 }, {}, {}]);
    expect(steps.map((s) => s.about)).toEqual([['L', 'F'], ['P'], ['P']]);
  });
});
