# CrewReady — MVP Build Sequence

**How to use this file.**
1. Open a new chat in this project folder. Attach this file and the plan (`plan.md`, or `CrewReady_FINAL_PLAN_v9.docx`).
2. Paste the **kickoff prompt** from §9.1 once.
3. For each step, paste that step's **prompt** (the grey quote at the end of each step in §5–§7). Or just say **"next"**. The step's spec above the prompt is what Claude builds against.
4. Do not start the next step until the current step's **Done when** list passes and you have looked at the two screenshots.

**What each file is for.**
- The plan says **what** the game is: story, rules, every level, data, scripts, schedule.
- This file says **how to build it**: what already exists, how it should look, the order of work, and what "done" means for each page.
- `docs/human design standards.md` is the quality bar for every screen.
- `docs/06_SCIENCE_AND_NASA_DATA.md` is the only list of facts and data the game may show.
- Where these disagree on game content, the plan wins. Ignore older files in `docs/` (01–05, 07, 08, `BUILD_PROMPTS`, `CHARACTER_CONCEPT_SHEET`, `frontend-ui-prompt-pack`) where they disagree.

---

## 1. What we are building, and what winning needs

**The product.** A free browser game. Kids aged 7–12 command a Mars mission across six levels. Every choice trades power, air and water, food, or radiation protection. Real NASA data drives the events. (NASA Space Apps 2026, challenge: *Build a Junior Astronaut Mission Trainer*.)

**What the judges score, turned into build requirements.** Every step below serves at least one of these. If a piece of work serves none, skip it.

| Judges score | So the build must |
|---|---|
| **Relevance** (20) — answers the challenge; NASA data at the core | Cover all five systems: life support, radiation, power, food, communication delay. Real DONKI storm data must change the size of the storm in levels 2 and 6. If you remove the data, the level should not work |
| **Validity** (20) — sound, working, usable | Be a working public link. Show a source line on every screen that states a fact. Have a "what we simplified" page. Survive a play-test with a real child |
| **Creativity** (20) — fresh, not routine | Open inside an emergency (the hook). Make choices come back later. End with a crew pick that becomes the multiplayer teaser |
| **Impact** (20) — who benefits, how far it reaches | Open on a cheap phone with no login. End with six "I learned" lines |
| **Presentation** (20) — understood in 240 s | Look clear and colourful on video: big readable meters, one idea per screen, the crew on the key screens |
| **User experience** (5) — anyone can use it | A first-timer finishes level 1 in under 3 minutes without help |
| **NASA data usage** (5) — top mark needs NASA plus another agency | NASA DONKI, NeoWs, EPIC, InSight, OSDR, Image Library and APOD, plus NOAA's storm index |
| **Teamwork** (5), named challenge, open repo, complete page (3) | Public repository; credits screen with every member and role |

**Global awards we aim at:**
- **Best Use of Data:** a 7-year-old feels today's real solar storm as a decision.
- **Best Storytelling:** NASA data is the plot of one Earth-to-Mars story.

Both are judged from the project page and the video. So the game must **show** its data on screen, with dates and sources.

**From the challenge author's briefing — rules the build must never break:**
- Not a quiz, not a slideshow. A living simulation.
- No unlimited mode. Every choice costs something.
- A decision in one system visibly hits another.
- Fun and accurate are the same goal.

---

## 2. Where the project stands today (12 Nov 2026)

| Area | State | Files |
|---|---|---|
| Repository | **Connected** to `github.com/YSoB-x-ScriptySphere-2-0/CrewReady` (`main`). The repo's own `public/assets/` (audio, 3D models) and `source/` are kept. The v1 docs are replaced by the v9 docs | `.git`, `.gitignore` |
| Stack | Vite 8, React 19, TypeScript, Tailwind 4, Zustand 5, Vitest, `lucide-react`, Baloo Da 2 and Nunito via `@fontsource`. No backend | `package.json`, `vite.config.ts` |
| Game rules | **Done and tested** (24 tests). Four meters, storm and dust sizes from data, consequences across levels, crew specialists, the Outpost Check. A check rejects any option that changes fewer than two things | `src/engine/engine.ts`, `types.ts`, `engine.test.ts` |
| Level content | **Done**: all six levels from plan §6, as typed data | `src/content/levels.ts` |
| Progress and saving | **Done**: current level, step, retry checkpoint, badges, saved in the browser. The store knows all 13 screens. `go(screen)` switches screens. `BUILT_SCREENS` lists the ones that exist | `src/store/game.ts` |
| Design foundations (A0) | **Done.** Colour tokens, fonts, motion rules, and the shared parts from §4.4 | `src/index.css`, `src/components/ui.tsx`, `BottomNav.tsx`, `Twinkle.tsx` |
| Character art | **Done.** 30 transparent poses cut from the team's sheets, glow halo removed | `public/art/*.webp` (list in §4.3) |
| Screens built | Home, level opening, play (all six step kinds), Mission Replay, Success. All use the new look. Home, hints, Replay and Success show the crew | `src/App.tsx`, `src/components/steps.tsx` |
| NASA data | **Not built.** Storm size is fixed at medium and dust size is random. The key is in `.env` as `VITE_NASA_API_KEY` (git-ignored). `.env.example` is committed | — |
| Not built | Hook, story cards, mission map, data on cards, Quick Run, Profile, Resources, Training (locked), Sources page, sound, publishing | — |

**Commands.**
- Run: `npm run dev`. Port 5173 is set in `.claude/launch.json`. If 5173 is busy, the preview moves to the next free port.
- Test: `npm test`.
- If a new file's Tailwind classes don't show up in the dev preview (the layout looks unstyled), restart the dev server. The production build is not affected.
- Build: `npm run build`.

**Known problems to fix along the way**
1. Mission Replay lists every reason line from the last action. It should name the one choice in this level that cost the failed meter the most (step A8).
2. Orbit's shoulder patch is a dark blue oval with a red-orange streak. At game size it reads as a dot. The team should decide whether it looks too much like NASA's insignia (§10).
3. A random player rarely wins level 6 because Air & Water runs out. That is a balance question for C1. Do not tune numbers before then.
4. Nothing is pushed yet. The first push needs the team's go-ahead (C3).

---

## 3. How to work

1. **One step at a time, in order.** Name the step you are on. Finish it, check it, then stop and report.
2. **Read before writing.** Read a file before changing it. Reuse what exists. Do not rewrite the engine or level content unless a step says so.
3. **Every step ends with the same five checks:**
   - `npm test` passes and `npm run build` succeeds.
   - The page is opened in the browser preview and used for real: clicked through, not just compiled.
   - It is looked at twice, at phone width (375 px) and laptop width (1280 px). No sideways scrolling, nothing cut off, nothing overlapping by accident.
   - It works with the keyboard alone (Tab, Enter, Space, arrows where it makes sense) and the focus ring is visible.
   - The browser console shows no errors.
