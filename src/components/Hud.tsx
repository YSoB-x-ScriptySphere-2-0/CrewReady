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
      className={`anim-float-chip pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border-2 border-line px-2.5 font-display text-xl leading-snug font-extrabold whitespace-nowrap tabular-nums ${
        up ? 'bg-[#3ddc84] text-go-text' : 'bg-[#d93a3a] text-white'
      }`}
    >
      {up ? `+${d}` : `−${-d}`}
    </span>
  );
}

/** How many arrows a change draws (§4.3a): one for 5–10, two for 15–20, three for 25 or more. */
export const arrowCount = (amount: number) => (Math.abs(amount) >= 25 ? 3 : Math.abs(amount) >= 15 ? 2 : 1);

/**
 * `look` is "Look first": the signed change a selected card would make to this meter.
 * The pill wiggles once and shows ▲ or ▼ (no numbers).
 */
export function MeterPill({ meter, value, look }: { meter: Meter; value: number; look?: number }) {
  const shown = useCountTo(value, 500);
  const { fx, chips } = useChangeFx(value);
  const low = value <= 20;
  const flash = fx?.dir === 'down' ? 'bg-danger text-white' : fx?.dir === 'up' ? 'bg-[#3ddc84] text-go-text' : 'bg-panel text-text';
  const motion = fx?.dir === 'down' ? 'anim-shake-x' : fx?.dir === 'up' ? 'anim-pop' : look ? 'anim-wiggle' : '';
  return (
    <div className="relative min-w-0" data-hud-target={meter}>
      {look ? (
        <span
          aria-hidden
          className={`absolute -top-[0.25rem] -right-[0.125rem] z-10 rounded-full px-1 font-display text-[0.75rem] leading-snug font-extrabold ${look > 0 ? 'bg-[#3ddc84] text-go-text' : 'bg-[#d93a3a] text-white'}`}
        >
          {(look > 0 ? '▲' : '▼').repeat(arrowCount(look))}
        </span>
      ) : null}
      <div
        key={`${fx?.id ?? 0}-${look ?? 0}`}
        role="meter"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${METER_NAMES[meter]}${low ? ', low' : ''}`}
        className={`flex items-center gap-[0.375rem] rounded-full border-2 border-line py-[0.125rem] pr-[0.625rem] pl-[0.125rem] shadow-[0_0.15rem_0_var(--color-lip)] ${flash} ${motion}`}
      >
        <MeterBadge meter={meter} size={30} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="font-display text-[1.125rem] leading-none font-extrabold tabular-nums">{shown}</span>
            {low ? (
              <span className="rounded-full bg-danger px-1.5 font-display text-[0.8125rem] leading-tight font-extrabold tracking-wider text-white">
                LOW
              </span>
            ) : null}
          </div>
          <div className="mt-[0.125rem] h-[0.5rem] overflow-hidden rounded-full border border-line bg-space-deep" aria-hidden>
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
        className={`flex items-center gap-1.5 rounded-full border-2 border-line bg-panel py-[0.125rem] pr-[0.75rem] pl-[0.125rem] text-text shadow-[0_0.15rem_0_var(--color-lip)] ${fx ? 'anim-pop' : ''}`}
        aria-label={`${n} science stars`}
        role="status"
      >
        <span className="grid h-[1.875rem] w-[1.875rem] place-items-center rounded-full bg-star" aria-hidden>
          <StarIcon size={18} />
        </span>
        <span className="font-display text-[1.125rem] leading-none font-extrabold tabular-nums" aria-hidden>
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
 * The top strip, about 3 rem tall, always one row: `lead` (Home button, level chip), the four meter pills, the stars.
 */
export function Hud({ meters, stars, lead, look }: { meters: Record<Meter, number>; stars: number; lead?: ReactNode; look?: Partial<Record<Meter, number>> }) {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-line bg-space-deep/90 px-[0.75rem] pt-[0.25rem] pb-[0.5rem] text-text" aria-label="Outpost meters">
      <div className="flex flex-nowrap items-center gap-[0.5rem]">
        <div className="flex min-w-0 shrink-0 items-center gap-2">{lead}</div>
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-[0.5rem]">
          {METERS.map((m) => (
            <MeterPill key={m} meter={m} value={meters[m]} look={look?.[m]} />
          ))}
        </div>
        <StarCounter n={stars} />
      </div>
    </header>
  );
}
