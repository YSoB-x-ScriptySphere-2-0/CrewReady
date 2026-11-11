// Shared parts used on every screen — BUILD_SEQUENCE.md §4.4.
// Colour comes from the sky; everything the player reads sits on a paper card.
import { createContext, useContext, type ReactNode } from 'react';
import { Droplets, Shield, Sprout, Star, Zap, type LucideIcon } from 'lucide-react';
import { METERS, METER_NAMES, type Meter, type Outcome } from '../engine/types';
import { BUILT_SCREENS, useGame } from '../store/game';

// ---------- meters: one icon and one colour each, used nowhere else ----------

export const METER_ICON: Record<Meter, LucideIcon> = { P: Zap, L: Droplets, F: Sprout, S: Shield };
/** CSS colour value for each meter (for bars, swatches and borders). */
export const METER_COLOR: Record<Meter, string> = {
  P: 'var(--color-power)',
  L: 'var(--color-air)',
  F: 'var(--color-food)',
  S: 'var(--color-shield)',
};

export function MeterIcon({ meter, size = 20 }: { meter: Meter; size?: number }) {
  const Icon = METER_ICON[meter];
  return <Icon size={size} strokeWidth={2} aria-hidden className="shrink-0 text-ink" />;
}

/** Ink star on a gold disc — science stars. */
export function StarIcon({ size = 20 }: { size?: number }) {
  return <Star size={size} strokeWidth={2} aria-hidden className="shrink-0 text-ink" fill="var(--color-star)" />;
}

// ---------- sky and cards ----------

export type Place = 'earth' | 'space' | 'mars' | 'dust' | 'alarm' | 'success';
const SKY: Record<Place, string> = {
  earth: 'bg-sky-earth',
  space: 'bg-sky-space',
  mars: 'bg-sky-mars',
  dust: 'bg-sky-dust',
  alarm: 'bg-sky-alarm',
  success: 'sky-success',
};

/** True while rendering directly on the sky (not on a card): buttons switch to their on-sky look. */
const OnSky = createContext(false);

/** Full-screen background in the colour of where the player is. */
export function Sky({ place, children, nav }: { place: Place; children: ReactNode; nav?: ReactNode }) {
  const dark = place !== 'success';
  return (
    <OnSky.Provider value={dark}>
      <div className={`flex min-h-screen flex-col ${SKY[place]} ${dark ? 'on-sky text-paper' : 'text-ink'}`}>
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pt-5 pb-8">{children}</main>
        {nav}
      </div>
    </OnSky.Provider>
  );
}

/** Paper card, ink text, 20 px corners, one soft shadow. */
export function MissionCard({ children, className = '', as: Tag = 'section' }: { children: ReactNode; className?: string; as?: 'section' | 'div' }) {
  return (
    <OnSky.Provider value={false}>
      <Tag className={`rise rounded-card bg-paper p-4 text-ink shadow-card sm:p-6 ${className}`}>{children}</Tag>
    </OnSky.Provider>
  );
}

// ---------- buttons ----------

type BtnProps = { children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string; ariaLabel?: string };

/** The one main action on a screen. Ink on paper; paper on sky. */
export function PrimaryButton({ children, onClick, disabled, className = '', ariaLabel }: BtnProps) {
  const sky = useContext(OnSky);
  const look = sky ? 'bg-paper text-ink border-ink' : 'bg-ink text-paper border-ink';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-btn border-2 px-6 py-2 text-lg font-bold transition-transform active:translate-y-px ${look} ${className}`}
    >
      {children}
    </button>
  );
}

/** Everything that is not the main action. */
export function QuietButton({ children, onClick, disabled, className = '', ariaLabel }: BtnProps) {
  const sky = useContext(OnSky);
  const look = sky ? 'border-paper/80 text-paper hover:bg-paper/10' : 'border-ink text-ink hover:bg-ink/5';
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-btn border-2 bg-transparent px-4 py-2 text-base font-bold ${look} ${className}`}
    >
      {children}
    </button>
  );
}

/** A full-width pressable card for one option. */
export function ChoiceCard({
  children,
  onClick,
  selected,
  faded,
  disabled,
  pressed,
}: {
  children: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  faded?: boolean;
  disabled?: boolean;
  /** Set for toggles (pick 2 of 4); leave undefined for one-tap choices. */
  pressed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={`block min-h-14 w-full rounded-btn border-2 border-ink p-3 text-left font-sans text-lg font-bold transition sm:p-4 ${
        selected ? 'bg-ink/8 outline-[3px] outline-offset-2 outline-ink' : 'bg-white hover:bg-edge/40'
      } ${faded ? 'opacity-35' : ''}`}
    >
      {children}
    </button>
  );
}

// ---------- meters ----------

