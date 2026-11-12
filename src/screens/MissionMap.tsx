// Mission map (BUILD_SEQUENCE.md A4, restyled in G2): a trail from Earth (bottom) to the Mars outpost (top).
// Stops are chunky round nodes; your kid stands on the current one; earned badges sit on finished ones.
// Progress is obvious at a glance, and every stop says its state to screen readers too.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Award, Flag, Globe, House, Lock } from 'lucide-react';
import { Dock } from '../components/Dock';
import { RoundButton } from '../components/GameButton';
import { StarCounter } from '../components/Hud';
import { reducedMotion, usePress } from '../components/motion';
import { Scene } from '../components/Scene';
import { Kid } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { missionInProgress, useGame } from '../store/game';

type State = 'done' | 'current' | 'locked';

/** One vertical trail segment. Solid = travelled, dotted = still ahead. */
function Rail({ travelled, hidden }: { travelled: boolean; hidden?: boolean }) {
  return (
    <svg className="w-2 flex-1" preserveAspectRatio="none" viewBox="0 0 8 10" aria-hidden style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      <line
        x1="4"
        y1="0"
        x2="4"
        y2="10"
        stroke="var(--color-paper)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={travelled ? undefined : '1 10'}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * One row of the map: a trail column with the stop's node, and the stop's card.
 * On laptops the cards zigzag left and right of a centred trail; on phones the trail is on the left.
 */
function Row({ side, node, below, above, children }: { side: 'left' | 'right'; node: ReactNode; below: boolean | null; above: boolean | null; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[72px_1fr] gap-x-2 sm:grid-cols-[1fr_84px_1fr]">
      <div className="col-start-1 row-start-1 flex flex-col items-center sm:col-start-2">
        <Rail travelled={!!above} hidden={above === null} />
        <div className="py-1">{node}</div>
        <Rail travelled={!!below} hidden={below === null} />
      </div>
      <div className={`col-start-2 row-start-1 flex items-center py-2 ${side === 'left' ? 'sm:col-start-1 sm:justify-end' : 'sm:col-start-3'}`}>{children}</div>
    </li>
  );
}

/** A chunky planet-like node with a lip. */
function Node({ state, children, bounce }: { state: State | 'start' | 'goal' | 'teaser'; children: ReactNode; bounce?: number }) {
  const look: Record<typeof state, string> = {
    done: 'h-14 w-14 bg-paper text-ink',
    current: 'h-[68px] w-[68px] bg-go text-white text-[30px] [--lip:var(--color-go-lip)]',
    locked: 'h-12 w-12 bg-locked text-muted [--lip:var(--color-locked-lip)]',
    start: 'h-14 w-14 bg-sky-earth text-paper [--lip:#163f94]',
    goal: 'h-14 w-14 bg-paper text-ink',
    teaser: 'h-11 w-11 bg-locked text-muted [--lip:var(--color-locked-lip)]',
  };
  return (
    <div key={bounce} className={`toy !mb-[7px] relative grid place-items-center rounded-full font-display text-2xl font-extrabold ${look[state]} ${bounce ? 'anim-pop' : ''}`}>
      {children}
      {state === 'done' ? (
        <span className="absolute -top-2 -right-2 grid h-7 w-7 place-items-center rounded-full border-[3px] border-ink bg-star text-ink">
          <Award size={15} strokeWidth={3} aria-hidden />
        </span>
      ) : null}
    </div>
  );
}

function StopCard({
  st,
  label,
  onClick,
  expanded,
  innerRef,
  children,
}: {
  st: State;
  label: string;
  onClick: () => void;
  expanded?: boolean;
  innerRef?: React.Ref<HTMLButtonElement>;
  children: ReactNode;
}) {
  const press = usePress();
  return (
    <button
      ref={innerRef}
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-disabled={st === 'locked' || undefined}
      {...press}
      className={`toy relative w-full max-w-sm rounded-tile p-3 text-left text-ink ${
        st === 'current' ? 'bg-paper [--lip:var(--color-go-lip)]' : st === 'done' ? 'bg-paper' : 'bg-locked [--lip:var(--color-locked-lip)]'
      }`}
    >
      {children}
    </button>
  );
}

export function MissionMap() {
  const { levelIndex, badges, game, startMission, go } = useGame();
  const inProgress = useGame(missionInProgress);
  const finished = badges.length >= LEVELS.length;
  // Which stop is "you are here": the level in play, or level 1 before any mission starts.
  const current = finished ? -1 : inProgress ? levelIndex : 0;
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [bounce, setBounce] = useState(0);
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
      // The node bounces, then the level opens.
      setBounce((b) => b + 1);
      setTimeout(() => (inProgress ? go('level') : startMission()), reducedMotion() ? 0 : 320);
    } else if (st === 'done') setOpen(open === i ? null : i);
    else setNote(`Level ${i + 1} is locked. Finish level ${current + 1} first.`);
  };

  // Rows are listed in DOM order from Earth upward (good tab order), then shown bottom-to-top.
  return (
    <Scene place="mars" bottom={<Dock />}>
      <header className="flex items-center justify-between gap-3">
        <RoundButton icon={House} label="Home" onClick={() => go('home')} />
        <StarCounter n={game.stars} />
      </header>
      <div>
        <h1 className="font-display text-[34px] leading-tight font-extrabold sm:text-[40px]">Mission map</h1>
        <p className="font-display text-xl font-bold">
          {finished ? 'Mission complete! All six badges earned.' : `${badges.length} of ${LEVELS.length} badges. From Earth to the Mars outpost.`}
        </p>
      </div>

      {note ? (
        <p role="status" className="anim-pop-in rounded-tile border-[3px] border-ink bg-paper px-4 py-2 font-display text-lg font-bold text-ink">
          {note}
        </p>
      ) : null}

      <ol className="flex flex-col-reverse" aria-label="Mission stops, from Earth to Mars">
        <Row side="right" below={null} above={travelled(0)} node={<Node state="start"><Globe size={28} strokeWidth={2.5} aria-hidden /></Node>}>
          <p className="font-display text-xl font-extrabold">Earth · start</p>
        </Row>

        {LEVELS.map((l, i) => {
          const st = stateOf(i);
          const label = `Level ${l.id}, ${l.title}, ${st === 'done' ? 'badge earned' : st === 'current' ? 'you are here' : 'locked'}`;
          return (
            <Row
              key={l.id}
              side={i % 2 ? 'left' : 'right'}
              below={travelled(i)}
              above={travelled(i + 1)}
              node={
                <Node state={st} bounce={st === 'current' ? bounce : undefined}>
                  {st === 'locked' ? <Lock size={20} strokeWidth={3} aria-hidden /> : l.id}
                </Node>
              }
            >
              <StopCard st={st} label={label} onClick={() => press(i)} expanded={st === 'done' ? open === i : undefined} innerRef={st === 'current' ? hereRef : undefined}>
                <span className="flex items-center gap-2">
                  <span className="min-w-0 flex-1">
                    {st === 'current' ? (
                      <span className="mb-1 inline-block rounded-full border-2 border-ink bg-go px-2.5 font-display text-base leading-snug font-extrabold text-white">
                        {inProgress ? 'You are here' : 'Start here'}
                      </span>
                    ) : null}
                    <span className="block font-display text-xl leading-tight font-extrabold">{l.title}</span>
                    <span className="block text-base text-muted">{l.place}</span>
                  </span>
                  {st === 'current' ? <Kid who="orbit" pose="point" height={74} className="-my-2 -scale-x-100" /> : null}
                </span>
                {st === 'done' && open === i ? <span className="mt-2 block border-t-2 border-edge pt-2 text-lg">“{l.learned}”</span> : null}
              </StopCard>
            </Row>
          );
        })}

        <Row side="right" below={finished} above={false} node={<Node state="goal"><Flag size={26} strokeWidth={2.5} aria-hidden /></Node>}>
          <p className="font-display text-xl font-extrabold">The Mars outpost · Sol 500</p>
        </Row>
        {['Crew Mode', 'More worlds'].map((t, k) => (
          <Row key={t} side={k ? 'right' : 'left'} below={false} above={k ? null : false} node={<Node state="teaser"><Lock size={18} strokeWidth={3} aria-hidden /></Node>}>
            <p className="rounded-tile border-[3px] border-dashed border-ink bg-locked px-3 py-2 font-display text-lg font-bold text-ink">
              {t} <span className="font-sans text-base font-normal">— coming soon</span>
            </p>
          </Row>
        ))}
      </ol>
    </Scene>
  );
}
