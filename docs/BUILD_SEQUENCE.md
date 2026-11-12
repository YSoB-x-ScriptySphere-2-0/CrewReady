# CrewReady — MVP Build Sequence

**How to use this file.**
1. Open a new chat in this project folder. Attach this file and the plan (`plan.md`, or `CrewReady_FINAL_PLAN_v9.docx`).
2. Paste the **kickoff prompt** from §9.1 once.
3. For each step, paste that step's **prompt** (the quote block at the end of each step), or just say **"next"**. The spec above the prompt is what Claude builds against.
4. Don't start the next step until this one's **Done when** list passes and you've looked at the two screenshots yourself.

**What each file is for.**
- The **plan** says *what* the game is: story, rules, every level, data, schedule.
- **This file** says *how to build it*: what exists, how it should look and feel, the order of work, and what "done" means.
- `docs/human design standards.md` is the quality bar.
- `docs/06_SCIENCE_AND_NASA_DATA.md` is the only list of facts and data the game may show.
- If they disagree on game content, the plan wins. Older files in `docs/` (01–05, 07, 08, `BUILD_PROMPTS`, `CHARACTER_CONCEPT_SHEET`, `frontend-ui-prompt-pack`) lose to all of these.

---

## 1. What we're building, and what winning needs

**The product.** A free browser game. Kids aged 7–12 run a Mars mission across six levels. Every choice trades power, air and water, food, or protection from space radiation. Real NASA data decides how big the events are. (NASA Space Apps 2026, challenge: *Build a Junior Astronaut Mission Trainer*.)

**What the judges score, turned into build requirements.** Every step serves at least one of these. If some work serves none, skip it.

| Judges score | So the build must |
|---|---|
| **Relevance** (20) — answers the challenge; NASA data at the core | Cover all five systems: life support, radiation, power, food, communication delay. Real DONKI storm data must change the size of the storm in levels 2 and 6. Take the data away and the level shouldn't work |
| **Validity** (20) — sound, working, usable | Be a working public link. Show a source line on every screen that states a fact. Have a "what we simplified" page. Survive a play-test with a real child |
| **Creativity** (20) — fresh, not routine | Open inside an emergency (the hook). Make choices come back later. End with a crew pick that teases multiplayer. **Feel like a game, not a worksheet** |
| **Impact** (20) — who benefits, how far it reaches | Open on a cheap phone with no login. End with six "I learned" lines |
| **Presentation** (20) — understood in 240 s | Look bright and alive on video: a game HUD, big readable meters, one idea per screen, the crew reacting |
| **User experience** (5) — anyone can use it | A first-timer finishes level 1 in under 3 minutes without help |
| **NASA data usage** (5) — top mark needs NASA plus another agency | NASA DONKI, NeoWs, EPIC, InSight, OSDR, Image Library and APOD, plus NOAA's storm index |
| **Teamwork** (5), named challenge, open repo, complete page (3) | Public repository; credits screen with every member and role |

**Global awards we aim at:**
- **Best Use of Data:** a 7-year-old feels today's real solar storm as a decision.
- **Best Storytelling:** NASA data is the plot of one Earth-to-Mars story.

Both are judged from the project page and the video, so the game has to **show** its data on screen, with dates and sources.

**From the challenge author's briefing — never break these:**
- Not a quiz, not a slideshow. A living simulation.
- No unlimited mode. Every choice costs something.
- A decision in one system visibly hits another.
- Fun and accurate are the same goal.

---

## 2. Where the project stands today (12 Nov 2026)

| Area | State | Files |
|---|---|---|
| Repository | **Connected** to `github.com/YSoB-x-ScriptySphere-2-0/CrewReady` (`main`). The repo's `public/assets/` (audio, 3D models) and `source/` are kept | `.git`, `.gitignore` |
| Stack | Vite 8, React 19, TypeScript, Tailwind 4, Zustand 5, Vitest, `lucide-react`, Baloo Da 2 + Nunito via `@fontsource`. No backend | `package.json` |
| Game rules | **Done and tested** (24 tests). Four meters, storm and dust sizes from data, consequences across levels, crew experts, Outpost Check | `src/engine/*` |
| Level content | **Done**: all six levels, text simplified for a 7-year-old on 12 Nov | `src/content/levels.ts` |
| Progress and saving | **Done**: level, step, retry checkpoint, badges, `seenIntro`. `go(screen)` switches screens; `BUILT_SCREENS` lists the ones that exist | `src/store/game.ts` |
| Character art | **Done**: 30 transparent poses of Orbit, Nova and Twinkle | `public/art/*.webp` |
| Screens built | Hook (A1), story cards (A2), Home (A3), mission map (A4), level opening, play (all six step kinds), Mission Replay, Success | `src/screens/*`, `src/App.tsx`, `src/components/steps.tsx` |
| **Look and feel** | **Needs a redo.** The screens work, but they read like a quiz: paper cards, text buttons, flat skies. Phase G (§5) turns them into a game | — |
| NASA data | Not built. Only a saved NeoWs sample (story card 1) exists | `src/content/samples/neows.json` |
| Not built | Quick Run, Profile, Resources, Training (locked), Sources, sound, live data, publishing | — |

**Commands.** `npm run dev` (port 5173, in `.claude/launch.json`) · `npm test` · `npm run build`. If a new file's Tailwind classes don't show up in the dev preview, restart the dev server; the build isn't affected.

**Known problems**
1. Mission Replay lists every reason line from the last action. It should name the one choice that cost the failed meter the most (A8).
2. Orbit's shoulder patch looks a little like NASA's insignia. The team decides before publishing (§10).
3. A random player rarely wins level 6 (Air & Water runs out). That's for balance (C1), not before.

---

## 3. How to work

1. **One step at a time, in order.** Say which step you're on. Finish it, check it, stop, report.
2. **Read before writing.** Reuse what exists. Don't rewrite the engine or level content unless a step says so.
3. **Every step ends with six checks:**
   - `npm test` passes and `npm run build` succeeds.
   - The screen is opened in the preview and actually played, not just compiled.
   - Looked at twice: phone (375 px) and laptop (1280 px). No sideways scroll, nothing cut off, nothing overlapping by accident.
   - Playable with the keyboard alone, with a visible focus ring.
   - No errors in the console.
   - **The game check:** with the sound off and no reading, does it look and feel like a game a kid would want to tap? Is there feedback on every tap? If it looks like a form or a quiz, it isn't done.
