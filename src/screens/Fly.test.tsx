// Tests for Fly screen — BUILD_SEQUENCE.md S2
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Fly } from './Fly';

describe('Fly screen (S2)', () => {
  it('renders start screen with FLY button and Kp weather info', () => {
    const html = renderToString(<Fly />);

    // Must have canvas
    expect(html).toContain('<canvas');

    // Initial state shows START OVERLAY with FLY button
    expect(html).toContain('Fly: Orbit Runner');
    expect(html).toContain('FLY');

    // Shows Kp space weather
    expect(html).toContain('Space weather today');
    expect(html).toContain('Kp');

    // Controls explanation
    expect(html).toContain('Tap left or right to change lanes');
  });
});
