// Types for Fly endless runner — BUILD_SEQUENCE.md S2 / plan.md §7 row 2

export type Lane = -1 | 0 | 1; // -1: Left, 0: Center, 1: Right

export type ObstacleKind = 'tallRock' | 'lowRock' | 'debris';
export type PowerKind = 'shield' | 'magnet' | 'boost';
export type ItemKind = 'stardust' | PowerKind;

export interface Obstacle {
  id: number;
  lane: Lane;
  z: number; // distance ahead in meters (0 is pilot position)
  kind: ObstacleKind;
  passed?: boolean;
}

export interface Collectible {
  id: number;
  lane: Lane;
  z: number;
  kind: ItemKind;
  yOffset?: number; // for arcs of stardust
  collected?: boolean;
}

export interface PopText {
  id: number;
  text: string;
  lane: Lane;
  y: number;
  color: string;
  age: number; // seconds
}

export type FlyCommand = 'moveLeft' | 'moveRight' | 'hop';

export interface FlyConfig {
  baseSpeed: number;
  speedTier: 'slow' | 'medium' | 'fast';
  kp: number;
  badge: 'NASA LIVE' | 'NASA ARCHIVE';
}

export interface FlyState {
  // Pilot spatial state
  lane: Lane;
  targetLane: Lane;
  laneX: number; // -1.0 to 1.0 (smooth interpolation)
  isHopping: boolean;
  hopTime: number; // seconds elapsed in hop
  hopHeight: number; // 0 to 1 normalized height

  // Progression & health
  distance: number; // meters traveled
  speed: number; // current speed in m/s
  hull: number; // 3 to 0
  stardust: number; // collected in this run
  stumbleTimer: number; // invulnerability countdown after hit (seconds)

  // Active power (one at a time, ~6 seconds)
  activePower: PowerKind | null;
  powerRemaining: number; // seconds left

  // Entities
  obstacles: Obstacle[];
  items: Collectible[];
  pops: PopText[];

  // Engine state
  gameOver: boolean;
  spawnZ: number; // furthest spawned point ahead
  seed: number;
}
