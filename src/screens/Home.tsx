// Home (BUILD_SEQUENCE.md A3, restyled in G2, re-laid for the landscape stage in R4).
// A child must know what to press without reading: the crew on the launch pad on the left,
// one huge cyan button on the right, the space-weather card under it, and the Dock rail.
import { useState } from 'react';
import { Lock, Map as MapIcon, Play, RotateCcw, Rocket, Sparkles } from 'lucide-react';
import { Dock } from '../components/Dock';
import { GameButton } from '../components/GameButton';
import { StarCounter } from '../components/Hud';
import { IntelCard, Panel, Ribbon } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { BUILT_SCREENS, missionInProgress, useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';
import { MusicToggle } from '../components/MusicToggle';
import { TwinkleTourGuide } from '../components/TwinkleTourGuide';
import { t, useI18n } from '../content/i18n';

/** Bands follow docs/06 §4 (Kp 0–3 slow, 4–6 medium, 7–9 fast). No NOAA G-scale: it isn't sourced in docs/06. */
function getStormTier(kp: number, isBn: boolean): { scale: string; label: string; tone: 'calm' | 'active' | 'storm' | 'extreme'; barColor: string } {
  if (kp >= 7) return {
    scale: isBn ? 'তীব্র সৌরঝড়' : 'Stormy Sun',
    label: isBn ? 'মারাত্মক ঝড়' : 'Big storm',
    tone: 'extreme',
    barColor: 'bg-danger'
  };
  if (kp >= 4) return {
    scale: isBn ? 'উত্তাল সূর্য' : 'Busy Sun',
    label: isBn ? 'কিছু ঝড়' : 'Some storms',
    tone: 'active',
    barColor: 'bg-[#e85d04]'
  };
  return {
    scale: isBn ? 'শান্ত সূর্য' : 'Calm Sun',
    label: isBn ? 'স্বাভাবিক' : 'Quiet',
    tone: 'calm',
    barColor: 'bg-good'
  };
}

/**
 * Sun storm level as nine graduated blocks, sized for the Intel card's small figure box (about 7 rem):
 * the blocks, "Kp 9 of 9 max", then the tier name and label. Colour is never alone: the words say it too.
 */
function KpGauge({ kp }: { kp: number }) {
  const lang = useI18n((s) => s.lang);
  const tier = getStormTier(kp, lang === 'bn');
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
        <span className="font-display text-[0.75rem] leading-none font-bold text-muted">
          {lang === 'bn' ? 'সর্বোচ্চ ৯' : 'of 9 max'}
        </span>
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

/** Responsive small action buttons */
const SMALL = '!min-h-[2.5rem] sm:!min-h-[2.75rem] !px-2.5 sm:!px-3.5 !text-xs sm:!text-sm leading-snug break-words';

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const lang = useI18n((s) => s.lang);
  const inProgress = useGame(missionInProgress);
  const kpNow = useSpace((s) => s.kp);
  const [confirming, setConfirming] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const flyOpen = BUILT_SCREENS.has('fly');

  return (
    <Scene bare place="earth" rail={<Dock />}>
      <div className="flex min-h-0 flex-1 gap-[0.75rem] px-[0.75rem] pt-[0.5rem] pb-[0.5rem]">
        {/* Left: title, Twinkle, and the crew on the launch pad. */}
        <div className="flex min-h-0 w-[38%] shrink-0 flex-col gap-[0.25rem]">
          <header className="text-text">
            <h1 className="font-display text-[1.75rem] leading-none font-extrabold">{t('app.name')}</h1>
            <p className="font-display text-[0.9375rem] sm:text-[1rem] leading-snug font-bold">{t('home.subtitle')}</p>
          </header>

          <div
            onClick={() => setShowTour(true)}
            className="cursor-pointer transition hover:opacity-90"
            title="Tap to open Twinkle's Tour Guide"
          >
            <TwinkleSays size={44}>{inProgress ? t('home.welcomeBack') : t('home.ready')}</TwinkleSays>
          </div>

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
                <Ribbon tone="danger">{lang === 'bn' ? 'নতুন করে শুরু?' : 'Start over?'}</Ribbon>
                <div className="flex items-center gap-2">
                  <StarCounter n={game.stars} />
                  <MusicToggle compact />
                </div>
              </div>
              <Panel compact>
                <p role="alert" className="font-display text-[0.9375rem] sm:text-[1rem] leading-snug font-bold">
                  {t('home.startOverPrompt')}
                </p>
                <div className="mt-[0.5rem] flex flex-wrap gap-x-[0.5rem] gap-y-[0.25rem]">
                  <GameButton
                    variant="go"
                    onClick={() => setConfirming(false)}
                    className="!min-h-[2.5rem] sm:!min-h-[2.75rem] !px-3 sm:!px-4 !text-xs sm:!text-sm"
                  >
                    {t('home.keepMission')}
                  </GameButton>
                  <GameButton
                    variant="plain"
                    className="!min-h-[2.5rem] sm:!min-h-[2.75rem] !px-3 sm:!px-4 !text-xs sm:!text-sm"
                    onClick={() => {
                      setConfirming(false);
                      startMission();
                    }}
                  >
                    {t('home.confirmReset')}
                  </GameButton>
                </div>
              </Panel>
            </>
          ) : (
            <>
              <div className="flex items-start gap-[0.5rem]">
                {inProgress ? (
                  <GameButton
                    variant="go"
                    icon={Play}
                    className="min-w-0 flex-1 !min-h-[3.5rem] sm:!min-h-[3.75rem] !px-3 text-center !text-base sm:!text-xl !leading-snug"
                    onClick={() => go('level')}
                  >
                    {`${t('home.continue')} ${levelIndex + 1}`}
                  </GameButton>
                ) : (
                  <GameButton
                    variant="go"
                    icon={Play}
                    className="min-w-0 flex-1 !min-h-[3.5rem] sm:!min-h-[3.75rem] !px-4 !text-xl sm:!text-2xl"
                    onClick={() => startMission()}
                  >
                    {t('home.play')}
                  </GameButton>
                )}
                <StarCounter n={game.stars} />
                <MusicToggle compact />
              </div>
              <div className="flex flex-wrap gap-x-[0.375rem] gap-y-[0.25rem]">
                <GameButton variant="small" icon={MapIcon} className={SMALL} onClick={() => go('map')}>
                  {inProgress
                    ? `${t('home.mapLevel')} ${levelIndex + 1} / ${LEVELS.length} — ${t('home.seeMap')}`
                    : t('home.seeMap')}
                </GameButton>
                {inProgress ? (
                  <GameButton variant="small" icon={RotateCcw} className={SMALL} onClick={() => setConfirming(true)}>
                    {t('btn.startOver')}
                  </GameButton>
                ) : null}
                <GameButton variant="small" icon={flyOpen ? Rocket : Lock} className={SMALL} disabled={!flyOpen} onClick={() => go('fly')}>
                  {t('nav.fly')}
                  {flyOpen ? null : <span className="sr-only"> (locked)</span>}
                </GameButton>
                <GameButton variant="small" icon={Sparkles} className={SMALL} onClick={() => setShowTour(true)}>
                  {t('welcome.tour')}
                </GameButton>
              </div>
            </>
          )}

          <div className="min-h-0 flex-1" />

          {kpNow ? (
            <IntelCard
              compact
              title={t('home.weatherTitle')}
              badge={kpNow.badge}
              date={fmtDate(kpNow.fetchedAt)}
              figure={<KpGauge kp={Math.round(kpNow.data * 10) / 10} />}
              sentence={t('home.weatherFact')}
              source={`NOAA SWPC · ${kpNow.badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'} · ${fmtDate(kpNow.fetchedAt)}`}
            />
          ) : (
            <IntelCard compact loading title={t('home.weatherTitle')} badge="NASA ARCHIVE" sentence="" />
          )}
        </div>
      </div>

      {showTour && <TwinkleTourGuide onClose={() => setShowTour(false)} />}
    </Scene>
  );
}
