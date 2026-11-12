// Tests for Resources screen — BUILD_SEQUENCE.md S4
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Resources } from './Resources';

describe('Resources screen (S4)', () => {
  it('renders all four system cards with facts and cargo slots', () => {
    const html = renderToString(<Resources />);

    // Header & Cargo Bay
    expect(html).toContain('Rocket Cargo &amp; Resources');
    expect(html).toContain('Cargo Bay Slots');
    expect(html).toContain('4');

    // 4 System Names
    expect(html).toContain('Power Grid');
    expect(html).toContain('Air &amp; Water');
    expect(html).toContain('Food Supply');
    expect(html).toContain('Radiation Shield');

    // Sourced kid facts
    expect(html).toContain('Mars gets less than half the sunlight Earth does');
    expect(html).toContain('The Space Station recycles about 98% of its water');
    expect(html).toContain('Growing food takes water and power');
    expect(html).toContain('Water tanks and food supplies make great storm shields');

    // Launch button
    expect(html).toContain('Launch Mission');
  });
});
