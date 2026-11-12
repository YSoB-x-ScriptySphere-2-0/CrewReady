// The opening hook (BUILD_SEQUENCE.md A1, restyled in G2): first launch only, about 15 seconds.
// The player is dropped into the Sol 214 dust storm and makes one real-feeling choice.
// It is a taste: nothing here touches the real mission state.
// Landscape (R4): HUD, alarm banner, then the kid on the left; on the right Twinkle across the top, the countdown ring
// and two big cards under it. One tap picks; the result takes the cards' place. Nothing scrolls.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, SkipForward, SolarPanel, Sun } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { ChangeChip, ChoiceCard, GameButton } from '../components/GameButton';
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
    // No lip margin: the strip it sits in already leaves room for the lip.
    <GameButton variant="small" icon={SkipForward} onClick={() => leaveIntro('home')} className="!mb-0 !min-h-[2.75rem] !px-[0.875rem] !text-[1rem]">
      Skip intro
    </GameButton>
  );
}

/** A big countdown ring: the storm is coming. It closes once a second. Dark panel, line track, go stroke. */
function CountdownRing({ left }: { left: number }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div role="timer" aria-label={`Storm arrives in ${left} seconds`} className="relative h-[7rem] w-[7rem] shrink-0">
      <svg viewBox="0 0 124 124" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="62" cy="62" r={r + 10} fill="var(--color-panel)" stroke="var(--color-line)" strokeWidth="3" />
        <circle cx="62" cy="62" r={r} fill="none" stroke="var(--color-line)" strokeWidth="12" />
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
      <span className="absolute inset-0 grid place-items-center font-display text-[2.5rem] leading-none font-extrabold text-text tabular-nums" aria-hidden>
        {left}
      </span>
    </div>
  );
}

/** A big icon on top of a choice card. */
function CardIcon({ icon: Icon }: { icon: typeof Sun }) {
  return (
    <span className="grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full bg-space" aria-hidden>
      <Icon size={32} strokeWidth={2.25} />
    </span>
  );
}

export function Hook() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  const [part, setPart] = useState<1 | 2>(1);
  const [left, setLeft] = useState(COUNTDOWN);
  const [pick, setPick] = useState<Pick | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  // The result takes the cards' place once the chosen card has stamped.
  const [shown, setShown] = useState(false);
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

  // After a choice (and the card stamp), the outcome takes the cards' place.
  useEffect(() => {
    if (!pick) return;
    const t = setTimeout(() => setShown(true), reducedMotion() ? 0 : 350);
    return () => clearTimeout(t);
  }, [pick]);
  // Then its Next button takes focus. The stage never scrolls.
  useEffect(() => {
    if (!shown) return;
    nextRef.current?.querySelector<HTMLButtonElement>('button.toy')?.focus({ preventScroll: true });
  }, [shown]);

  if (part === 2) {
    return (
      <Scene bare place="dust">
        <div className="flex justify-end px-[0.75rem] pt-[0.5rem]">
          <SkipIntro />
        </div>
        <div className="flex min-h-0 flex-1 gap-[1rem] px-[0.75rem] pb-[0.75rem]">
          <div className="flex min-h-0 w-[40%] shrink-0 items-end justify-center">
            <Kid who="orbit" pose="think" height="min(17rem, 100%)" className="max-h-full" bob />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[1.25rem] pb-[2rem]">
            <h1 className="anim-pop-in rounded-[1.25rem] bg-panel/85 px-[1rem] py-[0.5rem] font-display text-[2.25rem] leading-tight font-extrabold text-text">
              Every choice costs something.
            </h1>
            <GameButton variant="go" icon={ArrowRight} onClick={() => leaveIntro('story')}>
              How did we get here?
            </GameButton>
          </div>
        </div>
      </Scene>
    );
  }

  const chosen = pick ? OPTIONS[pick] : null;
  const meters = chosen ? apply(chosen.delta) : START;

  return (
    <Scene bare place="dust" top={<Hud meters={meters} stars={0} lead={<SkipIntro />} />}>
      <AlarmBanner key={pick ? 'hit' : 'warn'} title={pick ? 'Storm hits!' : 'Storm in 60 s'} sub="Sol 214 · Jezero Base" shake={!pick} />

      <div className="flex min-h-0 flex-1 flex-col gap-[0.25rem] px-[0.75rem] py-[0.25rem]">
        {/* The setup line. Once the storm hits there is no room for it next to the result, so it stays for screen readers only. */}
        <h1
          className={
            pick
              ? 'sr-only'
              : 'max-w-full shrink-0 self-center truncate rounded-full bg-panel/85 px-[0.875rem] py-[0.0625rem] font-display text-[1.125rem] leading-snug font-extrabold text-text'
          }
        >
          Commander — a dust storm hits in 60 seconds.
        </h1>

        <div className="flex min-h-0 flex-1 gap-[0.75rem]">
          {/* left: the kid, reacting */}
          <div className="flex min-h-0 w-[24%] shrink-0 items-end justify-center">
            <Kid who="orbit" pose={pick === 'fold' ? 'surprised' : 'think'} height="min(13rem, 100%)" label="Orbit reacts" className="max-h-full" />
          </div>

          {/* right: Twinkle across the top, then the countdown and the two cards (then the result in their place), the source */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[0.25rem] text-text">
            <div className="shrink-0">
              <TwinkleSays mood="surprised" size={44}>
                <span className="text-[1rem]">{timedOut ? "Time's up! I folded them for you." : 'The solar panels! Fold them, or leave them out?'}</span>
              </TwinkleSays>
            </div>

            <div className="flex min-h-0 flex-1 gap-[0.75rem]">
              {/* middle: the countdown, until the storm hits */}
              {!pick ? (
                <div className="flex min-h-0 shrink-0 items-center justify-center">
                  <CountdownRing left={left} />
                </div>
              ) : null}

              {chosen && shown ? (
                <div ref={nextRef} className="rise flex min-w-0 flex-1 flex-col justify-center">
                  <Panel compact ribbon="What happened" tone="danger">
                    <p className="text-[0.9375rem] leading-snug">{chosen.reason}</p>
                    <div className="mt-[0.375rem] flex flex-wrap items-center gap-[0.5rem]">
                      {outcomeChanges({ delta: chosen.delta, starsDelta: 0 }).map((c) => (
                        <ChangeChip key={c.meter} change={c} />
                      ))}
                      <GameButton variant="go" icon={ArrowRight} onClick={() => setPart(2)} className="ml-auto !mb-0 !min-h-[3rem]">
                        Next
                      </GameButton>
                    </div>
                  </Panel>
                </div>
              ) : (
                <div className="flex min-h-0 min-w-0 flex-1 gap-[0.75rem]">
                  {(Object.keys(OPTIONS) as Pick[]).map((p) => (
                    <ChoiceCard
                      key={p}
                      label={<span className="text-[1.125rem]">{OPTIONS[p].label}</span>}
                      picture={<CardIcon icon={OPTIONS[p].icon} />}
                      state={!pick ? 'idle' : pick === p ? 'chosen' : 'gone'}
                      onClick={() => choose(p)}
                      className="!min-h-[6rem]"
                    />
                  ))}
                </div>
              )}
            </div>

            <SourceStrip text="Dust storms: NASA Opportunity mission" className="shrink-0" />
          </div>
        </div>
      </div>
    </Scene>
  );
}
