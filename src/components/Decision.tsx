// A6 — one decision: options as big ChoiceTiles with icons. Picking one stamps it and slides the others
// away; then the outcome goes to the store. Level 3's "Ask Mission Control" first plays the Earth
// message clock while the Air & Water pill ticks down. BUILD_SEQUENCE.md §6 A6.
import { useEffect, useRef, useState } from 'react';
import { Radio } from 'lucide-react';
import { iconFor } from '../content/icons';
import { chooseOption, crewMods } from '../engine/engine';
import type { ChoiceStep, CrewStep, GameState, Level, Meter, Option, Outcome } from '../engine/types';
import { ChoiceTile, type TileState } from './GameButton';
import { outcomeChanges } from './LevelChrome';
import { reducedMotion, useReducedMotion } from './motion';

/** Each leg of the message clock: Mars → Earth, then Earth → Mars. */
export const LEG_MS = 2000;
/** How much air leaks while the player waits on Earth (plan §6.3: −15, then +5 when the fix arrives). */
const LEAK = 15;

const modsFor = (level: Level, game: GameState) => crewMods(level.steps.find((s): s is CrewStep => s.kind === 'crew'), game.crew);

/** What each option would change right now (with this crew and these earlier choices). For Twinkle's hint. */
export function optionCosts(step: ChoiceStep, game: GameState, level: Level) {
  const mods = modsFor(level, game);
  return step.options.map((o) => ({ option: o, changes: outcomeChanges(chooseOption(game, o, mods)) }));
}

export function Decision({
  step,
  game,
  level,
  onDone,
  onHudPreview,
}: {
  step: ChoiceStep;
  game: GameState;
  level: Level;
  /** The outcome, and the label of the option chosen (for Mission Replay). */
  onDone: (o: Outcome, label: string) => void;
  /** Lets the HUD show meters that move before the outcome lands (the leak during the clock). */
  onHudPreview: (meters: Record<Meter, number> | null) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);
  const commit = (o: Option) => onDone(chooseOption(game, o, modsFor(level, game)), o.label);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const o = step.options[i];
    if (o.clock) setWaiting(true);
    else setTimeout(() => commit(o), reducedMotion() ? 0 : 320); // let the tile stamp first
  };

  // The clock: air leaks one unit at a time for the whole round trip, then the reply's outcome lands.
  const gameRef = useRef(game);
  useEffect(() => {
    if (!waiting || picked === null) return;
    const start = gameRef.current.meters;
    const floor = Math.max(1, start.L - LEAK);
    const steps = start.L - floor;
    const total = LEG_MS * 2;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let k = 1; k <= steps; k++) timers.push(setTimeout(() => onHudPreview({ ...start, L: start.L - k }), (total * k) / (steps + 1)));
    timers.push(
      setTimeout(() => {
        onHudPreview(null);
        setWaiting(false);
        commit(step.options[picked]);
      }, total + 300),
    );
    return () => timers.forEach(clearTimeout);
  }, [waiting]); // eslint-disable-line react-hooks/exhaustive-deps

  const stateOf = (i: number): TileState => (picked === null ? 'idle' : picked === i ? 'chosen' : 'gone');
  return (
    <div className="space-y-1 overflow-x-clip" role="group" aria-label="Your choices">
      {step.options.map((o, i) => (
        <ChoiceTile key={o.label} label={o.label} icon={iconFor(o.label)} state={stateOf(i)} onClick={() => choose(i)} />
      ))}
      {waiting ? <EarthClock /> : null}
    </div>
  );
}

/**
 * Level 3: Mars on one side, Earth on the other, a radio message travelling there and back (2 s each way).
 * With reduced motion the dot does not glide; it sits at Earth, then back at Mars, and the words change.
 */
export function EarthClock() {
  const reduce = useReducedMotion();
  const [leg, setLeg] = useState<'there' | 'back'>('there');
  useEffect(() => {
    const t = setTimeout(() => setLeg('back'), LEG_MS);
    return () => clearTimeout(t);
  }, []);
  const dotAt = reduce ? (leg === 'there' ? 'right-0' : 'left-0') : '';
  return (
    <div className="rise mt-3 rounded-panel border-[3px] border-ink bg-sky-space p-4 text-paper shadow-panel" role="status">
      <p className="text-center font-display text-[22px] leading-tight font-extrabold">{leg === 'there' ? 'Calling Earth…' : 'Earth is answering…'}</p>
      <div className="mt-4 flex items-center gap-2">
        <Planet name="Mars" color="var(--color-sky-mars)" />
        <div className="relative h-11 flex-1">
          <span aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-[3px] border-dashed border-paper/70" />
          <span
            key={leg}
            aria-hidden
            className={`absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border-[3px] border-ink bg-go text-white ${
              reduce ? dotAt : leg === 'there' ? 'msg-there' : 'msg-back'
            }`}
          >
            <Radio size={22} strokeWidth={2.75} className="relative z-10" />
          </span>
        </div>
        <Planet name="Earth" color="var(--color-sky-earth)" />
      </div>
      <p className="mt-4 text-center text-lg leading-snug">A message takes minutes each way. The air keeps leaking.</p>
    </div>
  );
}

function Planet({ name }: { name: string; color: string }) {
  const isMars = name.toLowerCase() === 'mars';
  const gradient = isMars
    ? 'radial-gradient(circle at 35% 32%, #fba86b 0%, #d9622b 50%, #6e1c07 95%)'
    : 'radial-gradient(circle at 35% 32%, #7ac2ff 0%, #2f6fed 52%, #0b2260 95%)';

  return (
    <span className="flex w-16 shrink-0 flex-col items-center gap-1.5">
      <span
        className="relative h-12 w-12 rounded-full border-[3px] border-ink shadow-[inset_0_2px_4px_rgba(255,255,255,0.45),inset_-4px_-4px_8px_rgba(0,0,0,0.65)]"
        style={{
          background: gradient,
          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.45), inset -4px -4px 8px rgba(0,0,0,0.65)',
        }}
        aria-hidden
      >
        {/* Subtle atmospheric sheen */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
      </span>
      <span className="font-display text-base leading-none font-extrabold text-paper">{name}</span>
    </span>
  );
}
