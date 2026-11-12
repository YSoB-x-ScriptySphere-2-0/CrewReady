// One component per kind of step. Each calls `onDone(outcome)` when the player commits.
// Restyled with the game kit in G2; A7 turns each hands-on step into a fuller toy.
import { useEffect, useState } from 'react';
import { Check, DoorClosed, Minus, PlaneLanding, Plus, RotateCcw, Rocket, UsersRound, Zap } from 'lucide-react';
import { iconFor } from '../content/icons';
import { checkOrder, chooseOption, crewMods, packCrates, pickCrew, setSliders, stow } from '../engine/engine';
import { METER_NAMES, type ChoiceStep, type CratesStep, type CrewStep, type GameState, type Level, type OrderStep, type Outcome, type SlidersStep, type Step, type StowStep } from '../engine/types';
import { ChoiceTile, GameButton, type TileState } from './GameButton';
import { METER_COLOR, MeterBadge, StarIcon } from './meters';
import { reducedMotion, usePress } from './motion';

type Done = (o: Outcome, opts?: { stay?: boolean }) => void;

/** A small round +/− toy button for steppers. */
function StepButton({ kind, label, onClick, disabled }: { kind: 'minus' | 'plus'; label: string; onClick: () => void; disabled: boolean }) {
  const press = usePress(disabled);
  const Icon = kind === 'minus' ? Minus : Plus;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      {...press}
      className={`toy !mb-[7px] grid h-12 w-12 shrink-0 place-items-center rounded-full ${disabled ? 'bg-locked text-muted [--lip:var(--color-locked-lip)]' : kind === 'plus' ? 'bg-go text-white [--lip:var(--color-go-lip)]' : 'bg-paper text-ink'}`}
    >
      <Icon size={24} strokeWidth={3} aria-hidden />
    </button>
  );
}

/** A little supply crate. */
function Crate({ size = 26, faded }: { size?: number; faded?: boolean }) {
  return (
    <span
      className={`anim-pop-in relative inline-block shrink-0 rounded-[6px] border-[3px] border-ink bg-crate ${faded ? 'opacity-35' : ''}`}
      style={{ width: size, height: size * 0.82 }}
      aria-hidden
    >
      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-ink/40" />
    </span>
  );
}

/** One battery block (power sharing). */
function BatteryBlock({ on }: { on: boolean }) {
  return (
    <span className={`relative inline-block h-8 w-6 rounded-[5px] border-[3px] border-ink ${on ? 'bg-power' : 'bg-white'}`} aria-hidden>
      <span className="absolute -top-[7px] left-1/2 h-[5px] w-[10px] -translate-x-1/2 rounded-t-[3px] border-[3px] border-b-0 border-ink bg-ink" />
      {on ? <Zap size={12} strokeWidth={3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> : null}
    </span>
  );
}

function Choice({ step, game, level, onDone }: { step: ChoiceStep; game: GameState; level: Level; onDone: Done }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [waiting, setWaiting] = useState(false);
  const mods = crewMods(level.steps.find((s): s is CrewStep => s.kind === 'crew'), game.crew);
  const commit = (i: number) => onDone(chooseOption(game, step.options[i], mods));
  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (step.options[i].clock) setWaiting(true);
    else setTimeout(() => commit(i), reducedMotion() ? 0 : 320); // let the tile stamp first
  };
  useEffect(() => {
    if (!waiting || picked === null) return;
    const t = setTimeout(() => {
      setWaiting(false);
      commit(picked);
    }, 4200);
    return () => clearTimeout(t);
  }, [waiting]); // eslint-disable-line react-hooks/exhaustive-deps
  const stateOf = (i: number): TileState => (picked === null ? 'idle' : picked === i ? 'chosen' : 'gone');
  return (
    <div className="space-y-1 overflow-x-clip">
      {step.options.map((o, i) => (
        <ChoiceTile key={o.label} label={o.label} icon={iconFor(o.label)} state={stateOf(i)} onClick={() => choose(i)} />
      ))}
      {waiting ? <EarthClock /> : null}
    </div>
  );
}

/** Level 3: a message travels from Mars to Earth and back while the air leaks. */
function EarthClock() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="rounded-tile border-[3px] border-ink bg-sky-space p-4 text-center text-paper" role="status">
      <p className="font-display text-xl font-extrabold">{phase === 0 ? 'Message travelling to Earth…' : 'Reply travelling back to Mars…'}</p>
      <div className="mx-auto mt-3 flex max-w-sm items-center gap-2">
        <span className="h-8 w-8 shrink-0 rounded-full border-[3px] border-ink bg-sky-mars" aria-label="Mars" />
        <div className="h-4 flex-1 overflow-hidden rounded-full border-[3px] border-ink bg-paper">
          <div key={phase} className={`earth-fill h-full bg-go ${phase === 1 ? 'ml-auto' : ''}`} />
        </div>
        <span className="h-8 w-8 shrink-0 rounded-full border-[3px] border-ink bg-sky-earth" aria-label="Earth" />
      </div>
      <p className="mt-3 text-lg">Radio waves take minutes each way. The air keeps leaking while you wait.</p>
    </div>
  );
}

