// A8 — Mission Replay: losing teaches instead of punishing. Alarm scene, the "MISSION PAUSED — NOBODY IS HURT"
// banner, Twinkle worried, and three short panels: what ran out (the empty pill, big and cracked), what cost the
// most (that one choice, replayed small with its loss), and what real crews do (one line and its source).
// R4, landscape: HUD and banner across the top; Twinkle on the left; the three panels side by side on the right,
// with the source strip, Try again and Home under them. Nothing scrolls the page.
import type { ReactNode } from 'react';
import { House, RotateCcw } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { ChangeChip, GameButton } from '../components/GameButton';
import { LevelHud } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { SourceStrip } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Twinkle } from '../components/Twinkle';
import { iconForEntry } from '../content/icons';
import { LEVELS } from '../content/levels';
import type { LogEntry } from '../engine/engine';
import { METER_NAMES, type Meter } from '../engine/types';
import { useGame } from '../store/game';
import { t } from '../content/i18n';

const HEAD_TONE = { danger: 'bg-danger text-white', ink: 'bg-panel-up text-text', space: 'bg-sky-space text-text' } as const;

/**
 * One narrow dark panel with its title on a coloured header (the Panel ribbon would cut these titles short
 * in a column this narrow, so the header here may wrap).
 */
function ReplayPanel({ title, tone, children }: { title: string; tone: keyof typeof HEAD_TONE; children: ReactNode }) {
  return (
    <section className="rise flex min-h-0 min-w-0 flex-col gap-[0.375rem] rounded-panel border-2 border-line bg-panel p-[0.375rem] text-text">
      <h2 className={`shrink-0 rounded-[1rem] border-2 border-line px-[0.5rem] py-[0.125rem] font-display text-[0.875rem] leading-tight font-extrabold ${HEAD_TONE[tone]}`}>
        {title}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col gap-[0.375rem] overflow-y-auto px-[0.125rem]">{children}</div>
    </section>
  );
}

/** The meter that ran out: big, empty and cracked. Stacked to fit a narrow column. */
function CrackedMeter({ meter }: { meter: Meter }) {
  return (
    <div className="flex flex-col gap-[0.375rem]" role="img" aria-label={`${METER_NAMES[meter]}: 0. It ran out.`}>
      <div className="flex items-center justify-between gap-[0.5rem]">
        <MeterBadge meter={meter} size={44} />
        <span className="font-display text-[2.5rem] leading-none font-extrabold text-danger tabular-nums">0</span>
      </div>
      <p className="font-display text-[1.125rem] leading-tight font-extrabold">{METER_NAMES[meter]}</p>
      <div className="relative h-[1.5rem] overflow-hidden rounded-full border-2 border-line bg-space-deep">
        <svg viewBox="0 0 200 28" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M70 0 L80 10 L72 15 L86 28 M80 10 L96 8 M140 0 L132 12 L146 18 L138 28" fill="none" stroke="var(--color-text)" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/** The choice that cost the most, replayed small: its tile, stamped, with its loss to the failed meter. */
function BlameTile({ entry, meter }: { entry: LogEntry; meter: Meter }) {
  const Icon = iconForEntry(entry.label, entry.living);
  return (
    <div className="anim-stamp flex shrink-0 flex-col gap-[0.25rem] rounded-tile border-2 border-danger bg-panel-up p-[0.375rem]">
      <div className="flex items-center justify-between gap-[0.375rem]">
        <span className="grid h-[2rem] w-[2rem] shrink-0 place-items-center rounded-[0.625rem] border-2 border-line bg-space" aria-hidden>
          <Icon size={20} strokeWidth={2.25} />
        </span>
        <ChangeChip change={{ meter, amount: entry.delta[meter]! }} size="sm" />
      </div>
      <span className="min-w-0 font-display text-[0.875rem] leading-[1.1] font-extrabold">{entry.label}</span>
    </div>
  );
}

export function Replay() {
  const { game, levelIndex, lost, retryLevel, goHome } = useGame();
  const level = LEVELS[levelIndex];
  if (!lost) return null;
  const blame = lost.blame ?? null; // saves from before A8 have no blame

  return (
    <Scene bare place="alarm" top={<LevelHud meters={game.meters} stars={game.stars} />}>
      <div className="shrink-0">
        <AlarmBanner title={t('replay.paused')} sub={t('replay.nobodyHurt')} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row gap-2 sm:gap-3 px-2 sm:px-3 pt-2 pb-2">
        {/* Left: Twinkle, worried, standing in the scene. */}
        <div className="flex min-h-0 w-full md:w-[18%] shrink-0 items-center md:items-end justify-center max-h-[6rem] md:max-h-none">
          <span className="anim-pop-in">
            <Twinkle mood="worried" size={72} />
          </span>
        </div>

        {/* Right: three panels side by side on desktop, stacked on mobile */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-3 gap-2">
            <ReplayPanel title={t('replay.whatRanOut')} tone="danger">
              <CrackedMeter meter={lost.meter} />
            </ReplayPanel>

            <ReplayPanel title={t('replay.whatCostMost')} tone="ink">
              {blame ? (
                <>
                  <BlameTile entry={blame} meter={lost.meter} />
                  <p className="text-[0.875rem] leading-tight">
                    {blame.living ? `Time passing used up your ${METER_NAMES[lost.meter]}.` : `This choice cost the most ${METER_NAMES[lost.meter]}.`}
                  </p>
                </>
              ) : (
                <ul className="space-y-[0.25rem] text-[0.9375rem] leading-snug">
                  {lost.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </ReplayPanel>

            <ReplayPanel title={t('replay.realCrews')} tone="space">
              <p className="text-[1rem] leading-snug">{level.replay[lost.meter] ?? level.replay.default}</p>
            </ReplayPanel>
          </div>

          <div className="flex shrink-0 flex-wrap sm:flex-nowrap items-center gap-2 pt-1">
            <SourceStrip text={level.source} className="min-w-0 flex-1" />
            <GameButton variant="go" icon={RotateCcw} onClick={retryLevel} className="!min-h-[2.75rem] !px-4 sm:!px-6 !text-base sm:!text-xl leading-snug break-words">
              {t('btn.tryAgain')}
            </GameButton>
            <GameButton variant="plain" icon={House} onClick={goHome} className="!min-h-[2.75rem] !px-3 sm:!px-4 !text-sm sm:!text-base leading-snug break-words">
              {t('btn.home')}
            </GameButton>
          </div>
        </div>
      </div>
    </Scene>
  );
}
