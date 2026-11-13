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

  it('renders leaderboard section with own records for both fly and missions', () => {
    const html = renderToString(<Profile />);

    // Leaderboard Section Header
    expect(html).toContain('Leaderboard &amp; Records');
    expect(html).toContain('Your Best Runs');

    // Both categories present in own records
    expect(html).toContain('Missions');
    expect(html).toContain('Fly Runner');
    expect(html).toContain('Best Outcome');
    expect(html).toContain('No Mission Records Yet');
    expect(html).toContain('Launch Mission');
  });

  it('mentions global and local leaderboards as coming to the next update', () => {
    const html = renderToString(<Profile />);

    // Global and local tabs/badges
    expect(html).toContain('Global');
    expect(html).toContain('Local');
    expect(html).toContain('Next update');

    // Informational callout text
    expect(html).toContain('Global &amp; Local Leaderboard');
    expect(html).toContain('coming to the next update');
  });
});
