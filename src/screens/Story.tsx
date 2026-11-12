// The story cards (BUILD_SEQUENCE.md A2, restyled in G2): three FICTION comic panels from plan §4.2
// (shortened 12 Nov 2026 to read aloud in ~25 s), with one real NASA data card as the bridge from fiction to fact.
// Landscape (R4): one comic panel at a time, the picture on the left, the words and Next on the right.
// Card 1 carries the NeoWs counter over its picture. Nothing scrolls.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Rocket, SkipForward } from 'lucide-react';
import { GameButton, RoundButton } from '../components/GameButton';
import { useCountTo } from '../components/motion';
import { Badge, Panel, SourceLine } from '../components/Panel';
import { isStageTurned, stageDelta } from '../components/stageMath';
import { Scene, type ScenePlace } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
import neows from '../content/samples/neows.json';
import { useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';

const CARDS: { title: string; body: ReactNode; place: ScenePlace; picture: ReactNode }[] = [
  {
    title: 'The Near Miss',
    body: 'An asteroid flew at Earth. Most of it was pushed away. One piece hit the ocean. Its dust dimmed the Sun for a year.',
    place: 'space',
    // Twinkle's size is in px; the wrapper sizes it in rem so it scales with the stage.
    // Small enough to stand clear of the NeoWs counter laid over the top of this picture.
    picture: (
      <span className="block [&_img]:!h-[6rem]">
        <Twinkle mood="surprised" size={120} />
      </span>
    ),
  },
  {
    title: 'The Lesson',
    body: 'Earth is healing. But we learned that one planet is not enough.',
    place: 'earth',
    picture: <Kid who="nova" pose="think" height="13rem" />,
  },
  {
    title: 'Your Mission',
    body: (
      <>
        Mission Control starts the <strong>Mars Continuity Programme</strong>. Fly to Mars and build a base. Keep it going for 500 sols — Mars days. You are
        the commander.
      </>
    ),
    place: 'mars',
    picture: (
      <span className="flex items-end gap-[1rem]">
        <Kid who="nova" pose="arms" height="12.5rem" />
        <Kid who="orbit" pose="arms" height="12.5rem" />
      </span>
    ),
  },
];


/** A number that ticks up from 0 when the card opens. */
function CountUp({ to }: { to: number }) {
  const [target, setTarget] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setTarget(to), 250);
    return () => clearTimeout(t);
  }, [to]);
  return <>{useCountTo(target, 1200)}</>;
}

/** Planetary defense readout with the real NASA tracking count. Dark, still (no beacon). */
function AsteroidRadarFigure({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-start gap-[0.25rem]">
      <div className="flex items-center gap-[0.5rem] rounded-full border-2 border-line bg-panel-up px-[0.75rem] py-[0.0625rem] font-display text-[0.8125rem] font-extrabold tracking-wider text-text uppercase">
        <span className="inline-flex h-[0.625rem] w-[0.625rem] rounded-full bg-good" aria-hidden />
        <span>Planetary Defense Radar</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-[0.5rem] gap-y-[0.25rem]">
        <span className="font-display text-[2rem] leading-none font-extrabold text-text tabular-nums">
          <CountUp to={count} />
        </span>
        <span className="font-display text-[1.25rem] font-bold text-muted">tracked</span>
        <span className="rounded-[0.5rem] border-2 border-line bg-space-deep px-[0.5rem] font-display text-[1rem] font-bold text-text">None will hit us.</span>
      </div>
    </div>
  );
}

/**
 * The NeoWs counter, laid over card 1's picture: the radar figure, the badge, the date and the source line.
 * The full sentence of the old Intel card is kept for screen readers.
 */
