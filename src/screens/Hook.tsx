// The opening hook (BUILD_SEQUENCE.md A1): first launch only, about 15 seconds.
// The player is dropped into the Sol 214 dust storm and makes one real-feeling choice.
// It is a taste: nothing here touches the real mission state.
import { useEffect, useRef, useState } from 'react';
import { Kid, TwinkleSays } from '../components/Twinkle';
import { ChoiceCard, Meters, MissionCard, OutcomePanel, PrimaryButton, QuietButton, Sky, SourceLine } from '../components/ui';
import type { Meter, Outcome } from '../engine/types';
import { useGame } from '../store/game';

const COUNTDOWN = 60; // seconds — counts for real, pauses while the tab is hidden
const START: Record<Meter, number> = { P: 60, L: 70, F: 60, S: 70 };

/** Level 4's panel choice (plan §6.4) at the medium dust case, D = 15. */
const OPTIONS = {
  fold: { label: 'Fold the panels', delta: { P: -25, F: -5 }, reason: 'The panels are safe. But the greenhouse lights went dim.' },
  leave: { label: 'Leave them out', delta: { P: -15 }, reason: 'You caught the last light. But dust may bury the panels.' },
} satisfies Record<string, { label: string; delta: Partial<Record<Meter, number>>; reason: string }>;
type Pick = keyof typeof OPTIONS;

function apply(delta: Partial<Record<Meter, number>>) {
  const meters = { ...START };
  for (const [m, d] of Object.entries(delta) as [Meter, number][]) meters[m] = Math.max(0, meters[m] + d);
  return meters;
}

function SkipIntro() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  return (
    <QuietButton onClick={() => leaveIntro('home')} className="!min-h-11 !px-3 !text-sm">
      Skip intro
    </QuietButton>
  );
}

export function Hook() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  const [part, setPart] = useState<1 | 2>(1);
  const [left, setLeft] = useState(COUNTDOWN);
  const [pick, setPick] = useState<Pick | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const nextRef = useRef<HTMLDivElement>(null);

  const choose = (p: Pick, auto = false) => {
    if (pick) return;
    setPick(p);
    setTimedOut(auto);
  };

  // The real countdown. Ticks only while the page is visible.
  useEffect(() => {
    if (pick || part !== 1) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [pick, part]);
  useEffect(() => {
    if (left === 0 && !pick) choose('fold', true); // Twinkle folds them; no punishment
  }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  // After a choice, bring the outcome and its Next button into view and focus.
  useEffect(() => {
    if (!pick) return;
    const el = nextRef.current;
    el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    el?.querySelector('button')?.focus({ preventScroll: true });
  }, [pick]);

  if (part === 2) {
    return (
      <Sky place="dust">
        <div className="flex justify-end">
          <SkipIntro />
        </div>
        <div className="rise flex flex-1 flex-col items-center justify-center gap-8 pb-16 text-center">
          <h1 className="font-display text-[34px] leading-tight font-extrabold sm:text-5xl">Every choice costs something.</h1>
          <PrimaryButton onClick={() => leaveIntro('story')} className="!px-8 !text-xl">
            How did we get here?
          </PrimaryButton>
        </div>
      </Sky>
    );
  }

  const chosen = pick ? OPTIONS[pick] : null;
  const outcome: Outcome | null = chosen
    ? { state: { meters: apply(chosen.delta), stars: 0, flags: [], crew: [], X: 20, D: 15 }, delta: chosen.delta, starsDelta: 0, reasons: [chosen.reason], lost: null }
    : null;

  return (
    <Sky place="dust">
      <div className={`flex flex-col gap-4 ${pick ? 'shake' : ''}`}>
        <div className="flex items-center justify-between gap-3">
          <p className="font-display text-lg font-extrabold tracking-wide">SOL 214 · JEZERO BASE</p>
          <SkipIntro />
        </div>

        <h1 className="font-display text-[30px] leading-[1.15] font-extrabold sm:text-[42px]">Commander — a dust storm hits in 60 seconds.</h1>

        {!pick ? (
          <div role="timer" aria-label={`Storm arrives in ${left} seconds`}>
            <div className="h-4 overflow-hidden rounded-full border-2 border-ink bg-paper/60">
              <div className="h-full bg-ink transition-[width] duration-1000 ease-linear" style={{ width: `${(left / COUNTDOWN) * 100}%` }} />
            </div>
            <p className="mt-1 text-right font-display text-lg font-bold tabular-nums" aria-hidden>
              {left} s
            </p>
          </div>
        ) : null}

        <div className="flex items-end justify-between gap-4">
          <TwinkleSays mood="surprised" size={80}>
            {timedOut ? "Time's up! I folded them for you." : 'The solar panels! Fold them, or leave them out?'}
          </TwinkleSays>
          <Kid who="orbit" pose="point" height={200} className="hidden -scale-x-100 sm:block" />
        </div>

        <Meters meters={chosen ? apply(chosen.delta) : START} delta={chosen?.delta} />

        <MissionCard>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(OPTIONS) as Pick[]).map((p) => (
              <ChoiceCard key={p} onClick={() => choose(p)} disabled={!!pick && pick !== p} selected={pick === p} faded={!!pick && pick !== p}>
                <span className="block py-1 text-xl">{OPTIONS[p].label}</span>
              </ChoiceCard>
            ))}
          </div>
          <SourceLine text="Dust storms: NASA Opportunity mission" />
        </MissionCard>

        {outcome ? (
          <div ref={nextRef}>
            <OutcomePanel outcome={outcome}>
              <PrimaryButton onClick={() => setPart(2)}>Next</PrimaryButton>
            </OutcomePanel>
          </div>
        ) : null}
      </div>
    </Sky>
  );
}
