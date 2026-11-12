// Welcome (BUILD_SEQUENCE.md R2). Shown on every load, inside the landscape Stage:
// title, Play and How to Play on the left; the crew art on the right two-thirds.
// The bar follows real loading (fonts, images decoded, the save read): at least 1.8 s, at most 5 s.
import { useEffect, useState } from 'react';
import { BookOpen, Hand, Orbit as OrbitIcon, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import { t, useI18n } from '../content/i18n';
import { useGame } from '../store/game';
import { useSpace } from '../store/space';
import { MeterBadge } from '../components/meters';
import { reducedMotion } from '../components/motion';

interface WelcomeProps {
  onStart: () => void;
}

const artPath = (name: string) => `${import.meta.env.BASE_URL}art/${name}.webp`;
const WELCOME_ART = [artPath('welcome-1'), artPath('welcome-2')];
// The crew poses the hook and the "Turn your phone" hint show first.
const FIRST_SCENE_ART = [
  artPath('orbit-think'),
  artPath('orbit-surprised'),
  artPath('nova-think'),
  artPath('twinkle-happy'),
  artPath('twinkle-surprised'),
  artPath('twinkle-question'),
];
const MIN_MS = 1000;
const MAX_MS = 4000;

/** Real loading, as a 0–100 number plus a flag. Counts: fonts, save read, NASA data, every image decoded. */
function useRealLoading() {
  const [done, setDone] = useState(0);
  const [now, setNow] = useState(0);
  const total = 3 + WELCOME_ART.length + FIRST_SCENE_ART.length;

  useEffect(() => {
    let alive = true;
    const tick = () => alive && setDone((d) => d + 1);
    const settle = (p: Promise<unknown>) => void p.catch(() => {}).then(tick);

    settle(document.fonts ? Promise.all([document.fonts.load('800 1rem "Baloo Da 2"'), document.fonts.load('700 1rem Nunito'), document.fonts.ready]) : Promise.resolve());
    settle(
      new Promise<void>((resolve) => {
        if (useGame.persist.hasHydrated()) return resolve();
        const off = useGame.persist.onFinishHydration(() => {
          off();
          resolve();
        });
      }),
    );
    settle(useSpace.getState().load());
    [...WELCOME_ART, ...FIRST_SCENE_ART].forEach((src) => {
      const img = new Image();
      img.src = src;
      settle(img.decode());
    });

    const start = performance.now();
    const timer = setInterval(() => setNow(performance.now() - start), 40);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const real = Math.min(1, done / total);
  const paced = Math.min(1, now / MIN_MS);
  const timedOut = now >= MAX_MS;
  const progress = timedOut ? 100 : Math.floor(Math.min(real, paced) * 100);
  return { progress, ready: progress >= 100 };
}

export function Welcome({ onStart }: WelcomeProps) {
  const { lang, setLang } = useI18n();
  const { progress, ready } = useRealLoading();
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const cut = reducedMotion();
  const nasaWeather = useSpace((s) => s.weather);
  const nasaLoading = nasaWeather === null;

  const handlePlay = () => {
    // Full screen and a landscape lock on a real tap. A refusal is ignored silently.
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement
          .requestFullscreen()
          .then(() => (screen.orientation as unknown as { lock?: (o: string) => Promise<void> }).lock?.('landscape'))
          .catch(() => {});
      }
    } catch {
      /* ignore */
    }
    onStart();
  };

  // The real-looking kids turn into the game crew as the bar fills. Reduced motion: one straight cut when ready.
  const crossfade = cut ? (ready ? 1 : 0) : Math.min(1, Math.max(0, (progress - 15) / 75));
  const fade = cut ? '' : 'transition-opacity duration-700 ease-in-out';

  // "Checking today's Sun with NASA..." shows while the real NASA space-weather call runs.
  const loadingText =
    progress >= 98
      ? t('welcome.ready')
      : nasaLoading
        ? t('welcome.loading.nasa')
        : lang === 'bn' || progress < 30
          ? t('welcome.loading')
          : progress < 65
            ? t('welcome.loading.life')
            : t('welcome.loading.twinkle');

  return (
    <div className="relative h-full w-full overflow-hidden bg-space-deep text-text select-none">
      {/* 16:9 Widescreen Welcome Scene with smooth crossfade: right 72% */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[72%]" aria-hidden="true">
        {WELCOME_ART.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover object-right ${fade}`}
            style={{ opacity: i === 0 ? 1 - crossfade : crossfade }}
          />
        ))}
        {/* Soft fade into backdrop on left edge and top */}
        <div className="absolute inset-y-0 left-0 w-[25%] bg-gradient-to-r from-space-deep via-space-deep/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-[15%] bg-gradient-to-b from-space-deep/60 to-transparent" />
      </div>

      {/* Top strip: brand on the left, language switch on the right */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[1.5rem] pt-[0.75rem]">
        <div className="flex items-center gap-[0.5rem]">
          <div className="grid h-[2.5rem] w-[2.5rem] place-items-center rounded-full border border-go/40 bg-go/20 text-go">
            <OrbitIcon size={22} strokeWidth={2.2} />
          </div>
          <span className="font-display text-[0.75rem] font-bold tracking-[0.22em] text-go uppercase">{t('app.tagline')}</span>
        </div>

        <div role="group" aria-label="Language" className="flex items-center rounded-full border border-text/20 bg-panel/80 p-[0.25rem]">
          {(['en', 'bn'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`min-h-[2.75rem] min-w-[2.75rem] cursor-pointer rounded-full px-[0.875rem] font-display text-[0.9375rem] font-extrabold ${
                lang === l ? 'bg-go text-go-text' : 'text-text/70 hover:text-text'
              }`}
            >
              {l === 'en' ? 'EN' : 'বাংলা'}
            </button>
          ))}
        </div>
      </header>

      {/* Left zone: title, Play (or the bar), How to Play */}
      <main className="absolute inset-y-0 left-0 z-10 flex w-[42%] flex-col justify-center gap-[1rem] pt-[2.5rem] pl-[1.5rem]">
        <div>
          <h1 className="font-display text-[3.25rem] leading-none font-extrabold tracking-tight text-text drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">{t('app.name')}</h1>
          <p className="mt-[0.375rem] font-display text-[1.25rem] leading-tight font-semibold text-text/90">{t('app.subtitle')}</p>
        </div>

        <div className="flex w-full max-w-[17rem] flex-col gap-[0.75rem]">
          {ready ? (
            <button
              onClick={handlePlay}
              autoFocus
              className="anim-pop group flex min-h-[3.5rem] w-full cursor-pointer items-center justify-center gap-[0.625rem] rounded-full bg-gradient-to-b from-[#48e3f0] to-go px-[2rem] font-display text-[1.5rem] font-extrabold text-go-text shadow-[0_0_1.25rem_rgba(34,215,230,0.45),0_0.35rem_0_var(--color-go-lip)] active:translate-y-[0.25rem] active:shadow-[0_0_1.25rem_rgba(34,215,230,0.45),0_0.1rem_0_var(--color-go-lip)]"
            >
              <Play size={24} strokeWidth={2.75} fill="currentColor" />
              <span>{t('welcome.play')}</span>
            </button>
          ) : (
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={loadingText}
              className="relative flex h-[3.5rem] w-full items-center overflow-hidden rounded-full border-2 border-go/40 bg-panel/85 p-[0.375rem]"
            >
              <div className="h-full rounded-full bg-gradient-to-r from-[#0f8f9c] to-go" style={{ width: `${progress}%` }} />
              <div className="absolute inset-0 flex items-center justify-between px-[1.125rem] font-display text-[0.875rem] font-extrabold text-text">
                <span className="flex items-center gap-[0.5rem] truncate">
                  <Sparkles size={16} className="shrink-0 text-go" />
                  <span className="truncate">{loadingText}</span>
                </span>
                <span className="ml-[0.5rem] tabular-nums text-go">{progress}%</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex min-h-[2.75rem] w-full cursor-pointer items-center justify-center gap-[0.5rem] rounded-full border-2 border-text/30 bg-panel/70 px-[1.5rem] font-display text-[1.0625rem] font-bold text-text hover:border-text/50 hover:bg-panel/85"
          >
            <BookOpen size={19} strokeWidth={2.2} className="text-go" />
            <span>{t('welcome.howToPlay')}</span>
          </button>
        </div>
      </main>

      <p className="absolute bottom-[0.625rem] left-[1.5rem] z-10 text-[0.75rem] font-semibold text-text/50">{t('welcome.credit')}</p>

      {showHowToPlay ? <HowToPlay onClose={() => setShowHowToPlay(false)} /> : null}
    </div>
  );
}

/** Three picture panels, one line each. */
function HowToPlay({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [onClose]);

  const panels = [
    {
      line: t('howToPlay.p1'),
      art: (
        <div className="flex gap-[0.375rem]">
          {(['P', 'L', 'F', 'S'] as const).map((m) => (
            <MeterBadge key={m} meter={m} size={34} />
          ))}
        </div>
      ),
    },
    {
      line: t('howToPlay.p2'),
      art: (
        <div className="flex items-center gap-[0.5rem]">
          <Hand size={34} className="text-text" />
          <span className="rounded-[0.75rem] bg-go px-[0.75rem] py-[0.25rem] font-display text-[1.25rem] font-extrabold text-go-text shadow-[0_0.2rem_0_var(--color-go-lip)]">GO</span>
        </div>
      ),
    },
    {
      line: t('howToPlay.p3'),
      art: (
        <div className="flex items-center gap-[0.5rem]">
          <span className="grid h-[2.125rem] w-[2.125rem] place-items-center rounded-full bg-[#d93a3a] font-display font-extrabold text-white">0</span>
          <RotateCcw size={30} className="text-go" />
        </div>
      ),
    },
  ];

  return (
    <div role="dialog" aria-modal="true" aria-label={t('howToPlay.title')} className="absolute inset-0 z-50 grid place-items-center bg-space-deep/85 p-[1rem]">
      <div className="relative w-full max-w-[40rem] rounded-[1.5rem] border-2 border-line bg-panel p-[1rem]">
        <div className="mb-[0.75rem] flex items-center justify-between">
          <h2 className="font-display text-[1.5rem] font-extrabold">{t('howToPlay.title')}</h2>
          <button onClick={onClose} aria-label={t('howToPlay.close')} className="grid h-[2.75rem] w-[2.75rem] cursor-pointer place-items-center rounded-full bg-text/10 hover:bg-text/20">
            <X size={20} />
          </button>
        </div>
        <ol className="grid grid-cols-3 gap-[0.75rem]">
          {panels.map((p, i) => (
            <li key={i} className="flex flex-col items-center gap-[0.75rem] rounded-[1rem] border-2 border-line bg-panel-up p-[0.75rem] text-center">
              <span className="grid h-[1.75rem] w-[1.75rem] place-items-center rounded-full bg-go font-display font-extrabold text-go-text">{i + 1}</span>
              <div className="grid min-h-[3rem] place-items-center">{p.art}</div>
              <p className="font-sans text-[1rem] leading-snug font-bold">{p.line}</p>
            </li>
          ))}
        </ol>
        <button
          onClick={onClose}
          autoFocus
          className="mt-[1rem] min-h-[2.75rem] w-full cursor-pointer rounded-full bg-gradient-to-b from-[#48e3f0] to-go font-display text-[1.125rem] font-extrabold text-go-text shadow-[0_0.35rem_0_var(--color-go-lip)] active:translate-y-[0.25rem] active:shadow-[0_0.1rem_0_var(--color-go-lip)]"
        >
          {t('howToPlay.close')}
        </button>
      </div>
    </div>
  );
}
