// A5 — the level opening. The level's place fills the screen, the HUD sits on top, and everything
// carried in from earlier (living costs, sunlight, consequences) plays onto the HUD one at a time,
// each with a reason toast in its meter's colour. Then the level card, the Intel card and a pink GO!.
// BUILD_SEQUENCE.md §6 A5.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Lightbulb, Play as PlayIcon, Sun } from 'lucide-react';
import { ChangeChip, GameButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, tasksFor } from '../components/LevelChrome';
import { METER_COLOR, MeterBadge } from '../components/meters';
import { useReducedMotion } from '../components/motion';
import { IntelCard, Panel, SourceStrip, TaskList, type BadgeKind } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Twinkle, TwinkleSays } from '../components/Twinkle';
import { LEVELS } from '../content/levels';
import { enterSteps, type EnterStep } from '../engine/engine';
import { METERS } from '../engine/types';
import { useGame } from '../store/game';

/** Time before the first carry-over lands, and between the next ones (the HUD's own effect is 600 ms). */
const FIRST_MS = 500;
const EACH_MS = 1100;

type Intel = { badge: BadgeKind; date?: string; figure: ReactNode; sentence: string; source: string };

/**
 * Each level's Mission Intel card: real archive values from docs/06 only (live data arrives in B4).
 * Levels 1 and 5 have none yet: EPIC is not snapshotted, and the Veggie facts are still unconfirmed.
 */
function intelFor(levelId: number, D: number): Intel | null {
  if (levelId === 2)
    return {
      badge: 'NASA ARCHIVE',
      date: '10–11 May 2024',
      figure: '9 of 9',
      sentence: 'A real Sun storm in May 2024 hit level 9. That is the top.',
      source: 'NASA DONKI · ARCHIVE · 11 May 2024',
    };
  if (levelId === 3)
    return {
      badge: 'NASA ARCHIVE',
      date: 'Sol 675 · Oct 2020',
      figure: '−62 °C',
      sentence: 'The InSight lander measured real Mars air in 2020. It averaged −62 °C.',
      source: 'NASA InSight · ARCHIVE · Oct 2020',
    };
  if (levelId === 4) {
    // The three real dust cases (docs/06 §3). The case is picked at mission start, before the cliff's −5.
    if (D <= 5) return { badge: 'NASA ARCHIVE', figure: 'Clear', sentence: 'Even ordinary Mars skies are dusty. Your storm is a small one.', source: 'NASA Mars missions · ARCHIVE' };
    if (D <= 15)
      return { badge: 'NASA ARCHIVE', date: '2007', figure: '2007', sentence: 'A dust storm like this stopped the Opportunity rover for weeks.', source: 'NASA Opportunity mission · ARCHIVE · 2007' };
    return { badge: 'NASA ARCHIVE', date: '2018', figure: '2018', sentence: 'A storm like this covered all of Mars. Opportunity never woke up.', source: 'NASA Opportunity mission · ARCHIVE · 2018' };
  }
  if (levelId === 6)
    return {
      badge: 'NASA ARCHIVE',
      date: '9 May 2024',
      figure: <Sun size={56} strokeWidth={2.5} aria-label="The Sun" />,
      sentence: 'On 9 May 2024 the Sun shot out a burst of fast particles.',
      source: 'NASA DONKI · ARCHIVE · 9 May 2024',
    };
  return null;
}

/** One carry-over: a toast tinted with its meter's colour, its icon(s), its reason and its change chips. */
function CarryToast({ step }: { step: EnterStep }) {
  const tint = step.about.length ? METER_COLOR[step.about[0]] : 'var(--color-edge)';
  const chips = METERS.filter((m) => step.delta[m]).map((m) => ({ meter: m, amount: step.delta[m]! }));
  return (
    <li
      className="anim-pop-in flex items-center gap-2.5 rounded-2xl border-[3px] border-ink py-2 pr-3 pl-2 text-ink shadow-[0_4px_0_var(--color-ink)]"
      style={{ background: `color-mix(in srgb, ${tint} 24%, var(--color-paper))` }}
    >
      <span className="flex shrink-0 -space-x-2">
        {step.about.map((m) => (
          <MeterBadge key={m} meter={m} size={34} />
        ))}
      </span>
      <span className="min-w-0 flex-1 sm:flex sm:items-center sm:gap-3">
        <span className="block min-w-0 font-display text-lg leading-snug font-bold sm:flex-1">{step.reason}</span>
        {chips.length ? (
          <span className="mt-1 flex shrink-0 flex-wrap gap-1 sm:mt-0">
            {chips.map((c) => (
              <ChangeChip key={c.meter} change={c} size="sm" />
            ))}
          </span>
        ) : null}
      </span>
    </li>
  );
}

