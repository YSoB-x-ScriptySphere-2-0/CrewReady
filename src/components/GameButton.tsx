// Chunky, toy-like controls: 3 px ink outline, a solid lip underneath, squash on press.
// BUILD_SEQUENCE.md §4.3, §4.4, §4.7.
import { useEffect, useState, type ReactNode } from 'react';
import { Check, type LucideIcon } from 'lucide-react';
import { METER_NAMES, type Meter } from '../engine/types';
import { MeterBadge, StarIcon } from './meters';
import { reducedMotion, usePress } from './motion';

type Variant = 'go' | 'plain' | 'small';

const SIZE: Record<Variant, string> = {
  go: 'min-h-[3.25rem] sm:min-h-[3.5rem] px-4 sm:px-7 py-2 text-[1.125rem] sm:text-[1.375rem]',
  plain: 'min-h-[2.75rem] sm:min-h-[3rem] px-3.5 sm:px-5 py-1.5 text-base sm:text-xl',
  small: 'min-h-[2.5rem] sm:min-h-[2.75rem] px-3 sm:px-4 py-1 text-sm sm:text-[1.0625rem]',
};
/** Locked look for any variant: dark and flat, so it never looks like a live main action. */
const LOCKED = 'bg-locked text-muted [--lip:var(--color-locked-lip)]';

const LOOK: Record<Variant, string> = {
  // go: the one main action per screen. Cyan, a gentle top-to-bottom gradient, its lip, one soft halo.
  go: 'min-h-[3.25rem] sm:min-h-[3.5rem] px-4 sm:px-7 py-2 text-[1.125rem] sm:text-[1.375rem] bg-gradient-to-b from-[#4fe6f2] to-go text-go-text border-go-lip [--lip:var(--color-go-lip)] halo',
  // second: an outlined pill, dark fill, white text.
  plain: 'min-h-[2.75rem] sm:min-h-[3rem] px-3.5 sm:px-5 py-1.5 text-base sm:text-xl bg-panel/70 text-text border-text/30',
  small: 'min-h-[2.5rem] sm:min-h-[2.75rem] px-3 sm:px-4 py-1 text-sm sm:text-[1.0625rem] bg-panel/70 text-text border-text/30',
};
/** `go` is a rounded rectangle; the other two are pills. */
const SHAPE: Record<Variant, string> = { go: 'rounded-tile', plain: 'rounded-full', small: 'rounded-full' };

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
      className={`toy shine inline-flex items-center justify-center gap-2 ${SHAPE[variant]} font-display leading-snug font-extrabold tracking-wide text-center max-w-full break-words ${disabled ? `${SIZE[variant]} ${LOCKED}` : LOOK[variant]} ${full ? 'w-full' : ''} ${className}`}
    >
      {Icon ? <Icon size={variant === 'small' ? 18 : 22} strokeWidth={2.5} aria-hidden className="shrink-0" /> : null}
      <span className="py-0.5 max-w-full text-center leading-snug break-words">{children}</span>
    </button>
  );
}

/** One change to a meter or to the stars. */
export type Change = { meter: Meter | 'stars'; amount: number };

