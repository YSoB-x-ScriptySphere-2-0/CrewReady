# 06 — Science and NASA Data (v11, facts checked 13 Nov 2026)

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
| 11 | **NOAA SWPC** planetary K index (other-agency data, needed for the top "NASA data usage" mark) | `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json` | No | `time_tag`, `Kp` | Fly hazard speed, level 2, home chip | Live → archive |

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

If the live window is quiet, level 2 says so truthfully ("The Sun is calm this month — but here is what happened in May 2024") and loads the May 2024 archive (Kp reached 9 in the storm that began 10 May 2024, and a particle event began 9 May 2024 — both in the archived DONKI record, facts F5 and F6). Level 6 always uses the stronger of live and archive.

**Dust level `D` (level 4)** — chosen at random from three real cases:

| Case | Real fact shown | `D` |
|---|---|---|
| Clear season | Ordinary Mars skies are still dusty | 5 |
| 2007 dust storm | Opportunity rover's power fell sharply and it stopped driving for weeks | 15 |
| 2018 global dust storm | The storm covered the whole planet; Opportunity never woke up again | 25 |

**Fly starting speed** — from today's highest Kp (NOAA SWPC, or DONKI GST): Kp 0–3 slow, 4–6 medium, 7–9 fast. Fly is endless, so this sets where the run starts and how quickly it speeds up. The powers (Shield, Magnet, Boost) are game inventions, not NASA facts: no source line, and the Fly screen says nothing real about them.

---

## 4. Fact sheet — every fact a player sees (checked 13 Nov 2026)

Only the facts below may appear in level text, Twinkle's lines, explain cards, Mission Replay, Resources cards, Sources and narration. **Use the "Kid wording" column as written** (or shorter). A fact marked ✗ must not appear anywhere in the game, the videos or the project page.

How they were checked (13 Nov 2026): each fact was researched on official pages (nasa.gov, science.nasa.gov, jpl.nasa.gov, ntrs.nasa.gov, osdr.nasa.gov, swpc.noaa.gov, NSSDC, GISS) and then re-checked by a second, independent reviewer who tried to refute it. Where DONKI could not be reached live, the team's archived DONKI API record (`public/data/donki.json`, fetched 12 Nov 2026) was used. The research was done with Claude; a team member (Science lead) should open each link once before judging.

Status: **✓** confirmed as worded · **✓ fixed** true, but the old wording or number was wrong (use the new kid wording) · **✗** not confirmed or false, so it is out of the game.

