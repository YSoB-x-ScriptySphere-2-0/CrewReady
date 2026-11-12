// Pure storm size calculation — BUILD_SEQUENCE.md D2a / docs/06 §3
// Maps real NASA DONKI and NOAA SWPC readings to game storm strength X.
// No React, no network, completely pure.

export type StormSize = 10 | 20 | 30;
export type StormTier = 'Small' | 'Medium' | 'Large';

export interface StormReading {
  /** True if a Solar Energetic Particle event occurred in the window */
  hasSep?: boolean;
  /** Geomagnetic Kp index (0 to 9) */
  kp?: number | null;
  /** Alternative field name from DONKI GST allKpIndex */
  kpIndex?: number | null;
  /** Coronal Mass Ejection speed in km/s */
  cmeSpeed?: number | null;
  /** Optional date/time tag */
  time?: string;
}

/**
 * Pure calculation of storm strength X according to docs/06 §3:
 *
 * Real reading                                                              | Size   | X
 * ------------------------------------------------------------------------- | ------ | --
 * SEP event in window OR geomagnetic Kp >= 8 OR CME speed >= 1500 km/s      | Large  | 30
 * Kp 6–7 OR CME speed 800–1499 km/s                                         | Medium | 20
 * Anything weaker, or no events                                             | Small  | 10
 */
export function stormSize(reading?: StormReading | null): StormSize {
  if (!reading) return 10;

  const { hasSep, kp, kpIndex, cmeSpeed } = reading;
  const effectiveKp = typeof kp === 'number' ? kp : typeof kpIndex === 'number' ? kpIndex : 0;
  const effectiveSpeed = typeof cmeSpeed === 'number' ? cmeSpeed : 0;

  // Row 1: Large (X = 30)
  if (hasSep === true || effectiveKp >= 8 || effectiveSpeed >= 1500) {
    return 30;
  }

  // Row 2: Medium (X = 20)
  if (effectiveKp >= 6 || effectiveSpeed >= 800) {
    return 20;
  }

  // Row 3: Small (X = 10)
  return 10;
}

/** Returns the kid-friendly size category: 'Small', 'Medium', or 'Large'. */
export function stormTier(x: number): StormTier {
  if (x >= 30) return 'Large';
  if (x >= 20) return 'Medium';
  return 'Small';
}

/**
 * Returns the stronger of two storm sizes.
 * Level 6 rule: "Level 6 always uses the stronger of live and archive."
 */
export function strongerStorm(a: number, b: number): StormSize {
  const max = Math.max(a, b);
  if (max >= 30) return 30;
  if (max >= 20) return 20;
  return 10;
}
