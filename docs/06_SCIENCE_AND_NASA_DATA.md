# 06 — Science and NASA Data (v9)

Authority: `plan.md` v9. This file replaces the v6 science register. It lists only data the game really uses, how to fetch it, how the API key is handled, and the source of every fact a player sees.

Removed from v6 (do not claim these anywhere): Mars Climate Sounder DDR processing, NASA POWER, Earthdata, Worldview, Giovanni, FIRMS, SEDAC, Exoplanet Archive, the Mars Rover Photos API (it is offline), and the long ECLSS equations. The challenge asks for real data used honestly, not a long list.

---

## 1. Data register

Endpoints tested on 12 Nov 2026.

| # | Dataset | Endpoint | Key | Fields we use | Level | Mode |
|---|---|---|---|---|---|---|
| 1 | DONKI — coronal mass ejections | `https://api.nasa.gov/DONKI/CME?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&api_key=KEY` | Yes | `startTime`, `cmeAnalyses[].speed`, `link` | 2, 6, home chip | Live → archive |
| 2 | DONKI — solar energetic particles | `…/DONKI/SEP?…` | Yes | `eventTime`, `link` | 2, 6 | Live → archive |
| 3 | DONKI — geomagnetic storms | `…/DONKI/GST?…` | Yes | `startTime`, `allKpIndex[].kpIndex`, `link` | 2, 6 | Live → archive |
| 4 | DONKI — notifications | `…/DONKI/notifications?startDate=…&endDate=…&type=all` | Yes | `messageType`, `messageIssueTime`, `messageURL` | home chip | Live → archive |
| 5 | EPIC Earth images | `https://epic.gsfc.nasa.gov/api/natural` → image at `https://epic.gsfc.nasa.gov/archive/natural/YYYY/MM/DD/png/<image>.png` | No | `image`, `date`, `caption` | 1 | Live → archive |
| 6 | APOD | `https://api.nasa.gov/planetary/apod?api_key=KEY` | Yes | `title`, `url`, `explanation`, `copyright`, `media_type` | Success screen | Live → archive |
| 7 | InSight Mars weather | `https://api.nasa.gov/insight_weather/?api_key=KEY&feedtype=json&ver=1.0` | Yes | per sol: `AT.av`, `AT.mn`, `AT.mx`, `First_UTC` | 3, 4 | **Archive only** |
| 8 | NASA Image and Video Library | `https://images-api.nasa.gov/search?q=…&media_type=image` | No | `nasa_id`, `title`, `description`, image link | 3, 5, backgrounds | Curated at build time |
| 9 | OSDR | `https://osdr.nasa.gov/osdr/data/search?term=veggie&type=cgene` · `https://visualization.osdr.nasa.gov/biodata/api/v2/dataset/<OSD-id>/` | No | study title, accession, mission, description | 5 | Archive (snapshot) |
| 10 | NTRS | `https://ntrs.nasa.gov/` | No | report title + link | Sources panel | Static links |
| 12 | **NeoWs** — near-Earth asteroids | `https://api.nasa.gov/neo/rest/v1/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=KEY` | Yes | `element_count`, per object: `name`, `is_potentially_hazardous_asteroid`, `close_approach_data[0].miss_distance` | Story card 1 | Live → archive |
| 11 | **NOAA SWPC** planetary K index (other-agency data, needed for the top "NASA data usage" mark) | `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | No | `time_tag`, `Kp` | Quick Run hazard speed, level 2, home chip | Live → archive |

Notes from testing:
- DONKI date ranges must be **60 days or less**.
- `DONKI/FLR` (solar flares) returned **404**. Use CME, SEP and GST.
- APOD returned a **500 error** once. Its fallback is not optional. If `media_type` is `video`, show the fallback image.
- `api.nasa.gov/EPIC/...` only redirects to `epic.gsfc.nasa.gov`. Call the second address directly.
- InSight stopped sending weather in 2020. Its card must say "Archived NASA data from the InSight lander, 2020".
- OSDR may not allow calls from a browser. Fetch it in the snapshot script only.
- NOAA SWPC answered with browser access allowed and needs no key.
- NeoWs answered normally with our key (tested 12 Nov 2026). Keep the range to 1–2 days; the feed allows 7 at most.

---

## 2. Fetching, fallback and the API key

### 2.1 Key rules
- Needed for rows 1–4, 6, 7 and 12 only.
- Lives in `.env` as `VITE_NASA_API_KEY`. `.env` is git-ignored. Commit `.env.example` with `DEMO_KEY`.
- Read in one place: `const KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY'` in `src/services/nasa.ts`.
- On the hosting site, set `VITE_NASA_API_KEY` in the environment settings before building.
- `DEMO_KEY` is about 30 requests an hour per network and was rate-limited during testing. Do not demo on it.
- A `VITE_` value is visible in the built JavaScript. That is acceptable for a free NASA key because the snapshot fallback covers a used-up quota. Never print the key in logs, docs or video.