4. **No dead ends.** Every button does something or is clearly locked. When a step builds a new screen, add it to `BUILT_SCREENS` in `src/store/game.ts`. That unlocks its bottom-nav item and source lines automatically. Never show placeholder text as real content.
5. **No invented facts.** Every factual sentence a player sees comes from the plan or `docs/06_SCIENCE_AND_NASA_DATA.md` §4. If a fact is needed and missing, leave it out and say so in the report.
6. **Words are for a 7-year-old.** Sentences under 15 words. One idea per screen. The first time a science word appears, it gets a five-word explanation ("a sol — a Mars day"). All level text was simplified on 12 Nov 2026; keep new text at that level.
7. **Do not add features that are not in this file.** If something seems missing, say so; do not build it unasked.
8. **The API key never appears** in code, logs, screenshots or replies. Only `src/services/nasa.ts` and `scripts/nasa-snapshot.mjs` read it.
9. **Report the same way every time** (template in §9.3): what was built, the files changed, the checks and their results, two screenshots, and anything not verified.

---

## 4. Design direction

### 4.1 What the references tell us

Three mock-ups are in `ui reference/`. The mentor's verdict: the idea is right, but they are **noisy**. Keep the app **colourful**.

| In the references | Decision | Reason |
|---|---|---|
| Two kid astronauts (Orbit and Nova) and Twinkle the round robot guide | **Keep**, using the team's art in `public/art/` | Warm, memorable, gives a child someone to be |
| Big, obvious primary button ("PLAY", "FLY NOW") | **Keep** | A 7-year-old knows what to press |
| Bottom navigation with five places | **Keep**: Missions, Quick Run, Resources, Training, Me | Matches the plan |
| Earth and space through a window | **Keep, as real photos** | NASA's own images are more convincing than generated ones |
| Dark navy everywhere with cyan glow on every edge | **Drop** | The look of every AI-made "space dashboard", and what made the mock-ups noisy |
| Glass panels, neon outlines, bevelled glowing buttons | **Drop** | Decoration without purpose; hard to read on a cheap phone |
| Busy 3D backgrounds full of props (mugs, books, globes, crates) | **Drop** | Competes with the one thing the child should look at |
| Chips and pills along the top (rank, currency, language, sound) | **Reduce** to stars and one menu | Too much to read before playing |
| NASA logo on the suits and buttons | **Remove** | NASA's insignia may not be used on products or characters without permission. Write "NASA Open Data" in plain text and link the source |
| Full avatar customisation (helmets, patches, colours) | **Reduce** to choosing Orbit or Nova and a call-sign | Fun, but not what is judged |

### 4.2 The idea: paper mission cards on a coloured sky

Colour comes from **where you are**, not from glow. Each place in the story has its own sky colour that fills the screen. Everything the player reads or presses sits on a solid, light "mission card" with dark text. The colour changes as the journey moves, which is how a child feels the trip, and text stays easy to read everywhere.

| Place | Used in | Sky colour | `Sky place=` |
|---|---|---|---|
| Earth | Home, level 1, Profile | Bright blue `#2F6FED` | `earth` |
| Deep space | Story cards, level 2, Quick Run | Indigo `#1F1A5C` | `space` |
| Mars day | Levels 3, 5, 6, mission map, Resources, Training, Sources | Rust orange `#D9622B` | `mars` |
| Dust storm | Hook, level 4 | Ochre `#B9801F` | `dust` |
| Alarm | Mission Replay | Deep red `#A8322E` | `alarm` |
| Success | Outpost Check | Dawn pink-to-gold, the **only** gradient in the app | `success` |

| Token (Tailwind name) | Value | Used for |
|---|---|---|
| `ink` | `#1B1F3B` | All text on cards; the primary button on paper |
| `paper` | `#FFF8EC` | Card background; the primary button on a sky |
| `edge` | `#E9DFCC` | Card dividers, quiet panels |
| `muted` | `#5A5F7D` | Secondary text on paper (still at least 14 px) |
| `power` | `#F5B700` | Power meter, and only that |
| `air` | `#1E9BE0` | Air & Water meter, and only that |
| `food` | `#2FA84F` | Food meter, and only that |
| `shield` | `#7A5AE0` | Shield meter, and only that |
| `star` | `#E8A100` | Science stars |
| `danger` | `#D93A3A` | A meter at 20 or below, losses |
| `good` | `#1F8A4C` | Gains, the `NASA LIVE` badge |

Rules that keep it from looking generated:
- **A meter colour means that meter everywhere**: bars, outcome chips, crew cards, crate bins. Never reuse it as decoration.
- **One primary button per screen.** Everything else is a `QuietButton` or a `ChoiceCard`.
- **No glow, no glass, no blur, no neon outlines, no floating particles.** Depth comes from one soft shadow under cards and a 2 px ink outline on things you can press.
- **One corner radius for cards (20 px), one for buttons and choices (14 px).** Not everything is a pill.
- **Different screens are built differently**, because their content is different. The hook is full-screen and loud. A decision is meters on top and three choices. The map is a path. Sources is a plain list. Do not reuse one card grid for all of them.
- **No decoration without a job.** If a shape, star or icon tells the child nothing, remove it.
- **Check on a phone at arm's length.** If the meters cannot be read, the screen is not finished.

### 4.3 Type, icons, characters, pictures, motion, sound

- **Type.** Headings and buttons use **Baloo Da 2**: round, friendly, and it includes Bangla, so a later Bangla version uses the same font. Body text uses **Nunito**. Sizes: body 18 px, choices 18 px bold, level title 32 px (26 px on phones), meter numbers 20 px bold. Nothing a player must read is under 14 px.
- **Icons.** `lucide-react`, 2 px stroke, ink-coloured. Power `Zap`, Air & Water `Droplets`, Food `Sprout`, Shield `Shield`, stars `Star` with a gold fill. No emoji anywhere.
- **Characters.** Use the `Twinkle`, `TwinkleSays` and `Kid` components in `src/components/Twinkle.tsx`. Never draw a character in code or generate new character art. The poses in `public/art/` are:

  | Character | Poses (`public/art/<name>.webp`) |
  |---|---|
  | Twinkle | `twinkle-happy`, `-neutral`, `-question`, `-worried`, `-sad`, `-stars`, `-surprised`, `-tablet`, `-wink`, `-hearts`, `-squint`, `-sleepy` |
  | Orbit | `orbit-stand`, `-wave`, `-arms`, `-cheer`, `-run`, `-tablet`, `-think`, `-point`, `-surprised`, `-thumbs` |
  | Nova | `nova-stand`, `-wave`, `-arms`, `-cheer`, `-tablet`, `-think`, `-point`, `-helmet` |

  Which pose goes where:

  | Screen | Characters | Status |
  |---|---|---|
  | Hook | Twinkle `surprised` in the bubble; Orbit `point` (or Nova `point` if Nova is chosen) at the screen edge | A1 |
  | Story cards | Card 1: none (the asteroid card is the picture). Card 2: Nova `think`. Card 3: Orbit `arms` and Nova `arms` side by side | A2 |
  | Home | Twinkle `happy` with the greeting; Nova `wave` and Orbit `wave` standing on the card | Built |
  | Hints ("Ask Twinkle") | Twinkle `question` | Built |
  | Mission Replay | Twinkle `worried` | Built |
  | Success | Nova `cheer`, Twinkle `stars`, Orbit `cheer` | Built |
  | Profile | The chosen kid in `stand`; the other in `stand` and faded until picked | A11 |
  | Data cards, Sources | Twinkle `tablet`, small, at most once per screen | A5, A14 |
  | Training (locked) | Twinkle `sleepy` | A13 |

  Characters appear **only** on these screens. During a decision they never cover the meters or the choices.