4. **No dead ends.** Every button does something or is clearly locked. When you build a screen, add it to `BUILT_SCREENS`.
5. **No invented facts.** Every fact a player sees comes from the plan or `docs/06` §4. If a fact is missing, leave it out and say so.
6. **Words are for a 7-year-old.** Under 15 words a sentence. One idea per screen. Explain a science word the first time ("a sol — a Mars day"). Prefer a picture or icon over a sentence whenever you can.
7. **Don't add features that aren't in this file.** Say what seems missing instead.
8. **The API key never appears** in code, logs, screenshots or replies. Only `src/services/nasa.ts` and `scripts/nasa-snapshot.mjs` read it.
9. **Report the same way every time** (§9.3).

---

## 4. Design direction: it's a game, not a worksheet

### 4.1 What went wrong, and the fix

The first pass got the rules and the colours right, but it *reads* like a quiz. Paper cards with a question on top and three text buttons underneath. That's exactly what the challenge author told us not to make.

Kids already know how a good mobile game feels. We take the **feel** of three kinds of game they love, and make it ours:

| Kind of game (reference for feel only) | What kids get from it | What we borrow |
|---|---|---|
| **Endless runners** (Subway Surfers is the one every kid knows) | Bright, saturated colour. Coins everywhere. Instant movement. Big chunky buttons. Missions to tick off | Quick Run's whole feel. Stardust counters that tick up. Fat, squishy buttons. "Mission set" checklists |
| **Base builders** (Clash of Clans and friends) | A world you look *into*, not a page you read. Resource bars always on top. Everything you can tap looks like an object. Rewards that pop | The **HUD**: four meter counters stuck to the top of every level screen. The mission map as a world with places, not a list. Level-complete rewards that burst out of a crate |
| **Party games** (Among Us style) | Simple, readable characters with lots of personality. A big red **EMERGENCY** moment. A task list you tick off | The storm alarms and Mission Replay as a full-screen emergency banner. The crew reacting to what you did. Each level's steps shown as a short task list |

**What we never copy.** We borrow patterns that belong to the whole genre: HUD bars, chunky buttons, level trails, emergency banners. We never copy any game's art, characters, logos, icons, fonts, sounds, names or exact screen layouts. Our world is Mars, our crew is Orbit, Nova and Twinkle, and every shape is drawn by us.

**What stays banned** (from the mentor and `docs/human design standards.md`): glow, neon, glass, blur, CRT lines, floating particles that never stop, emoji, the NASA logo, walls of text. Juice is fine; noise is not. Every effect has to *tell the kid something*: you gained, you lost, press here, this is new.

Supercell's own write-up of their Clash of Clans UI redesign makes the point we care about: features had piled up in a layout never built to hold them, so new players couldn't tell what to do. Their fix was to put the right buttons in the right places, mostly not to remove them. Same rule here: **a few big things, each in a fixed place.**

### 4.2 The look, in one paragraph

Every screen is a **place** (Earth, deep space, Mars, a dust storm) drawn as a simple layered scene: a sky, a horizon, a few flat shapes for hills, stars or the habitat. On top of the scene sits a **game HUD** (meters and stars, always in the same spot) and a few **chunky, toy-like controls** with thick ink outlines and a solid "lip" underneath, so they look pressable and squish when you press them. The crew lives *in* the scene and reacts. Text sits on small panels with a coloured ribbon header, never in long cards.

### 4.3 Tokens

Meter colours are untouched. A meter colour still means that meter, everywhere.

| Token | Value | Used for |
|---|---|---|
| `ink` | `#1B1F3B` | Outlines (3 px) on every tappable thing, all text on panels |
| `paper` | `#FFF8EC` | Panel body |
| `edge` | `#E9DFCC` | Dividers inside panels |
| `muted` | `#5A5F7D` | Secondary text on paper |
| `power` / `air` / `food` / `shield` | `#F5B700` / `#1E9BE0` / `#2FA84F` / `#7A5AE0` | Their meter, and nothing else |
| `star` | `#E8A100` | Science stars |
| **`go`** (new) | `#E8336F` (hot pink) with white text, `#B81E52` lip | The one main action per screen. Pink because yellow, blue, green and purple belong to the meters, and red means danger |
| `danger` / `good` | `#D93A3A` / `#1F8A4C` | Losses / gains |
| Skies | Earth `#2F6FED`, space `#1F1A5C`, Mars `#D9622B`, dust `#B9801F`, alarm `#A8322E` | Scene backgrounds. Each scene may now use a **vertical gradient** of its own colour (lighter at the horizon) plus flat shapes |

**Shape and depth**
- Outline: **3 px ink** on buttons, choice tiles, HUD pills, panels. This is what makes it look like a toy and holds the bright colours together.
- **Lip shadow** on everything pressable: a hard `0 6px 0` in a darker shade of the fill, no blur. On press it drops to `0 2px 0` and the button moves down 4 px, so it physically "clicks".
- Radius: **16 px** for buttons and tiles, **24 px** for panels, round for HUD pills and map nodes.
- One soft shadow is allowed under panels so they sit above the scene.
- A thin white **shine band** across the top third of a button is allowed (one flat semi-transparent shape, not a glow).

**Type.** Baloo Da 2 for anything shouted: titles, buttons, numbers, banners. Big: titles 32–40 px, buttons 20–24 px, HUD numbers 22 px, all bold 800. Nunito 18 px for the few sentences. Nothing a kid needs is under 16 px. Numbers use tabular figures so counters don't wobble.

### 4.4 Motion and feedback ("juice") — every one has a job

| Moment | What happens | Time |
|---|---|---|
| Press any button or tile | Squash to 95% and drop onto its lip, on pointer-down | 60 ms down, 180 ms springy release |
| A meter goes **down** | The pill shakes sideways once, flashes danger red, the number counts down, and a "−15" chip floats up from it and fades | 600 ms |
| A meter goes **up** | The pill pops (scale 1.08 → 1), the number counts up, and a "+10" chip floats up | 500 ms |
| Stars earned | A star flies from the choice to the star counter, which pops | 700 ms |
| A choice is made | The chosen tile stamps down; the other tiles slide away | 300 ms |
| Level complete | A supply crate drops in, bounces, opens; the badge pops out and flies to the map | 1.6 s, then it's done |
| Storm or alarm | Full-width striped banner slams in from the side ("STORM ALERT!", "MISSION PAUSED"), the screen shakes once | 400 ms |
| Twinkle speaks | Twinkle pops in with a little bounce; the bubble grows from Twinkle | 250 ms |

