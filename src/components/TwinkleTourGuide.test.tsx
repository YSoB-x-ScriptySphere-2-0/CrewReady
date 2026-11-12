// Tests for TwinkleTourGuide component
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { TwinkleTourGuide } from './TwinkleTourGuide';

describe('TwinkleTourGuide component', () => {
  it('renders Tour Guide with Twinkle, main buttons, and NASA/NOAA data sources', () => {
    const handleClose = vi.fn();
    const html = renderToString(<TwinkleTourGuide onClose={handleClose} initialStepIndex={0} />);

    // Check Twinkle tag & header
    expect(html).toContain("Twinkle&#x27;s Flight Deck Tour");

    // Check step 1 button
    expect(html).toContain('PLAY / CONTINUE');
    expect(html).toContain('Main Launch Button');

    // Check data source in small font
    expect(html).toContain('NASA &amp; NOAA Science Data Used');
    expect(html).toContain('NASA EPIC');
    expect(html).toContain('NASA DONKI');

    // Check buttons
    expect(html).toContain('Next');
    expect(html).toContain('Previous');
    expect(html).toContain('Skip to Intro');
  });

  it('renders Fly spacecraft step and its data sources', () => {
    const handleClose = vi.fn();
    const html = renderToString(<TwinkleTourGuide onClose={handleClose} initialStepIndex={1} />);

    expect(html).toContain('FLY (Orbital Spacecraft Runner)');
    expect(html).toContain('NOAA Space Weather Prediction Center');
    expect(html).toContain('Planetary K-Index');
  });
});