export function LevelOpening() {
  const { game, checkpoint, levelIndex, beginLevel } = useGame();
  const level = LEVELS[levelIndex];
  const reduce = useReducedMotion();
  const steps = useMemo(() => enterSteps(checkpoint, level), [checkpoint, level]);

  // How many carry-overs have landed. Reduced motion shows them all at once.
  const [played, setPlayed] = useState(reduce ? steps.length : 0);
  useEffect(() => {
    if (reduce) {
      setPlayed(steps.length);
      return;
    }
    if (played >= steps.length) return;
    const t = setTimeout(() => setPlayed((n) => n + 1), played === 0 ? FIRST_MS : EACH_MS);
    return () => clearTimeout(t);
  }, [played, steps.length, reduce]);

  // The HUD shows the meters as they were after the last carry-over that landed; the last frame is the real state.
  const meters = played >= steps.length ? game.meters : played === 0 ? checkpoint.meters : steps[played - 1].meters;
  const intel = intelFor(level.id, checkpoint.D);

  return (
    <Scene bare place={LEVEL_SCENE[level.id]} top={<LevelHud meters={meters} stars={game.stars} />}>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 pt-5 pb-10">
        {steps.length ? (
          <section aria-label="On the way here">
            <ol className="space-y-2" aria-live="polite">
              {steps.slice(0, played).map((s, i) => (
                <CarryToast key={i} step={s} />
              ))}
            </ol>
          </section>
        ) : null}

        <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6">
          <Panel ribbon={`Level ${level.id} of ${LEVELS.length}`} tone="go">
            {/* The title is a heading, not ribbon text: "The Dangerous Journey" would be cut off at 375 px. */}
            <h1 className="font-display text-[32px] leading-tight font-extrabold sm:text-[38px]">
              <span className="sr-only">Level {level.id}: </span>
              {level.title}
            </h1>
            <p className="mt-2 inline-block rounded-full border-[3px] border-ink bg-white px-3 py-0.5 font-display text-lg leading-snug font-extrabold">{level.place}</p>
            <p className="mt-3 text-lg leading-snug">{level.story}</p>
            <p className="mt-3 flex items-start gap-2 rounded-tile border-[3px] border-ink bg-[#fff1c2] px-3 py-2 font-display text-lg leading-snug font-bold">
              <Lightbulb size={22} strokeWidth={2.75} aria-hidden className="mt-0.5 shrink-0" />
              <span>You'll learn: {level.teaches}</span>
            </p>
            <div className="mt-4">
              <TaskList tasks={tasksFor(levelIndex, 0)} />
            </div>
            <div className="mt-5">
              <GameButton variant="go" icon={PlayIcon} onClick={beginLevel} className="!px-10 !text-[26px]">
                GO!
              </GameButton>
            </div>
          </Panel>

          {intel ? (
            <div className="flex items-end gap-1">
              <span className="anim-pop-in mb-2 shrink-0">
                <Twinkle mood="tablet" size={84} />
              </span>
              <div className="min-w-0 flex-1">
                <IntelCard badge={intel.badge} date={intel.date} figure={intel.figure} sentence={intel.sentence} source={intel.source} />
              </div>
            </div>
          ) : (
            <TwinkleSays mood="happy" size={84}>
              Ready, Commander? Tap GO!
            </TwinkleSays>
          )}
        </div>

        <SourceStrip text={level.source} />
      </main>
    </Scene>
  );
}