- **Photographs.** Real NASA photos are the main imagery: Earth (EPIC), Jezero Crater (Perseverance), space lettuce (ISS), the picture of the day. Each sits in a `DataCard` with its credit. A photo is never a full-screen wallpaper behind text.
- **Motion.** Meters slide to their new value in 0.7 s. Cards rise in 0.2 s. A meter change (+10 / −15) shows for 3 s, then fades. The hook shakes once. Nothing loops forever. Everything stops when the device asks for reduced motion (already handled in `index.css`).
- **Sound.** Off until the player turns it on. Five short sounds at most: tap, gain, loss, alarm, success. Candidates are in the repo at `public/assets/audio/ui/`. Check each file's licence before using it (§10).

### 4.4 Parts used on every screen (all exist in `src/components/`)

| Part | What it is |
|---|---|
| `Sky place=` | Full-screen background in the place's colour. Takes an optional `nav` (the bottom bar). Buttons placed directly on it switch to their on-sky look |
| `MissionCard` | Paper card, ink text, 20 px corners, one soft shadow, rises in |
| `Meters` / `MeterBar` | Icon, name, bar and number in the meter's colour. Turns red and says "Low" at 20 or below. Shows the change for a moment. `Meters` takes a `top` slot for the level's top bar |
| `PrimaryButton`, `QuietButton` | At least 48 px tall; visible focus ring; one primary per screen |
| `ChoiceCard` | Full-width pressable card for one option. `selected`, `faded` and `pressed` (for pick-N toggles) |
| `Twinkle`, `TwinkleSays`, `Kid` | The characters (§4.3) |
| `DataCard` | Real NASA data: picture or figure, one kid sentence, a `Badge` (`NASA LIVE`, `NASA ARCHIVE`, `GAME ESTIMATE` or `FICTION`), the date, and an optional source line |
| `SourceLine` | One line at the foot of a card. It becomes a button that opens Sources once `sources` is in `BUILT_SCREENS` |
| `OutcomePanel` | Reason lines plus one chip per changed meter, in that meter's colour |
| `BottomNav` | Missions · Quick Run · Resources · Training · Me. Unbuilt places show a lock. Never shown inside a level |

---

## 5. Phase A — the front end, one page at a time

Hook and story come first. They are the first 30 seconds a judge sees and the opening shot of both videos. NASA data is wired in Phase B. Until then, every data card shows a fixed sample marked `NASA ARCHIVE` and taken from `docs/06` (for example the May 2024 storm). Never make up a number.

Each step has five parts: **Why** (which score it serves), **Build**, **Words on screen** (exact copy where it matters), **Done when**, and a **Prompt** to paste.

### A0 — Foundations ✅ done 12 Nov 2026
Tokens, fonts, icons, shared parts, screen switching, no emoji. The existing mission plays end to end on the new parts. Character art was added on Home, hints, Replay and Success.

---

### A1 — The hook (about 1.5 h) ✅ done 12 Nov 2026 — `src/screens/Hook.tsx`
**Why.** Creativity and Presentation. The first five seconds of the app and of both videos.

**Build.**
- New file `src/screens/Hook.tsx`; add `hook` to `BUILT_SCREENS`.
- Plays on **first launch only**. Store `seenIntro: true` in the game store, which already persists. After that, launch goes to Home. "Replay intro" in Profile (A11) sets the screen back to `hook`.
- **Screen 1** (dust sky, full screen, no bottom nav):
  - A small label, "SOL 214 · JEZERO BASE".
  - Then large: **"Commander — a dust storm hits in 60 seconds."**
  - The four meters, using the real `Meters` component with a fixed taste-only state (Power 60, Air & Water 70, Food 60, Shield 70).
  - Twinkle `surprised` saying: "The solar panels! Fold them, or leave them out?"
  - A 60-second bar that really counts down. At zero it does not punish: Twinkle picks "fold".
  - Two large `ChoiceCard`s: **Fold the panels** / **Leave them out**.
- **On choice:** the screen shakes once (`@keyframes` in `index.css`, off under reduced motion). The meters visibly drop, with one reason line. The numbers are level 4's (plan §6.4) at the medium dust case, D = 15, so the hook previews the real level:
  - Fold: Power −25, Food −5. "The panels are safe. But the greenhouse lights went dim."
  - Leave out: Power −15. "You caught the last light. But dust may bury the panels."

  These are **taste numbers only**. They never touch the real game state.
- **Screen 2** (dust sky): **"Every choice costs something."** Below it, one `PrimaryButton`: **"How did we get here?"**, which goes to `story`. Until A2 is built, it goes to `home`.
- Source line on screen 1: `Dust storms: NASA Opportunity mission`.
- Skip: a `QuietButton` "Skip intro" in the top corner, on both screens.

**Done when.**
- A new visitor (clear site data, reload) is making a choice within 5 seconds of loading.
- It works by touch and by keyboard (Tab to a choice, Enter).
- A second visit goes straight to Home.
- The countdown stops when the tab is hidden, and nothing moves under reduced motion.
- The game's real meters at "Start mission" are unchanged by the hook.

