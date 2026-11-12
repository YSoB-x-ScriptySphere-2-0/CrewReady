import { describe, it, expect, beforeEach } from 'vitest';
import { useWallet } from './wallet';

describe('useWallet store (K3)', () => {
  beforeEach(() => {
    useWallet.getState().resetWallet();
  });

  it('starts at 0 stardust and tracks earnings correctly', () => {
    const earned = useWallet.getState().earn('fly', 25);
    expect(earned).toBe(25);
    expect(useWallet.getState().stardust).toBe(25);
    expect(useWallet.getState().lifetimeStardust).toBe(25);
  });

  it('spends stardust when balance is sufficient, fails when insufficient', () => {
    useWallet.getState().earn('bonus', 50);
    const success = useWallet.getState().spend(30);
    expect(success).toBe(true);
    expect(useWallet.getState().stardust).toBe(20);

    const fail = useWallet.getState().spend(50);
    expect(fail).toBe(false);
    expect(useWallet.getState().stardust).toBe(20); // Unchanged
  });

  it('awards level_clear bonus only once per level', () => {
    const firstTry = useWallet.getState().earn('level_clear', 10, { levelId: 1 });
    expect(firstTry).toBe(10);
    expect(useWallet.getState().stardust).toBe(10);

    const secondTry = useWallet.getState().earn('level_clear', 10, { levelId: 1 });
    expect(secondTry).toBe(0);
    expect(useWallet.getState().stardust).toBe(10); // Still 10

    const nextLevel = useWallet.getState().earn('level_clear', 10, { levelId: 2 });
    expect(nextLevel).toBe(10);
    expect(useWallet.getState().stardust).toBe(20);
  });

  it('awards explain_card bonus only once per unique card', () => {
    const firstRead = useWallet.getState().earn('explain_card', 2, { cardId: 'solar-panel' });
    expect(firstRead).toBe(2);
    expect(useWallet.getState().stardust).toBe(2);

    const secondRead = useWallet.getState().earn('explain_card', 2, { cardId: 'solar-panel' });
    expect(secondRead).toBe(0);
    expect(useWallet.getState().stardust).toBe(2);

    const otherCard = useWallet.getState().earn('explain_card', 2, { cardId: 'radiation' });
    expect(otherCard).toBe(2);
    expect(useWallet.getState().stardust).toBe(4);
  });

  it('ignores negative and zero amounts', () => {
    const earnedNeg = useWallet.getState().earn('fly', -50);
    expect(earnedNeg).toBe(0);
    expect(useWallet.getState().stardust).toBe(0);

    const spendNeg = useWallet.getState().spend(-20);
    expect(spendNeg).toBe(true);
    expect(useWallet.getState().stardust).toBe(0);
  });
});
