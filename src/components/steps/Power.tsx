// Level 4 — share the battery. Seven chunky battery blocks sit in the tray. Tap a socket and a block hops in;
// tap a socket's blocks to pull one back out. Each empty slot shows what it costs, in that meter's colour.
import { useRef, useState } from 'react';
import { Plug, Undo2, Zap } from 'lucide-react';
import { crewMods, setSliders } from '../../engine/engine';
import { METER_NAMES, type CrewStep, type GameState, type Level, type SlidersStep } from '../../engine/types';
import { ChangeChip, GameButton } from '../GameButton';
import { METER_COLOR, MeterBadge } from '../meters';
import { BLOCK_HTML, BatteryBlock, hop, ToyArea, type Done } from './shared';

export function Power({ step, game, level, onDone }: { step: SlidersStep; game: GameState; level: Level; onDone: Done }) {
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
    <div>
      {/* The battery tray. */}
      <div ref={tray} className="flex min-h-[72px] flex-wrap items-end gap-2 rounded-tile border-[3px] border-ink bg-[#2c2f52] px-3 pt-4 pb-3 text-paper" aria-live="polite">
        <span className="sr-only">{left ? `${left} battery blocks left in the tray.` : 'Every block is plugged in.'}</span>
        {Array.from({ length: left }, (_, k) => (
          <span key={k} data-block>
            <BatteryBlock on size={30} land={landed === -1 && k === left - 1} />
          </span>
        ))}
        {!left ? (
          <span className="font-display text-xl font-extrabold" aria-hidden>
            Tray empty!
          </span>
        ) : null}
        <span className="ml-auto flex items-center gap-1 rounded-full border-[3px] border-ink bg-paper px-3 font-display text-xl leading-snug font-extrabold text-ink tabular-nums" aria-hidden>
          <Zap size={18} strokeWidth={3} /> {left} left
        </span>
      </div>

      <div className="mt-4 grid gap-x-3 gap-y-2 sm:grid-cols-3">
        {step.systems.map((sys, i) => {
          const missing = step.want - alloc[i];
          const full = missing === 0;
          return (
            <div key={sys.meter} className="flex flex-col rounded-tile border-[3px] border-ink bg-white text-ink shadow-[0_5px_0_var(--color-ink)]">
              <div className="flex items-center gap-2 rounded-t-[13px] border-b-[3px] border-ink px-2.5 py-1.5" style={{ background: `color-mix(in srgb, ${METER_COLOR[sys.meter]} 30%, white)` }}>
                <MeterBadge meter={sys.meter} size={32} />
                <span className="min-w-0 font-display text-lg leading-tight font-extrabold">{sys.label}</span>
              </div>

              <div className="flex items-stretch gap-2 p-2.5">
                {/* The socket: blocks plugged in, and dashed slots still waiting. Tap to pull one out. */}
                <ToyArea
                  onClick={() => unplug(i)}
                  disabled={!alloc[i]}
                  label={`Take a block out of ${sys.label}. It has ${alloc[i]} of ${step.want}.`}
                  className="flex min-h-[76px] flex-1 items-end justify-center gap-1.5 !bg-[#f3ecdd] px-2 pt-4 pb-2 disabled:!bg-[#f3ecdd]"
                >
                  <span ref={(el) => void (slots.current[i] = el)} className="flex items-end gap-1.5">
                    {Array.from({ length: step.want }, (_, k) => (k < alloc[i] ? <BatteryBlock key={k} on size={26} land={landed === i && k === alloc[i] - 1} /> : <BatteryBlock key={k} on={false} empty size={26} />))}
                  </span>
                  {alloc[i] ? <Undo2 size={16} strokeWidth={3} aria-hidden className="absolute top-1.5 right-1.5 text-muted" /> : null}
                </ToyArea>
                <ToyArea
                  onClick={() => plug(i)}
                  disabled={left === 0 || full}
                  label={`Plug a block into ${sys.label}`}
                  className="grid w-14 shrink-0 place-items-center bg-power [--lip:#b98a00] disabled:bg-locked disabled:text-muted disabled:[--lip:var(--color-locked-lip)]"
                >
                  <Plug size={26} strokeWidth={2.75} aria-hidden />
                </ToyArea>
              </div>

              <div className="mt-auto px-2.5 pb-2.5">
                {full ? (
                  <span className="inline-flex items-center gap-1 rounded-full border-2 border-ink bg-[#d8f3e1] px-2.5 font-display text-base font-extrabold">Fully powered</span>
                ) : (
                  <ChangeChip change={{ meter: sys.meter, amount: -missing * step.costPerMissing }} size="sm" />
                )}
                <span className="sr-only"> {full ? '' : `${METER_NAMES[sys.meter]} will drop by ${missing * step.costPerMissing}.`}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <GameButton variant="go" icon={Zap} disabled={left !== 0} onClick={() => onDone(setSliders(game, step, alloc, mods))}>
          {left ? `Plug in ${left} more` : 'Switch it on'}
        </GameButton>
      </div>
    </div>
  );
}
