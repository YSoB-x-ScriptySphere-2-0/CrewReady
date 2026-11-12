// Mission map (BUILD_SEQUENCE.md A4, restyled in G2, re-laid for the landscape stage in R4):
// a trail running left to right, from Earth to the Mars outpost. Stops are chunky round nodes; your kid
// stands beside the current one; earned badges sit on finished ones.
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
import { t, tMission, useI18n } from '../content/i18n';

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

/** One stop on the trail */
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
  before: boolean | null;
  after: boolean | null;
  wide?: boolean;
  kid?: ReactNode;
  innerRef?: React.Ref<HTMLLIElement>;
  children: ReactNode;
}) {
  return (
    <li ref={innerRef} className={`flex shrink-0 flex-col items-center gap-[0.25rem] ${wide ? 'w-[8.5rem] sm:w-[9.5rem]' : 'w-[6.5rem]'}`}>
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
      className={`w-full rounded-[0.75rem] border-2 bg-panel/85 px-[0.5rem] py-[0.25rem] text-center font-display text-[0.875rem] sm:text-[0.9375rem] leading-snug font-bold break-words ${
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
      className={`toy relative w-full rounded-tile px-[0.5rem] py-[0.375rem] text-left text-text overflow-hidden ${
        st === 'current' ? 'border-go bg-panel-up [--lip:var(--color-go-lip)]' : st === 'done' ? (expanded ? 'border-go bg-panel-up' : 'bg-panel') : ''
      }`}
    >
      {children}
    </button>
  );
}

export function MissionMap() {
  const { levelIndex, badges, game, startMission, go } = useGame();
  const lang = useI18n((s) => s.lang);
  const inProgress = useGame(missionInProgress);
  const finished = badges.length >= LEVELS.length;
  const current = finished ? -1 : inProgress ? levelIndex : 0;
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [bounce, setBounce] = useState(0);
  const trailRef = useRef<HTMLOListElement>(null);
  const hereRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const ol = trailRef.current;
    const here = hereRef.current;
    if (!ol || !here) return;
    ol.scrollLeft = here.offsetLeft - (ol.clientWidth - here.offsetWidth) / 2;
  }, []);

  const stateOf = (i: number): State => (badges.includes(LEVELS[i].id) && i !== current ? 'done' : i === current ? 'current' : 'locked');
  const travelled = (i: number) => i <= current || finished;

  const press = (i: number) => {
    const st = stateOf(i);
    setNote(null);
    if (st === 'current') {
      setBounce((b) => b + 1);
      setTimeout(() => (inProgress ? go('level') : startMission()), reducedMotion() ? 0 : 320);
    } else if (st === 'done') setOpen(open === i ? null : i);
    else {
      setOpen(null);
      setNote(
        lang === 'bn'
          ? `লেভেল ${i + 1} লক করা। আগে লেভেল ${current + 1} সম্পন্ন করো!`
          : `Level ${i + 1} is locked. Complete level ${current + 1} first!`
      );
    }
  };

  const learned = open !== null ? LEVELS[open] : null;

  return (
    <Scene bare place="mars" rail={<Dock />}>
      <div className="flex min-h-0 flex-1 flex-col gap-[0.375rem] px-[0.75rem] pt-[0.5rem] pb-[0.5rem]">
        {/* Top row: Home, title and progress, stars */}
        <header className="flex items-center gap-[0.625rem]">
          <RoundButton icon={House} label={t('nav.home')} onClick={() => go('home')} className="!mb-[0.3rem] !h-[2.75rem] !w-[2.75rem]" />
          <div className="min-w-0 flex-1">
            <div className="w-fit max-w-full rounded-[1rem] bg-panel/85 px-[0.75rem] py-[0.25rem] text-text">
              <h1 className="font-display text-[1.25rem] sm:text-[1.5rem] leading-none font-extrabold">{t('map.title')}</h1>
              <p className="font-display text-[0.875rem] sm:text-[0.9375rem] leading-snug font-bold">
                {finished
                  ? (lang === 'bn' ? 'মিশন সম্পন্ন! ৬টি ব্যাজই অর্জিত।' : 'Mission complete! All six badges earned.')
                  : (lang === 'bn'
                      ? `${badges.length} / ${LEVELS.length} ব্যাজ অর্জিত। পৃথিবী থেকে মঙ্গল ঘাঁটি পর্যন্ত যাত্রা।`
                      : `${badges.length} of ${LEVELS.length} badges. From Earth to the Mars outpost.`)}
              </p>
            </div>
          </div>
          <StarCounter n={game.stars} />
        </header>

        {/* The trail */}
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
              <StopLabel>{lang === 'bn' ? 'পৃথিবী · শুরু' : 'Earth · Start'}</StopLabel>
            </Stop>

            {LEVELS.map((l, i) => {
              const st = stateOf(i);
              const title = tMission(t(`level${l.id}.title`) || l.title);
              const place = tMission(t(`level${l.id}.place`) || l.place);
              const label = `Level ${l.id}, ${title}, ${st === 'done' ? 'badge earned' : st === 'current' ? 'you are here' : 'locked'}`;

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
                      <span className="mb-[0.125rem] inline-block rounded-full bg-go px-[0.5rem] font-display text-[0.75rem] sm:text-[0.8125rem] leading-snug font-extrabold text-go-text">
                        {inProgress ? t('map.youAreHere') : t('map.startHere')}
                      </span>
                    ) : null}
                    <span className="block font-display text-[0.875rem] sm:text-[0.9375rem] leading-snug font-extrabold break-words line-clamp-2">{title}</span>
                    <span className="block text-[0.75rem] sm:text-[0.8125rem] leading-tight text-muted break-words">{place}</span>
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
              <StopLabel>{t('map.goal')}</StopLabel>
            </Stop>

            {['Crew Mode', 'More worlds'].map((tk, k) => (
              <Stop
                key={tk}
                before={false}
                after={k ? null : false}
                node={
                  <Node state="teaser">
                    <Lock size={16} strokeWidth={3} aria-hidden />
                  </Node>
                }
              >
                <StopLabel dashed>
                  {tk} <span className="font-sans text-[0.75rem] font-normal">{lang === 'bn' ? '— শীঘ্রই আসছে' : '— coming soon'}</span>
                </StopLabel>
              </Stop>
            ))}
          </ol>
        </div>

        {/* Under the trail: locked note or learned line */}
        <div id="map-detail" className="flex min-h-[3.25rem] shrink-0 items-center">
          {note ? (
            <p role="status" className="anim-pop-in flex w-full items-center gap-[0.5rem] rounded-[1rem] border-2 border-line bg-panel/85 px-[0.75rem] py-[0.375rem] font-display text-[0.9375rem] sm:text-[1rem] leading-snug font-bold text-text">
              <Lock size={18} strokeWidth={3} aria-hidden className="shrink-0 text-muted" />
              {note}
            </p>
          ) : learned ? (
            <div role="status" className="anim-pop-in flex w-full items-center justify-between gap-[0.5rem] rounded-[1rem] border-2 border-line bg-panel/85 px-[0.75rem] py-[0.375rem] text-text">
              <div className="flex items-center gap-[0.5rem] min-w-0">
                <span className="grid h-[2rem] w-[2rem] shrink-0 place-items-center rounded-full bg-star text-go-text">
                  <Award size={18} strokeWidth={2.5} aria-hidden />
                </span>
                <span className="font-display text-[0.875rem] sm:text-[0.9375rem] leading-snug font-bold break-words">
                  {tMission(t(`level${learned.id}.teaches`) || learned.learned)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs font-bold text-muted hover:text-text"
              >
                {t('btn.close')}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </Scene>
  );
}
