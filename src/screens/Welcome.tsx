import { useEffect, useState } from 'react';
import { BookOpen, Play, Sparkles, X, Orbit as OrbitIcon } from 'lucide-react';
import { t, useI18n } from '../content/i18n';

interface WelcomeProps {
  onStart: () => void;
}

const PRELOAD_ASSETS = [
  '/art/welcome-1.webp',
  '/art/welcome-2.webp',
  '/art/orbit-stand.webp',
  '/art/nova-stand.webp',
  '/art/twinkle-happy.webp',
];

export function Welcome({ onStart }: WelcomeProps) {
  const { lang, setLang } = useI18n();
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Smooth loading progression tied to preloading assets
  useEffect(() => {
    let current = 0;
    const startTime = Date.now();
    const duration = 2400; // 2.4s cinematic transformation

    // Preload image assets in background
    PRELOAD_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const target = Math.min(100, Math.floor((elapsed / duration) * 100));

      if (target >= 100) {
        setProgress(100);
        setReady(true);
        clearInterval(timer);
      } else {
        current = target;
        setProgress(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  const handlePlay = () => {
    // Attempt fullscreen if supported
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Ignore fullscreen refusals silently
    }
    onStart();
  };

  // Crossfade opacity: 0 -> 1 as progress moves from 15% to 90%
  const crossfade = Math.min(1, Math.max(0, (progress - 15) / 75));

  // Mission-prep lines only. A line naming NASA data waits for D1, when that data really loads.
  // No new Bangla yet (R2): Bangla keeps the one existing loading line.
  const loadingText =
    progress >= 98
      ? t('welcome.ready')
      : lang === 'bn' || progress < 30
        ? t('welcome.loading')
        : progress < 65
          ? 'Preparing life support…'
          : 'Waking up Twinkle…';

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-[#070b1e] text-[#f4f7ff] select-none flex flex-col justify-between">
      {/* Background Deep Space Base */}
      <div className="absolute inset-0 bg-[#070b1e] pointer-events-none" />

      {/* Layer 1: Realistic Astronaut Kids (Interface 1) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-out overflow-hidden"
        style={{ opacity: 1 - crossfade }}
      >
        <img
          src="/art/welcome-1.webp"
          alt="Real-world Junior Astronauts looking at space"
          className="h-full w-full object-cover object-[center_20%] md:object-[72%_center]"
        />
        {/* Seamless backdrop gradients: smooth bottom fade on mobile, soft left fade on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b1e] via-[#070b1e]/85 via-45% to-transparent md:bg-gradient-to-r md:from-[#070b1e] md:via-[#070b1e]/75 md:via-35% md:to-transparent md:to-80%" />
      </div>

      {/* Layer 2: 3D Animated Game Crew (Interface 2 - Orbit, Nova & Twinkle) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ease-out overflow-hidden"
        style={{ opacity: crossfade }}
      >
        <img
          src="/art/welcome-2.webp"
          alt="3D Animated CrewReady Astronauts"
          className="h-full w-full object-cover object-[center_20%] md:object-[72%_center]"
        />
        {/* Seamless backdrop gradients: smooth bottom fade on mobile, soft left fade on desktop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b1e] via-[#070b1e]/85 via-45% to-transparent md:bg-gradient-to-r md:from-[#070b1e] md:via-[#070b1e]/75 md:via-35% md:to-transparent md:to-80%" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-12 sm:pt-8">
        {/* Brand Logo with Planet Ring */}
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-full bg-cyan-500/20 text-[#22d7e6] border border-cyan-400/40">
            <OrbitIcon size={24} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-extrabold tracking-tight leading-none text-white">
              {t('app.name')}
            </span>
            <span className="font-display text-[11px] font-bold tracking-[0.22em] text-cyan-300/80 uppercase">
              {t('app.tagline')}
            </span>
          </div>
        </div>

        {/* Language Switcher Pill [ EN | বাংলা ] */}
        <div className="flex items-center rounded-full border border-white/20 bg-[#0e1638]/80 p-1">
          <button
            onClick={() => setLang('en')}
            className={`rounded-full px-3.5 py-1 text-sm font-extrabold transition-all ${
              lang === 'en'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('bn')}
            className={`rounded-full px-3.5 py-1 text-sm font-extrabold transition-all ${
              lang === 'bn'
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            বাংলা
          </button>
        </div>
      </header>

      {/* Main Hero Stage */}
      <main className="relative z-20 flex-1 flex flex-col justify-end md:justify-center items-center md:items-start px-6 sm:px-12 pb-8 md:pb-0">
        <div className="w-full max-w-sm md:max-w-xl flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:space-y-6">
          <div className="space-y-1.5 md:space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
              {t('app.name')}
            </h1>
            <p className="font-display text-base sm:text-lg md:text-2xl font-semibold text-cyan-100/90 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              {t('app.subtitle')}
            </p>
          </div>

          {/* Action Controls Area */}
          <div className="w-full max-w-xs sm:max-w-sm space-y-3.5 pt-2">
            {ready ? (
              /* Glowing Cyan Play Button */
              <button
                onClick={handlePlay}
                className="anim-pop group relative flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#00b4d8] via-[#22d7e6] to-[#48cae4] px-8 py-3.5 md:py-4 font-display text-xl md:text-2xl font-extrabold text-[#06202b] shadow-[0_0_1.25rem_rgba(34,215,230,0.45),0_4px_0_#0f8f9c] active:translate-y-1 active:shadow-[0_0_1.25rem_rgba(34,215,230,0.45),0_1px_0_#0f8f9c] transition-all cursor-pointer"
              >
                <Play size={24} strokeWidth={2.75} fill="#06202b" className="transition-transform group-hover:scale-110" />
                <span>{t('welcome.play')}</span>
              </button>
            ) : (
              /* Futuristic Progress Loading Bar */
              <div className="flex flex-col gap-2">
                <div className="relative h-13 md:h-14 w-full rounded-full border-2 border-cyan-400/40 bg-[#0a1130]/85 p-1.5 overflow-hidden flex items-center">
                  {/* Glowing cyan fill progress */}
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-[#22d7e6] transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Text centered inside the bar */}
                  <div className="absolute inset-0 flex items-center justify-between px-5 font-display text-sm font-extrabold text-white drop-shadow">
                    <span className="flex items-center gap-2 truncate">
                      <Sparkles size={16} className="text-cyan-300 shrink-0" />
                      <span className="truncate">{loadingText}</span>
                    </span>
                    <span className="tabular-nums font-bold text-cyan-200 ml-2">{progress}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Frosted Glass How to Play Button */}
            <button
              onClick={() => setShowHowToPlay(true)}
              className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-white/30 bg-[#14204d]/70 px-6 py-2.5 md:py-3 font-display text-base md:text-lg font-bold text-white hover:bg-[#14204d]/85 hover:border-white/50 active:scale-98 transition-all cursor-pointer"
            >
              <BookOpen size={19} strokeWidth={2.2} className="text-cyan-300" />
              <span>{t('welcome.howToPlay')}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info Strip */}
      <footer className="relative z-20 px-6 pb-5 sm:px-12 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-white/50">
        <span>NASA Space Apps Challenge 2026 · Junior Astronaut Mission Trainer</span>
        <span>Powered by Real NASA DONKI, NeoWs & OSDR Data</span>
      </footer>

      {/* How to Play Modal */}
      {showHowToPlay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative w-full max-w-lg rounded-3xl border-2 border-white/20 bg-[#0d163d]/95 p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen size={24} className="text-cyan-400" />
                <h2 className="font-display text-2xl font-extrabold">{t('howToPlay.title')}</h2>
              </div>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 font-sans text-base">
              <div className="flex items-start gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-500 font-display font-extrabold text-black">
                  1
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-cyan-200">{t('howToPlay.step1.title')}</h3>
                  <p className="text-sm text-white/80">{t('howToPlay.step1.desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-500 font-display font-extrabold text-black">
                  2
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-cyan-200">{t('howToPlay.step2.title')}</h3>
                  <p className="text-sm text-white/80">{t('howToPlay.step2.desc')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl bg-white/5 p-3.5 border border-white/10">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-cyan-500 font-display font-extrabold text-black">
                  3
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-cyan-200">{t('howToPlay.step3.title')}</h3>
                  <p className="text-sm text-white/80">{t('howToPlay.step3.desc')}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full rounded-full bg-gradient-to-r from-cyan-600 to-cyan-500 py-3 font-display text-lg font-bold text-white hover:brightness-110 active:scale-98 transition-all"
            >
              {t('howToPlay.close')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
