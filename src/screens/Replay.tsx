// Mission Replay, restyled in G2: losing teaches instead of punishing. A full-screen alarm,
// the empty meter shown big and cracked, what caused it, and what real crews do. A8 sharpens the "what caused it" pick.
import { House, RotateCcw } from 'lucide-react';
import { AlarmBanner } from '../components/AlarmBanner';
import { GameButton } from '../components/GameButton';
import { LevelHud } from '../components/LevelChrome';
import { MeterBadge } from '../components/meters';
import { Panel, SourceStrip } from '../components/Panel';
import { Scene } from '../components/Scene';
import { TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
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

export function Replay() {
  const { game, levelIndex, lost, retryLevel, goHome } = useGame();
  const level = LEVELS[levelIndex];
  if (!lost) return null;
  return (
    <Scene place="alarm" top={<LevelHud meters={game.meters} stars={game.stars} />}>
      <div className="-mx-4">
        <AlarmBanner title="Mission paused" sub="Nobody is hurt" />
      </div>

      <TwinkleSays mood="worried" size={80}>
        Mission paused. Nobody is hurt. Let's see what happened.
      </TwinkleSays>

      <Panel ribbon="What ran out" tone="danger">
        <CrackedMeter meter={lost.meter} />
      </Panel>

      <Panel ribbon="What caused it" tone="ink">
        <ul className="space-y-1 text-lg leading-snug">
          {lost.reasons.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </Panel>

      <Panel ribbon="What real crews do" tone="space">
        <p className="text-lg leading-snug">{level.replay[lost.meter] ?? level.replay.default}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <GameButton variant="go" icon={RotateCcw} onClick={retryLevel}>
            Try this level again
          </GameButton>
          <GameButton variant="plain" icon={House} onClick={goHome}>
            Home
          </GameButton>
        </div>
      </Panel>

      <SourceStrip text={level.source} />
    </Scene>
  );
}
