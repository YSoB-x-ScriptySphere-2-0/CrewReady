// Scene: every screen is a place — a gradient sky (lighter at the horizon) and a few flat, static shapes
// in tints of that place's colour. BUILD_SEQUENCE.md §4.2 and §4.7. Nothing here moves.
import type { ReactNode } from 'react';

export type ScenePlace = 'earth' | 'space' | 'mars' | 'dust' | 'alarm' | 'dawn';

const SKY: Record<ScenePlace, string> = {
  earth: 'linear-gradient(180deg, #2f6fed 0%, #2f6fed 45%, #4d86f2 100%)',
  space: 'linear-gradient(180deg, #17134a 0%, #1f1a5c 50%, #2e2678 100%)',
  mars: 'linear-gradient(180deg, #c9551f 0%, #d9622b 55%, #e2773f 100%)',
  dust: 'linear-gradient(180deg, #a87219 0%, #b9801f 50%, #c99236 100%)',
  alarm: 'linear-gradient(180deg, #8f2824 0%, #a8322e 55%, #b63c35 100%)',
  dawn: 'linear-gradient(180deg, #f6a6b8 0%, #f9c98a 55%, #f5c542 100%)',
};

/** Ink reads better than paper on the light skies. */
const DARK: Record<ScenePlace, boolean> = { earth: true, space: true, mars: true, dust: false, alarm: true, dawn: false };

/* ---- the sky layer (top), sliced to fill the width ---- */
function SkyArt({ place }: { place: ScenePlace }) {
  if (place === 'space')
    return (
      <g fill="#fff8ec">
        {[
          [40, 30, 2], [120, 80, 1.5], [200, 24, 2.5], [290, 60, 1.5], [370, 110, 2], [460, 36, 1.5], [540, 90, 2.5], [620, 30, 1.5],
          [700, 70, 2], [760, 130, 1.5], [80, 150, 1.5], [250, 140, 2], [420, 170, 1.5], [580, 160, 2], [680, 190, 1.5], [150, 200, 2],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={i % 3 ? 0.55 : 0.9} />
        ))}
        <circle cx="660" cy="120" r="34" fill="#4a3ea6" />
        <ellipse cx="660" cy="120" rx="58" ry="12" fill="none" stroke="#6a5ec8" strokeWidth="6" />
        <circle cx="648" cy="110" r="8" fill="#5b4fb8" />
      </g>
    );
  if (place === 'earth')
    // Clouds in a light tint of the sky (not white), so paper text over them stays readable.
    return (
      <g fill="#5b8ff0">
        <ellipse cx="130" cy="70" rx="60" ry="20" />
        <ellipse cx="165" cy="58" rx="36" ry="22" />
        <ellipse cx="560" cy="110" rx="70" ry="18" />
        <ellipse cx="600" cy="98" rx="38" ry="20" />
        <ellipse cx="380" cy="170" rx="40" ry="11" />
      </g>
    );
  if (place === 'mars' || place === 'dawn')
    return <circle cx="640" cy="90" r="26" fill={place === 'dawn' ? '#fff3c4' : '#f6c39a'} opacity="0.9" />;
  if (place === 'dust')
    return (
      <g fill="#7a4e10">
        <rect x="0" y="60" width="800" height="26" opacity="0.12" />
        <rect x="0" y="120" width="800" height="40" opacity="0.1" />
        <circle cx="620" cy="90" r="22" fill="#e9c27a" opacity="0.45" />
      </g>
    );
  // alarm
  return (
    <g fill="#ffffff" opacity="0.08">
      <rect x="0" y="40" width="800" height="18" />
      <rect x="0" y="90" width="800" height="10" />
    </g>
  );
}

/* ---- the ground layer (bottom), anchored to the bottom edge ---- */
function Habitat({ x, fill, door }: { x: number; fill: string; door: string }) {
  return (
    <g>
      <path d={`M${x} 214a46 46 0 0 1 92 0z`} fill={fill} />
      <rect x={x + 84} y={190} width={70} height={24} rx={8} fill={fill} />
      <rect x={x + 36} y={196} width={20} height={18} rx={6} fill={door} />
      <circle cx={x + 120} cy={202} r={5} fill={door} />
    </g>
  );
}

