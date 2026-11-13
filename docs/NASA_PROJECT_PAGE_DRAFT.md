# NASA Project Page: Copy-and-Paste Draft

Challenge: **Build a Junior Astronaut Mission Trainer** · Team: **CrewReady** · Cumilla, Bangladesh

Fill the `[ ]` placeholders (links, team photo) before you submit. Nothing here names a team member under 18. Barkat Ullah Shah Riyad is the only adult member. Ask your Local Lead how to list the student members on the Members tab and in the videos.

---

## High-Level Summary

**CrewReady: Beyond Us** is a free browser game where kids aged 7–12 command a Mars mission across six levels. Earth is too full, so the crew must reach Mars alive. Every choice trades one of four meters (Power, Air & Water, Food, Shield) against another, so kids learn that space engineering is about trade-offs. Guided by Twinkle, a friendly robot, they meet real NASA science: solar storms, Mars dust, radio delay and growing food in space. The size of the in-game solar storm and the speed of the Fly runner come from today's real NASA and NOAA space-weather data. It runs offline in English and Bangla, so a classroom with weak internet can still play. The game collects no personal data.

240-second video: `[YouTube link]` · GitHub: https://github.com/YSoB-x-ScriptySphere-2-0/CrewReady

## Project Demo

30-second video: `[YouTube link, public, English subtitles]`

## Final Project

- Repository: https://github.com/YSoB-x-ScriptySphere-2-0/CrewReady (Apache-2.0)
- Live game: `[deployed URL]`
- Documentation: `README.md`, `docs/06_SCIENCE_AND_NASA_DATA.md` (every fact, with its NASA or NOAA source link), `docs/AI_USE.md`

---

## Project Details

### Why

Kids love space, but most space games are either trivia with no real science, or simulators too complex for a child. We wanted a game where one rule is always true: **protecting one thing costs another**. More shielding means less food. Radioing Earth costs air and water. We chose ages 7–12 because that is when curiosity about space is strongest and the first STEM habits form. We are a student team from Bangladesh, and we built it in English and Bangla so more children can play it in their own language.

### What

- **Six levels, one mission:** The Last Departure, The Dangerous Journey, First Breath, The Dust Storm, Grow or Go Hungry, Crew Up.
- **Four meters** that always trade against each other. If a meter hits zero, Mission Replay shows which choice cost the most, without blame, and lets the player retry.
- **Twinkle** introduces each level, explains terms, and gives hints that link to the NASA source.
- **Bonus rounds and the Fly runner:** a mini-game for each level, plus an endless runner whose starting speed follows today's geomagnetic activity.
- **Space Arcade and a Stardust wallet** reward play, and the player can spend Stardust on hints.
- **Honest labels:** every fact shows its source. The Sources page separates what is real from what is fiction made for the story (the asteroid and the Mars Continuity Programme).
- **Offline and bilingual:** a service worker caches the game and its NASA data. A `NASA LIVE` or `NASA ARCHIVE` badge shows which data is on screen.

### How NASA data shapes the game

- **Storm size:** the game reads recent geomagnetic storms from NASA DONKI and sizes the in-game storm as Small, Medium or Large (storm strength 10, 20 or 30). A bigger real storm costs more from the Shield and other meters. Level 6 always uses the stronger of the live and archive storm.
- **Runner speed:** today's NOAA planetary K-index sets the Fly runner's starting speed (slow, medium or fast).
- **Limits we state openly:** live storm size currently uses the Kp reading only. If DONKI has no recent storm, or the player is offline, the game uses the archived 10–11 May 2024 superstorm. Difficulty therefore changes with space weather, not with how well the player plays.

### How it is built

React, TypeScript and Vite, with Zustand for state. The rules engine is pure TypeScript with 200 automated tests. The NASA service uses a 3-second timeout, a session cache, and a fallback to NASA snapshots bundled in `public/data`, so the demo never fails because of the network. The game is a static progressive web app with no backend server and no tracking.

### Community involvement and highlighted features

- A student team from Cumilla, Bangladesh. We tested with children informally, and one early tester told us the game was too hard, so we rewrote the text in simpler words and added explain cards. We have not run a formal study.
- Highlights: real-data storm size, the blame-free Mission Replay, hints with NASA source links, and full English and Bangla support.

### Tools and technologies

React, TypeScript, Vite, Zustand, Tailwind CSS, Three.js for the 3D opening, Remotion for the videos, Vitest and Playwright for tests, Netlify and Vercel for hosting. NASA and NOAA open data and APIs (listed below).

---

## Use of AI

**Tools:** Claude (Anthropic) through Claude Code, for code, tests and drafts. Antigravity (Google DeepMind), for some simulation modules and the PWA. ChatGPT image generation (OpenAI), for the character and welcome artwork.

**Why and how:** a small student team had about two weeks, so AI sped up boilerplate, tests and first drafts. We gave it short, specific tasks, then reviewed the result, ran unit tests, and checked each fact against the NASA or NOAA page. Example task: "write a pure function that maps Kp, CME speed and SEP to a storm size, with tests."

**Data the AI worked on:** the NASA and NOAA readings in `public/data` (storm size and speed-tier logic), and fact-checking text against the source pages.

**What the team did ourselves:** the idea and story, the six-level design, the meter rules and balance, choosing the datasets and how to use them, the character direction and cut-outs, the Bangla review, and the videos. Bangla text was AI-drafted and checked by a Bangla speaker. Full details: `docs/AI_USE.md`.

---

## NASA Data Sources Used

| Dataset | Agency | What we used it for |
| --- | --- | --- |
| DONKI (space weather: geomagnetic storms, CMEs, SEPs) | NASA | Sets the in-game storm size in Levels 2 and 6, with a May 2024 archive fallback |
| Planetary K-index (SWPC) | NOAA (partner agency) | Today's Kp sets the Fly runner's starting speed and shows on Home |
| NeoWs (near-Earth objects) | NASA | The count of real tracked asteroids on the story and kit screens |
| EPIC (DSCOVR Earth images) | NASA | Real sunlit-Earth photo at the Level 1 departure |
| InSight Mars weather | NASA | Real Mars temperatures for Level 3 (archived data, 2020) |
| OSDR (Open Science Data Repository) | NASA | The ISS Veggie lettuce study for Level 5 |
| NASA Image and Video Library | NASA | Curated photos of Jezero, Mars dust, MOXIE and the ISS |
| APOD (Astronomy Picture of the Day) | NASA | The reward picture on the mission-success screen |
| NASA Technical Reports Server (NTRS) | NASA | Engineering baselines for life support, shielding and CO2 scrubbing |

Everything the player sees as a fact links to its source in the game and in `docs/06_SCIENCE_AND_NASA_DATA.md`.

## References

- NASA DONKI: https://kauai.ccmc.gsfc.nasa.gov/DONKI/
- NOAA SWPC planetary K-index: https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json
- NASA Open APIs (NeoWs, APOD): https://api.nasa.gov/
- NASA EPIC: https://epic.gsfc.nasa.gov/
- NASA InSight: https://mars.nasa.gov/insight/
- NASA OSDR: https://osdr.nasa.gov/
- NASA Image and Video Library: https://images.nasa.gov/
- NASA APOD: https://apod.nasa.gov/apod/
- NASA NTRS: https://ntrs.nasa.gov/
- Artwork: generated with ChatGPT image tools and edited by the team (no NASA insignia); credits are on the in-game Sources page.
- Libraries: React, Vite, Zustand, Tailwind CSS, Three.js, Remotion, Vitest, Playwright (open-source licences).
