// Fly — Endless 3-Lane Runner — BUILD_SEQUENCE.md S2 / plan.md §7 row 2
import { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Sparkles,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Home,
  Shield,
  Zap,
  Magnet,
  AlertTriangle,
  Compass,
  Rocket,
} from 'lucide-react';
import { useGame } from '../store/game';
import { stageDelta, isStageTurned } from '../components/stageMath';
import { getKpToday } from '../services/nasa';
import { Badge } from '../components/Panel';
import { spaceMusic } from '../services/audio';
import { MusicToggle } from '../components/MusicToggle';
import {
  createInitialState,
  determineSpeedConfig,
  stepGame,
} from '../fly/engine';
import { getFlyStats, recordRunEnd, type FlyStats } from '../fly/storage';
import { renderFly } from '../fly/renderer';
import type { FlyCommand, FlyConfig, FlyState } from '../fly/types';
import { t } from '../content/i18n';

export function Fly() {
  const go = useGame((s) => s.go);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Space weather config
  const [config, setConfig] = useState<FlyConfig>(() => determineSpeedConfig(2.33, 'NASA ARCHIVE'));
  const [stats, setStats] = useState<FlyStats>(() => getFlyStats());
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [runSummary, setRunSummary] = useState<{ distance: number; earned: number; isNewBest: boolean } | null>(null);

  // Active game state in ref for 60fps render loop
  const stateRef = useRef<FlyState>(createInitialState(config));
  const commandsRef = useRef<FlyCommand[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Upbeat arcade music in Fly screen
  useEffect(() => {
    spaceMusic.setMode('fly');
    return () => {
      spaceMusic.setMode('normal');
    };
  }, []);

  // 1. Fetch today's real Kp for starting speed
  useEffect(() => {
    let active = true;
    getKpToday().then((res) => {
      if (active && res) {
        const conf = determineSpeedConfig(res.data, res.badge);
        setConfig(conf);
        if (!hasStarted) {
          stateRef.current = createInitialState(conf);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [hasStarted]);

  // 2. Start game
  const handleStart = () => {
    stateRef.current = createInitialState(config, Date.now());
    commandsRef.current = [];
    setIsGameOver(false);
    setRunSummary(null);
    setHasStarted(true);
    lastTimeRef.current = performance.now();
  };

  // 3. Main Delta-Time Loop (pauses when hidden)
  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    let animId: number;
    let isHidden = false;

    const onVisibilityChange = () => {
      if (document.hidden) {
        isHidden = true;
      } else {
        isHidden = false;
        lastTimeRef.current = performance.now(); // avoid dt spike on tab resume
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const loop = (now: number) => {
      animId = requestAnimationFrame(loop);

      if (isHidden) {
        lastTimeRef.current = now;
        return;
      }

      const dt = Math.min(0.08, (now - lastTimeRef.current) / 1000);
      lastTimeRef.current = now;

      const cmds = commandsRef.current;
      commandsRef.current = [];

      // Step physics
      const nextState = stepGame(stateRef.current, dt, cmds, config);
      stateRef.current = nextState;

      // Check game over
      if (nextState.gameOver && !isGameOver) {
        setIsGameOver(true);
        const res = recordRunEnd(nextState.distance, nextState.stardust);
        setRunSummary({
          distance: Math.floor(nextState.distance),
          earned: nextState.stardust,
          isNewBest: res.isNewBest,
        });
        setStats(res.stats);
        return;
      }

      // Draw canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderFly(ctx, canvas.width, canvas.height, nextState, 'orbit');
        }
      }
    };

    lastTimeRef.current = performance.now();
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [hasStarted, isGameOver, config]);

  // 4. Resize canvas to container
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (container && canvas) {
        const rect = container.getBoundingClientRect();
        canvas.width = Math.max(300, Math.floor(rect.width));
        canvas.height = Math.max(200, Math.floor(rect.height));

        // Re-draw immediately if idle
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderFly(ctx, canvas.width, canvas.height, stateRef.current, 'orbit');
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 5. Controls: Keyboard (Arrows / WASD / Space)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted) {
        if (e.key === ' ' || e.key === 'Enter') {
          handleStart();
        }
        return;
      }
      if (isGameOver) {
        if (e.key === ' ' || e.key === 'Enter') {
          handleStart();
        }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        commandsRef.current.push('moveLeft');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        commandsRef.current.push('moveRight');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        commandsRef.current.push('hop');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [hasStarted, isGameOver]);

  // 6. Mobile & Touch Screen Controls
  // Handles swipes (Left, Right, Up) and screen-half taps correctly in both portrait-turned & landscape
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasStarted || isGameOver) return;
    touchStartRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!hasStarted || isGameOver) return;
    const start = touchStartRef.current;
    if (!start) return;

    const screenDx = e.clientX - start.x;
    const screenDy = e.clientY - start.y;
    const turned = isStageTurned();
    // Map screen-space delta to stage-space delta (handles upright phone quarter-turn)
    const delta = stageDelta(screenDx, screenDy);
    const dist = Math.hypot(delta.dx, delta.dy);

    // 1. Swipe Gestures
    if (dist > 24) {
      // Swipe Up -> Hop over low rock
      if (delta.dy < -18 && Math.abs(delta.dy) > Math.abs(delta.dx) * 0.6) {
        commandsRef.current.push('hop');
        touchStartRef.current = null;
        return;
      }
      // Swipe Left -> Shift Left
      if (delta.dx < -18) {
        commandsRef.current.push('moveLeft');
        touchStartRef.current = null;
        return;
      }
      // Swipe Right -> Shift Right
      if (delta.dx > 18) {
        commandsRef.current.push('moveRight');
        touchStartRef.current = null;
        return;
      }
    }

    // 2. Screen Tap (Tap left half vs right half)
    const rect = e.currentTarget.getBoundingClientRect();
    let ratioX = 0.5;
    if (turned) {
      // In 90deg clockwise turned stage, screen Y corresponds to stage X (left-to-right)
      ratioX = (e.clientY - rect.top) / rect.height;
    } else {
      // Flat landscape orientation: screen X is stage X
      ratioX = (e.clientX - rect.left) / rect.width;
    }

    if (ratioX < 0.5) {
      commandsRef.current.push('moveLeft');
    } else {
      commandsRef.current.push('moveRight');
    }

    touchStartRef.current = null;
  };

  const currentState = stateRef.current;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: 'none' }}
      className="relative h-full w-full select-none overflow-hidden bg-space font-sans touch-none"
    >
      {/* 3D Game Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full touch-none" />

      {/* In-Game Top HUD (Shown while playing) */}
      {hasStarted && !isGameOver && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 flex items-center justify-between p-2.5 sm:p-4 text-text z-10">
          {/* Hull pips (3 hearts) */}
          <div className="flex items-center gap-1.5 rounded-full border-2 border-line bg-panel/90 px-3 py-1 shadow-md backdrop-blur-md">
            {[1, 2, 3].map((pip) => (
              <Heart
                key={pip}
                size={18}
                className={pip <= currentState.hull ? 'fill-danger text-danger' : 'text-muted/40'}
              />
            ))}
          </div>

          {/* Active Power Widget */}
          {currentState.activePower && (
            <div className="flex items-center gap-2 rounded-full border-2 border-go bg-panel px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-text shadow-[0_0_1.25rem_rgba(34,215,230,0.45)]">
              {currentState.activePower === 'shield' && <Shield size={16} className="text-go" />}
              {currentState.activePower === 'magnet' && <Magnet size={16} className="text-star" />}
              {currentState.activePower === 'boost' && <Zap size={16} className="text-nova" />}
              <span>{currentState.activePower}</span>
              <span className="tabular-nums font-mono">({Math.ceil(currentState.powerRemaining)}s)</span>
            </div>
          )}

          {/* Stardust & Distance Counters + Music */}
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            <div className="flex items-center gap-1 rounded-full border-2 border-line bg-panel/90 px-3 py-1 font-display text-sm font-extrabold text-star shadow-md backdrop-blur-md">
              <Sparkles size={16} />
              <span className="tabular-nums">{currentState.stardust}</span>
            </div>
            <div className="rounded-full border-2 border-line bg-panel/90 px-3.5 py-1 font-display text-sm font-extrabold text-text tabular-nums shadow-md backdrop-blur-md">
              {Math.floor(currentState.distance)} m
            </div>
            <MusicToggle compact />
          </div>
        </div>
      )}

      {/* Arcade On-Screen Touch Controls (Steer Left, Steer Right, Hop) */}
      {hasStarted && !isGameOver && (
        <>
          {/* Bottom-Left Steering Controls */}
          <div className="absolute left-3 bottom-3 z-20 flex items-center gap-2.5">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                commandsRef.current.push('moveLeft');
              }}
              className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 border-white/30 bg-panel/85 text-text shadow-[0_0.3rem_0_#0F8F9C] backdrop-blur-md active:translate-y-1 active:border-go active:shadow-none"
              aria-label="Steer Left"
            >
              <ArrowLeft size={28} strokeWidth={3} className="text-go" />
            </button>

            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                commandsRef.current.push('moveRight');
              }}
              className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border-2 border-white/30 bg-panel/85 text-text shadow-[0_0.3rem_0_#0F8F9C] backdrop-blur-md active:translate-y-1 active:border-go active:shadow-none"
              aria-label="Steer Right"
            >
              <ArrowRight size={28} strokeWidth={3} className="text-go" />
            </button>
          </div>

          {/* Bottom-Right Hop / Jump Button */}
          <div className="absolute right-3 bottom-3 z-20">
            <button
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                commandsRef.current.push('hop');
              }}
              className="flex h-14 w-16 sm:h-16 sm:w-20 flex-col items-center justify-center rounded-2xl border-2 border-go/80 bg-gradient-to-b from-[#22D7E6] to-[#0F8F9C] font-display font-extrabold text-go-text shadow-[0_0.35rem_0_#0A5B64,0_0_1.25rem_rgba(34,215,230,0.4)] active:translate-y-1 active:shadow-none"
              aria-label="Hop over low rock"
            >
              <ArrowUp size={24} strokeWidth={3.5} />
              <span className="text-[0.625rem] tracking-wider uppercase leading-snug mt-0.5">{t('fly.hop')}</span>
            </button>
          </div>
        </>
      )}

      {/* 1. Pre-Flight Briefing & Start Screen Overlay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-space-deep/90 p-4 sm:p-6 text-center text-text overflow-y-auto">
          {/* Top Pill: Live Space Weather & Music */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/90 px-3 py-1 text-xs font-bold text-muted shadow-sm">
              <Badge kind={config.badge} />
              <span>{t('fly.weather')}: Kp {config.kp} ({config.speedTier})</span>
            </div>
            <MusicToggle />
          </div>

          <div className="flex items-center justify-center gap-2.5 mt-1">
            <Rocket className="text-go h-8 w-8 sm:h-9 sm:w-9" />
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-text">
              {t('fly.title')}
            </h1>
          </div>

          {/* Primary Controls Quick-Summary */}
          <p className="mt-1 text-xs sm:text-sm text-text/80 max-w-md leading-snug">
            {t('fly.instructions')}
          </p>

          {/* Flight Manual: Visual Instructions for Obstacles and Powers */}
          <div className="mt-3.5 mb-4 grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full max-w-xl text-left">
            {/* Column 1: Obstacles (Hazards) */}
            <div className="rounded-2xl border-2 border-line bg-panel/85 p-3 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-danger mb-2">
                <AlertTriangle size={15} />
                <span>{t('fly.obstacles')}</span>
              </div>
              <ul className="flex flex-col gap-1.5 text-[0.8125rem]">
                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-danger/20 text-danger font-bold text-xs">
                    🪨
                  </span>
                  <div>
                    <span className="font-bold text-text">{t('fly.rock')}: </span>
                    <span className="text-muted leading-snug">{t('fly.rockDesc')}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-danger/20 text-danger font-bold text-xs">
                    🗼
                  </span>
                  <div>
                    <span className="font-bold text-text">{t('fly.monolith')}: </span>
                    <span className="text-muted leading-snug">{t('fly.monolithDesc')}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-danger/20 text-danger font-bold text-xs">
                    🛰️
                  </span>
                  <div>
                    <span className="font-bold text-text">{t('fly.debris')}: </span>
                    <span className="text-muted leading-snug">{t('fly.debrisDesc')}</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Column 2: Powers & Collectibles */}
            <div className="rounded-2xl border-2 border-line bg-panel/85 p-3 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 font-display text-xs font-extrabold uppercase tracking-wider text-star mb-2">
                <Compass size={15} />
                <span>{t('fly.powers')}</span>
              </div>
              <ul className="flex flex-col gap-1.5 text-[0.8125rem]">
                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-go/20 text-go font-bold text-xs">
                    <Shield size={14} />
                  </span>
                  <div>
                    <span className="font-bold text-go">{t('fly.shield')}: </span>
                    <span className="text-muted leading-snug">{t('fly.shieldDesc')}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-star/20 text-star font-bold text-xs">
                    <Magnet size={14} />
                  </span>
                  <div>
                    <span className="font-bold text-star">{t('fly.magnet')}: </span>
                    <span className="text-muted leading-snug">{t('fly.magnetDesc')}</span>
                  </div>
                </li>

                <li className="flex items-start gap-2 bg-space-deep/50 rounded-xl p-1.5 border border-line/40">
                  <span className="shrink-0 grid place-items-center h-6 w-6 rounded-lg bg-nova/20 text-nova font-bold text-xs">
                    <Zap size={14} />
                  </span>
                  <div>
                    <span className="font-bold text-nova">{t('fly.boost')}: </span>
                    <span className="text-muted leading-snug">{t('fly.boostDesc')}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Launch Action */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleStart}
              className="inline-flex min-h-[3.5rem] items-center justify-center gap-3 rounded-2xl border-2 border-go bg-go px-8 sm:px-12 py-3 font-display text-xl sm:text-2xl font-extrabold tracking-wider text-go-text shadow-[0_0.35rem_0_#0F8F9C,0_0_1.5rem_rgba(34,215,230,0.5)] transition hover:brightness-105 active:translate-y-1 active:shadow-none cursor-pointer leading-snug break-words"
            >
              <span>{t('fly.btn')}</span>
            </button>

            <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-xs font-bold text-muted">
              <span>{t('fly.bestOnDevice')}: {stats.bestDistance} m</span>
              <span>·</span>
              <span>{t('fly.bank')}: {stats.totalStardust} ✦</span>
            </div>

            <button
              onClick={() => go('home')}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text underline-offset-4 hover:underline cursor-pointer py-1"
            >
              <Home size={14} />
              <span>{t('fly.returnHome')}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. End Screen Overlay (Run Over) */}
      {isGameOver && runSummary && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-space-deep/85 p-4 sm:p-6 text-center text-text overflow-y-auto">
          <div className="w-full max-w-sm rounded-3xl border-2 border-line bg-panel p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text leading-tight">
              {t('fly.gameOver')}
            </h2>
            <p className="mt-1 text-xs text-muted uppercase tracking-wider">
              {runSummary.isNewBest ? t('fly.newRecord') : t('fly.telemetry')}
            </p>

            <div className="my-4 sm:my-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-space-deep p-3">
                <span className="text-xs text-muted block truncate">{t('fly.distance')}</span>
                <p className="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-go tabular-nums">
                  {runSummary.distance} m
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-space-deep p-3">
                <span className="text-xs text-muted block truncate">{t('fly.stardustEarned')}</span>
                <p className="mt-0.5 font-display text-xl sm:text-2xl font-extrabold text-star tabular-nums">
                  +{runSummary.earned} ✦
                </p>
              </div>
            </div>

            <div className="mb-5 sm:mb-6 rounded-xl bg-space-deep/60 px-3 py-2 text-xs font-bold text-muted flex flex-wrap items-center justify-center gap-2">
              <span>{t('fly.bestOnDevice')}: {stats.bestDistance} m</span>
              <span>·</span>
              <span>{t('fly.bank')}: {stats.totalStardust} ✦</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleStart}
                className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-go bg-go px-4 py-2.5 font-display text-base sm:text-lg font-extrabold text-go-text shadow-[0_0.35rem_0_#0F8F9C,0_0_1.25rem_rgba(34,215,230,0.45)] transition active:translate-y-1 active:shadow-none cursor-pointer leading-snug break-words"
              >
                <RefreshCw size={18} strokeWidth={2.5} />
                <span>{t('btn.flyAgain')}</span>
              </button>

              <button
                onClick={() => go('home')}
                className="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-line bg-panel-up px-4 py-2 font-display text-xs sm:text-sm font-extrabold text-text transition hover:bg-panel active:translate-y-0.5 cursor-pointer leading-snug break-words"
              >
                <Home size={16} />
                <span>{t('nav.home')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fly;
