// Success and the Outpost Check (A9): the dawn scene, a reward crate that pops out the result badge,
// the four meter pills ticked at 30 or more, six "I learned" badges that flip over to show the line and
// its source, NASA's picture of the day (only when a real saved one exists), the best-five board,
// two locked teasers, then Fly again or Home. The board is saved by the store, once per run.
import { useState } from 'react';
import { Check, Crown, House, Lock, Medal, Rocket, Shield, Star, type LucideIcon } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { MeterPill, StarCounter } from '../components/Hud';
import { usePress } from '../components/motion';
import { IntelCard, Panel } from '../components/Panel';
import { PrizeBadge, RewardCrate } from '../components/RewardCrate';
import { Scene } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
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

/** One "I learned" badge on the shelf. Tap to flip it over and read the line and its source. */
function LessonBadge({ level, open, onClick }: { level: Level; open: boolean; onClick: () => void }) {
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={open}
      aria-label={
        open
          ? `Level ${level.id}, ${level.title}. I learned: ${level.learned} Source: ${level.source}`
          : `Level ${level.id}, ${level.title}. Tap to read what you learned.`
      }
      {...press}
      className="toy flip-card grid w-full rounded-tile bg-transparent p-0 text-ink"
      style={{ ['--lip' as string]: 'var(--color-ink)' }}
    >
      <span className={`flip-inner ${open ? 'is-flipped' : ''}`}>
        {/* Front: a gold medal with the level number. */}
        {/* Phones: medal beside the title, one card per row. Wider screens: medal on top. */}
        <span className="flip-face flex min-h-[112px] items-center gap-3 self-stretch rounded-[13px] bg-[#fff1cc] px-3 py-3 sm:flex-col sm:justify-center sm:gap-2 sm:px-2">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-star font-display text-[30px] leading-none font-extrabold shadow-[0_4px_0_var(--color-ink)]">
            {level.id}
          </span>
          <span className="flex min-w-0 flex-col text-left sm:items-center sm:text-center">
            <span className="font-display text-lg leading-tight font-extrabold">{level.title}</span>
            <span className="text-sm font-bold text-muted">Tap to flip</span>
          </span>
        </span>
        {/* Back: the line and its source. */}
        <span className="flip-face flip-back flex min-h-[112px] flex-col gap-2 self-stretch rounded-[13px] bg-white px-3 py-3 text-left break-words">
          <span className="font-display text-sm font-extrabold text-muted uppercase">I learned</span>
          <span className="text-base leading-snug">{level.learned}</span>
          <span className="mt-auto border-t-2 border-edge pt-1.5 text-sm leading-snug text-muted">Source: {level.source}</span>
        </span>
      </span>
    </button>
  );
}