/** "−15" or "+10" with the meter's badge. Loss: white on red. Gain: dark on green (§4.3). */
export function ChangeChip({ change, size = 'md' }: { change: Change; size?: 'sm' | 'md' }) {
  const { meter, amount } = change;
  const up = amount > 0;
  const name = meter === 'stars' ? 'Stars' : METER_NAMES[meter];
  const text = up ? `+${amount}` : `−${-amount}`;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border-2 border-line font-display font-extrabold tabular-nums ${
        up ? 'bg-[#3ddc84] text-go-text' : 'bg-[#d93a3a] text-white'
      } ${size === 'sm' ? 'py-0.5 pr-2.5 pl-0.5 text-base' : 'py-0.5 pr-3 pl-0.5 text-lg'}`}
      aria-label={`${name} ${up ? 'plus' : 'minus'} ${Math.abs(amount)}`}
    >
      {meter === 'stars' ? (
        <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-line bg-panel" aria-hidden>
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
      className={`toy flex w-full items-center gap-3 rounded-tile p-3 text-left text-text sm:p-4 ${
        disabled ? LOCKED : marked ? 'bg-panel-up border-go [--lip:var(--color-go-lip)]' : 'bg-panel'
      } ${state === 'chosen' ? 'anim-stamp' : ''} ${state === 'gone' ? 'is-gone' : ''} ${state !== 'idle' ? 'cursor-default' : ''} ${className}`}
    >
      {picture ?? (Icon ? (
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[0.75rem] border-2 border-line bg-space" aria-hidden>
          <Icon size={30} strokeWidth={2.25} />
        </span>
      ) : null)}
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg sm:text-[22px] leading-snug font-extrabold break-words">{label}</span>
        {note ? <span className="mt-0.5 block font-sans text-sm sm:text-base leading-snug text-muted break-words">{note}</span> : null}
        {costs?.length ? (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {costs.map((c) => (
              <ChangeChip key={c.meter} change={c} size="sm" />
            ))}
          </span>
        ) : null}
      </span>
      {marked ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-go text-go-text" aria-hidden>
          <Check size={20} strokeWidth={3.5} />
        </span>
      ) : null}
    </button>
  );
}

/**
 * One option as an upright card (§4.6): a big icon or picture on top, a short label under it, three in a row.
 * `selected` is "Look first": a 3 px `go` border, lifted. `arrows` shows ▲/▼ per meter it will touch
 * (one for 5–10, two for 15–20, three for 25+); R3 fills them in. `state` stamps or slides the card away.
 */
export function ChoiceCard({
  label,
  icon: Icon,
  picture,
  selected,
  state = 'idle',
  onClick,
  disabled,
  children,
  className = '',
  innerRef,
  ariaLabel,
}: {
  label: ReactNode;
  /** The full words for screen readers when `label` is a short caption. */
  ariaLabel?: string;
  icon?: LucideIcon;
  picture?: ReactNode;
  selected?: boolean;
  state?: TileState;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  innerRef?: React.Ref<HTMLButtonElement>;
  /** The arrows row (Look first). */
  children?: ReactNode;
  className?: string;
}) {
  const locked = disabled || state !== 'idle';
  const press = usePress(locked);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    if (state !== 'gone') return setCollapsed(false);
    const t = setTimeout(() => setCollapsed(true), reducedMotion() ? 0 : 320);
    return () => clearTimeout(t);
  }, [state]);
  if (collapsed) return null;
  const marked = selected || state === 'chosen';
  return (
    <button
      ref={innerRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={ariaLabel}
      aria-hidden={state === 'gone' ? true : undefined}
      tabIndex={state === 'gone' ? -1 : undefined}
      {...press}
      className={`toy flex min-h-[5.5rem] sm:min-h-[6.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-[0.25rem] rounded-tile p-[0.375rem] sm:p-[0.5rem] text-center text-text overflow-hidden ${
        disabled ? LOCKED : marked ? '-translate-y-1 border-[3px] border-go bg-panel-up [--lip:var(--color-go-lip)]' : 'bg-panel'
      } ${state === 'chosen' ? 'anim-stamp' : ''} ${state === 'gone' ? 'is-gone' : ''} ${state !== 'idle' ? 'cursor-default' : ''} ${className}`}
    >
      {picture ?? (Icon ? (
        <span className="grid h-[2.5rem] w-[2.5rem] sm:h-[3rem] sm:w-[3rem] shrink-0 place-items-center rounded-full bg-space" aria-hidden>
          <Icon size={24} strokeWidth={2.25} />
        </span>
      ) : null)}
      <span className="block font-display text-[0.8125rem] sm:text-[0.875rem] leading-[1.18] font-extrabold px-0.5 break-words line-clamp-2 max-w-full">{label}</span>
      {children}
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
      className={`toy !mb-[0.45rem] grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full ${
        tone === 'go' || pressed ? 'bg-go text-go-text border-go-lip [--lip:var(--color-go-lip)]' : 'bg-panel/70 text-text border-text/30'
      } ${className}`}
    >
      <Icon size={26} strokeWidth={2.75} aria-hidden />
    </button>
  );
}