function Crates({ step, game, onDone }: { step: CratesStep; game: GameState; onDone: Done }) {
  const [counts, setCounts] = useState(step.bins.map(() => 0));
  const used = counts.reduce((a, b) => a + b, 0);
  const left = step.crates - used;
  const bump = (i: number, d: number) => setCounts(counts.map((c, j) => (j === i ? c + d : c)));
  return (
    <div>
      <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-tile border-[3px] border-ink bg-paper px-3 py-2 text-ink" aria-live="polite">
        {left > 0 ? (
          <>
            {Array.from({ length: left }, (_, i) => (
              <Crate key={i} />
            ))}
            <span className="ml-1 font-display text-xl font-extrabold">{left} left</span>
          </>
        ) : (
          <span className="flex items-center gap-2 font-display text-xl font-extrabold">
            <Check size={22} strokeWidth={3.5} aria-hidden /> All crates packed.
          </span>
        )}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {step.bins.map((b, i) => (
          <div key={b.meter} className="overflow-hidden rounded-tile border-[3px] border-ink bg-white text-ink shadow-[0_5px_0_var(--color-ink)]">
            <div className="flex items-center gap-2 border-b-[3px] border-ink px-3 py-1.5" style={{ background: METER_COLOR[b.meter] }}>
              <MeterBadge meter={b.meter} size={30} />
              <span className="font-display text-lg leading-tight font-extrabold">{b.label}</span>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <div className="flex min-h-7 flex-wrap gap-1">
                  {counts[i] ? Array.from({ length: counts[i] }, (_, k) => <Crate key={k} size={24} />) : <Crate size={24} faded />}
                </div>
                <p className="mt-1 font-display text-lg font-bold tabular-nums">
                  {METER_NAMES[b.meter]} → {game.meters[b.meter] + counts[i] * step.perCrate}
                </p>
              </div>
              <span className="flex gap-2">
                <StepButton kind="minus" label={`One less for ${b.label}`} onClick={() => bump(i, -1)} disabled={counts[i] === 0} />
                <StepButton kind="plus" label={`One more for ${b.label}`} onClick={() => bump(i, 1)} disabled={left === 0} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <GameButton variant="go" icon={DoorClosed} disabled={left !== 0} onClick={() => onDone(packCrates(game, step, counts))}>
          Close the rocket door
        </GameButton>
      </div>
    </div>
  );
}

function Stow({ step, game, onDone }: { step: StowStep; game: GameState; onDone: Done }) {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (f: string) => setSel(sel.includes(f) ? sel.filter((x) => x !== f) : sel.length < step.pick ? [...sel, f] : sel);
  return (
    <div>
      <div className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
        {step.items.map((it) => {
          const on = sel.includes(it.flag);
          return (
            <ChoiceTile
              key={it.flag}
              label={it.label}
              icon={iconFor(it.label)}
              pressed={on}
              note={on ? `Within reach: ${it.inReach}` : `In the hold: ${it.inHold}`}
              onClick={() => toggle(it.flag)}
            />
          );
        })}
      </div>
      <div className="mt-3">
        <GameButton variant="go" icon={Rocket} disabled={sel.length !== step.pick} onClick={() => onDone(stow(game, step, sel))}>
          Ready for launch ({sel.length}/{step.pick})
        </GameButton>
      </div>
    </div>
  );
}

function Order({ step, game, onDone }: { step: OrderStep; game: GameState; onDone: Done }) {
  // Show the steps in a fixed scrambled order so the answer is never already on screen.
  const [pool] = useState(() => [...step.sequence].sort((a, b) => a.length - b.length || a.localeCompare(b)));
  const [answer, setAnswer] = useState<string[]>([]);
  const submit = () => {
    const out = checkOrder(game, step, answer);
    setAnswer([]);
    onDone(out, { stay: !out.correct });
  };
  return (
    <div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Your landing order">
        {step.sequence.map((_, i) => (
          <li
            key={i}
            className={`flex min-h-14 items-center gap-2 rounded-tile border-[3px] px-2 py-1 font-display text-lg leading-tight font-extrabold ${
              answer[i] ? 'anim-pop-in border-ink bg-paper text-ink' : 'border-dashed border-ink/60 bg-paper/50 text-ink/70'
            }`}
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-go text-[19px] text-white">{i + 1}</span>
            {answer[i] ?? '…'}
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-x-3 gap-y-1 sm:grid-cols-2">
        {pool
          .filter((p) => !answer.includes(p))
          .map((p) => (
            <ChoiceTile key={p} label={p} icon={PlaneLanding} onClick={() => setAnswer([...answer, p])} />
          ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <GameButton variant="go" icon={PlaneLanding} disabled={answer.length !== step.sequence.length} onClick={submit}>
          Start the landing
        </GameButton>
        <GameButton variant="plain" icon={RotateCcw} disabled={!answer.length} onClick={() => setAnswer([])}>
          Start over
        </GameButton>
      </div>
    </div>
  );
}

function Sliders({ step, game, level, onDone }: { step: SlidersStep; game: GameState; level: Level; onDone: Done }) {
  const [alloc, setAlloc] = useState(step.systems.map(() => 0));
  const left = step.units - alloc.reduce((a, b) => a + b, 0);
  const mods = crewMods(level.steps.find((s): s is CrewStep => s.kind === 'crew'), game.crew);
  const bump = (i: number, d: number) => setAlloc(alloc.map((a, j) => (j === i ? a + d : a)));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-tile border-[3px] border-ink bg-paper px-3 py-2 text-ink" aria-live="polite">
        <span className="flex gap-1.5 pt-1.5">
          {Array.from({ length: step.units }, (_, i) => (
            <BatteryBlock key={i} on={i < left} />
          ))}
        </span>
        <span className="font-display text-lg font-extrabold">
          {left} of {step.units} battery blocks left to share
        </span>
      </div>
      <div className="mt-3 space-y-3">
        {step.systems.map((sys, i) => {
          const full = alloc[i] >= step.want;
          return (
            <div key={sys.meter} className="rounded-tile border-[3px] border-ink bg-white p-3 text-ink shadow-[0_5px_0_var(--color-ink)]">
              <div className="flex items-center gap-2">
                <MeterBadge meter={sys.meter} size={34} />
                <span className="font-display text-lg leading-tight font-extrabold">{sys.label}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 pt-1.5">
                  {Array.from({ length: step.want }, (_, k) => (
                    <BatteryBlock key={k} on={k < alloc[i]} />
                  ))}
                  <span
                    className={`ml-2 rounded-full border-2 border-ink px-2.5 font-display text-base font-extrabold ${full ? 'bg-[#d8f3e1]' : 'bg-[#ffe0dc]'}`}
                  >
                    {full ? 'Fully powered' : `${METER_NAMES[sys.meter]} −${(step.want - alloc[i]) * step.costPerMissing}`}
                  </span>
                </span>
                <span className="flex gap-2">
                  <StepButton kind="minus" label={`One less for ${sys.label}`} onClick={() => bump(i, -1)} disabled={alloc[i] === 0} />
                  <StepButton kind="plus" label={`One more for ${sys.label}`} onClick={() => bump(i, 1)} disabled={left === 0 || full} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <GameButton variant="go" icon={Zap} disabled={left !== 0} onClick={() => onDone(setSliders(game, step, alloc, mods))}>
          Done sharing power
        </GameButton>
      </div>
    </div>
  );
}

function Crew({ step, game, onDone }: { step: CrewStep; game: GameState; onDone: Done }) {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < step.pick ? [...sel, id] : sel);
  return (
    <div>
      <div className="grid gap-x-3 gap-y-1 sm:grid-cols-2">
        {step.members.map((m) => (
          <ChoiceTile
            key={m.id}
            label={m.label}
            note={m.blurb}
            pressed={sel.includes(m.id)}
            onClick={() => toggle(m.id)}
            picture={
              m.protects ? (
                <MeterBadge meter={m.protects} size={56} />
              ) : (
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-star" aria-hidden>
                  <StarIcon size={30} />
                </span>
              )
            }
          />
        ))}
      </div>
      <div className="mt-3">
        <GameButton variant="go" icon={UsersRound} disabled={sel.length !== step.pick} onClick={() => onDone(pickCrew(game, step, sel))}>
          Welcome them aboard ({sel.length}/{step.pick})
        </GameButton>
      </div>
    </div>
  );
}

export function StepView({ step, game, level, onDone }: { step: Step; game: GameState; level: Level; onDone: Done }) {
  switch (step.kind) {
    case 'choice':
      return <Choice step={step} game={game} level={level} onDone={onDone} />;
    case 'crates':
      return <Crates step={step} game={game} onDone={onDone} />;
    case 'stow':
      return <Stow step={step} game={game} onDone={onDone} />;
    case 'order':
      return <Order step={step} game={game} onDone={onDone} />;
    case 'sliders':
      return <Sliders step={step} game={game} level={level} onDone={onDone} />;
    case 'crew':
      return <Crew step={step} game={game} onDone={onDone} />;
  }
}
