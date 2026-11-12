// The opening hook (BUILD_SEQUENCE.md A1, restyled in G2): first launch only, about 15 seconds.
// The player is dropped into the Sol 214 dust storm and makes one real-feeling choice.
// It is a taste: nothing here touches the real mission state.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, SkipForward, SolarPanel, Sun } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { ChangeChip, ChoiceTile, GameButton } from '../components/GameButton';
import { Hud } from '../components/Hud';
import { outcomeChanges } from '../components/LevelChrome';
import { reducedMotion, shakeScene } from '../components/motion';
import { Panel, SourceStrip } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, TwinkleSays } from '../components/Twinkle';
import type { Meter } from '../engine/types';
import { useGame } from '../store/game';

const COUNTDOWN = 60; // seconds — counts for real, pauses while the tab is hidden
const START: Record<Meter, number> = { P: 60, L: 70, F: 60, S: 70 };

/** Level 4's panel choice (plan §6.4) at the medium dust case, D = 15. */
const OPTIONS = {
  fold: { label: 'Fold the panels', icon: SolarPanel, delta: { P: -25, F: -5 }, reason: 'The panels are safe. But the greenhouse lights went dim.' },
  leave: { label: 'Leave them out', icon: Sun, delta: { P: -15 }, reason: 'You caught the last light. But dust may bury the panels.' },
} satisfies Record<string, { label: string; icon: typeof Sun; delta: Partial<Record<Meter, number>>; reason: string }>;
type Pick = keyof typeof OPTIONS;

function apply(delta: Partial<Record<Meter, number>>) {
  const meters = { ...START };
  for (const [m, d] of Object.entries(delta) as [Meter, number][]) meters[m] = Math.max(0, meters[m] + d);
  return meters;
}

function SkipIntro() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  return (
    <GameButton variant="small" icon={SkipForward} onClick={() => leaveIntro('home')}>
      Skip intro
    </GameButton>
  );
}

/** A big countdown ring: the storm is coming. It closes once a second. */
function CountdownRing({ left }: { left: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div role="timer" aria-label={`Storm arrives in ${left} seconds`} className="relative h-[104px] w-[104px] shrink-0 sm:h-[124px] sm:w-[124px]">
      <svg viewBox="0 0 124 124" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="62" cy="62" r={r + 10} fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="3" />
        <circle cx="62" cy="62" r={r} fill="none" stroke="var(--color-edge)" strokeWidth="12" />
        <circle
          cx="62"
          cy="62"
          r={r}
          fill="none"
          stroke={left <= 10 ? 'var(--color-danger)' : 'var(--color-go)'}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - left / COUNTDOWN)}
          className="transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-[40px] leading-none font-extrabold text-ink tabular-nums" aria-hidden>
        {left}
      </span>
    </div>
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
    shakeScene();
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

  // After a choice (and the tile stamp), bring the outcome and its Next button into view and focus.
  useEffect(() => {
    if (!pick) return;
    const t = setTimeout(() => {
      const el = nextRef.current;
      el?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
      el?.querySelector<HTMLButtonElement>('button.toy')?.focus({ preventScroll: true });
    }, 350);
    return () => clearTimeout(t);
  }, [pick]);

  if (part === 2) {
    return (
      <Scene place="dust">
        <div className="flex justify-end">
          <SkipIntro />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-24 text-center">
          <Kid who="orbit" pose="think" height={180} bob />
          <h1 className="anim-pop-in font-display text-[36px] leading-tight font-extrabold sm:text-5xl">Every choice costs something.</h1>
          <GameButton variant="go" icon={ArrowRight} onClick={() => leaveIntro('story')}>
            How did we get here?
          </GameButton>
        </div>
      </Scene>
    );
  }

  const chosen = pick ? OPTIONS[pick] : null;
  const meters = chosen ? apply(chosen.delta) : START;

  return (
    <Scene place="dust" top={<Hud meters={meters} stars={0} lead={<SkipIntro />} />}>
      <div className="-mx-4">
        <AlarmBanner key={pick ? 'hit' : 'warn'} title={pick ? 'Storm hits!' : 'Storm in 60 s'} sub="Sol 214 · Jezero Base" shake={!pick} />
      </div>

      <div className="flex items-center gap-3">
        <h1 className="min-w-0 flex-1 font-display text-[26px] leading-[1.12] font-extrabold sm:text-[40px]">Commander — a dust storm hits in 60 seconds.</h1>
        {!pick ? <CountdownRing left={left} /> : <Kid who="orbit" pose={pick === 'fold' ? 'surprised' : 'think'} height={120} label="Orbit reacts" />}
      </div>

      <TwinkleSays mood="surprised" size={64}>
        {timedOut ? "Time's up! I folded them for you." : 'The solar panels! Fold them, or leave them out?'}
      </TwinkleSays>

      <div className="grid gap-2 overflow-x-clip sm:grid-cols-2">
        {(Object.keys(OPTIONS) as Pick[]).map((p) => (
          <ChoiceTile
            key={p}
            label={OPTIONS[p].label}
            icon={OPTIONS[p].icon}
            state={!pick ? 'idle' : pick === p ? 'chosen' : 'gone'}
            onClick={() => choose(p)}
          />
        ))}
      </div>

      {chosen ? (
        <div ref={nextRef}>
          <Panel ribbon="What happened" tone="danger">
            <p className="text-lg leading-snug">{chosen.reason}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {outcomeChanges({ delta: chosen.delta, starsDelta: 0 }).map((c) => (
                <ChangeChip key={c.meter} change={c} />
              ))}
            </div>
            <div className="mt-5">
              <GameButton variant="go" icon={ArrowRight} onClick={() => setPart(2)}>
                Next
              </GameButton>
            </div>
          </Panel>
        </div>
      ) : null}

      <SourceStrip text="Dust storms: NASA Opportunity mission" />
    </Scene>
  );
}
