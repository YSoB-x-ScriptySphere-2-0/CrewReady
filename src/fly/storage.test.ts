import { beforeEach, describe, expect, it } from 'vitest';
import { getFlyStats, recordRunEnd, spendStardust } from './storage';
import { useWallet } from '../store/wallet';
import { useArcade } from '../store/arcade';

describe('one shared stardust wallet', () => {
  beforeEach(() => useWallet.getState().resetWallet());

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
});
