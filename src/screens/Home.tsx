// Home (BUILD_SEQUENCE.md A3, restyled in G2). A child must know what to press without reading:
// one huge pink button, the crew on the launch pad, and nothing else competing for attention.
import { useState } from 'react';
import { Lock, Map as MapIcon, Play, RotateCcw, Rocket } from 'lucide-react';
import { Dock } from '../components/Dock';
import { GameButton } from '../components/GameButton';
import { StarCounter } from '../components/Hud';
import { IntelCard, Panel } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { BUILT_SCREENS, missionInProgress, useGame } from '../store/game';

/** Sample until B4 wires live data. Confirmed in DONKI: Kp reached 9.0 on 11 May 2024 (docs/06 §4). */
const SPACE_WEATHER_SAMPLE = { kp: 9, date: '11 May 2024' };

/** Sun storm level as nine blocks, 0–9. */
function KpGauge({ kp }: { kp: number }) {
  return (
    <span className="flex w-full flex-col items-center gap-2">
      <span className="flex gap-1" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} className={`w-5 rounded-[5px] border-[3px] border-ink sm:w-7 ${i < kp ? 'bg-go' : 'bg-sky-space'}`} style={{ height: 14 + i * 4 }} />
        ))}
      </span>
      <span className="text-[28px]">Kp {kp} of 9</span>
    </span>
  );
}

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const inProgress = useGame(missionInProgress);
  const [confirming, setConfirming] = useState(false);
  const quickRunOpen = BUILT_SCREENS.has('quickrun');

  return (
    <Scene place="earth" bottom={<Dock />}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[40px] leading-none font-extrabold">CrewReady</h1>
          <p className="mt-1 font-display text-xl font-bold">Command a Mars mission.</p>
        </div>
        <StarCounter n={game.stars} />
      </header>

      <TwinkleSays size={64}>{inProgress ? 'Welcome back, Commander!' : 'Ready when you are, Commander.'}</TwinkleSays>

      {/* the crew on the launch pad */}
      <div className="flex flex-col items-center" aria-hidden>
        <div className="flex items-end justify-center gap-6 sm:gap-12">
          <Kid who="nova" pose="wave" height={170} bob className="sm:!h-[220px]" />
          <Kid who="orbit" pose="wave" height={170} bob className="sm:!h-[220px]" />
        </div>
        <div className="-mt-2 h-5 w-[78%] max-w-md rounded-full border-[3px] border-ink bg-[#163f94] shadow-[0_5px_0_var(--color-ink)]" />
      </div>

      {confirming ? (
        <Panel ribbon="Start over?" tone="danger">
          <p role="alert" className="text-lg font-bold">
            Start over? Your mission so far will be lost.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <GameButton variant="go" onClick={() => setConfirming(false)}>
              Keep my mission
            </GameButton>
            <GameButton
              variant="plain"
              onClick={() => {
                setConfirming(false);
                startMission();
              }}
            >
              Yes, start over
            </GameButton>
          </div>
        </Panel>
      ) : (
        <div className="flex flex-col gap-1">
          {inProgress ? (
            <GameButton variant="go" icon={Play} full className="!min-h-[68px] !text-[28px]" onClick={() => go('level')}>
              Continue — Level {levelIndex + 1}
            </GameButton>
          ) : (
            <GameButton variant="go" icon={Play} full className="!min-h-[72px] !text-[34px]" onClick={() => startMission()}>
              PLAY
            </GameButton>
          )}
          <div className="mt-1 flex flex-wrap gap-x-2">
            <GameButton variant="small" icon={MapIcon} onClick={() => go('map')}>
              {inProgress ? `Level ${levelIndex + 1} of ${LEVELS.length} — see the map` : 'See the mission map'}
            </GameButton>
            {inProgress ? (
              <GameButton variant="small" icon={RotateCcw} onClick={() => setConfirming(true)}>
                Start over
              </GameButton>
            ) : null}
            <GameButton variant="small" icon={quickRunOpen ? Rocket : Lock} disabled={!quickRunOpen} onClick={() => go('quickrun')}>
              Quick Run — 60 seconds
              {quickRunOpen ? null : <span className="sr-only"> (locked)</span>}
            </GameButton>
          </div>
        </div>
      )}

      <IntelCard
        title="Space weather"
        badge="NASA ARCHIVE"
        date={SPACE_WEATHER_SAMPLE.date}
        figure={<KpGauge kp={SPACE_WEATHER_SAMPLE.kp} />}
        sentence={`Sun storm level: ${SPACE_WEATHER_SAMPLE.kp} of 9.`}
        source={`NASA DONKI · ARCHIVE · ${SPACE_WEATHER_SAMPLE.date}`}
      />
    </Scene>
  );
}
