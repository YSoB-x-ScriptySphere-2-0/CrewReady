// Shared parts of every level screen: the place each level happens in, the HUD with a Home button,
// and turning an Outcome into change chips. BUILD_SEQUENCE.md §4.7, step G2.
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

/** The level HUD: Home, which level, the four meters and the stars. */
export function LevelHud({ meters, stars, levelLabel }: { meters: Record<Meter, number>; stars: number; levelLabel?: string }) {
  const { goHome, levelIndex } = useGame();
  return (
    <Hud
      meters={meters}
      stars={stars}
      lead={
        <>
          <RoundButton icon={House} label="Home" onClick={goHome} className="!h-12 !w-12 !mb-[6px]" />
          <span className="rounded-full border-[3px] border-ink bg-paper px-3 py-0.5 font-display text-lg leading-snug font-extrabold whitespace-nowrap text-ink">
            {levelLabel ?? `Level ${levelIndex + 1} of ${LEVELS.length}`}
          </span>
        </>
      }
    />
  );
}
