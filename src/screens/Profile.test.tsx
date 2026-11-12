// Tests for Profile screen — BUILD_SEQUENCE.md S3
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Profile } from './Profile';

describe('Profile screen (S3)', () => {
  it('renders astronaut podiums, call-sign shuffle, trophies and settings', () => {
    const html = renderToString(<Profile />);

    // Header & Rank
    expect(html).toContain('Astronaut Profile &amp; Quarters');
    expect(html).toContain('Rank:');
    expect(html).toContain('Call-sign:');

    // Both Astronaut Podiums
    expect(html).toContain('ORBIT');
    expect(html).toContain('Teal Suit');
    expect(html).toContain('NOVA');
    expect(html).toContain('Pink Suit');

    // Trophies / Badges
    expect(html).toContain('Mission Badges');
    expect(html).toContain('Space Book');

    // Settings Toggles
    expect(html).toContain('Language');
    expect(html).toContain('Sound');
    expect(html).toContain('Motion');
    expect(html).toContain('Intro');
    expect(html).toContain('Reset All Local Save Data');
  });
});
