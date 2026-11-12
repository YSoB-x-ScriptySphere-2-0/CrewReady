// Chunky, toy-like controls: 3 px ink outline, a solid lip underneath, squash on press.
// BUILD_SEQUENCE.md §4.3, §4.4, §4.7.
import { useEffect, useState, type ReactNode } from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { METER_NAMES, type Meter } from '../engine/types';
import { MeterBadge, StarIcon } from './meters';
import { reducedMotion, usePress } from './motion';

type Variant = 'go' | 'plain' | 'small';

const SIZE: Record<Variant, string> = { go: 'min-h-14 px-7 text-[22px]', plain: 'min-h-13 px-5 text-xl', small: 'min-h-12 px-4 text-[19px]' };
/** Locked look for any variant: grey with a grey lip, so it never looks like a live main action. */
const LOCKED = 'bg-locked text-muted [--lip:var(--color-locked-lip)]';

const LOOK: Record<Variant, string> = {
  // go: the one main action per screen. 56 px tall, 22 px bold (large text, so white on pink passes 3:1).
  go: 'min-h-14 px-7 text-[22px] bg-go text-white [--lip:var(--color-go-lip)]',
  plain: 'min-h-13 px-5 text-xl bg-paper text-ink',
  // 19 px bold counts as large text.
  small: 'min-h-12 px-4 text-[19px] bg-paper text-ink',
};

export function GameButton({
  children,
  onClick,
  variant = 'plain',
  icon: Icon,
  disabled,
  className = '',
  ariaLabel,
  full,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: Variant;
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  full?: boolean;
  type?: 'button' | 'submit';
}) {
  const press = usePress(disabled);
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...press}
      className={`toy shine inline-flex items-center justify-center gap-2 rounded-tile font-display leading-none font-extrabold tracking-wide ${disabled ? `${SIZE[variant]} ${LOCKED}` : LOOK[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {Icon ? <Icon size={variant === 'small' ? 20 : 24} strokeWidth={2.5} aria-hidden /> : null}
      <span className="pt-0.5">{children}</span>
    </button>
  );
}

/** One change to a meter or to the stars. */
export type Change = { meter: Meter | 'stars'; amount: number };

/** "−15" or "+10" with the meter's badge. Ink text on a light red or green tint, so it reads anywhere. */
export function ChangeChip({ change, size = 'md' }: { change: Change; size?: 'sm' | 'md' }) {
  const { meter, amount } = change;
  const up = amount > 0;
  const name = meter === 'stars' ? 'Stars' : METER_NAMES[meter];
  const text = up ? `+${amount}` : `−${-amount}`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-ink font-display font-extrabold text-ink tabular-nums ${
        up ? 'bg-[#d8f3e1]' : 'bg-[#ffe0dc]'
      } ${size === 'sm' ? 'py-0.5 pr-2.5 pl-0.5 text-base' : 'py-0.5 pr-3 pl-0.5 text-lg'}`}
      aria-label={`${name} ${up ? 'plus' : 'minus'} ${Math.abs(amount)}`}
    >
      {meter === 'stars' ? (
        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-paper" aria-hidden>
          <StarIcon size={15} />
        </span>
      ) : (
        <MeterBadge meter={meter} size={size === 'sm' ? 24 : 28} />
      )}
      <span aria-hidden>{text}</span>
    </span>
  );
}

export type TileState = 'idle' | 'chosen' | 'gone';

/**
 * A big pressable tile for one option: icon or picture on the left, label in Baloo, optional cost chips.
 * `state="chosen"` stamps it down; `state="gone"` slides it away. `pressed` is for pick-several steps.
 */
export function ChoiceTile({
  label,
  icon: Icon,
  picture,
  costs,
  note,
  state = 'idle',
  pressed,
  onClick,
  disabled,
  className = '',
}: {
  label: ReactNode;
  icon?: LucideIcon;
  picture?: ReactNode;
  costs?: Change[];
  note?: ReactNode;
  state?: TileState;
  pressed?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
}) {
  const locked = disabled || state !== 'idle';
  const press = usePress(locked);
  // A tile that slid away closes its gap once the slide is over.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (state !== 'gone') return setCollapsed(false);
    const t = setTimeout(() => setCollapsed(true), reducedMotion() ? 0 : 320);
    return () => clearTimeout(t);
  }, [state]);
  if (collapsed) return null;
  const marked = state === 'chosen' || pressed;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      aria-hidden={state === 'gone' ? true : undefined}
      tabIndex={state === 'gone' ? -1 : undefined}
      {...press}
      className={`toy flex w-full items-center gap-3 rounded-tile p-3 text-left text-ink sm:p-4 ${
        disabled ? LOCKED : marked ? 'bg-[#ffe3ec] [--lip:#e9a3bb]' : 'bg-white'
      } ${state === 'chosen' ? 'anim-stamp' : ''} ${state === 'gone' ? 'is-gone' : ''} ${state !== 'idle' ? 'cursor-default' : ''} ${className}`}
    >
      {picture ?? (Icon ? (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[12px] border-[3px] border-ink bg-edge" aria-hidden>
          <Icon size={30} strokeWidth={2.25} />
        </span>
      ) : null)}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl leading-tight font-extrabold sm:text-[22px]">{label}</span>
        {note ? <span className="mt-0.5 block font-sans text-base text-muted">{note}</span> : null}
        {costs?.length ? (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {costs.map((c) => (
              <ChangeChip key={c.meter} change={c} size="sm" />
            ))}
          </span>
        ) : null}
      </span>
      {marked ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-go text-white" aria-hidden>
          <Check size={20} strokeWidth={3.5} />
        </span>
      ) : null}
    </button>
  );
}

/** A round icon-only toy button (Home, Ask Twinkle). 52 px, with a label for screen readers. */
export function RoundButton({
  icon: Icon,
  label,
  onClick,
  tone = 'plain',
  pressed,
  className = '',
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  tone?: 'plain' | 'go';
  pressed?: boolean;
  className?: string;
}) {
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      {...press}
      className={`toy !mb-[7px] grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full ${
        tone === 'go' || pressed ? 'bg-go text-white [--lip:var(--color-go-lip)]' : 'bg-paper text-ink'
      } ${className}`}
    >
      <Icon size={26} strokeWidth={2.75} aria-hidden />
    </button>
  );
}
