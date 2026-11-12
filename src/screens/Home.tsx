// Home (BUILD_SEQUENCE.md A3, restyled in G2, re-laid for the landscape stage in R4).
// A child must know what to press without reading: the crew on the launch pad on the left,
// one huge cyan button on the right, the space-weather card under it, and the Dock rail.
import { useState } from 'react';
import { Lock, Map as MapIcon, Play, RotateCcw, Rocket } from 'lucide-react';
import { Dock } from '../components/Dock';
import { GameButton } from '../components/GameButton';
import { StarCounter } from '../components/Hud';
import { IntelCard, Panel, Ribbon } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { BUILT_SCREENS, missionInProgress, useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';

/** Bands follow docs/06 §4 (Kp 0–3 slow, 4–6 medium, 7–9 fast). No NOAA G-scale: it isn't sourced in docs/06. */
function getStormTier(kp: number): { scale: string; label: string; tone: 'calm' | 'active' | 'storm' | 'extreme'; barColor: string } {
  if (kp >= 7) return { scale: 'Stormy Sun', label: 'Big storm', tone: 'extreme', barColor: 'bg-danger' };
  // Orange, not the Power meter's yellow: a meter colour means its meter only (§4.3).
  if (kp >= 4) return { scale: 'Busy Sun', label: 'Some storms', tone: 'active', barColor: 'bg-[#e85d04]' };
  return { scale: 'Calm Sun', label: 'Quiet', tone: 'calm', barColor: 'bg-good' };
}

/**
 * Sun storm level as nine graduated blocks, sized for the Intel card's small figure box (about 7 rem):
 * the blocks, "Kp 9 of 9 max", then the tier name and label. Colour is never alone: the words say it too.
 */
function KpGauge({ kp }: { kp: number }) {
  const tier = getStormTier(kp);
  return (
    <div className="flex w-full flex-col items-center gap-[0.1875rem] py-[0.125rem] text-text">
      <span className="flex items-end gap-[0.125rem]" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => {
          const active = i < kp;
          const isHigh = i >= 6;
          return (
            <span
              key={i}
              className={`w-[0.5rem] rounded-[0.1875rem] border border-line ${active ? (isHigh ? 'bg-danger' : tier.barColor) : 'bg-space-deep'}`}
              style={{ height: `${0.5 + i * 0.09375}rem` }}
            />
          );
        })}
      </span>
      <span className="flex flex-wrap items-baseline justify-center gap-x-[0.25rem]">
        <span className="font-display text-[1.25rem] leading-none font-extrabold">Kp {kp}</span>
        <span className="font-display text-[0.75rem] leading-none font-bold text-muted">of 9 max</span>
      </span>
      <span className="flex max-w-full flex-col items-center text-center">
        <span className="flex flex-wrap items-center justify-center gap-[0.25rem]">
          <span
            className={`h-[0.5rem] w-[0.5rem] shrink-0 rounded-full ${tier.tone === 'extreme' ? 'bg-danger' : tier.tone === 'storm' ? 'bg-[#e85d04]' : 'bg-good'}`}
            aria-hidden
          />
          <span className="font-display text-[0.75rem] leading-tight font-extrabold uppercase">{tier.scale}</span>
        </span>
        <span className="font-display text-[0.8125rem] leading-tight font-bold text-muted">{tier.label}</span>
      </span>
    </div>
  );
}