> **Prompt — A1.** Do step A1 (the hook) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Hook.tsx` exactly as specified: dust sky, the two screens, the real 60-second countdown, Twinkle `surprised`, the two choices with their taste-only meter drops (level 4's numbers at D = 15) and reason lines, one shake, "Skip intro", and the source line. Add a persisted `seenIntro` flag so first launch opens the hook and later launches open Home, and add `hook` to `BUILT_SCREENS`. Reuse `Sky`, `Meters`, `ChoiceCard`, `TwinkleSays`, `PrimaryButton` and `SourceLine`; do not create new look-alike components. The hook must not change the real mission state. Then run the five checks in §3, including a fresh-visitor test and a second-visit test, show a 375 px and a 1280 px screenshot of both hook screens, report in the §9.3 format, and stop.

---

### A2 — The story cards (about 1 h) ✅ done 12 Nov 2026 — `src/screens/Story.tsx`
**Why.** Best Storytelling: the honest bridge from fiction (the asteroid) to fact (real NeoWs data).

**Build.**
- New file `src/screens/Story.tsx`; add `story` to `BUILT_SCREENS`. Deep-space sky.
- Three cards, one per screen, text **word for word** from plan §4.2:
  1. "The Near Miss"
  2. "The Lesson"
  3. "Your Mission"
- Every card carries the `FICTION` badge at the top.
- Progress dots (three) under the card. Next is the primary button, Skip is quiet. Swipe left and right on touch. Left and right arrow keys on the keyboard.
- Under card 1, a `DataCard` with badge `NASA ARCHIVE`: "Real asteroids passing Earth this week — NASA is tracking N. None will hit us."
  - N is a fixed sample until B4. Take it from a real NeoWs answer saved in `src/content/samples/neows.json` (bundled, so it works offline), and show that answer's date. If no real answer is at hand, show the sentence without N and say so in the report.
- Characters: card 2 shows Nova `think`; card 3 shows Orbit `arms` and Nova `arms` (§4.3).
- Card 3 ends with the primary button **"Accept the mission"** → Home.

**Done when.**
- Reading all three cards aloud takes under 25 seconds.
- Skip works from every card.
- The FICTION badge is visible on all three cards.
- Swipe, arrows and buttons all move between cards.
- The hook's "How did we get here?" now leads here.

> **Prompt — A2.** Do step A2 (the story cards) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Story.tsx` on the deep-space sky with the three cards from plan §4.2, word for word, each with the `FICTION` badge. Add progress dots, Next (primary), Skip (quiet), swipe on touch and arrow keys on the keyboard. Put the asteroid `DataCard` under card 1 using only real saved NeoWs numbers, never invented ones. Place Nova and Orbit as in the §4.3 pose table. End card 3 with "Accept the mission" → Home, point the hook's last button here, and add `story` to `BUILT_SCREENS`. Time a read-aloud, run the five checks, show 375 px and 1280 px screenshots of card 1 and card 3, report in the §9.3 format, and stop.

---

### A3 — Home (about 1.5 h) ✅ done 12 Nov 2026 — `src/screens/Home.tsx`
**Why.** User experience: a child must know what to press without reading.

**Build.** Home exists; finish it.
- Keep the Earth sky, Twinkle `happy` greeting, and the waving Orbit and Nova.
- One primary button: **Start mission**. When a mission is in progress it reads **Continue — Level N**, with "Start over" as a quiet button. "Start over" asks first if a mission is in progress, using a small inline confirm, not a browser popup.
- A second, smaller button: **Quick Run — 60 seconds** (a `QuietButton`, locked with a lock icon until A10).
- A slim **"Space weather today"** strip: one line, a sample Kp value from the May 2024 archive and its `NASA ARCHIVE` badge, until B4.
- Replace the "Your route" list with one quiet line: "Level N of 6 — see the map", linking to `map` once A4 exists.
- Bottom navigation. Stars top right. No other chips.

**Done when.**
- A child can tell what to press without reading more than three words.
- At 375 px, the primary button sits above the fold together with the characters.

> **Prompt — A3.** Do step A3 (Home) from `docs/BUILD_SEQUENCE.md`. Home already exists in `src/App.tsx`. Move it to `src/screens/Home.tsx` and finish it to the spec. Keep exactly one primary button: Start mission, or Continue — Level N. Add Start over with an inline confirm, the Quick Run quiet button (locked until A10), the one-line Space weather strip with a sample archive value and badge, and replace the route list with a single map link. Keep the crew art placement. Make sure the primary button is above the fold at 375 × 812. Run the five checks, show both screenshots, report in the §9.3 format, and stop.

---

### A4 — Mission map (about 1 h) ✅ done 12 Nov 2026 — `src/screens/MissionMap.tsx`
**Why.** Presentation: progress obvious at a glance, and a good video shot.

**Build.**
- New file `src/screens/MissionMap.tsx`; add `map` to `BUILT_SCREENS`. Mars-day sky. The bottom nav's Missions item now opens the map.
- A vertical path drawn in SVG (one ink line, 4 px, dashed for the part not yet travelled). Earth at the bottom, the outpost at the top. Six stops; each shows its number, title and place, and the `Award` icon if its badge is earned.
- The current stop is a larger paper disc with a 3 px ink ring and a "You are here" label. Pressing it opens the level. Earned stops can be pressed to see the "I learned" line. Later stops are visible but closed, with a lock icon.
- Beyond stop 6, two closed stops: **"Crew Mode"** and **"More worlds — coming soon"**.
- On phones the path is a single column. On laptops it may zigzag, but it still reads bottom to top.

**Done when.**
- Progress is obvious at a glance.
- The path reads correctly on a phone with no sideways scrolling.
- Every stop is reachable by keyboard and announces its state ("Level 3, First Breath, locked").

