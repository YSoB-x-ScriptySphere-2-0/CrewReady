// The four Try-it toys (BUILD_SEQUENCE.md L1, plan §5.4): ten seconds, no score, no cost, a Skip.
// They only SHOW an idea the level already teaches. Nothing here reads or writes the game store.
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowRight, Droplets, Eraser, Send, Sun, SolarPanel, UsersRound, Zap } from 'lucide-react';
import { LEG_MS, Planet } from '../Decision';
import { GameButton } from '../GameButton';
import { useReducedMotion } from '../motion';
import { Panel } from '../Panel';
import { Bubble } from '../Twinkle';
import { t } from '../../content/i18n';
import {
  PANEL_CELLS,
  PLANT_STAGES,
  SHIELD_ROWS,
  TOY_PROMPT,
  cleanPanel,
  dustFall,
  emptyShield,
  panelSolved,
  placeBag,
  plantSolved,
  powerShown,
  raysReachingCrew,
  shieldSolved,
  toyLine,
  waterPlant,
  waterShown,
  wipeCell,
} from './logic';

export { hasToy } from './logic';

const RAY = '#F28C28';

/** A small horizontal bar that fills to `value` (0–1). Colour is never alone: the icon beside it names it. */
function ToyBar({ value, color, icon: Icon, label }: { value: number; color: string; icon: typeof Zap; label: string }) {
  return (
    <div className="flex items-center gap-[0.375rem]" role="img" aria-label={`${label}: ${Math.round(value * 100)} percent`}>
      <Icon size={22} strokeWidth={2.5} aria-hidden style={{ color }} />
      <div className="h-[1.25rem] w-[8rem] overflow-hidden rounded-full border-2 border-line bg-space-deep">
        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- level 2: water bags against the rays
function ShieldToy({ onSolved }: { onSolved: () => void }) {
  const [placed, setPlaced] = useState(emptyShield);
  const lanes = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [offset, setOffset] = useState<{ i: number; dx: number; dy: number } | null>(null);
  const free = SHIELD_ROWS - placed.filter(Boolean).length;

  useEffect(() => {
    if (shieldSolved(placed)) onSolved();
  }, [placed]); // eslint-disable-line react-hooks/exhaustive-deps

  // A tap places a bag in the first free row (onClick: touch, mouse and keyboard). A drag past 8 px carries the bag
  // and drops it in the row under the finger. Nothing moves until the finger has really moved.
  const down = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const move = (i: number) => (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 8) {
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    if (d.moved) setOffset({ i, dx, dy });
  };
  const up = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    setOffset(null);
    if (!d?.moved) return;
    suppressClick.current = true; // the click that follows a drag is not a tap
    const row = lanes.current.findIndex((el) => {
      const r = el?.getBoundingClientRect();
      return r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (row >= 0) setPlaced((p) => placeBag(p, row));
  };
  const tap = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setPlaced((p) => placeBag(p));
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-[0.375rem]">
      <div className="flex min-h-0 flex-1 items-stretch gap-[0.5rem]">
        <div className="flex w-[2.5rem] shrink-0 items-center justify-center" aria-hidden>
          <Sun size={34} strokeWidth={2.5} color="#F5B700" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-around" role="group" aria-label="Rays from the Sun">
          {placed.map((blocked, row) => (
            <div key={row} ref={(el) => void (lanes.current[row] = el)} className={`relative h-[2.25rem] rounded-full border-2 ${blocked ? 'border-good' : 'border-dashed border-line'} bg-space-deep/60`}>
              <span aria-hidden className="absolute top-1/2 left-[0.25rem] -translate-y-1/2 border-t-[3px] border-dashed" style={{ borderColor: RAY, width: blocked ? 'calc(50% - 1.25rem)' : 'calc(100% - 0.5rem)' }} />
              {blocked ? (
                <span aria-hidden className="absolute top-1/2 left-1/2 grid h-[1.75rem] w-[1.75rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-line bg-air">
                  <Droplets size={16} strokeWidth={2.5} />
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex w-[3.5rem] shrink-0 flex-col items-center justify-center gap-[0.125rem] text-text">
          <UsersRound size={30} strokeWidth={2.25} aria-hidden />
          <span className="font-display text-[0.8125rem] leading-none font-extrabold" aria-live="polite">
            {raysReachingCrew(placed) === 0 ? 'Safe' : `${raysReachingCrew(placed)} ray${raysReachingCrew(placed) > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-[0.5rem]" role="group" aria-label="Water bags">
        {Array.from({ length: free }, (_, i) => (
          <button
            key={i}
            type="button"
            aria-label="Water bag. Drag it between the Sun and the crew, or press Enter."
            onPointerDown={down}
            onPointerMove={move(i)}
            onPointerUp={up}
            onPointerCancel={() => {
              drag.current = null;
              setOffset(null);
            }}
            onClick={tap}
            style={offset?.i === i ? { transform: `translate(${offset.dx}px, ${offset.dy}px)`, zIndex: 20 } : undefined}
            className="toy grid h-[2.75rem] min-w-[2.75rem] touch-none place-items-center rounded-full bg-air text-white"
          >
            <Droplets size={22} strokeWidth={2.5} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- level 3: a message to Earth and back
function SendToy({ onSolved }: { onSolved: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'idle' | 'there' | 'back' | 'done'>('idle');
  useEffect(() => {
    if (phase === 'there') {
      const t = setTimeout(() => setPhase('back'), LEG_MS);
      return () => clearTimeout(t);
    }
    if (phase === 'back') {
      const t = setTimeout(() => {
        setPhase('done');
        onSolved();
      }, LEG_MS);
      return () => clearTimeout(t);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const running = phase === 'there' || phase === 'back';
  const text = phase === 'idle' ? 'Ready to call Earth.' : phase === 'there' ? 'Calling Earth…' : phase === 'back' ? 'Earth is answering…' : 'The answer came back.';
  const dotAt = reduce ? (phase === 'there' ? 'right-0' : 'left-0') : '';
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-[0.375rem]">
      <div className="flex items-center gap-[0.5rem]">
        <Planet name="Mars" />
        <div className="relative h-[2.75rem] flex-1">
          <span aria-hidden className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t-[3px] border-dashed border-text/60" />
          {running || phase === 'done' ? (
            <span
              key={phase}
              aria-hidden
              className={`absolute top-1/2 grid h-[2.75rem] w-[2.75rem] -translate-y-1/2 place-items-center rounded-full border-2 border-go-lip bg-go text-go-text ${reduce ? dotAt : phase === 'there' ? 'msg-there' : phase === 'back' ? 'msg-back' : 'left-0'}`}
            >
              <Send size={20} strokeWidth={2.75} />
            </span>
          ) : null}
        </div>
        <Planet name="Earth" />
      </div>
      <div className="flex items-center justify-center gap-[0.75rem]">
        {/* The cabin clock keeps running while the message travels. */}
        <span className="relative grid h-[2.75rem] w-[2.75rem] place-items-center rounded-full border-[3px] border-line bg-space-deep" aria-hidden>
          <span key={phase === 'idle' ? 'i' : 'r'} className={`absolute h-[1.125rem] w-[0.1875rem] origin-bottom rounded-full bg-text ${running || phase === 'done' ? 'toy-spin' : ''}`} style={{ bottom: '50%' }} />
        </span>
        <GameButton variant="small" icon={Send} disabled={phase !== 'idle'} onClick={() => setPhase('there')} className="!min-h-[2.75rem]">
          Send
        </GameButton>
        <span className="font-display text-[0.9375rem] font-bold text-text" role="status">
          {text}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- level 4: dust on the panel, then wipe it
function PanelToy({ onSolved }: { onSolved: () => void }) {
  const reduce = useReducedMotion();
  const [dusty, setDusty] = useState(cleanPanel);
  const [falling, setFalling] = useState(true);
  useEffect(() => {
    if (reduce) {
      setDusty(dustFall(cleanPanel(), PANEL_CELLS));
      setFalling(false);
      return;
    }
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      setDusty(dustFall(cleanPanel(), n));
      if (n >= PANEL_CELLS) {
        clearInterval(id);
        setFalling(false);
      }
    }, 320);
    return () => clearInterval(id);
  }, [reduce]);
  useEffect(() => {
    if (!falling && panelSolved(dusty)) onSolved();
  }, [dusty, falling]); // eslint-disable-line react-hooks/exhaustive-deps
  const wipe = (i: number) => !falling && setDusty((d) => wipeCell(d, i));

  return (
    <div className="flex h-full min-h-0 items-center justify-center gap-[0.75rem]">
      <div className="grid grid-cols-3 gap-[0.25rem] rounded-[0.75rem] border-2 border-line bg-space-deep p-[0.25rem]" role="group" aria-label="Solar panel">
        {dusty.map((d, i) => (
          <button
            key={i}
            type="button"
            aria-label={d ? 'Dusty cell. Wipe it.' : 'Clean cell'}
            onClick={() => wipe(i)}
            onPointerEnter={(e) => e.buttons === 1 && wipe(i)}
            className={`relative grid h-[2.75rem] w-[3.5rem] touch-none place-items-center rounded-[0.5rem] border-2 border-line ${d ? 'bg-[#8B8372]' : 'bg-[#1E4DB8]'}`}
          >
            <SolarPanel size={22} strokeWidth={2} aria-hidden color={d ? '#6B4410' : '#F4F7FF'} />
            {d ? <span aria-hidden className="absolute inset-[0.25rem] rounded-[0.375rem]" style={{ background: 'repeating-linear-gradient(135deg, #6B441055 0 0.25rem, transparent 0.25rem 0.5rem)' }} /> : null}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-start gap-[0.5rem]">
        <ToyBar value={powerShown(dusty)} color="var(--color-power)" icon={Zap} label="Power" />
        <span className="flex items-center gap-[0.375rem] font-display text-[0.9375rem] font-bold text-text" role="status">
          <Eraser size={20} strokeWidth={2.5} aria-hidden />
          {falling ? 'Dust falls…' : panelSolved(dusty) ? 'Clear panel, full power.' : 'Tap or drag to wipe.'}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- level 5: water a plant
function PlantToy({ onSolved }: { onSolved: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (plantSolved(stage)) onSolved();
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps
  const h = 12 + stage * 15;
  return (
    <div className="flex h-full min-h-0 items-center justify-center gap-[1rem]">
      <svg viewBox="0 0 100 100" className="h-[7rem] w-[6rem] shrink-0" role="img" aria-label={`Plant, size ${stage} of ${PLANT_STAGES}`}>
        <rect x="30" y="84" width="40" height="14" rx="4" fill="#8A4A22" />
        <rect x="47" y={84 - h} width="6" height={h} rx="3" fill="#2FA84F" style={{ transition: 'all 400ms ease-out' }} />
        {Array.from({ length: stage }, (_, k) => (
          <ellipse key={k} cx={k % 2 ? 62 : 38} cy={84 - 10 - k * 13} rx="14" ry="6" fill="#3DDC84" transform={`rotate(${k % 2 ? -18 : 18} ${k % 2 ? 62 : 38} ${84 - 10 - k * 13})`} />
        ))}
      </svg>
      <div className="flex flex-col items-start gap-[0.5rem]">
        <ToyBar value={waterShown(stage)} color="var(--color-air)" icon={Droplets} label="Water" />
        <GameButton variant="small" icon={Droplets} disabled={plantSolved(stage)} onClick={() => setStage(waterPlant)} className="!min-h-[2.75rem] leading-snug break-words">
          {t('btn.water')}
        </GameButton>
      </div>
    </div>
  );
}

const BODIES: Record<number, (p: { onSolved: () => void }) => React.ReactElement> = { 2: ShieldToy, 3: SendToy, 4: PanelToy, 5: PlantToy };

/**
 * The toy for a level: Twinkle's one-line instruction, the toy, and the bottom row (Skip, then Start once it is done).
 * It changes no meter and writes nothing to the game: `onDone` only says "move on to the first decision".
 */
export function ToyHost({ levelId, learned, onDone }: { levelId: number; learned: string; onDone: () => void }) {
  const [solved, setSolved] = useState(false);
  const Body = BODIES[levelId];
  if (!Body) return null;
  return (
    <>
      <Bubble className="mb-[0.25rem] min-w-0 text-[1.0625rem]">{solved ? toyLine(levelId, learned) : TOY_PROMPT[levelId]}</Bubble>
      <div className="min-h-0 flex-1" data-toy={levelId}>
        <Panel compact ribbon="Try it" tone="space" className="h-full min-h-0">
          <Body onSolved={() => setSolved(true)} />
        </Panel>
      </div>
      <div className="flex items-center justify-end gap-[0.5rem]">
        {solved ? null : (
          <GameButton variant="plain" onClick={onDone} className="!min-h-[2.75rem] !px-4 sm:!px-6 !text-base sm:!text-lg leading-snug break-words">
            {t('btn.skip')}
          </GameButton>
        )}
        {solved ? (
          <GameButton variant="go" icon={ArrowRight} onClick={onDone} className="!min-h-[3rem] !px-6 sm:!px-8 !text-lg sm:!text-xl leading-snug break-words">
            {t('btn.start')}
          </GameButton>
        ) : null}
      </div>
    </>
  );
}

