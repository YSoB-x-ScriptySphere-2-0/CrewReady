// The five Space Arcade games. Each one runs its own session and calls onEnd(finalScore) exactly once.
// Rules live in src/minigames/arcade/engines.ts; these components only draw and time them.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GEM_SIZE,
  MERGE_NAMES,
  answerFocus,
  areAdjacent,
  canMoveMerge,
  flipMatch,
  focusScore,
  focusWindowMs,
  initBlaster,
  initFocus,
  initGems,
  initMatch,
  initMerge,
  isBlasterOver,
  isFocusDone,
  isMatchDone,
  makeRng,
  matchScore,
  moveMerge,
  resolveMismatch,
  shootRock,
  tickBlaster,
  trySwap,
  type Cell,
  type Dir,
  type RockKind,
} from '../../minigames/arcade/engines';

export interface GameProps {
  lang: 'en' | 'bn';
  onEnd: (score: number) => void;
}

const newSeed = () => Math.floor(Math.random() * 2 ** 31);

/** Counts seconds down and reports the end once. Pass `active=false` to pause. */
function useCountdown(seconds: number, active: boolean, onZero: () => void) {
  const [left, setLeft] = useState(seconds);
  const zero = useRef(onZero);
  zero.current = onZero;
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          window.clearInterval(id);
          window.setTimeout(() => zero.current(), 0);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return left;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-baseline gap-1.5 rounded-full border border-line bg-panel-up px-3 py-0.5 font-display text-xs font-black text-text">
      <span className="text-muted">{label}</span>
      <span className="tabular-nums text-amber-300">{value}</span>
    </div>
  );
}

