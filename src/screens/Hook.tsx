// The opening hook (BUILD_SEQUENCE.md A1, restyled in G2): first launch only, about 15 seconds.
// The player is dropped into the Sol 214 dust storm and makes one real-feeling choice.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, SkipForward, SolarPanel, Sun } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { ChangeChip, ChoiceCard, GameButton } from '../components/GameButton';
import { Hud } from '../components/Hud';
import { outcomeChanges } from '../components/LevelChrome';
import { reducedMotion, shakeScene } from '../components/motion';
import { Panel, SourceLine } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, TwinkleSays } from '../components/Twinkle';
import type { Meter } from '../engine/types';
import { useGame } from '../store/game';
import { t, useI18n } from '../content/i18n';

const COUNTDOWN = 60;
const START: Record<Meter, number> = { P: 60, L: 70, F: 60, S: 70 };

/** Level 4's panel choice (plan §6.4) at the medium dust case, D = 15. */
const OPTIONS = {
  fold: {
    labelKey: 'hook.fold',
    hintKey: 'hook.fold.sub',
    icon: SolarPanel,
    accent: 'border-cyan-400/40 bg-cyan-500/20 text-cyan-300',
    delta: { P: -25, F: -5 },
    reasonEn: 'The panels are safe. But the greenhouse lights went dim.',
    reasonBn: 'প্যানেলগুলো সুরক্ষিত আছে। তবে গ্রিনহাউসের আলো কিছুটা কমে গেছে।',
  },
  leave: {
    labelKey: 'hook.leave',
    hintKey: 'hook.leave.sub',
    icon: Sun,
    accent: 'border-amber-400/40 bg-amber-500/20 text-amber-300',
    delta: { P: -15 },
    reasonEn: 'You caught the last light. But dust may bury the panels.',
    reasonBn: 'তুমি সূর্যের শেষ আলো সংগ্রহ করেছো। তবে ধুলোয় প্যানেল ঢেকে যাওয়ার ঝুঁকি রয়েছে।',
  },
} as const;
type Pick = keyof typeof OPTIONS;

function apply(delta: Partial<Record<Meter, number>>) {
  const meters = { ...START };
  for (const [m, d] of Object.entries(delta) as [Meter, number][]) meters[m] = Math.max(0, meters[m] + d);
  return meters;
}

function SkipIntro() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  return (
    <button
      onClick={() => leaveIntro('home')}
      className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 px-3 py-1 text-xs font-display font-bold text-white shadow-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer"
    >
      <SkipForward size={14} />
      <span>{t('btn.skip')}</span>
    </button>
  );
}

/** Telemetry card countdown ring */
function CountdownRing({ left }: { left: number }) {
  const lang = useI18n((s) => s.lang);
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div
      role="timer"
      aria-label={`Storm arrives in ${left} seconds`}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-line/80 bg-panel/90 px-3 py-2 shadow-xl backdrop-blur-md"
    >
      <span className="font-display text-[9px] font-extrabold uppercase tracking-widest text-muted">
        {lang === 'bn' ? 'ঝড় আসার বাকি' : 'Time to Dust'}
      </span>
      <div className="relative mt-0.5 h-[5rem] w-[5rem] shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="60" cy="60" r={r} fill="none" stroke="var(--color-line)" strokeWidth="10" opacity="0.4" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={left <= 10 ? 'var(--color-danger)' : 'var(--color-go)'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - left / COUNTDOWN)}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-[1.75rem] leading-none font-extrabold text-text tabular-nums" aria-hidden>
          {left}s
        </span>
      </div>
    </div>
  );
}

function CardIcon({ icon: Icon, accent }: { icon: typeof Sun; accent: string }) {
  return (
    <span className={`grid h-[2.75rem] w-[2.75rem] shrink-0 place-items-center rounded-xl border shadow-md ${accent}`} aria-hidden>
      <Icon size={24} strokeWidth={2.4} />
    </span>
  );
}