> **Prompt — A4.** Do step A4 (the mission map) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/MissionMap.tsx` on the Mars-day sky: an SVG path from Earth (bottom) to the outpost (top) with six stops showing number, title, place and earned badge. The current stop is highlighted and opens the level, earned stops show their "I learned" line, and later stops are locked. Add the two closed stops beyond stop 6. Wire Missions in the bottom nav and the Home map link to it, and add `map` to `BUILT_SCREENS`. Give each stop an accessible name with its state. Run the five checks, show both screenshots (with a mission in progress at level 3), report in the §9.3 format, and stop.

---

### A5 — Level opening (about 1 h)
**Why.** Relevance and Storytelling: each level starts with real data and shows that earlier choices matter.

**Build.** The level opening exists (`LevelOpening` in `App.tsx`); finish it.
- Move it to `src/screens/LevelOpening.tsx`. The sky already follows the level (`LEVEL_PLACE`).
- Show, in order:
  1. Level number and title.
  2. The place and sol.
  3. The story sentence.
  4. "You will learn: …" (from `level.teaches`).
  5. The level's `DataCard`, a sample until B4.
  6. The carry-over lines.
- The living costs and consequences from earlier levels tick down on the meters as the screen opens, with their reasons. The first line of a consequence starts with "Remember …" (already in the level data). Show each reason next to the meter colour it hit.
- Twinkle `tablet`, small, beside the data card only.

**Done when.**
- Entering each of the six levels shows the right sky, the right data card, the right teaches line and the right carry-over lines.
- Check this by playing to each level, or by setting the store state in the console.

> **Prompt — A5.** Do step A5 (the level opening) from `docs/BUILD_SEQUENCE.md`. Move `LevelOpening` to `src/screens/LevelOpening.tsx`. Show title, place, story, the "You will learn" line from `level.teaches`, the level's sample `DataCard` (real archive values from `docs/06` only, badge `NASA ARCHIVE`), and the carry-over reasons, each marked with the colour of the meter it changed, while the meters slide. Use Twinkle `tablet` beside the data card. Verify all six levels one by one, run the five checks, show both screenshots for level 2 and level 4, report in the §9.3 format, and stop.

---

### A6 — The decision screen and outcome (about 2 h) — the screen the player sees most
**Why.** Presentation and Validity: a silent video must show what was chosen and what it cost.

**Build.** It exists (`Play` in `App.tsx`); finish it.
- Move it to `src/screens/Play.tsx`.
- Top: the four meters, always. Middle: the question, large. Below: the options as `ChoiceCard`s.
- **Ask Twinkle**: Twinkle `question` names the lowest meter and what each option costs, one short line per option, built from the option's effects. It never names the answer.
- **After a choice:**
  - The chosen card stays, marked `selected`; the other cards fade (`faded`) and stay in place, so the screen does not jump.
  - The meters slide.
  - The reason line and the chips appear ("Power −15" in the meter's colour).
  - One button: **Next**.
- **The Earth message clock** (level 3): replace the progress bar with a small SVG of Mars and Earth and a dot travelling there and back (2 s each way). Air & Water drains in view while it travels. Keep the existing 4.2 s timing.

**Done when.**
- In a 10-second screen recording with no sound, a stranger can tell what was chosen and what it cost.
- The hint never contains the words "best", "right" or "answer".

> **Prompt — A6.** Do step A6 (the decision screen) from `docs/BUILD_SEQUENCE.md`. Move `Play` to `src/screens/Play.tsx`. After a choice, keep the chosen `ChoiceCard` selected and fade the others in place. Show the outcome chips and one Next button. Rebuild the Ask Twinkle hint so it lists each option's costs from its effects and names the lowest meter, never the answer. Replace the level-3 message bar with an SVG Mars–Earth clock with a travelling dot, while Air & Water visibly drains. Record or screenshot a choice before and after, run the five checks, report in the §9.3 format, and stop.

---

### A7 — The five hands-on steps (about 2.5 h)
**Why.** Creativity: it should feel like handling something, not filling a form.

**Build.** Restyle each in `src/components/steps.tsx` (split into files if it grows past about 300 lines):
- **Crates** (level 1): eight crate tiles at the top. Tap a bin to load the next crate; tap a loaded crate in a bin to take it back. Each bin shows its meter's future value as a ghost segment on a small `MeterBar`.
- **Stowing** (level 1): four items, two seat-side slots drawn as outlined boxes. Picking an item moves it into a slot. Each item shows what "within reach" and "in the hold" mean.
- **Landing checklist** (level 2): four cards to tap in order. A small lander drawing (simple SVG, ink lines) moves down one step with each right tap. A wrong tap shakes the card once and resets, at the cost the level data already defines.
- **Power sliders** (level 4): seven battery blocks shared between three systems that each want three. Blocks are buttons you move. The cost of each missing block is shown in the meter's colour as it changes.
- **Crew pick** (level 6): five specialist cards; pick three. Each shows the meter it protects in that meter's colour; the Scientist shows a star.

**Done when.**
- Each works with one thumb on a phone and with Tab/Enter on a keyboard.
- No step can be finished in an invalid state (the confirm button stays disabled).
- The engine tests still pass.

> **Prompt — A7.** Do step A7 (the five hands-on steps) from `docs/BUILD_SEQUENCE.md`. Restyle Crates, Stowing, Landing checklist, Power sliders and Crew pick in `src/components/steps.tsx` so each feels like handling objects, as specified. Keep the engine calls (`packCrates`, `stow`, `checkOrder`, `setSliders`, `pickCrew`) exactly as they are. Use meter colours only for their meters, and simple ink-line SVG for the lander. Test each step with one thumb at 375 px and with the keyboard only, and confirm the commit button stays disabled in every invalid state. Run the five checks, show a phone screenshot of each of the five steps, report in the §9.3 format, and stop.

---

### A8 — Mission Replay (about 1.5 h)
**Why.** Validity and Impact: failure teaches instead of punishing.

**Build.**
- Move `Replay` to `src/screens/Replay.tsx`. Alarm sky. Twinkle `worried`: "Mission paused. Nobody is hurt. Let's see what happened."
- Three parts:
  1. **What ran out** (meter icon, name, 0).
  2. **The choice that cost it most.**
  3. **What real crews do**, with its source line.
- **Engine fix for part 2.**
  - In the store, record each action's label and its `delta` for the current level.
  - On loss, pick the action in this level with the largest loss to the failed meter. Ties go to the earlier choice. Living costs count only if nothing else cost that meter.
  - Show that choice's label and reason line.
- Buttons: **Try this level again** (primary) and **Home** (quiet).

**Done when.**
- Failing level 2 by choosing "Keep working on the experiment" names that choice as the cause, even if a later choice delivered the final blow.
- There is a Vitest test for exactly that, plus a test for the tie rule.

> **Prompt — A8.** Do step A8 (Mission Replay) from `docs/BUILD_SEQUENCE.md`. Write the failing tests first in `src/engine/engine.test.ts` (or a new `replay.test.ts`). One: level 2, "Keep working on the experiment" then a later small loss must name the experiment choice. Two: the tie rule. Then record each action's label and delta per level in the store and pick the biggest loss to the failed meter. Move Replay to `src/screens/Replay.tsx` with the three parts and Twinkle `worried`. Do not change level numbers. Run the five checks, show both screenshots of a real level-2 failure, report in the §9.3 format, and stop.

---

### A9 — Success and the Outpost Check (about 1.5 h)
**Why.** Impact: six "I learned" lines a child can repeat to a parent.

**Build.**
- Move `Success` to `src/screens/Success.tsx`.
- Keep the success sky and the cheering crew (Nova `cheer`, Twinkle `stars`, Orbit `cheer`).
- Show the result (Survives / Stable / Thriving) with rank, stars, and which systems are healthy: the four meter icons, ticked or not, at 30 or more.
- Show the six "I learned" lines, each with its source.
- Add a `DataCard` for NASA's picture of the day: a sample until B4, from a real saved APOD image with its credit.
- Two closed cards: **Crew Mode** and **More worlds**, "coming soon".
- Buttons: **Fly the mission again** (primary) and **Home** (quiet).
- Save the score (result, stars, meters, date, call-sign once A11 exists) to the store's leaderboard, keeping the best five.

**Done when.**
- All three results can be reached and read correctly. Produce each one from engine states in a test, then by setting the store in the browser.
- The score appears once in the saved leaderboard, not twice on reload.

> **Prompt — A9.** Do step A9 (Success and the Outpost Check) from `docs/BUILD_SEQUENCE.md`. Move `Success` to `src/screens/Success.tsx`. Show result, rank, stars and the four systems' health with icons. List the six "I learned" lines with sources. Add the APOD `DataCard` from a real saved image, the two closed teaser cards, and save the score to a best-five leaderboard in the store without double-saving on reload. Add engine tests that produce Survives, Stable and Thriving, and check each in the browser. Run the five checks, show both screenshots of the Thriving result, report in the §9.3 format, and stop.

---

### A10 — Quick Run (about 3 h)
**Why.** Impact and UX: the fast way in for a child who is not ready to read.

**Build.**
- New file `src/screens/QuickRun.tsx` with a `<canvas>`; add `quickrun` to `BUILT_SCREENS`. Deep-space sky.
- **The game.** A 60-second, three-lane dodge game. Move between lanes by swiping, by tapping the left or right half, or with the arrow keys. Rocks to dodge, stardust to collect. A hit costs 3 seconds, not the game.
- **Speed.** "Space weather today: Kp N" sets how fast hazards come: slow for Kp 0–3, medium for 4–6, fast for 7–9 (`docs/06` §3). Fixed at medium until B4; the label says it is a sample.
- **The loop.** `requestAnimationFrame` with delta time, so speed does not depend on frame rate. It pauses when the tab is hidden (`visibilitychange`) and shows a Resume button.
- **Drawing.** Simple flat shapes in the palette: paper rocks with an ink outline, gold stardust. The player is Orbit `run` if it reads at small size (Nova has no running pose); otherwise a simple ship shape.
- **End screen.** Stardust earned, total stardust (saved), **Play again** (primary), **Spend it in Resources** (quiet, locked until A12).

**Done when.**
- It holds a steady frame rate on a phone (check the Performance panel at 4× CPU slowdown).
- It pauses when the tab is hidden.
- It can be played with one thumb.
- Stardust survives a reload.

> **Prompt — A10.** Do step A10 (Quick Run) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/QuickRun.tsx`: a 60-second three-lane canvas game with a delta-time `requestAnimationFrame` loop. Controls are swipe, tap left or right half, and arrow keys. Rocks cost 3 seconds; stardust is collected and saved in the store. Pause on `visibilitychange`. Show "Space weather today: Kp N (sample)" at medium speed until Phase B. Use palette colours only, no glow. Add the end screen and add `quickrun` to `BUILT_SCREENS`. Check the frame rate at 4× CPU slowdown, play it by keyboard and by touch emulation, run the five checks, show both screenshots mid-game and of the end screen, report in the §9.3 format, and stop.

