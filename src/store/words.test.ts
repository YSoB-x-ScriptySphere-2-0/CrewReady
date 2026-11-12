// L2: collected words are kept, are not collected twice, and survive a reload.
import { beforeEach, describe, expect, it } from 'vitest';
import { useWords } from './words';

describe('Space Book store', () => {
  beforeEach(() => useWords.getState().reset());
  it('a first tap collects the word and a second tap does not add it again', () => {
    useWords.getState().show('sol');
    expect(useWords.getState().open).toEqual({ id: 'sol', isNew: true });
    useWords.getState().close();
    useWords.getState().show('sol');
    expect(useWords.getState().open?.isNew).toBe(false);
    expect(useWords.getState().collected).toEqual(['sol']);
  });
  it('an unknown word is ignored', () => {
    useWords.getState().show('nope');
    expect(useWords.getState().collected).toEqual([]);
  });
  it('is saved only as the list of collected ids (the open card is not saved)', () => {
    useWords.getState().show('kp');
    const saved = useWords.persist.getOptions().partialize?.(useWords.getState());
    expect(saved).toEqual({ collected: ['kp'] });
  });
});