Rules: nothing loops forever (an idle character may bob **once** when the screen opens). Everything respects `prefers-reduced-motion`: with it on, changes still happen and colours still flash, but nothing moves or shakes. Sound (once added, A11) mirrors the same moments: tap, gain, loss, alarm, reward.

### 4.5 Characters

The crew are the stars, not decoration.

| Character | Poses (`public/art/<name>.webp`) |
|---|---|
| Twinkle | `twinkle-happy`, `-neutral`, `-question`, `-worried`, `-sad`, `-stars`, `-surprised`, `-tablet`, `-wink`, `-hearts`, `-squint`, `-sleepy` |
| Orbit | `orbit-stand`, `-wave`, `-arms`, `-cheer`, `-run`, `-tablet`, `-think`, `-point`, `-surprised`, `-thumbs` |
| Nova | `nova-stand`, `-wave`, `-arms`, `-cheer`, `-tablet`, `-think`, `-point`, `-helmet` |

- **They react.** After a choice, the player's kid (Orbit by default; Nova once picked in Profile) swaps pose: `cheer` or `thumbs` on a good result, `surprised` on a big loss, `think` while choosing. Twinkle does the same with its faces.
- **They stand in the scene**, at the bottom edge on phones, beside the panel on laptops. They never cover the HUD or the choices.
- Twinkle is the guide: hints, alarms, Replay. Orbit and Nova are "you".

### 4.6 Photos and data

Real NASA photos are the treasure. They appear as **Mission Intel** cards: a photo in a chunky frame, one kid sentence, the badge (`NASA LIVE`, `NASA ARCHIVE`, `GAME ESTIMATE`, `FICTION`) and the date, styled like a collectable card. A photo is never a wallpaper behind text.

### 4.7 The game kit (shared parts, built in G1)

