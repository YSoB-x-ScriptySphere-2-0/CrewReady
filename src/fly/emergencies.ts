// Fly emergencies — short "what would an astronaut do?" drills based on real NASA procedures.
// Pure data + helpers (no DOM). All text lives in strings.en/bn under the keys below.

export type EmergencyId = 'solar' | 'leak' | 'fire';

export interface Emergency {
  id: EmergencyId;
  /** Index (0-2) of the correct option. Varied so the answer is not always the first button. */
  correct: number;
}

export const EMERGENCIES: Emergency[] = [
  { id: 'solar', correct: 1 },
  { id: 'leak', correct: 0 },
  { id: 'fire', correct: 2 },
];

/** First drill after this many meters, then one every EMERGENCY_GAP meters. */
export const FIRST_EMERGENCY_AT = 300;
export const EMERGENCY_GAP = 350;

/** Reward for the right call: stardust bonus and one repaired hull pip (max 3). */
export const EMERGENCY_STARDUST = 10;

/** Picks the emergency for the nth drill of a run, cycling through all of them. */
export function emergencyForIndex(n: number): Emergency {
  return EMERGENCIES[((n % EMERGENCIES.length) + EMERGENCIES.length) % EMERGENCIES.length];
}

/** Distance (m) at which the nth drill (0-based) triggers. */
export function emergencyDistance(n: number): number {
  return FIRST_EMERGENCY_AT + n * EMERGENCY_GAP;
}

/** i18n keys for an emergency. */
export function emergencyKeys(id: EmergencyId) {
  return {
    title: `fly.em.${id}.title`,
    alert: `fly.em.${id}.alert`,
    options: [0, 1, 2].map((i) => `fly.em.${id}.o${i}`),
    why: `fly.em.${id}.why`,
    fact: `fly.em.${id}.fact`,
  };
}