// ==========================================================
// 1. Star Match (memory)
// ==========================================================
export function StarMatchGame({ lang, onEnd }: GameProps) {
  const [state, setState] = useState(() => initMatch(makeRng(newSeed())));
  const endedRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd(matchScore(stateRef.current));
  }, [onEnd]);

  const left = useCountdown(45, true, finish);

  // A mismatched pair stays visible for a moment, then flips back. Cards are locked meanwhile.
  useEffect(() => {
    if (!state.locked) return;
    const id = window.setTimeout(() => setState((s) => resolveMismatch(s)), 750);
    return () => window.clearTimeout(id);
  }, [state.locked]);

  useEffect(() => {
    if (isMatchDone(state)) {
      const id = window.setTimeout(finish, 500);
      return () => window.clearTimeout(id);
    }
  }, [state, finish]);

  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Stat label={lang === 'bn' ? 'জোড়া' : 'Pairs'} value={`${state.pairs}/${state.total}`} />
        <Stat label={lang === 'bn' ? 'চাল' : 'Moves'} value={state.moves} />
        <Stat label={lang === 'bn' ? 'সময়' : 'Time'} value={`${left}s`} />
      </div>
      <div className="grid w-full max-w-sm flex-1 grid-cols-4 content-center gap-2">
        {state.cards.map((c) => {
          const show = c.faceUp || c.matched;
          return (
            <button
              key={c.id}
              type="button"
              aria-label={show ? c.symbol : lang === 'bn' ? 'বন্ধ কার্ড' : 'Hidden card'}
              onClick={() => setState((s) => flipMatch(s, c.id))}
              className={`grid aspect-[4/5] max-h-24 place-items-center rounded-xl border-2 text-3xl transition-all duration-200 cursor-pointer ${
                c.matched
                  ? 'border-good bg-good/25 scale-95'
                  : show
                    ? 'border-go bg-panel-up [transform:rotateY(0deg)]'
                    : 'border-line bg-gradient-to-br from-panel to-space-deep hover:border-white/50 active:scale-95'
              }`}
            >
              {show ? <span className="drop-shadow">{c.symbol}</span> : <span className="font-display text-xl font-black text-muted/70">✦</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================
// 2. Asteroid Blaster (shooter)
// ==========================================================
const ROCK_LOOK: Record<RockKind, { icon: string; ring: string }> = {
  rock: { icon: '☄️', ring: 'border-amber-400/70 bg-stone-900/70' },
  fast: { icon: '🔥', ring: 'border-red-400/80 bg-red-950/70' },
  gold: { icon: '⭐', ring: 'border-yellow-300 bg-yellow-900/60 shadow-[0_0_14px_#fde047]' },
  satellite: { icon: '🛰️', ring: 'border-cyan-300/80 bg-cyan-950/70' },
};

export function BlasterGame({ lang, onEnd }: GameProps) {
  const rng = useMemo(() => makeRng(newSeed()), []);
  const stateRef = useRef(initBlaster());
  const [, force] = useState(0);
  const endedRef = useRef(false);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd(stateRef.current.score);
  }, [onEnd]);

  const left = useCountdown(40, true, finish);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!endedRef.current) {
        stateRef.current = tickBlaster(stateRef.current, dt, rng);
        force((n) => (n + 1) % 1e6);
        if (isBlasterOver(stateRef.current)) {
          finish();
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [rng, finish]);

  const s = stateRef.current;
  return (
    <div className="flex h-full w-full flex-col gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Stat label={lang === 'bn' ? 'স্কোর' : 'Score'} value={s.score} />
        <Stat label={lang === 'bn' ? 'জীবন' : 'Lives'} value={'❤️'.repeat(Math.max(0, s.lives)) || '—'} />
        {s.combo >= 3 && <Stat label="Combo" value={`x${1 + Math.floor(s.combo / 5)}`} />}
        <Stat label={lang === 'bn' ? 'সময়' : 'Time'} value={`${left}s`} />
      </div>
      <div className="relative min-h-[11rem] flex-1 touch-none overflow-hidden rounded-xl border-2 border-line bg-space-deep">
        {s.rocks.map((r) => (
          <button
            key={r.id}
            type="button"
            aria-label={r.kind}
            onPointerDown={(e) => {
              e.preventDefault();
              stateRef.current = shootRock(stateRef.current, r.id);
              force((n) => (n + 1) % 1e6);
            }}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            className={`absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 text-2xl cursor-crosshair ${ROCK_LOOK[r.kind].ring}`}
          >
            {ROCK_LOOK[r.kind].icon}
          </button>
        ))}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-6 items-center justify-center bg-gradient-to-t from-sky-500/50 to-transparent font-display text-[10px] font-black tracking-widest text-sky-100 uppercase">
          🌍 {lang === 'bn' ? 'পৃথিবী' : 'Earth'}
        </div>
      </div>
      <p className="text-center text-xs font-bold text-muted">
        {lang === 'bn' ? '☄️ পাথর ভাঙো · ⭐ সোনা = ৫০ · 🛰️ স্যাটেলাইটে মেরো না!' : '☄️ Blast rocks · ⭐ gold = 50 · don’t hit 🛰️ satellites!'}
      </p>
    </div>
  );
}

// ==========================================================
// 3. Signal Focus (attention: tap stars, ignore black holes)
// ==========================================================
export function FocusGame({ lang, onEnd }: GameProps) {
  const [state, setState] = useState(() => initFocus(makeRng(newSeed())));
  const [shown, setShown] = useState(true);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const endedRef = useRef(false);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd(focusScore(stateRef.current));
  }, [onEnd]);

  const answer = useCallback(
    (tapped: boolean) => {
      if (endedRef.current) return;
      const res = answerFocus(stateRef.current, tapped);
      stateRef.current = res.state;
      setState(res.state);
      setFlash(res.correct ? 'good' : 'bad');
      setShown(false);
      if (isFocusDone(res.state)) window.setTimeout(finish, 450);
    },
    [finish],
  );

  // Each signal stays up for a shrinking window, then counts as "not tapped".
  useEffect(() => {
    if (isFocusDone(state)) return;
    if (!shown) {
      const id = window.setTimeout(() => {
        setFlash(null);
        setShown(true);
      }, 280);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => answer(false), focusWindowMs(state.index));
    return () => window.clearTimeout(id);
  }, [shown, state, answer]);

  const trial = state.trials[state.index];
  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Stat label={lang === 'bn' ? 'ধাপ' : 'Signal'} value={`${Math.min(state.index + 1, state.trials.length)}/${state.trials.length}`} />
        <Stat label={lang === 'bn' ? 'ধারা' : 'Streak'} value={state.streak} />
      </div>
      <div
        className={`grid w-full max-w-xs flex-1 place-items-center rounded-2xl border-2 transition-colors ${
          flash === 'good' ? 'border-good bg-good/15' : flash === 'bad' ? 'border-red-500 bg-red-500/15' : 'border-line bg-space-deep'
        }`}
      >
        {shown && trial ? (
          <span className="text-7xl drop-shadow-[0_0_16px_rgba(255,255,255,0.35)]" aria-label={trial === 'go' ? 'star' : 'black hole'}>
            {trial === 'go' ? '⭐' : '🕳️'}
          </span>
        ) : (
          <span className="text-3xl text-muted/40">·</span>
        )}
      </div>
      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          if (shown && !isFocusDone(state)) answer(true);
        }}
        className="min-h-[3.25rem] w-full max-w-xs rounded-xl bg-gradient-to-b from-[#48e3f0] to-go font-display text-base font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] active:translate-y-0.5 cursor-pointer"
      >
        {lang === 'bn' ? 'ট্যাপ! (শুধু ⭐)' : 'TAP! (only ⭐)'}
      </button>
      <p className="text-center text-xs font-bold text-muted">
        {lang === 'bn' ? '⭐ দেখলেই ট্যাপ করো। 🕳️ ব্ল্যাক হোল দেখলে থামো!' : 'Tap when you see ⭐. Hold still for the 🕳️ black hole!'}
      </p>
    </div>
  );
}

