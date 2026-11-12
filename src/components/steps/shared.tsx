// Shared parts for the hands-on steps (A7): the crate and battery-block shapes, a toy button that squashes,
// and `hop()`, which flies a copy of a thing from where it was to where it lands.
import type { ReactNode } from 'react';
import { Zap } from 'lucide-react';
import type { Outcome } from '../../engine/types';
import { reducedMotion, usePress } from '../motion';

export type Done = (o: Outcome, opts?: { stay?: boolean }) => void;

/** A little supply crate. `land` delays its pop-in so it appears as a hopping copy arrives. */
export function Crate({ size = 30, faded, land }: { size?: number; faded?: boolean; land?: boolean }) {
  return (
    <span
      className={`relative inline-block shrink-0 rounded-[6px] border-[3px] border-ink bg-crate ${faded ? 'opacity-30' : ''} ${land ? 'anim-land' : ''}`}
      style={{ width: size, height: Math.round(size * 0.8) }}
      aria-hidden
    >
      <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 bg-ink/40" />
      <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 bg-ink/25" />
    </span>
  );
}

/** One chunky battery block. Empty ones are outlines (a slot waiting for a block). */
export function BatteryBlock({ on, size = 30, land, empty }: { on: boolean; size?: number; land?: boolean; empty?: boolean }) {
  return (
    <span
      className={`relative inline-block shrink-0 rounded-[6px] border-[3px] ${empty ? 'border-dashed border-ink/50 bg-white/60' : 'border-ink'} ${on ? 'bg-power' : empty ? '' : 'bg-white'} ${
        land ? 'anim-land' : ''
      }`}
      style={{ width: size, height: Math.round(size * 1.35) }}
      aria-hidden
    >
      {!empty ? <span className="absolute -top-[8px] left-1/2 h-[6px] w-[45%] -translate-x-1/2 rounded-t-[3px] border-[3px] border-b-0 border-ink bg-ink" /> : null}
      {on ? <Zap size={Math.round(size * 0.5)} strokeWidth={3} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> : null}
    </span>
  );
}

/** A big pressable area (bin, socket, cubby): toy outline and lip, squash on press. */
export function ToyArea({
  children,
  onClick,
  disabled,
  label,
  className = '',
  pressed,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  className?: string;
  pressed?: boolean;
}) {
  const press = usePress(disabled);
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} aria-pressed={pressed} {...press} className={`toy rounded-tile text-ink ${className}`}>
      {children}
    </button>
  );
}

/**
 * Fly a copy of `html` from one element to another in a little arc (320 ms). Purely visual: the state has
 * already changed and the landing spot pops in with `anim-land`. Nothing flies with reduced motion.
 */
export function hop(from: Element | null | undefined, to: Element | null | undefined, html: string) {
  if (!from || !to || reducedMotion()) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const el = document.createElement('div');
  el.innerHTML = html;
  Object.assign(el.style, { position: 'fixed', left: `${a.left + a.width / 2 - 16}px`, top: `${a.top + a.height / 2 - 13}px`, zIndex: '60', pointerEvents: 'none' });
  document.body.append(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  el.animate(
    [
      { transform: 'translate(0,0) rotate(0)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) rotate(-12deg)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) rotate(0)` },
    ],
    { duration: 320, easing: 'cubic-bezier(.45,0,.55,1)' },
  ).finished.then(
    () => el.remove(),
    () => el.remove(),
  );
}

export const CRATE_HTML =
  '<span style="display:block;width:32px;height:26px;border:3px solid #1B1F3B;border-radius:6px;background:#c7773a;box-shadow:inset 0 -10px 0 rgba(27,31,59,.15)"></span>';
export const BLOCK_HTML =
  '<span style="display:block;width:28px;height:38px;border:3px solid #1B1F3B;border-radius:6px;background:#F5B700"></span>';