function NeowsStrip() {
  // Live data once it arrives; until then the saved sample, always badged ARCHIVE with its own date.
  const res = useSpace((s) => s.neows);
  const count = res?.data.count ?? neows.count;
  const badge = res?.badge ?? 'NASA ARCHIVE';
  const fetched = fmtDate(res?.fetchedAt ?? neows.fetchedAt);
  return (
    <article aria-label="Planetary Defense" className="rounded-[1rem] border-2 border-line bg-panel/85 p-[0.5rem] text-text">
      <AsteroidRadarFigure count={count} />
      <p className="sr-only">{`NASA's Planetary Defense Coordination Office is tracking ${count} near-Earth asteroids this week. None will hit us.`}</p>
      <div className="mt-[0.375rem] flex flex-wrap items-center gap-x-[0.5rem] gap-y-[0.125rem]">
        <Badge kind={badge} />
        <span className="text-[0.8125rem] font-bold text-muted">{badge === 'NASA LIVE' ? 'From NASA, just now' : `Real NASA data from ${fetched}`}</span>
      </div>
      <div className="mt-[0.25rem]">
        <SourceLine text={`NASA NeoWs (Near Earth Object Web Service) · ${badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'} · ${fetched}`} bare />
      </div>
    </article>
  );
}

export function Story() {
  const go = useGame((s) => s.go);
  const [i, setI] = useState(0);
  const last = i === CARDS.length - 1;
  const next = () => (last ? go('home') : setI(i + 1));
  const back = () => setI((n) => Math.max(0, n - 1));
  const forward = () => setI((n) => Math.min(CARDS.length - 1, n + 1));

  // Arrow keys move between cards.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') forward();
      if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Swipe on touch screens.
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    // Read direction through stageDelta so "left" stays left on the turned (upright-phone) stage.
    const { dx, dy } = stageDelta(e.clientX - s.x, e.clientY - s.y);
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? forward : back)();
  };

  const card = CARDS[i];
  return (
    <Scene bare place="space">
      <div className="flex items-center justify-between gap-[0.75rem] px-[0.75rem] pt-[0.5rem]">
        <ol className="flex items-center gap-[0.5rem]" aria-label={`Story card ${i + 1} of ${CARDS.length}`}>
          {CARDS.map((c, n) => (
            <li
              key={c.title}
              aria-hidden
              className={`h-[1rem] rounded-full border-2 border-line transition-all ${n === i ? 'w-[2.5rem] bg-go' : n < i ? 'w-[1rem] bg-text' : 'w-[1rem] bg-transparent'}`}
            />
          ))}
        </ol>
        <GameButton variant="small" icon={SkipForward} onClick={() => go('home')} className="!mb-0 !min-h-[2.75rem] !px-[0.875rem] !text-[1rem]">
          Skip
        </GameButton>
      </div>

      <div
        className="flex min-h-0 flex-1 gap-[0.75rem] px-[0.75rem] pt-[0.5rem] pb-[0.75rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: isStageTurned() ? 'pan-x' : 'pan-y' }}
      >
        {/* left: the comic picture, filling the column */}
        <div key={`pic-${card.title}`} className="relative min-h-0 w-[45%] shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-line">
          <div className="h-full" aria-hidden>
            <Scene place={card.place} fill={false} bare className="h-full">
              <div className={`flex min-h-0 flex-1 items-end pb-[0.5rem] ${i === 0 ? 'justify-end pr-[0.75rem]' : 'justify-center'}`}>
                <span className="anim-pop-in">{card.picture}</span>
              </div>
            </Scene>
          </div>
          {i === 0 ? (
            <div className="absolute inset-x-[0.5rem] top-[0.5rem]">
              <NeowsStrip />
            </div>
          ) : null}
        </div>

        {/* right: the words, then Back and Next */}
        <Panel key={card.title} ribbon="Fiction" tone="go" as="article" compact className="!mt-[0.875rem] flex min-h-0 min-w-0 flex-1 flex-col">
          <p className="text-[0.875rem] font-bold text-muted">A story made for this game</p>
          <h1 className="mt-[0.125rem] font-display text-[1.75rem] leading-tight font-extrabold" aria-live="polite">
            {card.title}
          </h1>
          <p className="mt-[0.25rem] min-h-0 flex-1 text-[1rem] leading-snug">{card.body}</p>
          <div className="mt-[0.5rem] flex items-center gap-[0.5rem]">
            {i > 0 ? <RoundButton icon={ArrowLeft} label="Back" onClick={back} /> : null}
            <GameButton variant="go" icon={last ? Rocket : ArrowRight} onClick={next} className="!min-h-[3rem] !px-[1rem] !text-[1.125rem]">
              {last ? 'Accept the mission' : 'Next'}
            </GameButton>
          </div>
        </Panel>
      </div>
    </Scene>
  );
}
