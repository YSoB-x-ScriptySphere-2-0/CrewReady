// Level 4 — share the battery. Seven chunky battery blocks sit in the tray (left zone). Tap a socket's plug and a
// block hops in; tap a socket's blocks to pull one back out. Each empty slot shows what it costs, in that meter's colour.
import { useRef, useState } from 'react';
import { Plug, Undo2, Zap } from 'lucide-react';
import { crewMods, setSliders } from '../../engine/engine';
import { METER_NAMES, type CrewStep, type GameState, type Level, type SlidersStep } from '../../engine/types';
import { ChangeChip, GameButton } from '../GameButton';
import { METER_COLOR, MeterBadge } from '../meters';
import { BLOCK_HTML, BatteryBlock, hop, LeftSlot, ToyArea, type Done } from './shared';

export function Power({ step, game, level, onDone, slot }: { step: SlidersStep; game: GameState; level: Level; onDone: Done; slot?: HTMLElement | null }) {
  const [alloc, setAlloc] = useState(step.systems.map(() => 0));
  const [landed, setLanded] = useState(-2); // socket index, -1 for the tray
  const left = step.units - alloc.reduce((a, b) => a + b, 0);
  const tray = useRef<HTMLDivElement>(null);
  const slots = useRef<(HTMLElement | null)[]>([]);
  const mods = crewMods(level.steps.find((s): s is CrewStep => s.kind === 'crew'), game.crew);

  const plug = (i: number) => {
    if (left === 0 || alloc[i] >= step.want) return;
    hop(tray.current?.querySelector('[data-block]:last-child'), slots.current[i], BLOCK_HTML);
    setAlloc(alloc.map((a, j) => (j === i ? a + 1 : a)));
    setLanded(i);
  };
  const unplug = (i: number) => {
    if (!alloc[i]) return;
    hop(slots.current[i], tray.current, BLOCK_HTML);
    setAlloc(alloc.map((a, j) => (j === i ? a - 1 : a)));
    setLanded(-1);
  };

  return (
    <>
      <LeftSlot slot={slot}>
        {/* The battery tray. */}
        <div ref={tray} className="flex h-full w-full flex-col justify-center gap-[0.5rem] rounded-panel border-2 border-line bg-panel/85 px-[0.75rem] py-[0.5rem] text-text" aria-live="polite">
          <span className="sr-only">{left ? `${left} battery blocks left in the tray.` : 'Every block is plugged in.'}</span>
          <span className="flex items-center gap-[0.25rem] self-start rounded-full bg-space-deep px-[0.625rem] font-display text-[1.125rem] leading-snug font-extrabold tabular-nums" aria-hidden>
            <Zap size={16} strokeWidth={3} /> {left ? `${left} left` : 'Tray empty!'}
          </span>
          <div className="flex flex-wrap items-end gap-[0.375rem]">
            {Array.from({ length: left }, (_, k) => (
              <span key={k} data-block>
                <BatteryBlock on size={28} land={landed === -1 && k === left - 1} />
              </span>
            ))}
          </div>
        </div>
      </LeftSlot>

      <div className="flex h-full min-h-0 flex-col gap-[0.5rem]">
        <div className="grid min-h-0 flex-1 grid-cols-3 gap-[0.5rem]">
          {step.systems.map((sys, i) => {
            const missing = step.want - alloc[i];
            const full = missing === 0;
            return (
              <div key={sys.meter} className="flex min-h-0 flex-col rounded-tile border-2 border-line bg-panel text-text">
                <div className="flex items-center gap-[0.25rem] rounded-t-[0.875rem] px-[0.375rem] py-[0.25rem]" style={{ background: `color-mix(in srgb, ${METER_COLOR[sys.meter]} 55%, #14204d)` }}>
                  <MeterBadge meter={sys.meter} size={24} />
                  <span className="min-w-0 font-display text-[0.75rem] leading-[1.1] font-extrabold">{sys.label}</span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-stretch justify-between gap-[0.25rem] p-[0.375rem]">
                  <div className="flex items-stretch gap-[0.25rem]">
                    {/* The socket: blocks plugged in, and dashed slots still waiting. Tap to pull one out. */}
                    <ToyArea
                      onClick={() => unplug(i)}
                      disabled={!alloc[i]}
                      label={`Take a block out of ${sys.label}. It has ${alloc[i]} of ${step.want}.`}
                      className="flex min-h-[3.25rem] min-w-0 flex-1 items-end justify-center gap-[0.125rem] !bg-space-deep px-[0.125rem] pt-[0.5rem] pb-[0.25rem] disabled:!bg-space-deep"
                    >
                      <span ref={(el) => void (slots.current[i] = el)} className="flex items-end gap-[0.125rem]">
                        {Array.from({ length: step.want }, (_, k) => (k < alloc[i] ? <BatteryBlock key={k} on size={16} land={landed === i && k === alloc[i] - 1} /> : <BatteryBlock key={k} on={false} empty size={16} />))}
                      </span>
                      {alloc[i] ? <Undo2 size={12} strokeWidth={3} aria-hidden className="absolute top-[0.125rem] right-[0.125rem] text-muted" /> : null}
                    </ToyArea>
                    <ToyArea
                      onClick={() => plug(i)}
                      disabled={left === 0 || full}
                      label={`Plug a block into ${sys.label}`}
                      className="grid w-[2.5rem] shrink-0 place-items-center bg-power text-go-text [--lip:#b98a00] disabled:bg-locked disabled:text-muted disabled:[--lip:var(--color-locked-lip)]"
                    >
                      <Plug size={20} strokeWidth={2.75} aria-hidden />
                    </ToyArea>
                  </div>
                  <div className="flex min-h-[1.5rem] items-center justify-center">
                    {full ? (
                      <span className="inline-flex items-center rounded-full bg-good/40 px-[0.5rem] font-display text-[0.8125rem] font-extrabold">Fully powered</span>
                    ) : (
                      <ChangeChip change={{ meter: sys.meter, amount: -missing * step.costPerMissing }} size="sm" />
                    )}
                    <span className="sr-only"> {full ? '' : `${METER_NAMES[sys.meter]} will drop by ${missing * step.costPerMissing}.`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <GameButton variant="go" icon={Zap} disabled={left !== 0} onClick={() => onDone(setSliders(game, step, alloc, mods))} className="!min-h-[3rem]">
            {left ? `Plug in ${left} more` : 'Switch it on'}
          </GameButton>
        </div>
      </div>
    </>
  );
}
