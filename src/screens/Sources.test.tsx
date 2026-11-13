// Tests for Sources screen — BUILD_SEQUENCE.md S1
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Sources } from './Sources';

describe('Sources screen (S1)', () => {
  it('renders the Sources page with all key sections', () => {
    const html = renderToString(<Sources />);

    // 1. Title & Header
    expect(html).toContain('Sources, Credits &amp; Science');
    expect(html).toContain('NASA Space Apps Challenge 2026');

    // 2. All 9 NASA & NOAA datasets
    expect(html).toContain('DONKI');
    expect(html).toContain('Planetary K-index');
    expect(html).toContain('NeoWs');
    expect(html).toContain('EPIC');
    expect(html).toContain('InSight Mars Weather');
    expect(html).toContain('OSDR');
    expect(html).toContain('APOD');
    expect(html).toContain('NASA Image and Video Library');
    expect(html).toContain('NASA Technical Reports Server');

    // 3. What We Simplified
    expect(html).toContain('What We Simplified');
    expect(html).toContain('Air &amp; Water');
    expect(html).toContain('Four meters from 0 to 100');

    // 4. Honesty Note (word for word)
    expect(html).toContain('The asteroid and the Mars Continuity Programme are fiction made for this game');
    expect(html).toContain('NASA tracks near-Earth asteroids and tests ways to deflect them');
    expect(html).toContain('Everything else — the storms, the dust, the delay, the lettuce — is real');

    // 5. Image & Third-Party Credits
    expect(html).toContain('Photography &amp; Media Credits');
    expect(html).toContain('Generated &amp; Third-Party Content');
    expect(html).toContain('ChatGPT image generation');
    expect(html).toContain('Barkat Ullah Shah Riyad');

    // 6. The Team
    expect(html).toContain('The Team');
    expect(html).toContain('Team Lead &amp; Systems Architect');

    // 7. Use It in Class
    expect(html).toContain('Use It in Class');
    expect(html).toContain('15-minute STEM classroom activity');
    expect(html).toContain('A rocket can’t carry everything');
  });

  it('contains valid external links with secure target and rel attributes', () => {
    const html = renderToString(<Sources />);
    expect(html).toContain('href="https://ccmc.gsfc.nasa.gov/tools/DONKI/"');
    expect(html).toContain('href="https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"');
    expect(html).toContain('href="https://epic.gsfc.nasa.gov/"');
    expect(html).toContain('href="https://science.nasa.gov/apod/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });
});
