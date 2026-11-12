// Pure resources and cargo upgrade logic — BUILD_SEQUENCE.md S4 / plan.md §7 row 4
import type { GameState, Meter } from './types';
import { getFlyStats } from '../fly/storage';

export type MeterKey = Meter;

export const MAX_CARGO_SLOTS = 4;
export const MAX_TIER_PER_SYSTEM = 2;
export const BONUS_PER_TIER = 5;
export const TIER_COSTS: Record<number, number> = {
  1: 15,
  2: 30,
};

export interface UpgradeStatus {
  tier: number; // 0, 1, 2
  bonus: number; // 0, 5, 10
  nextCost: number | null; // null if maxed
}

const STORAGE_KEY = 'crewready_cargo_upgrades';

export type UpgradesState = Record<MeterKey, number>;

const DEFAULT_UPGRADES: UpgradesState = {
  P: 0,
  L: 0,
  F: 0,
  S: 0,
};

export function loadUpgrades(): UpgradesState {
  try {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_UPGRADES };
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...DEFAULT_UPGRADES };
    const parsed = JSON.parse(saved);
    return {
      P: Math.min(MAX_TIER_PER_SYSTEM, Math.max(0, Number(parsed.P) || 0)),
      L: Math.min(MAX_TIER_PER_SYSTEM, Math.max(0, Number(parsed.L) || 0)),
      F: Math.min(MAX_TIER_PER_SYSTEM, Math.max(0, Number(parsed.F) || 0)),
      S: Math.min(MAX_TIER_PER_SYSTEM, Math.max(0, Number(parsed.S) || 0)),
    };
  } catch {
    return { ...DEFAULT_UPGRADES };
  }
}

export function saveUpgrades(state: UpgradesState): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Ignore quota issues
  }
}

export function countTotalSlots(upgrades: UpgradesState): number {
  return upgrades.P + upgrades.L + upgrades.F + upgrades.S;
}

export function getSystemStatus(meter: MeterKey, upgrades: UpgradesState): UpgradeStatus {
  const tier = upgrades[meter] || 0;
  const bonus = tier * BONUS_PER_TIER;
  const nextCost = tier < MAX_TIER_PER_SYSTEM ? TIER_COSTS[tier + 1] : null;
  return { tier, bonus, nextCost };
}

export interface PurchaseCheck {
  allowed: boolean;
  reason: string;
  cost: number;
}

export function checkPurchase(
  meter: MeterKey,
  upgrades: UpgradesState,
  stardust: number
): PurchaseCheck {
  const currentTier = upgrades[meter] || 0;
  if (currentTier >= MAX_TIER_PER_SYSTEM) {
    return { allowed: false, reason: 'Maxed (+10)', cost: 0 };
  }

  const totalSlots = countTotalSlots(upgrades);
  if (totalSlots >= MAX_CARGO_SLOTS) {
    return { allowed: false, reason: 'Cargo Full (4/4)', cost: 0 };
  }

  const cost = TIER_COSTS[currentTier + 1];
  if (stardust < cost) {
    return { allowed: false, reason: `Need ${cost} ✦`, cost };
  }

  return { allowed: true, reason: `Pack +5 (${cost} ✦)`, cost };
}

export function buyCargoUpgrade(
  meter: MeterKey,
  onSpendStardust?: (amount: number) => boolean
): { success: boolean; reason?: string } {
  const current = loadUpgrades();
  const flyStats = getFlyStats();
  const check = checkPurchase(meter, current, flyStats.totalStardust);

  if (!check.allowed) {
    return { success: false, reason: check.reason };
  }

  // Deduct stardust
  if (onSpendStardust) {
    const ok = onSpendStardust(check.cost);
    if (!ok) return { success: false, reason: `Need ${check.cost} ✦` };
  } else {
    // Fallback direct storage deduction
    try {
      if (typeof localStorage !== 'undefined') {
        const newDust = Math.max(0, flyStats.totalStardust - check.cost);
        localStorage.setItem('crewready_fly_total_stardust', newDust.toString());
      }
    } catch {
      return { success: false, reason: 'Storage error' };
    }
  }

  // Apply upgrade
  const updated: UpgradesState = {
    ...current,
    [meter]: current[meter] + 1,
  };
  saveUpgrades(updated);
  return { success: true };
}

export function refundAllCargo(
  onAddStardust?: (amount: number) => void
): { refundedStardust: number } {
  const current = loadUpgrades();
  let totalSpent = 0;

  for (const m of ['P', 'L', 'F', 'S'] as MeterKey[]) {
    const tier = current[m] || 0;
    if (tier >= 1) totalSpent += TIER_COSTS[1];
    if (tier >= 2) totalSpent += TIER_COSTS[2];
  }

  if (totalSpent > 0) {
    if (onAddStardust) {
      onAddStardust(totalSpent);
    } else {
      try {
        if (typeof localStorage !== 'undefined') {
          const stats = getFlyStats();
          localStorage.setItem('crewready_fly_total_stardust', (stats.totalStardust + totalSpent).toString());
        }
      } catch {
        // Ignore quota issues
      }
    }
  }

  saveUpgrades({ ...DEFAULT_UPGRADES });
  return { refundedStardust: totalSpent };
}

export function getUpgradedStartingMeters(base = 40): Record<MeterKey, number> {
  const upgrades = loadUpgrades();
  return {
    P: base + upgrades.P * BONUS_PER_TIER,
    L: base + upgrades.L * BONUS_PER_TIER,
    F: base + upgrades.F * BONUS_PER_TIER,
    S: base + upgrades.S * BONUS_PER_TIER,
  };
}

export function applyResourcesToGameState(state: GameState): GameState {
  const starting = getUpgradedStartingMeters(40);
  return {
    ...state,
    meters: {
      P: Math.max(state.meters.P, starting.P),
      L: Math.max(state.meters.L, starting.L),
      F: Math.max(state.meters.F, starting.F),
      S: Math.max(state.meters.S, starting.S),
    },
  };
}
