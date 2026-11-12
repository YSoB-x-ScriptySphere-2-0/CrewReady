// Level 2 — the landing checklist. Four big cards. Each right tap drops the little lander one level closer
// to Mars; a wrong tap wobbles the card, the lander bumps, and the level's own cost for a rough landing applies
// (then the player tries again). The engine still judges the whole order with `checkOrder`.
import { useState } from 'react';
import { Flame, PlaneLanding, Rocket, Umbrella, type LucideIcon } from 'lucide-react';
import { checkOrder } from '../../engine/engine';
import type { GameState, OrderStep } from '../../engine/types';
import { ToyArea, type Done } from './shared';
import { reducedMotion } from '../motion';

const CARD_ICON: Record<string, LucideIcon> = { 'Heat shield': Flame, Parachute: Umbrella, 'Landing engines': Rocket, Touchdown: PlaneLanding };

/** The lander, drawn flat. `stage` = how many steps are done: parachute after 2, engine flames after 3, legs down at 4. */
function Lander({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 80 96" className="h-[78px] w-[66px]" aria-hidden>
      {stage === 2 ? (
        <g>
          <path d="M8 34 Q40 -6 72 34 Z" fill="#E8336F" stroke="#1B1F3B" strokeWidth="3" />
          <path d="M8 34 L32 56 M72 34 L48 56 M40 30 L40 52" stroke="#1B1F3B" strokeWidth="2" />
        </g>
      ) : null}
      <path d="M24 52 L56 52 L64 76 L16 76 Z" fill="#FFF8EC" stroke="#1B1F3B" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="40" cy="64" r="6" fill="#1E9BE0" stroke="#1B1F3B" strokeWidth="3" />
      {stage <= 1 ? <path d="M12 76 Q40 92 68 76 Z" fill="#D9622B" stroke="#1B1F3B" strokeWidth="3" /> : null}
      {stage === 3 ? (
        <g fill="#F5B700" stroke="#1B1F3B" strokeWidth="2.5">
          <path d="M22 78 L28 94 L34 78 Z" />
          <path d="M46 78 L52 94 L58 78 Z" />
        </g>
      ) : null}
      {stage >= 4 ? (
        <g stroke="#1B1F3B" strokeWidth="3" strokeLinecap="round">
          <path d="M20 76 L10 92 M60 76 L70 92 M6 92 L16 92 M64 92 L74 92" />
        </g>
      ) : null}
    </svg>
  );
}

export function Landing({ step, game, onDone }: { step: OrderStep; game: GameState; onDone: Done }) {
  // A fixed scrambled order, so the answer is never already on screen.
  const [pool] = useState(() => [...step.sequence].sort((a, b) => a.length - b.length || a.localeCompare(b)));
  const [answer, setAnswer] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const stage = answer.length;
  const busy = wrong !== null || stage === step.sequence.length;

  const tap = (card: string) => {
    if (busy || answer.includes(card)) return;
    const next = [...answer, card];
    if (card !== step.sequence[answer.length]) {
      setWrong(card); // wobble and bump, then the rough-landing cost from the level
      setTimeout(() => onDone(checkOrder(game, step, next), { stay: true }), reducedMotion() ? 0 : 650);
      return;
    }
    setAnswer(next);
    if (next.length === step.sequence.length) setTimeout(() => onDone(checkOrder(game, step, next)), reducedMotion() ? 0 : 700);
  };

  return (
    <div>
      {/* The sky, with Mars at the bottom. The lander drops a level with each right step. */}
      <div className="relative h-[190px] overflow-hidden rounded-panel border-[3px] border-ink shadow-panel" style={{ background: 'linear-gradient(180deg, #1f1a5c 0%, #6b3a6e 55%, #d9622b 100%)' }}>
        <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[34px] w-full" aria-hidden>
          <path d="M0 18 Q60 6 120 16 T240 14 T400 12 L400 40 L0 40 Z" fill="#b84f1f" stroke="#1B1F3B" strokeWidth="3" />
        </svg>
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-[top] duration-500 ease-out ${wrong ? 'anim-bump' : ''}`}
          style={{ top: `${6 + Math.min(stage, 4) * 22}px` }}
        >
          <Lander stage={stage} />
        </div>
        <ol className="absolute top-2 left-2 flex flex-col gap-1" aria-label="Landing steps done">
          {step.sequence.map((s, i) => (
            <li key={s} className={`h-3 w-3 rounded-full border-2 border-paper ${i < stage ? 'bg-good' : 'bg-transparent'}`}>
              <span className="sr-only">{i < stage ? `${i + 1}. ${s} — done` : `Step ${i + 1} — not done`}</span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 font-display text-lg font-extrabold" aria-live="polite">
        {wrong ? 'Bump! Wrong step.' : stage === step.sequence.length ? 'Touchdown!' : `Step ${stage + 1} of ${step.sequence.length}: which comes now?`}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
        {pool.map((card) => {
          const at = answer.indexOf(card);
          const Icon = CARD_ICON[card] ?? PlaneLanding;
          const done = at >= 0;
          return (
            <ToyArea
              key={card}
              onClick={() => tap(card)}
              disabled={done || busy}
              label={done ? `${card} — step ${at + 1}, done` : card}
              className={`flex min-h-[112px] w-full flex-col items-center justify-center gap-1.5 px-2 py-3 text-center ${
                done ? '!bg-[#d8f3e1] disabled:!bg-[#d8f3e1] disabled:!text-ink' : wrong === card ? '!bg-[#ffe0dc] disabled:!bg-[#ffe0dc] disabled:!text-ink anim-wiggle' : 'bg-white'
              }`}
            >
              <span className="relative grid h-12 w-12 place-items-center rounded-[12px] border-[3px] border-ink bg-edge" aria-hidden>
                <Icon size={26} strokeWidth={2.25} />
                {done ? (
                  <span className="anim-pop-in absolute -top-3 -right-3 grid h-7 w-7 place-items-center rounded-full border-[3px] border-ink bg-good font-display text-base leading-none font-extrabold text-white">
                    {at + 1}
                  </span>
                ) : null}
              </span>
              <span className="font-display text-lg leading-tight font-extrabold">{card}</span>
            </ToyArea>
          );
        })}
      </div>
    </div>
  );
}