// ==========================================================
// 4. Gem Swap (match-3)
// ==========================================================
const GEM_ICONS = ['🪐', '⭐', '🌙', '☄️', '🚀'];
const GEM_BG = ['bg-violet-500/25', 'bg-yellow-400/25', 'bg-slate-300/20', 'bg-orange-500/25', 'bg-cyan-400/25'];

export function GemSwapGame({ lang, onEnd }: GameProps) {
  const rng = useMemo(() => makeRng(newSeed()), []);
  const [board, setBoard] = useState(() => initGems(rng));
  const [score, setScore] = useState(0);
  const [sel, setSel] = useState<Cell | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [combo, setCombo] = useState('');
  const scoreRef = useRef(0);
  const endedRef = useRef(false);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd(scoreRef.current);
  }, [onEnd]);

  const left = useCountdown(45, true, finish);

  const tap = (r: number, c: number) => {
    if (endedRef.current) return;
    const cell = { r, c };
    if (!sel) return setSel(cell);
    if (sel.r === r && sel.c === c) return setSel(null);
    if (!areAdjacent(sel, cell)) return setSel(cell);
    const res = trySwap(board, sel, cell, rng);
    setSel(null);
    if (!res.valid) {
      setShake(`${r},${c}`);
      window.setTimeout(() => setShake(null), 300);
      return;
    }
    scoreRef.current += res.points;
    setScore(scoreRef.current);
    setBoard(res.board);
    setCombo(res.cascades > 1 ? `${res.cascades}x ${lang === 'bn' ? 'কম্বো!' : 'combo!'}` : '');
  };

  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Stat label={lang === 'bn' ? 'স্কোর' : 'Score'} value={score} />
        <Stat label={lang === 'bn' ? 'সময়' : 'Time'} value={`${left}s`} />
        {combo && <span className="font-display text-sm font-black text-amber-300 anim-pop-in">{combo}</span>}
      </div>
      <div className="grid aspect-square w-full max-w-[19rem] flex-1 gap-1" style={{ gridTemplateColumns: `repeat(${GEM_SIZE}, minmax(0, 1fr))`, maxHeight: '100%' }}>
        {board.map((row, r) =>
          row.map((v, c) => {
            const selected = sel?.r === r && sel?.c === c;
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => tap(r, c)}
                aria-label={`gem ${r + 1},${c + 1}`}
                className={`grid place-items-center rounded-lg border-2 text-xl transition-transform cursor-pointer sm:text-2xl ${GEM_BG[v]} ${
                  selected ? 'scale-110 border-white' : 'border-transparent hover:border-white/40'
                } ${shake === `${r},${c}` ? 'animate-pulse border-red-500' : ''}`}
              >
                {GEM_ICONS[v]}
              </button>
            );
          }),
        )}
      </div>
      <p className="text-center text-xs font-bold text-muted">
        {lang === 'bn' ? 'পাশের দুটি রত্ন বদলাও, ৩টি মিলালে ফাটবে!' : 'Swap two neighbours to line up 3 or more!'}
      </p>
    </div>
  );
}

