// The story cards (BUILD_SEQUENCE.md A2, restyled in G2): three FICTION comic panels from plan §4.2
// (shortened 12 Nov 2026 to read aloud in ~25 s), with one real NASA data card as the bridge from fiction to fact.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Rocket, SkipForward } from 'lucide-react';
import { GameButton, RoundButton } from '../components/GameButton';
import { useCountTo } from '../components/motion';
import { IntelCard, Panel } from '../components/Panel';
import { Scene, type ScenePlace } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
import neows from '../content/samples/neows.json';
import { useGame } from '../store/game';

const CARDS: { title: string; body: ReactNode; place: ScenePlace; picture: ReactNode }[] = [
  {
    title: 'The Near Miss',
    body: 'An asteroid flew at Earth. Most of it was pushed away. One piece hit the ocean. Its dust dimmed the Sun for a year.',
    place: 'space',
    picture: <Twinkle mood="surprised" size={120} />,
  },
  {
    title: 'The Lesson',
    body: 'Earth is healing. But we learned that one planet is not enough.',
    place: 'earth',
    picture: <Kid who="nova" pose="think" height={170} />,
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
      <span className="flex items-end gap-4">
        <Kid who="nova" pose="arms" height={170} />
        <Kid who="orbit" pose="arms" height={170} />
      </span>
    ),
  },
];

const fetched = new Date(neows.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** A number that ticks up from 0 when the card opens. */
function CountUp({ to }: { to: number }) {
  const [target, setTarget] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setTarget(to), 250);
    return () => clearTimeout(t);
  }, [to]);
  return <>{useCountTo(target, 1200)}</>;
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
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? forward : back)();
  };

  const card = CARDS[i];
  return (
    <Scene place="space">
      <div className="flex items-center justify-between gap-3">
        <ol className="flex items-center gap-2" aria-label={`Story card ${i + 1} of ${CARDS.length}`}>
          {CARDS.map((c, n) => (
            <li
              key={c.title}
              aria-hidden
              className={`h-4 rounded-full border-[3px] border-ink transition-all ${n === i ? 'w-10 bg-go' : n < i ? 'w-4 bg-paper' : 'w-4 border-paper/70 bg-transparent'}`}
            />
          ))}
        </ol>
        <GameButton variant="small" icon={SkipForward} onClick={() => go('home')}>
          Skip
        </GameButton>
      </div>

      <div className="flex flex-1 flex-col gap-4" onPointerDown={onPointerDown} onPointerUp={onPointerUp} style={{ touchAction: 'pan-y' }}>
        <Panel key={card.title} ribbon="Fiction" tone="go" as="article">
          {/* the comic picture */}
          <div className="overflow-hidden rounded-[18px] border-[3px] border-ink" aria-hidden>
            <Scene place={card.place} fill={false} bare className="h-[200px] items-center justify-end">
              <span className="anim-pop-in mb-3">{card.picture}</span>
            </Scene>
          </div>
          <p className="mt-2 text-sm font-bold text-muted">A story made for this game</p>
          <h1 className="mt-1 font-display text-[28px] leading-tight font-extrabold sm:text-[34px]" aria-live="polite">
            {card.title}
          </h1>
          <p className="mt-1 text-lg leading-snug">{card.body}</p>
          <div className="mt-5 flex items-center gap-3">
            {i > 0 ? <RoundButton icon={ArrowLeft} label="Back" onClick={back} /> : null}
            <GameButton variant="go" icon={last ? Rocket : ArrowRight} onClick={next}>
              {last ? 'Accept the mission' : 'Next'}
            </GameButton>
          </div>
        </Panel>

        {i === 0 ? (
          <IntelCard
            badge="NASA ARCHIVE"
            date={`Real NASA data from ${fetched}`}
            figure={<CountUp to={neows.count} />}
            sentence={`Real asteroids passing Earth this week — NASA is tracking ${neows.count}. None will hit us.`}
            source={`NASA NeoWs · ARCHIVE · ${fetched}`}
          />
        ) : null}
      </div>
    </Scene>
  );
}
