// Level 6 — pick your crew. Five experts as trading cards, each framed in the colour of the meter it
// protects (gold for the Scientist's stars). Pick three; a picked card flips to show a green tick.
import { useState } from 'react';
import { Check, UsersRound } from 'lucide-react';
import { pickCrew } from '../../engine/engine';
import { METERS, type CrewStep, type GameState } from '../../engine/types';
import { ChangeChip, GameButton } from '../GameButton';
import { METER_COLOR, MeterBadge, StarIcon } from '../meters';
import { usePress } from '../motion';
import type { Done } from './shared';

type Member = CrewStep['members'][number];

function Portrait({ m, size }: { m: Member; size: number }) {
  return m.protects ? (
    <MeterBadge meter={m.protects} size={size} />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full border-[3px] border-ink bg-star" style={{ width: size, height: size }} aria-hidden>
      <StarIcon size={Math.round(size * 0.55)} />
    </span>
  );
}

function CrewCard({ m, picked, full, nudge, onClick }: { m: Member; picked: boolean; full: boolean; nudge: number; onClick: () => void }) {
  const press = usePress();
  const frame = m.protects ? METER_COLOR[m.protects] : 'var(--color-star)';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={picked}
      aria-label={`${m.label}. ${m.blurb}${picked ? ' Picked.' : ''}`}
      {...press}
      className={`toy flip-card block w-full rounded-tile bg-transparent p-0 text-ink ${full && !picked && nudge ? 'anim-wiggle' : ''}`}
      key={full && !picked ? nudge : 0}
      style={{ ['--lip' as string]: 'var(--color-ink)' }}
    >
      <span className={`flip-inner ${picked ? 'is-flipped' : ''}`}>
        {/* Front: the trading card. */}
        <span className="flip-face flex min-h-[188px] flex-col items-center rounded-[13px] px-2 pt-3 pb-2" style={{ background: `color-mix(in srgb, ${frame} 28%, white)` }}>
          <span className="rounded-full border-[3px] border-ink bg-paper p-1.5">
            <Portrait m={m} size={60} />
          </span>
          <span className="mt-2 text-center font-display text-lg leading-tight font-extrabold">{m.label}</span>
          <span className="mt-1 text-center text-base leading-snug">{m.blurb}</span>
        </span>
        {/* Back: on the team. */}
        <span className="flip-face flip-back flex min-h-[188px] flex-col items-center justify-center gap-2 rounded-[13px] bg-[#d8f3e1] px-2 py-3">
          <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-ink bg-good text-white">
            <Check size={32} strokeWidth={3.5} aria-hidden />
          </span>
          <span className="text-center font-display text-lg leading-tight font-extrabold">{m.label}</span>
          <span className="flex items-center gap-1.5 font-display text-base font-extrabold">
            <Portrait m={m} size={26} /> On the team!
          </span>
        </span>
      </span>
    </button>
  );
}

export function CrewPick({ step, game, onDone }: { step: CrewStep; game: GameState; onDone: Done }) {
  const [sel, setSel] = useState<string[]>([]);
  const [nudge, setNudge] = useState(0);
  const full = sel.length >= step.pick;
  const toggle = (id: string) => {
    if (sel.includes(id)) return setSel(sel.filter((x) => x !== id));
    if (full) return setNudge((n) => n + 1);
    setSel([...sel, id]);
  };
  // Everyone eats and breathes: what the picked crew costs, for honesty.
  const cost = METERS.filter((m) => typeof step.costPerPerson[m] === 'number').map((m) => ({ meter: m, amount: (step.costPerPerson[m] as number) * sel.length }));

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3 lg:grid-cols-5">
        {step.members.map((m) => (
          <CrewCard key={m.id} m={m} picked={sel.includes(m.id)} full={full} nudge={nudge} onClick={() => toggle(m.id)} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-tile border-[3px] border-ink bg-paper px-3 py-2 text-ink" aria-live="polite">
        <span className="font-display text-lg font-extrabold">
          {full ? 'Team full. Tap a card to swap.' : `Pick ${step.pick - sel.length} more.`}
        </span>
        {sel.length ? (
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="text-base text-muted">They eat and breathe:</span>
            {cost.map((c) => (
              <ChangeChip key={c.meter} change={c} size="sm" />
            ))}
          </span>
        ) : null}
      </div>

      <div className="mt-3">
        <GameButton variant="go" icon={UsersRound} disabled={!full} onClick={() => onDone(pickCrew(game, step, sel))}>
          Welcome aboard ({sel.length}/{step.pick})
        </GameButton>
      </div>
    </div>
  );
}
