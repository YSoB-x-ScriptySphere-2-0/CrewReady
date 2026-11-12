// One icon and one colour per meter, used nowhere else. Plus the star.
import { Droplets, Shield, Sprout, Star, Zap, type LucideIcon } from 'lucide-react';
import type { Meter } from '../engine/types';

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
  return <Icon size={size} strokeWidth={2.25} aria-hidden className="shrink-0 text-ink" />;
}

/** The meter's icon on a round badge in the meter's colour, ink outline. */
export function MeterBadge({ meter, size = 36 }: { meter: Meter; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border-[3px] border-ink"
      style={{ width: size, height: size, background: METER_COLOR[meter] }}
      aria-hidden
    >
      <MeterIcon meter={meter} size={Math.round(size * 0.52)} />
    </span>
  );
}

/** Ink star on a gold disc — science stars. */
export function StarIcon({ size = 20 }: { size?: number }) {
  return <Star size={size} strokeWidth={2} aria-hidden className="shrink-0 text-ink" fill="var(--color-star)" />;
}