// ==========================================================
// 5. Cosmic Merge (2048 with planets)
// ==========================================================
const TILE_BG = ['', 'bg-slate-600', 'bg-slate-400 text-black', 'bg-red-500', 'bg-sky-500', 'bg-blue-700', 'bg-amber-300 text-black', 'bg-orange-500', 'bg-yellow-300 text-black', 'bg-fuchsia-500', 'bg-violet-500', 'bg-emerald-400 text-black'];
const TILE_ICON = ['', '✨', '🌙', '🔴', '🌍', '🔵', '🪐', '🟠', '☀️', '💫', '🌌', '🌠'];

export function MergeGame({ lang, onEnd }: GameProps) {
  const rng = useMemo(() => makeRng(newSeed()), []);
  const [board, setBoard] = useState(() => initMerge(rng));
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const boardRef = useRef(board);
  boardRef.current = board;
  const endedRef = useRef(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const finish = useCallback(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd(scoreRef.current);
  }, [onEnd]);

  const left = useCountdown(75, true, finish);

  const move = useCallback(
    (dir: Dir) => {
      if (endedRef.current) return;
      const res = moveMerge(boardRef.current, dir, rng);
      if (!res.moved) return;
      scoreRef.current += res.gain;
      setScore(scoreRef.current);
      setBoard(res.board);
      if (!canMoveMerge(res.board)) window.setTimeout(finish, 600);
    },
    [rng, finish],
  );

  useEffect(() => {
    const keys: Record<string, Dir> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
    const on = (e: KeyboardEvent) => {
      const dir = keys[e.key];
      if (dir) {
        e.preventDefault();
        move(dir);
      }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [move]);

  const swipe = (e: React.PointerEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  };

  const top = Math.max(0, ...board.flat());
  return (
    <div className="flex h-full w-full flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Stat label={lang === 'bn' ? 'স্কোর' : 'Score'} value={score} />
        <Stat label={lang === 'bn' ? 'সেরা' : 'Best'} value={MERGE_NAMES[top] || '—'} />
        <Stat label={lang === 'bn' ? 'সময়' : 'Time'} value={`${left}s`} />
      </div>
      <div
        className="grid aspect-square w-full max-w-[18rem] touch-none grid-cols-4 gap-1.5 rounded-xl border-2 border-line bg-space-deep p-1.5"
        onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={swipe}
      >
        {board.flat().map((v, i) => (
          <div key={i} className={`grid place-items-center rounded-lg text-center font-display font-black leading-none ${v ? `${TILE_BG[v] ?? 'bg-emerald-400 text-black'} text-white` : 'bg-panel/60'}`}>
            {v ? (
              <span className="flex flex-col items-center gap-0.5">
                <span className="text-xl">{TILE_ICON[v] ?? '🌠'}</span>
                <span className="text-[9px] uppercase">{MERGE_NAMES[v] ?? v}</span>
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1">
        <span />
        <button type="button" aria-label="up" onClick={() => move('up')} className="rounded-lg border border-line bg-panel-up px-4 py-1 text-lg cursor-pointer">▲</button>
        <span />
        <button type="button" aria-label="left" onClick={() => move('left')} className="rounded-lg border border-line bg-panel-up px-4 py-1 text-lg cursor-pointer">◀</button>
        <button type="button" aria-label="down" onClick={() => move('down')} className="rounded-lg border border-line bg-panel-up px-4 py-1 text-lg cursor-pointer">▼</button>
        <button type="button" aria-label="right" onClick={() => move('right')} className="rounded-lg border border-line bg-panel-up px-4 py-1 text-lg cursor-pointer">▶</button>
      </div>
      <p className="text-center text-xs font-bold text-muted">
        {lang === 'bn' ? 'সোয়াইপ করে একই গ্রহ মেলাও: ধুলো → চাঁদ → মঙ্গল → পৃথিবী ...' : 'Swipe to merge matching worlds: Dust → Moon → Mars → Earth …'}
      </p>
    </div>
  );
}
