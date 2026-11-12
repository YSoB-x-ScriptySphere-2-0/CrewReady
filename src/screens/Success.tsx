// Success and the Outpost Check (A9): the dawn scene, a reward crate that pops out the result badge,
// the four meter pills ticked at 30 or more, six "I learned" badges that flip over to show the line and
// its source, NASA's picture of the day (only when a real saved one exists), the best-five board,
// two locked teasers, then Fly again or Home. The board is saved by the store, once per run.
// R4, landscape: a slim top strip; left, the crate between the cheering kids and the outcome strip;
// right, the Outpost check line, the six badges (two rows of three), the teasers, Fly again and Home.
// A tapped badge grows over the shelf and flips to show its line; the best-runs board opens over the right zone.
import { useEffect, useRef, useState } from 'react';
import { Check, Crown, House, Lock, Medal, Rocket, Shield, Star, X, type LucideIcon } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { MeterPill, StarCounter } from '../components/Hud';
import { LevelZones } from '../components/LevelChrome';
import { reducedMotion, usePress } from '../components/motion';
import { IntelCard, Panel, Ribbon } from '../components/Panel';
import { PrizeBadge, RewardCrate } from '../components/RewardCrate';
import { Scene } from '../components/Scene';
import { Kid } from '../components/Twinkle';
import { SAVED_APOD, usableApod } from '../content/apod';
import { LEVELS } from '../content/levels';
import { HEALTHY, outpostCheck } from '../engine/engine';
import { METERS, type Level, type OutpostResult } from '../engine/types';
import { useGame } from '../store/game';
import type { BoardEntry } from '../store/leaderboard';

// Plan §5.3, word for word.
const RESULT_TEXT: Record<OutpostResult, { title: string; rank: string; line: string; icon: LucideIcon }> = {
  survives: { title: 'Outpost Survives', rank: 'Cadet', line: 'You made it! The base is weak. The next crew has work to do.', icon: Shield },
  stable: { title: 'Outpost Stable', rank: 'Pilot', line: 'The base can hold on until the next rocket comes.', icon: Medal },
  thriving: { title: 'Outpost Thriving', rank: 'Commander', line: 'Earth is cheering. People now have a second home.', icon: Crown },
};

const openLabel = (level: Level) => `Level ${level.id}, ${level.title}. I learned: ${level.learned} Source: ${level.source}`;
const closedLabel = (level: Level) => `Level ${level.id}, ${level.title}. Tap to read what you learned.`;

