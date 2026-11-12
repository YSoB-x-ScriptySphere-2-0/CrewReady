// NASA Data Service — BUILD_SEQUENCE.md D1 / docs/06 §2.3
// Fetches real NASA and NOAA datasets with 3-second timeout, sessionStorage cache,
// and automatic fallback to verified NASA ARCHIVE snapshots.

import { usableApod, type ApodEntry } from '../content/apod';

export type Badge = 'NASA LIVE' | 'NASA ARCHIVE';

export interface Result<T> {
  data: T;
  badge: Badge;
  fetchedAt: string;
}

export interface StormEvent {
  startTime: string;
  kpIndex: number;
  cmeSpeed?: number;
  hasSep?: boolean;
  activityID?: string;
  note?: string;
  sourceUrl?: string;
  isArchiveMay2024?: boolean;
}

export interface EpicImage {
  image: string;
  date: string;
  caption: string;
  pngUrl: string;
}

export interface Apod {
  date: string;
  title: string;
  url: string;
  explanation: string;
  media_type: 'image';
  copyright?: string;
}

export interface MarsSol {
  sol: string;
  firstUtc: string;
  temp: {
    av: number;
    mn: number;
    mx: number;
  };
}

export interface OsdrStudy {
  accession: string;
  title: string;
  mission: string;
  finding: string;
  details?: string;
  date?: string;
}

export interface NeoWsItem {
  name: string;
  hazardous: boolean;
  date: string;
  missKm: number | null;
}

export interface NeoWsSummary {
  startDate: string;
  endDate: string;
  count: number;
  closest: NeoWsItem[];
}

export interface NasaImageItem {
  nasaId: string;
  title: string;
  description: string;
  url: string;
}

// -------------------------------------------------------------
// Fallback archive data (pre-baked from real NASA archives)
// Guarantees zero failures even without network or disk access.
// -------------------------------------------------------------
const FALLBACK_DONKI: StormEvent = {
  startTime: '2024-05-10T15:00:00Z',
  kpIndex: 9.0,
  cmeSpeed: 1650,
  hasSep: true,
  activityID: '2024-05-10T15:00:00-GST-001',
  note: 'Extreme G5 geomagnetic storm (Kp 9.0) of 10–11 May 2024; SEP recorded 9 May 2024.',
  sourceUrl: 'https://api.nasa.gov/DONKI/',
  isArchiveMay2024: true,
};

const FALLBACK_NOAA_KP = 2.33;

const FALLBACK_EPIC: EpicImage = {
  image: 'epic_1b_20240511000000',
  date: '2024-05-11',
  caption: "NASA's EPIC camera aboard NOAA's DSCOVR spacecraft views the sunlit Earth from 1.5 million km away.",
  pngUrl: 'https://epic.gsfc.nasa.gov/archive/natural/2024/05/11/png/epic_1b_20240511000000.png',
};

const FALLBACK_APOD: Apod = {
  date: '2024-05-11',
  title: 'Aurora over Earth',
  url: 'https://apod.nasa.gov/apod/image/2405/Aurora_Spiss_1080.jpg',
  explanation: 'Strong solar storms produced vivid auroras seen around the world in May 2024.',
  media_type: 'image',
  copyright: 'Lorenzo Spiss',
};

const FALLBACK_INSIGHT_SOLS: MarsSol[] = [
  { sol: '675', firstUtc: '2020-10-19T18:32:20Z', temp: { av: -62.3, mn: -96.9, mx: -15.9 } },
  { sol: '676', firstUtc: '2020-10-20T19:11:55Z', temp: { av: -63.1, mn: -97.4, mx: -16.2 } },
  { sol: '677', firstUtc: '2020-10-21T19:51:30Z', temp: { av: -62.8, mn: -96.5, mx: -15.5 } },
  { sol: '678', firstUtc: '2020-10-22T20:31:05Z', temp: { av: -63.5, mn: -98.0, mx: -16.8 } },
  { sol: '679', firstUtc: '2020-10-23T21:10:40Z', temp: { av: -62.9, mn: -97.1, mx: -15.8 } },
  { sol: '680', firstUtc: '2020-10-24T21:50:15Z', temp: { av: -63.8, mn: -98.5, mx: -16.4 } },
  { sol: '681', firstUtc: '2020-10-25T22:29:50Z', temp: { av: -64.2, mn: -99.1, mx: -17.0 } },
];

