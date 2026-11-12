// Pure Game Logic for Fly — BUILD_SEQUENCE.md S2 / plan.md §7 row 2
// Completely pure: no canvas, no DOM, deterministic and unit-tested.

import type { FlyCommand, FlyConfig, FlyState, Lane, Obstacle, Collectible, PopText, PowerKind, ObstacleKind } from './types';

export const HOP_DURATION = 0.65; // seconds
export const STUMBLE_DURATION = 1.2; // seconds invulnerability after hit
export const POWER_DURATION = 6.0; // seconds
export const SPAWN_AHEAD_DISTANCE = 110; // meters

/** Maps today's NOAA Kp reading to starting speed and speed-up tier. */
export function determineSpeedConfig(kp: number, badge: 'NASA LIVE' | 'NASA ARCHIVE' = 'NASA ARCHIVE'): FlyConfig {
  const roundedKp = Math.max(0, Math.min(9, Math.round(kp)));
  if (roundedKp >= 7) {
    return { baseSpeed: 21, speedTier: 'fast', kp: roundedKp, badge };
  }
  if (roundedKp >= 4) {
    return { baseSpeed: 17, speedTier: 'medium', kp: roundedKp, badge };
  }
  return { baseSpeed: 13, speedTier: 'slow', kp: roundedKp, badge };
}

/** Simple fast seedable pseudo-random number generator (Mulberry32). */
export function createRng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let nextEntityId = 1;

export function createInitialState(config?: Partial<FlyConfig>, seed = 42): FlyState {
  const initialSpeed = config?.baseSpeed ?? 14;
  return {
    lane: 0,
    targetLane: 0,
    laneX: 0,
    isHopping: false,
    hopTime: 0,
    hopHeight: 0,
    distance: 0,
    speed: initialSpeed,
    hull: 3,
    stardust: 0,
    stumbleTimer: 0,
    activePower: null,
    powerRemaining: 0,
    obstacles: [],
    items: [],
    pops: [],
    gameOver: false,
    spawnZ: 25, // first obstacle starts 25m ahead
    seed,
  };
}

