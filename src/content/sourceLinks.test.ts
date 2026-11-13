import { describe, expect, it } from 'vitest';
import { ALL_SOURCE_URLS, linksForSource } from './sourceLinks';
import { LEVELS } from './levels';
import { EXPLAIN_ENTRIES } from './explain';

describe('source links', () => {
  it('only uses https NASA / NOAA hosts', () => {
    for (const u of ALL_SOURCE_URLS) {
      expect(u).toMatch(/^https:\/\/([a-z0-9-]+\.)*(nasa\.gov|noaa\.gov)\//);
    }
  });
  it('links every level and explain-card citation', () => {
    for (const l of LEVELS) expect(linksForSource(l.source).length).toBeGreaterThan(0);
    for (const e of EXPLAIN_ENTRIES) expect(linksForSource(e.source).length).toBeGreaterThan(0);
  });
  it('splits a multi-part citation into several links', () => {
    const links = linksForSource('Storm: NASA DONKI + NOAA SWPC · Radiation: NASA Human Research Program');
    expect(links.map((l) => l.label)).toEqual(['NASA DONKI', 'NOAA SWPC', 'NASA Human Research Program']);
  });
});
