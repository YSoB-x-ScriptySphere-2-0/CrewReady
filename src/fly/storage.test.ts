import { beforeEach, describe, expect, it } from 'vitest';
import { getFlyStats, getFlyLeaderboard, recordRunEnd, spendStardust, FLY_RUNS_KEY, BEST_DIST_KEY } from './storage';
import { useWallet } from '../store/wallet';
import { useArcade } from '../store/arcade';

class MockStorage {
  private store = new Map<string, string>();
  getItem(k: string) { return this.store.get(k) ?? null; }
  setItem(k: string, v: string) { this.store.set(k, v); }
  removeItem(k: string) { this.store.delete(k); }
  clear() { this.store.clear(); }
}

describe('one shared stardust wallet', () => {
  beforeEach(() => {
    (globalThis as unknown as { localStorage: Storage }).localStorage = new MockStorage() as unknown as Storage;
    localStorage.clear();
    useWallet.getState().resetWallet();
  });

  it('a Fly run pays into the wallet that the HUD, hints and upgrades read', () => {
    recordRunEnd(120, 17);
    expect(useWallet.getState().stardust).toBe(17);
    expect(getFlyStats().totalStardust).toBe(17);
  });

  it('spending (hints, upgrades) comes out of the same balance and cannot go negative', () => {
    useWallet.getState().earn('fly', 8);
    expect(spendStardust(5)).toBe(true);
    expect(useWallet.getState().stardust).toBe(3);
    expect(spendStardust(5)).toBe(false);
    expect(useWallet.getState().stardust).toBe(3);
  });

  it('an arcade result is paid into the wallet', () => {
    const pay = useArcade.getState().submit('gems', 700, '2031-01-05');
    expect(pay.total).toBeGreaterThanOrEqual(25);
    expect(useWallet.getState().stardust).toBe(pay.total);
  });

  it('records fly runs in order of best distance and retrieves leaderboard', () => {
    localStorage.removeItem(FLY_RUNS_KEY);
    localStorage.removeItem(BEST_DIST_KEY);
    recordRunEnd(100, 10);
    recordRunEnd(350, 25);
    recordRunEnd(200, 15);

    const stats = getFlyStats();
    expect(stats.bestDistance).toBe(350);

    const board = getFlyLeaderboard();
    expect(board.length).toBe(3);
    expect(board[0].distance).toBe(350);
    expect(board[1].distance).toBe(200);
    expect(board[2].distance).toBe(100);
  });
});
