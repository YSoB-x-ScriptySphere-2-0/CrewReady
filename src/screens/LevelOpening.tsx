// The level opening, in landscape (BUILD_SEQUENCE.md R3). The level's place fills the stage and the HUD sits on top.
// Left: the crew, with each carry-over (living costs, sunlight, consequences) landing on the HUD one at a time,
// shown with its reason. Right: the ribbon ("LEVEL 3 · FIRST BREATH"), one line, the task list as icon chips,
// the Intel card and GO!.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Lightbulb, Play as PlayIcon, Sun, Target } from 'lucide-react';
import { ChangeChip, GameButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, LevelZones, tasksFor } from '../components/LevelChrome';
import { METER_COLOR, MeterBadge } from '../components/meters';
import { useReducedMotion } from '../components/motion';
import { IntelCard, Ribbon, SourceStrip, type BadgeKind } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
import { TASK_ICON } from '../content/icons';
import { LEVELS } from '../content/levels';
import { enterSteps, type EnterStep } from '../engine/engine';
import { METERS } from '../engine/types';
import { useGame } from '../store/game';

/** Time before the first carry-over lands, and between the next ones (the HUD's own effect is 600 ms). */
const FIRST_MS = 500;
const EACH_MS = 1100;

type Intel = { badge: BadgeKind; date?: string; figure: ReactNode; sentence: string; source: string };

/**
 * Each level's Mission Intel card: real archive values from docs/06 only (live data arrives in D2).
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
      figure: <Sun size={36} strokeWidth={2.5} aria-label="The Sun" />,
      sentence: 'On 9 May 2024 the Sun shot out a burst of fast particles.',
      source: 'NASA DONKI · ARCHIVE · 9 May 2024',
    };
  return null;
}

/** One carry-over: a dark toast tinted with its meter's colour, its icon(s), its reason and its change chips. */
function CarryToast({ step }: { step: EnterStep }) {
  const tint = step.about.length ? METER_COLOR[step.about[0]] : 'var(--color-line)';
  const chips = METERS.filter((m) => step.delta[m]).map((m) => ({ meter: m, amount: step.delta[m]! }));
  return (
    <div
      className="anim-pop-in flex w-full items-center gap-[0.5rem] rounded-[1rem] border-2 py-[0.375rem] pr-[0.5rem] pl-[0.375rem] text-text"
      style={{ background: `color-mix(in srgb, ${tint} 28%, #14204d)`, borderColor: tint }}
      role="status"
    >
      <span className="flex shrink-0 -space-x-2">
        {step.about.map((m) => (
          <MeterBadge key={m} meter={m} size={28} />
        ))}
      </span>
      <span className="min-w-0 flex-1 font-display text-[0.875rem] leading-tight font-bold">{step.reason}</span>
      {chips.length ? (
        <span className="flex shrink-0 flex-col gap-[0.125rem]">
          {chips.map((c) => (
            <ChangeChip key={c.meter} change={c} size="sm" />
          ))}
        </span>
      ) : null}
    </div>
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
  const tasks = tasksFor(levelIndex, 0);
  const latest = played > 0 ? steps[played - 1] : null;

  const left = (
    <>
      <div className="flex min-h-[3.25rem] w-full items-end">{latest ? <CarryToast key={played} step={latest} /> : null}</div>
      <div className="flex min-h-0 flex-1 items-end justify-center gap-[0.25rem]">
        <span className="mb-[0.5rem]">
          <Twinkle mood={intel ? 'tablet' : 'happy'} size={60} />
        </span>
        <Kid who="orbit" pose="stand" height="min(13rem, 100%)" label="Orbit" className="max-h-full" bob />
      </div>
    </>
  );

  return (
    <Scene bare place={LEVEL_SCENE[level.id]} top={<LevelHud meters={meters} stars={game.stars} />}>
      <LevelZones left={left}>
        <div className="flex flex-wrap items-center gap-x-[0.625rem] gap-y-[0.25rem]">
          <Ribbon tone="go">{`Level ${level.id} · ${level.title}`}</Ribbon>
          <span className="sr-only">{`Level ${level.id} of ${LEVELS.length}: ${level.title}`}</span>
          <span className="rounded-full bg-panel/85 px-[0.625rem] font-display text-[0.875rem] leading-snug font-bold text-text">{level.place}</span>
        </div>

        <p className="flex items-start gap-[0.375rem] rounded-[1rem] bg-panel/85 px-[0.75rem] py-[0.375rem] font-display text-[1.0625rem] leading-snug font-bold text-text">
          <Lightbulb size={20} strokeWidth={2.75} aria-hidden className="mt-[0.1875rem] shrink-0 text-star" />
          <span>{level.teaches}</span>
        </p>

        <ol className="flex flex-wrap gap-[0.375rem]" aria-label="This level's tasks">
          {tasks.map((t, i) => {
            const Icon = TASK_ICON[t.label] ?? Target;
            return (
              <li key={i} className="flex items-center gap-[0.375rem] rounded-full border-2 border-line bg-panel/85 py-[0.125rem] pr-[0.75rem] pl-[0.125rem] text-text">
                <span className="grid h-[1.75rem] w-[1.75rem] place-items-center rounded-full bg-space-deep font-display text-[0.875rem] font-extrabold" aria-hidden>
                  <Icon size={16} strokeWidth={2.5} />
                </span>
                <span className="font-display text-[0.875rem] leading-tight font-bold">{t.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="min-h-0 flex-1">
          {intel ? <IntelCard compact badge={intel.badge} date={intel.date} figure={intel.figure} sentence={intel.sentence} source={intel.source} /> : null}
        </div>

        <div className="flex items-center gap-[0.5rem]">
          <SourceStrip text={level.source} className="min-w-0 flex-1" />
          <GameButton variant="go" icon={PlayIcon} onClick={beginLevel} className="!min-h-[3rem] !px-[2rem] !text-[1.5rem]">
            GO!
          </GameButton>
        </div>
      </LevelZones>
    </Scene>
  );
}