const FALLBACK_OSDR: OsdrStudy = {
  accession: 'OSD-268',
  title: 'Microbiological and nutritional analysis of lettuce crops grown on the International Space Station-VEG01B',
  mission: 'International Space Station (ISS)',
  finding: 'Space-grown lettuce on the Space Station was safe to eat and had the same nutrients as lettuce grown on Earth.',
  details: 'Lettuce crops grown in the Veggie payload aboard the ISS were harvested and returned for chemical, microbiological and nutritional analysis.',
  date: 'August 2015',
};

const FALLBACK_NEOWS: NeoWsSummary = {
  startDate: '2026-11-11',
  endDate: '2026-11-17',
  count: 33,
  closest: [
    { name: '363790 (2005 JE46)', hazardous: true, date: '2026-11-13', missKm: 7696629 },
    { name: '(2019 VL5)', hazardous: false, date: '2026-11-13', missKm: 9547284 },
    { name: '(2019 XL)', hazardous: false, date: '2026-11-17', missKm: 15309843 },
    { name: '218017 (2001 XV266)', hazardous: false, date: '2026-11-14', missKm: 15974992 },
    { name: '(2018 LQ2)', hazardous: false, date: '2026-11-13', missKm: 17258672 },
  ],
};

const FALLBACK_IMAGES: NasaImageItem[] = [
  {
    nasaId: 'PIA24320',
    title: 'Mars Landing Sites, Including Perseverance',
    description: 'Perseverance landing site at Jezero Crater on Mars.',
    url: 'https://images-assets.nasa.gov/image/PIA24320/PIA24320~medium.jpg',
  },
  {
    nasaId: 'PIA19808',
    title: 'Fresh Food Grown in Space',
    description: 'Astronauts sample red romaine lettuce grown inside the Veggie facility aboard the ISS.',
    url: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
  },
  {
    nasaId: 'GSFC_20171208_Archive_e001435',
    title: 'Solar Eruption on the Sun',
    description: 'A massive coronal mass ejection erupts from the solar surface.',
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~medium.jpg',
  },
  {
    nasaId: 'PIA23692',
    title: 'InSight Lander on Mars',
    description: 'NASA InSight lander on the Martian surface with its solar arrays deployed.',
    url: 'https://images-assets.nasa.gov/image/PIA23692/PIA23692~medium.jpg',
  },
];

// -------------------------------------------------------------
// Utilities: Key access, Timeout, Caching, Snapshot loader
// -------------------------------------------------------------

function getKey(): string {
  // Use import.meta.env in Vite, fallback to process.env in tests/Node
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NASA_API_KEY) {
      return import.meta.env.VITE_NASA_API_KEY;
    }
  } catch {
    // Ignore in non-vite contexts
  }
  const nodeEnv = (globalThis as unknown as { process?: { env?: Record<string, string> } }).process?.env;
  if (nodeEnv?.VITE_NASA_API_KEY) {
    return nodeEnv.VITE_NASA_API_KEY;
  }
  return 'DEMO_KEY';
}