/** The small buttons under the main one: 2.75 rem tall (the touch minimum), tighter than the kit's default. */
const SMALL = '!min-h-[2.75rem] !px-[0.875rem] !text-[1rem]';

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const inProgress = useGame(missionInProgress);
  const kpNow = useSpace((s) => s.kp);
  const [confirming, setConfirming] = useState(false);
  const flyOpen = BUILT_SCREENS.has('fly');

  return (
    <Scene bare place="earth" rail={<Dock />}>
      <div className="flex min-h-0 flex-1 gap-[0.75rem] px-[0.75rem] pt-[0.5rem] pb-[0.5rem]">
        {/* Left: title, Twinkle, and the crew on the launch pad. */}
        <div className="flex min-h-0 w-[38%] shrink-0 flex-col gap-[0.25rem]">
          <header className="text-text">
            <h1 className="font-display text-[1.75rem] leading-none font-extrabold">CrewReady</h1>
            <p className="font-display text-[1rem] leading-snug font-bold">Command a Mars mission.</p>
          </header>

          <TwinkleSays size={44}>{inProgress ? 'Welcome back, Commander!' : 'Ready when you are, Commander.'}</TwinkleSays>

          <div className="flex min-h-0 flex-1 flex-col items-center" aria-hidden>
            <div className="flex min-h-0 w-full flex-1 items-end justify-center gap-[0.5rem]">
              <Kid who="nova" pose="wave" height="min(12.5rem, 100%)" bob className="max-h-full max-w-[47%] object-contain object-bottom" />
              <Kid who="orbit" pose="wave" height="min(12.5rem, 100%)" bob className="max-h-full max-w-[47%] object-contain object-bottom" />
            </div>
            <div className="-mt-[0.375rem] h-[1rem] w-[92%] shrink-0 rounded-full border-2 border-line bg-[#163f94] shadow-[0_0.3rem_0_var(--color-lip)]" />
          </div>
        </div>

        {/* Right: the one main button, the small buttons, the space-weather card. */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[0.25rem]">
          {confirming ? (
            <>
              <div className="flex items-center justify-between gap-[0.5rem]">
                <Ribbon tone="danger">Start over?</Ribbon>
                <StarCounter n={game.stars} />
              </div>
              <Panel compact>
                <p role="alert" className="font-display text-[1rem] leading-snug font-bold">
                  Start over? Your mission so far will be lost.
                </p>
                <div className="mt-[0.5rem] flex flex-wrap gap-x-[0.5rem] gap-y-[0.125rem]">
                  <GameButton variant="go" onClick={() => setConfirming(false)} className="!min-h-[2.75rem] !px-[0.75rem] !text-[1rem]">
                    Keep my mission
                  </GameButton>
                  <GameButton
                    variant="plain"
                    className="!min-h-[2.75rem] !px-[0.75rem] !text-[1rem]"
                    onClick={() => {
                      setConfirming(false);
                      startMission();
                    }}
                  >
                    Yes, start over
                  </GameButton>
                </div>
              </Panel>
            </>
          ) : (
            <>
              <div className="flex items-start gap-[0.5rem]">
                {inProgress ? (
                  <GameButton variant="go" icon={Play} className="min-w-0 flex-1 !min-h-[3.75rem] !px-[0.75rem] text-center !text-[1.375rem] !leading-[1.05]" onClick={() => go('level')}>
                    Continue — Level {levelIndex + 1}
                  </GameButton>
                ) : (
                  <GameButton variant="go" icon={Play} className="min-w-0 flex-1 !min-h-[3.75rem] !px-[0.75rem] !text-[2rem]" onClick={() => startMission()}>
                    PLAY
                  </GameButton>
                )}
                <StarCounter n={game.stars} />
              </div>
              <div className="flex flex-wrap gap-x-[0.5rem] gap-y-[0.125rem]">
                <GameButton variant="small" icon={MapIcon} className={SMALL} onClick={() => go('map')}>
                  {inProgress ? `Level ${levelIndex + 1} of ${LEVELS.length} — see the map` : 'See the mission map'}
                </GameButton>
                {inProgress ? (
                  <GameButton variant="small" icon={RotateCcw} className={SMALL} onClick={() => setConfirming(true)}>
                    Start over
                  </GameButton>
                ) : null}
                <GameButton variant="small" icon={flyOpen ? Rocket : Lock} className={SMALL} disabled={!flyOpen} onClick={() => go('fly')}>
                  Fly
                  {flyOpen ? null : <span className="sr-only"> (locked)</span>}
                </GameButton>
              </div>
            </>
          )}

          <div className="min-h-0 flex-1" />

          {kpNow ? (
            <IntelCard
              compact
              title="Space weather"
              badge={kpNow.badge}
              date={fmtDate(kpNow.fetchedAt)}
              figure={<KpGauge kp={Math.round(kpNow.data * 10) / 10} />}
              sentence="Solar storms blast radiation. Crews shelter behind water."
              source={`NOAA SWPC · ${kpNow.badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'} · ${fmtDate(kpNow.fetchedAt)}`}
            />
          ) : (
            <IntelCard compact loading title="Space weather" badge="NASA ARCHIVE" sentence="" />
          )}
        </div>
      </div>
    </Scene>
  );
}
