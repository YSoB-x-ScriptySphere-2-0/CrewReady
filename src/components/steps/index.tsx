// The five hands-on steps, one small toy per file. Each calls `onDone(outcome)` when the player commits,
// through the same engine calls as before: packCrates, stow, checkOrder, setSliders, pickCrew.
// Decisions (`choice`) live in ../Decision.tsx. Steps that need room draw part of themselves into `slot`,
// the left zone (the kid shrinks to a corner meanwhile).
import type { ChoiceStep, GameState, Level, Step } from '../../engine/types';
import { Crates } from './Crates';
import { CrewPick } from './CrewPick';
import { Landing } from './Landing';
import { Power } from './Power';
import type { Done } from './shared';
import { Stow } from './Stow';

/** Which steps use the left zone. */
export const USES_LEFT_ZONE: ReadonlySet<Step['kind']> = new Set(['stow', 'order', 'sliders']);

export function StepView({ step, game, level, onDone, slot }: { step: Exclude<Step, ChoiceStep>; game: GameState; level: Level; onDone: Done; slot?: HTMLElement | null }) {
  switch (step.kind) {
    case 'crates':
      return <Crates step={step} game={game} onDone={onDone} />;
    case 'stow':
      return <Stow step={step} game={game} onDone={onDone} slot={slot} />;
    case 'order':
      return <Landing step={step} game={game} onDone={onDone} slot={slot} />;
    case 'sliders':
      return <Power step={step} game={game} level={level} onDone={onDone} slot={slot} />;
    case 'crew':
      return <CrewPick step={step} game={game} onDone={onDone} />;
  }
}
