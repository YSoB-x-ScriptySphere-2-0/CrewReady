// The story cards (BUILD_SEQUENCE.md A2): three FICTION cards from plan §4.2 (shortened 12 Nov 2026 to read aloud in ~25 s),
// with one real NASA data card as the bridge from fiction to fact.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Kid } from '../components/Twinkle';
import { Badge, DataCard, MissionCard, PrimaryButton, QuietButton, Sky } from '../components/ui';
import neows from '../content/samples/neows.json';
import { useGame } from '../store/game';

const CARDS: { title: string; body: ReactNode }[] = [
  {
    title: 'The Near Miss',
    body: 'An asteroid flew at Earth. Most of it was pushed away. One piece hit the ocean. Its dust dimmed the Sun for a year.',
  },
  {
    title: 'The Lesson',
    body: 'Earth is healing. But we learned that one planet is not enough.',
  },
  {
    title: 'Your Mission',
    body: (
      <>
        Mission Control starts the <strong>Mars Continuity Programme</strong>. Fly to Mars and build a base. Keep it going for 500 sols — Mars days. You are
        the commander.
      </>
    ),
  },
];

const fetched = new Date(neows.fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

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
    <Sky place="space">
      <div className="flex items-center justify-between gap-3">
        <ol className="flex gap-2" aria-label={`Story card ${i + 1} of ${CARDS.length}`}>
          {CARDS.map((c, n) => (
            <li key={c.title} aria-hidden className={`h-3 rounded-full border-2 border-paper transition-all ${n === i ? 'w-8 bg-paper' : 'w-3'}`} />
          ))}
        </ol>
        <QuietButton onClick={() => go('home')} className="!min-h-11 !px-3 !text-sm">
          Skip
        </QuietButton>
      </div>

      <div className="flex flex-1 flex-col gap-4" onPointerDown={onPointerDown} onPointerUp={onPointerUp} style={{ touchAction: 'pan-y' }}>
        {i === 1 ? (
          <div className="relative z-10 -mb-8 flex justify-end pr-4" aria-hidden>
            <Kid who="nova" pose="think" height={170} className="sm:!h-[210px]" />
          </div>
        ) : null}
        {i === 2 ? (
          <div className="relative z-10 -mb-8 flex items-end justify-center gap-6 sm:gap-12" aria-hidden>
            <Kid who="nova" pose="arms" height={190} className="sm:!h-[230px]" />
            <Kid who="orbit" pose="arms" height={190} className="sm:!h-[230px]" />
          </div>
        ) : null}

        <MissionCard key={card.title} className={i > 0 ? 'pt-10 sm:pt-12' : ''}>
          <div className="flex items-center gap-2">
            <Badge kind="FICTION" />
            <span className="text-sm text-muted">A story made for this game</span>
          </div>
          <h1 className="mt-3 font-display text-[26px] leading-tight font-extrabold sm:text-[32px]" aria-live="polite">
            {card.title}
          </h1>
          <p className="mt-2 text-lg">{card.body}</p>
          <div className="mt-5">
            <PrimaryButton onClick={next}>{last ? 'Accept the mission' : 'Next'}</PrimaryButton>
          </div>
        </MissionCard>

        {i === 0 ? (
          <DataCard
            badge="NASA ARCHIVE"
            date={`Real NASA data from ${fetched}`}
            figure={neows.count}
            sentence={`Real asteroids passing Earth this week — NASA is tracking ${neows.count}. None will hit us.`}
            source={`NASA NeoWs · ARCHIVE · ${fetched}`}
          />
        ) : null}
      </div>
    </Sky>
  );
}