/** One meter: icon, name, number, bar. Danger and "Low" at 20 or below. Shows a change for a moment. */
export function MeterBar({ meter, value, delta }: { meter: Meter; value: number; delta?: number }) {
  const low = value <= 20;
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-1">
        <span className="flex items-center gap-1.5 text-base font-bold whitespace-nowrap">
          <MeterIcon meter={meter} />
          {METER_NAMES[meter]}
        </span>
        {delta ? (
          <span key={`${delta}-${value}`} className={`delta-flash font-display text-base font-bold tabular-nums ${delta > 0 ? 'text-good' : 'text-danger'}`}>
            {delta > 0 ? `+${delta}` : `−${-delta}`}
          </span>
        ) : null}
      </div>
      <div className="mt-1 flex items-center gap-2">
      <div
        className="h-3.5 flex-1 overflow-hidden rounded-full border-2 border-ink bg-white"
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={METER_NAMES[meter]}
      >
        <div
          className="h-full rounded-r-full transition-[width] duration-700 ease-out"
          style={{ width: `${value}%`, background: low ? 'var(--color-danger)' : METER_COLOR[meter] }}
        />
      </div>
        <span className="w-8 text-right font-display text-xl font-bold tabular-nums">{value}</span>
      </div>
      {low ? <p className="mt-0.5 text-sm font-bold text-danger">Low</p> : null}
    </div>
  );
}

/** The four meters, on their own paper card. */
export function Meters({ meters, delta, top }: { meters: Record<Meter, number>; delta?: Partial<Record<Meter, number>>; top?: ReactNode }) {
  return (
    <MissionCard className="!p-4">
      {top}
      <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4" aria-label="Outpost meters">
        {METERS.map((m) => (
          <MeterBar key={m} meter={m} value={meters[m]} delta={delta?.[m]} />
        ))}
      </div>
    </MissionCard>
  );
}

// ---------- data and sources ----------

export type BadgeKind = 'NASA LIVE' | 'NASA ARCHIVE' | 'GAME ESTIMATE' | 'FICTION';
const BADGE_LOOK: Record<BadgeKind, string> = {
  'NASA LIVE': 'bg-good text-white border-good',
  'NASA ARCHIVE': 'bg-ink text-paper border-ink',
  'GAME ESTIMATE': 'bg-transparent text-ink border-ink border-dashed',
  FICTION: 'bg-transparent text-ink border-ink',
};

export function Badge({ kind }: { kind: BadgeKind }) {
  return <span className={`inline-block rounded-md border-2 px-2 py-0.5 text-sm font-extrabold tracking-wide ${BADGE_LOOK[kind]}`}>{kind}</span>;
}

/** One line at the foot of a card. Opens the Sources page once it exists. */
export function SourceLine({ text }: { text: string }) {
  const go = useGame((s) => s.go);
  const line = `Source: ${text}`;
  return BUILT_SCREENS.has('sources') ? (
    <button onClick={() => go('sources')} className="mt-4 block w-full border-t-2 border-edge pt-2 text-left font-sans text-sm text-muted underline-offset-4 hover:underline">
      {line}
    </button>
  ) : (
    <p className="mt-4 border-t-2 border-edge pt-2 text-sm text-muted">{line}</p>
  );
}

/** Real NASA data: a picture or figure, one kid sentence, a badge and the date. */
export function DataCard({
  badge,
  date,
  sentence,
  figure,
  image,
  source,
}: {
  badge: BadgeKind;
  date?: string;
  sentence: string;
  figure?: ReactNode;
  image?: { src: string; alt: string; credit: string };
  source?: string;
}) {
  return (
    <MissionCard as="div" className="!p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge kind={badge} />
        {date ? <span className="text-sm text-muted">{date}</span> : null}
      </div>
      {image ? (
        <figure className="mt-3">
          <img src={image.src} alt={image.alt} className="aspect-video w-full rounded-btn border-2 border-ink object-cover" loading="lazy" />
          <figcaption className="mt-1 text-sm text-muted">{image.credit}</figcaption>
        </figure>
      ) : null}
      {figure ? <div className="mt-3 font-display text-3xl font-extrabold">{figure}</div> : null}
      <p className="mt-2">{sentence}</p>
      {source ? <SourceLine text={source} /> : null}
    </MissionCard>
  );
}

// ---------- outcome ----------

/** What just happened: the reason lines and what moved, each change in its meter's colour. */
export function OutcomePanel({ outcome, children }: { outcome: Outcome; children?: ReactNode }) {
  const moved = METERS.filter((m) => outcome.delta[m]);
  return (
    <MissionCard>
      <ul className="space-y-1 text-lg">
        {outcome.reasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {moved.map((m) => {
          const d = outcome.delta[m]!;
          return (
            <span key={m} className="inline-flex items-center gap-1.5 rounded-btn border-2 bg-white px-3 py-1 font-bold" style={{ borderColor: METER_COLOR[m] }}>
              <MeterIcon meter={m} size={18} />
              {METER_NAMES[m]}
              <span className={d > 0 ? 'text-good' : 'text-danger'}>{d > 0 ? `+${d}` : `−${-d}`}</span>
            </span>
          );
        })}
        {outcome.starsDelta ? (
          <span className="inline-flex items-center gap-1.5 rounded-btn border-2 border-star bg-white px-3 py-1 font-bold">
            <StarIcon size={18} />
            Stars {outcome.starsDelta > 0 ? `+${outcome.starsDelta}` : `−${-outcome.starsDelta}`}
          </span>
        ) : null}
        {!moved.length && !outcome.starsDelta ? <span className="text-muted">No meters moved — yet.</span> : null}
      </div>
      {children ? <div className="mt-5">{children}</div> : null}
    </MissionCard>
  );
}
