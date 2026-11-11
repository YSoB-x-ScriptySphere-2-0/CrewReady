> **Replaced by `docs/BUILD_SEQUENCE.md`.** Use that file for the build order, design direction and prompts. This file is kept only for the level data format in section 3.

# 08 — MVP Scope, Engine Spec and Build Sequence (v9)

Authority: `plan.md` v9. Scope, priorities, schedule and level content live in `plan.md`; this file holds the game rules, the code shape and the prompts to paste into Claude.

---

## 1. Scope

Priorities and cut order: `plan.md` §6 and §10. In short: the opening hook and the six Mars levels first, Quick Run second, then Profile (leaderboard, badges, settings) and Resources (capped upgrades), with Training shown as locked.

**Rules that never bend**
1. Every choice changes **at least two** meters (or one meter and stars) and shows a one-sentence reason.
2. No choice is free and no choice is always best.
3. Failure opens Mission Replay, never a dead "Game Over".
4. Every NASA card carries `NASA LIVE`, `NASA ARCHIVE` or `GAME ESTIMATE`, and every screen that states a fact ends with a one-line source.
5. Text is for a 7-year-old: short sentences, no jargon without a five-word explanation.

---

## 2. Game rules

- **Meters (0–100):** Power `P`, Air & Water `L`, Food `F`, Shield `S`. **Stars** `⭐` are the score.
- **Start:** each meter starts at 40. Level 1 gives 8 cargo crates; each crate adds +10 to the meter it is packed for.
- **Upkeep:** on entering levels 2–6 the crew uses supplies: `L −5`, `F −5`.
- **Lose:** any meter ≤ 0 → Mission Replay → restart that level with the meters the player entered it with. Stars are kept.
- **Hints:** Twinkle button on every decision. A hint names the lowest meter and what each option costs. It never says which to pick.
- **Result at the end:** the Outpost Check in plan.md §5.3 (healthy systems plus stars).
- **All numbers below are starting values.** The balance script (§5, hour 16–22) tunes them.

---

## 3. Level content

The full level spec — learning goal, story, decisions, options, outcomes, cascades and source line for each of the six levels — is in **`plan.md` §6** (rules in §5). Build the JSON from that section; do not copy numbers from older versions of this file.

Engine features the levels need:

| Feature | Used in | Shape in the level JSON |
|---|---|---|
| Immediate effects | every choice | `"effects": { "P": -15, "L": 10 }` |
| Data-sized effects | levels 2, 4, 6 | `"effects": { "S": "-(X-10)" }` where `X` (storm) or `D` (dust) comes from the loaded data |
| Cascade flag | levels 1, 3, 4 | `"setFlag": "panelsBuried"`; a later level lists `"onEnter": [{ "ifFlag": "panelsBuried", "unlessFlag": "spareParts", "effects": { "P": -10 }, "reason": "Remember the panels you left out in the storm?" }]` |
| Packing | level 1 | `"control": "crates"`, 8 crates, +10 each |
| Stowing | level 1 | `"control": "stow"`, pick 2 of 4 items to keep within reach; each sets a flag (`reachWater`, `reachFilter`, `reachMedkit`, `reachTools`) read in levels 2 and 3 |
| Landing checklist | level 2 | `"control": "order"`, four steps to put in order; right: ⭐ +1; wrong: Power −5, Shield −5, retry |
| Living costs and sunlight | entering levels 2–6 | `"onEnter"`: Air & Water −5, Food −5; on levels 4–6 also Power +10 unless `panelsBuried` (and not `spareParts`) |
| Outpost Check | end of level 6 | counts meters at 30 or more; result Survives / Stable / Thriving (plan.md §5.3) |
| Power sliders | level 4 | `"control": "sliders"`, 7 units over three systems that each want 3; each missing unit is −5 on that meter |
| Crew pick | level 6 | `"control": "crew"`, choose 3 of 5; a chosen specialist halves losses on their meter |
| Message clock | level 3 | `"control": "askEarth"`, drains `L` while the clock runs, then applies the reply |
| Source line | every screen | `"source": "NASA DONKI + NOAA SWPC"`; the badge and date are added at run time |

`validateLevel` must reject any choice that changes fewer than two things (a cascade flag counts as one).

---

## 4. Code shape

```
src/
  engine/        types.ts  engine.ts  engine.test.ts  balance.ts   (pure functions, no React)
  content/       levels/level1.json … level6.json   strings.en.json
  services/      nasa.ts   (the only file that reads the API key)
  store/         game.ts   (Zustand: state + actions, saves to localStorage)
  components/    MeterBar  ChoiceCard  DataCard  Badge  Twinkle  SourcesPanel
  screens/       Hook  StoryCards  Home  MissionMap  Story  Packing  Decision  Sliders  AskEarth  Replay  CrewPick  Success
                 QuickRun  Profile  Resources  TrainingLocked  Sources
public/data/     donki.json  noaa_kp.json  neows.json  epic.json  apod.json  insight.json  osdr.json  images.json   (snapshots)
scripts/         nasa-snapshot.mjs
```

