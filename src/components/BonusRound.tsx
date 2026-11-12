// Bonus Round Shell & 6 Mini-Games (plan.md §5.6 & BUILD_SEQUENCE.md K5)
// 20-second touch-friendly mini-games rewarding 0 to 30 Stardust (✦).
import { useEffect, useState, useRef } from 'react';
import { 
  Sparkles, 
  SkipForward, 
  Flame, 
  Trophy,
  Zap,
  Shield,
  Sun,
  Sprout,
  Circle,
  Triangle,
  Star,
  Square,
  Wrench
} from 'lucide-react';
import { useI18n } from '../content/i18n';
import { useWallet } from '../store/wallet';
import {
  initCountdown,
  tickCountdown,
  tapCountdown,
  CountdownState,
  initZapper,
  spawnRock,
  tickZapper,
  zapRock,
  ZapperState,
  initLeakPatrol,
  spawnLeak,
  sealLeak,
  tickLeakPatrol,
  LeakState,
  initPanelWipe,
  wipePanel,
  isAllPanelsClean,
  PanelWipeState,
  initSeedMatch,
  flipCard,
  SeedMatchState,
  initRockSorter,
  sortRock,
  RockSorterState,
  ShapeSymbol,
  calculateStardustReward,
} from '../minigames/miniEngine';

interface BonusRoundProps {
  levelIndex: number; // 0 to 5
  onComplete: (earnedStardust: number) => void;
  onSkip: () => void;
}