| # | Lvl | Kid wording (use this) | Source | Status and what changed |
|---|---|---|---|---|
| F1 | 1 | Rockets can go to Mars only about once every 26 months. | [JPL: launch approaching for Perseverance](https://www.jpl.nasa.gov/news/the-launch-is-approaching-for-nasas-next-mars-rover-perseverance/) | ✓ ("when the planets line up" is a fair simplification) |
| F2 | 1–2 | Perseverance flew almost 7 months to reach Mars. | [NASA Mars 2020 mission page](https://science.nasa.gov/mission/mars-2020-perseverance/) (30 Jul 2020 → 18 Feb 2021) | ✓ fixed: about 6.7 months, so "about" or "almost" 7, never "exactly" |
| F3 | 1 | NASA's EPIC camera photographs Earth's whole sunny side from a million miles away. | [NASA release: EPIC view of Earth](https://www.nasa.gov/news-release/nasa-satellite-camera-provides-epic-view-of-earth/) | ✓ fixed: one million miles ≈ **1.6** million km, not 1.5 |
| F4 | story | NASA watches asteroids. In 2022, DART bumped one to test pushing it away. NASA knows of no big asteroid hitting Earth in the next 100 years. | [JPL Asteroid Watch](https://www.jpl.nasa.gov/asteroid-watch/) · [NASA DART](https://science.nasa.gov/mission/dart/) | ✓ fixed: say "no **known** threat", never "no dangerous impact" |
| F5 | 2, 6 | In May 2024, a huge Sun storm hit Earth. It reached G5, the top level (Kp 9). | [NASA: biggest geomagnetic storm in 20 years](https://science.nasa.gov/science-research/heliophysics/what-nasa-is-learning-from-the-biggest-geomagnetic-storm-in-20-years/) · archived DONKI GST `2024-05-10T15:00:00-GST-001` (Kp readings reach 9) | ✓ |
| F6 | 2, 6 | The May 2024 Sun storm also threw out fast, tiny particles. | Archived DONKI SEP `2024-05-09T13:59:00-SEP-001` · [CCMC 2024-05-TP-02](https://ccmc.gsfc.nasa.gov/TP/2024-05-TP-02/) | ✓ via the archived API record. Do not call the particle event "big" (NASA calls it mild) |
| F7 | 2 | On the way to Mars, space radiation was almost 3 times higher than on Mars. | [JPL: data from rover's voyage](https://www.jpl.nasa.gov/news/data-from-nasa-rovers-voyage-to-mars-aids-planning/) · Zeitlin 2013 · Hassler 2014 | ✓ fixed: cruise **1.8** mSv/day, surface **0.64** (not 0.7) |
| F8 | 2 | In a Sun storm, astronauts hide behind bags of food and water. | [NASA: Orion radiation protection plan](https://www.nasa.gov/missions/artemis/orion/scientists-and-engineers-evaluate-orion-radiation-protection-plan/) | ✓ (crew build the shelter within an hour) |
| F9 | 2 | Space weather experts watch the Sun and tell astronauts when to hide. | [NASA SRAG: how we protect astronauts](https://srag.jsc.nasa.gov/spaceradiation/how/how.cfm) | ✓ fixed: people decide, alerts do not send crews by themselves |
| F10 | Home, Fly | Sun storms have 5 levels, from G1 (small) to G5 (extreme). Kp 5 = G1 … Kp 9 = G5. | [NOAA space weather scales](https://www.spaceweather.gov/noaa-scales-explanation) | ✓ (this is the source the Home Kp gauge needs) |
| F11 | 3 | A message from Mars takes about 3 to 22 minutes to reach Earth. | [NASA Mars Relay Network](https://science.nasa.gov/mars/mars-relay-network/) | ✓ fixed: was "5 to 20 minutes" |
| F12 | 3 | One Mars day, called a sol, is about 24 hours and 40 minutes. | [NASA GISS Mars24 notes](https://www.giss.nasa.gov/tools/mars24/help/notes.html) | ✓ |
| F13 | 3 | One day on Mars went from about −95 °C to −17 °C. | [JPL: InSight is the newest Mars weather service](https://www.jpl.nasa.gov/news/insight-is-the-newest-mars-weather-service/) | ✓ fixed: the old sol 675 sentence had no official page. The level 3 **data card** may still show the archived InSight API values (sol 675: average −62.3 °C, −96.9 to −15.9 °C) with the ARCHIVE badge, because those numbers come straight from the archived API record in `public/data/insight.json` |
| F14 | 3 | Mars air is mostly carbon dioxide and very thin. People cannot breathe it. | [NASA NSSDC Mars fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) | ✓ (95% CO₂, under 1% of Earth's air pressure) |
| F15 | 3 | Covering a Mars home with soil can help block harmful space rays. | [NTRS 19900062325, Simonsen et al. 1990](https://ntrs.nasa.gov/citations/19900062325) | ✓ |
| F16 | 4 | Mars gets less than half the sunlight Earth gets. | [NASA NSSDC Mars fact sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html) | ✓ (about 43%) |
| F17 | 4 | In 2018 a dust storm covered all of Mars. Opportunity never woke up. | [NASA: Opportunity mission comes to end](https://science.nasa.gov/missions/mer/nasas-opportunity-rover-mission-on-mars-comes-to-end/) | ✓ |
| F18 | 4 | Dust covered InSight's solar panels. In 2022 its power ran out. | [NASA retires InSight](https://www.nasa.gov/missions/insight/nasa-retires-insight-mars-lander-mission-after-years-of-science/) | ✓ |
| F19 | 3 | MOXIE on Perseverance made 122 grams of oxygen from Mars air. | [NASA: MOXIE completes mission](https://www.nasa.gov/missions/mars-2020-perseverance/perseverance-rover/nasas-oxygen-generating-experiment-moxie-completes-mars-mission/) | ✓ |
| F20 | 4 | In dust storms, rovers turn off machines and rest to save battery. | [JPL: Opportunity hunkers down](https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/) | **✗ old wording** "folding or tilting panels is how missions ride out dust": no NASA rover or lander did that. Folding the panels stays a **game choice for our made-up base**, but no line may say real missions fold panels. Use this kid wording instead |
| F21 | 4 | In 2007 dust blocked the Sun, so Opportunity stopped driving for weeks. | [JPL: rovers braving severe dust storms](https://www.jpl.nasa.gov/news/nasa-mars-rovers-braving-severe-dust-storms/) | ✓ |
| F22 | 4 | Mars air is always a bit dusty. Wind can blow solar panels clean. | [JPL: Spirit gets energy boost from cleaner panels](https://www.jpl.nasa.gov/news/spirit-gets-energy-boost-from-cleaner-solar-panels/) | ✓ |
| F23 | 5 | In 2015, astronauts ate red lettuce they grew on the Space Station. | [NASA Veggie fact sheet (PDF)](https://www.nasa.gov/wp-content/uploads/2023/03/veggie-fact-sheet-508.pdf) | ✓ fixed: never "the first food ever grown in space". NASA says first crop grown **and eaten in NASA hardware** (10 Aug 2015) |
| F24 | 5 | The Space Station cleans and reuses about 98 of every 100 drops of water. | [NASA: water recovery milestone](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/) | ✓ (June 2023) |
| F25 | 5 | Each astronaut breathes in a little less than 1 kg of oxygen every day. | [NASA BVAD (NTRS 20210024855), table 3-23](https://ntrs.nasa.gov/api/citations/20210024855/downloads/BVAD_2.15.22-final.pdf) | ✓ (0.84 kg) |
| F26 | 5 | Water is heavy to send to space, so the station reuses almost every drop. | [NASA Spinoff: space-age water conservation](https://spinoff.nasa.gov/page/space-age-water-conservation-nasa) | ✓ |
| F27 | 5 | Lettuce grown on the Space Station was safe to eat. | [NASA OSDR OSD-745](https://osdr.nasa.gov/bio/repo/data/studies/OSD-745) | ✓ fixed: the old card said **OSD-268** and "same nutrients as on Earth". OSD-268 is a germ (microbe) study and says nothing about nutrients; the study is now OSD-745 and the line no longer claims "same nutrients" |
| F28 | 6 | Apollo 13's square air filters didn't fit. The crew built a fix with bags, card and tape. | [NASA SP-350, ch. 13.4](https://www.nasa.gov/wp-content/uploads/static/history/SP-350/ch-13-4.html) | ✓ fixed: the filters did **not fail**, so never say "failed" or "broke" about Apollo 13 |
| F29 | 6 | Astronauts can be pilots, engineers, doctors or scientists. Teams need all of them. | [NASA: astronaut corps call](https://www.nasa.gov/news-release/nasa-seeks-next-generation-of-explorers-to-join-astronaut-corps/) | ✓ |
| F30 | 2, 6 | Perseverance saves rock samples. One day they may come to Earth. Jezero once had a river delta. | [NASA Mars 2020 mission page](https://science.nasa.gov/mission/mars-2020-perseverance/) | ✓ (keep "may": the return mission is not certain) |
| F31 | 2 | To land on Mars: heat shield first, then parachute, then rocket engines. | [JPL Mars 2020 landing press kit](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission/spacecraft/getting_to_mars/) | ✓ |
| F32 | 3 | MOXIE makes oxygen from Mars air. It needs lots of electricity. | [NASA blog: A day full of MOXIE](https://science.nasa.gov/blog/a-day-full-of-moxie/) | ✓ fixed: if a number is shown, it is 100 W (not 300 W) |
| F33 | 4 | Mars dust stopped two robots: a dust storm for Opportunity, dusty panels for InSight. | Same as F17 and F18 | ✓ fixed: the old line said dusty **panels** ended Opportunity; NASA names the planet-wide storm |

**Removed from the game on 13 Nov 2026** (these were on screen and are now gone or fixed):

| Where | Old text | Now |
|---|---|---|
| `levels.ts` level 1 hint | "Each crate adds 10" | "Each crate adds 15" (a bug: the rule is 15) |
| `levels.ts` level 2 story | "It takes seven months" | "It takes about seven months" (F2) |
| `levels.ts` level 4 replay | "Dusty solar panels ended … Opportunity and InSight" | F33 wording |
| `levels.ts` level 6 hint | "built a new one from spare parts" | F28 wording |
| `Resources.tsx` food card | "for the first time in August 2015" | F23 wording |
| `Sources.tsx` | EPIC "1.5 million km"; OSDR "OSD-268 … same nutrients"; "5 to 20 minutes"; "predicts no dangerous impact"; Artemis II audio credit (no sound file is played: sounds are made in code); "independently audited against NASA primary literature"; Midjourney / Imagen credit | F3, F27, F11, F4 wording; honest audio, review and art (ChatGPT) credits |
| `services/nasa.ts` | InSight fallback numbers that did not match NASA's record; OSD-268 fallback | Copied from the archived API record; OSD-745 |
| `services/nasa.ts` | Archive storm picked the first May 2024 record (2 May, Kp 6.67) | Picks the strongest (10 May, Kp 9), so level 2's card and storm size agree |
| `TwinkleTourGuide.tsx` | "225-million-kilometer trajectory", "3D models of Curiosity, Apollo LM, ISS", "Artemis crew competency frameworks", sol 675 range | Short, true lines in simple words |
| `Training.tsx` | "developed according to NASA human factors guidelines" | "Coming in the next update." |

**Still to do by hand (Science lead):** open each link above once; if any page now says something different, change the kid wording or remove the fact. Keep the level 3 −62 °C line in `strings.en.ts` only while it is unused; if it is ever shown, it must carry the InSight ARCHIVE badge and date.

---

## 4b. Fiction and fact (v11)

The **"too full" future of Earth**, the Mars Continuity Programme, the cadet's call to adventure and the Mars base itself are **fiction**. Every story screen carries a `FICTION` tag and the city-lights animation is labelled "Story", not data. No population number, disease or disaster is stated as fact. A pandemic is deliberately **not** used (players are 7 to 12; see `plan.md` §4).

The only real data in the opening is the EPIC photo of Earth (F3) with its LIVE or ARCHIVE badge. NeoWs (asteroids passing this week) moves to the Fly screen with the F4 wording, so NASA asteroid tracking is still shown honestly.

The facts that v9 listed as "to add" (MOXIE, sample return, the landing order, NASA asteroid tracking and DART) are now F4, F19, F30, F31 and F32 above.

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
