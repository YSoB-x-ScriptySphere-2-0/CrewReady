// Training screen (Locked) — BUILD_SEQUENCE.md S3 / plan.md §7 row 5
import { useState } from 'react';
import { ArrowLeft, Lock, Brain, Dumbbell, Film, Sparkles } from 'lucide-react';
import { useGame } from '../store/game';
import { Twinkle } from '../components/Twinkle';
import { t, useI18n } from '../content/i18n';

interface TrainingModule {
  id: 'mind' | 'body' | 'reels';
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function Training() {
  const [wigglingId, setWigglingId] = useState<string | null>(null);
  const { go } = useGame();
  const lang = useI18n((s) => s.lang);

  const handleCardTap = (id: string) => {
    setWigglingId(id);
    setTimeout(() => {
      setWigglingId(null);
    }, 450);
  };

  const localizedModules: TrainingModule[] = [
    {
      id: 'mind',
      title: t('training.mind'),
      tagline: lang === 'bn' ? 'স্মৃতি ও বুদ্ধির খেলা' : 'Memory & Reaction Puzzles',
      description: t('training.mindDesc'),
      icon: Brain,
      color: '#22D7E6',
    },
    {
      id: 'body',
      title: t('training.body'),
      tagline: lang === 'bn' ? 'জিরো-গ্র্যাভিটি ফিটনেস' : 'Zero-G Fitness Routines',
      description: t('training.bodyDesc'),
      icon: Dumbbell,
      color: '#F5B700',
    },
    {
      id: 'reels',
      title: t('training.reels'),
      tagline: lang === 'bn' ? 'নাসা আসল ভিডিও' : 'Archival Rocket Videos',
      description: t('training.reelsDesc'),
      icon: Film,
      color: '#E8338B',
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-space p-3 text-text sm:p-5 select-none font-sans">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b-2 border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go('home')}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-panel/80 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-panel hover:text-text active:translate-y-0.5 leading-snug"
            aria-label={t('nav.home')}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t('nav.home')}</span>
          </button>
          <div>
            <h1 className="font-display text-base sm:text-2xl font-extrabold uppercase tracking-wider text-text">
              {t('training.title')}
            </h1>
            <p className="text-[11px] text-muted sm:text-xs">
              {lang === 'bn' ? 'খুদে মহাকাশচারীদের প্রাথমিক প্রস্তুতি' : 'Pre-flight conditioning and simulations'}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/70 px-3 py-1 text-xs font-bold text-muted">
          <Sparkles className="h-3.5 w-3.5 text-star" />
          <span>{t('training.status')}</span>
        </div>
      </header>

      {/* Main Content: Twinkle Banner + 3 Padlocked Cards */}
      <div className="my-auto flex flex-col items-center justify-center gap-4 py-3">
        <div className="flex max-w-xl items-center gap-4 rounded-2xl border-2 border-line bg-panel/80 p-3 sm:p-4 shadow-sm">
          <Twinkle mood="sleepy" size={68} />
          <div>
            <div className="font-display text-sm sm:text-base font-extrabold text-text">
              {lang === 'bn' ? 'টুইংকল সিমুলেটরগুলো পরীক্ষা করছে!' : 'Twinkle is testing the simulators!'}
            </div>
            <p className="mt-0.5 text-xs text-muted leading-relaxed">
              {t('training.twinkle')}
            </p>
          </div>
        </div>

        {/* 3 Padlocked Cards Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {localizedModules.map((mod) => {
            const Icon = mod.icon;
            const isWiggling = wigglingId === mod.id;

            return (
              <div
                key={mod.id}
                onClick={() => handleCardTap(mod.id)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-2xl border-2 border-line bg-panel/90 p-4 transition-transform ${
                  isWiggling ? 'animate-[wiggle_0.4s_ease-in-out]' : 'hover:-translate-y-1 hover:border-text/50'
                }`}
                style={{
                  animation: isWiggling ? 'wiggle 0.4s ease-in-out' : undefined,
                }}
              >
                {/* Padlock Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-space-deep shadow-sm"
                    style={{ backgroundColor: mod.color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-line bg-space/60 px-2 py-0.5 text-[10px] font-bold text-muted group-hover:border-text group-hover:text-text">
                    <Lock className="h-3 w-3 text-star" />
                    <span>{t('training.locked')}</span>
                  </div>
                </div>

                {/* Card Title & Desc */}
                <div className="mt-3">
                  <h2 className="font-display text-base font-extrabold text-text leading-snug">
                    {mod.title}
                  </h2>
                  <div className="text-[11px] font-bold text-go mt-0.5">
                    {mod.tagline}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                {/* Tap Hint */}
                <div className="mt-3 border-t border-line/30 pt-2 text-center text-[10px] font-bold text-muted/70 group-hover:text-text">
                  {t('training.tapHint')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="flex flex-shrink-0 items-center justify-center border-t-2 border-line/40 pt-2 text-center text-[11px] text-muted">
        <span>Curriculum developed according to NASA astronaut human factors guidelines.</span>
      </footer>

      {/* Inline animation keyframes for card wiggle */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg) scale(0.98); }
          75% { transform: rotate(3deg) scale(0.98); }
        }
      `}</style>
    </div>
  );
}
