// One component per kind of step. Each calls `onDone(outcome)` when the player commits.
// A0 moves these onto the shared parts; A7 restyles each into something you handle.
import { useEffect, useState } from 'react';
import { BatteryMedium, Minus, Package, Plus } from 'lucide-react';
import { checkOrder, chooseOption, crewMods, packCrates, pickCrew, setSliders, stow } from '../engine/engine';
import { METER_NAMES, type ChoiceStep, type CratesStep, type CrewStep, type GameState, type Level, type OrderStep, type Outcome, type SlidersStep, type Step, type StowStep } from '../engine/types';
import { ChoiceCard, METER_COLOR, MeterIcon, PrimaryButton, QuietButton, StarIcon } from './ui';

type Done = (o: Outcome, opts?: { stay?: boolean }) => void;
const panel = 'rounded-btn border-2 border-edge bg-white p-3';

function Stepper({ label, onMinus, onPlus, minusOff, plusOff }: { label: string; onMinus: () => void; onPlus: () => void; minusOff: boolean; plusOff: boolean }) {
  return (
    <>
      <QuietButton onClick={onMinus} disabled={minusOff} ariaLabel={`One less for ${label}`} className="!px-3">
        <Minus size={20} strokeWidth={2.5} aria-hidden />
      </QuietButton>
      <QuietButton onClick={onPlus} disabled={plusOff} ariaLabel={`One more for ${label}`} className="!px-3">
        <Plus size={20} strokeWidth={2.5} aria-hidden />
      </QuietButton>
    </>
  );
}

function Choice({ step, game, level, onDone }: { step: ChoiceStep; game: GameState; level: Level; onDone: Done }) {
  const [waiting, setWaiting] = useState<number | null>(null);
  const mods = crewMods(level.steps.find((s): s is CrewStep => s.kind === 'crew'), game.crew);
  const commit = (i: number) => onDone(chooseOption(game, step.options[i], mods));
  useEffect(() => {
    if (waiting === null) return;
    const t = setTimeout(() => commit(waiting), 4200);
    return () => clearTimeout(t);
  }, [waiting]); // eslint-disable-line react-hooks/exhaustive-deps
  if (waiting !== null) return <EarthClock />;
  return (
    <div className="space-y-3">
      {step.options.map((o, i) => (
        <ChoiceCard key={o.label} onClick={() => (o.clock ? setWaiting(i) : commit(i))}>
          {o.label}
        </ChoiceCard>
      ))}
    </div>
  );
}