function GroundArt({ place }: { place: ScenePlace }) {
  switch (place) {
    case 'earth':
      return (
        <g>
          <path d="M0 210 Q140 150 300 196 T620 180 T800 196 V300 H0z" fill="#255fd6" />
          <path d="M0 240 Q200 206 420 236 T800 228 V300 H0z" fill="#1d4fb8" />
          {/* launch tower and pad */}
          <rect x="470" y="96" width="14" height="140" fill="#163f94" />
          <path d="M484 110h28M484 140h28M484 170h28M484 200h28" stroke="#163f94" strokeWidth="6" />
          <rect x="420" y="234" width="150" height="14" rx="4" fill="#163f94" />
        </g>
      );
    case 'space':
      return <path d="M0 300 Q400 214 800 300z" fill="#2c2a6e" />;
    case 'mars':
      return (
        <g>
          <path d="M0 200 Q160 160 330 196 T660 176 T800 190 V300 H0z" fill="#c4521f" />
          <Habitat x={400} fill="#f2a476" door="#b3471b" />
          <path d="M0 236 Q220 204 450 232 T800 222 V300 H0z" fill="#b2461a" />
          <circle cx="160" cy="262" r="8" fill="#9b3c16" />
          <circle cx="640" cy="270" r="6" fill="#9b3c16" />
        </g>
      );
    case 'dust':
      return (
        <g>
          <path d="M0 196 Q200 168 400 196 T800 186 V300 H0z" fill="#a46f17" />
          {/* a half-buried solar panel */}
          <path d="M440 214 l60 -26 l40 16 l-60 26z" fill="#8a5c12" />
          <path d="M0 222 Q260 196 520 224 T800 214 V300 H0z" fill="#93620f" />
          <rect x="0" y="150" width="800" height="150" fill="#d9a54a" opacity="0.18" />
        </g>
      );
    case 'alarm':
      return (
        <g>
          <path d="M0 214 Q240 184 480 212 T800 204 V300 H0z" fill="#8b2622" />
          <Habitat x={300} fill="#c45048" door="#7a1f1c" />
          <rect x="0" y="262" width="800" height="38" fill="#7a1f1c" />
        </g>
      );
    case 'dawn':
      return (
        <g>
          <path d="M0 214 Q180 176 380 206 T800 196 V300 H0z" fill="#e9a35c" />
          <Habitat x={410} fill="#fff1d6" door="#d98a4a" />
          <path d="M0 246 Q240 220 480 244 T800 238 V300 H0z" fill="#d98a4a" />
        </g>
      );
  }
}

/**
 * A full-screen place. `top` sticks to the top (the HUD), `bottom` to the bottom (the Dock).
 * `fill={false}` makes a small preview (the #kit gallery).
 */
export function Scene({
  place,
  children,
  top,
  bottom,
  rail,
  fill = true,
  className = '',
  bare = false,
}: {
  place: ScenePlace;
  children?: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
  /** The Dock: a rail down the left edge, outside levels. */
  rail?: ReactNode;
  fill?: boolean;
  className?: string;
  /** Skip the centred content column. */
  bare?: boolean;
}) {
  const dark = DARK[place];
  return (
    <div
      data-scene={place}
      className={`relative isolate flex ${bare ? 'overflow-hidden' : 'overflow-x-clip'} ${fill ? (bare ? 'h-full' : 'min-h-full') : ''} ${dark ? 'on-sky text-paper' : 'text-ink'} ${className}`}
      style={{ background: SKY[place] }}
    >
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[45%] w-full" viewBox="0 0 800 220" preserveAspectRatio="xMidYMin slice">
        <SkyArt place={place} />
      </svg>
      {/* Wide stage: the horizon sits in the lower third. */}
      <svg
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 -z-10 w-full ${fill ? 'h-1/3 min-h-[8rem]' : 'h-1/2'}`}
        viewBox="0 0 800 300"
        preserveAspectRatio="xMidYMax slice"
      >
        <GroundArt place={place} />
      </svg>
      {rail ? <div className="hidden md:flex z-30 h-full shrink-0 self-start">{rail}</div> : null}
      {rail ? <div className="md:hidden">{rail}</div> : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {top}
        {bare ? children : <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-4 pt-5 pb-10">{children}</main>}
        {bottom}
      </div>
    </div>
  );
}
