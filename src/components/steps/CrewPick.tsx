// Level 6 — pick your crew. Five experts as trading cards in one row, each framed in the colour of the meter
// it protects (gold for the Scientist's stars). Pick three; a picked card flips to show a tick.
import { useState } from 'react';
import { Check, UsersRound } from 'lucide-react';
import { pickCrew } from '../../engine/engine';
import { METERS, type CrewStep, type GameState } from '../../engine/types';
import { ChangeChip, GameButton } from '../GameButton';
import { METER_COLOR, MeterBadge, StarIcon } from '../meters';
import { usePress } from '../motion';
import type { Done } from './shared';
import { useI18n, tMission } from '../../content/i18n';

type Member = CrewStep['members'][number];

function Portrait({ m, size }: { m: Member; size: number }) {
  return m.protects ? (
    <MeterBadge meter={m.protects} size={size} />
  ) : (
    <span className="grid shrink-0 place-items-center rounded-full border-2 border-line bg-star" style={{ width: size, height: size }} aria-hidden>
      <StarIcon size={Math.round(size * 0.55)} />
    </span>
  );
}

function CrewCard({ m, picked, full, nudge, onClick }: { m: Member; picked: boolean; full: boolean; nudge: number; onClick: () => void }) {
  const lang = useI18n((s) => s.lang);
  const press = usePress();
  const frame = m.protects ? METER_COLOR[m.protects] : 'var(--color-star)';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={picked}
      aria-label={`${tMission(m.label)}. ${tMission(m.blurb)}${picked ? (lang === 'bn' ? ' নির্বাচিত।' : ' Picked.') : ''}`}
      {...press}
      className={`toy flip-card block h-full min-h-0 w-full rounded-tile bg-transparent p-0 text-text ${full && !picked && nudge ? 'anim-wiggle' : ''}`}
      key={full && !picked ? nudge : 0}
    >
      <span className={`flip-inner h-full ${picked ? 'is-flipped' : ''}`}>
        {/* Front: the trading card. */}
        <span className="flip-face flex h-full flex-col items-center rounded-[0.875rem] px-[0.25rem] pt-[0.375rem] pb-[0.25rem]" style={{ background: `color-mix(in srgb, ${frame} 40%, #14204d)` }}>
          <span className="rounded-full border-2 border-line bg-panel p-[0.125rem]">
            <Portrait m={m} size={36} />
          </span>
          <span className="mt-[0.25rem] text-center font-display text-[0.8125rem] leading-tight font-extrabold">{tMission(m.label)}</span>
          <span className="mt-[0.125rem] text-center text-[0.6875rem] leading-tight">{tMission(m.blurb)}</span>
        </span>
        {/* Back: on the team. */}
        <span className="flip-face flip-back flex h-full flex-col items-center justify-center gap-[0.25rem] rounded-[0.875rem] bg-good/40 px-[0.25rem] py-[0.375rem]">
          <span className="grid h-[2.5rem] w-[2.5rem] place-items-center rounded-full border-2 border-line bg-good text-white">
            <Check size={24} strokeWidth={3.5} aria-hidden />
          </span>
          <span className="text-center font-display text-[0.8125rem] leading-tight font-extrabold">{tMission(m.label)}</span>
          <span className="font-display text-[0.75rem] font-extrabold">{lang === 'bn' ? 'দলে যোগ দিয়েছে!' : 'On the team!'}</span>
        </span>
      </span>
    </button>
  );
}

export function CrewPick({ step, game, onDone }: { step: CrewStep; game: GameState; onDone: Done }) {
  const lang = useI18n((s) => s.lang);
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
    <div className="flex h-full min-h-0 flex-col gap-[0.5rem]">
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-[0.375rem]">
        {step.members.map((m) => (
          <CrewCard key={m.id} m={m} picked={sel.includes(m.id)} full={full} nudge={nudge} onClick={() => toggle(m.id)} />
        ))}
      </div>

      <div className="flex items-center gap-[0.5rem]">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-[0.5rem] gap-y-[0.125rem] rounded-tile border-2 border-line bg-panel px-[0.625rem] py-[0.25rem]" aria-live="polite">
          <span className="font-display text-[0.875rem] sm:text-[0.9375rem] font-extrabold leading-snug">
            {full
              ? (lang === 'bn' ? 'দল পূর্ণ! পরিবর্তন করতে ট্যাপ করো।' : 'Team full. Tap a card to swap.')
              : (lang === 'bn' ? `আরও ${step.pick - sel.length} জন বেছে নাও।` : `Pick ${step.pick - sel.length} more.`)}
          </span>
          {sel.length ? (
            <span className="flex flex-wrap items-center gap-[0.25rem]">
              <span className="text-[0.75rem] text-muted">
                {lang === 'bn' ? 'খাবার ও বাতাসের খরচ:' : 'They eat and breathe:'}
              </span>
              {cost.map((c) => (
                <ChangeChip key={c.meter} change={c} size="sm" />
              ))}
            </span>
          ) : null}
        </div>
        <GameButton
          variant="go"
          icon={UsersRound}
          disabled={!full}
          onClick={() => onDone(pickCrew(game, step, sel))}
          className="!min-h-[2.875rem] !px-3 sm:!px-4 !text-xs sm:!text-sm leading-snug break-words max-w-[14rem]"
        >
          {lang === 'bn'
            ? `দলে স্বাগত (${sel.length}/${step.pick})`
            : `Welcome aboard (${sel.length}/${step.pick})`}
        </GameButton>
      </div>
    </div>
  );
}