---

### A11 — Profile, "Me" (about 1.5 h)
**Why.** Impact (no personal data) and Teamwork (credits are reachable).

**Build.**
- New file `src/screens/Profile.tsx`; add `profile` to `BUILT_SCREENS`. Earth sky.
- **Choose your astronaut.** Orbit or Nova, shown in `stand`; the unchosen one is faded. Then a **call-sign** from a shuffle list of about 20 friendly space words, such as "Comet", "Nebula", "Rover" and "Quasar", with a "Shuffle" button. No typing, so no personal data.
- **Progress.** Rank, the six level badges (earned ones in ink, others outlined), and a leaderboard of the best five missions on this device.
- **Settings.**
  - Sound on/off (stored; used once sounds exist).
  - Reduced motion: follow the device, or force it on.
  - Replay intro.
  - Reset progress: asks first, inline, with a clear "This deletes your badges and stardust" line.
  - Sources and credits, which opens `sources` once A14 exists.

**Done when.**
- Everything survives a page reload.
- Reset really clears it all, including `seenIntro`.

> **Prompt — A11.** Do step A11 (Profile) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Profile.tsx` on the Earth sky. Add the Orbit/Nova choice using `Kid` `stand`, the shuffle call-sign list (no typing), rank, six badges, the best-five leaderboard, and settings for sound, reduced motion, replay intro, reset (with an inline confirm) and Sources. Persist all of it in the store, add `profile` to `BUILT_SCREENS`, and use the chosen kid on the hook from now on. Reload-test every setting, test that reset clears everything, run the five checks, show both screenshots, report in the §9.3 format, and stop.

---

### A12 — Resources (about 1.5 h)
**Why.** Relevance: the real systems behind the four meters. No unlimited mode.

**Build.**
- New file `src/screens/Resources.tsx`; add `resources` to `BUILT_SCREENS`. Mars-day sky.
- Four system cards: Power, Air & Water, Food, Shield. Each has a left edge in its meter colour, one kid sentence on what the real system does (facts only from `docs/06` §4), and a source line.
- Two upgrade steps per system, bought with stardust. Each gives +5 to that meter's starting value. Show the price on the button.
- The rocket carries **four upgrades in total**. Show this as four slots that fill, with the words "Room on the rocket: N of 4".
- Upgrades apply at the start of the next mission (`startMission` reads them).

**Done when.**
- Buying is impossible without enough stardust or past the cap; the button explains why.
- A new mission starts with the upgraded values.
- There is a test for the cap.

> **Prompt — A12.** Do step A12 (Resources) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Resources.tsx` on the Mars-day sky: four system cards with one sourced sentence each (`docs/06` §4 facts only), two +5 upgrade steps each priced in stardust, and a visible four-slot rocket cap. Apply upgrades in `startMission` for the next mission only, and add tests for the cap and for the starting values. Add `resources` to `BUILT_SCREENS`. Run the five checks, show both screenshots with one upgrade bought, report in the §9.3 format, and stop.

---

### A13 — Training, locked (about 0.5 h)
**Why.** Shows the roadmap honestly without looking broken.

**Build.**
- New file `src/screens/Training.tsx`; add `training` to `BUILT_SCREENS` (the screen opens; its content is locked). Mars-day sky.
- Twinkle `sleepy` with the line "Training opens in the next update."
- Three closed cards: **Mind** (brain mini-games), **Body** (real astronaut exercise), **Reels** (short NASA clips). Each has a lock icon and "Coming in the next update".
- Tapping a card makes Twinkle say so; nothing else happens.

**Done when.** Nobody could mistake it for a broken page.

> **Prompt — A13.** Do step A13 (Training, locked) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Training.tsx` on the Mars-day sky with Twinkle `sleepy` and three locked cards (Mind, Body, Reels). Tapping a card updates Twinkle's line; nothing else happens. Add `training` to `BUILT_SCREENS`. Run the five checks, show both screenshots, report in the §9.3 format, and stop.

---

### A14 — Sources and credits (about 1 h)
**Why.** Validity and NASA data usage: this is the page judges check.

**Build.**
- New file `src/screens/Sources.tsx`; add `sources` to `BUILT_SCREENS`. Every `SourceLine` becomes a button that opens this page. A Back button returns to the screen it came from (store `returnTo`).
- A plain, readable list (not a card grid). For each dataset in plan §8.1 plus NOAA: name, agency, where it appears in the game, its badge and date, and a link (opens in a new tab, `rel="noopener"`).
- Then:
  - "What we simplified" (`docs/06` §5 table).
  - The honesty note (plan §4.3, word for word).
  - The team with roles (placeholders clearly marked "[team to fill]" until §10 supplies names).
  - A short note on how AI was used.
  - Image credits for NASA photos.
  - A line that the characters are the team's own art.

**Done when.**
- Every dataset in plan §8.1 is listed.
- Every link opens.
- Every source line in the app reaches this page and Back returns to the same place.

> **Prompt — A14.** Do step A14 (Sources and credits) from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Sources.tsx` as a plain list. Include every dataset from plan §8.1 plus NOAA SWPC with where it is used, badge, date and link; the "What we simplified" table from `docs/06` §5; the honesty note from plan §4.3 word for word; team and roles (clearly marked placeholders if names are missing); the AI-use note; and image credits. Make every `SourceLine` open it with a working Back (`returnTo`), and add `sources` to `BUILT_SCREENS`. Click every link and every source line, run the five checks, show both screenshots, report in the §9.3 format, and stop.

