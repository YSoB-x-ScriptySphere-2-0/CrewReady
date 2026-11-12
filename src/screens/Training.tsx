// Training screen (Locked) — BUILD_SEQUENCE.md S3 / plan.md §7 row 5
import { useState } from 'react';
import { ArrowLeft, Lock, Brain, Dumbbell, Film, Sparkles } from 'lucide-react';
import { useGame } from '../store/game';
import { Twinkle } from '../components/Twinkle';

interface TrainingModule {
  id: 'mind' | 'body' | 'reels';
  title: string;
  tagline: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const MODULES: TrainingModule[] = [
  {
    id: 'mind',
    title: 'Mind Simulator',
    tagline: 'Reaction & Memory Puzzles',
    description: 'Rapid decision mini-games that test spatial memory, pattern recall, and solar telemetry under pressure.',
    icon: Brain,
    color: '#22D7E6',
  },
  {
    id: 'body',
    title: 'Astronaut Fitness',
    tagline: 'Zero-G Resistance Routines',
    description: 'Real daily workout regimens NASA astronauts use to prevent bone density loss during deep space missions.',
    icon: Dumbbell,
    color: '#F5B700',
  },
  {
    id: 'reels',
    title: 'NASA Mission Reels',
    tagline: 'Curated Archival Footage',
    description: 'Short real-world clips from Apollo, Artemis, Curiosity, and Perseverance documenting Mars exploration.',
    icon: Film,
    color: '#E8338B',
  },
];

export function Training() {
  const [wigglingId, setWigglingId] = useState<string | null>(null);
  const { go } = useGame();

  const handleCardTap = (id: string) => {
    setWigglingId(id);
    setTimeout(() => {
      setWigglingId(null);
    }, 450);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-y-auto bg-space p-3 text-text sm:p-5 select-none font-sans">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b-2 border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go('home')}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-panel/80 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-panel hover:text-text active:translate-y-0.5"
            aria-label="Back to Mission Control"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Mission Control</span>
          </button>
          <div>
            <h1 className="font-display text-lg sm:text-2xl font-extrabold uppercase tracking-wider text-text">
              Astronaut Training Academy
            </h1>
            <p className="text-[11px] text-muted sm:text-xs">
              Pre-flight conditioning and mission simulations
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-line bg-panel/70 px-3 py-1 text-xs font-bold text-muted">
          <Sparkles className="h-3.5 w-3.5 text-star" />
          <span>Coming in Next Update</span>
        </div>
      </header>

      {/* Main Content: Sleepy Twinkle Banner + 3 Padlocked Cards */}
      <div className="my-auto flex flex-col items-center justify-center gap-4 py-3">
        {/* Twinkle Sleepy Banner */}
        <div className="flex max-w-xl items-center gap-4 rounded-2xl border-2 border-line bg-panel/80 p-3 sm:p-4 shadow-sm">
          <Twinkle mood="sleepy" size={68} />
          <div>
            <div className="font-display text-sm sm:text-base font-extrabold text-text">
              Twinkle is calibrating the simulators!
            </div>
            <p className="mt-0.5 text-xs text-muted leading-relaxed">
              The academy modules are currently undergoing safety certification for the Mars Continuity Programme.
              Check back in our next release!
            </p>
          </div>
        </div>

        {/* 3 Padlocked Cards Grid */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {MODULES.map((mod) => {
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
                    <span>LOCKED</span>
                  </div>
                </div>

                {/* Card Title & Desc */}
                <div className="mt-3">
                  <h2 className="font-display text-base font-extrabold text-text">
                    {mod.title}
                  </h2>
                  <div className="text-[11px] font-bold text-go">
                    {mod.tagline}
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                {/* Tap Hint */}
                <div className="mt-3 border-t border-line/30 pt-2 text-center text-[10px] font-bold text-muted/70 group-hover:text-text">
                  Tap to check readiness
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