export function BonusRound({ levelIndex, onComplete, onSkip }: BonusRoundProps) {
  const lang = useI18n((s) => s.lang);
  const levelId = levelIndex + 1;

  const [timeLeft, setTimeLeft] = useState(20);
  const [isFinished, setIsFinished] = useState(false);
  const [earnedStardust, setEarnedStardust] = useState(0);

  // Game States
  const [countdown, setCountdown] = useState<CountdownState>(initCountdown);
  const [zapper, setZapper] = useState<ZapperState>(initZapper);
  const [leak, setLeak] = useState<LeakState>(initLeakPatrol);
  const [panels, setPanels] = useState<PanelWipeState>(initPanelWipe);
  const [seedMatch, setSeedMatch] = useState<SeedMatchState>(initSeedMatch);
  const [rockSorter, setRockSorter] = useState<RockSorterState>(initRockSorter);

  const timerRef = useRef<number | null>(null);

  // 1. Master 20s Timer
  useEffect(() => {
    if (isFinished) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished]);

  // Finish and calculate reward
  const finishGame = () => {
    if (isFinished) return;
    setIsFinished(true);

    let rawScore = 0;
    if (levelId === 1) rawScore = countdown.score;
    else if (levelId === 2) rawScore = zapper.score;
    else if (levelId === 3) rawScore = leak.sealedCount;
    else if (levelId === 4) rawScore = panels.panels.filter((p) => p >= 100).length;
    else if (levelId === 5) rawScore = seedMatch.matchedPairs;
    else if (levelId === 6) rawScore = rockSorter.sortedCount;

    const reward = calculateStardustReward(levelId, rawScore);
    setEarnedStardust(reward);
    if (reward > 0) {
      useWallet.getState().earn('bonus', reward);
    }
  };

  // 2. Loop for Level 1 (Countdown needle tick)
  useEffect(() => {
    if (levelId !== 1 || isFinished) return;
    const interval = setInterval(() => {
      setCountdown((prev) => tickCountdown(prev, 3.5));
    }, 30);
    return () => clearInterval(interval);
  }, [levelId, isFinished]);

  // 3. Loop for Level 2 (Rock spawn & tick)
  useEffect(() => {
    if (levelId !== 2 || isFinished) return;
    const tick = setInterval(() => {
      setZapper((prev) => tickZapper(prev));
    }, 200);

    const spawner = setInterval(() => {
      setZapper((prev) => {
        if (prev.rocks.length >= 4) return prev;
        const x = 15 + Math.random() * 70;
        const y = 15 + Math.random() * 65;
        return spawnRock(prev, x, y, 48, 2);
      });
    }, 800);

    return () => {
      clearInterval(tick);
      clearInterval(spawner);
    };
  }, [levelId, isFinished]);

  // 4. Loop for Level 3 (Air leak spawn & tick)
  useEffect(() => {
    if (levelId !== 3 || isFinished) return;
    const tick = setInterval(() => {
      setLeak((prev) => tickLeakPatrol(prev));
    }, 200);

    const spawner = setInterval(() => {
      setLeak((prev) => {
        if (prev.leaks.length >= 3) return prev;
        const slot = Math.floor(Math.random() * 9);
        return spawnLeak(prev, slot);
      });
    }, 1100);

    return () => {
      clearInterval(tick);
      clearInterval(spawner);
    };
  }, [levelId, isFinished]);

  // 5. Check early finish for Level 1, 4, 5
  useEffect(() => {
    if (levelId === 1 && countdown.step === 0 && !isFinished) {
      finishGame();
    } else if (levelId === 4 && isAllPanelsClean(panels) && !isFinished) {
      finishGame();
    } else if (levelId === 5 && seedMatch.matchedPairs >= 4 && !isFinished) {
      finishGame();
    }
  }, [countdown.step, panels, seedMatch.matchedPairs, levelId, isFinished]);

  // Mini-game titles & instructions (under 5 words!)
  const TITLES: Record<number, { en: string; bn: string; hintEn: string; hintBn: string }> = {
    1: {
      en: 'Countdown Timing',
      bn: 'কাউন্টডাউন টাইমিং',
      hintEn: 'Tap in green zone: 3, 2, 1!',
      hintBn: 'সবুজ দাগে কাঁটা এলে চাপুন!',
    },
    2: {
      en: 'Space Rock Zapper',
      bn: 'মহাকাশ পাথর জ্যাপার',
      hintEn: 'Tap flying rocks before impact!',
      hintBn: 'উড়ে আসা পাথরে টোকা মারুন!',
    },
    3: {
      en: 'Air Leak Patrol',
      bn: 'এয়ার লিক পেট্রোল',
      hintEn: 'Tap cracks to seal air leaks!',
      hintBn: 'ফাঁটা দাগে চাপ দিয়ে বাতাস বাঁচান!',
    },
    4: {
      en: 'Solar Panel Wiper',
      bn: 'সৌর প্যানেল ওয়াইপার',
      hintEn: 'Swipe dust off solar panels!',
      hintBn: 'ঘষে প্যানেলের ধুলো সাফ করুন!',
    },
    5: {
      en: 'Crop Seed Match',
      bn: 'বীজ ও ফসলের মিল',
      hintEn: 'Flip cards to match crops!',
      hintBn: 'বীজের সাথে ফসল মেলাও!',
    },
    6: {
      en: 'Jezero Rock Sorter',
      bn: 'জেজেরো পাথর বাছাই',
      hintEn: 'Match rock shape to canister!',
      hintBn: 'আকার মিলিয়ে সঠিক পাত্রে রাখো!',
    },
  };

  const meta = TITLES[levelId] ?? TITLES[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/95 p-3 select-none">
      <div className="relative flex h-full max-h-[32rem] w-full max-w-[46rem] flex-col overflow-hidden rounded-2xl border-3 border-go bg-panel p-3.5 sm:p-5 shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-go/20 text-go border border-go">
              <Sparkles size={18} />
            </span>
            <div>
              <span className="font-display text-[10px] sm:text-xs font-black tracking-wider text-amber-300 uppercase">
                {lang === 'bn' ? `বোনাস রাউন্ড · লেভেল ${levelId}` : `BONUS ROUND · LEVEL ${levelId}`}
              </span>
              <h2 className="font-display text-sm sm:text-base font-black text-white leading-tight">
                {lang === 'bn' ? meta.bn : meta.en}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* 20s Countdown Timer Badge */}
            <div className="flex items-center gap-1.5 rounded-full border border-line bg-panel-up px-3 py-1 font-display text-xs sm:text-sm font-black text-text">
              <span className="h-2 w-2 rounded-full bg-good animate-ping" />
              <span>{timeLeft}s</span>
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={onSkip}
              className="flex min-h-[2.25rem] items-center gap-1 rounded-full border border-line bg-panel-up px-3 py-1 font-display text-xs font-bold text-muted hover:text-white transition cursor-pointer"
            >
              <SkipForward size={14} />
              <span>{lang === 'bn' ? 'স্কিপ' : 'Skip'}</span>
            </button>
          </div>
        </div>

        {/* Short Instruction Banner */}
        <div className="mt-2 text-center">
          <p className="font-display text-xs sm:text-sm font-extrabold text-cyan-300">
            {lang === 'bn' ? meta.hintBn : meta.hintEn}
          </p>
        </div>

        {/* Active Mini-Game Playfield */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border-2 border-line bg-space p-2 flex items-center justify-center my-2">
          {/* LEVEL 1: Countdown Timing */}
          {levelId === 1 && (
            <div className="flex flex-col items-center justify-center gap-4 w-full max-w-sm">
              <div className="text-center font-display text-3xl sm:text-4xl font-black text-white">
                {countdown.step > 0 ? `T - ${countdown.step}` : '🚀 LIFT-OFF!'}
              </div>

              {/* Timing Gauge */}
              <div className="relative w-full h-8 rounded-full border-2 border-line bg-panel overflow-hidden">
                {/* Green zone */}
                <div
                  className="absolute top-0 bottom-0 bg-good/60 border-x-2 border-good"
                  style={{ left: `${countdown.greenMin}%`, width: `${countdown.greenMax - countdown.greenMin}%` }}
                />
                {/* Needle */}
                <div
                  className="absolute top-0 bottom-0 w-2 bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b] -translate-x-1/2 transition-transform"
                  style={{ left: `${countdown.needle}%` }}
                />
              </div>

              <button
                type="button"
                disabled={countdown.step === 0}
                onClick={() => setCountdown((prev) => tapCountdown(prev).state)}
                className="flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go font-display text-base font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] hover:brightness-105 active:translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                <Flame size={20} />
                <span>{lang === 'bn' ? 'ট্যাপ করে ফায়ার করো!' : 'TAP TO IGNITE!'}</span>
              </button>
            </div>
          )}

          {/* LEVEL 2: Space Rock Zapper */}
          {levelId === 2 && (
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-2 left-2 rounded-md bg-panel/80 px-2 py-0.5 text-xs font-display font-bold text-muted">
                {lang === 'bn' ? `পাথর ধবংস: ${zapper.score}` : `Rocks Zapped: ${zapper.score}`}
              </div>

              {zapper.rocks.map((rock) => (
                <button
                  key={rock.id}
                  type="button"
                  onClick={() => setZapper((prev) => zapRock(prev, rock.id).state)}
                  style={{ left: `${rock.x}%`, top: `${rock.y}%`, width: `${rock.size}px`, height: `${rock.size}px` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border-2 border-amber-400 bg-stone-800 text-amber-300 font-display font-black text-xs shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                >
                  <Zap size={22} className="animate-pulse" />
                </button>
              ))}
            </div>
          )}

          {/* LEVEL 3: Air Leak Patrol */}
          {levelId === 3 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-xs aspect-square p-2">
              {Array.from({ length: 9 }).map((_, idx) => {
                const activeLeak = leak.leaks.find((l) => l.slotIndex === idx);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (activeLeak) {
                        setLeak((prev) => sealLeak(prev, activeLeak.id).state);
                      }
                    }}
                    className={`flex items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${
                      activeLeak
                        ? 'border-red-500 bg-red-950/80 shadow-[0_0_12px_#ef4444] animate-bounce'
                        : 'border-line bg-panel-up'
                    }`}
                  >
                    {activeLeak ? (
                      <Wrench size={26} className="text-red-400" />
                    ) : (
                      <Shield size={20} className="text-muted/40" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* LEVEL 4: Solar Panel Wiper */}
          {levelId === 4 && (
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {panels.panels.map((cleanPercent, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPanels((prev) => wipePanel(prev, idx, 35))}
                  className="relative flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel-up p-3 h-24 overflow-hidden cursor-pointer"
                >
                  <Sun size={26} className={cleanPercent >= 100 ? 'text-amber-400' : 'text-stone-500'} />
                  <span className="font-display text-xs font-bold text-white mt-1">
                    {cleanPercent >= 100 ? (lang === 'bn' ? 'পরিষ্কার!' : 'Clean!') : `${cleanPercent}%`}
                  </span>
                  {/* Dust overlay representation */}
                  <div
                    className="absolute inset-0 bg-yellow-950/70 pointer-events-none transition-all duration-300"
                    style={{ opacity: 1 - cleanPercent / 100 }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* LEVEL 5: Crop Seed Match */}
          {levelId === 5 && (
            <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
              {seedMatch.cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  disabled={card.matched || card.revealed}
                  onClick={() => setSeedMatch((prev) => flipCard(prev, card.id).state)}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 h-16 sm:h-20 transition-all cursor-pointer ${
                    card.matched
                      ? 'border-good bg-good/20 opacity-80'
                      : card.revealed
                      ? 'border-go bg-panel-up'
                      : 'border-line bg-panel hover:border-white/40'
                  }`}
                >
                  {card.revealed || card.matched ? (
                    <>
                      <Sprout size={20} className="text-good" />
                      <span className="font-display text-[10px] font-bold text-white capitalize mt-0.5">
                        {card.pairKey}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-lg font-black text-muted">?</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* LEVEL 6: Jezero Rock Sorter */}
          {levelId === 6 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
              {rockSorter.currentRock && (
                <div className="flex flex-col items-center p-3 rounded-2xl border-2 border-amber-400 bg-panel-up">
                  <span className="font-display text-xs font-bold text-muted mb-1">
                    {lang === 'bn' ? 'বর্তমান পাথর:' : 'Current Sample:'}
                  </span>
                  {rockSorter.currentRock.shape === 'circle' && <Circle size={36} className="text-emerald-400" />}
                  {rockSorter.currentRock.shape === 'triangle' && <Triangle size={36} className="text-amber-400" />}
                  {rockSorter.currentRock.shape === 'star' && <Star size={36} className="text-cyan-400" />}
                  {rockSorter.currentRock.shape === 'diamond' && <Square size={36} className="text-rose-400 rotate-45" />}
                </div>
              )}

              {/* 4 Canister Target Buttons */}
              <div className="grid grid-cols-4 gap-2 w-full">
                {(['circle', 'triangle', 'star', 'diamond'] as ShapeSymbol[]).map((shape) => (
                  <button
                    key={shape}
                    type="button"
                    onClick={() => setRockSorter((prev) => sortRock(prev, shape).state)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border-2 border-line bg-panel hover:border-go transition cursor-pointer min-h-[44px]"
                  >
                    {shape === 'circle' && <Circle size={22} className="text-emerald-400" />}
                    {shape === 'triangle' && <Triangle size={22} className="text-amber-400" />}
                    {shape === 'star' && <Star size={22} className="text-cyan-400" />}
                    {shape === 'diamond' && <Square size={22} className="text-rose-400 rotate-45" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Game Finish / Victory Modal */}
        {isFinished && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-space-deep/90 p-4 anim-pop-in">
            <div className="flex max-w-sm flex-col items-center rounded-2xl border-3 border-go bg-panel p-5 text-center shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-400 border-2 border-amber-400 mb-2">
                <Trophy size={30} />
              </div>
              <h3 className="font-display text-xl font-black text-white">
                {lang === 'bn' ? 'বোনাস রাউন্ড সম্পন্ন!' : 'Bonus Round Complete!'}
              </h3>
              <p className="mt-1 font-display text-xs sm:text-sm font-bold text-muted">
                {lang === 'bn' ? 'দারুণ খেলেছো মহাকাশচারী!' : 'Great job, Junior Astronaut!'}
              </p>

              {/* Stardust Earned Chip */}
              <div className="mt-3 flex items-center gap-2 rounded-full border-2 border-amber-400/60 bg-amber-500/20 px-4 py-1.5 font-display text-base font-black text-amber-300">
                <Sparkles size={18} />
                <span>+{earnedStardust} ✦ Stardust</span>
              </div>

              <button
                type="button"
                onClick={() => onComplete(earnedStardust)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go py-3 font-display text-sm font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] hover:brightness-105 active:translate-y-0.5 cursor-pointer"
              >
                <span>{lang === 'bn' ? 'পুরস্কার গ্রহণ করুন' : 'Continue to Rewards'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
