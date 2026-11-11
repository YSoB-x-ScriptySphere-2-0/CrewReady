# 00 — Project Context (v9)

Authority: `plan.md` v9. Read this first; it is the short version every teammate and every Claude session should start from.

---

## 1. The challenge

**NASA Space Apps Challenge 2026 — "Build a Junior Astronaut Mission Trainer."**
Build an interactive game or app that lets kids aged **7–12** manage a lunar or Martian outpost, making real decisions about **life support, radiation shielding, power budgeting, food production and communication delay**, and seeing how those choices play out.

What the challenge text asks for, in its own terms:
- No "safe" choice — every decision has a real cost.
- Two or three core resources beat five or six.
- Mechanics matter more than visual polish.
- Use real NASA data (DONKI, OSDR, Artemis and Mars mission data are named), attribute it in the tool, and never present static data as live.
- Browser-playable, no download, no account.
- Replayable; failure should teach, not punish.
- Explain which NASA datasets were used and why.

## 2. Our answer in one sentence

> **CrewReady is a free browser game where kids aged 7–12 command a Mars mission across six levels, and every choice trades power, air and water, food, or radiation protection — driven by real NASA data.**

This sentence opens both videos, the project page and the README.

## 3. What the mentor told us (and what we changed)

1. Fulfil the main objective first, and state the solution in the first sentence of every submission.
2. Our earlier plan (five tabs, three missions, base building, training deck, 3D runner) drifted away from the challenge and could not be built in two days.
3. So: **the six-level Mars mission is the main focus**, with four meters. Around it, in priority order: Quick Run, Profile (leaderboard, badges, settings), Resources (capped upgrades). Training (Mind, Body, Reels) is shown locked for the next update.
4. The app opens with a 15-second hook, and so do the videos. The videos must also show the solution to the key problem, teamwork as a chain of contributions, sources as short citations, subtitles, and future plans.
5. From the challenge author's briefing: not a quiz or a slideshow but a living simulation; no unlimited mode; five coupled systems; DONKI so that today's solar weather shifts in-game risk.

## 3b. The story (v9)

A small asteroid is mostly deflected, but one piece lands in the ocean; its dust dims the sunlight for a year and farms and power grids struggle. Earth is healing, and the world decides one planet is not enough. Mission Control starts the **Mars Continuity Programme** and the player commands the first crew. The story is three short cards tagged `FICTION`, with a real NASA asteroid-tracking card beside it. It was softened from an earlier draft (no destroyed Earth, no deaths) because the players are 7–12. Details: `plan.md` §4.

Level names in v9: 1 The Last Departure · 2 The Dangerous Journey (ends with the landing) · 3 First Breath · 4 The Dust Storm · 5 Grow or Go Hungry · 6 Crew Up (ends with rock-sample collection). The table below still gives the right subject for each level; the full detail is `plan.md` §6.

## 4. The game

- **Guide:** Twinkle, a small drone. Gives hints that explain costs but never give the answer.
- **Meters (0–100):** Power · Air & Water · Food · Shield. **Science Stars** are the score.
- **Loop:** story card → real NASA data card → decision with three choices → meters move with a one-line reason → next decision.
- **Failure:** a meter hits zero → **Mission Replay** shows the choice that caused it and what real crews do → retry the level.
- **Levels:**

| # | Level | Teaches | NASA data |
|---|---|---|---|
| 1 | Pack the Rocket | Limited cargo: you cannot bring enough of everything | EPIC Earth photo (live) |
| 2 | The Long Cruise | Radiation shelter vs. getting work done | DONKI solar storm (live or May 2024 archive) |
| 3 | Touchdown at Jezero | Communication delay: wait for Earth or decide alone | Perseverance photo; InSight temperatures (archive) |
| 4 | Dust Storm (Sol 214) | Power budget: fold the panels or risk them, then split the battery | Real dust-storm cases (2007, 2018) |
| 5 | Grow or Go Hungry | Food costs water and power; science costs air | OSDR Veggie study; lettuce photo |
| 6 | Crew Up | Pick 3 of 5 specialists and survive together | DONKI storm; APOD reward |

- **Around the mission:** an opening hook (the Sol 214 dust-storm choice) on first launch; **Quick Run**, a 60-second dodge game whose speed follows today's real storm index; **Profile** with call-sign, rank, badges, on-device leaderboard and settings; **Resources**, where stardust buys a limited number of upgrades; **Training** locked.
- **Coming soon, announced in-game and in the videos:** Crew Mode — friends each choose a role (Engineer, Life-Support Tech, Botanist, Medic, Scientist) and solve missions together; more worlds beyond Mars; the Training deck.
- **Cascades:** some choices come back in a later level (spare parts, habitat site, buried panels).
- **Sources:** every screen that states a fact ends with a one-line source.

Full level content: `plan.md` §6. Data and facts: `docs/06`.

## 5. Why this fits the judging criteria

| Criterion | Evidence |
|---|---|
| Relevance | Each demand named in the challenge is a level; age 7–12; browser, no login |
| Validity | Every on-screen fact has a NASA source; simplified numbers carry a `GAME ESTIMATE` badge |
| NASA data | DONKI and EPIC live, plus the NOAA storm index as other-agency data; InSight and OSDR archived and labelled; APOD reward; Sources panel |
| Impact | One true constraint learned per level; free; runs on low-end phones; classroom-ready |
| Creativity | Crew-pick finale that becomes multiplayer; Mission Replay instead of game over |
| Presentation | Solution-first videos showing the working game |
| Teamwork | Five clear roles, shown working, in the video |

## 6. Technology

Vite + React + TypeScript + Tailwind + Zustand. Static site, no backend, no accounts, no personal data. Levels are JSON files so content can change without code. One file (`src/services/nasa.ts`) talks to NASA and reads the API key from `.env`; if a call fails it uses real data saved earlier and says so. Key handling: `plan.md` §3.

## 7. Team

Team CrewReady, Dhaka, Bangladesh. Five active members:

| Role | Responsibility |
|---|---|
| Captain | Scope, schedule, Profile and Resources screens, project page, submission |
| Engine Dev | Game engine, NASA service, tests |
| UI Dev | Screens, Quick Run, deployment |
| Science & Data Lead | NASA data, every number and fact, Sources panel |
| Story, Design & Video Lead | Kid-level writing, Twinkle, visuals, both videos |

Write real names in `plan.md` §5 and reuse them in the videos and project page.

## 8. Rules we keep

- Members under 18: no face, voice or full name in any video or page.
- No accounts, no personal data, no tracking.
- Public open-source repository; AI use disclosed (which tools, for what, and what humans checked).
- Never show archived data as live. Never list a dataset we do not use.

## 9. Visual identity (unchanged from v6)

Dark space background `#05080D`, panels `#0A1220`, cyan `#36D9F5` for actions, gold `#FFC857` for stars and power, green `#39FF88` for healthy, red `#FF5252` for danger. Headings in Space Grotesk, body in Inter. UI mockups are in `ui reference/`. Every meter shows an icon, a label and a number — never colour alone.

## 10. Closing line

From Kazi Nazrul Islam's *Shonkolpo*: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে" — "I will not stay in a closed room; I will see the world." It closes the 240-second video; it no longer opens it.
