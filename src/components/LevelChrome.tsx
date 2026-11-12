// Shared parts of every level screen: the place each level happens in, the HUD with a Home button,
// and turning an Outcome into change chips. BUILD_SEQUENCE.md §4.7, step G2.
import type { ReactNode } from 'react';
import { House } from 'lucide-react';
import { LEVELS } from '../content/levels';
import { METERS, type Meter, type Outcome } from '../engine/types';
import { useGame } from '../store/game';
import type { Change } from './GameButton';
import { RoundButton } from './GameButton';
import { Hud } from './Hud';
import type { ScenePlace } from './Scene';

/** Where each level happens. */
export const LEVEL_SCENE: Record<number, ScenePlace> = { 1: 'earth', 2: 'space', 3: 'mars', 4: 'dust', 5: 'mars', 6: 'mars' };

/** The level's steps as task-list items; the first `done` are ticked. */
export const tasksFor = (levelIndex: number, done: number) => LEVELS[levelIndex].steps.map((s, i) => ({ label: s.task, done: i < done }));

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
    <div className="flex min-h-0 flex-1 gap-[0.75rem] px-[0.75rem] pt-[0.5rem] pb-[0.25rem]">
      <div className="flex min-h-0 w-[36%] shrink-0 flex-col items-center justify-end gap-[0.375rem]">{left}</div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-[0.375rem]">{children}</div>
    </div>
  );
}

/** The level HUD: Home, which level, the four meters and the stars. `look` is Look first (see Hud). */
export function LevelHud({ meters, stars, levelLabel, look }: { meters: Record<Meter, number>; stars: number; levelLabel?: string; look?: Partial<Record<Meter, number>> }) {
  const { goHome, levelIndex } = useGame();
  const current = LEVELS[levelIndex];
  return (
    <Hud
      meters={meters}
      stars={stars}
      look={look}
      lead={
        <div className="flex flex-wrap items-center gap-1.5">
          <RoundButton icon={House} label="Home" onClick={goHome} className="!h-[2.75rem] !w-[2.75rem] !mb-[0.3rem]" />
          <span className="rounded-full border-2 border-line bg-panel px-3 py-0.5 font-display text-[1rem] leading-snug font-extrabold whitespace-nowrap text-text">
            {levelLabel ?? `Level ${levelIndex + 1} of ${LEVELS.length}`}
          </span>
          {current?.place ? (
            <span
              className="rounded-full border-2 border-line bg-sky-space px-2.5 py-0.5 font-display text-sm font-extrabold whitespace-nowrap text-text max-[760px]:hidden"
              aria-label={`Mission stage: ${current.place}`}
            >
              {current.place}
            </span>
          ) : null}
        </div>
      }
    />
  );
}