function getCached<T>(key: string): Result<T> | null {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const raw = sessionStorage.getItem(`crewready_nasa_${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as Result<T>;
  } catch {
    return null;
  }
}

function setCached<T>(key: string, result: Result<T>): void {
  try {
    if (typeof sessionStorage === 'undefined') return;
    sessionStorage.setItem(`crewready_nasa_${key}`, JSON.stringify(result));
  } catch {
    // Ignore storage quota or disabled storage
  }
}

async function fetchWithTimeout(url: string, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function loadSnapshotJson<T>(filename: string, fallback: T): Promise<{ data: T; fetchedAt: string }> {
  try {
    // In browser or Vitest with fetch available:
    if (typeof window !== 'undefined') {
      const base = (typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL) || './';
      const path = `${base}data/${filename}.json`.replace(/([^:]\/)\/+/g, '$1');
      const res = await fetch(path);
      if (res.ok) {
        const json = await res.json();
        return { data: json as T, fetchedAt: json.fetchedAt || '2024-05-11' };
      }
    }
  } catch {
    // Fall back to bundled data
  }
  return { data: fallback, fetchedAt: '2024-05-11' };
}

// -------------------------------------------------------------
// 1. Space Weather (DONKI)
// -------------------------------------------------------------
export async function getSpaceWeather(): Promise<Result<StormEvent>> {
  const cacheKey = 'space_weather';
  const cached = getCached<StormEvent>(cacheKey);
  if (cached) return cached;

  const key = getKey();
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const start = thirtyDaysAgo.toISOString().split('T')[0];
  const end = now.toISOString().split('T')[0];

  try {
    // Query recent GST (geomagnetic storms)
    const gstUrl = `https://api.nasa.gov/DONKI/GST?startDate=${start}&endDate=${end}&api_key=${key}`;
    const res = await fetchWithTimeout(gstUrl, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const gstList = await res.json();

    if (Array.isArray(gstList) && gstList.length > 0) {
      // Find highest Kp storm
      let maxKp = 0;
      let topGst = gstList[0];
      for (const gst of gstList) {
        for (const kp of gst.allKpIndex ?? []) {
          if (kp.kpIndex > maxKp) {
            maxKp = kp.kpIndex;
            topGst = gst;
          }
        }
      }

      const event: StormEvent = {
        startTime: topGst.startTime,
        kpIndex: maxKp,
        activityID: topGst.gstID,
        note: `Live geomagnetic storm (Kp ${maxKp}) detected by NASA DONKI.`,
        sourceUrl: 'https://api.nasa.gov/DONKI/',
        isArchiveMay2024: false,
      };

      const result: Result<StormEvent> = {
        data: event,
        badge: 'NASA LIVE',
        fetchedAt: new Date().toISOString(),
      };
      setCached(cacheKey, result);
      return result;
    }
  } catch {
    // Fallback on error, timeout, or 429
  }

  // Fallback to May 2024 superstorm archive
  const snapshot = await loadSnapshotJson<any>('donki', null);
  let archiveEvent = FALLBACK_DONKI;
  let fetchedAt = snapshot.fetchedAt || '2024-05-11';

  if (snapshot.data?.archiveMay2024) {
    const may = snapshot.data.archiveMay2024;
    const topGst = may.gst?.[0];
    const topKp = topGst?.allKpIndex?.[0]?.kpIndex ?? 9.0;
    archiveEvent = {
      startTime: topGst?.startTime || '2024-05-10T15:00:00Z',
      kpIndex: topKp,
      cmeSpeed: may.cme?.[0]?.speed || 1650,
      hasSep: (may.sep?.length ?? 0) > 0,
      activityID: topGst?.gstID || '2024-05-10T15:00:00-GST-001',
      note: 'Superstorm of 10–11 May 2024: Kp index reached 9.0; SEP event on 9 May 2024.',
      sourceUrl: 'https://api.nasa.gov/DONKI/',
      isArchiveMay2024: true,
    };
  }

  const result: Result<StormEvent> = {
    data: archiveEvent,
    badge: 'NASA ARCHIVE',
    fetchedAt,
  };
  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 2. Kp Index Today (NOAA SWPC)
// -------------------------------------------------------------
export async function getKpToday(): Promise<Result<number>> {
  const cacheKey = 'noaa_kp';
  const cached = getCached<number>(cacheKey);
  if (cached) return cached;

  const endpoint = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';
  try {
    const res = await fetchWithTimeout(endpoint, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    let latestKp: number | null = null;

    if (Array.isArray(raw) && raw.length > 0) {
      if (Array.isArray(raw[0])) {
        const headers = raw[0];
        const kpIdx = headers.indexOf('Kp');
        const lastRow = raw[raw.length - 1];
        if (kpIdx !== -1 && lastRow) {
          latestKp = parseFloat(lastRow[kpIdx]);
        }
      } else {
        const lastItem = raw[raw.length - 1];
        latestKp = typeof lastItem.Kp === 'number' ? lastItem.Kp : parseFloat(lastItem.Kp);
      }
    }

    if (latestKp !== null && !isNaN(latestKp)) {
      const result: Result<number> = {
        data: latestKp,
        badge: 'NASA LIVE',
        fetchedAt: new Date().toISOString(),
      };
      setCached(cacheKey, result);
      return result;
    }
  } catch {
    // Fallback on timeout or error
  }

  const snapshot = await loadSnapshotJson<any>('noaa_kp', null);
  const kpVal = snapshot.data?.latest?.kp ?? FALLBACK_NOAA_KP;
  const result: Result<number> = {
    data: kpVal,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2026-11-12',
  };
  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 3. Earth Today (EPIC)
// -------------------------------------------------------------
export async function getEarthToday(): Promise<Result<EpicImage>> {
  const cacheKey = 'epic_earth';
  const cached = getCached<EpicImage>(cacheKey);
  if (cached) return cached;

  const endpoint = 'https://epic.gsfc.nasa.gov/api/natural';
  try {
    const res = await fetchWithTimeout(endpoint, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    if (Array.isArray(items) && items.length > 0) {
      const latest = items[0];
      const dateParts = latest.date.split(' ')[0].split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];
      const pngUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${latest.image}.png`;

      const result: Result<EpicImage> = {
        data: {
          image: latest.image,
          date: latest.date.split(' ')[0],
          caption: latest.caption || "NASA's EPIC camera aboard DSCOVR views the sunlit Earth from 1.5 million km away.",
          pngUrl,
        },
        badge: 'NASA LIVE',
        fetchedAt: new Date().toISOString(),
      };
      setCached(cacheKey, result);
      return result;
    }
  } catch {
    // Fallback
  }

  const snapshot = await loadSnapshotJson<any>('epic', FALLBACK_EPIC);
  const result: Result<EpicImage> = {
    data: snapshot.data?.pngUrl ? snapshot.data : FALLBACK_EPIC,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2024-05-11',
  };
  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 4. APOD (Astronomy Picture of the Day)
// -------------------------------------------------------------
export async function getApod(): Promise<Result<Apod>> {
  const cacheKey = 'apod';
  const cached = getCached<Apod>(cacheKey);
  if (cached) return cached;

  const key = getKey();
  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${key}`;

  try {
    const res = await fetchWithTimeout(endpoint, 3000);
    if (res.ok) {
      const data = await res.json();
      const candidate: ApodEntry = {
        date: data.date,
        title: data.title,
        url: data.url,
        hdurl: data.hdurl,
        media_type: data.media_type,
        copyright: data.copyright,
        explanation: data.explanation,
      };

      if (usableApod(candidate)) {
        const result: Result<Apod> = {
          data: {
            date: candidate.date || new Date().toISOString().split('T')[0],
            title: candidate.title!,
            url: candidate.url,
            explanation: candidate.explanation || '',
            media_type: 'image',
            copyright: candidate.copyright,
          },
          badge: 'NASA LIVE',
          fetchedAt: new Date().toISOString(),
        };
        setCached(cacheKey, result);
        return result;
      }
    }
  } catch {
    // Fallback
  }

  const snapshot = await loadSnapshotJson<any>('apod', null);
  const todayEntry = snapshot.data?.today || snapshot.data?.featured?.[0] || FALLBACK_APOD;
  const result: Result<Apod> = {
    data: todayEntry,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2024-05-11',
  };
  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 5. InSight Mars Weather (Archive only)
// -------------------------------------------------------------
export function getMarsWeather(): Result<MarsSol[]> {
  return {
    data: FALLBACK_INSIGHT_SOLS,
    badge: 'NASA ARCHIVE',
    fetchedAt: '2020-10-20',
  };
}

export async function fetchMarsWeather(): Promise<Result<MarsSol[]>> {
  const snapshot = await loadSnapshotJson<any>('insight', null);
  const sols = snapshot.data?.sols || FALLBACK_INSIGHT_SOLS;
  return {
    data: sols,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2020-10-20',
  };
}

// -------------------------------------------------------------
// 6. OSDR Veggie Plant Study (Archive only)
// -------------------------------------------------------------
export function getPlantStudy(): Result<OsdrStudy> {
  return {
    data: FALLBACK_OSDR,
    badge: 'NASA ARCHIVE',
    fetchedAt: '2015-08-10',
  };
}

export async function fetchPlantStudy(): Promise<Result<OsdrStudy>> {
  const snapshot = await loadSnapshotJson<any>('osdr', null);
  const study = snapshot.data?.accession ? snapshot.data : FALLBACK_OSDR;
  return {
    data: study,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2015-08-10',
  };
}

// -------------------------------------------------------------
// 7. NeoWs (Near-Earth Asteroids)
// -------------------------------------------------------------
export async function getNearEarthAsteroids(): Promise<Result<NeoWsSummary>> {
  const cacheKey = 'neows';
  const cached = getCached<NeoWsSummary>(cacheKey);
  if (cached) return cached;

  const key = getKey();
  const now = new Date();
  const start = now.toISOString().split('T')[0];
  const plusTwo = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${plusTwo}&api_key=${key}`;

  try {
    const res = await fetchWithTimeout(url, 3000);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();

    const closest: NeoWsItem[] = [];
    if (raw.near_earth_objects) {
      for (const dateKey of Object.keys(raw.near_earth_objects)) {
        for (const neo of raw.near_earth_objects[dateKey]) {
          const approach = neo.close_approach_data?.[0];
          closest.push({
            name: neo.name,
            hazardous: neo.is_potentially_hazardous_asteroid ?? false,
            date: approach?.close_approach_date || dateKey,
            missKm: approach?.miss_distance?.kilometers ? Math.round(parseFloat(approach.miss_distance.kilometers)) : null,
          });
        }
      }
    }
    closest.sort((a, b) => (a.missKm ?? Infinity) - (b.missKm ?? Infinity));

    const result: Result<NeoWsSummary> = {
      data: {
        startDate: start,
        endDate: plusTwo,
        count: raw.element_count || closest.length,
        closest: closest.slice(0, 5),
      },
      badge: 'NASA LIVE',
      fetchedAt: new Date().toISOString(),
    };
    setCached(cacheKey, result);
    return result;
  } catch {
    // Fallback
  }

  const snapshot = await loadSnapshotJson<any>('neows', FALLBACK_NEOWS);
  const result: Result<NeoWsSummary> = {
    data: snapshot.data?.closest ? snapshot.data : FALLBACK_NEOWS,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2026-11-11',
  };
  setCached(cacheKey, result);
  return result;
}

// -------------------------------------------------------------
// 8. Curated NASA Images
// -------------------------------------------------------------
export function getCuratedImages(): Result<NasaImageItem[]> {
  return {
    data: FALLBACK_IMAGES,
    badge: 'NASA ARCHIVE',
    fetchedAt: '2026-11-12',
  };
}

export async function fetchCuratedImages(): Promise<Result<NasaImageItem[]>> {
  const snapshot = await loadSnapshotJson<any>('images', null);
  const items = snapshot.data?.items || FALLBACK_IMAGES;
  return {
    data: items,
    badge: 'NASA ARCHIVE',
    fetchedAt: snapshot.fetchedAt || '2026-11-12',
  };
}
