// Tests for Training screen — BUILD_SEQUENCE.md S3
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Training } from './Training';

describe('Training screen (S3)', () => {
  it('renders sleepy Twinkle and three locked training modules', () => {
    const html = renderToString(<Training />);

    // Header & Coming Soon
    expect(html).toContain('Astronaut Training Academy');
    expect(html).toContain('Coming in Next Update');

    // Twinkle Sleepy banner
    expect(html).toContain('Twinkle is calibrating the simulators');
    expect(html).toContain('twinkle-sleepy');

    // 3 Modules
    expect(html).toContain('Mind Simulator');
    expect(html).toContain('Astronaut Fitness');
    expect(html).toContain('NASA Mission Reels');

    // Padlocked indicator
    expect(html).toContain('LOCKED');
    expect(html).toContain('Tap to check readiness');
  });
});