/** The gold medal disc with the level number. */
function MedalDisc({ id, big }: { id: number; big?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full border-2 border-line bg-star font-display leading-none font-extrabold text-go-text ${big ? 'h-[3rem] w-[3rem] text-[1.5rem]' : 'h-[1.625rem] w-[1.625rem] text-[1rem]'}`}
      aria-hidden
    >
      {id}
    </span>
  );
}

/** One "I learned" badge on the shelf (its front). Tapping it opens the big card, which flips over. */
function LessonBadge({ level, open, onClick, innerRef }: { level: Level; open: boolean; onClick: () => void; innerRef: (el: HTMLButtonElement | null) => void }) {
  const press = usePress();
  return (
    <button
      ref={innerRef}
      type="button"
      onClick={onClick}
      aria-pressed={open}
      aria-label={open ? openLabel(level) : closedLabel(level)}
      {...press}
      className={`toy flex min-h-0 min-w-0 items-center gap-[0.25rem] overflow-hidden rounded-tile px-[0.3125rem] py-[0.125rem] text-left text-text ${
        open ? 'border-go bg-panel-up [--lip:var(--color-go-lip)]' : 'bg-panel'
      }`}
    >
      <MedalDisc id={level.id} />
      <span className="flex min-w-0 flex-col">
        <span className="font-display text-[0.8125rem] leading-[1.05] font-extrabold">{level.title}</span>
        <span className="sr-only">Tap to flip</span>
      </span>
    </button>
  );
}

/** The open badge, grown over the shelf: it flips to show the line and its source. Tap (or Escape) flips it back. */
function LessonCard({ level, onClose }: { level: Level; onClose: () => void }) {
  const press = usePress();
  const ref = useRef<HTMLButtonElement>(null);
  const [flipped, setFlipped] = useState(false);
  const closing = useRef(false);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    const t = setTimeout(() => setFlipped(true), 30);
    return () => clearTimeout(t);
  }, []);
  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setFlipped(false);
    setTimeout(onClose, reducedMotion() ? 0 : 420);
  };
  return (
    <div className="anim-pop-in absolute inset-0 z-10">
    <button
      ref={ref}
      type="button"
      onClick={close}
      aria-pressed
      aria-label={openLabel(level)}
      {...press}
      onKeyDown={(e) => {
        if (e.key === 'Escape') close();
        else press.onKeyDown(e);
      }}
      className="toy flip-card grid h-[calc(100%-0.45rem)] w-full rounded-tile bg-transparent p-0 text-text [--lip:var(--color-go-lip)]"
    >
      <span className={`flip-inner h-full ${flipped ? 'is-flipped' : ''}`}>
        {/* Front: the medal and the title. */}
        <span className="flip-face flex items-center justify-center gap-[0.75rem] self-stretch rounded-[0.875rem] bg-panel px-[0.75rem]">
          <MedalDisc id={level.id} big />
          <span className="flex min-w-0 flex-col text-left">
            <span className="font-display text-[1.25rem] leading-tight font-extrabold">{level.title}</span>
            <span className="text-[0.875rem] font-bold text-muted">Tap to flip</span>
          </span>
        </span>
        {/* Back: the line and its source. */}
        <span className="flip-face flip-back flex items-start gap-[0.625rem] self-stretch rounded-[0.875rem] bg-panel-up px-[0.75rem] py-[0.375rem] text-left break-words">
          <MedalDisc id={level.id} />
          <span className="flex h-full min-w-0 flex-1 flex-col gap-[0.25rem]">
            <span className="font-display text-[0.875rem] font-extrabold text-muted uppercase">I learned</span>
            <span className="text-[0.9375rem] leading-snug">{level.learned}</span>
            <span className="mt-auto border-t-2 border-line pt-[0.25rem] text-[0.75rem] leading-snug text-muted">Source: {level.source}</span>
          </span>
        </span>
      </span>
    </button>
    </div>
  );
}

/** "Your best runs": the best-five board, with this run marked. Opens over the right zone. */
function BestRuns({ board, thisRun, onClose }: { board: BoardEntry[]; thisRun: number; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  return (
    <div
      className="absolute inset-x-0 top-[0.875rem] bottom-0 z-20"
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <Panel ribbon="Your best runs" tone="ink" compact className="flex h-full flex-col !mt-0">
        <button ref={closeRef} onClick={onClose} aria-label="Close your best runs" className="absolute top-[0.125rem] right-[0.25rem] z-10 grid h-[2.75rem] w-[2.75rem] place-items-center rounded-full text-text">
          <X size={22} strokeWidth={3} />
        </button>
        <ol className="min-h-0 flex-1 space-y-[0.25rem] overflow-y-auto">
          {board.map((e, i) => {
            const mine = e.run === thisRun;
            const t = RESULT_TEXT[e.result];
            const day = new Date(e.at);
            return (
              <li
                key={`${e.at}-${i}`}
                className={`flex items-center gap-[0.5rem] rounded-tile border-2 px-[0.5rem] py-[0.0625rem] ${mine ? 'border-go bg-panel-up' : 'border-line bg-space'}`}
              >
                <span className="grid h-[1.75rem] w-[1.75rem] shrink-0 place-items-center rounded-full border-2 border-line bg-space-deep font-display text-[0.9375rem] leading-none font-extrabold" aria-hidden>
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[0.9375rem] leading-[1.15] font-extrabold">{t.title}</span>
                  <span className="flex flex-wrap items-center gap-x-[0.5rem] text-[0.8125rem] leading-tight text-muted">
                    {mine ? <span className="rounded-full bg-go px-[0.5rem] font-display font-extrabold text-go-text">This run</span> : null}
                    {e.healthy} of 4 healthy
                    {Number.isNaN(day.getTime()) ? '' : ` · ${day.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-[0.25rem] font-display text-[1.125rem] font-extrabold tabular-nums">
                  <Star size={18} strokeWidth={2.5} fill="var(--color-star)" className="text-star" aria-hidden />
                  {e.stars}
                  <span className="sr-only"> stars</span>
                </span>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}

const TEASERS = [
  ['Crew Mode', 'Next time, you and your friends each take one of these roles.'],
  ['More worlds', 'New missions beyond Mars.'],
] as const;

export function Success() {
  const { game, startMission, goHome, leaderboard, lastSavedRun } = useGame();
  const { healthy, result } = outpostCheck(game);
  const text = RESULT_TEXT[result];
  const [open, setOpen] = useState<number | null>(null);
  const [board, setBoard] = useState(false);
  const badgeRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const boardBtn = useRef<HTMLSpanElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const openLevel = LEVELS.find((lv) => lv.id === open) ?? null;

  // Focus goes back once the overlay has gone (an inert element cannot take focus).
  useEffect(() => {
    if (open !== null || board || !returnTo.current) return;
    returnTo.current.focus({ preventScroll: true });
    returnTo.current = null;
  }, [open, board]);

  const closeBadge = () => {
    if (open !== null) returnTo.current = badgeRefs.current[open] ?? null;
    setOpen(null);
  };
  const closeBoard = () => {
    returnTo.current = boardBtn.current?.querySelector('button') ?? null;
    setBoard(false);
  };

  const top = (
    <header className="flex shrink-0 items-center justify-between gap-[0.75rem] border-b-2 border-line bg-space-deep/90 px-[0.75rem] pt-[0.25rem] pb-[0.375rem] text-text">
      <p className="font-display text-[1.25rem] leading-tight font-extrabold">Sol 500 · Mission complete</p>
      <StarCounter n={game.stars} />
    </header>
  );

  const left = (
    <>
      {/* The badge's resting state is its final spot, so with reduced motion it is simply there. */}
      <div className="flex min-h-0 w-full flex-1 items-end justify-center">
        <Kid who="nova" pose="cheer" height="7.5rem" bob className="-mr-[1rem]" />
        <RewardCrate label={`${text.title}. Rank: ${text.rank}.`} className="z-10 !mx-0 !text-[0.5rem]">
          <PrizeBadge sub={text.rank}>
            <text.icon size={22} strokeWidth={2.5} aria-hidden />
          </PrizeBadge>
        </RewardCrate>
        <Kid who="orbit" pose="cheer" height="7.5rem" bob className="-ml-[1rem]" />
      </div>

      <div className="rise w-full shrink-0 rounded-panel border-2 border-line bg-panel px-[0.625rem] py-[0.5rem] text-text">
        <p className="font-display text-[1.125rem] leading-tight font-extrabold">{text.title}</p>
        <p className="mt-[0.125rem] flex flex-wrap items-center gap-x-[0.375rem] font-display text-[0.875rem] leading-snug font-bold">
          <span>Rank: {text.rank}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-[0.25rem]">
            <Star size={16} strokeWidth={2.5} fill="var(--color-star)" className="text-star" aria-hidden />
            {game.stars} stars
          </span>
          <span aria-hidden>·</span>
          <span>{healthy.length} of 4 healthy</span>
        </p>
        <div className="mt-[0.5rem] grid grid-cols-2 gap-x-[0.5rem] gap-y-[0.375rem]">
          {METERS.map((m) => (
            <div key={m} className="relative">
              <MeterPill meter={m} value={game.meters[m]} />
              {game.meters[m] >= HEALTHY ? (
                <span className="absolute -top-[0.375rem] -right-[0.25rem] grid h-[1.25rem] w-[1.25rem] place-items-center rounded-full border-2 border-line bg-good text-white">
                  <Check size={11} strokeWidth={4} aria-hidden />
                  <span className="sr-only">healthy</span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Scene bare place="dawn" top={top}>
      <LevelZones left={left}>
        <div className="relative flex min-h-0 flex-1 flex-col">
         {/* Inert while the best-runs board covers it, so Tab stays on the board. */}
         <div inert={board} className="flex min-h-0 flex-1 flex-col gap-[0.375rem]">
          {/* Outpost check: the result line. */}
          <div className="flex shrink-0 items-center gap-[0.5rem] rounded-[1rem] border-2 border-line bg-panel/85 px-[0.5rem] py-[0.25rem] text-text">
            <span className="shrink-0">
              <Ribbon tone="go" small>
                Outpost check
              </Ribbon>
            </span>
            <p className="min-w-0 text-[0.875rem] leading-snug font-bold">{text.line}</p>
          </div>

          {/* Caption and shelf share one box: the open badge grows over both and flips. */}
          <div className="relative flex min-h-0 flex-1 flex-col gap-[0.375rem]">
          <p className="flex shrink-0 flex-wrap items-baseline gap-x-[0.5rem] rounded-[1rem] bg-panel/85 px-[0.75rem] text-text">
            <span className="font-display text-[0.875rem] font-extrabold tracking-wide uppercase">What you learned</span>
            <span className="text-[0.875rem] text-muted">Six badges. Tap one to flip it.</span>
          </p>

          {/* The shelf: six badges, two rows of three (inert under the open card). */}
          <div className="min-h-0 flex-1">
            <div inert={openLevel !== null} className="grid h-full grid-cols-3 grid-rows-2 gap-x-[0.375rem] gap-y-[0.125rem]">
              {LEVELS.map((lv) => (
                <LessonBadge
                  key={lv.id}
                  level={lv}
                  open={open === lv.id}
                  onClick={() => setOpen(open === lv.id ? null : lv.id)}
                  innerRef={(el) => {
                    badgeRefs.current[lv.id] = el;
                  }}
                />
              ))}
            </div>
          </div>
          {openLevel ? <LessonCard key={openLevel.id} level={openLevel} onClose={closeBadge} /> : null}
          </div>

          {/* NASA's picture of the day, only from a real saved entry. Today the API sends only a placeholder
              (the NASA logo), so nothing shows here. B1 saves real entries; B4 brings live data. */}
          {usableApod(SAVED_APOD) ? (
            <div className="shrink-0">
              <IntelCard
                compact
                title="NASA picture of the day"
                badge="NASA ARCHIVE"
                date={SAVED_APOD.date}
                sentence={`Your reward: "${SAVED_APOD.title ?? 'A space picture'}".`}
                image={{ src: SAVED_APOD.url, alt: SAVED_APOD.title ?? 'NASA picture of the day', credit: SAVED_APOD.copyright ? `Image: ${SAVED_APOD.copyright}` : 'Image: NASA APOD' }}
                source="NASA APOD"
              />
            </div>
          ) : null}

          {/* Two locked teasers (not buttons, so they can be slim). */}
          <div className="flex shrink-0 items-start gap-[0.375rem]">
            {TEASERS.map(([t, d]) => (
              <div
                key={t}
                title={`${d} Coming soon.`}
                className="flex min-w-0 flex-1 items-center gap-[0.375rem] rounded-[1rem] border-2 border-dashed border-line bg-panel/85 px-[0.375rem] py-[0.125rem] text-text"
              >
                <span className="grid h-[1.75rem] w-[1.75rem] shrink-0 place-items-center rounded-full border-2 border-line bg-space-deep text-muted">
                  <Lock size={14} strokeWidth={3} aria-hidden />
                </span>
                <p className="min-w-0 leading-tight">
                  <span className="block font-display text-[0.875rem] font-extrabold">{t}</span>
                  <span className="sr-only">{d} </span>
                  <span className="block text-[0.75rem] text-muted">Coming soon.</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-[0.5rem]">
            {leaderboard.length ? (
              <span ref={boardBtn} className="shrink-0">
                <GameButton variant="small" onClick={() => setBoard(true)} className="!min-h-[2.75rem] !px-[0.75rem] !text-[0.9375rem] whitespace-nowrap">
                  Your best runs
                </GameButton>
              </span>
            ) : null}
            <span className="flex-1" aria-hidden />
            <GameButton variant="go" icon={Rocket} onClick={() => startMission()} className="!min-h-[2.75rem] !px-[1rem] !text-[1.25rem]">
              Fly again
            </GameButton>
            <GameButton variant="plain" icon={House} onClick={goHome} className="!min-h-[2.75rem] !px-[0.875rem] !text-[1.125rem]">
              Home
            </GameButton>
          </div>
         </div>

          {board && leaderboard.length ? <BestRuns board={leaderboard} thisRun={lastSavedRun} onClose={closeBoard} /> : null}
        </div>
      </LevelZones>
    </Scene>
  );
}