---

## 6. Phase B — real NASA data

Do this only after Phase A, so the screens already have a place for the data.

### B1 — Snapshot (about 1.5 h)
**Build.**
- `scripts/nasa-snapshot.mjs`, run as `npm run nasa:snapshot`.
- It reads the key from `.env` (Node's `--env-file=.env`), calls every endpoint in plan §8.1 once, and saves trimmed answers to `public/data/*.json`, in the eight files listed in `docs/06` §2.2.
- Each file starts with `{ "fetchedAt", "source" }`. The key is stripped from every saved URL.
- It includes the fixed DONKI archive window 1–31 May 2024.

**Done when.**
- Eight files exist and each has a `fetchedAt` date.
- `grep` for the key across `public/` finds nothing.

> **Prompt — B1.** Do step B1 from `docs/BUILD_SEQUENCE.md`. Write `scripts/nasa-snapshot.mjs` and the `nasa:snapshot` npm script. Follow `docs/06` §2.2 exactly: the eight files, `fetchedAt` and `source` at the top of each, the May 2024 DONKI window, DONKI ranges of 60 days or less, CME/SEP/GST (never FLR), and EPIC from `epic.gsfc.nasa.gov`. Strip the key from every saved string. Run it once, prove the key is in no output file without printing the key, list the files with their sizes, report in the §9.3 format, and stop.

### B2 — Data service (about 1.5 h)
**Build.**
- `src/services/nasa.ts` is the only runtime file that reads the key.
- One function per dataset (`docs/06` §2.3), each returning `{ data, badge, fetchedAt }`.
- Live calls have a 3-second limit (`AbortController`) and are cached in `sessionStorage`. Any failure, timeout, 429 or empty answer returns the snapshot with `NASA ARCHIVE`.

**Done when.**
- With the network switched off in the browser, every card still shows real data, marked ARCHIVE.
- There are unit tests for the fallback using a mocked `fetch`.

> **Prompt — B2.** Do step B2 from `docs/BUILD_SEQUENCE.md`. Write `src/services/nasa.ts` per `docs/06` §2.3: one function per dataset, a 3-second `AbortController` timeout, a `sessionStorage` cache, and a snapshot fallback with the `NASA ARCHIVE` badge on any error. InSight and OSDR are always archive. Add Vitest tests with mocked `fetch` for success, timeout, 429 and empty answers. Run the five checks, then switch the network off in the browser and confirm the archive badges. Report in the §9.3 format and stop.

### B3 — Storms drive the game (about 1.5 h)
**Build.**
- Storm size X comes from DONKI and NOAA using the table in `docs/06` §3 (small 10, medium 20, large 30). The mapping is a pure function in `src/engine/`, with tests.
- Level 2's card shows the real event, its date and its badge. If the Sun is quiet this month, the card says so truthfully and loads May 2024.
- Level 6 uses the stronger of live and archive.

**Done when.**
- Changing the loaded event changes the Shield loss in level 2.
- The mapping test covers each row of the table.

> **Prompt — B3.** Do step B3 from `docs/BUILD_SEQUENCE.md`. Add a pure `stormSize()` in `src/engine/` that maps DONKI and Kp readings to X with the `docs/06` §3 table, with a test per row. Feed it from `nasa.ts` when a mission starts. Show the real event, date and badge on level 2's card, with the quiet-Sun message and the May 2024 fallback. Level 6 uses the stronger of live and archive. Prove in the browser that a different loaded event changes level 2's Shield loss. Run the five checks, report in the §9.3 format, and stop.

### B4 — Cards on every level (about 1.5 h)
**Build.** Replace every sample with its real source:

| Where | Data |
|---|---|
| Level 1 | EPIC Earth photo |
| Levels 2–3 | Jezero photo and InSight temperatures |
| Level 4 | The dust cases |
| Level 5 | OSDR plant study and lettuce photo |
| Level 6 | Sample photo |
| Success | APOD |
| Story card 1 | NeoWs |
| Home and Quick Run | Kp |

**Done when.**
- Every card has the right badge and a date.
- Archive-only data never says LIVE.
- Facts marked "Confirm" in `docs/06` §4 that the team has not confirmed are left out.

> **Prompt — B4.** Do step B4 from `docs/BUILD_SEQUENCE.md`. Replace every sample data card with its real source through `nasa.ts`, following the table in step B4. Show the correct badge and date on each, never show LIVE for archive-only data, and leave out any `docs/06` §4 fact still marked "Confirm". Visit every card, run the five checks, show both screenshots for three different cards, report in the §9.3 format, and stop.

### B5 — Offline check (about 0.5 h)
**Done when.** The whole mission plays with the network off. There are no blank cards and no errors, and every badge reads ARCHIVE.

> **Prompt — B5.** Do step B5 from `docs/BUILD_SEQUENCE.md`. With the browser's network set to Offline, play the whole mission from the hook to Success, plus Quick Run. Fix any blank card, error or wrong badge. Report what you found in the §9.3 format and stop.

**Facts from testing the endpoints:**
- DONKI date ranges must be 60 days or less.
- `DONKI/FLR` returns 404 — use CME, SEP and GST.
- APOD sometimes returns a server error, and sometimes a video. Show the saved image in both cases.
- Call EPIC at `epic.gsfc.nasa.gov/api/natural` directly.
- InSight data ends in 2020, so it is always ARCHIVE.
- OSDR may refuse calls from a browser, so fetch it in the snapshot only.
- `DEMO_KEY` is rate-limited. Never demo on it.

---

## 7. Phase C — make it ready to judge

### C1 — Balance (about 1.5 h)
**Build.** `src/engine/balance.ts`, run as `npm run balance`. It plays every path and prints:
- the win rate,
- the usual losing meter per level,
- any option present in more than 70% of winning paths.

Tune numbers in `levels.ts` only.

**Done when.**
- 20–60% of paths win.
- No option is always right.
- Tests still pass.
- Level 6 is winnable by a careful player who is low on Air & Water (see §2, known problem 3).

> **Prompt — C1.** Do step C1 from `docs/BUILD_SEQUENCE.md`. Write `src/engine/balance.ts` and an `npm run balance` script that enumerates every path through the six levels (for the storm and dust sizes in play) and prints the win rate, the usual losing meter per level, and any option in more than 70% of winning paths. Propose the smallest number changes in `src/content/levels.ts` that reach a 20–60% win rate with no dominant option. Show me the before and after table, and change the numbers only after I say yes. Report in the §9.3 format and stop.

### C2 — Child play-test (about 1 h)
**Build.** One child aged 7–12, no help. Note every sentence they stumble on and every tap that misses. Then rewrite and fix.

**Done when.**
- They finish level 1 in under 3 minutes.
- They can say what level 2 taught.

> **Prompt — C2.** Here are my notes from the child play-test: [paste]. Do step C2 from `docs/BUILD_SEQUENCE.md`: fix every stumble and missed tap in the notes, rewriting text to under 15 words per sentence. List each note with what you changed, run the five checks, report in the §9.3 format, and stop.

### C3 — Publish (about 1 h)
**Build.**
- Add a licence (MIT for code; state that the character art belongs to the team).
- Write a README that opens with the solution sentence (plan §1), then how to run it and the data sources.
- Commit and push to `main` (only with the team's go-ahead).
- Deploy on GitHub Pages or Vercel, with `VITE_NASA_API_KEY` set in the host's settings. `.env` stays out; `.env.example` goes in. `vite.config.ts` already uses `base: './'`.

**Done when.**
- The link opens in a private window on a phone.
- The repository opens without login.

> **Prompt — C3.** Do step C3 from `docs/BUILD_SEQUENCE.md`. Add `LICENSE` and a `README.md` that opens with the plan §1 sentence. Confirm `.env` is ignored and that the key is in no tracked file (without printing it). Then show me the commit you will make and wait for my yes before pushing. After the push, set up the deploy on the host I name, with the key in the host's environment settings. Open the live link in a private window at phone width. Report in the §9.3 format and stop.

### C4 — Final pass (about 1 h)
**Build.**
- A keyboard-only run and a reduced-motion run.
- 375 px and 1280 px screenshots of every screen.
- A clean console.
- The plan's "Finished means" list (§13) ticked.
- The `docs/human design standards.md` §13 checklist and §14 scores (each 1–5).

**Done when.** Every box is ticked, or the gap is written down.

> **Prompt — C4.** Do step C4 from `docs/BUILD_SEQUENCE.md`. Run the whole app keyboard-only, then with reduced motion forced on. Take 375 px and 1280 px screenshots of every screen into `docs/screenshots/`. Confirm the console is clean. Tick plan §13 and the design-standards §13 checklist, and score §14 honestly. Fix only blocking problems, and list the rest. Report in the §9.3 format and stop.

---

## 8. Time and cuts

About 31 hours of build in total:

| Phase | Hours |
|---|---|
| A | 22 (A0 done) |
| B | 6.5 |
| C | 4.5 |

**Parallel work.** Once A0 is done (it is), two people can work at the same time:

| Track | Steps | Files |
|---|---|---|
| 1 | A1 → A9 | Hook, story, home, map, level and play screens |
| 2 | A10 → A13 | Quick Run, Profile, Resources, Training |

Each step lives in its own `src/screens/` file, so the tracks rarely touch the same file. `BUILT_SCREENS` and the store are the shared spots: merge those by hand.

**If time runs short, cut in this order:**
1. Sound
2. Bangla
3. Resources upgrades (keep the four info cards)
4. Leaderboard (keep badges)
5. Orbit/Nova choice
6. Quick Run's stardust link
7. The landing checklist

**Never cut:** the six levels · the four meters · the hook · Mission Replay · source lines · live DONKI in level 2 · the Sources page · the crew on Home, Replay and Success.

**Freeze** when Phase C starts. After that, only fixes.

---

## 9. Prompts

### 9.1 Kickoff prompt (paste once, at the start of a new chat)

> You are continuing the build of **CrewReady**, a browser game for the NASA Space Apps 2026 challenge "Build a Junior Astronaut Mission Trainer". Kids aged 7–12 command a Mars mission in which every choice costs power, air and water, food or radiation shielding, and real NASA data sizes the events.
>
> Two files are attached: the plan (what the game is) and `docs/BUILD_SEQUENCE.md` (how to build it). Read both fully before doing anything. Then read, in the project: `docs/06_SCIENCE_AND_NASA_DATA.md` (the only allowed facts and data), `docs/human design standards.md` (the quality bar), `src/engine/types.ts`, `src/engine/engine.ts`, `src/content/levels.ts`, `src/store/game.ts`, `src/components/ui.tsx`, `src/components/Twinkle.tsx` and `src/App.tsx`. Section 2 of the build sequence says what already exists. A0 is done. Do not rewrite the engine or the level content.
>
> Rules for the whole build:
> - Work strictly in the order of the build sequence. Do one step, then stop and wait for me to say "next" or name a step.
> - Follow the design direction in §4 exactly: paper mission cards on a coloured sky, the listed tokens and fonts, lucide icons, the team's character art from `public/art/` placed per the §4.3 pose table, no glow, no glass, no emoji, no NASA logo.
> - Reuse the shared parts in §4.4. Do not make look-alikes.
> - Never invent a fact or a number. Use only what the plan and `docs/06` contain, and leave out anything missing and tell me.
> - Never print, log or screenshot the API key.
> - End every step with the five checks in §3 and a report in the §9.3 format.
>
> Start by telling me in three lines what you understood the next step to be. Then begin it.

### 9.2 For each step

Paste that step's **Prompt** from §5–§7, or just say **"next"**. To jump, say **"do A8"**. To fix something from the last step, describe it plainly; that is a fix, not a new step.

### 9.3 Report format (what Claude sends back after each step)

```
Step: A_ — <name>
Built: <2–5 lines, plain words>
Files: <created / changed>
Checks: tests ✓/✗ · build ✓/✗ · clicked through ✓/✗ · 375 + 1280 ✓/✗ · keyboard ✓/✗ · console ✓/✗
Screenshots: <phone> <laptop>
Not verified / left out: <anything not checked, any fact left out and why>
Next: <the next step's name>
```

---

## 10. Things only the team can supply

| Needed | By step | If missing |
|---|---|---|
| ~~Cut-outs of Orbit, Nova and Twinkle~~ | — | **Supplied** (sheets in `ui reference/characters cutout/`, cut into `public/art/`) |
| A decision on Orbit's shoulder patch: does the blue oval with a red streak look too much like NASA's insignia? If yes, repaint the patch on the sheet and re-run the cut | Before C3 | Keep as is; it reads as a dot at game size |
| The licence of each audio file in `public/assets/audio/` (UI clicks, ambience, the Artemis II recordings) | Before sound is added | No sound |
| The five real names and roles | A14 | Placeholders, clearly marked |
| Confirmation of each "Confirm" fact in `docs/06` §4 | B4 | The sentence is left out |
| One chosen OSDR Veggie study (accession number, title, one plain sentence) | B4 | Level 5 shows the lettuce photo only |
| A child aged 7–12 for 20 minutes | C2 | Test with the youngest person available and say so |
| A go-ahead to push to GitHub, and a hosting choice | C3 | The build stays local |
