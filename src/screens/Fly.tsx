// Fly — Endless 3-Lane Runner — BUILD_SEQUENCE.md S2 / plan.md §7 row 2
import { useEffect, useRef, useState } from 'react';
import { Heart, Sparkles, ArrowUp, RefreshCw, Home, Shield, Zap, Magnet } from 'lucide-react';
import { useGame } from '../store/game';
import { stageDelta } from '../components/stageMath';
import { getKpToday } from '../services/nasa';
import { Badge } from '../components/Panel';
import {
  createInitialState,
  determineSpeedConfig,
  stepGame,
} from '../fly/engine';
import { getFlyStats, recordRunEnd, type FlyStats } from '../fly/storage';
import { renderFly } from '../fly/renderer';
import type { FlyCommand, FlyConfig, FlyState } from '../fly/types';

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

  // 6. Controls: Touch (Tap Left/Right 50% for lanes, swipe up via stageDelta)
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
    // Map screen-space delta to stage-space delta (handles upright quarter-turn)
    const delta = stageDelta(screenDx, screenDy);

    const dist = Math.hypot(delta.dx, delta.dy);

    // Swipe up detection (stageDelta.dy < -30)
    if (dist > 30 && delta.dy < -25) {
      commandsRef.current.push('hop');
    } else {
      // Tap Left vs Right half of screen
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width * 0.5) {
        commandsRef.current.push('moveLeft');
      } else {
        commandsRef.current.push('moveRight');
      }
    }
    touchStartRef.current = null;
  };

  const currentState = stateRef.current;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative h-full w-full select-none overflow-hidden bg-space font-sans"
    >
      {/* 3D Game Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {/* In-Game Top HUD (Shown while playing) */}
      {hasStarted && !isGameOver && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 flex items-center justify-between p-3 sm:p-4 text-text">
          {/* Hull pips (3 hearts) */}
          <div className="flex items-center gap-1.5 rounded-full border-2 border-line bg-panel/85 px-3 py-1 shadow-md">
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

          {/* Stardust & Distance Counters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border-2 border-line bg-panel/85 px-3 py-1 font-display text-sm font-extrabold text-star">
              <Sparkles size={16} />
              <span className="tabular-nums">{currentState.stardust}</span>
            </div>
            <div className="rounded-full border-2 border-line bg-panel/85 px-3.5 py-1 font-display text-sm font-extrabold text-text tabular-nums">
              {Math.floor(currentState.distance)} m
            </div>
          </div>
        </div>
      )}

      {/* Mobile Touch Hop Button (bottom-right) */}
      {hasStarted && !isGameOver && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            commandsRef.current.push('hop');
          }}
          className="group absolute right-4 bottom-4 z-10 flex h-14 w-14 items-center justify-center rounded-full border-3 border-line bg-panel-up text-text shadow-[0_0.35rem_0_#0F8F9C] active:translate-y-1 active:shadow-none sm:hidden"
          aria-label="Hop over low rock"
        >
          <ArrowUp size={26} strokeWidth={3} className="text-go group-hover:-translate-y-0.5" />
        </button>
      )}

      {/* 1. Start Screen Overlay: One Big FLY Button */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-space/85 p-6 text-center text-text">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-line bg-panel/90 px-3.5 py-1 text-xs font-bold text-muted">
            <Badge kind={config.badge} />
            <span>Space weather today: Kp {config.kp} ({config.speedTier} speed)</span>
          </div>

          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-wider text-text">
            Fly: Orbit Runner
          </h1>
          <p className="mt-2 max-w-sm text-sm sm:text-base text-muted">
            Tap left or right to change lanes. Swipe up or tap Hop to jump over low rocks. Collect stardust minerals!
          </p>

          <div className="mt-6">
            <button
              onClick={handleStart}
              className="inline-flex min-h-[3.5rem] items-center gap-3 rounded-2xl border-2 border-go bg-go px-8 py-3.5 font-display text-xl font-extrabold tracking-wide text-go-text shadow-[0_0.35rem_0_#0F8F9C,0_0_1.5rem_rgba(34,215,230,0.5)] transition hover:brightness-105 active:translate-y-1 active:shadow-none"
            >
              <span>FLY</span>
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-xs font-bold text-muted">
            <span>Best on device: {stats.bestDistance} m</span>
            <span>·</span>
            <span>Bank: {stats.totalStardust} ✦</span>
          </div>

          <button
            onClick={() => go('home')}
            className="mt-6 inline-flex items-center gap-1.5 text-xs text-muted hover:text-text underline-offset-4 hover:underline"
          >
            <Home size={14} />
            <span>Return to Mission Control</span>
          </button>
        </div>
      )}

      {/* 2. End Screen Overlay (Run Over) */}
      {isGameOver && runSummary && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-space-deep/85 p-6 text-center text-text">
          <div className="w-full max-w-sm rounded-3xl border-2 border-line bg-panel p-6 shadow-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-text">
              Run Complete!
            </h2>
            <p className="mt-1 text-xs text-muted uppercase tracking-wider">
              {runSummary.isNewBest ? '★ New Record Distance! ★' : 'Orbital Run telemetry'}
            </p>

            <div className="my-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-line bg-space-deep p-3">
                <span className="text-xs text-muted">Distance</span>
                <p className="mt-0.5 font-display text-2xl font-extrabold text-go tabular-nums">
                  {runSummary.distance} m
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-space-deep p-3">
                <span className="text-xs text-muted">Stardust Earned</span>
                <p className="mt-0.5 font-display text-2xl font-extrabold text-star tabular-nums">
                  +{runSummary.earned} ✦
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-space-deep/60 px-4 py-2 text-xs font-bold text-muted">
              <span>Best Distance: {stats.bestDistance} m</span>
              <span className="mx-2">·</span>
              <span>Total Bank: {stats.totalStardust} ✦</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleStart}
                className="inline-flex min-h-[3rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-go bg-go px-5 py-2.5 font-display text-lg font-extrabold text-go-text shadow-[0_0.35rem_0_#0F8F9C,0_0_1.25rem_rgba(34,215,230,0.45)] transition active:translate-y-1 active:shadow-none"
              >
                <RefreshCw size={18} strokeWidth={2.5} />
                <span>Fly Again</span>
              </button>

              <button
                onClick={() => go('home')}
                className="inline-flex min-h-[2.75rem] w-full items-center justify-center gap-2 rounded-xl border-2 border-line bg-panel-up px-4 py-2 font-display text-sm font-extrabold text-text transition hover:bg-panel active:translate-y-0.5"
              >
                <Home size={16} />
                <span>Mission Control</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Fly;
