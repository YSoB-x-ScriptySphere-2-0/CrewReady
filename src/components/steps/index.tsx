// The five hands-on steps (A7), one small toy per file. Each calls `onDone(outcome)` when the player commits,
// through the same engine calls as before: packCrates, stow, checkOrder, setSliders, pickCrew.
// Decisions (`choice`) live in ../Decision.tsx.
import type { ChoiceStep, GameState, Level, Step } from '../../engine/types';
import { Crates } from './Crates';
import { CrewPick } from './CrewPick';
import { Landing } from './Landing';
import { Power } from './Power';
import type { Done } from './shared';
import { Stow } from './Stow';

export function StepView({ step, game, level, onDone }: { step: Exclude<Step, ChoiceStep>; game: GameState; level: Level; onDone: Done }) {
  switch (step.kind) {
    case 'crates':
      return <Crates step={step} game={game} onDone={onDone} />;
    case 'stow':
      return <Stow step={step} game={game} onDone={onDone} />;
    case 'order':
      return <Landing step={step} game={game} onDone={onDone} />;
    case 'sliders':
      return <Power step={step} game={game} level={level} onDone={onDone} />;
    case 'crew':
      return <CrewPick step={step} game={game} onDone={onDone} />;
  }
}
