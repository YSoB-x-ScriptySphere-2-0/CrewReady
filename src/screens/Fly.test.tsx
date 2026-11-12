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

  it('renders flight briefing with obstacles and power-ups instructions', () => {
    const html = renderToString(<Fly />);

    // Obstacles section
    expect(html).toContain('Martian Obstacles');
    expect(html).toContain('Low Rock Ridge');
    expect(html).toContain('Tall Spire Monolith');
    expect(html).toContain('Orbital Space Debris');

    // Power-ups section
    expect(html).toContain('Spacecraft Power-Ups');
    expect(html).toContain('Shield (Cyan)');
    expect(html).toContain('Magnet (Gold)');
    expect(html).toContain('Boost (Magenta)');
  });
});
