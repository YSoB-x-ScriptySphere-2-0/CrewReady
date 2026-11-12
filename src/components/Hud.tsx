// The game HUD: four meter pills and the star counter, always in the same spot at the top of a level.
// It owns the gain/loss feedback (§4.4): a loss shakes the pill, flashes it red, counts down and floats
// a "−15" chip; a gain pops it, counts up and floats a "+10" chip. Phones: 2×2. Laptops: one row.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { METERS, METER_NAMES, type Meter } from '../engine/types';
import { METER_COLOR, MeterBadge, StarIcon } from './meters';
import { useCountTo } from './motion';

let seq = 0;
type Fx = { dir: 'up' | 'down'; id: number } | null;
type Chip = { id: number; d: number };

/** Watches a number and reports each change: a one-shot effect state and the floating chips. */
function useChangeFx(value: number) {
  const prev = useRef(value);
  const [fx, setFx] = useState<Fx>(null);
  const [chips, setChips] = useState<Chip[]>([]);
  useEffect(() => {
    const d = value - prev.current;
    prev.current = value;
    if (!d) return;
    const id = ++seq;
    setFx({ dir: d > 0 ? 'up' : 'down', id });
    setChips((c) => [...c, { id, d }]);
    // Not cleared on the next change, so quick changes each finish their own flash and chip.
    setTimeout(() => setFx((f) => (f?.id === id ? null : f)), 600);
    setTimeout(() => setChips((c) => c.filter((x) => x.id !== id)), 760);
  }, [value]);
  return { fx, chips };
}

/** "+10" / "−15" that floats up from a HUD pill and fades. With reduced motion it simply shows, then goes. */
export function FloatChip({ d }: { d: number }) {
  const up = d > 0;
  return (
    <span
      aria-hidden
      className={`anim-float-chip pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border-[3px] border-ink px-2.5 font-display text-xl leading-snug font-extrabold whitespace-nowrap text-white tabular-nums ${
        up ? 'bg-good' : 'bg-danger'
      }`}
    >
      {up ? `+${d}` : `−${-d}`}
    </span>
  );
}

export function MeterPill({ meter, value }: { meter: Meter; value: number }) {
  const shown = useCountTo(value, 500);
  const { fx, chips } = useChangeFx(value);
  const low = value <= 20;
  const flash = fx?.dir === 'down' ? 'bg-danger text-white' : fx?.dir === 'up' ? 'bg-[#d8f3e1] text-ink' : 'bg-paper text-ink';
  const motion = fx?.dir === 'down' ? 'anim-shake-x' : fx?.dir === 'up' ? 'anim-pop' : '';
  return (
    <div className="relative min-w-0" data-hud-target={meter}>
      <div
        key={fx?.id ?? 0}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${METER_NAMES[meter]}${low ? ', low' : ''}`}
        className={`flex items-center gap-2 rounded-full border-[3px] border-ink py-1 pr-3 pl-1 shadow-[0_3px_0_var(--color-ink)] ${flash} ${motion}`}
      >
        <MeterBadge meter={meter} size={36} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="font-display text-[22px] leading-none font-extrabold tabular-nums">{shown}</span>
            {low ? (
              <span className="rounded-full border-2 border-ink bg-danger px-1.5 font-display text-[13px] leading-tight font-extrabold tracking-wider text-white">
                LOW
              </span>
            ) : null}
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full border-2 border-ink bg-white" aria-hidden>
            <div className="h-full rounded-r-full transition-[width] duration-500 ease-out" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: METER_COLOR[meter] }} />
          </div>
        </div>
      </div>
      {chips.map((c) => (
        <FloatChip key={c.id} d={c.d} />
      ))}
    </div>
  );
}

/** Science stars. A flying star (`flyToHud`) lands here; the counter pops when the number goes up. */
export function StarCounter({ n }: { n: number }) {
  const shown = useCountTo(n, 400);
  const { fx, chips } = useChangeFx(n);
  return (
    <div className="relative" data-hud-target="stars">
      <div
        key={fx?.id ?? 0}
        className={`flex items-center gap-1.5 rounded-full border-[3px] border-ink bg-paper py-1 pr-3.5 pl-1 text-ink shadow-[0_3px_0_var(--color-ink)] ${fx ? 'anim-pop' : ''}`}
        aria-label={`${n} science stars`}
        role="status"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-star" aria-hidden>
          <StarIcon size={20} />
        </span>
        <span className="font-display text-[22px] leading-none font-extrabold tabular-nums" aria-hidden>
          {shown}
        </span>
      </div>
      {chips.map((c) => (
        <FloatChip key={c.id} d={c.d} />
      ))}
    </div>
  );
}

/**
 * Sticky top bar inside levels. `lead` is the left slot (Home button, level number).
 * Phone: lead and stars on one row, the four meters 2×2 below. Laptop: all on one row.
 */
export function Hud({ meters, stars, lead }: { meters: Record<Meter, number>; stars: number; lead?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b-[3px] border-ink bg-ink text-paper px-3 pt-2 pb-2.5 sm:px-4" aria-label="Outpost meters">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2.5 lg:flex-nowrap">
        <div className="order-1 flex min-w-0 flex-1 items-center gap-2 lg:flex-none">{lead}</div>
        <div className="order-3 grid w-full grid-cols-2 gap-x-2.5 gap-y-2 sm:grid-cols-4 lg:order-2 lg:flex-1">
          {METERS.map((m) => (
            <MeterPill key={m} meter={m} value={meters[m]} />
          ))}
        </div>
        <div className="order-2 lg:order-3">
          <StarCounter n={stars} />
        </div>
      </div>
    </header>
  );
}
