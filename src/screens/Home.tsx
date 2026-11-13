import { useState } from 'react';
import { Map as MapIcon, Play, RotateCcw, Rocket, Sparkles, Volume2, Square, Bot, HelpCircle } from 'lucide-react';
import { Dock } from '../components/Dock';
import { StarCounter, StardustCounter } from '../components/Hud';
import { MusicToggle } from '../components/MusicToggle';
import { Scene } from '../components/Scene';
import { Words } from '../components/Words';
import { TwinkleTourGuide } from '../components/TwinkleTourGuide';
import { TwinkleChatTeaser } from '../components/TwinkleChatTeaser';
import { ExplainCard } from '../components/ExplainCard';
import { EXPLAIN_ENTRIES } from '../content/explain';
import { LEVELS } from '../content/levels';
import { missionInProgress, useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';
import { t, useI18n } from '../content/i18n';
import { speak, stopSpeaking, useCanSpeak } from '../components/speech';

/** NOAA SWPC storm tiers */
function getStormTier(kp: number, isBn: boolean): { scale: string; label: string; tone: 'calm' | 'active' | 'storm' | 'extreme'; barColor: string; dotColor: string } {
  if (kp >= 7) {
    return {
      scale: isBn ? 'তীব্র সৌরঝড়' : 'STORMY SUN',
      label: isBn ? 'মারাত্মক ঝড়' : 'Big Storm',
      tone: 'extreme',
      barColor: 'bg-danger',
      dotColor: 'bg-danger shadow-[0_0_8px_#d93a3a]',
    };
  }
  if (kp >= 4) {
    return {
      scale: isBn ? 'উত্তাল সূর্য' : 'BUSY SUN',
      label: isBn ? 'কিছু ঝড়' : 'Some Storms',
      tone: 'active',
      barColor: 'bg-amber-500',
      dotColor: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    };
  }
  return {
    scale: isBn ? 'শান্ত সূর্য' : 'CALM SUN',
    label: isBn ? 'স্বাভাবিক' : 'Quiet',
    tone: 'calm',
    barColor: 'bg-emerald-400',
    dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
  };
}

/** Tilted Orbit Logo matching Screenshots 1 & 3 */
export function CrewReadyLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0 drop-shadow-[0_0_10px_rgba(34,215,230,0.6)]">
        <defs>
          <radialGradient id="crPlanetGlow" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#22D7E6" />
            <stop offset="55%" stopColor="#0F8F9C" />
            <stop offset="100%" stopColor="#08303B" />
          </radialGradient>
        </defs>
        {/* Ring behind */}
        <ellipse cx="18" cy="18" rx="14.5" ry="4.5" stroke="#22D7E6" strokeWidth="2.4" transform="rotate(-24 18 18)" strokeDasharray="32 12" />
        {/* Planet Sphere */}
        <circle cx="18" cy="18" r="8" fill="url(#crPlanetGlow)" stroke="#22D7E6" strokeWidth="1.5" />
        {/* Ring in front */}
        <path d="M 5.5 22.5 C 9.5 26.5, 26.5 22.5, 30.5 13.5" stroke="#22D7E6" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-xl sm:text-2xl font-black italic tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          CrewReady
        </span>
        <span className="text-[0.5625rem] sm:text-[0.625rem] font-extrabold tracking-[0.26em] text-[#A5E3F6] uppercase mt-0.5">
          BEYOND US
        </span>
      </div>
    </div>
  );
}