/** Pure step update for delta time dt (in seconds). */
export function stepGame(state: FlyState, dt: number, commands: FlyCommand[] = [], config?: FlyConfig): FlyState {
  if (state.gameOver) return state;

  // Cap dt to prevent massive jumps on frame lag or tab restore
  const clampedDt = Math.min(0.1, Math.max(0.001, dt));

  let {
    lane,
    targetLane,
    laneX,
    isHopping,
    hopTime,
    hopHeight,
    distance,
    speed,
    hull,
    stardust,
    stumbleTimer,
    activePower,
    powerRemaining,
    obstacles,
    items,
    pops,
    spawnZ,
    seed,
  } = state;
  let gameOver = state.gameOver as boolean;

  const rng = createRng(seed);

  // 1. Process Input Commands
  for (const cmd of commands) {
    if (cmd === 'moveLeft') {
      if (targetLane > -1) targetLane = (targetLane - 1) as Lane;
    } else if (cmd === 'moveRight') {
      if (targetLane < 1) targetLane = (targetLane + 1) as Lane;
    } else if (cmd === 'hop') {
      if (!isHopping) {
        isHopping = true;
        hopTime = 0;
      }
    }
  }

  // 2. Smooth lane movement (lerp)
  const laneSpeed = 10; // how fast pilot shifts lanes
  laneX += (targetLane - laneX) * Math.min(1, clampedDt * laneSpeed);
  if (Math.abs(targetLane - laneX) < 0.02) {
    laneX = targetLane;
    lane = targetLane;
  }

  // 3. Hopping Physics (parabolic arc)
  if (isHopping) {
    hopTime += clampedDt;
    if (hopTime >= HOP_DURATION) {
      isHopping = false;
      hopTime = 0;
      hopHeight = 0;
    } else {
      const progress = hopTime / HOP_DURATION;
      // Parabolic jump curve reaching apex at progress = 0.5
      hopHeight = 4 * progress * (1 - progress);
    }
  }

  // 4. Power & Invulnerability Timers
  if (powerRemaining > 0) {
    powerRemaining -= clampedDt;
    if (powerRemaining <= 0) {
      activePower = null;
      powerRemaining = 0;
    }
  }

  if (stumbleTimer > 0) {
    stumbleTimer -= clampedDt;
  }

  // 5. Speed acceleration with distance
  const baseSpd = config?.baseSpeed ?? 14;
  const boostMultiplier = activePower === 'boost' ? 1.4 : 1.0;
  // +0.6 m/s per 100 meters
  speed = (baseSpd + (distance / 100) * 0.6) * boostMultiplier;

  // Move distance forward
  const deltaDistance = speed * clampedDt;
  distance += deltaDistance;

  // 6. Move obstacles & items towards pilot (z decreases)
  const updatedObstacles: Obstacle[] = [];
  const updatedItems: Collectible[] = [];
  const newPops: PopText[] = pops
    .map((p) => ({ ...p, y: p.y - clampedDt * 1.5, age: p.age + clampedDt }))
    .filter((p) => p.age < 0.9);

  // 7. Collision Detection: Obstacles with swept bounding box
  for (const obs of obstacles) {
    const nextZ = obs.z - deltaDistance;
    let isPassed = obs.passed;

    // Check swept collision box: z within [-0.8, 0.8] meters from pilot
    const minZ = Math.min(obs.z, nextZ);
    const maxZ = Math.max(obs.z, nextZ);
    const inZRange = maxZ >= -0.8 && minZ <= 0.8;
    const inLane = Math.abs(laneX - obs.lane) < 0.55;

    if (inZRange && inLane && !isPassed && stumbleTimer <= 0) {
      isPassed = true;
      if (obs.kind === 'lowRock' && hopHeight > 0.38) {
        // Successfully hopped over low rock!
      } else if (activePower === 'boost') {
        // Boost destroys / passes through obstacles safely!
        newPops.push({
          id: nextEntityId++,
          text: 'SMASH!',
          lane: obs.lane,
          y: 1.2,
          color: '#E8338B',
          age: 0,
        });
      } else if (activePower === 'shield') {
        // Shield absorbs the blow!
        activePower = null;
        powerRemaining = 0;
        stumbleTimer = STUMBLE_DURATION;
        newPops.push({
          id: nextEntityId++,
          text: 'SHIELD SAVED!',
          lane: obs.lane,
          y: 1.2,
          color: '#22D7E6',
          age: 0,
        });
      } else {
        // Hit taken: lose 1 hull pip
        hull -= 1;
        stumbleTimer = STUMBLE_DURATION;
        newPops.push({
          id: nextEntityId++,
          text: '-1 HULL',
          lane: obs.lane,
          y: 1.2,
          color: '#D93A3A',
          age: 0,
        });
        if (hull <= 0) {
          gameOver = true;
        }
      }
    }

    if (nextZ > -10) {
      updatedObstacles.push({ ...obs, z: nextZ, passed: isPassed });
    }
  }

  // 8. Collectible Items with swept bounding box
  for (const item of items) {
    let itemZ = item.z - deltaDistance;
    let itemLane = item.lane;
    let isCollected = item.collected;

    // Magnet Effect: pulls stardust within 18m towards pilot's current position
    if (activePower === 'magnet' && item.kind === 'stardust' && itemZ > 0 && itemZ < 18) {
      const pullSpeed = 16 * clampedDt;
      itemLane = (itemLane + (laneX - itemLane) * Math.min(1, pullSpeed)) as Lane;
      itemZ -= pullSpeed * 0.8;
    }

    const minItemZ = Math.min(item.z, itemZ);
    const maxItemZ = Math.max(item.z, itemZ);
    const inZRange = maxItemZ >= -1.0 && minItemZ <= 1.0;
    const inLane = Math.abs(laneX - itemLane) < 0.65;

    if (inZRange && inLane && !isCollected) {
      isCollected = true;
      if (item.kind === 'stardust') {
        const value = activePower === 'boost' ? 2 : 1;
        stardust += value;
        newPops.push({
          id: nextEntityId++,
          text: value === 2 ? '+2 ✦' : '+1 ✦',
          lane: item.lane,
          y: 1.0,
          color: '#F5B700',
          age: 0,
        });
      } else {
        // Power pickup!
        activePower = item.kind;
        powerRemaining = POWER_DURATION;
        newPops.push({
          id: nextEntityId++,
          text: item.kind.toUpperCase() + '!',
          lane: item.lane,
          y: 1.3,
          color: item.kind === 'shield' ? '#22D7E6' : item.kind === 'magnet' ? '#F5B700' : '#E8338B',
          age: 0,
        });
      }
    }

    if (itemZ > -10 && !isCollected) {
      updatedItems.push({ ...item, z: itemZ, lane: itemLane, collected: isCollected });
    }
  }

  // 9. Procedural Generation: Spawn new obstacles and items ahead
  let newSpawnZ = spawnZ - deltaDistance;
  while (newSpawnZ < SPAWN_AHEAD_DISTANCE) {
    const groupDist = 18 + rng() * 12; // spawn cluster every 18-30 meters
    newSpawnZ += groupDist;

    // Decide obstacle setup for this cluster
    const roll = rng();
    const clearLane: Lane = (Math.floor(rng() * 3) - 1) as Lane; // always guarantee at least 1 open lane

    if (roll < 0.65) {
      // Spawn 1 or 2 obstacles
      const blockedLanes: Lane[] = ([-1, 0, 1] as Lane[]).filter((l) => l !== clearLane);
      const isLow = rng() < 0.45;
      const kind: ObstacleKind = isLow ? 'lowRock' : 'tallRock';

      // Pick first blocked lane
      updatedObstacles.push({
        id: nextEntityId++,
        lane: blockedLanes[0],
        z: newSpawnZ,
        kind,
      });

      // 40% chance of second obstacle on other lane (leaving clearLane open)
      if (rng() < 0.4 && blockedLanes.length > 1) {
        updatedObstacles.push({
          id: nextEntityId++,
          lane: blockedLanes[1],
          z: newSpawnZ,
          kind: rng() < 0.5 ? 'lowRock' : 'debris',
        });
      }
    }

    // Spawn stardust line or arc in clear lane
    const dustCount = 3 + Math.floor(rng() * 3);
    for (let d = 0; d < dustCount; d++) {
      updatedItems.push({
        id: nextEntityId++,
        lane: clearLane,
        z: newSpawnZ - 8 + d * 3.5,
        kind: 'stardust',
      });
    }

    // Occasional Power Pickup (~15% chance per cluster)
    if (rng() < 0.15) {
      const powers: PowerKind[] = ['shield', 'magnet', 'boost'];
      const pickedPower = powers[Math.floor(rng() * powers.length)];
      updatedItems.push({
        id: nextEntityId++,
        lane: clearLane,
        z: newSpawnZ + 4,
        kind: pickedPower,
      });
    }

    seed = (seed + 1337) >>> 0;
  }

  return {
    lane,
    targetLane,
    laneX,
    isHopping,
    hopTime,
    hopHeight,
    distance,
    speed,
    hull,
    stardust,
    stumbleTimer,
    activePower,
    powerRemaining,
    obstacles: updatedObstacles,
    items: updatedItems,
    pops: newPops,
    gameOver,
    spawnZ: newSpawnZ,
    seed,
  };
}
