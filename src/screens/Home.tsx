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

/** Bands follow docs/06 §4 (Kp 0–3 slow, 4–6 medium, 7–9 fast). No NOAA G-scale: it isn't sourced in docs/06. */
function getStormTier(kp: number): { scale: string; label: string; tone: 'calm' | 'active' | 'storm' | 'extreme'; barColor: string } {
  if (kp >= 7) return { scale: 'Stormy Sun', label: 'Big storm', tone: 'extreme', barColor: 'bg-danger' };
  if (kp >= 4) return { scale: 'Busy Sun', label: 'Some storms', tone: 'active', barColor: 'bg-power' };
  return { scale: 'Calm Sun', label: 'Quiet', tone: 'calm', barColor: 'bg-good' };
}

/** Sun storm level as nine graduated blocks with NOAA classification and live pulse. */
function KpGauge({ kp }: { kp: number }) {
  const tier = getStormTier(kp);
  return (
    <div className="flex w-full flex-col items-center gap-2.5 py-1">
      <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper px-3 py-1 text-ink shadow-[0_2px_0_var(--color-ink)]">
        <span
          className={`h-2.5 w-2.5 rounded-full ${tier.tone === 'extreme' ? 'bg-danger' : tier.tone === 'storm' ? 'bg-[#e85d04]' : 'bg-good'}`}
          aria-hidden
        />
        <span className="font-display text-sm font-extrabold uppercase tracking-wider">{tier.scale}</span>
        <span className="text-sm font-bold text-muted">· {tier.label}</span>
      </div>

      <span className="flex items-end gap-1.5" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => {
          const active = i < kp;
          const isHigh = i >= 6;
          return (
            <span
              key={i}
              className={`w-5 rounded-[6px] border-[3px] border-ink transition-all sm:w-7 ${
                active
                  ? isHigh
                    ? 'bg-danger'
                    : tier.barColor
                  : 'bg-sky-space opacity-40'
              }`}
              style={{ height: 16 + i * 4 }}
            />
          );
        })}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[30px] font-extrabold text-paper">Kp {kp}</span>
        <span className="text-base font-bold text-paper/80">of 9 max</span>
      </div>
    </div>
  );
}

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const inProgress = useGame(missionInProgress);
  const [confirming, setConfirming] = useState(false);
  const flyOpen = BUILT_SCREENS.has('fly');

  return (
    <Scene place="earth" rail={<Dock />}>
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
            <GameButton variant="small" icon={flyOpen ? Rocket : Lock} disabled={!flyOpen} onClick={() => go('fly')}>
              Fly
              {flyOpen ? null : <span className="sr-only"> (locked)</span>}
            </GameButton>
          </div>
        </div>
      )}

      <IntelCard
        title="Space weather"
        badge="NASA ARCHIVE"
        date={SPACE_WEATHER_SAMPLE.date}
        figure={<KpGauge kp={SPACE_WEATHER_SAMPLE.kp} />}
        sentence="Solar storms blast radiation. Crews shelter behind water."
        source={`NASA DONKI + NOAA SWPC · ARCHIVE · ${SPACE_WEATHER_SAMPLE.date}`}
      />
    </Scene>
  );
}
