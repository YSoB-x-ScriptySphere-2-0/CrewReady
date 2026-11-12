// Small animated pieces for the event moments (R5). Each is a one-shot CSS animation (index.css, `.ev-*`).
// The element's own style is its END frame, so reduced motion (animations off) shows the end frame for free.
import type { CSSProperties, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

type Vars = Record<string, string | number>;
const st = (v: Vars) => v as unknown as CSSProperties;

/** Slide from `from` to `to` (in SVG units) and fade in from `fo` opacity. */
export function Mv({ from = [0, 0], to = [0, 0], d = 1.4, dl = 0, fo = 1, children }: { from?: [number, number]; to?: [number, number]; d?: number; dl?: number; fo?: number; children: ReactNode }) {
  return (
    <g className="ev-move" style={st({ '--fx': `${from[0]}px`, '--fy': `${from[1]}px`, '--tx': `${to[0]}px`, '--ty': `${to[1]}px`, '--d': `${d}s`, '--dl': `${dl}s`, '--fo': fo })}>
      {children}
    </g>
  );
}

/** Scale from `from` to `to` (x, y) around `o` (a CSS transform-origin of the element's own box). */
export function Sc({ from = [0, 0], to = [1, 1], o = 'center', d = 0.6, dl = 0, children }: { from?: [number, number]; to?: [number, number]; o?: string; d?: number; dl?: number; children: ReactNode }) {
  return (
    <g className="ev-scale" style={st({ '--fsx': from[0], '--fsy': from[1], '--tsx': to[0], '--tsy': to[1], '--o': o, '--d': `${d}s`, '--dl': `${dl}s` })}>
      {children}
    </g>
  );
}

/** Blink three times (an alarm light, a warning pill). */
export const Blink = ({ dl = 0, children }: { dl?: number; children: ReactNode }) => (
  <g className="ev-blink" style={st({ '--dl': `${dl}s` })}>
    {children}
  </g>
);

/** Fade in. */
export const Fade = ({ dl = 0, d = 0.5, children }: { dl?: number; d?: number; children: ReactNode }) => (
  <g className="ev-fade" style={st({ '--dl': `${dl}s`, '--d': `${d}s` })}>
    {children}
  </g>
);

/** A dotted route that draws itself. */
export const Route = ({ d, dl = 0, color = '#F4F7FF' }: { d: string; dl?: number; color?: string }) => (
  <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" className="ev-draw" style={st({ '--dl': `${dl}s`, strokeDasharray: '0.04 0.035' })} />
);

/** A lucide icon placed in the SVG at x, y. */
export const Ic = ({ i: I, x, y, s = 28, color = '#F4F7FF', sw = 2.25 }: { i: LucideIcon; x: number; y: number; s?: number; color?: string; sw?: number }) => (
  <I x={x} y={y} width={s} height={s} color={color} strokeWidth={sw} aria-hidden />
);

/** The habitat dome, standing on the ground. */
export const Dome = ({ x, y, fill = '#F2A476', door = '#B3471B' }: { x: number; y: number; fill?: string; door?: string }) => (
  <g>
    <path d={`M${x} ${y}a40 40 0 0 1 80 0z`} fill={fill} />
    <rect x={x + 30} y={y - 16} width={18} height={16} rx={5} fill={door} />
  </g>
);

/** A crew member: a round head over a body. */
export const Crew = ({ x, y, color = '#19A7B8' }: { x: number; y: number; color?: string }) => (
  <g>
    <rect x={x - 7} y={y - 18} width={14} height={18} rx={6} fill={color} />
    <circle cx={x} cy={y - 24} r={7} fill="#F4F7FF" />
  </g>
);

/** A meter-like bar: a dark track and a fill that grows or shrinks between `from` and `to` (0–1). */
export function Bar({ x, y, w, h, color, from, to, dl = 0.3, d = 1.4, vertical = false }: { x: number; y: number; w: number; h: number; color: string; from: number; to: number; dl?: number; d?: number; vertical?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={5} fill="#070B1E" stroke="#3A4A8C" strokeWidth={2} />
      <g className="ev-scale" style={st({ '--fsx': vertical ? 1 : from, '--fsy': vertical ? from : 1, '--tsx': vertical ? 1 : to, '--tsy': vertical ? to : 1, '--o': vertical ? 'bottom' : 'left', '--d': `${d}s`, '--dl': `${dl}s` })}>
        <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={3} fill={color} />
      </g>
    </g>
  );
}

/** The frame every event sits in: a sky and a ground. */
export function Frame({ sky, ground, children, groundY = 128 }: { sky: string; ground?: string; children: ReactNode; groundY?: number }) {
  return (
    <svg viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
      <rect width="400" height="160" fill={sky} />
      {ground ? <rect y={groundY} width="400" height={160 - groundY} fill={ground} /> : null}
      {children}
    </svg>
  );
}