export function Hook() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  const lang = useI18n((s) => s.lang);
  const [part, setPart] = useState<1 | 2>(1);
  const [left, setLeft] = useState(COUNTDOWN);
  const [pick, setPick] = useState<Pick | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [shown, setShown] = useState(false);
  const nextRef = useRef<HTMLDivElement>(null);

  const choose = (p: Pick, auto = false) => {
    if (pick) return;
    setPick(p);
    if (auto) setTimedOut(true);
    shakeScene();
    setTimeout(() => setShown(true), reducedMotion() ? 0 : 350);
  };

  useEffect(() => {
    if (pick) return;
    const tick = setInterval(() => {
      if (document.hidden) return;
      setLeft((n) => {
        if (n <= 1) {
          clearInterval(tick);
          choose('fold', true);
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [pick]);

  useEffect(() => {
    if (!shown) return;
    nextRef.current?.querySelector<HTMLButtonElement>('button.toy')?.focus({ preventScroll: true });
  }, [shown]);

  const chosen = pick ? OPTIONS[pick] : null;
  const meters = chosen ? apply(chosen.delta) : START;

  if (part === 2) {
    return (
      <Scene bare place="space" top={<Hud meters={meters} stars={0} lead={<SkipIntro />} />}>
        <div className="flex h-full min-h-0 flex-1 items-center gap-[1.5rem] px-[1.5rem]">
          <div className="flex min-h-0 w-[42%] shrink-0 items-end justify-center pb-[0.5rem]">
            <Kid who="orbit" pose="arms" height="min(15rem, 100%)" label="Orbit" className="max-h-full" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-[1rem] pb-[1rem]">
            <h1 className="anim-pop-in rounded-[1.25rem] bg-panel/85 px-[1rem] py-[0.5rem] font-display text-[1.75rem] sm:text-[2.25rem] leading-snug font-extrabold text-text">
              {lang === 'bn' ? 'প্রতিটি সিদ্ধান্ত অত্যন্ত গুরুত্বপূর্ণ!' : 'Every heroic choice counts!'}
            </h1>
            <p className="text-base sm:text-lg text-text/90 font-medium leading-relaxed">
              {t('hook.bridge')}
            </p>
            <GameButton
              variant="go"
              icon={ArrowRight}
              onClick={() => leaveIntro('story')}
              className="!min-h-[3rem] !px-6 !text-base sm:!text-lg"
            >
              {lang === 'bn' ? 'পৃথিবীর গল্পটি দেখো 🌍' : 'See Earth’s Story 🌍'}
            </GameButton>
          </div>
        </div>
      </Scene>
    );
  }

  return (
    <Scene bare place="dust" top={<Hud meters={meters} stars={0} lead={<SkipIntro />} />}>
      <AlarmBanner
        key={pick ? 'hit' : 'warn'}
        title={pick ? (lang === 'bn' ? 'ঝড় আঘাত হেনেছে!' : 'Storm hits!') : (lang === 'bn' ? '৬০ সেকেন্ডে ঝড় আসছে!' : 'Storm in 60 s')}
        sub={t('hook.tag')}
        shake={!pick}
      />

      <div className="flex min-h-0 flex-1 flex-col gap-[0.25rem] px-[0.75rem] py-[0.25rem]">
        <h1
          className={
            pick
              ? 'sr-only'
              : 'max-w-full shrink-0 self-center truncate rounded-full bg-panel/85 px-[0.875rem] py-[0.0625rem] font-display text-[1rem] sm:text-[1.125rem] leading-snug font-extrabold text-text'
          }
        >
          {t('hook.prompt')}
        </h1>

        <div className="flex min-h-0 flex-1 gap-[0.75rem]">
          {/* left: kid reacting */}
          <div className="flex min-h-0 w-[24%] shrink-0 items-end justify-center">
            <Kid who="orbit" pose={pick === 'fold' ? 'surprised' : 'think'} height="min(13rem, 100%)" label="Orbit reacts" className="max-h-full" />
          </div>

          {/* right: Twinkle and cards */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[0.25rem] text-text">
            <div className="shrink-0">
              <TwinkleSays mood="surprised" size={44}>
                <span className="text-[0.9375rem] sm:text-[1rem] leading-snug">
                  {timedOut
                    ? (lang === 'bn' ? 'সময় শেষ! আমি প্যানেলগুলো ভাঁজ করে দিয়েছি।' : "Time's up! I folded them for you.")
                    : (lang === 'bn' ? 'সোলার প্যানেল! গুটিয়ে নেবে, নাকি খোলা রাখবে?' : 'The solar panels! Fold them, or leave them out?')}
                </span>
              </TwinkleSays>
            </div>

            <div className="flex min-h-0 flex-1 gap-[0.75rem]">
              {!pick ? (
                <div className="flex min-h-0 shrink-0 items-center justify-center">
                  <CountdownRing left={left} />
                </div>
              ) : null}

              {chosen && shown ? (
                <div ref={nextRef} className="rise flex min-w-0 flex-1 flex-col justify-center">
                  <Panel compact ribbon={lang === 'bn' ? 'ফলাফল' : 'What happened'} tone="danger">
                    <p className="text-[0.9375rem] leading-snug font-bold">
                      {lang === 'bn' ? chosen.reasonBn : chosen.reasonEn}
                    </p>
                    <div className="mt-[0.375rem] flex flex-wrap items-center gap-[0.5rem]">
                      {outcomeChanges({ delta: chosen.delta, starsDelta: 0 }).map((c) => (
                        <ChangeChip key={c.meter} change={c} />
                      ))}
                      <GameButton
                        variant="go"
                        icon={ArrowRight}
                        onClick={() => setPart(2)}
                        className="ml-auto !mb-0 !min-h-[2.875rem] !px-5 !text-sm sm:!text-base"
                      >
                        {t('btn.next')}
                      </GameButton>
                    </div>
                  </Panel>
                </div>
              ) : (
                <div className="flex min-h-0 min-w-0 flex-1 gap-[0.75rem]">
                  {(Object.keys(OPTIONS) as Pick[]).map((p) => {
                    const opt = OPTIONS[p];
                    const label = t(opt.labelKey);
                    const hint = t(opt.hintKey);
                    return (
                      <ChoiceCard
                        key={p}
                        label={
                          <span className="flex flex-col items-center gap-1">
                            <span className="text-[1rem] sm:text-[1.125rem] font-extrabold leading-snug break-words">{label}</span>
                            <span className="rounded-full bg-space/60 px-2 py-0.5 text-[0.6875rem] sm:text-[0.75rem] font-bold text-muted border border-line/40 leading-tight break-words line-clamp-2">
                              {hint}
                            </span>
                          </span>
                        }
                        picture={<CardIcon icon={opt.icon} accent={opt.accent} />}
                        state={!pick ? 'idle' : pick === p ? 'chosen' : 'gone'}
                        onClick={() => choose(p)}
                        className="!min-h-[6rem] sm:!min-h-[6.25rem] border-2 border-line/80 bg-panel/90 hover:border-go/60 shadow-lg"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex shrink-0 items-center justify-between rounded-full border border-white/20 bg-white/[0.08] backdrop-blur-md px-3.5 py-1 text-text shadow-sm text-xs">
              <SourceLine text="Dust storms: NASA Opportunity mission" bare />
              <span className="hidden sm:inline font-display text-[0.6875rem] font-extrabold uppercase tracking-wider text-muted/80">
                NASA Opportunity Mission
              </span>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}
