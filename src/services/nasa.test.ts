// Tests for NASA Data Service — BUILD_SEQUENCE.md D1
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getSpaceWeather,
  getKpToday,
  getEarthToday,
  getApod,
  getMarsWeather,
  getPlantStudy,
  getNearEarthAsteroids,
} from './nasa';

describe('NASA Data Service', () => {
  const originalFetch = globalThis.fetch;
  const storageMap = new Map<string, string>();
  const mockSessionStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => { storageMap.set(k, v); },
    removeItem: (k: string) => { storageMap.delete(k); },
    clear: () => { storageMap.clear(); },
    get length() { return storageMap.size; },
    key: (i: number) => Array.from(storageMap.keys())[i] ?? null,
  };

  beforeEach(() => {
    storageMap.clear();
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: mockSessionStorage,
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('Live fetch success', () => {
    it('returns NASA LIVE badge for successful NOAA Kp fetch', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          { time_tag: '2026-11-12T00:00:00', Kp: 3.33 },
          { time_tag: '2026-11-12T03:00:00', Kp: 4.67 },
        ],
      } as Response);

      const res = await getKpToday();
      expect(res.badge).toBe('NASA LIVE');
      expect(res.data).toBe(4.67);
      expect(new Date(res.fetchedAt).getTime()).toBeGreaterThan(0);
    });

    it('returns NASA LIVE badge for successful EPIC Earth fetch', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          {
            image: 'epic_1b_20261112010203',
            date: '2026-11-12 01:02:03',
            caption: 'DSCOVR EPIC earth view',
          },
        ],
      } as Response);

      const res = await getEarthToday();
      expect(res.badge).toBe('NASA LIVE');
      expect(res.data.image).toBe('epic_1b_20261112010203');
      expect(res.data.pngUrl).toContain('2026/11/12/png/epic_1b_20261112010203.png');
    });

    it('returns NASA LIVE badge for usable APOD image', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          date: '2026-11-12',
          title: 'Deep Cosmos',
          url: 'https://apod.nasa.gov/apod/image/2611/cosmos.jpg',
          media_type: 'image',
          explanation: 'A view into deep cosmos',
        }),
      } as Response);

      const res = await getApod();
      expect(res.badge).toBe('NASA LIVE');
      expect(res.data.title).toBe('Deep Cosmos');
      expect(res.data.url).toBe('https://apod.nasa.gov/apod/image/2611/cosmos.jpg');
    });

    it('returns NASA LIVE badge for successful NeoWs fetch', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          element_count: 5,
          near_earth_objects: {
            '2026-11-12': [
              {
                name: 'Ast 1',
                is_potentially_hazardous_asteroid: false,
                close_approach_data: [
                  { close_approach_date: '2026-11-12', miss_distance: { kilometers: '1000000' } },
                ],
              },
            ],
          },
        }),
      } as Response);

      const res = await getNearEarthAsteroids();
      expect(res.badge).toBe('NASA LIVE');
      expect(res.data.count).toBe(5);
      expect(res.data.closest.length).toBe(1);
    });

    it('returns NASA LIVE badge for live geomagnetic storm in DONKI', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [
          {
            gstID: '2026-11-12-GST-001',
            startTime: '2026-11-12T04:00:00Z',
            allKpIndex: [{ observedTime: '2026-11-12T04:00:00Z', kpIndex: 7.0, source: 'NOAA' }],
          },
        ],
      } as Response);

      const res = await getSpaceWeather();
      expect(res.badge).toBe('NASA LIVE');
      expect(res.data.kpIndex).toBe(7.0);
      expect(res.data.isArchiveMay2024).toBe(false);
    });
  });

  describe('Timeout handling', () => {
    it('falls back to NASA ARCHIVE on fetch timeout', async () => {
      globalThis.fetch = vi.fn().mockImplementation(
        () =>
          new Promise((_, reject) => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            setTimeout(() => reject(err), 10);
          })
      );

      const res = await getKpToday();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(typeof res.data).toBe('number');
    });
  });

  describe('HTTP 429 rate-limit handling', () => {
    it('falls back to NASA ARCHIVE on 429 rate limit response', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ error: { code: 'OVER_RATE_LIMIT' } }),
      } as Response);

      const res = await getSpaceWeather();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(res.data.isArchiveMay2024).toBe(true);
      expect(res.data.kpIndex).toBe(9.0);
    });
  });

  describe('Empty / invalid answer handling', () => {
    it('falls back to NASA ARCHIVE on empty response from EPIC', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      } as Response);

      const res = await getEarthToday();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(res.data.pngUrl).toBeDefined();
    });

    it('falls back to NASA ARCHIVE when APOD returns placeholder with NASA logo', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          title: 'NASA Science',
          media_type: 'image',
          url: 'https://science.nasa.gov/assets/images/nasa-logo@2x.png',
        }),
      } as Response);

      const res = await getApod();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(res.data.title).not.toBe('NASA Science');
      expect(res.data.url).not.toContain('nasa-logo');
    });
  });

  describe('SessionStorage Caching', () => {
    it('only calls fetch once per session and caches the result', async () => {
      let fetchCount = 0;
      globalThis.fetch = vi.fn().mockImplementation(async () => {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => [{ time_tag: '2026-11-12T00:00:00', Kp: 2.67 }],
        } as Response;
      });

      const first = await getKpToday();
      expect(first.badge).toBe('NASA LIVE');
      expect(first.data).toBe(2.67);
      expect(fetchCount).toBe(1);

      const second = await getKpToday();
      expect(second.badge).toBe('NASA LIVE');
      expect(second.data).toBe(2.67);
      expect(fetchCount).toBe(1); // Cached! Did not call fetch again.
    });
  });

  describe('Archive-only datasets', () => {
    it('getMarsWeather returns NASA ARCHIVE and sol data without fetching', () => {
      const fetchSpy = vi.fn();
      globalThis.fetch = fetchSpy;

      const res = getMarsWeather();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(res.data.length).toBeGreaterThan(0);
      expect(res.data.some((s) => s.sol === '675')).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('getPlantStudy returns NASA ARCHIVE for OSD-268 Veggie study without fetching', () => {
      const fetchSpy = vi.fn();
      globalThis.fetch = fetchSpy;

      const res = getPlantStudy();
      expect(res.badge).toBe('NASA ARCHIVE');
      expect(res.data.accession).toBe('OSD-268');
      expect(res.data.finding).toContain('lettuce');
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });
});
