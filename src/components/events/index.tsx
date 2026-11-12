// Event moments (BUILD_SEQUENCE.md §4.1a, R5): before each decision, the danger plays out for 2–3 s with no
// reading needed. One small SVG scene per decision, keyed "<level id>-<step index>". Tap to skip. With reduced
// motion the animations are off, so the end frame shows. Storm and dust read their size (X, D) from the game.
import { useEffect, useRef } from 'react';
import { Battery, Car, Droplets, Gem, Hammer, Shield, Sprout, Wind, Wrench, Zap, Microscope, House, Recycle } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { GameState } from '../../engine/types';
import { useReducedMotion } from '../motion';
import { Bar, Blink, Crew, Dome, Fade, Frame, Ic, Mv, Route, Sc } from './parts';

const ORANGE = '#F28C28';
const BROWN = '#8A5C12';

/** The Sun's wave: one arc for a small storm, two for a medium one, three for a big one (X is 10, 20 or 30). */
function Wave({ X, from, to, y = 70 }: { X: number; from: number; to: number; y?: number }) {
  const n = Math.max(1, Math.round(X / 10));
  const h = 18 + X * 1.1;
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <Mv key={k} from={[from, y]} to={[to, y]} d={1.5} dl={0.2 + k * 0.35}>
          <path d={`M0 ${-h} Q ${10 + X / 3} 0 0 ${h}`} fill="none" stroke={ORANGE} strokeWidth={3 + X / 10} strokeLinecap="round" />
        </Mv>
      ))}
    </>
  );
}

/** The dust wall: taller for a bigger dust case (D is 5, 15 or 25). Rolls in from the right. */
function DustWall({ D, h0 = 128 }: { D: number; h0?: number }) {
  const h = 40 + D * 3.2;
  return (
    <Mv from={[260, 0]} to={[0, 0]} d={1.6} dl={0.1}>
      <path d={`M150 ${h0} V${h0 - h + 10} q 20 -22 40 -4 t 40 0 t 40 -2 t 40 2 t 40 -4 V${h0}z`} fill="#6B4410" opacity={0.9} />
    </Mv>
  );
}

const Sun = ({ x, y, r = 16 }: { x: number; y: number; r?: number }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#F5B700" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <path key={a} d={`M${x + (r + 4) * Math.cos((a * Math.PI) / 180)} ${y + (r + 4) * Math.sin((a * Math.PI) / 180)} l${7 * Math.cos((a * Math.PI) / 180)} ${7 * Math.sin((a * Math.PI) / 180)}`} stroke="#F5B700" strokeWidth={3} strokeLinecap="round" />
    ))}
  </g>
);

const Pill = ({ x, y, color, icon: I }: { x: number; y: number; color: string; icon: typeof Shield }) => (
  <g>
    <rect x={x} y={y} width={44} height={24} rx={12} fill={color} stroke="#F4F7FF" strokeWidth={2} />
    <Ic i={I} x={x + 12} y={y + 4} s={16} />
  </g>
);

const Plant = ({ x, y, droop = 0 }: { x: number; y: number; droop?: number }) => (
  <g className="ev-rot" style={{ '--r': `${droop}deg`, transformBox: 'fill-box', transformOrigin: 'bottom' } as CSSProperties}>
    <rect x={x - 2} y={y - 22} width={4} height={22} fill="#2FA84F" />
    <ellipse cx={x - 8} cy={y - 22} rx={9} ry={5} fill="#3DDC84" />
    <ellipse cx={x + 8} cy={y - 26} rx={9} ry={5} fill="#3DDC84" />
  </g>
);

type EventFn = (g: GameState) => ReactNode;