### 2.2 Snapshot script — `scripts/nasa-snapshot.mjs` (run as `npm run nasa:snapshot`)
Reads the key from `.env`, calls each endpoint once, and writes:

| File in `public/data/` | Content |
|---|---|
| `donki.json` | CME, SEP, GST for the last 30 days **plus** the fixed archive window 1–31 May 2024 |
| `noaa_kp.json` | The latest week of Kp values |
| `neows.json` | This week's near-Earth objects: count, names, miss distances |
| `epic.json` | Latest image record and its PNG URL |
| `apod.json` | Today's APOD plus 4 hand-picked earlier ones (images only) |
| `insight.json` | All sols returned (about 7), trimmed to temperature fields |
| `osdr.json` | The chosen Veggie study record (see §4, level 5) |
| `images.json` | NASA IDs, titles and URLs for the photos the Story lead picked |

Each file starts with `{ "fetchedAt": "<ISO date>", "source": "<endpoint without key>", ... }`. The script must strip the key from every saved URL.

### 2.3 Runtime — `src/services/nasa.ts`
```ts
type Badge = 'NASA LIVE' | 'NASA ARCHIVE';
type Result<T> = { data: T; badge: Badge; fetchedAt: string };

getSpaceWeather(): Promise<Result<StormEvent>>   // DONKI
getKpToday():     Promise<Result<number>>        // NOAA SWPC
getEarthToday():  Promise<Result<EpicImage>>     // EPIC
getApod():        Promise<Result<Apod>>          // APOD
getMarsWeather(): Result<MarsSol[]>              // snapshot only, always NASA ARCHIVE
getPlantStudy():  Result<OsdrStudy>              // snapshot only, always NASA ARCHIVE
```
Live calls: 3-second timeout, cached in `sessionStorage`, at most one call per dataset per session. Any error, timeout, 429 or empty result → return the snapshot with `NASA ARCHIVE` and its `fetchedAt`.

### 2.4 Badges (the challenge's honesty rule)
| Badge | Meaning | Text under it |
|---|---|---|
| `NASA LIVE` | Fetched from NASA in this session | "From NASA, just now" |
| `NASA ARCHIVE` | Real NASA data saved earlier | "Real NASA data from <date>" |
| `GAME ESTIMATE` | Our simplified number | "We made this number simple for the game" |

---

### 2.5 Source lines (plan.md §7.2)
Every screen that states a fact ends with one short line, at most about 60 characters, built as `Source: <agency and dataset> · <LIVE or ARCHIVE> · <date>`, for example `Source: NASA DONKI + NOAA SWPC · LIVE · 12 Nov 2026`. Tapping it opens the Sources page. In the videos the same text sits in the lower-left corner for at least 2 seconds.

---

## 3. From real data to game numbers

All conversions are `GAME ESTIMATE`. The data picks the size of the event; the game decides the meter cost.

**Storm strength `X` (levels 2 and 6)** — take the strongest event in the loaded window:

| Real reading | Size | `X` |
|---|---|---|
| A solar energetic particle (SEP) event in the window, **or** geomagnetic Kp ≥ 8, **or** CME speed ≥ 1500 km/s | Large | 30 |
| Kp 6–7, **or** CME speed 800–1499 km/s | Medium | 20 |
| Anything weaker, or no events | Small | 10 |

If the live window is quiet, level 2 says so truthfully ("The Sun is calm this month — but here is what happened in May 2024") and loads the May 2024 archive (Kp reached 9.0 on 11 May 2024; SEP event on 9 May 2024 — both confirmed in DONKI). Level 6 always uses the stronger of live and archive.

**Dust level `D` (level 4)** — chosen at random from three real cases:

| Case | Real fact shown | `D` |
|---|---|---|
| Clear season | Ordinary Mars skies are still dusty | 5 |
| 2007 dust storm | Opportunity rover's power fell sharply and it stopped driving for weeks | 15 |
| 2018 global dust storm | The storm covered the whole planet; Opportunity never woke up again | 25 |

**Quick Run hazard speed** — from today's highest Kp (NOAA SWPC, or DONKI GST): Kp 0–3 slow, 4–6 medium, 7–9 fast.

---

## 4. Fact sheet — every fact a player sees

Only these facts may appear in level text, `realWorld` lines, Mission Replay and narration. **Status** says whether we confirmed it ourselves through the API, or the Science lead must open the source and confirm the exact wording before it goes on screen.

