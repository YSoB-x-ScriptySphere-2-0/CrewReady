// Unit tests for Resources & Cargo upgrades — BUILD_SEQUENCE.md S4
import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkPurchase,
  countTotalSlots,
  getSystemStatus,
  loadUpgrades,
  saveUpgrades,
  buyCargoUpgrade,
  refundAllCargo,
  getUpgradedStartingMeters,
  applyResourcesToGameState,
  applyUpgradesToState,
  MAX_CARGO_SLOTS,
  type UpgradesState,
} from './resources';
import { startMission } from './engine';

class MockStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

describe('Cargo Resources & Upgrades (S4)', () => {
  beforeEach(() => {
    (globalThis as unknown as { localStorage: Storage }).localStorage = new MockStorage() as unknown as Storage;
  });

  it('starts with default zero upgrades and 40 starting meters', () => {
    const upgrades = loadUpgrades();
    expect(upgrades).toEqual({ P: 0, L: 0, F: 0, S: 0 });
    expect(countTotalSlots(upgrades)).toBe(0);

    const starting = getUpgradedStartingMeters(40);
    expect(starting).toEqual({ P: 40, L: 40, F: 40, S: 40 });
  });

  it('calculates system status and tier bonus correctly', () => {
    const upgrades: UpgradesState = { P: 1, L: 2, F: 0, S: 0 };

    const pStatus = getSystemStatus('P', upgrades);
    expect(pStatus.tier).toBe(1);
    expect(pStatus.bonus).toBe(5);
    expect(pStatus.nextCost).toBe(30);

    const lStatus = getSystemStatus('L', upgrades);
    expect(lStatus.tier).toBe(2);
    expect(lStatus.bonus).toBe(10);
    expect(lStatus.nextCost).toBeNull(); // Maxed

    const fStatus = getSystemStatus('F', upgrades);
    expect(fStatus.tier).toBe(0);
    expect(fStatus.bonus).toBe(0);
    expect(fStatus.nextCost).toBe(15);
  });

  it('prevents purchase when stardust is insufficient and explains why', () => {
    const upgrades: UpgradesState = { P: 0, L: 0, F: 0, S: 0 };
    const check = checkPurchase('P', upgrades, 10); // cost is 15

    expect(check.allowed).toBe(false);
    expect(check.reason).toBe('Need 15 ✦');
    expect(check.cost).toBe(15);
  });

  it('allows purchase when stardust is sufficient', () => {
    const upgrades: UpgradesState = { P: 0, L: 0, F: 0, S: 0 };
    const check = checkPurchase('P', upgrades, 50);

    expect(check.allowed).toBe(true);
    expect(check.reason).toBe('Pack +5 (15 ✦)');
    expect(check.cost).toBe(15);
  });

  it('prevents upgrading beyond MAX_TIER_PER_SYSTEM (2 upgrades / +10)', () => {
    const upgrades: UpgradesState = { P: 2, L: 0, F: 0, S: 0 };
    const check = checkPurchase('P', upgrades, 100);

    expect(check.allowed).toBe(false);
    expect(check.reason).toBe('Maxed (+10)');
  });

  it('strictly enforces the 4-cargo slot limit and explains why', () => {
    // 4 slots filled: e.g. P:2, L:2, F:0, S:0 = 4 slots
    const fullUpgrades: UpgradesState = { P: 2, L: 2, F: 0, S: 0 };
    expect(countTotalSlots(fullUpgrades)).toBe(MAX_CARGO_SLOTS);

    const check = checkPurchase('F', fullUpgrades, 100);
    expect(check.allowed).toBe(false);
    expect(check.reason).toBe('Cargo Full (4/4)');

    // 4 slots filled as 1 each: P:1, L:1, F:1, S:1 = 4 slots
    const distributedFull: UpgradesState = { P: 1, L: 1, F: 1, S: 1 };
    const check2 = checkPurchase('P', distributedFull, 100);
    expect(check2.allowed).toBe(false);
    expect(check2.reason).toBe('Cargo Full (4/4)');
  });

  it('buys upgrade, persists state and deducts stardust', () => {
    localStorage.setItem('crewready_fly_total_stardust', '50');

    let spent = 0;
    const res = buyCargoUpgrade('P', (amt) => {
      spent += amt;
      return true;
    });

    expect(res.success).toBe(true);
    expect(spent).toBe(15);

    const current = loadUpgrades();
    expect(current.P).toBe(1);
    expect(countTotalSlots(current)).toBe(1);

    const starting = getUpgradedStartingMeters(40);
    expect(starting.P).toBe(45);
    expect(starting.L).toBe(40);
  });

  it('refunds all cargo and restores stardust', () => {
    const state: UpgradesState = { P: 1, L: 2, F: 0, S: 0 }; // 15 + 15 + 30 = 60 stardust
    saveUpgrades(state);

    let refunded = 0;
    const res = refundAllCargo((amt) => {
      refunded += amt;
    });

    expect(res.refundedStardust).toBe(60);
    expect(refunded).toBe(60);
    expect(loadUpgrades()).toEqual({ P: 0, L: 0, F: 0, S: 0 });
  });

  it('applies upgrades to GameState meters correctly', () => {
    saveUpgrades({ P: 1, L: 2, F: 0, S: 1 }); // P:+5, L:+10, S:+5
    const baseGame = startMission(20, 15);
    expect(baseGame.meters).toEqual({ P: 40, L: 40, F: 40, S: 40 });

    const upgradedGame = applyResourcesToGameState(baseGame);
    expect(upgradedGame.meters).toEqual({
      P: 45,
      L: 50,
      F: 40,
      S: 45,
    });
  });

  it('consumeUpgrades uses up packed cargo and adds bonus to launched mission (B1 item 1)', () => {
    saveUpgrades({ P: 1, L: 0, F: 0, S: 2 }); // P:+5, S:+10
    const baseGame = startMission(20, 15);

    const launchedGame = applyUpgradesToState(baseGame, true);
    expect(launchedGame.meters).toEqual({
      P: 45,
      L: 40,
      F: 40,
      S: 50,
    });

    // Upgrades must now be used up in storage
    expect(loadUpgrades()).toEqual({ P: 0, L: 0, F: 0, S: 0 });
  });
});
