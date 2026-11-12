// Level 1 — pack the rocket. Eight crates wait on the launch pad. Tap a bin and a crate hops in and stacks;
// tap a bin's stack to send one back. Each bin shows its meter with a ghost bar for where it will end up.
import { useRef, useState } from 'react';
import { DoorClosed, Plus, Undo2 } from 'lucide-react';
import { packCrates } from '../../engine/engine';
import { METER_NAMES, type CratesStep, type GameState } from '../../engine/types';
import { GameButton } from '../GameButton';
import { METER_COLOR, MeterBadge } from '../meters';
import { CRATE_HTML, Crate, hop, ToyArea, type Done } from './shared';

export function Crates({ step, game, onDone }: { step: CratesStep; game: GameState; onDone: Done }) {
  const [counts, setCounts] = useState(step.bins.map(() => 0));
  // Which bin (or the pad, -1) just received a crate, so only that crate pops in as the copy lands.
  const [landed, setLanded] = useState<{ at: number; n: number } | null>(null);
  const left = step.crates - counts.reduce((a, b) => a + b, 0);
  const pad = useRef<HTMLDivElement>(null);
  const stacks = useRef<(HTMLElement | null)[]>([]);

  const add = (i: number) => {
    if (left === 0) return;
    hop(pad.current?.querySelector('[data-crate]:last-child'), stacks.current[i], CRATE_HTML);
    setCounts(counts.map((c, j) => (j === i ? c + 1 : c)));
    setLanded({ at: i, n: counts[i] + 1 });
  };
  const takeBack = (i: number) => {
    if (!counts[i]) return;
    hop(stacks.current[i], pad.current, CRATE_HTML);
    setCounts(counts.map((c, j) => (j === i ? c - 1 : c)));
    setLanded({ at: -1, n: left + 1 });
  };

  return (
    <div>
      {/* The launch pad: crates still to pack. */}
      <div ref={pad} className="flex min-h-[64px] flex-wrap items-end gap-1.5 rounded-tile border-[3px] border-ink bg-[#c9c3b4] px-3 pt-2 pb-3 text-ink" aria-live="polite">
        <span className="sr-only">{left ? `${left} crates left on the launch pad.` : 'All crates are packed.'}</span>
        {left ? (
          Array.from({ length: left }, (_, k) => (
            <span key={k} data-crate>
              <Crate size={34} land={landed?.at === -1 && k === left - 1} />
            </span>
          ))
        ) : (
          <span className="font-display text-xl font-extrabold" aria-hidden>
            The pad is empty!
          </span>
        )}
        <span className="ml-auto rounded-full border-[3px] border-ink bg-paper px-3 font-display text-xl leading-snug font-extrabold tabular-nums" aria-hidden>
          {left} left
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 lg:grid-cols-4">
        {step.bins.map((b, i) => {
          const now = game.meters[b.meter];
          const after = Math.min(100, now + counts[i] * step.perCrate);
          return (
            <div key={b.meter} className="flex flex-col rounded-tile border-[3px] border-ink bg-white text-ink shadow-[0_5px_0_var(--color-ink)]">
              <div className="flex items-center gap-1.5 rounded-t-[13px] border-b-[3px] border-ink px-2 py-1.5" style={{ background: METER_COLOR[b.meter] }}>
                <MeterBadge meter={b.meter} size={30} />
                <span className="min-w-0 font-display text-base leading-tight font-extrabold">{b.label}</span>
              </div>

              {/* The stack: tap it to send the top crate back to the pad. */}
              <div className="px-2 pt-2">
                <ToyArea
                  onClick={() => takeBack(i)}
                  disabled={!counts[i]}
                  label={`Take a crate out of ${b.label}. It has ${counts[i]}.`}
                  className="flex min-h-[92px] w-full flex-wrap-reverse content-start items-end justify-center gap-1 !bg-[#f3ecdd] px-1 py-2 disabled:!bg-[#f3ecdd]"
                >
                  <span ref={(el) => void (stacks.current[i] = el)} className="flex flex-wrap-reverse justify-center gap-1">
                    {counts[i] ? (
                      Array.from({ length: counts[i] }, (_, k) => <Crate key={k} size={30} land={landed?.at === i && k === counts[i] - 1} />)
                    ) : (
                      <Crate size={30} faded />
                    )}
                  </span>
                  {counts[i] ? <Undo2 size={16} strokeWidth={3} aria-hidden className="absolute top-1.5 right-1.5 text-muted" /> : null}
                </ToyArea>
              </div>

              {/* Meter now, and a ghost bar for where it will end up. */}
              <div className="px-2 pt-1">
                <p className="font-display text-lg leading-none font-extrabold tabular-nums">
                  <span className="sr-only">{METER_NAMES[b.meter]}: </span>
                  {now}
                  {counts[i] ? <span className="text-good"> → {after}</span> : null}
                </p>
                <div className="relative mt-1 h-3 overflow-hidden rounded-full border-2 border-ink bg-white" aria-hidden>
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-300"
                    style={{ width: `${after}%`, background: `repeating-linear-gradient(135deg, ${METER_COLOR[b.meter]} 0 5px, transparent 5px 9px)` }}
                  />
                  <div className="absolute inset-y-0 left-0" style={{ width: `${now}%`, background: METER_COLOR[b.meter] }} />
                </div>
              </div>

              <div className="mt-auto px-2 pt-2 pb-1">
                <ToyArea
                  onClick={() => add(i)}
                  disabled={left === 0}
                  label={`Put a crate in ${b.label}`}
                  className="flex min-h-12 w-full items-center justify-center gap-1.5 bg-crate font-display text-lg font-extrabold text-ink [--lip:var(--color-crate-lip)] disabled:bg-locked disabled:text-muted disabled:[--lip:var(--color-locked-lip)]"
                >
                  <Plus size={22} strokeWidth={3.25} aria-hidden /> Crate
                </ToyArea>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        <GameButton variant="go" icon={DoorClosed} disabled={left !== 0} onClick={() => onDone(packCrates(game, step, counts))}>
          {left ? `Pack ${left} more` : 'Close the rocket door'}
        </GameButton>
      </div>
    </div>
  );
}
