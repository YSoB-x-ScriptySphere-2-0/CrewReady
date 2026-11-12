// Home (BUILD_SEQUENCE.md A3). A child must know what to press without reading:
// one big button, the crew, and nothing else competing for attention.
import { useState } from 'react';
import { Lock, Rocket } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Kid, TwinkleSays } from '../components/Twinkle';
import { Badge, MissionCard, PrimaryButton, QuietButton, Sky, Stars } from '../components/ui';
import { LEVELS } from '../content/levels';
import { BUILT_SCREENS, missionInProgress, useGame } from '../store/game';

/** Sample until B4 wires live data. Confirmed in DONKI: Kp reached 9.0 on 11 May 2024 (docs/06 §4). */
const SPACE_WEATHER_SAMPLE = { kp: 9, date: '11 May 2024' };

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const inProgress = useGame(missionInProgress);
  const [confirming, setConfirming] = useState(false);
  const quickRunOpen = BUILT_SCREENS.has('quickrun');

  return (
    <Sky place="earth" nav={<BottomNav />}>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl leading-tight font-extrabold">CrewReady</h1>
          <p className="text-lg font-bold">Command a Mars mission.</p>
        </div>
        <span className="rounded-btn bg-paper px-3 py-1 text-ink">
          <Stars n={game.stars} />
        </span>
      </header>

      <TwinkleSays>{inProgress ? 'Welcome back, Commander!' : 'Ready when you are, Commander.'}</TwinkleSays>

      <div className="relative z-10 -mb-8 flex items-end justify-center gap-6 sm:gap-12" aria-hidden>
        <Kid who="nova" pose="wave" height={170} className="sm:!h-[230px]" />
        <Kid who="orbit" pose="wave" height={170} className="sm:!h-[230px]" />
      </div>

      <MissionCard className="pt-10 sm:pt-12">
        {confirming ? (
          <div role="alert" className="rounded-btn border-2 border-danger bg-white p-4">
            <p className="font-bold">Start over? Your mission so far will be lost.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <QuietButton
                onClick={() => {
                  setConfirming(false);
                  startMission();
                }}
              >
                Yes, start over
              </QuietButton>
              <PrimaryButton onClick={() => setConfirming(false)}>Keep my mission</PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {inProgress ? (
              <>
                <PrimaryButton onClick={() => go('level')} className="!text-xl">
                  Continue — Level {levelIndex + 1}
                </PrimaryButton>
                <QuietButton onClick={() => setConfirming(true)}>Start over</QuietButton>
              </>
            ) : (
              <PrimaryButton onClick={() => startMission()} className="!px-10 !text-xl">
                Start mission
              </PrimaryButton>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <QuietButton onClick={() => go('quickrun')} disabled={!quickRunOpen}>
            {quickRunOpen ? <Rocket size={18} strokeWidth={2} aria-hidden /> : <Lock size={18} strokeWidth={2} aria-hidden />}
            Quick Run — 60 seconds
            {quickRunOpen ? null : <span className="sr-only">(locked)</span>}
          </QuietButton>
          <button onClick={() => go('map')} className="min-h-11 font-display font-bold underline underline-offset-4">
            {inProgress ? `Level ${levelIndex + 1} of ${LEVELS.length} — see the map` : 'See the mission map'}
          </button>
        </div>
      </MissionCard>

      <MissionCard as="div" className="!p-3 sm:!p-4">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-display font-bold">Sun storm level</span>
          <span className="font-display text-xl font-extrabold tabular-nums">
            {SPACE_WEATHER_SAMPLE.kp} of 9
          </span>
          <Badge kind="NASA ARCHIVE" />
          <span className="text-sm text-muted">{SPACE_WEATHER_SAMPLE.date} · NASA DONKI</span>
        </p>
      </MissionCard>
    </Sky>
  );
}
