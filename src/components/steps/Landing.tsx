// Level 2 — the landing checklist. Four big cards (right zone). Each right tap drops the little lander one level
// closer to Mars (left zone); a wrong tap wobbles the card, the lander bumps, and the level's own cost for a
// rough landing applies (then the player tries again). The engine still judges the whole order with `checkOrder`.
import { useState } from 'react';
import { Flame, PlaneLanding, Rocket, Umbrella, type LucideIcon } from 'lucide-react';
import { checkOrder } from '../../engine/engine';
import type { GameState, OrderStep } from '../../engine/types';
import { LeftSlot, ToyArea, type Done } from './shared';
import { reducedMotion } from '../motion';
import { useI18n, tMission } from '../../content/i18n';

const CARD_ICON: Record<string, LucideIcon> = { 'Heat shield': Flame, Parachute: Umbrella, 'Landing engines': Rocket, Touchdown: PlaneLanding };

/** The lander, drawn flat. `stage` = how many steps are done: parachute after 2, engine flames after 3, legs down at 4. */
function Lander({ stage }: { stage: number }) {
  return (
    <svg viewBox="0 0 80 96" className="h-[4.5rem] w-[3.75rem]" aria-hidden>
      {stage === 2 ? (
        <g>
          <path d="M8 34 Q40 -6 72 34 Z" fill="#E8336F" stroke="#F4F7FF" strokeWidth="3" />
          <path d="M8 34 L32 56 M72 34 L48 56 M40 30 L40 52" stroke="#F4F7FF" strokeWidth="2" />
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
        <g stroke="#F4F7FF" strokeWidth="3" strokeLinecap="round">
          <path d="M20 76 L10 92 M60 76 L70 92 M6 92 L16 92 M64 92 L74 92" />
        </g>
      ) : null}
    </svg>
  );
}

export function Landing({ step, game, onDone, slot }: { step: OrderStep; game: GameState; onDone: Done; slot?: HTMLElement | null }) {
  const lang = useI18n((s) => s.lang);
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
    <>
      <LeftSlot slot={slot}>
        {/* The sky, with Mars at the bottom. The lander drops a level with each right step. */}
        <div className="relative h-full w-full overflow-hidden rounded-panel border-2 border-line" style={{ background: 'linear-gradient(180deg, #1f1a5c 0%, #6b3a6e 55%, #d9622b 100%)' }}>
          <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[1.75rem] w-full" aria-hidden>
            <path d="M0 18 Q60 6 120 16 T240 14 T400 12 L400 40 L0 40 Z" fill="#b84f1f" />
          </svg>
          <div className={`absolute left-1/2 -translate-x-1/2 transition-[top] duration-500 ease-out ${wrong ? 'anim-bump' : ''}`} style={{ top: `${3 + Math.min(stage, 4) * 17}%` }}>
            <Lander stage={stage} />
          </div>
          <ol className="absolute top-[0.5rem] left-[0.5rem] flex flex-col gap-[0.25rem]" aria-label="Landing steps done">
            {step.sequence.map((s, i) => (
              <li key={s} className={`h-[0.75rem] w-[0.75rem] rounded-full border-2 border-text ${i < stage ? 'bg-good' : 'bg-transparent'}`}>
                <span className="sr-only">{i < stage ? `${i + 1}. ${s} — done` : `Step ${i + 1} — not done`}</span>
              </li>
            ))}
          </ol>
        </div>
      </LeftSlot>

      <div className="flex h-full min-h-0 flex-col gap-[0.5rem]">
        <p className="font-display text-[1rem] leading-tight font-extrabold" aria-live="polite">
          {wrong
            ? (lang === 'bn' ? 'ধাক্কা! ভুল ধাপ।' : 'Bump! Wrong step.')
            : stage === step.sequence.length
            ? (lang === 'bn' ? 'সফল অবতরণ!' : 'Touchdown!')
            : (lang === 'bn' ? `${step.sequence.length}টির মধ্যে ${stage + 1} নম্বর ধাপ: এখন কোনটি আসবে?` : `Step ${stage + 1} of ${step.sequence.length}: which comes now?`)}
        </p>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-x-[0.5rem] gap-y-[0.25rem]">
          {pool.map((card) => {
            const at = answer.indexOf(card);
            const Icon = CARD_ICON[card] ?? PlaneLanding;
            const done = at >= 0;
            return (
              <ToyArea
                key={card}
                onClick={() => tap(card)}
                disabled={done || busy}
                label={done ? (lang === 'bn' ? `${tMission(card)} — ধাপ ${at + 1}, সম্পন্ন` : `${card} — step ${at + 1}, done`) : tMission(card)}
                className={`flex h-full min-h-0 w-full items-center justify-center gap-[0.5rem] px-[0.5rem] py-[0.25rem] text-left ${
                  done ? '!border-good !bg-good/30 disabled:!bg-good/30 disabled:!text-text' : wrong === card ? '!border-danger !bg-danger/30 disabled:!bg-danger/30 disabled:!text-text anim-wiggle' : 'bg-panel'
                }`}
              >
                <span className="relative grid h-[2.75rem] w-[2.75rem] shrink-0 place-items-center rounded-[0.75rem] border-2 border-line bg-space" aria-hidden>
                  <Icon size={24} strokeWidth={2.25} />
                  {done ? (
                    <span className="anim-pop-in absolute -top-[0.5rem] -right-[0.5rem] grid h-[1.5rem] w-[1.5rem] place-items-center rounded-full border-2 border-line bg-good font-display text-[0.875rem] leading-none font-extrabold text-white">
                      {at + 1}
                    </span>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 font-display text-[1rem] leading-tight font-extrabold">{tMission(card)}</span>
              </ToyArea>
            );
          })}
        </div>
      </div>
    </>
  );
}
