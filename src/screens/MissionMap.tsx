// Mission map (BUILD_SEQUENCE.md A4, restyled in G2, re-laid for the landscape stage in R4):
// a trail running left to right, from Earth to the Mars outpost. Stops are chunky round nodes; your kid
// stands beside the current one; earned badges sit on finished ones. The row height never changes:
// a finished stop's "I learned" line and the locked note show in one panel under the trail.
// The trail scrolls sideways only if it must. Every stop says its state to screen readers too.
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

/** One horizontal trail segment. Solid = travelled, dotted = still ahead. */
function Rail({ travelled, hidden }: { travelled: boolean; hidden?: boolean }) {
  return (
    <svg className="h-[0.75rem] min-w-[0.5rem] flex-1" preserveAspectRatio="none" viewBox="0 0 10 8" aria-hidden style={{ visibility: hidden ? 'hidden' : 'visible' }}>
      <line
        x1="0"
        y1="4"
        x2="10"
        y2="4"
        stroke="var(--color-text)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={travelled ? undefined : '1 10'}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A chunky planet-like node with a lip. Dark, no ink. */
function Node({ state, children, bounce }: { state: State | 'start' | 'goal' | 'teaser'; children: ReactNode; bounce?: number }) {
  const look: Record<typeof state, string> = {
    done: 'h-[3rem] w-[3rem] bg-panel text-text text-[1.375rem]',
    current: 'h-[3.75rem] w-[3.75rem] bg-go text-go-text text-[1.75rem] border-go-lip [--lip:var(--color-go-lip)]',
    locked: 'h-[2.75rem] w-[2.75rem] bg-locked text-muted text-[1.375rem] [--lip:var(--color-locked-lip)]',
    start: 'h-[3rem] w-[3rem] bg-sky-earth text-text text-[1.375rem] [--lip:#163f94]',
    goal: 'h-[3rem] w-[3rem] bg-panel text-text text-[1.375rem]',
    teaser: 'h-[2.5rem] w-[2.5rem] bg-locked text-muted text-[1.375rem] [--lip:var(--color-locked-lip)]',
  };
  return (
    <div key={bounce} className={`toy !mb-[0.45rem] relative grid shrink-0 place-items-center rounded-full font-display font-extrabold ${look[state]} ${bounce ? 'anim-pop' : ''}`}>
      {children}
      {state === 'done' ? (
        <span className="absolute -top-[0.5rem] -right-[0.5rem] grid h-[1.5rem] w-[1.5rem] place-items-center rounded-full border-2 border-line bg-star text-go-text">
          <Award size={14} strokeWidth={3} aria-hidden />
        </span>
      ) : null}
    </div>
  );
}

/**
 * One stop on the trail: the node on the line (with the segments either side), and its label under it.
 * `kid` stands on the trail just left of the node.
 */
function Stop({
  node,
  before,
  after,
  wide,
  kid,
  innerRef,
  children,
}: {
  node: ReactNode;
  /** The segment coming in: travelled, ahead, or none (the first stop). */
  before: boolean | null;
  /** The segment going out. */
  after: boolean | null;
  wide?: boolean;
  kid?: ReactNode;
  innerRef?: React.Ref<HTMLLIElement>;
  children: ReactNode;
}) {
  return (
    <li ref={innerRef} className={`flex shrink-0 flex-col items-center gap-[0.25rem] ${wide ? 'w-[8.5rem]' : 'w-[6.5rem]'}`}>
      <div className="flex h-[4.25rem] w-full items-center">
        <Rail travelled={!!before} hidden={before === null} />
        <span className="relative flex shrink-0">
          {kid ? <span className="pointer-events-none absolute right-[85%] -bottom-[0.25rem]">{kid}</span> : null}
          {node}
        </span>
        <Rail travelled={!!after} hidden={after === null} />
      </div>
      <div className="flex w-full justify-center px-[0.25rem]">{children}</div>
    </li>
  );
}

/** A plain label under a stop that isn't a level. */
function StopLabel({ children, dashed }: { children: ReactNode; dashed?: boolean }) {
  return (
    <p
      className={`w-full rounded-[0.75rem] border-2 bg-panel/85 px-[0.5rem] py-[0.25rem] text-center font-display text-[0.9375rem] leading-tight font-bold ${
        dashed ? 'border-dashed border-line text-muted' : 'border-line text-text'
      }`}
    >
      {children}
    </p>
  );
}

function StopCard({
  st,
  label,
  onClick,
  expanded,
  controls,
  children,
}: {
  st: State;
  label: string;
  onClick: () => void;
  expanded?: boolean;
  controls?: string;
  children: ReactNode;
}) {
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-disabled={st === 'locked' || undefined}
      {...press}
      className={`toy relative w-full rounded-tile px-[0.5rem] py-[0.375rem] text-left text-text ${
        st === 'current' ? 'border-go bg-panel-up [--lip:var(--color-go-lip)]' : st === 'done' ? (expanded ? 'border-go bg-panel-up' : 'bg-panel') : ''
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
  const trailRef = useRef<HTMLOListElement>(null);
  const hereRef = useRef<HTMLLIElement>(null);

  // Scroll the trail (and only the trail) so the current stop is in the middle.
  useEffect(() => {
    const ol = trailRef.current;
    const here = hereRef.current;
    if (!ol || !here) return;
    ol.scrollLeft = here.offsetLeft - (ol.clientWidth - here.offsetWidth) / 2;
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
    else {
      // The note takes the panel under the trail, so a learned line there closes.
      setOpen(null);
      setNote(`Level ${i + 1} is locked. Finish level ${current + 1} first.`);
    }
  };

  const learned = open !== null ? LEVELS[open] : null;

  return (
    <Scene bare place="mars" rail={<Dock />}>
      <div className="flex min-h-0 flex-1 flex-col gap-[0.375rem] px-[0.75rem] pt-[0.5rem] pb-[0.5rem]">
        {/* Top row: Home, the title and progress, the stars. */}
        <header className="flex items-center gap-[0.625rem]">
          <RoundButton icon={House} label="Home" onClick={() => go('home')} className="!mb-[0.3rem] !h-[2.75rem] !w-[2.75rem]" />
          <div className="min-w-0 flex-1">
            <div className="w-fit max-w-full rounded-[1rem] bg-panel/85 px-[0.75rem] py-[0.25rem] text-text">
              <h1 className="font-display text-[1.5rem] leading-none font-extrabold">Mission map</h1>
              <p className="font-display text-[0.9375rem] leading-snug font-bold">
                {finished ? 'Mission complete! All six badges earned.' : `${badges.length} of ${LEVELS.length} badges. From Earth to the Mars outpost.`}
              </p>
            </div>
          </div>
          <StarCounter n={game.stars} />
        </header>

        {/* The trail: one row, left to right. Scrolls sideways only if it must. */}
        <div className="flex min-h-0 flex-1 items-center">
          <ol
            ref={trailRef}
            className="relative flex max-h-full w-full items-start overflow-x-auto overflow-y-hidden pt-[2.25rem] pb-[0.25rem]"
            style={{ scrollbarWidth: 'none' }}
            aria-label="Mission stops, from Earth to Mars"
          >
            <Stop
              before={null}
              after={travelled(0)}
              node={
                <Node state="start">
                  <Globe size={26} strokeWidth={2.5} aria-hidden />
                </Node>
              }
            >
              <StopLabel>Earth · start</StopLabel>
            </Stop>

            {LEVELS.map((l, i) => {
              const st = stateOf(i);
              const label = `Level ${l.id}, ${l.title}, ${st === 'done' ? 'badge earned' : st === 'current' ? 'you are here' : 'locked'}`;
              return (
                <Stop
                  key={l.id}
                  wide
                  before={travelled(i)}
                  after={travelled(i + 1)}
                  innerRef={st === 'current' ? hereRef : undefined}
                  kid={st === 'current' ? <Kid who="orbit" pose="point" height="5.5rem" className="max-w-none" /> : undefined}
                  node={
                    <Node state={st} bounce={st === 'current' ? bounce : undefined}>
                      {st === 'locked' ? <Lock size={18} strokeWidth={3} aria-hidden /> : l.id}
                    </Node>
                  }
                >
                  <StopCard st={st} label={label} onClick={() => press(i)} expanded={st === 'done' ? open === i : undefined} controls={st === 'done' ? 'map-detail' : undefined}>
                    {st === 'current' ? (
                      <span className="mb-[0.125rem] inline-block rounded-full bg-go px-[0.5rem] font-display text-[0.8125rem] leading-snug font-extrabold text-go-text">
                        {inProgress ? 'You are here' : 'Start here'}
                      </span>
                    ) : null}
                    <span className="block font-display text-[1rem] leading-[1.1] font-extrabold">{l.title}</span>
                    <span className="block text-[0.8125rem] leading-tight text-muted">{l.place}</span>
                  </StopCard>
                </Stop>
              );
            })}

            <Stop
              wide
              before={finished}
              after={false}
              innerRef={finished ? hereRef : undefined}
              node={
                <Node state="goal">
                  <Flag size={24} strokeWidth={2.5} aria-hidden />
                </Node>
              }
            >
              <StopLabel>The Mars outpost · Sol 500</StopLabel>
            </Stop>
            {['Crew Mode', 'More worlds'].map((t, k) => (
              <Stop
                key={t}
                before={false}
                after={k ? null : false}
                node={
                  <Node state="teaser">
                    <Lock size={16} strokeWidth={3} aria-hidden />
                  </Node>
                }
              >
                <StopLabel dashed>
                  {t} <span className="font-sans text-[0.8125rem] font-normal">— coming soon</span>
                </StopLabel>
              </Stop>
            ))}
          </ol>
        </div>

        {/* Under the trail: the locked note, or a finished stop's "I learned" line. Fixed height, so the trail never moves. */}
        <div id="map-detail" className="flex min-h-[3.25rem] shrink-0 items-center">
          {note ? (
            <p role="status" className="anim-pop-in flex w-full items-center gap-[0.5rem] rounded-[1rem] border-2 border-line bg-panel/85 px-[0.75rem] py-[0.375rem] font-display text-[1rem] leading-snug font-bold text-text">
              <Lock size={18} strokeWidth={3} aria-hidden className="shrink-0 text-muted" />
              {note}
            </p>
          ) : learned ? (
            <p key={learned.id} className="anim-pop-in flex w-full items-center gap-[0.5rem] rounded-[1rem] border-2 border-line bg-panel/85 px-[0.75rem] py-[0.375rem] text-[1rem] leading-snug text-text">
              <span className="grid h-[1.75rem] w-[1.75rem] shrink-0 place-items-center rounded-full border-2 border-line bg-star text-go-text" aria-hidden>
                <Award size={14} strokeWidth={3} />
              </span>
              <span className="min-w-0">“{learned.learned}”</span>
            </p>
          ) : null}
        </div>
      </div>
    </Scene>
  );
}