function EarthClock() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2100);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`${panel} text-center`} role="status">
      <p className="font-display text-lg font-bold">{phase === 0 ? 'Message travelling to Earth…' : 'Reply travelling back to Mars…'}</p>
      <div className="mx-auto mt-3 h-3 max-w-sm overflow-hidden rounded-full border-2 border-ink">
        <div key={phase} className={`earth-fill h-full bg-ink ${phase === 1 ? 'ml-auto' : ''}`} />
      </div>
      <p className="mt-3 text-muted">Radio waves take minutes each way. The air keeps leaking while you wait.</p>
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
      <p className="mb-3 flex min-h-8 flex-wrap items-center gap-1 font-bold" aria-live="polite">
        {left > 0 ? (
          <>
            {Array.from({ length: left }, (_, i) => (
              <Package key={i} size={24} strokeWidth={2} aria-hidden />
            ))}
            <span className="ml-1">{left} left</span>
          </>
        ) : (
          'All crates packed.'
        )}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {step.bins.map((b, i) => (
          <div key={b.meter} className={panel} style={{ borderLeft: `6px solid ${METER_COLOR[b.meter]}` }}>
            <div className="flex items-center gap-1.5 font-bold">
              <MeterIcon meter={b.meter} /> {b.label}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span>
                <span className="font-display text-2xl font-bold tabular-nums">{counts[i]}</span>
                <span className="ml-2 text-muted">
                  {METER_NAMES[b.meter]} → {game.meters[b.meter] + counts[i] * step.perCrate}
                </span>
              </span>
              <span className="flex gap-2">
                <Stepper label={b.label} onMinus={() => bump(i, -1)} onPlus={() => bump(i, 1)} minusOff={counts[i] === 0} plusOff={left === 0} />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <PrimaryButton disabled={left !== 0} onClick={() => onDone(packCrates(game, step, counts))}>
          Close the rocket door
        </PrimaryButton>
      </div>
    </div>
  );
}

function Stow({ step, game, onDone }: { step: StowStep; game: GameState; onDone: Done }) {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (f: string) => setSel(sel.includes(f) ? sel.filter((x) => x !== f) : sel.length < step.pick ? [...sel, f] : sel);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {step.items.map((it) => {
          const on = sel.includes(it.flag);
          return (
            <ChoiceCard key={it.flag} selected={on} pressed={on} onClick={() => toggle(it.flag)}>
              {it.label}
              <span className="mt-1 block text-base font-normal text-muted">{on ? `Within reach: ${it.inReach}` : `In the hold: ${it.inHold}`}</span>
            </ChoiceCard>
          );
        })}
      </div>
      <div className="mt-5">
        <PrimaryButton disabled={sel.length !== step.pick} onClick={() => onDone(stow(game, step, sel))}>
          Ready for launch ({sel.length}/{step.pick})
        </PrimaryButton>
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
      <ol className="mb-3 min-h-12 list-decimal space-y-1 pl-7 font-bold">
        {answer.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ol>
      <div className="grid gap-3 sm:grid-cols-2">
        {pool
          .filter((p) => !answer.includes(p))
          .map((p) => (
            <ChoiceCard key={p} onClick={() => setAnswer([...answer, p])}>
              {p}
            </ChoiceCard>
          ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <PrimaryButton disabled={answer.length !== step.sequence.length} onClick={submit}>
          Start the landing
        </PrimaryButton>
        <QuietButton disabled={!answer.length} onClick={() => setAnswer([])}>
          Start over
        </QuietButton>
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
      <p className="mb-3 flex items-center gap-2 font-bold" aria-live="polite">
        <BatteryMedium size={24} strokeWidth={2} aria-hidden />
        {left} of {step.units} battery blocks left to share
      </p>
      <div className="space-y-2">
        {step.systems.map((sys, i) => (
          <div key={sys.meter} className={`${panel} flex flex-wrap items-center justify-between gap-2`} style={{ borderLeft: `6px solid ${METER_COLOR[sys.meter]}` }}>
            <span>
              <span className="flex items-center gap-1.5 font-bold">
                <MeterIcon meter={sys.meter} /> {sys.label}
              </span>
              <span className={`block ${alloc[i] >= step.want ? 'text-good' : 'text-danger'} font-bold`}>
                {alloc[i] >= step.want ? 'Fully powered' : `${METER_NAMES[sys.meter]} −${(step.want - alloc[i]) * step.costPerMissing}`}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-12 text-center font-display text-xl font-bold tabular-nums">
                {alloc[i]}/{step.want}
              </span>
              <Stepper label={sys.label} onMinus={() => bump(i, -1)} onPlus={() => bump(i, 1)} minusOff={alloc[i] === 0} plusOff={left === 0 || alloc[i] === step.want} />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <PrimaryButton disabled={left !== 0} onClick={() => onDone(setSliders(game, step, alloc, mods))}>
          Done sharing power
        </PrimaryButton>
      </div>
    </div>
  );
}

function Crew({ step, game, onDone }: { step: CrewStep; game: GameState; onDone: Done }) {
  const [sel, setSel] = useState<string[]>([]);
  const toggle = (id: string) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : sel.length < step.pick ? [...sel, id] : sel);
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {step.members.map((m) => {
          const on = sel.includes(m.id);
          return (
            <ChoiceCard key={m.id} selected={on} pressed={on} onClick={() => toggle(m.id)}>
              <span className="flex items-center gap-2">
                {m.protects ? (
                  <span className="inline-flex rounded-md p-1" style={{ background: METER_COLOR[m.protects] }}>
                    <MeterIcon meter={m.protects} />
                  </span>
                ) : (
                  <span className="inline-flex rounded-md bg-edge p-1">
                    <StarIcon />
                  </span>
                )}
                {m.label}
              </span>
              <span className="mt-1 block text-base font-normal text-muted">{m.blurb}</span>
            </ChoiceCard>
          );
        })}
      </div>
      <div className="mt-5">
        <PrimaryButton disabled={sel.length !== step.pick} onClick={() => onDone(pickCrew(game, step, sel))}>
          Welcome them aboard ({sel.length}/{step.pick})
        </PrimaryButton>
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