| Lvl | Fact (kid wording) | Source | Status |
|---|---|---|---|
| 1 | A rocket can leave for Mars only about every 26 months, when the planets line up | NASA Mars mission pages (launch windows) | Confirm wording |
| 1 | Perseverance took about 7 months to reach Mars (launched 30 Jul 2020, landed 18 Feb 2021) | NASA Mars 2020 mission page | Confirm wording |
| 1 | The EPIC camera photographs the whole sunlit Earth from about 1.5 million km away | EPIC site, `epic.gsfc.nasa.gov` | API confirmed; distance: confirm |
| 2 | On 10–11 May 2024 a solar storm reached the highest level on the Kp scale (9) | DONKI GST record `2024-05-10T15:00:00-GST-001` | **Confirmed via API** |
| 2 | A burst of fast particles from the Sun was recorded on 9 May 2024 | DONKI SEP record `2024-05-09T13:59:00-SEP-001` | **Confirmed via API** |
| 2 | On the way to Mars, Curiosity's radiation detector measured about 1.8 millisieverts a day; on the surface about 0.7 | Curiosity RAD results (Zeitlin et al. 2013; Hassler et al. 2014), NASA/JPL releases | Confirm numbers |
| 2 | Water and food are good radiation shields, so crews plan to shelter behind their supplies | NASA Orion storm-shelter and space radiation pages; NTRS | Confirm wording |
| 3 | A radio message between Mars and Earth takes roughly 5 to 20 minutes each way | NASA Mars communications pages | Confirm range |
| 3 | A Mars day (a sol) is 24 hours 39 minutes | NASA Mars facts | Confirm wording |
| 3 | InSight measured air temperatures averaging about −62 °C, from −97 °C to −16 °C in one sol (sol 675, Oct 2020) | InSight weather API, sol 675 | **Confirmed via API** |
| 3 | Mars air is mostly carbon dioxide and far too thin to breathe | NASA Mars facts | Confirm wording |
| 3 | Piling Mars soil over a habitat is one way planners propose to block radiation | NTRS (regolith shielding studies) | Pick one report, link it |
| 4 | Mars gets less than half the sunlight Earth does | NASA Mars facts | Confirm wording |
| 4 | The 2018 dust storm circled the planet and ended the Opportunity rover's mission | NASA Opportunity mission pages | Confirm wording |
| 4 | Dust on its solar panels ended the InSight lander's mission in 2022 | NASA InSight mission pages | Confirm wording |
| 4 | Perseverance carried MOXIE, which made oxygen from Mars air — about 122 grams in total | NASA MOXIE release (Sept 2023) | Confirm number |
| 5 | Astronauts ate lettuce grown on the Space Station for the first time in August 2015 | NASA Veggie pages; OSDR Veggie studies | Confirm date; record OSD id |
| 5 | The Space Station now recycles about 98% of its water | NASA ECLSS release (2023) | Confirm number |
| 5 | Each astronaut needs about 0.84 kg of oxygen a day | NASA life-support baseline values (NTRS) | Link the report |
| 4 | Folding or tilting solar panels and saving battery are real ways missions ride out dust | NASA rover and lander mission pages | Confirm wording |
| 6 | When a carbon-dioxide filter failed on Apollo 13, the crew built a replacement from spare parts | NASA Apollo 13 mission pages | Confirm wording |
| 6 | Real crews are built from specialists — pilots, engineers, doctors, scientists | NASA astronaut pages | Confirm wording |

**Level 5 OSDR task (Science lead, 20 minutes):** open `https://osdr.nasa.gov/osdr/data/search?term=veggie&type=cgene`, choose one Veggie plant-growth study, and write its accession number (OSD-…), title and one plain sentence about what it found into `osdr.json`. Do not write an accession number you have not opened.

---

## 4b. Fiction and fact

The asteroid, the ocean impact, the dust year and the Mars Continuity Programme are **fiction** and every story card carries a `FICTION` tag. They are inspired by real work the team should read (list in `plan.md` §8.2): NASA planetary defence, NASA's "what if an asteroid were going to hit Earth", and a research paper on the climate effects of a Bennu-type impact. The asteroid card under story card 1 is real NeoWs data and must say that none of the listed objects will hit Earth. The honesty note in `plan.md` §4.3 goes on the Sources page and the project page word for word.

Facts added in v9 (add to the table above when confirmed): a machine called MOXIE made oxygen from Mars air on the Perseverance rover; Perseverance collects rock cores for a future return to Earth; a spacecraft landing on Mars uses a heat shield, then a parachute, then engines; NASA tracks near-Earth asteroids and tested deflecting one with the DART mission.

---

## 5. What we simplified (shown in the Sources panel)

| In the game | In reality |
|---|---|
| Four meters from 0 to 100 | Hundreds of measured quantities with different units |
| "Air & Water" is one meter | Oxygen, carbon-dioxide removal and water are separate, linked systems |
| "Shield" goes down when radiation hits | Shielding does not wear out; the crew's total dose goes up. We flipped it so all four meters read the same way |
| A storm costs a fixed number of points by size | Dose depends on particle energy, shielding material and time |
| Storm data measured near Earth is used for a ship going to Mars | A storm seen at Earth may miss Mars. We use real events as examples of what the Sun does |
| Asking Earth costs a fixed amount of air | The real cost depends on leak rate and where the planets are |

---

## 6. Sources panel (one screen, reachable from Home and Success)

For each dataset: name, one sentence on where it appears in the game, its badge, date fetched, and a link. Then the "What we simplified" table, then the AI-use note. This panel is what judges check for "NASA data use" and "validity" — the Science lead owns it.