const EVENTS: Record<string, EventFn> = {
  // Level 1 · the last seat: one empty seat outlined, three things floating beside it.
  '1-1': () => (
    <Frame sky="#0F1B45" ground="#1C2B63" groundY={130}>
      <Blink>
        <rect x={160} y={64} width={80} height={66} rx={10} fill="none" stroke="#22D7E6" strokeWidth={4} strokeDasharray="10 8" />
      </Blink>
      <Mv from={[0, -60]} dl={0.1}><Ic i={Microscope} x={70} y={48} s={40} color="#A9B4D6" /></Mv>
      <Mv from={[0, -60]} dl={0.4}><Ic i={Wrench} x={180} y={20} s={40} color="#A9B4D6" /></Mv>
      <Mv from={[0, -60]} dl={0.7}><Ic i={Sprout} x={290} y={48} s={40} color="#A9B4D6" /></Mv>
    </Frame>
  ),
  // Level 2 · storm: a wave of orange light rolls from the Sun to the ship; the Shield pill blinks.
  '2-0': (g) => (
    <Frame sky="#17134A" ground="#2C2A6E">
      <Sun x={36} y={70} r={20} />
      <Wave X={g.X} from={78} to={230} />
      <Dome x={300} y={128} fill="#C8D0EE" door="#7A5AE0" />
      <Fade dl={1.2}>
        <Blink dl={1.2}><Pill x={336} y={12} color="#7A5AE0" icon={Shield} /></Blink>
      </Fade>
    </Frame>
  ),
  // Level 2 · filter: the tank's gauge drops; brown drips in the pipe.
  '2-1': () => (
    <Frame sky="#0F1B45" ground="#1C2B63">
      <rect x={110} y={22} width={70} height={100} rx={12} fill="#070B1E" stroke="#A9B4D6" strokeWidth={3} />
      <Sc from={[1, 1]} to={[1, 0.3]} o="bottom" d={1.6} dl={0.2}>
        <rect x={116} y={28} width={58} height={88} rx={8} fill="#1E9BE0" />
      </Sc>
      <path d="M180 108 H260 V70" fill="none" stroke="#A9B4D6" strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2].map((k) => (
        <Mv key={k} from={[0, -14]} to={[0, 22]} d={0.9} dl={0.3 + k * 0.45}>
          <circle cx={260} cy={70} r={6} fill={BROWN} />
        </Mv>
      ))}
      <Ic i={Droplets} x={290} y={28} s={44} color="#1E9BE0" />
    </Frame>
  ),
  // Level 2 · landing: Mars fills the window; three zones light up.
  '2-2': () => (
    <Frame sky="#0B1437">
      <Sc from={[0.3, 0.3]} o="center" d={1.2}>
        <circle cx={200} cy={110} r={110} fill="#D9622B" />
        <circle cx={150} cy={70} r={14} fill="#B2461A" />
        <circle cx={260} cy={84} r={10} fill="#B2461A" />
      </Sc>
      {[[130, 52], [200, 36], [270, 58]].map(([x, y], k) => (
        <Fade key={k} dl={1.1 + k * 0.3}>
          <Blink dl={1.1 + k * 0.3}>
            <circle cx={x} cy={y} r={12} fill="none" stroke="#22D7E6" strokeWidth={4} />
          </Blink>
        </Fade>
      ))}
    </Frame>
  ),
  // Level 3 · protect: radiation dots fall on the bare roof.
  '3-0': () => (
    <Frame sky="#C9551F" ground="#B2461A">
      <Dome x={160} y={128} />
      {Array.from({ length: 12 }, (_, k) => (
        <Mv key={k} from={[0, -90]} to={[0, 0]} d={0.9} dl={0.1 + k * 0.16}>
          <circle cx={130 + ((k * 37) % 140)} cy={78 + (k % 3) * 6} r={4} fill="#F5B700" />
        </Mv>
      ))}
    </Frame>
  ),
  // Level 3 · leak: air streams out of a crack.
  '3-1': () => (
    <Frame sky="#8F2824" ground="#7A1F1C">
      <Dome x={110} y={128} fill="#C45048" door="#7A1F1C" />
      <path d="M176 112 l8 -10 l-6 -8 l9 -10" fill="none" stroke="#070B1E" strokeWidth={3} strokeLinejoin="round" />
      {[0, 1, 2, 3].map((k) => (
        <Mv key={k} from={[0, 0]} to={[150, -8 - k * 6]} d={1.4} dl={0.1 + k * 0.4} fo={0}>
          <Ic i={Wind} x={186} y={70 + k * 12} s={30} color="#1E9BE0" />
        </Mv>
      ))}
      <Blink>
        <path d="M196 20 l14 26 h-28z" fill="#F5B700" stroke="#1B1F3B" strokeWidth={3} strokeLinejoin="round" />
      </Blink>
    </Frame>
  ),
  // Level 3 · oxygen maker: the box hums, its cable lights up, the battery sinks a little.
  '3-2': () => (
    <Frame sky="#C9551F" ground="#B2461A">
      <rect x={80} y={70} width={70} height={58} rx={10} fill="#E8EEFF" stroke="#3A4A8C" strokeWidth={3} />
      <Ic i={Wind} x={97} y={80} s={36} color="#1E9BE0" />
      <path d="M150 112 H250" stroke="#3A4A8C" strokeWidth={6} strokeLinecap="round" />
      <Fade dl={0.3}>
        <path d="M150 112 H250" stroke="#F5B700" strokeWidth={6} strokeLinecap="round" />
      </Fade>
      <Mv from={[-100, 0]} to={[0, 0]} d={1.2} dl={0.3}>
        <Ic i={Zap} x={250} y={98} s={28} color="#F5B700" />
      </Mv>
      <Bar x={260} y={34} w={96} h={26} color="#F5B700" from={0.9} to={0.65} d={1.6} dl={0.5} />
      <Ic i={Battery} x={228} y={34} s={28} />
    </Frame>
  ),
  // Level 4 · panels: a dust wall rolls in and the sky darkens.
  '4-0': (g) => (
    <Frame sky="#C99236" ground="#93620F">
      {[90, 160, 230].map((x) => (
        <path key={x} d={`M${x} 128 l40 -22 l30 12 l-40 22z`} fill="#1E4DB8" stroke="#F4F7FF" strokeWidth={2} />
      ))}
      <Fade d={1.8} dl={0.3}>
        <rect width="400" height="160" fill="#5A3A08" opacity={0.4} />
      </Fade>
      <DustWall D={g.D} />
    </Frame>
  ),
  // Level 4 · cleaning (step 2; step 1 is the battery sliders): the panels sit grey; the power bar barely fills.
  '4-2': () => (
    <Frame sky="#C99236" ground="#93620F">
      {[40, 110, 180].map((x) => (
        <path key={x} d={`M${x} 128 l40 -22 l30 12 l-40 22z`} fill="#8B8372" stroke="#F4F7FF" strokeWidth={2} />
      ))}
      <Ic i={Zap} x={268} y={40} s={30} color="#F5B700" />
      <Bar x={300} y={42} w={86} h={22} color="#F5B700" from={0} to={0.15} d={1.6} dl={0.3} />
    </Frame>
  ),
  // Level 5 · farm: plants grow; the water bar is half full.
  '5-0': () => (
    <Frame sky="#C9551F" ground="#8A4A22">
      {[70, 120, 170].map((x, k) => (
        <Sc key={x} from={[1, 0]} to={[1, 1]} o="bottom" d={0.9} dl={0.2 + k * 0.3}>
          <Plant x={x} y={128} />
        </Sc>
      ))}
      <Ic i={Droplets} x={262} y={34} s={30} color="#1E9BE0" />
      <Bar x={296} y={40} w={90} h={22} color="#1E9BE0" from={0.2} to={0.5} d={1.4} dl={0.3} />
    </Frame>
  ),
  // Level 5 · water: the water bar runs low; the plants droop.
  '5-1': () => (
    <Frame sky="#C9551F" ground="#8A4A22">
      {[70, 120, 170].map((x) => (
        <Plant key={x} x={x} y={128} droop={22} />
      ))}
      <Ic i={Droplets} x={262} y={34} s={30} color="#1E9BE0" />
      <Bar x={296} y={40} w={90} h={22} color="#1E9BE0" from={0.6} to={0.12} d={1.6} dl={0.3} />
    </Frame>
  ),
  // Level 5 · pump: the pump stops with a puff; the plants droop.
  '5-2': () => (
    <Frame sky="#C9551F" ground="#8A4A22">
      {[60, 110].map((x) => (
        <Plant key={x} x={x} y={128} droop={22} />
      ))}
      <rect x={220} y={86} width={60} height={42} rx={8} fill="#E8EEFF" stroke="#3A4A8C" strokeWidth={3} />
      <circle cx={250} cy={107} r={12} fill="#3A4A8C" />
      {[0, 1, 2].map((k) => (
        <Mv key={k} from={[0, 0]} to={[6 * k - 6, -26 - k * 6]} d={1} dl={0.5 + k * 0.15} fo={0}>
          <circle cx={250} cy={80} r={7 + k * 2} fill="#F4F7FF" opacity={0.7} />
        </Mv>
      ))}
      <Ic i={Wrench} x={300} y={40} s={34} color="#F5B700" />
    </Frame>
  ),
  // Level 6 · storm + dust: the wave and the dust wall arrive together.
  '6-1': (g) => (
    <Frame sky="#8F5A25" ground="#93620F">
      <Sun x={30} y={50} r={16} />
      <Wave X={g.X} from={64} to={170} y={56} />
      <DustWall D={g.D} />
      <Dome x={300} y={128} fill="#C8D0EE" door="#7A5AE0" />
    </Frame>
  ),
  // Level 6 · scrubber: the carbon dioxide bar creeps up; the crew yawns.
  '6-2': () => (
    <Frame sky="#0F1B45" ground="#1C2B63">
      {[70, 110, 150].map((x, k) => (
        <g key={x}>
          <Crew x={x} y={128} />
          <Sc from={[0, 0]} to={[1, 1]} d={0.4} dl={0.9 + k * 0.2}>
            <ellipse cx={x} cy={102} rx={4} ry={5} fill="#070B1E" />
          </Sc>
        </g>
      ))}
      <text x={236} y={36} fill="#F4F7FF" fontWeight={800} fontSize={16}>CO₂</text>
      <Bar x={236} y={44} w={26} h={80} color="#A9B4D6" from={0.15} to={0.8} d={1.8} dl={0.2} vertical />
      <Ic i={Recycle} x={290} y={60} s={44} color="#7A5AE0" />
    </Frame>
  ),
  // Level 6 · samples: the rover, the delta and the habitat on one map, with a dotted route to each.
  '6-3': () => (
    <Frame sky="#D9622B" ground="#B2461A" groundY={150}>
      <Ic i={House} x={176} y={88} s={36} color="#FFF1D6" />
      <Ic i={Car} x={44} y={34} s={34} color="#FFF1D6" />
      <Ic i={Gem} x={320} y={30} s={34} color="#FFF1D6" />
      <Route d="M194 88 Q 120 70 72 60" dl={0.2} />
      <Route d="M194 88 Q 270 70 328 56" dl={0.9} />
      <Fade dl={1.5}>
        <Ic i={Hammer} x={192} y={120} s={24} color="#FFF1D6" />
      </Fade>
    </Frame>
  ),
};

export const hasEvent = (levelId: number, stepIndex: number) => `${levelId}-${stepIndex}` in EVENTS;

/** Plays the event for one decision, then calls `onDone` (at the end, or at a tap / Enter / Space). */
export function EventMoment({ levelId, stepIndex, game, label, onDone }: { levelId: number; stepIndex: number; game: GameState; label: string; onDone: () => void }) {
  const reduce = useReducedMotion();
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    const t = setTimeout(() => done.current(), reduce ? 1500 : 2600);
    return () => clearTimeout(t);
  }, [reduce]);
  const make = EVENTS[`${levelId}-${stepIndex}`];
  return (
    <button type="button" onClick={onDone} aria-label={`${label} Tap to skip.`} className="rise block h-full w-full overflow-hidden rounded-panel border-2 border-line text-left" data-event={`${levelId}-${stepIndex}`}>
      {make?.(game)}
    </button>
  );
}
