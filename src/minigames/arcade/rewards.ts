// Stardust payout rules for the Space Arcade. Pure: the store feeds in the day and the previous stats.
// Stardust is real currency: it buys Twinkle's hints (Play) and cargo upgrades (Resources).

export type GameId = 'match' | 'blaster' | 'focus' | 'gems' | 'merge';
export const GAME_IDS: readonly GameId[] = ['match', 'blaster', 'focus', 'gems', 'merge'];

/** Score that earns the full base payout. */
export const FULL_PAYOUT_SCORE: Record<GameId, number> = { match: 150, blaster: 400, focus: 160, gems: 700, merge: 1500 };
export const BASE_MAX = 25;
export const FEATURED_BONUS = 5;
export const STREAK_BONUS_MAX = 5;
/** Plays of one game per day at full pay; later plays pay half so the arcade cannot be farmed. */
export const FULL_PAY_PLAYS = 3;

export interface ArcadeStats {
  bests: Partial<Record<GameId, number>>;
  /** Plays per game on `playsDay`. */
  plays: Partial<Record<GameId, number>>;
  playsDay: string;
  streak: number;
  lastDay: string;
  /** The day the once-a-day streak bonus was last paid. */
  streakPaidDay: string;
  totalPlays: number;
}

export const EMPTY_STATS: ArcadeStats = { bests: {}, plays: {}, playsDay: '', streak: 0, lastDay: '', streakPaidDay: '', totalPlays: 0 };

export interface Settlement {
  base: number;
  featuredBonus: number;
  streakBonus: number;
  total: number;
  isBest: boolean;
  streak: number;
  halfPay: boolean;
}

export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

/** The game with the bonus today. Same for everyone, changes at local midnight. */
export function featuredGame(day: string): GameId {
  return GAME_IDS[((dayNumber(day) % GAME_IDS.length) + GAME_IDS.length) % GAME_IDS.length];
}

export function baseStardust(game: GameId, score: number): number {
  if (score <= 0) return 0;
  return Math.min(BASE_MAX, Math.round((score / FULL_PAYOUT_SCORE[game]) * BASE_MAX));
}

export function settle(prev: ArcadeStats, game: GameId, score: number, day: string): { next: ArcadeStats; result: Settlement } {
  const safeScore = Math.max(0, Math.floor(score));
  const sameDay = prev.playsDay === day;
  const playsBefore = sameDay ? prev.plays[game] ?? 0 : 0;
  const halfPay = playsBefore >= FULL_PAY_PLAYS;

  const rawBase = baseStardust(game, safeScore);
  const base = halfPay ? Math.floor(rawBase / 2) : rawBase;
  const featuredBonus = base > 0 && !halfPay && featuredGame(day) === game ? FEATURED_BONUS : 0;

  let streak = prev.streak;
  if (prev.lastDay !== day) {
    streak = prev.lastDay && dayNumber(day) - dayNumber(prev.lastDay) === 1 ? prev.streak + 1 : 1;
  }
  // The streak bonus is paid once a day, on the first play that earns anything.
  const streakBonus = base > 0 && prev.streakPaidDay !== day ? Math.min(streak, STREAK_BONUS_MAX) : 0;

  const previousBest = prev.bests[game] ?? 0;
  const isBest = safeScore > previousBest;
  const next: ArcadeStats = {
    bests: { ...prev.bests, [game]: Math.max(previousBest, safeScore) },
    plays: { ...(sameDay ? prev.plays : {}), [game]: playsBefore + 1 },
    playsDay: day,
    streak,
    lastDay: day,
    streakPaidDay: streakBonus > 0 ? day : prev.streakPaidDay,
    totalPlays: prev.totalPlays + 1,
  };
  return {
    next,
    result: { base, featuredBonus, streakBonus, total: base + featuredBonus + streakBonus, isBest, streak, halfPay },
  };
}
