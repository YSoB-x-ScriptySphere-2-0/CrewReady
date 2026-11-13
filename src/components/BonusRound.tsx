// Bonus round after each mission level: one Space Arcade game, paid into the shared wallet.
// The old 20-second mini-games paid 0 when the timer ran out (stale state in the timer closure);
// every game now reports its own final score, so stardust always matches what the player earned.
import type { GameId } from '../minigames/arcade/rewards';
import { ArcadePlayer } from './arcade/ArcadePlayer';

/** One game per level, so the six bonus rounds feel different. */
const BONUS_GAME_FOR_LEVEL: GameId[] = ['blaster', 'match', 'focus', 'gems', 'merge', 'blaster'];

interface BonusRoundProps {
  levelIndex: number; // 0 to 5
  onComplete: (earnedStardust: number) => void;
  onSkip: () => void;
}

export function BonusRound({ levelIndex, onComplete }: BonusRoundProps) {
  return (
    <ArcadePlayer
      game={BONUS_GAME_FOR_LEVEL[levelIndex % BONUS_GAME_FOR_LEVEL.length]}
      bonus={{ levelId: levelIndex + 1 }}
      doneLabel={{ en: 'Continue to Rewards', bn: 'পুরস্কার গ্রহণ করুন' }}
      onClose={() => onComplete(0)}
    />
  );
}