**Level file format**
```json
{
  "id": 4,
  "title": "Dust Storm",
  "story": "The sky turns brown...",
  "dataCard": "dust",
  "onEnter": { "L": -5, "F": -5 },
  "decisions": [
    {
      "prompt": "There is not enough power for everything.",
      "hint": "Which meter is lowest right now? Plants can wait a little. Can people?",
      "choices": [
        { "label": "Heaters and air machines first",
          "effects": { "F": -20, "P": -5 },
          "reason": "The greenhouse lights went dark, so the plants stopped growing.",
          "realWorld": "On the ISS, life-support machines always get power first." }
      ]
    }
  ]
}
```

**Engine functions** (`engine.ts`): `startMission()`, `packCrates(state, counts)`, `enterLevel(state, level, event)`, `applyChoice(state, choice, crew)`, `isLost(state)`, `rank(stars)`.
`validateLevel(level)` throws if any choice changes fewer than two values — run it in the tests so bad content cannot ship.

---

## 5. Build sequence

Hour-by-hour schedule with the parallel video track: `plan.md` §11.

**Balance targets** (`npm run balance` plays every possible path): between 20% and 60% of all paths win; no single choice appears in more than 70% of winning paths; no level is impossible from any state that reached it with all meters ≥ 20.

Cut order if behind: `plan.md` §10.3.

---

## 6. Prompts to paste into Claude

Give Claude `plan.md`, this file and `docs/06` first, then one prompt at a time.

1. **Scaffold (Engine Dev, hour 0):** "Create a Vite + React + TypeScript + Tailwind + Zustand project with the folder layout in docs/08 §4. Add a Home screen with START MISSION, QUICK RUN and three locked tabs. Add `.env.example` with `VITE_NASA_API_KEY=DEMO_KEY`. No other features."
2. **Engine (Engine Dev, hour 2):** "Write `src/engine` exactly as specified in docs/08 §2 and §4: pure functions, no React. Write the tests first, including `validateLevel` rejecting a choice with fewer than two effects, crew halving losses, and lose-at-zero. Make them pass."
3. **Content (Science + Story, hour 2 onward):** "Turn Level N from plan.md §6 into `levelN.json` in the format in §4. Keep the numbers. Rewrite every sentence for a 7-year-old: under 15 words, no jargon. Add a `realWorld` line per choice using only facts listed in docs/06 §4."
4. **Screens (UI Dev, hour 2 onward):** "Build the Decision screen: four meter bars with icon, label and number; story text; three choice cards; a Twinkle hint button. After a choice, animate the meters and show the reason. Match the attached UI reference image. Touch targets at least 44 px."
5. **NASA service (Engine Dev, hour 8):** "Write `src/services/nasa.ts` and `scripts/nasa-snapshot.mjs` as specified in docs/06 §2. One exported function per dataset, each returning `{ data, badge, fetchedAt }`, 3-second timeout, sessionStorage cache, fallback to `public/data/*.json`. Only this file reads the key."
6. **Balance (Engine Dev, hour 16):** "Write `src/engine/balance.ts` that enumerates every path through the six levels and prints the win rate, the most common losing meter per level, and any choice that is in more than 70% of winning paths. Suggest number changes to meet the targets in docs/08 §5."
7. **Hook (UI Dev, hour 16):** "Build the first-launch hook from plan.md §6 row 0: 15 seconds, alarm, 'SOL 214 · JEZERO BASE', one two-option choice that jolts two meters, then 'Every choice costs something. How did we get here?', the three story cards from plan.md §4.2 (each with a FICTION tag, the first with the live NeoWs asteroid card), and the Home screen. Store a flag so it plays once; add 'Replay intro' in Profile settings."
8. **Quick Run (UI Dev, hour 16):** "Build a 60-second three-lane dodge game on a 2D canvas: swipe or arrow keys, debris to dodge, stardust to collect. Hazard speed comes from today's Kp value via `nasa.ts` (Kp 0–3 slow, 4–6 medium, 7–9 fast); show 'Space weather today: Kp N' with its source line. Save stardust to the store."
9. **Profile and Resources (Captain, hour 16):** "Build Profile (call-sign from a fixed list, rank, six badges, top-5 leaderboard from localStorage, settings: sound, reduced motion, reset, Sources) and Resources (four system cards with a one-sentence explanation and source, two upgrade steps each costing stardust, at most 4 upgrades in total, each +5 to that meter's starting value) exactly as in plan.md §6."
