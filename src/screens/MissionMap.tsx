// Mission map (BUILD_SEQUENCE.md A4): a path from Earth (bottom) to the Mars outpost (top).
// Progress should be obvious at a glance; every stop says its state to screen readers too.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Award, Flag, Globe, Home as HomeIcon, Lock } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Sky, Stars } from '../components/ui';
import { LEVELS } from '../content/levels';
import { missionInProgress, useGame } from '../store/game';

type State = 'done' | 'current' | 'locked';

/** One vertical rail segment. Solid = travelled, dashed = still ahead. */
function Rail({ travelled, hidden }: { travelled: boolean; hidden?: boolean }) {
  return (
    <svg className="w-1 flex-1" preserveAspectRatio="none" viewBox="0 0 4 10" aria-hidden style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      <line x1="2" y1="0" x2="2" y2="10" stroke="var(--color-paper)" strokeWidth="4" strokeDasharray={travelled ? undefined : '2 2'} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/**
 * One row of the map: a rail column with the stop's disc, and the stop's card.
 * On laptops the cards zigzag left and right of a centred rail; on phones the rail is on the left.
 */
function Row({
  side,
  disc,
  below,
  above,
  children,
}: {
  side: 'left' | 'right';
  disc: ReactNode;
  below: boolean | null; // null = no segment (end of path)
  above: boolean | null;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[56px_1fr] gap-x-3 sm:grid-cols-[1fr_64px_1fr]">
      <div className="col-start-1 row-start-1 flex flex-col items-center sm:col-start-2">
        <Rail travelled={!!above} hidden={above === null} />
        <div className="py-1">{disc}</div>
        <Rail travelled={!!below} hidden={below === null} />
      </div>
      <div className={`col-start-2 row-start-1 flex items-center py-2 ${side === 'left' ? 'sm:col-start-1 sm:justify-end' : 'sm:col-start-3'}`}>{children}</div>
    </li>
  );
}

function Disc({ state, children }: { state: State | 'start' | 'goal' | 'teaser'; children: ReactNode }) {
  const look: Record<typeof state, string> = {
    done: 'h-12 w-12 bg-paper text-ink border-2 border-ink',
    current: 'h-14 w-14 bg-paper text-ink border-[3px] border-ink ring-4 ring-paper',
    locked: 'h-11 w-11 bg-sky-mars text-paper border-2 border-dashed border-paper',
    start: 'h-12 w-12 bg-sky-earth text-paper border-2 border-paper',
    goal: 'h-12 w-12 bg-paper text-ink border-2 border-ink',
    teaser: 'h-10 w-10 bg-sky-mars text-paper border-2 border-dashed border-paper/70',
  };
  return <div className={`flex items-center justify-center rounded-full font-display text-xl font-extrabold ${look[state]}`}>{children}</div>;
}

export function MissionMap() {
  const { levelIndex, badges, game, startMission, go } = useGame();
  const inProgress = useGame(missionInProgress);
  const finished = badges.length >= LEVELS.length;
  // Which stop is "you are here": the level in play, or level 1 before any mission starts.
  const current = finished ? -1 : inProgress ? levelIndex : 0;
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const hereRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    hereRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  const stateOf = (i: number): State => (badges.includes(LEVELS[i].id) && i !== current ? 'done' : i === current ? 'current' : 'locked');
  const travelled = (i: number) => i <= current || finished; // segment leading up to stop i

  const press = (i: number) => {
    const st = stateOf(i);
    setNote(null);
    if (st === 'current') {
      if (inProgress) go('level');
      else startMission();
    } else if (st === 'done') setOpen(open === i ? null : i);
    else setNote(`Level ${i + 1} is locked. Finish level ${current + 1} first.`);
  };

  // Rows are listed in DOM order from Earth upward (good tab order), then shown bottom-to-top.
  return (
    <Sky place="mars" nav={<BottomNav />}>
      <header className="flex items-center justify-between gap-3">
        <button onClick={() => go('home')} className="inline-flex min-h-11 items-center gap-1 rounded-btn font-display font-bold">
          <HomeIcon size={20} strokeWidth={2} aria-hidden /> Home
        </button>
        <span className="rounded-btn bg-paper px-3 py-1 text-ink">
          <Stars n={game.stars} />
        </span>
      </header>
      <div>
        <h1 className="font-display text-[30px] leading-tight font-extrabold sm:text-[36px]">Mission map</h1>
        <p className="text-xl font-bold">
          {finished ? 'Mission complete! All six badges earned.' : `${badges.length} of ${LEVELS.length} badges. From Earth to the Mars outpost.`}
        </p>
      </div>

      {note ? (
        <p role="status" className="rounded-btn bg-paper px-4 py-2 font-bold text-ink">
          {note}
        </p>
      ) : null}

      <ol className="flex flex-col-reverse" aria-label="Mission stops, from Earth to Mars">
        <Row side="right" below={null} above={travelled(0)} disc={<Disc state="start"><Globe size={24} strokeWidth={2} aria-hidden /></Disc>}>
          <p className="font-display text-xl font-bold">Earth · start</p>
        </Row>

        {LEVELS.map((l, i) => {
          const st = stateOf(i);
          const label = `Level ${l.id}, ${l.title}, ${st === 'done' ? 'badge earned' : st === 'current' ? 'you are here' : 'locked'}`;
          return (
            <Row key={l.id} side={i % 2 ? 'left' : 'right'} below={travelled(i)} above={travelled(i + 1)} disc={<Disc state={st}>{st === 'locked' ? <Lock size={18} strokeWidth={2.5} aria-hidden /> : l.id}</Disc>}>
              <button
                ref={st === 'current' ? hereRef : undefined}
                onClick={() => press(i)}
                aria-label={label}
                aria-expanded={st === 'done' ? open === i : undefined}
                aria-disabled={st === 'locked' || undefined}
                className={`w-full max-w-sm rounded-btn border-2 p-3 text-left text-ink transition ${
                  st === 'current' ? 'border-ink bg-paper shadow-card' : st === 'done' ? 'border-ink bg-paper' : 'border-paper/60 bg-paper/75'
                }`}
              >
                {st === 'current' ? (
                  <span className="mb-1 inline-block rounded-md bg-ink px-2 py-0.5 text-sm font-extrabold text-paper">{inProgress ? 'You are here' : 'Start here'}</span>
                ) : null}
                <span className="flex items-center gap-2 font-display text-lg leading-tight font-bold">
                  {l.title}
                  {st === 'done' ? <Award size={20} strokeWidth={2} aria-hidden className="shrink-0" /> : null}
                </span>
                <span className="block text-base text-muted">{l.place}</span>
                {st === 'done' && open === i ? <span className="mt-2 block border-t-2 border-edge pt-2">“{l.learned}”</span> : null}
              </button>
            </Row>
          );
        })}

        <Row side="right" below={finished} above={false} disc={<Disc state="goal"><Flag size={22} strokeWidth={2} aria-hidden /></Disc>}>
          <p className="font-display text-xl font-bold">The Mars outpost · Sol 500</p>
        </Row>
        {['Crew Mode', 'More worlds'].map((t, k) => (
          <Row key={t} side={k ? 'right' : 'left'} below={false} above={k ? null : false} disc={<Disc state="teaser"><Lock size={16} strokeWidth={2.5} aria-hidden /></Disc>}>
            <p className="rounded-btn border-2 border-dashed border-ink/50 bg-paper/75 px-3 py-2 font-bold text-ink">
              {t} <span className="font-normal">— coming soon</span>
            </p>
          </Row>
        ))}
      </ol>
    </Sky>
  );
}