/** "Your best runs": the best-five board, with this run marked. */
function BestRuns({ board, thisRun }: { board: BoardEntry[]; thisRun: number }) {
  if (!board.length) return null;
  return (
    <Panel ribbon="Your best runs" tone="ink">
      <ol className="space-y-2">
        {board.map((e, i) => {
          const mine = e.run === thisRun;
          const t = RESULT_TEXT[e.result];
          const day = new Date(e.at);
          return (
            <li
              key={`${e.at}-${i}`}
              className={`flex items-center gap-2.5 rounded-tile border-[3px] px-2.5 py-1.5 ${mine ? 'border-ink bg-[#fff1cc] shadow-[0_3px_0_var(--color-ink)]' : 'border-edge bg-white'}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper font-display text-lg leading-none font-extrabold" aria-hidden>
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg leading-tight font-extrabold">{t.title}</span>
                <span className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
                  {mine ? <span className="rounded-full bg-ink px-2 font-display font-extrabold text-paper">This run</span> : null}
                  {e.healthy} of 4 healthy
                  {Number.isNaN(day.getTime()) ? '' : ` · ${day.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}`}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 font-display text-xl font-extrabold tabular-nums">
                <Star size={20} strokeWidth={2.5} fill="var(--color-star)" aria-hidden />
                {e.stars}
                <span className="sr-only"> stars</span>
              </span>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

export function Success() {
  const { game, startMission, goHome, leaderboard, lastSavedRun } = useGame();
  const { healthy, result } = outpostCheck(game);
  const text = RESULT_TEXT[result];
  const [open, setOpen] = useState<number[]>([]);
  const toggle = (id: number) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <Scene place="dawn">
      <header className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-extrabold">Sol 500 · Mission complete</p>
        <StarCounter n={game.stars} />
      </header>

      {/* The badge's resting state is its final spot, so with reduced motion it is simply there. */}
      <div className="relative flex items-end justify-center gap-1 sm:gap-6">
        <Kid who="nova" pose="cheer" height={150} bob className="sm:!h-[200px]" />
        <RewardCrate label={`${text.title}. Rank: ${text.rank}.`}>
          <PrizeBadge sub={text.rank}>
            <text.icon size={40} strokeWidth={2.5} aria-hidden />
          </PrizeBadge>
        </RewardCrate>
        <Kid who="orbit" pose="cheer" height={150} bob className="sm:!h-[200px]" />
      </div>

      <Panel ribbon="Outpost check" tone="go" className="text-center">
        <div className="flex items-center justify-center gap-3">
          <Twinkle mood="stars" size={64} />
          <p className="font-display text-[26px] leading-tight font-extrabold sm:text-[32px]">{text.title}</p>
        </div>
        <p className="mt-2 text-lg">{text.line}</p>
        <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 font-display text-lg font-bold">
          <span>Rank: {text.rank}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Star size={20} strokeWidth={2.5} fill="var(--color-star)" aria-hidden />
            {game.stars} stars
          </span>
          <span aria-hidden>·</span>
          <span>{healthy.length} of 4 healthy</span>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-x-2.5 gap-y-3 text-left sm:grid-cols-4">
          {METERS.map((m) => (
            <div key={m} className="relative">
              <MeterPill meter={m} value={game.meters[m]} />
              {game.meters[m] >= HEALTHY ? (
                <span className="absolute -top-2 -right-1 grid h-7 w-7 place-items-center rounded-full border-[3px] border-ink bg-good text-white">
                  <Check size={15} strokeWidth={4} aria-hidden />
                  <span className="sr-only">healthy</span>
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>

      <Panel ribbon="What you learned" tone="ink">
        <p className="text-base text-muted">Six badges. Tap one to flip it.</p>
        <div className="mt-3 grid grid-cols-1 gap-x-2.5 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((lv) => (
            <LessonBadge key={lv.id} level={lv} open={open.includes(lv.id)} onClick={() => toggle(lv.id)} />
          ))}
        </div>
      </Panel>

      {/* NASA's picture of the day, only from a real saved entry. Today the API sends only a placeholder
          (the NASA logo), so nothing shows here. B1 saves real entries; B4 brings live data. */}
      {usableApod(SAVED_APOD) ? (
        <IntelCard
          title="NASA picture of the day"
          badge="NASA ARCHIVE"
          date={SAVED_APOD.date}
          sentence={`Your reward: "${SAVED_APOD.title ?? 'A space picture'}".`}
          image={{ src: SAVED_APOD.url, alt: SAVED_APOD.title ?? 'NASA picture of the day', credit: SAVED_APOD.copyright ? `Image: ${SAVED_APOD.copyright}` : 'Image: NASA APOD' }}
          source="NASA APOD"
        />
      ) : null}

      <BestRuns board={leaderboard} thisRun={lastSavedRun} />

      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ['Crew Mode', 'Next time, you and your friends each take one of these roles.'],
          ['More worlds', 'New missions beyond Mars.'],
        ].map(([t, d]) => (
          <div key={t} className="rounded-panel border-[3px] border-dashed border-ink bg-locked p-4 text-ink">
            <p className="flex items-center gap-2 font-display text-xl font-extrabold">
              <span className="grid h-9 w-9 place-items-center rounded-full border-[3px] border-ink bg-paper">
                <Lock size={18} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </p>
            <p className="mt-1 text-lg">{d} Coming soon.</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <GameButton variant="go" icon={Rocket} onClick={() => startMission()}>
          Fly again
        </GameButton>
        <GameButton variant="plain" icon={House} onClick={goHome}>
          Home
        </GameButton>
      </div>
    </Scene>
  );
}
