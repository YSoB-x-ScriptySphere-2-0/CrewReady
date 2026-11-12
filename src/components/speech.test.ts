// L2: Read to me picks a voice for the player's language, and there is no button when none fits.
import { describe, expect, it } from 'vitest';
import { pickVoice } from './speech';

const v = (lang: string, def = false) => ({ lang, default: def });

describe('pickVoice', () => {
  it('finds an English voice, preferring the default', () => {
    const a = v('en-GB');
    const b = v('en-US', true);
    expect(pickVoice([v('bn-BD'), a, b], 'en')).toBe(b);
  });
  it('finds a Bangla voice', () => expect(pickVoice([v('en-US'), v('bn-BD')], 'bn')?.lang).toBe('bn-BD'));
  it('returns nothing when the device has no voice for the language, so the button hides', () => {
    expect(pickVoice([v('en-US')], 'bn')).toBeUndefined();
    expect(pickVoice([], 'en')).toBeUndefined();
  });
  it('accepts underscore language tags', () => expect(pickVoice([v('en_US')], 'en')).toBeDefined());
});