| Part | What it is |
|---|---|
| `Scene place=` | Full-screen place: gradient sky plus a flat SVG layer (Earth: clouds and a launch pad; space: stars and a far planet; Mars: dunes and the habitat; dust: brown haze and buried dunes; alarm: red with warning stripes). The shapes are static |
| `Hud` | Sticky top bar inside levels: four **meter pills** (coloured icon badge, number, mini bar, "LOW" tag at 20 or below) plus the star counter. On phones it's 2×2; on laptops one row. It owns the gain/loss animations |
| `GameButton` | `go` (pink, big), `plain` (paper with ink outline), `small`. Lip shadow, squash on press, 56 px tall for `go`, never under 48 px |
| `ChoiceTile` | A big pressable tile for one option: an icon or picture on the left, the label in Baloo, optional cost chips. Stamps down when chosen |
| `Panel` | A paper panel with a coloured **ribbon header** (the level's title, "STORM ALERT", "MISSION INTEL"…). Replaces `MissionCard` |
| `TaskList` | The level's steps as a short checklist ("Pack the rocket ✓ · Pick a cargo seat · Stow the ship") shown at the top of a level |
| `AlarmBanner` | Striped full-width banner for storms, alarms and Mission Replay |
| `RewardCrate` | The level-complete reward: crate drops, opens, badge pops out |
| `FloatChip` / `FlyToHud` | The "+10" / "−15" chips and the star that flies to the counter |
| `TwinkleSays`, `Kid` | Characters, now with reactions (§4.5) |
| `IntelCard` | The data card (§4.6). Replaces `DataCard` |
| `SourceLine` | One small line under any fact; opens Sources |
| `Dock` | The bottom bar outside levels: five chunky round icon buttons (Missions, Quick Run, Resources, Training, Me), with locks on the unbuilt ones. Replaces `BottomNav` |

---

## 5. Phase G — make it a game (do this first)

### G1 — The game kit (about 3 h)
**Why.** Every later screen is built from these parts, so they're worth getting right once.

**Build.**
- Add the `go` colour and its lip shade, the lip and outline rules, and the new radii to `src/index.css`. Keep every meter colour as it is.
- Build every part in §4.7 in `src/components/`. Rename where the table says so (`MissionCard` → `Panel`, `DataCard` → `IntelCard`, `BottomNav` → `Dock`) and update the imports.
- `Scene`: one small SVG per place, flat shapes in tints of that place's colour, nothing animated. Keep each under about 4 KB.
- `Hud`: meter pills with count-up and count-down numbers, the shake or pop, and the floating chips (§4.4). It must stay readable at 375 px: icon, number and bar visible for all four.
- `GameButton` and `ChoiceTile`: the squash and lip behaviour on `pointerdown`, with keyboard Enter and Space giving the same visual.
- A hidden dev page at `#kit` that shows every part in every state. Use it for screenshots; it's not linked from the game.

**Done when.**
- Every part is on the `#kit` page at 375 px and 1280 px.
- Reduced motion turns off every movement but keeps the colour changes.
- Text contrast passes 4.5:1, or 3:1 for big bold text.
- The game check (§3) passes on the kit page.

> **Prompt — G1.** Do step G1 (the game kit) from `docs/BUILD_SEQUENCE.md`. Read §4 first: we're turning a quiz-looking app into a colourful kids' game, with the feel of runners, base-builders and party games but none of their art. Add the `go` colour, lip shadows, 3 px outlines and radii to `src/index.css` without touching the meter colours. Build every part in the §4.7 table in `src/components/`, with the motion in §4.4 (squash on press, meters that count and shake or pop, floating +/− chips, flying stars), and rename the old parts as listed. Make a hidden `#kit` page showing every part in every state. No glow, glass, neon, emoji or looping motion; everything respects reduced motion. Run the six checks, send me 375 px and 1280 px screenshots of `#kit`, report in the §9.3 format, and stop.

### G2 — Restyle what's already built (about 4 h)
**Why.** The hook, story, Home, map, levels, Replay and Success already work. Now they need to look and feel like the same game.

**Build**, screen by screen, using only the G1 kit. Keep every rule, flow and word that's already there.

| Screen | Make it feel like this |
|---|---|
| **Hook** | Dust scene. An `AlarmBanner` slams in: "STORM IN 60s". A big countdown ring instead of a thin bar. The HUD on top. Two big `ChoiceTile`s with icons (a folded panel, an open panel). On choice, the crate-style shake, the meter pills react, and Orbit pulls a face |
| **Story cards** | Space scene. Each card is a comic panel with the `FICTION` ribbon, one big picture area (the crew pose) and the short text. The NeoWs number is an `IntelCard` with a giant counter that ticks up to 33 |
| **Home** | Earth scene with the launch pad. The crew stand on the pad. One huge pink **PLAY** button (it says "Continue — Level N" when a mission is going). Stars and stardust counters top right. The Sun-storm strip becomes a small "Space weather" `IntelCard` with a 0–9 gauge. The `Dock` at the bottom |
| **Mission map** | Mars scene, scrolling up from Earth. Stops are chunky round planet-like nodes with the number inside; a dotted trail links them. Your kid stands on the current node. Earned badges sit on finished nodes. Locked nodes are grey with a padlock. Tapping the current node bounces it and opens the level |
| **Level opening** | The level's scene fills the screen. A ribbon with "LEVEL 3 · FIRST BREATH", one short line, the `TaskList`, the `IntelCard`, and a pink **GO!** button. Carry-over costs play on the HUD as the screen opens |
| **Decision** | HUD on top. The question in a speech bubble from Twinkle or the crew. Options as big `ChoiceTile`s with icons. After choosing: the tile stamps, the others slide away, the HUD reacts, the kid reacts, then a small result panel with **Next** |
| **Hands-on steps** | Same parts. Crates you can see stacking into bins, battery blocks that look like batteries, crew cards that look like trading cards (a full redesign of each is A7) |
| **Mission Replay** | Alarm scene. `AlarmBanner`: "MISSION PAUSED — NOBODY IS HURT". Twinkle `worried`. The empty meter pill shown big and cracked. Three short panels. Pink **Try again** |
| **Success** | The dawn scene. A `RewardCrate` opens and pops out the result badge (Survives / Stable / Thriving). Kids cheering. The six "I learned" lines as six collected badges you can tap |

**Done when.**
- Every screen above passes the six checks, including the game check.
- A full play-through from the hook to Success works with no change to the game rules (tests still green).
- Before and after screenshots of each screen are saved in `docs/screenshots/g2/`.

> **Prompt — G2.** Do step G2 from `docs/BUILD_SEQUENCE.md`. Restyle every screen that's already built (hook, story, Home, map, level opening, decision, hands-on steps, Mission Replay, Success) using only the G1 kit, following the table in G2. Don't change rules, flows, facts or words; change how they look, move and react. Put a pink `go` button on each screen as its one main action, keep the HUD on every level screen, use icons on every choice, and make the crew react. Save before and after screenshots of each screen to `docs/screenshots/g2/`, play the whole mission once from the hook to Success, run the six checks, report in the §9.3 format with the before and after pairs, and stop.

---

## 6. Phase A — the rest of the game, one screen at a time

A0–A4 are built (foundations, hook, story, Home, map) and get their new look in G2. Their specs are kept short here.

### Done
- **A0 — Foundations.** Tokens, fonts, icons, store screens, no emoji.
- **A1 — The hook** (`src/screens/Hook.tsx`). First launch only (`seenIntro`). Sol 214 dust storm, a real 60 s countdown that pauses when the tab is hidden, Fold (Power −25, Food −5) or Leave out (Power −15), the level-4 numbers at D = 15. Taste only; the real mission isn't touched. Then "Every choice costs something." → story.
- **A2 — The story cards** (`src/screens/Story.tsx`). Three FICTION cards, about 25 s read aloud, with the real NeoWs count (33 objects, 11 Nov 2026) on card 1. Swipe, arrows, Skip.
- **A3 — Home** (`src/screens/Home.tsx`). One main button, Start over with a confirm, locked Quick Run, map link, archived Sun-storm level (Kp 9, 11 May 2024).
- **A4 — Mission map** (`src/screens/MissionMap.tsx`). Earth to outpost, earned, current and locked stops, readable names for screen readers; the Missions tab opens it.

---

### A5 — Level opening (about 1 h)
**Why.** Relevance and storytelling: every level starts in its place, with real data, and shows that your earlier choices came back.

**Build.**
- Move `LevelOpening` to `src/screens/LevelOpening.tsx`. The level's `Scene` fills the screen; the `Hud` is on top.
- In a `Panel` with the level ribbon ("LEVEL 4 · THE DUST STORM"), show:
  - the place and sol;
  - the one-line story;
  - "You'll learn: …" with a small lightbulb icon;
  - the `TaskList` of this level's steps;
  - the level's `IntelCard` (a real archive sample from `docs/06`, badge `NASA ARCHIVE`, until B4).
- **Carry-overs play out as the screen opens.** Living costs and consequences from earlier levels hit the HUD one after another (each pill reacts, §4.4). Each one shows its reason in a small toast beside the pill, coloured with that meter's colour ("Remember the panels you left out? Dust buried them.").
- Twinkle `tablet` points at the Intel card. A pink **GO!** starts the level.

**Done when.** Each of the six levels opens with the right scene, Intel card, task list and carry-over toasts, in order, and reduced motion shows them all at once without movement.

> **Prompt — A5.** Do step A5 (level opening) from `docs/BUILD_SEQUENCE.md`. Move `LevelOpening` to `src/screens/LevelOpening.tsx` and build it from the game kit: the level's `Scene`, the `Hud`, a ribbon `Panel` with place, one-line story, "You'll learn", the `TaskList` and an `IntelCard` using real archive values from `docs/06` only. Play the carry-over costs onto the HUD one by one with reason toasts in each meter's colour, add Twinkle `tablet`, and finish with a pink **GO!**. Check all six levels, run the six checks, send screenshots of levels 2 and 4 at both widths, report in the §9.3 format, and stop.

---

### A6 — The decision screen (about 2 h) — the screen kids see most
**Why.** Presentation and Validity: in a silent 10-second clip, a stranger should see what was chosen and what it cost.

**Build.**
- Move `Play` to `src/screens/Play.tsx`. `Hud` on top, the `TaskList` as a slim progress strip under it.
- The question comes as a speech bubble from Twinkle (or from your kid when it's about the crew). Short, big, Baloo.
- Options are `ChoiceTile`s, each with a fitting lucide icon (shelter = `House`, experiment = `FlaskConical`, turn the ship = `RotateCw`, and so on). Pick icons per option in a small map in `src/content/icons.ts`, not inside `levels.ts`.
- **Ask Twinkle** is a round button with a `?`. Twinkle `question` names your lowest meter and shows each option's costs as meter chips, never "the right answer".
- **After a choice:** the tile stamps and the others slide away; the HUD plays the changes (§4.4); stars fly to the counter; your kid reacts; a small result `Panel` shows the reason line and the change chips, with a pink **Next**.
- **Earth message clock** (level 3): Mars and Earth on either side of the screen, a dot travelling there and back (2 s each way), while the Air & Water pill visibly ticks down.

**Done when.** The 10-second silent-clip test passes, and the hint never contains "best", "right" or "answer".

> **Prompt — A6.** Do step A6 (decision screen) from `docs/BUILD_SEQUENCE.md`. Move `Play` to `src/screens/Play.tsx` and rebuild it from the game kit: HUD on top, a task-progress strip, the question in a speech bubble, options as `ChoiceTile`s with icons from a new `src/content/icons.ts`, and a round Ask Twinkle button that shows each option's costs as chips but never the answer. Make the choice moment feel great: the tile stamps, the others slide off, the HUD reacts, stars fly, the kid reacts, then a result panel with **Next**. Rebuild the level-3 Earth message clock as a travelling dot between Mars and Earth while Air & Water ticks down. Record or screenshot a choice before and after, run the six checks, report in the §9.3 format, and stop.

---

### A7 — The five hands-on steps (about 3 h)
**Why.** Creativity: these should feel like handling stuff, not filling a form.

**Build** in `src/components/steps/` (one file each):
- **Crates** (level 1): eight crates stacked on the launch pad. Tap a bin and a crate hops into it and stacks there. Tap a stacked crate to take it back. Each bin shows its meter pill with a ghost bar for where it'll end up.
- **Stowing** (level 1): a cutaway of your seat with two cubby holes. Tap an item and it flies into a cubby. Each item shows "next to you: …" and "in the hold: …".
- **Landing checklist** (level 2): four big cards in a row. A small lander (flat SVG) drops a level with each right tap; a wrong tap wobbles the card and the lander bumps, with the cost the level already defines.
- **Power sharing** (level 4): seven chunky battery blocks you tap into three sockets (heaters, greenhouse, shields), each wanting three. The cost of each empty socket shows in its meter colour.
- **Crew pick** (level 6): five experts as trading cards, each with the meter they protect in that colour. Pick three; the chosen cards flip to show a green tick.

**Done when.** Each step works with one thumb at 375 px and with the keyboard; none can be finished in an invalid state; engine tests still pass.

> **Prompt — A7.** Do step A7 from `docs/BUILD_SEQUENCE.md`. Rebuild the five hands-on steps as small toys in `src/components/steps/`, one file each: crates that hop and stack into bins, items that fly into seat cubbies, a lander that drops with each right checklist tap, battery blocks you tap into sockets, and crew trading cards that flip when picked. Keep the engine calls (`packCrates`, `stow`, `checkOrder`, `setSliders`, `pickCrew`) exactly as they are. Meter colours only for meters. Test each with one thumb at 375 px and with the keyboard, make sure no step can finish invalid, run the six checks, send a phone screenshot of each, report in the §9.3 format, and stop.

---

### A8 — Mission Replay (about 1.5 h)
**Why.** Validity and Impact: losing teaches instead of punishing.

**Build.**
- Move `Replay` to `src/screens/Replay.tsx`. Alarm scene, `AlarmBanner` "MISSION PAUSED — NOBODY IS HURT", Twinkle `worried`.
- Three short panels: **What ran out** (the empty pill, big, cracked) · **What cost the most** (that choice's tile, replayed small with its loss chip) · **What real crews do** (one line plus its source).
- **The fix.** The store records each action's label and changes during a level. On a loss, pick the action that cost the failed meter the most; ties go to the earlier one; living costs count only if nothing else cost that meter.
- Pink **Try again**, plain **Home**.

**Done when.** Failing level 2 through "Keep working on the experiment" names that choice even if a later one landed the last hit. There are Vitest tests for that and for the tie rule.

> **Prompt — A8.** Do step A8 from `docs/BUILD_SEQUENCE.md`. Write the two failing tests first (the level-2 experiment case and the tie rule), then record each action's label and changes per level in the store and pick the biggest loss to the failed meter. Move Replay to `src/screens/Replay.tsx` with the alarm scene, the "MISSION PAUSED — NOBODY IS HURT" banner, Twinkle `worried`, and the three short panels. Don't change level numbers. Fail level 2 for real in the browser, run the six checks, send both screenshots, report in the §9.3 format, and stop.

---

### A9 — Success and the Outpost Check (about 2 h)
**Why.** Impact: six "I learned" lines a child can repeat to a parent, delivered like a prize.

**Build.**
- Move `Success` to `src/screens/Success.tsx`. Dawn scene.
- The `RewardCrate` opens and the result pops out as a big badge: **Outpost Survives** (Cadet), **Stable** (Pilot) or **Thriving** (Commander), with stars and the four meter pills ticked green at 30 or more.
- The six "I learned" lines are six badges in a shelf; tap one to flip it and read the line and its source.
- APOD as an `IntelCard` (a real saved image until B4).
- Two locked teaser cards: **Crew Mode** and **More worlds**.
- Pink **Fly again**, plain **Home**. Save the result to a best-five leaderboard without double-saving on reload.

**Done when.** All three results can be reached (engine tests produce each) and look right in the browser; reduced motion shows the badge without the crate animation.

> **Prompt — A9.** Do step A9 from `docs/BUILD_SEQUENCE.md`. Move Success to `src/screens/Success.tsx` on the dawn scene. Open a `RewardCrate` that pops out the result badge with rank, stars and the four meter pills ticked at 30 or more; show the six "I learned" lines as flip badges with sources; add the APOD `IntelCard` from a real saved image and the two locked teasers; save to a best-five leaderboard once. Add engine tests that reach Survives, Stable and Thriving, check each in the browser, run the six checks, send screenshots of Thriving, report in the §9.3 format, and stop.

---

### A10 — Quick Run (about 3 h)
**Why.** Impact and UX: the instant, no-reading way in.

**Build.**
- `src/screens/QuickRun.tsx` with a `<canvas>`; add `quickrun` to `BUILT_SCREENS`. Space scene with a road of three lanes running into the distance.
- **Feel of a runner:** Orbit (`run` pose) dashes forward. Swipe or arrow keys switch lanes with a quick hop; rocks to dodge, stardust to grab with a little "+1" pop and a counter that ticks up. A hit costs 3 seconds, flashes the screen edge red once, and Orbit stumbles; no game over.
- Speed from today's storm: "Space weather: Kp N" → slow (0–3), medium (4–6) or fast (7–9). Medium "(sample)" until B4.
- A `requestAnimationFrame` loop with delta time; it pauses when the tab is hidden and shows a big **Resume**.
- **End screen:** stardust burst into the total, a mission-set style list ("Grab 20 stardust ✓ · Dodge 10 rocks"), pink **Play again**, plain **Spend it** (locked until A12).

**Done when.** A steady frame rate at 4× CPU slowdown, it pauses when hidden, it plays with one thumb, and stardust survives a reload.

> **Prompt — A10.** Do step A10 from `docs/BUILD_SEQUENCE.md`. Build Quick Run in `src/screens/QuickRun.tsx`: a 60-second, three-lane canvas runner with the energy of the runner games kids know, but our own Mars look. Orbit runs, hops lanes on swipe or arrows, grabs stardust with "+1" pops, and stumbles on rocks (−3 s, no game over). Use a delta-time loop that pauses when the tab is hidden. Set the speed from "Space weather: Kp N (sample)" at medium until B4. Finish with an end screen that bursts stardust into the saved total. Check the frame rate at 4× CPU slowdown, play by keyboard and by touch, run the six checks, send mid-game and end screenshots, report in the §9.3 format, and stop.

---

### A11 — Profile, "Me" (about 1.5 h)
**Why.** Impact (no personal data) and fun: a kid wants to be someone.

**Build.**
- `src/screens/Profile.tsx`, Earth scene.
- **Pick your astronaut:** Orbit and Nova on two podiums; the chosen one cheers, the other waits. Then a **call-sign** from a shuffle machine (a big **Shuffle** button spins through about 20 space words: Comet, Nebula, Rover, Quasar…). No typing.
- **Your trophies:** rank, the six badges on a shelf, a best-five leaderboard.
- **Settings** as big toggles: sound, reduced motion, replay intro, reset (with an inline "Are you sure?"), Sources & credits.
- Sound: up to five short sounds (tap, gain, loss, alarm, reward), off by default, only from files whose licence the team has checked (§10).

**Done when.** Everything survives a reload, reset clears it all (including `seenIntro`), and the chosen kid appears in the hook, map and decisions.

> **Prompt — A11.** Do step A11 from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Profile.tsx` on the Earth scene: Orbit and Nova on podiums to pick from, a call-sign shuffle machine (no typing), a trophy shelf with rank, badges and a best-five leaderboard, and big toggles for sound, reduced motion, replay intro, reset (inline confirm) and Sources. Use the chosen kid everywhere the player appears. Add sound only from licence-checked files, off by default. Reload-test every setting, test reset, run the six checks, send both screenshots, report in the §9.3 format, and stop.

---

### A12 — Resources (about 1.5 h)
**Why.** Relevance: the real systems behind the four meters, and a reason to play Quick Run. Still no unlimited mode.

**Build.**
- `src/screens/Resources.tsx`, Mars scene with the habitat.
- Four system cards like upgrade cards in a builder game: Power, Air & Water, Food, Shield, each framed in its meter colour, with one kid sentence on the real system (facts from `docs/06` §4 only) and a source line.
- Two upgrade levels each, bought with stardust, each +5 to that meter's starting value. The price sits on the button.
- **Room on the rocket:** four cargo slots across the top that fill as you buy. Four in total, then it's full.
- Upgrades apply to the next mission (`startMission` reads them).

**Done when.** You can't buy without the stardust or past four; the button says why; a new mission starts with the upgraded values; there's a test for the cap.

> **Prompt — A12.** Do step A12 from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Resources.tsx`: four builder-style upgrade cards framed in their meter colours, each with one sourced kid sentence (`docs/06` §4 only) and two +5 upgrades priced in stardust; four rocket cargo slots across the top as the hard cap. Apply upgrades in `startMission` for the next mission, add tests for the cap and the starting values, add `resources` to `BUILT_SCREENS`, run the six checks, send screenshots with one upgrade bought, report in the §9.3 format, and stop.

---

### A13 — Training, locked (about 0.5 h)
**Build.** `src/screens/Training.tsx`, Mars scene, Twinkle `sleepy`: "Training opens in the next update." Three locked cards: **Mind**, **Body**, **Reels**, each with a padlock. Tapping one wiggles the padlock and Twinkle says so.

**Done when.** Nobody could mistake it for a broken page.

> **Prompt — A13.** Do step A13 from `docs/BUILD_SEQUENCE.md`: `src/screens/Training.tsx` with Twinkle `sleepy` and three locked Mind/Body/Reels cards whose padlocks wiggle when tapped. Add `training` to `BUILT_SCREENS`, run the six checks, send both screenshots, report, and stop.

---

### A14 — Sources and credits (about 1 h)
**Why.** Validity and NASA data usage: this is the page judges check. It should be the calmest page in the game.

**Build.**
- `src/screens/Sources.tsx`. A plain, readable list on a plain panel; the one screen with almost no juice. Every `SourceLine` opens it; Back returns to where you were (`returnTo`).
- Every dataset in plan §8.1, plus NOAA: name, agency, where it's used, badge and date, link (`rel="noopener"`).
- Then:
  - "What we simplified" (`docs/06` §5);
  - the honesty note (plan §4.3, word for word);
  - the team with roles (clearly marked placeholders until §10);
  - how AI was used;
  - image credits;
  - a line that the characters are the team's own art.

**Done when.** Every dataset is listed, every link opens, and every source line in the game reaches this page and comes back.

> **Prompt — A14.** Do step A14 from `docs/BUILD_SEQUENCE.md`. Build `src/screens/Sources.tsx` as a calm, plain list (the one page without game juice), including every plan §8.1 dataset plus NOAA, "What we simplified", the honesty note word for word, team and roles, the AI-use note and image credits. Make every `SourceLine` open it with a working Back, add `sources` to `BUILT_SCREENS`, click every link, run the six checks, send both screenshots, report, and stop.

---

## 7. Phase B — real NASA data

Do this after the screens exist, so the data has somewhere to go.

### B1 — Snapshot (about 1.5 h)
`scripts/nasa-snapshot.mjs` (`npm run nasa:snapshot`) reads the key from `.env`, calls every endpoint in plan §8.1 once, and saves trimmed answers to `public/data/*.json` (the eight files in `docs/06` §2.2), each starting with `fetchedAt` and `source`, key stripped. It includes the DONKI archive window of 1–31 May 2024.
**Done when** eight files exist, each with a date, and the key is in none of them.

> **Prompt — B1.** Do step B1 from `docs/BUILD_SEQUENCE.md`. Write `scripts/nasa-snapshot.mjs` and the `nasa:snapshot` script exactly as `docs/06` §2.2 says (the eight files, `fetchedAt` and `source`, the May 2024 DONKI window, ranges of 60 days or less, CME/SEP/GST and never FLR, EPIC from `epic.gsfc.nasa.gov`). Strip the key from everything saved. Run it, prove the key is in no output without printing it, list the files with their sizes, report, and stop.

### B2 — Data service (about 1.5 h)
`src/services/nasa.ts` is the only runtime reader of the key. It has one function per dataset (`docs/06` §2.3), each returning `{ data, badge, fetchedAt }`. Each call has a 3 s timeout and a `sessionStorage` cache. Any failure falls back to the snapshot with `NASA ARCHIVE`. While loading, Intel cards show a shimmer, never a blank.
**Done when** every card still shows real data, marked ARCHIVE, with the network off, and the fallback has unit tests with a mocked `fetch`.

> **Prompt — B2.** Do step B2 from `docs/BUILD_SEQUENCE.md`. Write `src/services/nasa.ts` per `docs/06` §2.3, with a 3 s timeout, a `sessionStorage` cache and the snapshot fallback; InSight and OSDR are archive only. Add a loading shimmer to `IntelCard`. Write Vitest tests with a mocked `fetch` for success, timeout, 429 and empty answers. Check offline in the browser, run the six checks, report, and stop.

### B3 — Storms drive the game (about 1.5 h)
A pure `stormSize()` in `src/engine/` maps DONKI and Kp to X with the `docs/06` §3 table, with a test per row. Level 2's `AlarmBanner` and Intel card show the real event, its date and its badge. A quiet Sun says so truthfully and loads May 2024. Level 6 uses the stronger of live and archive.
**Done when** a different loaded event changes level 2's Shield loss in the browser.

> **Prompt — B3.** Do step B3 from `docs/BUILD_SEQUENCE.md`. Add a pure `stormSize()` with a test per row of the `docs/06` §3 table, feed it from `nasa.ts` at mission start, and show the real event (date and badge) in level 2's storm alert and Intel card, with the quiet-Sun message and the May 2024 fallback. Level 6 uses the stronger of live and archive. Prove in the browser that a different event changes the Shield loss, run the six checks, report, and stop.

### B4 — Real data on every card (about 1.5 h)
Swap every sample for its real source:
- level 1: the EPIC Earth photo;
- levels 2–3: the Jezero photo and InSight temperatures;
- level 4: the dust cases;
- level 5: the OSDR study and the lettuce photo;
- level 6: a sample photo;
- Success: APOD;
- story card 1: NeoWs;
- Home and Quick Run: Kp.

Every card gets the right badge and date. Archive-only data never says LIVE. Unconfirmed `docs/06` facts stay out.

> **Prompt — B4.** Do step B4 from `docs/BUILD_SEQUENCE.md`: replace every sample Intel card with its real source through `nasa.ts`, with the correct badge and date, never LIVE for archive-only data, and no unconfirmed `docs/06` facts. Visit every card, run the six checks, send three card screenshots, report, and stop.

### B5 — Offline check (about 0.5 h)
Play the whole game with the network off: no blank cards, no errors, every badge ARCHIVE.

> **Prompt — B5.** Do step B5 from `docs/BUILD_SEQUENCE.md`. With the network set to Offline, play from the hook to Success plus Quick Run, fix any blank card, error or wrong badge, report, and stop.

**What we learned testing the endpoints:**
- DONKI ranges must be 60 days or less.
- `DONKI/FLR` returns 404; use CME, SEP and GST.
- APOD sometimes errors or sends a video; show the saved image in both cases.
- Call EPIC at `epic.gsfc.nasa.gov/api/natural`.
- InSight data ends in 2020, so it's always ARCHIVE.
- OSDR may refuse browser calls, so fetch it in the snapshot only.
- `DEMO_KEY` is rate-limited; never demo on it.

---

## 8. Phase C — make it ready to judge

### C1 — Balance (about 1.5 h)
`src/engine/balance.ts` (`npm run balance`) plays every path and prints the win rate, the usual losing meter per level, and any option in more than 70% of winning paths. Tune numbers in `levels.ts` only, after the team agrees.
**Done when** 20–60% of paths win, no option is always right, tests pass, and a careful player can win level 6.

> **Prompt — C1.** Do step C1 from `docs/BUILD_SEQUENCE.md`. Write `src/engine/balance.ts` and `npm run balance` to enumerate every path and print win rate, usual losing meter per level, and any option in more than 70% of winning paths. Propose the smallest number changes in `levels.ts` to reach 20–60% wins with no dominant option, show me a before and after table, and change nothing until I say yes. Report and stop.

### C2 — Child play-test (about 1 h)
One child aged 7–12, no help. Write down every word they stumble on, every tap that misses, and what they say out loud. Ask them at the end: "What was this?" If they say "a quiz" or "a test", that's the most important bug.
**Done when** they finish level 1 in under 3 minutes, can say what level 2 taught, and call it a game.

> **Prompt — C2.** Here are my notes from the child play-test: [paste]. Do step C2 from `docs/BUILD_SEQUENCE.md`: fix every stumble and missed tap, keep sentences under 15 words, and fix anything that made it feel like a test. List each note with what you changed, run the six checks, report, and stop.

### C3 — Publish (about 1 h)
- Add a licence: MIT for the code, with the character art credited to the team.
- Write a README that opens with the plan §1 sentence, then how to run it and the data sources.
- Commit and push only with the team's yes.
- Deploy to GitHub Pages or Vercel, with `VITE_NASA_API_KEY` set in the host's settings.

**Done when** the link opens in a private window on a phone and the repo opens without login.

> **Prompt — C3.** Do step C3 from `docs/BUILD_SEQUENCE.md`. Add `LICENSE` and a `README.md` that opens with the plan §1 sentence, confirm `.env` is ignored and the key is in no tracked file (without printing it), show me the commit and wait for my yes before pushing, then deploy on the host I name with the key in its settings. Open the live link in a private window at phone width, report, and stop.

### C4 — Final pass (about 1 h)
- A keyboard-only run, then a reduced-motion run.
- 375 px and 1280 px screenshots of every screen in `docs/screenshots/final/`.
- A clean console.
- Tick plan §13 and the design-standards §13 checklist, and score §14 honestly.

**Done when** every box is ticked or the gap is written down.

> **Prompt — C4.** Do step C4 from `docs/BUILD_SEQUENCE.md`: a keyboard-only run, a reduced-motion run, 375 px and 1280 px screenshots of every screen into `docs/screenshots/final/`, a clean console, plan §13 and design-standards §13 ticked, and §14 scored honestly. Fix only blocking problems and list the rest. Report and stop.

---

## 9. Time, cuts and prompts

**Time.**

| Phase | Hours |
|---|---|
| G (game kit + restyle) | about 7 |
| A5–A14 | about 18 |
| B | 6.5 |
| C | 4.5 |

After G1, two people can split the work:

| Track | Steps |
|---|---|
| 1 | G2 → A5 → A9 |
| 2 | A10 → A13 |

Each step has its own `src/screens/` file; the store and `BUILT_SCREENS` are the shared spots, so merge those by hand.

**If time runs short, cut in this order:**
1. Sound
2. Bangla
3. Resources upgrades (keep the info cards)
4. Leaderboard (keep badges)
5. The crate animation (keep the badge)
6. Orbit/Nova choice
7. Quick Run's stardust link
8. The landing checklist

**Never cut:** the six levels · the four meters and the HUD · the hook · Mission Replay · source lines · live DONKI in level 2 · the Sources page · the crew reacting on the key screens.

**Freeze** when Phase C starts. After that, only fixes.

### 9.1 Kickoff prompt (paste once at the start of a new chat)

> Hi! We're building **CrewReady** for NASA Space Apps 2026 ("Build a Junior Astronaut Mission Trainer"). It's a free browser game where kids aged 7–12 run a Mars mission, every choice costs power, air and water, food or shielding, and real NASA data decides how big the storms are.
>
> I've attached the plan (what the game is) and `docs/BUILD_SEQUENCE.md` (how to build it). Please read both fully. Then read, in the project:
> - `docs/06_SCIENCE_AND_NASA_DATA.md` (the only facts and data we may show);
> - `docs/human design standards.md` (our quality bar);
> - `src/engine/types.ts`, `src/engine/engine.ts`, `src/content/levels.ts`, `src/store/game.ts`;
> - everything in `src/components/` and `src/screens/`.
>
> Section 2 tells you what already exists. Don't rewrite the engine or the level content.
>
> The big thing to understand is §4: **this has to feel like a game a kid would choose to play, not a quiz.** Bright scenes, a HUD with the four meters, chunky squishy buttons, a crew that reacts, rewards that pop. We take the *feel* of runner, base-builder and party games, never their art. Still no glow, glass, neon, emoji, NASA logo or walls of text, and every effect has to mean something.
>
> Ground rules:
> - One step at a time, in the order of the build sequence. Then stop and wait for me to say "next" or name a step.
> - Use the shared game kit; don't make look-alikes.
> - Never invent a fact or a number. If something's missing, leave it out and tell me.
> - Never print, log or screenshot the API key.
> - End every step with the six checks in §3 (including the game check) and a report in the §9.3 format.
>
> Start by telling me in three lines what the next step is and how you'll make it feel like a game. Then go.

### 9.2 For each step
Paste that step's prompt, or just say **"next"**. To jump, say **"do A8"**. To fix something from the last step, just describe it; that's a fix, not a new step.

### 9.3 Report format

```
Step: __ — <name>
Built: <2–5 plain lines>
Feels like a game because: <what moves, pops or reacts, in one line>
Files: <created / changed>
Checks: tests ✓/✗ · build ✓/✗ · played ✓/✗ · 375 + 1280 ✓/✗ · keyboard ✓/✗ · console ✓/✗ · game check ✓/✗
Screenshots: <phone> <laptop>
Not verified / left out: <anything not checked; any fact left out, and why>
Next: <next step>
```

---

## 10. Things only the team can supply

| Needed | By step | If missing |
|---|---|---|
| Orbit's shoulder patch: does the blue oval with a red streak look too much like NASA's insignia? If so, repaint it on the sheet and re-run the cut | Before C3 | Keep it; it's a dot at game size |
| The licence of each audio file in `public/assets/audio/` | A11 | No sound |
| The five real names and roles | A14 | Placeholders, clearly marked |
| Confirmation of each "Confirm" fact in `docs/06` §4 | B4 | The sentence stays out |
| One chosen OSDR Veggie study (accession number, title, one plain sentence) | B4 | Level 5 shows the lettuce photo only |
| A child aged 7–12 for 20 minutes | C2 | The youngest person available, and say so |
| A hosting choice, and a yes before each push | C3 | The build stays local |

---

## 11. Where the design ideas come from

- Supercell, *We've revamped the Clash of Clans user interface* — right buttons in the right places; fewer, fixed homes for actions. https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/
- UI/UX Pro Max skill (local), styles "Claymorphism" and "Tactile / Deformable UI": thick 3–4 px borders, chunky rounded shapes, press squash to 95%, springy release; type pairing Baloo 2 + a rounded body face for kids' learning games. We skipped its "retro-futurism / neon glow" suggestion; it fails our no-glow rule and is hard on young eyes.
- Game-feel ("juice") write-ups: squash on pointer-down not pointer-up, about 95% scale, quick springy release, consistency over quantity, and save big effects for big moments.
  - https://itch.io/blog/1059831/making-a-game-feel-juicy-with-simple-effects
  - https://eastondev.com/blog/en/posts/dev/20260521-game-feedback-feel/
  - https://playbooks.com/skills/dylantarre/animation-principles/mobile-touch
- For browsing real game screens while designing:
  - Game UI Database (listed in https://awesome.ecosyste.ms/lists/dawdle-deer%2Fawesome-learn-gamedev);
  - Pixune, *The Very Best in Mobile Game UI Designs*: https://pixune.com/blog/best-examples-mobile-game-ui-design/
