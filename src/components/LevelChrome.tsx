// Shared parts of every level screen: the place each level happens in, the HUD with a Home button,
// and turning an Outcome into change chips. BUILD_SEQUENCE.md §4.7, step G2.
import type { ReactNode } from 'react';
import { House } from 'lucide-react';
import { LEVELS } from '../content/levels';
import { METERS, type Meter, type Outcome } from '../engine/types';
import { useGame } from '../store/game';
import { useI18n, tMission } from '../content/i18n';
import type { Change } from './GameButton';
import { RoundButton } from './GameButton';
import { Hud } from './Hud';
import type { ScenePlace } from './Scene';

/** Where each level happens. */
export const LEVEL_SCENE: Record<number, ScenePlace> = { 1: 'earth', 2: 'space', 3: 'mars', 4: 'dust', 5: 'mars', 6: 'mars' };

/** The level's steps as task-list items; the first `done` are ticked. */
export const tasksFor = (levelIndex: number, done: number) =>
  LEVELS[levelIndex].steps.map((s, i) => ({ label: tMission(s.task), done: i < done }));

/** Every meter and star change in an outcome, in meter order. */
export function outcomeChanges(o: Pick<Outcome, 'delta' | 'starsDelta'>): Change[] {
  const out: Change[] = METERS.filter((m) => o.delta[m]).map((m) => ({ meter: m, amount: o.delta[m]! }));
  if (o.starsDelta) out.push({ meter: 'stars', amount: o.starsDelta });
  return out;
}

/** Sum of the meter changes (stars left out): how good or bad a moment felt. */
export const totalChange = (o: Pick<Outcome, 'delta'>) => METERS.reduce((a, m) => a + (o.delta[m] ?? 0), 0);

/**
 * The three zones of a level screen (§4.2). The top strip is the HUD (passed to `Scene`'s `top`).
 * `left` (about 36% wide) holds the kid and Twinkle; `right` is the rest: the bubble, the thing you touch, GO.
 */
export function LevelZones({ left, children }: { left?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-full md:min-h-0 flex-1 flex-col md:flex-row gap-2 sm:gap-3 px-2 sm:px-3 pt-2 pb-2">
      {left ? (
        <div className="flex min-h-0 w-full md:w-[30%] lg:w-[34%] shrink-0 flex-col items-center justify-end gap-1 max-h-[5rem] sm:max-h-[8rem] md:max-h-none overflow-hidden md:overflow-visible">
          {left}
        </div>
      ) : null}
      <div className="flex min-h-full md:min-h-0 min-w-0 flex-1 flex-col gap-1.5 sm:gap-2">{children}</div>
    </div>
  );
}

/** The level HUD: Home, which level, the four meters and the stars. `look` is Look first (see Hud). */
export function LevelHud({
  meters,
  stars,
  levelLabel,
  look,
  onOpenSettings,
}: {
  meters: Record<Meter, number>;
  stars: number;
  levelLabel?: string;
  look?: Partial<Record<Meter, number>>;
  onOpenSettings?: () => void;
}) {
  const { goHome, levelIndex } = useGame();
  const current = LEVELS[levelIndex];
  const lang = useI18n((s) => s.lang);
  return (
    <Hud
      meters={meters}
      stars={stars}
      look={look}
      onOpenSettings={onOpenSettings}
      lead={
        <div className="flex flex-wrap items-center gap-1.5">
          <RoundButton icon={House} label={lang === 'bn' ? 'হোম' : 'Home'} onClick={goHome} className="!h-[2.75rem] !w-[2.75rem] !mb-[0.3rem]" />
          <span className="rounded-full border-2 border-line bg-panel px-3 py-0.5 font-display text-[1rem] leading-snug font-extrabold whitespace-nowrap text-text">
            {levelLabel ?? (lang === 'bn' ? `লেভেল ${levelIndex + 1} / ${LEVELS.length}` : `Level ${levelIndex + 1} of ${LEVELS.length}`)}
          </span>
          {current?.place ? (
            <span
              className="rounded-full border-2 border-line bg-sky-space px-2.5 py-0.5 font-display text-sm font-extrabold whitespace-nowrap text-text max-[760px]:hidden"
              aria-label={`Mission stage: ${current.place}`}
            >
              {tMission(current.place)}
            </span>
          ) : null}
        </div>
      }
    />
  );
}