/** Live Space Weather Floating Card matching Screenshots 1 & 3 */
function SpaceWeatherCard({ kp, badge, fetchedAt }: { kp: number; badge: 'NASA LIVE' | 'NASA ARCHIVE'; fetchedAt: string }) {
  const lang = useI18n((s) => s.lang);
  const tier = getStormTier(kp, lang === 'bn');
  const dateStr = fmtDate(fetchedAt);

  return (
    <div className="relative rounded-2xl border border-cyan-400/40 bg-[#081230]/85 p-3.5 sm:p-4 shadow-[0_8px_32px_rgba(0,0,0,0.65),0_0_16px_rgba(34,215,230,0.15)] backdrop-blur-xl">
      {/* Sitting on top border header pill */}
      <div className="absolute -top-3 left-4 inline-flex items-center rounded-full border border-cyan-400/70 bg-[#081230] px-3 py-0.5 shadow-sm">
        <span className="font-display text-[0.625rem] sm:text-[0.6875rem] font-black tracking-wider text-white uppercase">
          LIVE SPACE WEATHER
        </span>
      </div>

      <div className="mt-1 flex items-stretch gap-3 sm:gap-4">
        {/* Left Sub-Card: Kp Signal Meter */}
        <div className="w-[7rem] sm:w-[7.5rem] shrink-0 rounded-xl border border-white/10 bg-[#050C22]/90 p-2.5 flex flex-col items-center justify-center text-center">
          {/* Signal Level Bars */}
          <div className="flex items-end gap-1 mb-1.5" aria-hidden>
            {Array.from({ length: 9 }, (_, i) => {
              const active = i < Math.max(1, Math.round(kp));
              return (
                <span
                  key={i}
                  className={`w-1 rounded-sm border transition-all ${
                    active
                      ? `${tier.barColor} border-white/40 shadow-[0_0_4px_rgba(34,215,230,0.4)]`
                      : 'bg-white/10 border-white/10'
                  }`}
                  style={{ height: `${0.5 + i * 0.08}rem` }}
                />
              );
            })}
          </div>

          <div className="flex items-baseline justify-center gap-1 leading-none">
            <span className="font-display text-base sm:text-lg font-black text-white">
              Kp {kp.toFixed(1)}
            </span>
          </div>
          <span className="text-[0.5625rem] sm:text-[0.625rem] font-bold text-muted/70 leading-tight">
            {lang === 'bn' ? 'সর্বোচ্চ ৯' : 'of 9 max'}
          </span>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${tier.dotColor}`} />
            <span className="font-display text-[0.5625rem] sm:text-[0.625rem] font-black uppercase text-white leading-tight">
              {tier.scale}
            </span>
          </div>
          <span className="text-[0.5rem] sm:text-[0.5625rem] font-semibold text-muted leading-tight">
            {tier.label}
          </span>
        </div>

        {/* Right Content Area */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-0.5 text-[0.625rem] sm:text-[0.6875rem] font-extrabold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                {badge}
              </span>
              <span className="text-[0.6875rem] sm:text-xs font-semibold text-muted/80">{dateStr}</span>
            </div>

            <p className="mt-2 text-xs sm:text-[0.8125rem] leading-snug text-white/95 font-medium">
              <Words text={t('home.weatherFact')} />
            </p>
          </div>

          <div className="mt-2.5 text-[0.5625rem] sm:text-[0.625rem] text-muted/70 flex flex-wrap items-center gap-1 font-sans">
            <span>Source: NOAA SWPC</span>
            <span>•</span>
            <span>{badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'}</span>
            <span>•</span>
            <span>{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const TOUR_SEEN_KEY = 'crewready_tour_seen';

export function Home() {
  const { startMission, levelIndex, go, game } = useGame();
  const lang = useI18n((s) => s.lang);
  const inProgress = useGame(missionInProgress);
  const kpNow = useSpace((s) => s.kp);
  const [confirming, setConfirming] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [explainIndex, setExplainIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const canSpeak = useCanSpeak();

  const closeTour = () => {
    setShowTour(false);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(TOUR_SEEN_KEY, 'true');
    }
  };

  const welcomeText = inProgress ? t('home.welcomeBack') : t('home.ready');

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      setSpeaking(true);
      speak(welcomeText, lang, () => setSpeaking(false));
    }
  };

  return (
    <Scene bare place="space" rail={<Dock />}>
      {/* Background Image: Kids in Observatory overlooking Earth (Screenshot 2 / public/art/home-bg.jpg) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src="/art/home-bg.jpg"
          alt=""
          className="h-full w-full object-cover object-[center_30%] md:object-[35%_center]"
        />
        {/* Dark overlay for crystal clear text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B1E]/75 via-transparent to-[#070B1E]/95 md:from-[#070B1E]/50 md:via-[#070B1E]/30 md:to-[#070B1E]/90" />
      </div>

      {/* Main Responsive Container */}
      <div className="relative z-10 flex min-h-full flex-1 flex-col justify-between p-3 sm:p-5 md:p-6 pb-24 md:pb-6 overflow-y-auto">
        {/* ================= MOBILE VIEW (< md) ================= */}
        <div className="md:hidden flex flex-col gap-3 min-h-0">
          {/* Mobile Top Header: Logo + Stars + Stardust + Sound */}
          <div className="flex items-center justify-between">
            <CrewReadyLogo />
            <div className="flex items-center gap-1.5">
              <StarCounter n={game.stars} />
              <StardustCounter />
              <MusicToggle compact />
            </div>
          </div>

          {/* Twinkle Speech Bubble */}
          <div className="flex items-center gap-2.5 mt-1">
            <div
              onClick={() => setShowTour(true)}
              className="relative shrink-0 cursor-pointer active:scale-95 transition"
              title="Open Twinkle's Tour Guide"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md" />
              <img
                src="/art/twinkle-happy.webp"
                alt="Twinkle"
                className="relative h-11 w-11 object-contain drop-shadow-[0_0_8px_rgba(34,215,230,0.6)]"
              />
            </div>

            <div className="relative flex min-w-0 flex-1 items-center justify-between rounded-2xl border border-cyan-400/35 bg-[#091332]/85 px-3.5 py-2 text-white shadow-lg backdrop-blur-xl">
              <span className="font-display text-sm font-extrabold text-white leading-tight">
                {welcomeText}
              </span>
              {canSpeak && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  aria-label={speaking ? 'Stop reading' : 'Read aloud'}
                  className="ml-2 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-90 transition cursor-pointer"
                >
                  {speaking ? <Square size={12} strokeWidth={2.5} /> : <Volume2 size={15} strokeWidth={2.2} />}
                </button>
              )}
            </div>
          </div>

          {/* Flexible Middle Spacer showing kids in observatory */}
          <div className="min-h-[2rem] sm:min-h-[4rem] flex-1" />

          {/* Action Buttons Section */}
          <div className="flex flex-col gap-2.5">
            {/* 1. Big Cyan Primary Button: Continue / Play */}
            <button
              onClick={() => (inProgress ? go('level') : startMission())}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-6 rounded-full bg-gradient-to-r from-[#22D7E6] to-[#0F8F9C] text-[#06202B] font-display text-lg font-black shadow-[0_0_24px_rgba(34,215,230,0.55),0_3px_0_#0A5B64] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              <Play size={20} className="fill-current text-[#06202B]" />
              <span>
                {inProgress ? `${t('home.continue')} ${levelIndex + 1}` : `${t('home.play')} — Level 1`}
              </span>
            </button>

            {/* 2. Secondary Row 1: Level Map & Start Over */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => go('map')}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md backdrop-blur-md text-left active:scale-[0.98] transition cursor-pointer"
              >
                <MapIcon size={20} className="text-cyan-400 shrink-0" />
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="font-display text-xs font-black text-white">
                    {t('home.mapLevel')} {levelIndex + 1} / {LEVELS.length}
                  </div>
                  <div className="text-[0.625rem] font-bold text-muted/80 truncate">
                    {t('home.seeMap')}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setConfirming(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
              >
                <RotateCcw size={18} className="text-cyan-400 shrink-0" />
                <span className="font-display text-xs sm:text-sm font-extrabold">{t('btn.startOver')}</span>
              </button>
            </div>

            {/* 3. Secondary Row 2: Twinkle's Tour & Fly */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setShowTour(true)}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
              >
                <Sparkles size={18} className="text-cyan-400 shrink-0" />
                <span className="font-display text-xs sm:text-sm font-extrabold">{t('welcome.tour')}</span>
              </button>

              <button
                onClick={() => go('fly')}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-[#FF2B85] to-[#D91B6B] text-white font-display text-base font-black shadow-[0_0_20px_rgba(255,43,133,0.6),0_3px_0_#9E0D4B] active:translate-y-0.5 active:shadow-none transition cursor-pointer"
              >
                <Rocket size={18} className="text-white shrink-0 fill-white" />
                <span>{t('nav.fly')}</span>
              </button>
            </div>

            {/* Interactive Feature Cards: AI Chat & Explain Cards */}
            <div className="flex flex-col gap-2 mt-0.5">
              <button
                type="button"
                onClick={() => setShowAiChat(true)}
                className="flex items-center justify-between px-3 py-2.5 rounded-2xl border border-cyan-400/40 bg-[#0E1B45]/90 hover:bg-[#142357] text-left shadow-md active:scale-[0.98] transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Bot size={20} className="text-go animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display text-xs font-black text-white">
                        {lang === 'bn' ? 'টুইঙ্কেল এআই চ্যাট' : 'Twinkle AI Chat'}
                      </span>
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.2 text-[9px] font-black text-amber-300 uppercase">
                        {lang === 'bn' ? 'পরবর্তী আপডেটে আসছে' : 'Coming in next update'}
                      </span>
                    </div>
                    <p className="text-[10px] text-cyan-200/80 truncate">
                      {lang === 'bn' ? 'মহাকাশ নিয়ে যা খুশি প্রশ্ন করো, মেটাও তোমার কৌতূহল' : 'Ask anything about space, meet your curiosity'}
                    </p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExplainIndex((prev) => (prev + 1) % EXPLAIN_ENTRIES.length);
                  setShowExplain(true);
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-2xl border border-amber-400/40 bg-[#0E1B45]/90 hover:bg-[#142357] text-amber-300 shadow-md active:scale-95 transition cursor-pointer"
              >
                <HelpCircle size={16} className="text-amber-400" />
                <span className="font-display text-xs font-black truncate">{lang === 'bn' ? 'মহাকাশ জ্ঞান (?)' : 'Space Facts (?)'}</span>
              </button>
            </div>

            {/* 4. Live Space Weather Card */}
            <div className="mt-1">
              {kpNow ? (
                <SpaceWeatherCard
                  kp={kpNow.data}
                  badge={kpNow.badge}
                  fetchedAt={kpNow.fetchedAt}
                />
              ) : (
                <div className="rounded-2xl border border-cyan-400/30 bg-[#081230]/80 p-4 text-center text-xs text-muted">
                  Checking NASA space weather…
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= DESKTOP VIEW (>= md) (Screenshot 3) ================= */}
        <div className="hidden md:flex flex-1 flex-col justify-between">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            {/* Top-Left: CrewReady Logo + Twinkle Bubble */}
            <div className="flex flex-col gap-3 max-w-md">
              <CrewReadyLogo />

              {/* Twinkle Speech Bubble */}
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setShowTour(true)}
                  className="relative shrink-0 cursor-pointer hover:scale-105 transition"
                  title="Open Twinkle's Tour Guide"
                >
                  <div className="absolute inset-0 rounded-full bg-cyan-400/40 blur-md" />
                  <img
                    src="/art/twinkle-happy.webp"
                    alt="Twinkle"
                    className="relative h-12 w-12 object-contain drop-shadow-[0_0_10px_rgba(34,215,230,0.6)]"
                  />
                </div>

                <div className="relative flex items-center gap-3 rounded-2xl border border-cyan-400/35 bg-[#091332]/85 px-4 py-2.5 text-white shadow-lg backdrop-blur-xl">
                  <span className="font-display text-base font-extrabold text-white leading-snug">
                    {welcomeText}
                  </span>
                  {canSpeak && (
                    <button
                      type="button"
                      onClick={handleSpeak}
                      aria-label={speaking ? 'Stop reading' : 'Read aloud'}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-90 transition cursor-pointer"
                    >
                      {speaking ? <Square size={13} strokeWidth={2.5} /> : <Volume2 size={16} strokeWidth={2.2} />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Top-Right: Actions Panel (Continue, Map, Start Over, Fly, Tour) */}
            <div className="flex flex-col items-end gap-3 max-w-lg">
              {/* Star Counter + Stardust Counter + Sound Toggle */}
              <div className="flex items-center gap-2">
                <StarCounter n={game.stars} />
                <StardustCounter />
                <MusicToggle compact />
              </div>

              {/* Big Cyan Continue Button */}
              <button
                onClick={() => (inProgress ? go('level') : startMission())}
                className="w-full flex items-center justify-center gap-2.5 py-3 px-8 rounded-full bg-gradient-to-r from-[#22D7E6] to-[#0F8F9C] text-[#06202B] font-display text-xl font-black shadow-[0_0_24px_rgba(34,215,230,0.55),0_3px_0_#0A5B64] hover:brightness-105 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <Play size={22} className="fill-current text-[#06202B]" />
                <span>
                  {inProgress ? `${t('home.continue')} ${levelIndex + 1}` : `${t('home.play')} — Level 1`}
                </span>
              </button>

              {/* Row 1: Level 1/6 See Mission Map, Start Over, Fly */}
              <div className="flex items-center gap-2.5 w-full">
                <button
                  onClick={() => go('map')}
                  className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
                >
                  <MapIcon size={18} className="text-cyan-400 shrink-0" />
                  <span className="font-display text-xs sm:text-sm font-extrabold whitespace-nowrap">
                    {t('home.mapLevel')} {levelIndex + 1} / {LEVELS.length} — {t('home.seeMap')}
                  </span>
                </button>

                <button
                  onClick={() => setConfirming(true)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md backdrop-blur-md active:scale-[0.98] transition cursor-pointer"
                >
                  <RotateCcw size={16} className="text-cyan-400 shrink-0" />
                  <span className="font-display text-xs sm:text-sm font-extrabold whitespace-nowrap">
                    {t('btn.startOver')}
                  </span>
                </button>

                <button
                  onClick={() => go('fly')}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FF2B85] to-[#D91B6B] text-white font-display text-base font-black shadow-[0_0_20px_rgba(255,43,133,0.6),0_3px_0_#9E0D4B] hover:brightness-105 active:translate-y-0.5 active:shadow-none transition cursor-pointer"
                >
                  <Rocket size={18} className="text-white shrink-0 fill-white" />
                  <span>{t('nav.fly')}</span>
                </button>
              </div>

              {/* Row 2: Twinkle's Tour, AI Chat & Explain Cards */}
              <div className="w-full flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowTour(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/20 bg-[#0E1B45]/85 hover:bg-[#142357] text-white shadow-md active:scale-[0.98] transition cursor-pointer"
                >
                  <Sparkles size={16} className="text-cyan-400 shrink-0" />
                  <span className="font-display text-xs sm:text-sm font-extrabold">{t('welcome.tour')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAiChat(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-cyan-400/40 bg-[#0E1B45]/90 hover:bg-[#142357] text-left text-cyan-300 shadow-md active:scale-95 transition cursor-pointer"
                >
                  <Bot size={18} className="text-go animate-pulse shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-display text-xs sm:text-sm font-black text-white">
                        {lang === 'bn' ? 'টুইঙ্কেল এআই চ্যাট' : 'Twinkle AI Chat'}
                      </span>
                      <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-1.5 py-0.2 text-[9px] font-black text-amber-300 uppercase">
                        {lang === 'bn' ? 'পরবর্তী আপডেটে আসছে' : 'Coming in next update'}
                      </span>
                    </div>
                    <p className="text-[10px] text-cyan-200/80 max-w-[240px] truncate">
                      {lang === 'bn' ? 'মহাকাশ নিয়ে যা খুশি প্রশ্ন করো, মেটাও তোমার কৌতূহল' : 'Ask anything about space, meet your curiosity'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setExplainIndex((prev) => (prev + 1) % EXPLAIN_ENTRIES.length);
                    setShowExplain(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-amber-400/40 bg-[#0E1B45]/90 hover:bg-[#142357] text-amber-300 shadow-md active:scale-95 transition cursor-pointer"
                >
                  <HelpCircle size={16} className="text-amber-400" />
                  <span className="font-display text-xs sm:text-sm font-black">{lang === 'bn' ? 'মহাকাশ জ্ঞান (?)' : 'Space Facts (?)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section: Space Weather Card on Bottom-Right */}
          <div className="flex items-end justify-end mt-6">
            <div className="w-full max-w-lg">
              {kpNow ? (
                <SpaceWeatherCard
                  kp={kpNow.data}
                  badge={kpNow.badge}
                  fetchedAt={kpNow.fetchedAt}
                />
              ) : (
                <div className="rounded-2xl border border-cyan-400/30 bg-[#081230]/80 p-4 text-center text-xs text-muted">
                  Checking NASA space weather…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Start Over Confirmation Dialog */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border-2 border-line bg-panel p-5 sm:p-6 text-center text-text shadow-2xl">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger/20 text-danger mb-3">
              <RotateCcw size={24} strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">
              {lang === 'bn' ? 'নতুন করে শুরু?' : 'Start Over?'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed">
              {t('home.startOverPrompt')}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="w-full rounded-xl bg-go py-2.5 font-display text-sm font-extrabold text-go-text shadow-md hover:brightness-105 active:scale-98 transition cursor-pointer"
              >
                {t('home.keepMission')}
              </button>
              <button
                onClick={() => {
                  setConfirming(false);
                  startMission();
                }}
                className="w-full rounded-xl border border-white/20 bg-panel-up py-2 font-display text-xs font-bold text-muted hover:text-white active:scale-98 transition cursor-pointer"
              >
                {t('home.confirmReset')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Twinkle Tour Guide Modal */}
      {showTour && <TwinkleTourGuide onClose={closeTour} />}

      {/* Twinkle Space AI Chat Teaser */}
      {showAiChat && <TwinkleChatTeaser onClose={() => setShowAiChat(false)} />}

      {/* Space Facts Explain Card */}
      {showExplain && (
        <ExplainCard
          entry={EXPLAIN_ENTRIES[explainIndex % EXPLAIN_ENTRIES.length]}
          onClose={() => setShowExplain(false)}
        />
      )}
    </Scene>
  );
}