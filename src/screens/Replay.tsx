// A8 — Mission Replay: losing teaches instead of punishing. Alarm scene, the "MISSION PAUSED — NOBODY IS HURT"
// banner, Twinkle worried, and three short panels: what ran out (the empty pill, big and cracked), what cost the
// most (that one choice, replayed small with its loss), and what real crews do (one line and its source).
import { House, RotateCcw } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { ChangeChip, GameButton } from '../components/GameButton';
import { LevelHud } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { Panel, SourceLine } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Twinkle } from '../components/Twinkle';
import { iconForEntry } from '../content/icons';
import { LEVELS } from '../content/levels';
import type { LogEntry } from '../engine/engine';
import { METER_NAMES, type Meter } from '../engine/types';
import { useGame } from '../store/game';

/** The meter that ran out: big, empty and cracked. */
function CrackedMeter({ meter }: { meter: Meter }) {
  return (
    <div className="flex items-center gap-3" role="img" aria-label={`${METER_NAMES[meter]}: 0. It ran out.`}>
      <MeterBadge meter={meter} size={64} />
      <div className="min-w-0 flex-1">
        <p className="font-display text-[26px] leading-none font-extrabold">{METER_NAMES[meter]}</p>
        <div className="relative mt-2 h-7 overflow-hidden rounded-full border-[3px] border-ink bg-white">
          <svg viewBox="0 0 200 28" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M70 0 L80 10 L72 15 L86 28 M80 10 L96 8 M140 0 L132 12 L146 18 L138 28" fill="none" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <span className="font-display text-[44px] leading-none font-extrabold text-danger tabular-nums">0</span>
    </div>
  );
}

/** The choice that cost the most, replayed small: its tile, stamped, with its loss to the failed meter. */
function BlameTile({ entry, meter }: { entry: LogEntry; meter: Meter }) {
  const Icon = iconForEntry(entry.label, entry.living);
  return (
    <div className="anim-stamp flex items-center gap-3 rounded-tile border-[3px] border-ink bg-[#ffe3ec] p-3 shadow-[0_5px_0_#e9a3bb,0_5px_0_3px_var(--color-ink)]">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[12px] border-[3px] border-ink bg-white" aria-hidden>
        <Icon size={26} strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1 font-display text-lg leading-tight font-extrabold">{entry.label}</span>
      <ChangeChip change={{ meter, amount: entry.delta[meter]! }} />
    </div>
  );
}

export function Replay() {
  const { game, levelIndex, lost, retryLevel, goHome } = useGame();
  const level = LEVELS[levelIndex];
  if (!lost) return null;
  const blame = lost.blame ?? null; // saves from before A8 have no blame

  return (
    <Scene place="alarm" top={<LevelHud meters={game.meters} stars={game.stars} />}>
      <div className="-mx-4">
        <AlarmBanner title="Mission paused" sub="Nobody is hurt" />
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-6">
        <div className="flex justify-center lg:pt-6">
          <span className="anim-pop-in">
            <Twinkle mood="worried" size={104} />
          </span>
        </div>

        <div className="space-y-4">
          <Panel ribbon="What ran out" tone="danger">
            <CrackedMeter meter={lost.meter} />
          </Panel>

          <Panel ribbon="What cost the most" tone="ink">
            {blame ? (
              <>
                <BlameTile entry={blame} meter={lost.meter} />
                <p className="mt-3 text-lg leading-snug">
                  {blame.living ? `Time passing used up your ${METER_NAMES[lost.meter]}.` : `This choice cost the most ${METER_NAMES[lost.meter]}.`}
                </p>
              </>
            ) : (
              <ul className="space-y-1 text-lg leading-snug">
                {lost.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel ribbon="What real crews do" tone="space">
            <p className="text-lg leading-snug">{level.replay[lost.meter] ?? level.replay.default}</p>
            <SourceLine text={level.source} />
          </Panel>

          <div className="flex flex-wrap gap-3">
            <GameButton variant="go" icon={RotateCcw} onClick={retryLevel}>
              Try again
            </GameButton>
            <GameButton variant="plain" icon={House} onClick={goHome}>
              Home
            </GameButton>
          </div>
        </div>
      </div>
    </Scene>
  );
}
