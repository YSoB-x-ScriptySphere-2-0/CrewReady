// The level opening, in landscape (BUILD_SEQUENCE.md R3). The level's place fills the stage and the HUD sits on top.
// Left: the crew, with each carry-over landing on the HUD one at a time.
// Right: the ribbon, one line, the task list as icon chips, the Intel card, 3D Crisis viewer (Level 1) and GO!.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Globe, Lightbulb, Play as PlayIcon, Rocket, Sun, Target, X } from 'lucide-react';
import { ChangeChip, GameButton } from '../components/GameButton';
import { LEVEL_SCENE, LevelHud, LevelZones, tasksFor } from '../components/LevelChrome';
import { METER_COLOR, MeterBadge } from '../components/meters';
import { useReducedMotion } from '../components/motion';
import { IntelCard, Ribbon, SourceStrip, type BadgeKind } from '../components/Panel';
import { Scene } from '../components/Scene';
import { Words } from '../components/Words';
import { Kid, Twinkle } from '../components/Twinkle';
import { TASK_ICON } from '../content/icons';
import { LEVELS } from '../content/levels';
import { enterSteps, type EnterStep } from '../engine/engine';
import { METERS } from '../engine/types';
import { useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';
import { t, useI18n } from '../content/i18n';
import { CrisisEarth3D } from '../components/3d/CrisisEarth3D';
import { HeroCadetRocket3D } from '../components/3d/HeroCadetRocket3D';

/** Time before the first carry-over lands, and between the next ones (the HUD's own effect is 600 ms). */
const FIRST_MS = 500;
const EACH_MS = 1100;

type Intel = { badge: BadgeKind; date?: string; figure?: ReactNode; image?: { src: string; alt: string; credit: string }; sentence: string; source: string };

const SOL_675 = '675';

/** EPIC sends big PNGs; the same picture is also a much smaller JPG. */
const epicJpg = (png: string) => png.replace('/png/', '/jpg/').replace(/\.png$/, '.jpg');

/**
 * Each level's Mission Intel card. Real data from the NASA service (live, or saved ARCHIVE), with the badge and
 * date it came with. `null` while it loads (a skeleton shows); `undefined` when the level has no card.
 */
function useIntel(levelId: number, D: number): Intel | null | undefined {
  const { earth, weather, mars, images } = useSpace();
  if (levelId === 1) {
    if (!earth) return null;
    return {
      badge: earth.badge,
      date: fmtDate(earth.data.date),
      image: { src: epicJpg(earth.data.pngUrl), alt: 'The whole sunlit Earth, seen from space by NASA’s EPIC camera', credit: 'NASA EPIC' },
      sentence: 'NASA’s EPIC camera sees all of sunlit Earth.',
      source: `NASA EPIC · ${earth.badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'} · ${fmtDate(earth.data.date)}`,
    };
  }
  if (levelId === 2) {
    if (!weather) return null;
    const e = weather.data;
    const live = weather.badge === 'NASA LIVE';
    const day = fmtDate(e.startTime);
    const when = live ? day : '10–11 May 2024';
    return {
      badge: weather.badge,
      date: when,
      figure: `Kp ${e.kpIndex}`,
      sentence: live ? `A real Sun storm. It reached Kp ${e.kpIndex} of 9.` : 'A real Sun storm. It hit Kp 9, the top.',
      source: `NASA DONKI · ${live ? 'LIVE' : 'ARCHIVE'} · ${when}`,
    };
  }
  if (levelId === 3) {
    if (!mars) return null;
    const sol = mars.data.find((s) => s.sol === SOL_675) ?? mars.data[0];
    const month = new Date(sol.firstUtc).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    const av = Math.round(sol.temp.av);
    return {
      badge: mars.badge,
      date: `Sol ${sol.sol} · ${month}`,
      figure: `${av} °C`,
      sentence: `InSight measured real Mars air. It averaged ${av} °C.`,
      source: `NASA InSight · ARCHIVE · ${month}`,
    };
  }
  if (levelId === 4) {
    if (D <= 5) return { badge: 'NASA ARCHIVE', figure: 'Clear', sentence: 'Even ordinary Mars skies are dusty. Your storm is a small one.', source: 'NASA Mars missions · ARCHIVE' };
    if (D <= 15)
      return { badge: 'NASA ARCHIVE', date: '2007', figure: '2007', sentence: 'A dust storm like this stopped the Opportunity rover for weeks.', source: 'NASA Opportunity mission · ARCHIVE · 2007' };
    return { badge: 'NASA ARCHIVE', date: '2018', figure: '2018', sentence: 'A storm like this covered all of Mars. Opportunity never woke up.', source: 'NASA Opportunity mission · ARCHIVE · 2018' };
  }
  if (levelId === 5) {
    if (!images) return null;
    const pic = images.data.find((i) => /lettuce/i.test(i.description));
    if (!pic) return undefined;
    return {
      badge: images.badge,
      image: { src: pic.url, alt: pic.description, credit: 'NASA' },
      sentence: 'Astronauts taste lettuce grown in space.',
      source: 'NASA Image Library · ARCHIVE',
    };
  }
  if (levelId === 6)
    return {
      badge: 'NASA ARCHIVE',
      date: '9 May 2024',
      figure: <Sun size={36} strokeWidth={2.5} aria-label="The Sun" />,
      sentence: 'On 9 May 2024 the Sun shot out a burst of fast particles.',
      source: 'NASA DONKI · ARCHIVE · 9 May 2024',
    };
  return undefined;
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
  const lang = useI18n((s) => s.lang);
  const level = LEVELS[levelIndex];
  const reduce = useReducedMotion();
  const steps = useMemo(() => enterSteps(checkpoint, level), [checkpoint, level]);
  const [show3DModal, setShow3DModal] = useState(false);
  const [active3DTab, setActive3DTab] = useState<'earth' | 'rocket'>('earth');

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

  const meters = played >= steps.length ? game.meters : played === 0 ? checkpoint.meters : steps[played - 1].meters;
  const intel = useIntel(level.id, checkpoint.D);
  const tasks = tasksFor(levelIndex, 0);
  const latest = played > 0 ? steps[played - 1] : null;

  const titleText = t(`level${level.id}.title`) || level.title;
  const teachesText = t(`level${level.id}.teaches`) || level.teaches;
  const placeText = t(`level${level.id}.place`) || level.place;

  const left = (
    <>
      <div className="flex min-h-[3.25rem] w-full items-end">{latest ? <CarryToast key={played} step={latest} /> : null}</div>
      <div className="flex min-h-0 flex-1 items-end justify-center gap-[0.25rem]">
        <span className="mb-[0.5rem]">
          <Twinkle mood={intel !== undefined ? 'tablet' : 'happy'} size={60} />
        </span>
        <Kid who="orbit" pose="stand" height="min(13rem, 100%)" label="Orbit" className="max-h-full" bob />
      </div>
    </>
  );

  return (
    <Scene bare place={LEVEL_SCENE[level.id]} top={<LevelHud meters={meters} stars={game.stars} />}>
      <LevelZones left={left}>
        <div className="flex flex-wrap items-center justify-between gap-x-[0.625rem] gap-y-[0.25rem]">
          <div className="flex flex-wrap items-center gap-2">
            <Ribbon tone="go">{`Level ${level.id} · ${titleText}`}</Ribbon>
            <span className="rounded-full bg-panel/85 px-[0.625rem] font-display text-[0.875rem] leading-snug font-bold text-text">
              {placeText}
            </span>
          </div>

          {/* Level 1 (or any level) 3D Crisis & Spaceship Explorer Button */}
          <button
            type="button"
            onClick={() => setShow3DModal(true)}
            className="flex items-center gap-1.5 rounded-full border border-go/60 bg-go/20 px-3 py-1 font-display text-xs font-extrabold text-go hover:bg-go/30 transition active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(34,215,230,0.3)]"
          >
            <Globe size={14} />
            <span>{lang === 'bn' ? '৩ডি পৃথিবী ও রকেট' : '3D Earth & Rocket'}</span>
          </button>
        </div>

        <p className="flex items-start gap-[0.375rem] rounded-[1rem] bg-panel/85 px-[0.75rem] py-[0.375rem] font-display text-[1rem] sm:text-[1.0625rem] leading-snug font-bold text-text">
          <Lightbulb size={20} strokeWidth={2.75} aria-hidden className="mt-[0.1875rem] shrink-0 text-star" />
          <span><Words text={teachesText} /></span>
        </p>

        <ol className="flex flex-wrap gap-[0.25rem]" aria-label="This level's tasks">
          {tasks.map((tk, i) => {
            const Icon = TASK_ICON[tk.label] ?? Target;
            return (
              <li key={i} className="flex items-center gap-[0.25rem] rounded-full border-2 border-line bg-panel/85 py-[0.125rem] pr-[0.5rem] pl-[0.125rem] text-text">
                <span className="grid h-[1.5rem] w-[1.5rem] place-items-center rounded-full bg-space-deep font-display text-[0.875rem] font-extrabold" aria-hidden>
                  <Icon size={14} strokeWidth={2.5} />
                </span>
                <span className="font-display text-[0.75rem] leading-tight font-bold whitespace-nowrap">{tk.label}</span>
              </li>
            );
          })}
        </ol>

        <div className="min-h-0 flex-1">
          {intel === null ? (
            <IntelCard compact loading badge="NASA ARCHIVE" sentence="" />
          ) : intel ? (
            <IntelCard compact badge={intel.badge} date={intel.date} figure={intel.figure} image={intel.image} sentence={intel.sentence} source={intel.source} />
          ) : null}
        </div>

        <div className="flex items-center gap-[0.5rem]">
          <SourceStrip text={level.source} className="min-w-0 flex-1" />
          <GameButton
            variant="go"
            icon={PlayIcon}
            onClick={beginLevel}
            className="!min-h-[3rem] !px-4 sm:!px-7 !text-lg sm:!text-[1.375rem]"
          >
            {t('btn.go')}
          </GameButton>
        </div>
      </LevelZones>

      {/* 3D Earth Crisis & Hero Rocket Modal */}
      {show3DModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-5 backdrop-blur-md">
          <div className="relative flex h-full max-h-[34rem] w-full max-w-[48rem] flex-col overflow-hidden rounded-2xl border-2 border-line bg-panel p-3 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line/60 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActive3DTab('earth')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs sm:text-sm font-extrabold transition ${
                    active3DTab === 'earth' ? 'bg-go text-go-text shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  <Globe size={15} />
                  <span>{lang === 'bn' ? 'বিপন্ন পৃথিবী ৩ডি' : 'Earth in Danger 3D'}</span>
                </button>

                <button
                  onClick={() => setActive3DTab('rocket')}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-display text-xs sm:text-sm font-extrabold transition ${
                    active3DTab === 'rocket' ? 'bg-go text-go-text shadow-sm' : 'text-muted hover:text-text'
                  }`}
                >
                  <Rocket size={15} />
                  <span>{lang === 'bn' ? 'মহাকাশযান প্রস্তুতি ৩ডি' : 'Spaceship Prep 3D'}</span>
                </button>
              </div>

              <button
                onClick={() => setShow3DModal(false)}
                aria-label={t('btn.close')}
                className="grid h-8 w-8 place-items-center rounded-full bg-text/10 text-text hover:bg-text/20"
              >
                <X size={18} />
              </button>
            </div>

            {/* 3D Scene View */}
            <div className="my-2 min-h-0 flex-1 overflow-hidden rounded-xl border border-line">
              {active3DTab === 'earth' ? (
                <CrisisEarth3D height="100%" />
              ) : (
                <HeroCadetRocket3D height="100%" />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="font-bold text-muted">
                {lang === 'bn'
                  ? '৩ডি মডেল ঘোরানোর জন্য স্ক্রিনে আঙুল বা মাউস দিয়ে ড্র্যাগ করো!'
                  : 'Drag on the 3D canvas to inspect from all angles!'}
              </span>

              <GameButton
                variant="go"
                onClick={() => {
                  setShow3DModal(false);
                  beginLevel();
                }}
                className="!min-h-[2.5rem] !px-4 !text-xs sm:!text-sm"
              >
                {t('btn.go')}
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </Scene>
  );
}
