// One decision, in landscape (BUILD_SEQUENCE.md R3). Three ChoiceCards in a row; Look first:
// the first tap selects a card (it lifts, and every meter it will touch wiggles and shows ▲ or ▼), tapping
// another moves the selection, GO confirms. Keyboard: arrows move, Enter confirms. After GO the card stamps,
// the others slide off, and the outcome goes to the store. Level 3's "Ask Mission Control" first plays the
// Earth message clock while the Air & Water pill ticks down.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Play as PlayIcon, Radio, Star } from 'lucide-react';
import { iconFor } from '../content/icons';
import { chooseOption, crewMods } from '../engine/engine';
import { METER_NAMES, type ChoiceStep, type CrewStep, type GameState, type Level, type Meter, type Option, type Outcome } from '../engine/types';
import { ChoiceCard, GameButton, type Change } from './GameButton';
import { arrowCount } from './Hud';
import { outcomeChanges } from './LevelChrome';
import { MeterBadge } from './meters';
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

/** Look first, drawn: one ▲/▼ for 5–10, two for 15–20, three for 25 or more. No numbers; a star for stars. */
function LookArrows({ changes }: { changes: Change[] }) {
  return (
    <span className="flex flex-wrap items-center justify-center gap-x-[0.375rem] gap-y-[0.125rem]" aria-hidden>
      {changes.map((c) => (
        <span key={c.meter} className={`inline-flex items-center gap-[0.125rem] font-display text-[0.75rem] leading-none font-extrabold ${c.amount > 0 ? 'text-[#3ddc84]' : 'text-[#ff7b7b]'}`}>
          {c.meter === 'stars' ? <Star size={14} fill="var(--color-star)" strokeWidth={2} /> : <MeterBadge meter={c.meter} size={20} />}
          {(c.amount > 0 ? '▲' : '▼').repeat(arrowCount(c.amount))}
        </span>
      ))}
    </span>
  );
}

const lookText = (changes: Change[]) =>
  changes.map((c) => `${c.meter === 'stars' ? 'Stars' : METER_NAMES[c.meter]} ${c.amount > 0 ? 'up' : 'down'}`).join(', ');

export function Decision({
  step,
  game,
  level,
  onDone,
  onHudPreview,
  onLook,
}: {
  step: ChoiceStep;
  game: GameState;
  level: Level;
  /** The outcome, and the label of the option chosen (for Mission Replay). */
  onDone: (o: Outcome, label: string) => void;
  /** Lets the HUD show meters that move before the outcome lands (the leak during the clock). */
  onHudPreview: (meters: Record<Meter, number> | null) => void;
  /** Look first: the meters the selected card will touch, for the HUD pills (null when nothing is selected). */
  onLook: (look: Partial<Record<Meter, number>> | null) => void;
}) {
  const [sel, setSel] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const commit = (o: Option) => onDone(chooseOption(game, o, modsFor(level, game)), o.label);

  const looks = useMemo(() => optionCosts(step, game, level).map((c) => c.changes), [step, game, level]);

  // Look first: the HUD pills of the selected card's meters wiggle and show arrows.
  useEffect(() => {
    if (sel === null || picked !== null) return onLook(null);
    const look: Partial<Record<Meter, number>> = {};
    for (const c of looks[sel]) if (c.meter !== 'stars') look[c.meter] = c.amount;
    onLook(look);
  }, [sel, picked]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => onLook(null), []); // eslint-disable-line react-hooks/exhaustive-deps

  const confirm = () => {
    if (sel === null || picked !== null) return;
    setPicked(sel);
    const o = step.options[sel];
    if (o.clock) setWaiting(true);
    else setTimeout(() => commit(o), reducedMotion() ? 0 : 320); // let the card stamp first
  };

  const move = (to: number) => {
    if (picked !== null) return;
    const i = Math.max(0, Math.min(step.options.length - 1, to));
    setSel(i);
    cards.current[i]?.focus();
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

  const stateOf = (i: number) => (picked === null ? 'idle' : picked === i ? 'chosen' : 'gone');
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') (e.preventDefault(), move((sel ?? -1) + 1));
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') (e.preventDefault(), move((sel ?? 1) - 1));
    else if (e.key === 'Enter' && sel !== null) (e.preventDefault(), confirm());
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-[0.5rem]">
      <div className="min-h-0 flex-1">
        {waiting ? (
          <EarthClock />
        ) : (
          <div className="flex h-full gap-[0.5rem] overflow-x-clip pb-[0.25rem]" role="group" aria-label="Your choices" onKeyDown={onKeyDown}>
            {step.options.map((o, i) => (
              <ChoiceCard
                key={o.label}
                label={o.label}
                icon={iconFor(o.label)}
                selected={sel === i && picked === null}
                state={stateOf(i)}
                onClick={() => picked === null && setSel(i)}
                innerRef={(el) => void (cards.current[i] = el)}
                className="!min-h-0"
              >
                {sel === i && picked === null ? (
                  <>
                    <LookArrows changes={looks[i]} />
                    <span className="sr-only">{lookText(looks[i])}</span>
                  </>
                ) : null}
              </ChoiceCard>
            ))}
          </div>
        )}
      </div>
      {!waiting ? (
        <div className="flex justify-end">
          <GameButton variant="go" icon={PlayIcon} disabled={sel === null || picked !== null} onClick={confirm} className="!min-h-[3rem] !px-[2rem]">
            GO
          </GameButton>
        </div>
      ) : null}
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
    <div className="rise flex h-full flex-col justify-center gap-[0.5rem] rounded-panel border-2 border-line bg-panel px-[1rem] py-[0.5rem] text-text" role="status">
      <p className="text-center font-display text-[1.25rem] leading-tight font-extrabold">{leg === 'there' ? 'Calling Earth…' : 'Earth is answering…'}</p>
      <div className="flex items-center gap-[0.5rem]">
        <Planet name="Mars" />
        <div className="relative h-[2.75rem] flex-1">
          <span aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-[3px] border-dashed border-text/60" />
          <span
            key={leg}
            aria-hidden
            className={`absolute top-1/2 grid h-[2.75rem] w-[2.75rem] -translate-y-1/2 place-items-center rounded-full border-2 border-go-lip bg-go text-go-text ${
              reduce ? dotAt : leg === 'there' ? 'msg-there' : 'msg-back'
            }`}
          >
            <Radio size={22} strokeWidth={2.75} className="relative z-10" />
          </span>
        </div>
        <Planet name="Earth" />
      </div>
      <p className="text-center text-[0.9375rem] leading-snug">A message takes minutes each way. The air keeps leaking.</p>
    </div>
  );
}

function Planet({ name }: { name: string }) {
  const isMars = name.toLowerCase() === 'mars';
  const gradient = isMars
    ? 'radial-gradient(circle at 35% 32%, #fba86b 0%, #d9622b 50%, #6e1c07 95%)'
    : 'radial-gradient(circle at 35% 32%, #7ac2ff 0%, #2f6fed 52%, #0b2260 95%)';
  return (
    <span className="flex w-[3.5rem] shrink-0 flex-col items-center gap-[0.25rem]">
      {/* A shaded ball: the light edge is a plain inset shade, not a glow. */}
      <span className="h-[2.5rem] w-[2.5rem] rounded-full border-2 border-line" style={{ background: gradient, boxShadow: 'inset -0.25rem -0.25rem 0.5rem rgba(0,0,0,0.55)' }} aria-hidden />
      <span className="font-display text-[0.9375rem] leading-none font-extrabold text-text">{name}</span>
    </span>
  );
}
