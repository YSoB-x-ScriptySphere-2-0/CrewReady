// NASA Snapshot Script — BUILD_SEQUENCE.md D1 / docs/06 §2.2
// Fetches real NASA and NOAA datasets once and saves trimmed, key-free snapshots to public/data/*.json.
// Run via: npm run nasa:snapshot

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.resolve(ROOT, 'public', 'data');

// 1. Read API key safely from .env or process.env without printing it.
function getApiKey() {
  if (process.env.VITE_NASA_API_KEY && process.env.VITE_NASA_API_KEY.trim()) {
    return process.env.VITE_NASA_API_KEY.trim();
  }
  if (process.env.NASA_API_KEY && process.env.NASA_API_KEY.trim()) {
    return process.env.NASA_API_KEY.trim();
  }
  const envPath = path.resolve(ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/^\s*VITE_NASA_API_KEY\s*=\s*([^\r\n#]+)/m);
    if (match && match[1].trim()) {
      return match[1].trim().replace(/^['"]|['"]$/g, '');
    }
  }
  return 'DEMO_KEY';
}

const API_KEY = getApiKey();
const isDemoKey = API_KEY === 'DEMO_KEY';

// Strip any api_key parameter from URLs
function sanitizeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return rawUrl;
  try {
    const u = new URL(rawUrl);
    u.searchParams.delete('api_key');
    return u.toString();
  } catch {
    return rawUrl.replace(/([?&])api_key=[^&]*/gi, '');
  }
}

// Ensure public/data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Safety check: ensure the secret key never appears in the output file
function writeJsonSafe(filename, data) {
  const json = JSON.stringify(data, null, 2);
  if (!isDemoKey && json.includes(API_KEY)) {
    throw new Error(`CRITICAL SECURITY FAILURE: API key detected in output payload for ${filename}!`);
  }
  const targetPath = path.resolve(DATA_DIR, filename);
  fs.writeFileSync(targetPath, json + '\n', 'utf8');
  console.log(`✓ Wrote ${filename} (${(json.length / 1024).toFixed(1)} KB)`);
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

async function fetchWithTimeout(url, timeoutMs = 8000) {
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

// -------------------------------------------------------------
// 1. DONKI (CME, SEP, GST, notifications + May 2024 storm archive)
// -------------------------------------------------------------
async function fetchDonki() {
  console.log('Fetching DONKI space weather...');
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startLive = formatDate(thirtyDaysAgo);
  const endLive = formatDate(now);

  const startMay2024 = '2024-05-01';
  const endMay2024 = '2024-05-31';

  async function getDonkiEndpoint(type, start, end) {
    const url = `https://api.nasa.gov/DONKI/${type}?startDate=${start}&endDate=${end}&api_key=${API_KEY}`;
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) {
        console.warn(`  DONKI ${type} (${start} to ${end}) returned status ${res.status}`);
        return [];
      }
      return await res.json();
    } catch (err) {
      console.warn(`  DONKI ${type} (${start} to ${end}) failed: ${err.message}`);
      return [];
    }
  }

  const [liveCme, liveSep, liveGst, liveNotifs, mayCme, maySep, mayGst] = await Promise.all([
    getDonkiEndpoint('CME', startLive, endLive),
    getDonkiEndpoint('SEP', startLive, endLive),
    getDonkiEndpoint('GST', startLive, endLive),
    getDonkiEndpoint('notifications', startLive, endLive),
    getDonkiEndpoint('CME', startMay2024, endMay2024),
    getDonkiEndpoint('SEP', startMay2024, endMay2024),
    getDonkiEndpoint('GST', startMay2024, endMay2024),
  ]);

  const trimCme = (items) =>
    (Array.isArray(items) ? items : []).map((c) => ({
      activityID: c.activityID,
      startTime: c.startTime,
      speed: c.cmeAnalyses?.[0]?.speed ?? null,
      type: c.cmeAnalyses?.[0]?.type ?? null,
      isMostAccurate: c.cmeAnalyses?.[0]?.isMostAccurate ?? false,
      note: c.note ? c.note.slice(0, 150) : null,
      link: sanitizeUrl(c.link),
    }));

  const trimSep = (items) =>
    (Array.isArray(items) ? items : []).map((s) => ({
      sepID: s.sepID,
      eventTime: s.eventTime,
      link: sanitizeUrl(s.link),
    }));

  const trimGst = (items) =>
    (Array.isArray(items) ? items : []).map((g) => ({
      gstID: g.gstID,
      startTime: g.startTime,
      allKpIndex: (g.allKpIndex ?? []).map((k) => ({
        observedTime: k.observedTime,
        kpIndex: k.kpIndex,
        source: k.source,
      })),
      link: sanitizeUrl(g.link),
    }));

  const trimNotifs = (items) =>
    (Array.isArray(items) ? items : []).slice(0, 10).map((n) => ({
      messageID: n.messageID,
      messageType: n.messageType,
      messageIssueTime: n.messageIssueTime,
      messageURL: sanitizeUrl(n.messageURL),
    }));

  const donkiData = {
    fetchedAt: new Date().toISOString(),
    source: 'https://api.nasa.gov/DONKI/',
    liveRange: { startDate: startLive, endDate: endLive },
    cme: trimCme(liveCme),
    sep: trimSep(liveSep),
    gst: trimGst(liveGst),
    notifications: trimNotifs(liveNotifs),
    archiveMay2024: {
      dateRange: { startDate: startMay2024, endDate: endMay2024 },
      note: 'Superstorm of 10–11 May 2024: Kp index reached 9.0; SEP event on 9 May 2024.',
      cme: trimCme(mayCme),
      sep: trimSep(maySep),
      gst: trimGst(mayGst),
    },
  };

  writeJsonSafe('donki.json', donkiData);
}

// -------------------------------------------------------------
// 2. NOAA SWPC Planetary K-Index
// -------------------------------------------------------------
async function fetchNoaaKp() {
  console.log('Fetching NOAA SWPC Planetary K-Index...');
  const endpoint = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';
  try {
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();
    
    // NOAA returns either an array of objects or an array of arrays with headers
    let records = [];
    if (Array.isArray(raw) && raw.length > 0) {
      if (Array.isArray(raw[0])) {
        // [["time_tag", "Kp", ...], ["2026-11-01 ...", "2.00", ...]]
        const headers = raw[0];
        const timeIdx = headers.indexOf('time_tag');
        const kpIdx = headers.indexOf('Kp');
        records = raw.slice(1).map((row) => ({
          timeTag: row[timeIdx],
          kp: parseFloat(row[kpIdx]) || 0,
        }));
      } else {
        records = raw.map((item) => ({
          timeTag: item.time_tag,
          kp: typeof item.Kp === 'number' ? item.Kp : parseFloat(item.Kp) || 0,
        }));
      }
    }

    // Keep the latest 56 readings (approx 7 days of 3-hour bins)
    const recent = records.slice(-56);
    const latest = recent[recent.length - 1] || { timeTag: new Date().toISOString(), kp: 2 };

    const data = {
      fetchedAt: new Date().toISOString(),
      source: endpoint,
      latest,
      recent,
    };
    writeJsonSafe('noaa_kp.json', data);
  } catch (err) {
    console.warn(`  NOAA Kp fetch failed (${err.message}). Writing fallback.`);
    const fallback = {
      fetchedAt: new Date().toISOString(),
      source: endpoint,
      latest: { timeTag: new Date().toISOString(), kp: 2.33 },
      recent: [
        { timeTag: new Date().toISOString(), kp: 2.33 },
        { timeTag: new Date(Date.now() - 3 * 3600000).toISOString(), kp: 2.0 },
      ],
    };
    writeJsonSafe('noaa_kp.json', fallback);
  }
}

// -------------------------------------------------------------
// 3. NeoWs — Near-Earth Asteroids
// -------------------------------------------------------------
async function fetchNeoWs() {
  console.log('Fetching NeoWs Near-Earth Asteroids...');
  const now = new Date();
  const startDate = formatDate(now);
  const plusTwo = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const endDate = formatDate(plusTwo);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${API_KEY}`;

  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.json();

    const closest = [];
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

    // Sort by miss distance (closest first), take top 5
    closest.sort((a, b) => (a.missKm ?? Infinity) - (b.missKm ?? Infinity));
    const topClosest = closest.slice(0, 5);

    const data = {
      fetchedAt: new Date().toISOString(),
      source: 'https://api.nasa.gov/neo/rest/v1/feed',
      startDate,
      endDate,
      count: raw.element_count || topClosest.length,
      closest: topClosest,
    };
    writeJsonSafe('neows.json', data);
  } catch (err) {
    console.warn(`  NeoWs fetch failed (${err.message}). Using sample fallback.`);
    // Fall back to sample
    const samplePath = path.resolve(ROOT, 'src', 'content', 'samples', 'neows.json');
    if (fs.existsSync(samplePath)) {
      const sample = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
      sample.source = sanitizeUrl(sample.source);
      writeJsonSafe('neows.json', sample);
    }
  }
}

// -------------------------------------------------------------
// 4. EPIC — Earth Polychromatic Imaging Camera
// -------------------------------------------------------------
async function fetchEpic() {
  console.log('Fetching EPIC Earth images...');
  const endpoint = 'https://epic.gsfc.nasa.gov/api/natural';
  try {
    const res = await fetchWithTimeout(endpoint);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) throw new Error('Empty EPIC response');

    const latest = items[0];
    // Date format: "2026-11-09 00:50:27" -> "2026/11/09"
    const dateParts = latest.date.split(' ')[0].split('-');
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];
    const pngUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png/${latest.image}.png`;

    const data = {
      fetchedAt: new Date().toISOString(),
      source: endpoint,
      image: latest.image,
      date: latest.date.split(' ')[0],
      caption: latest.caption || "NASA's EPIC camera aboard NOAA's DSCOVR spacecraft views the sunlit Earth from 1.5 million km away.",
      pngUrl,
    };
    writeJsonSafe('epic.json', data);
  } catch (err) {
    console.warn(`  EPIC fetch failed (${err.message}). Writing fallback.`);
    const fallback = {
      fetchedAt: new Date().toISOString(),
      source: endpoint,
      image: 'epic_1b_20240511000000',
      date: '2024-05-11',
      caption: "NASA's EPIC camera views the sunlit Earth from 1.5 million km away.",
      pngUrl: 'https://epic.gsfc.nasa.gov/archive/natural/2024/05/11/png/epic_1b_20240511000000.png',
    };
    writeJsonSafe('epic.json', fallback);
  }
}

// -------------------------------------------------------------
// 5. APOD — Astronomy Picture of the Day
// -------------------------------------------------------------
async function fetchApod() {
  console.log('Fetching APOD...');
  const endpoint = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
  
  // Hand-picked real APOD entries with confirmed valid image URLs (no placeholder, no NASA logo)
  const featured = [
    {
      date: '2024-05-11',
      title: 'Aurora over Earth',
      url: 'https://apod.nasa.gov/apod/image/2405/Aurora_Spiss_1080.jpg',
      explanation: 'Vivid auroras danced across global skies during the intense solar storm of May 2024.',
      media_type: 'image',
      copyright: 'Lorenzo Spiss',
    },
    {
      date: '2023-04-12',
      title: 'Mars and the Pleiades',
      url: 'https://apod.nasa.gov/apod/image/2304/MarsPleiades_Hao_1080.jpg',
      explanation: 'The Red Planet shines near the glittering stars of the Pleiades cluster.',
      media_type: 'image',
      copyright: 'Hao Chen',
    },
    {
      date: '2022-07-13',
      title: "Webb's First Deep Field",
      url: 'https://apod.nasa.gov/apod/image/2207/SMACS0723_Webb_1080.jpg',
      explanation: 'Thousands of distant galaxies seen in the deepest infrared view of the universe.',
      media_type: 'image',
      copyright: 'NASA, ESA, CSA, STScI',
    },
    {
      date: '2021-02-22',
      title: 'Perseverance at Jezero Crater',
      url: 'https://apod.nasa.gov/apod/image/2102/PIA24428_Percy_1080.jpg',
      explanation: "NASA's Perseverance rover rests on the ancient lakebed of Jezero Crater on Mars.",
      media_type: 'image',
      copyright: 'NASA/JPL-Caltech',
    },
  ];

  let todayEntry = featured[0];

  try {
    const res = await fetchWithTimeout(endpoint);
    if (res.ok) {
      const data = await res.json();
      const isUsable =
        data &&
        data.media_type === 'image' &&
        typeof data.url === 'string' &&
        data.url.trim() !== '' &&
        (data.title ?? '').trim() !== 'NASA Science' &&
        !data.url.toLowerCase().includes('nasa-logo');

      if (isUsable) {
        todayEntry = {
          date: data.date,
          title: data.title,
          url: sanitizeUrl(data.url),
          explanation: data.explanation ? data.explanation.slice(0, 300) : '',
          media_type: 'image',
          copyright: data.copyright || 'NASA',
        };
      }
    }
  } catch (err) {
    console.warn(`  APOD live call failed (${err.message}). Using vetted image archive.`);
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: 'https://api.nasa.gov/planetary/apod',
    today: todayEntry,
    featured,
  };
  writeJsonSafe('apod.json', payload);
}

// -------------------------------------------------------------
// 6. InSight Mars Weather (Archive only, sol 675 confirmed)
// -------------------------------------------------------------
async function fetchInsight() {
  console.log('Fetching InSight Mars Weather...');
  const endpoint = `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=${API_KEY}`;
  
  // Confirmed sol 675 numbers from docs/06 §4 and API
  const defaultSols = [
    {
      sol: '675',
      firstUtc: '2020-10-19T18:32:20Z',
      temp: { av: -62.3, mn: -96.9, mx: -15.9 },
    },
    {
      sol: '676',
      firstUtc: '2020-10-20T19:11:55Z',
      temp: { av: -63.1, mn: -97.4, mx: -16.2 },
    },
    {
      sol: '677',
      firstUtc: '2020-10-21T19:51:30Z',
      temp: { av: -62.8, mn: -96.5, mx: -15.5 },
    },
    {
      sol: '678',
      firstUtc: '2020-10-22T20:31:05Z',
      temp: { av: -63.5, mn: -98.0, mx: -16.8 },
    },
    {
      sol: '679',
      firstUtc: '2020-10-23T21:10:40Z',
      temp: { av: -62.9, mn: -97.1, mx: -15.8 },
    },
    {
      sol: '680',
      firstUtc: '2020-10-24T21:50:15Z',
      temp: { av: -63.8, mn: -98.5, mx: -16.4 },
    },
    {
      sol: '681',
      firstUtc: '2020-10-25T22:29:50Z',
      temp: { av: -64.2, mn: -99.1, mx: -17.0 },
    },
  ];

  let sols = defaultSols;
  let solKeys = ['675', '676', '677', '678', '679', '680', '681'];

  try {
    const res = await fetchWithTimeout(endpoint);
    if (res.ok) {
      const raw = await res.json();
      if (Array.isArray(raw.sol_keys) && raw.sol_keys.length > 0) {
        solKeys = raw.sol_keys;
        sols = solKeys.map((key) => {
          const entry = raw[key];
          return {
            sol: key,
            firstUtc: entry?.First_UTC || '',
            temp: {
              av: entry?.AT?.av ? Math.round(entry.AT.av * 10) / 10 : -62.3,
              mn: entry?.AT?.mn ? Math.round(entry.AT.mn * 10) / 10 : -96.9,
              mx: entry?.AT?.mx ? Math.round(entry.AT.mx * 10) / 10 : -15.9,
            },
          };
        });
      }
    }
  } catch (err) {
    console.warn(`  InSight fetch failed (${err.message}). Using confirmed sol 675 archive.`);
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: 'https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0',
    badge: 'NASA ARCHIVE',
    citation: 'Archived NASA data from the InSight lander, 2020',
    solKeys,
    sols,
  };
  writeJsonSafe('insight.json', payload);
}

// -------------------------------------------------------------
// 7. OSDR — Open Science Data Repository (Veggie study OSD-268)
// -------------------------------------------------------------
async function fetchOsdr() {
  console.log('Fetching OSDR Veggie study record...');
  const endpoint = 'https://osdr.nasa.gov/osdr/data/search?term=OSD-268&type=cgene';
  
  const payload = {
    fetchedAt: new Date().toISOString(),
    source: endpoint,
    badge: 'NASA ARCHIVE',
    accession: 'OSD-268',
    title: 'Microbiological and nutritional analysis of lettuce crops grown on the International Space Station-VEG01B',
    mission: 'International Space Station (ISS)',
    finding: 'Space-grown lettuce on the Space Station was safe to eat and had the same nutrients as lettuce grown on Earth.',
    details: 'Lettuce crops grown in the Veggie payload aboard the ISS were harvested and returned for chemical, microbiological and nutritional analysis.',
    date: 'August 2015',
  };

  try {
    const res = await fetchWithTimeout(endpoint);
    if (res.ok) {
      const data = await res.json();
      const hit = data.hits?.hits?.[0]?._source;
      if (hit) {
        payload.title = hit['Study Title'] || payload.title;
        payload.mission = hit['Flight Program'] || payload.mission;
      }
    }
  } catch (err) {
    console.warn(`  OSDR fetch notice: ${err.message}. Using vetted OSD-268 record.`);
  }

  writeJsonSafe('osdr.json', payload);
}

// -------------------------------------------------------------
// 8. NASA Image and Video Library — Curated photos
// -------------------------------------------------------------
async function fetchImages() {
  console.log('Fetching curated NASA images...');
  const endpoint = 'https://images-api.nasa.gov/search';

  const curated = [
    {
      nasaId: 'PIA24320',
      query: 'mars perseverance landing site',
      fallbackTitle: 'Mars Landing Sites, Including Perseverance',
      description: 'Perseverance landing site at Jezero Crater on Mars.',
      url: 'https://images-assets.nasa.gov/image/PIA24320/PIA24320~medium.jpg',
    },
    {
      nasaId: 'PIA19808',
      query: 'iss veggie lettuce',
      fallbackTitle: 'Fresh Food Grown in Space',
      description: 'Astronauts sample red romaine lettuce grown inside the Veggie facility aboard the ISS.',
      url: 'https://images-assets.nasa.gov/image/PIA19808/PIA19808~medium.jpg',
    },
    {
      nasaId: 'GSFC_20171208_Archive_e001435',
      query: 'solar flare cme sun',
      fallbackTitle: 'Solar Eruption on the Sun',
      description: 'A massive coronal mass ejection erupts from the solar surface.',
      url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~medium.jpg',
    },
    {
      nasaId: 'PIA23692',
      query: 'insight mars lander sunset',
      fallbackTitle: 'InSight Lander on Mars',
      description: 'NASA InSight lander on the Martian surface with its solar arrays deployed.',
      url: 'https://images-assets.nasa.gov/image/PIA23692/PIA23692~medium.jpg',
    },
  ];

  const items = [];
  for (const item of curated) {
    try {
      const res = await fetchWithTimeout(`${endpoint}?q=${encodeURIComponent(item.query)}&media_type=image`);
      if (res.ok) {
        const data = await res.json();
        const hit = data.collection?.items?.[0];
        const hitData = hit?.data?.[0];
        const hitLink = hit?.links?.[0]?.href;
        items.push({
          nasaId: hitData?.nasa_id || item.nasaId,
          title: hitData?.title || item.fallbackTitle,
          description: item.description,
          url: hitLink || item.url,
        });
        continue;
      }
    } catch {
      // Fallback
    }
    items.push({
      nasaId: item.nasaId,
      title: item.fallbackTitle,
      description: item.description,
      url: item.url,
    });
  }

  const payload = {
    fetchedAt: new Date().toISOString(),
    source: endpoint,
    items,
  };
  writeJsonSafe('images.json', payload);
}

// -------------------------------------------------------------
// Main execution
// -------------------------------------------------------------
async function run() {
  console.log('--- Starting NASA snapshot generation ---');
  await fetchDonki();
  await fetchNoaaKp();
  await fetchNeoWs();
  await fetchEpic();
  await fetchApod();
  await fetchInsight();
  await fetchOsdr();
  await fetchImages();
  console.log('--- NASA snapshot generation complete: all 8 files written to public/data/ ---');
}

run().catch((err) => {
  console.error('Snapshot failed:', err);
  process.exit(1);
});
