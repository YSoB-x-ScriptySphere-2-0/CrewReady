# CrewReady — Build Sequence v10

Goes with `plan.md` v10. The plan says **what** the game is. This file says **how to build it**, in what order, and what "done" means. On game content the plan wins; on look and build order this file wins. Older files in `docs/` (01–05, 07, 08, `BUILD_PROMPTS`, `CHARACTER_CONCEPT_SHEET`, `frontend-ui-prompt-pack`) are history: don't read them.

## 1. How to use this file (and spend few tokens)

1. **One step, one new chat.** A long chat re-sends its whole history with every message, so a fresh chat per step is the biggest saving there is.
2. Paste the step's **prompt**. It's short on purpose: the spec is here, not in the prompt.
3. Claude reads **§3, §4 and that one step**, then only the files on the step's **Read** line. Nothing else unless a search shows it's needed.
4. Don't move on until the step's **Done when** passes and you've looked at the screenshot yourself.
5. A fix to the last step is just a sentence in the same chat ("the GO button overlaps Twinkle at 667 wide").

**Before R1:** steps A5–A9 are finished but not committed (branch `game-kit-g1-g2`). Commit them first, so the rework has a clean base to go back to.

---

## 2. Where the project stands (12 Nov 2026)

| Area | State | Files |
|---|---|---|
| Rules, levels, saving | **Done, tested.** Don't rewrite | `src/engine/*`, `src/content/levels.ts`, `src/store/game.ts` |
| Screens | **Work, but upright and quiz-like.** Hook, Story, Home, Map, LevelOpening, Play, Replay, Success, `#kit` | `src/screens/*` |
| Shared parts | Scene, Hud, GameButton, Panel, Decision, AlarmBanner, RewardCrate, Dock, Twinkle (crew), LevelChrome, five hands-on steps | `src/components/*`, `src/components/steps/*` |
| Replay blame, leaderboard, APOD sample | Done (A8, A9) | `src/engine/blame.test.ts`, `src/store/leaderboard.ts`, `src/content/apod.ts` |
| Crew art | 30 cut-outs. **Nova is now in the pink suit** (re-cut 12 Nov, same file names and sizes) | `public/art/*.webp` |
| Welcome art | **Placeholders** cropped from the two mock-ups; they still show bits of mock-up text and frame | `public/art/welcome-1.webp`, `welcome-2.webp` |
| Not built | Landscape stage, welcome, real NASA data, Sources, learning layer, Quick Run, Me, Resources, Training, Bangla, offline, publishing | — |

Stack: Vite 8, React 19, TypeScript, Tailwind 4, Zustand 5, Vitest, `lucide-react`, Baloo Da 2 + Nunito. `npm run dev` (port 5173, in `.claude/launch.json`) · `npm test` · `npm run build`. If new Tailwind classes don't show in the preview, restart the dev server.

Known: a random player rarely wins level 6 (Air & Water). That's for balance (F3), not before.

---

## 3. Rules for every step

**Working**
1. Do the one step named. Finish, check, report, stop.
2. Reuse what exists. Edit files; don't rewrite them. Never touch engine numbers or level words unless the step says so.
3. Build from the shared parts (§4.6). If a part is missing, add it to the kit, don't make a look-alike.
4. Every button does something or is clearly locked. A new screen goes into `BUILT_SCREENS`.
5. No invented facts or numbers. Facts come from `plan.md` or `docs/06_SCIENCE_AND_NASA_DATA.md` §4. If one is missing, leave it out and say so.
6. Words are for a 7-year-old: under 15 words a sentence, one idea per screen, a picture before a sentence.
7. Every string a player sees goes through `t()` (from R2 on).
8. The API key never appears in code, logs, screenshots or replies. Only `src/services/nasa.ts` and `scripts/nasa-snapshot.mjs` read it.
9. Never commit, push or deploy without a yes in the chat.

**Saving tokens**
- Read only what the step lists. Find anything else with a search, then read just those lines.
- `plan.md` is 60 KB: search for the section heading and read that section only.
- Check with page text and small scripts first; take a screenshot only for the report.
- Run `npm test` and `npm run build` once, at the end.
- Keep the report to the format below.

**Checks before reporting**
- `npm test` and `npm run build` pass; no console errors.
- Played in the preview, not just compiled.
- Looks right at **844 × 390** (phone sideways) and **667 × 375** (small phone). Laptop is the same layout scaled, so check 1280 × 720 only when a step changes the stage or the zones.
- Phone upright (**390 × 844**) shows the turned stage and still works by touch.
- Keyboard alone works, with a visible focus ring. Touch targets are 44 px or more.
- Reduced motion: things still change, nothing moves.
- Colour is never the only signal: a meter always has its icon and name.
- **The game check:** with the sound off and no reading, does it look like a game a kid wants to tap? If it looks like a form, it isn't done.

**Report**
```
Step: __
Built: <2–4 lines>
Files: <created / changed>
Checks: tests · build · played · 844 · 667 · upright · keyboard · reduced motion · console  (✓ or ✗ each)
Screenshot: docs/screenshots/v10/<step>.jpg
Left out / not verified: <what, and why>
```

---

## 4. Design v10: a wide window into deep space

### 4.1 What went wrong, and the fix

G1–G2 gave us working parts and good motion, but the screens still read as a quiz: an upright page, a question, three text rows. Two things fix that.

- **Turn it sideways.** Every screen is one landscape stage: the crew on the left, the thing you touch on the right, the meters across the top. (Plan §7.1 has the reasons.)
- **Match the welcome art.** The team's welcome mock-up sets the look: deep navy space, the 3D crew large in the frame, white rounded type, one cyan button. The cream paper panels and ink outlines clash with 3D characters, so they go.

We keep everything G1 got right: the lip under a button, the squash on press, meters that count and shake, chips that float, the crew reacting.

### 4.2 The stage (built in R1)

- One `Stage` wraps the whole app. Sideways phone, tablet, laptop: it fills the window.
- **Upright phone:** the same stage is drawn turned a quarter-turn and fills the screen, with a 2-second "Turn your phone" hint from Twinkle. No blocking screen. Touches still land in the right place; swipe code must read direction through one helper (`stageDelta`) so "left" stays left.
- Everything is sized in `rem`, and the root size follows the stage height: about 16 px at 375 tall, capped near 30 px. So a laptop shows the phone's layout, bigger.
- Stage shape is held between 4:3 and 21:9; outside that, the scene colour fills the edges.
- On Play (a real tap), ask for full screen and a landscape lock. Ignore a refusal silently.

**Three zones on every level screen**

| Zone | Size | Holds |
|---|---|---|
| Top strip | about 3 rem tall | Home, level chip, four meter pills in one row, stars |
| Left | about 36% wide | Your kid and Twinkle, standing in the scene, reacting |
| Right | the rest | Twinkle's speech bubble on top; under it, the thing you touch (choice cards, crates, batteries…); the **GO** button and the source line at the bottom |

Outside levels (Home, Map, Me…), the Dock is a **rail down the left edge**: five round icon buttons. A bottom bar would eat height we don't have.

### 4.3 Tokens

Meter colours are untouched. A meter colour still means that meter and nothing else.

| Token | Value | Used for |
|---|---|---|
| `space` | `#0B1437` | Backdrop behind every scene |
| `panel` | `#14204D` | Panels, cards, HUD pills (solid, never see-through) |
| `panel-up` | `#1C2B63` | A raised or selected card |
| `line` | `#3A4A8C` | 2 px border on panels and cards |
| `text` / `muted` | `#F4F7FF` / `#A9B4D6` | Text on dark |
| **`go`** | `#22D7E6`, text `#06202B`, lip `#0F8F9C` | The one main action per screen (was pink) |
| `power` / `air` / `food` / `shield` | `#F5B700` / `#1E9BE0` / `#2FA84F` / `#7A5AE0` | Their meter only, with a white icon |
| `star` | `#E8A100` | Science stars |
| `orbit` / `nova` | `#19A7B8` / `#E8338B` | Each kid's name tag and podium. Nothing else |
| Loss / gain chip | white on `#D93A3A` / `#06202B` on `#3DDC84` | "−15" and "+10" |
| Skies | Earth `#2F6FED`, space `#1F1A5C`, Mars `#D9622B`, dust `#B9801F`, alarm `#A8322E` | Scene gradients, lighter at the horizon |
| `paper` / `ink` | `#FFF8EC` / `#1B1F3B` | The Sources page only (a calm page for reading) |

- **Shape.** Radius 1 rem for buttons and cards, 1.5 rem for panels, round for pills. A selected card gets a 3 px `go` border and lifts.
- **Depth.** Every pressable thing keeps its hard lip (`0 0.35rem 0`, darker shade, no blur) and drops onto it when pressed.
- **Type.** Baloo Da 2, weight 800, for titles, buttons, numbers and all Bangla. Nunito for English sentences. Nothing a kid needs is under 1 rem. Tabular figures for counters.
- **Still banned:** blur and see-through panels (slow on cheap phones), glow, neon, emoji, the NASA logo (also on suits in artwork), motion that loops forever, walls of text.

### 4.4 Motion — every effect has a job

| Moment | What happens | Time |
|---|---|---|
| Press | Squash to 95% and drop onto the lip, on pointer-down | 60 ms down, 180 ms back |
| Look first (card selected) | The card lifts; each meter it will touch wiggles once and shows ▲ or ▼ | 250 ms |
| Meter down / up | Pill shakes and flashes red, or pops; the number counts; a chip floats up | 500–600 ms |
| Stars earned | A star flies to the counter, which pops | 700 ms |
| Choice confirmed | The card stamps; the others slide away; the kid reacts | 300 ms |
| Alarm | A striped banner slams across; the stage shakes once | 400 ms |
| Level complete | A crate drops, opens, the badge pops out | 1.6 s |

Nothing loops (a character may bob once). Reduced motion keeps every change and colour flash, and drops the movement.

### 4.5 The crew

| Character | Colour | Poses (`public/art/<name>.webp`) |
|---|---|---|
| Orbit | teal | `orbit-stand`, `-wave`, `-arms`, `-cheer`, `-run`, `-tablet`, `-think`, `-point`, `-surprised`, `-thumbs` |
| Nova | **pink** | `nova-stand`, `-wave`, `-arms`, `-cheer`, `-tablet`, `-think`, `-point`, `-helmet` |
| Twinkle | cyan | `twinkle-happy`, `-neutral`, `-question`, `-worried`, `-sad`, `-stars`, `-surprised`, `-tablet`, `-wink`, `-hearts`, `-squint`, `-sleepy` |

- They're **big**: the kid stands about half the stage tall in the left zone. They are why the game looks like the welcome art.
- They react: `think` while you choose, `cheer` or `thumbs` on a good result, `surprised` on a big loss (Nova has no `surprised`; she uses `think`). Twinkle does the same with its faces.
- Twinkle guides (hints, alarms, Replay). Orbit or Nova is "you".

### 4.6 Shared parts, by job

Names in `src/components/` may differ a little; keep the existing ones.

| Part | Job | v10 change |
|---|---|---|
| `Stage` | The landscape frame (§4.2) | **New** |
| `LevelChrome` | The three zones | Rebuilt for landscape |
| `Scene` | The place behind everything | Wider art; horizon in the lower third |
| `Hud` | Four meter pills + stars | One row; shows ▲/▼ for Look first |
| `GameButton` | `go`, `plain`, `small` | `go` is cyan |
| `ChoiceCard` (in `Decision`) | One option | An upright card: big icon on top, label under; three in a row |
| `Panel` | A titled box | Dark `panel`, coloured ribbon stays |
| `IntelCard` (in `Panel`) | Photo or number + badge + date | Dark frame; photo stays the hero |
| `AlarmBanner`, `RewardCrate`, float chips | As built | Colours only |
| `Dock` | Navigation outside levels | Left rail |
| `Kid`, `TwinkleSays` (in `Twinkle`) | The crew | Bigger; bubble gets a speaker button in L2 |
| `SourceLine` | One line under a fact | Opens Sources from S1 on |

---

## 5. The steps

Order: **R1 → R2 → R3 → R4 → F1 → D1 → D2 → S1** reaches the **film line** (everything the 240-second video shows). Then **L1 → L2 → S2 → S3 → S4 → F2 → F3 → F4 → F5**.

After R1, two people can run in parallel: one on R2 → R3 → R4, one on D1 → D2 → S1. They meet in `src/store/game.ts` and the IntelCard; merge those by hand.

### Phase R — rework what's built

#### R1 — The stage and the new tokens (about 2 h)
**Read:** `src/index.css`, `src/App.tsx`, `src/main.tsx`, `src/components/*` (not `steps/`), `src/screens/Kit.tsx`, `src/store/game.ts`.

**Build**
- `Stage` as §4.2 says, wrapped around the app in `App.tsx`. Root font size from stage height. The upright quarter-turn. `stageDelta()` for swipe direction.
- Swap the tokens in `src/index.css` for §4.3. Keep the meter colours and the old names that still exist, so nothing else breaks at once.
- Update the shared parts in the "v10 change" column of §4.6. `LevelChrome` gives the three zones; `Dock` becomes the left rail.
- Guard saved data: wrap the store's storage so a failed read or write starts a fresh game.
- Show every part on `#kit`, on the stage.

**Done when** `#kit` looks right at 844, 667, 1280 × 720 and upright; a tap on an upright phone hits the button under the finger; old screens still open (they may look rough until R3–R4).

> **Prompt — R1.** Do step R1 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and R1 first, then only the files on its Read line. Build the landscape `Stage`, swap the tokens, update the shared parts and `#kit`. Don't restyle the screens yet. Check, report, stop.

#### R2 — Welcome and loading (about 1.5 h)
**Read:** `src/App.tsx`, `src/store/game.ts`, `src/screens/Hook.tsx` (how it starts), `plan.md` §7 row W and §7.2.

**Build**
- `src/screens/Welcome.tsx`. It shows on **every page load** (not saved). Layout as the mock-up's wide version: logo top left, **EN / বাংলা** top right, "CrewReady" and "Junior Astronaut Training" on the left, the crew art on the right over the Earth.
- **The change:** `welcome-1` (real-looking crew) is on screen first. As the game preloads (fonts, crew art, the first scenes, saved data), `welcome-2` (game crew) fades in over it in step with a loading bar that sits where Play will be. At least 1.8 s so it's seen, at most 5 s, then carry on anyway. At 100% the bar becomes the cyan **Play** and pops. Reduced motion: one straight cut.
- The placeholder art has mock-up text on its left and top. Place it on the right and fade its left 20% and top 15% into the backdrop. Swapping in clean art later must need no code change.
- **Play:** first time → hook; afterwards → Home. Also ask for full screen and landscape (§4.2).
- **How to Play:** three picture panels, one line each: "Watch your four meters." · "Tap a choice to look. Tap GO to pick it." · "If a meter hits zero, you try again." Then Play.
- **Language:** add `src/content/strings.en.ts`, `strings.bn.ts` and a `t(key)` helper; the choice is saved. Put this screen's and the kit's strings through `t()`. Missing Bangla shows English. Leave Bangla empty except the switch label; F2 fills it.

**Done when** reloading always shows the change then Play; first choice in the hook is reachable within 15 seconds of load; the switch flips this screen's text and survives a reload.

> **Prompt — R2.** Do step R2 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and R2, then only its Read line. Build the welcome screen with the picture change tied to real preloading, Play, How to Play and the language switch with `t()`. Write no Bangla yourself. Check, report, stop.

#### R3 — Level screens in landscape, with Look first (about 3 h)
**Read:** `src/screens/LevelOpening.tsx`, `src/screens/Play.tsx`, `src/components/Decision.tsx`, `src/components/LevelChrome.tsx`, `src/components/Hud.tsx`, `src/components/steps/*`, `src/content/icons.ts`. Search `src/engine/engine.ts` for how a choice's changes are worked out; don't read it all.

**Build**
- **Level opening:** the scene fills the stage. Left: the crew. Right: ribbon ("LEVEL 3 · FIRST BREATH"), one line, the task list as three or four icon chips, the IntelCard, **GO!**. Carry-over costs still play onto the HUD one by one with their reason.
- **Decision:** Twinkle's bubble on top of the right zone; three `ChoiceCard`s in a row under it.
  - **Look first:** the first tap selects a card. It lifts, and every meter it will touch wiggles and shows ▲ or ▼ (direction only; no numbers; stars show a star). Tapping another card moves the selection. **GO** confirms. Keyboard: arrows move, Enter confirms.
  - After GO: stamp, the others slide off, the HUD plays the real changes, the kid reacts, and the result (reason line, chips, **Next**) takes the cards' place.
  - Ask Twinkle stays: it names your lowest meter. It never says "best", "right" or "answer".
- **Hands-on steps:** crates, stowing, landing order, battery sharing, crew pick each use the full right zone (and the left when they need the room, with the kid shrinking to a corner). Same engine calls. Crew pick: five cards in one row.
- The level-3 message clock runs across the top of the right zone: Mars on one side, Earth on the other.

**Done when** all six levels play start to finish at 844 and 667 with nothing scrolling; a stranger watching a silent 10-second clip can say what was picked and what it cost; engine tests are untouched and green.

> **Prompt — R3.** Do step R3 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and R3, then only its Read line. Lay out the level opening, the decision and the five hands-on steps in the three landscape zones, and add Look first (tap to see which meters move, GO to confirm). No rule, number or word changes. Play all six levels, check, report, stop.

#### R4 — The other screens in landscape (about 2.5 h)
**Read:** `src/screens/Hook.tsx`, `Story.tsx`, `Home.tsx`, `MissionMap.tsx`, `Replay.tsx`, `Success.tsx`.

| Screen | In landscape |
|---|---|
| **Hook** | Dust scene, alarm banner, a big countdown ring in the middle, the kid on the left, two large cards on the right (fold / leave out). One tap, two meters jolt. No Look first here: it's the 15-second taste |
| **Story** | One comic panel at a time: the picture on the left half, three short lines on the right, the `FICTION` ribbon, the NeoWs counter on card 1 |
| **Home** | The crew on a launch pad on the left; on the right one huge **PLAY** / "Continue — Level N", the space-weather IntelCard under it; stars and stardust top right; the Dock rail |
| **Map** | The trail runs **left to right**, Earth to the outpost, six round stops, your kid on the current one. Scrolls sideways only if it must |
| **Replay** | Alarm scene, banner "MISSION PAUSED — NOBODY IS HURT", Twinkle worried on the left; on the right three small panels side by side: what ran out · what cost the most · what real crews do; **Try again** |
| **Success** | Dawn scene, the crate and result badge on the left with the kids cheering; on the right the six "I learned" badges in two rows of three, APOD card, the two locked teasers; **Fly again** |

**Done when** hook → story → Home → map → six levels → Success, and a forced loss → Replay, all work at 844, 667 and upright with no scrolling page.

> **Prompt — R4.** Do step R4 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and R4, then only its Read line. Re-lay the six screens for the landscape stage as the table says. No rule or word changes. Play welcome to Success once and force one loss, check, report, stop.

### Phase F1 — get it online early

#### F1 — Licence, README, publish (about 1 h)
**Read:** `.gitignore`, `package.json`, `vite.config.ts`, `plan.md` §1 and §8.1.

**Build**
- `LICENSE` (Apache-2.0). `README.md`: the plan §1 sentence, how to run, every dataset with its link. `docs/AI_USE.md`: each AI tool, what it did, what the team did. A credits line for the generated crew and welcome art.
- Confirm `.env` is ignored and the key is in no tracked file (without printing it).
- Show the commit; wait for a yes; push; deploy on the host the team names with `VITE_NASA_API_KEY` in its settings.

**Done when** the link opens in a private window on a phone, and the repo opens without login.

> **Prompt — F1.** Do step F1 in `docs/BUILD_SEQUENCE.md`. Read §3 and F1, then only its Read line. Add the licence, README and AI-use note, prove the key is in no tracked file without printing it, show me the commit and wait for my yes before pushing or deploying. Host: [name it]. Report, stop.

### Phase D — real NASA data

#### D1 — Snapshot and data service (about 2.5 h)
**Read:** `docs/06_SCIENCE_AND_NASA_DATA.md` §1–§2, `src/content/samples/`, `src/content/apod.ts`, the IntelCard in `src/components/Panel.tsx`.

**Build**
- `scripts/nasa-snapshot.mjs` (`npm run nasa:snapshot`): calls every endpoint in `docs/06` §2.2 once and saves trimmed answers to `public/data/*.json`, each with `fetchedAt` and `source`, key stripped. Includes DONKI for 1–31 May 2024.
- `src/services/nasa.ts`: one function per dataset, each returning `{ data, badge, fetchedAt }`. 3-second timeout, `sessionStorage` cache, fall back to the snapshot with badge `NASA ARCHIVE`. InSight and OSDR are archive only.
- IntelCard shows a shimmer while loading, never a blank.
- Tests with a mocked `fetch`: success, timeout, 429, empty answer.

Endpoint notes (tested): DONKI ranges 60 days or less · `DONKI/FLR` is 404, use CME, SEP, GST · APOD sometimes errors or sends a video, show the saved image · EPIC lives at `epic.gsfc.nasa.gov/api/natural` · OSDR may refuse browser calls, snapshot only · never demo on `DEMO_KEY`.

**Done when** the eight files exist with dates and no key, and with the network off every card still shows real data marked ARCHIVE.

> **Prompt — D1.** Do step D1 in `docs/BUILD_SEQUENCE.md`. Read §3 and D1, then only its Read line. Write the snapshot script and `src/services/nasa.ts` with timeout, cache and archive fallback, plus the mocked-fetch tests. Run the snapshot, prove the key is in no output without printing it. Check, report, stop.

#### D2 — Storms drive the game; real cards; offline (about 2.5 h)
**Read:** `docs/06` §3–§4, `src/services/nasa.ts`, `src/store/game.ts` (mission start), `src/screens/LevelOpening.tsx`, `src/screens/Home.tsx`, `src/screens/Story.tsx`, `src/screens/Success.tsx`.

**Build**
- A pure `stormSize()` in `src/engine/` from DONKI and Kp to X, with a test per row of the `docs/06` §3 table. Fed at mission start.
- Level 2's alarm and IntelCard show the real event, its date and its badge. A quiet Sun says so and loads May 2024. Level 6 uses the stronger of live and archive.
- Every sample card becomes real: EPIC (level 1), Jezero photo and InSight (2–3), dust cases (4), OSDR and lettuce (5), sample photo (6), APOD (Success), NeoWs (story card 1), Kp (Home). Right badge and date on each; archive-only data never says LIVE; unconfirmed `docs/06` facts stay out.
- **Offline:** a web-app manifest (landscape, name, icon) and a service worker that caches the build, the art and `public/data`. Use `vite-plugin-pwa` if it supports our Vite; otherwise a small hand-written worker.

**Done when** loading a different storm changes level 2's Shield loss in the browser; after one visit, the whole game plays with the network off, every badge reading ARCHIVE.

> **Prompt — D2.** Do step D2 in `docs/BUILD_SEQUENCE.md`. Read §3 and D2, then only its Read line. Add `stormSize()` with a test per table row, put real data with the right badge on every card, and make the game open offline after one visit. Prove a different storm changes the Shield loss. Check, report, stop.

### Phase S1 — the page judges check

#### S1 — Sources and credits (about 1 h)
**Read:** `plan.md` §4.3, §8.1, §8.3; `docs/06` §5; the `SourceLine` part.

**Build** `src/screens/Sources.tsx`: the one calm page, on `paper`, that may scroll. Every `SourceLine` opens it and Back returns where you were. In order: every dataset (name, agency, where used, badge, date, link) · "What we simplified" · the honesty note, word for word · image credits · **credits for generated content** (crew and welcome art tool; Claude for drafts) · the team with roles (marked placeholders until supplied) · "Use it in class" (plan §5.4).

**Done when** every dataset in plan §8.1 plus NOAA is listed, every link opens, and every source line in the game gets here and back.

> **Prompt — S1.** Do step S1 in `docs/BUILD_SEQUENCE.md`. Read §3 and S1, then only its Read line. Build the Sources page and wire every source line to it with a working Back. Click every link. Check, report, stop.

**— The film line. Everything the 240-second video shows now exists. Record before building further. —**

### Phase L — the learning layer (plan §5.4)

#### L1 — Chain reaction and the four Try-it toys (about 3 h)
**Read:** `plan.md` §5.4; `src/content/icons.ts`; `src/content/levels.ts` (reason lines only: search for them); the result part of `src/components/Decision.tsx`; `src/screens/LevelOpening.tsx`.

**Build**
- **Chain reaction:** in the result, two or three icons link up left to right and end in the meter chip (lights dim → plants slow → Food −5). The icons come from a small `chain` map per option in `src/content/icons.ts`, written from the reason line that's already there. No new words, no new facts. An option with no clear chain shows just its chips.
- **Try it:** one toy each for levels 2–5, in `src/components/toys/`, shown after the level opening and before the first decision. Ten seconds, no score, no meter change, a **Skip**. The four toys and what the hand should feel are in plan §5.4. Each ends with one line from that level's "I learned" sentence.
- The level-3 toy reuses the message clock.

**Done when** each toy works with one thumb and with the keyboard, can be skipped, and changes no meter (a test proves the store is untouched).

> **Prompt — L1.** Do step L1 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and L1, then only its Read line. Add the picture chain to results and the four ten-second Try-it toys. They teach only what the plan already says and never change a meter. Check, report, stop.

#### L2 — Space Words and Read to me (about 2 h)
**Read:** `docs/06` §4; `src/components/Twinkle.tsx`; `src/content/strings.en.ts`; `src/store/game.ts`.

**Build**
- **Space Words:** `src/content/words.ts` holds up to 12 words (sol, radiation, solar panel, recycler, carbon dioxide, launch window…), each with an icon and one sentence **taken from `docs/06` §4 or the plan**. Leave out any word with no sourced sentence, and list it in the report. The first time a word appears it's underlined; a tap opens a small card and adds it to the Space Book (saved).
- **Read to me:** a speaker button on every speech bubble, using the browser's own speech. Pick a voice for the current language; if there is none, hide the button. One tap speaks, another stops. Leaving the screen stops it.

**Done when** words collect and survive a reload; speech works in English in the preview and the button hides when no voice exists.

> **Prompt — L2.** Do step L2 in `docs/BUILD_SEQUENCE.md`. Read §3 and L2, then only its Read line. Add tappable Space Words with sourced one-line meanings and a saved Space Book, and a Read-to-me button on speech bubbles. Invent no definitions. Check, report, stop.

### Phase S — the side screens

#### S2 — Quick Run (about 3 h)
**Read:** `plan.md` §7 row 2; `src/services/nasa.ts` (Kp); `src/store/game.ts`; the `Stage` helper.

**Build** `src/screens/QuickRun.tsx`, a `<canvas>` on the stage. Seen from behind Orbit (or Nova): three lanes running into the distance. **Tap the left or right half of the screen** (or arrow keys) to hop a lane; two thumbs, no swiping needed. Rocks to dodge, stardust to grab with a "+1" pop. A hit costs 3 seconds and a stumble; no game over. 60 seconds. Speed from today's Kp: slow 0–3, medium 4–6, fast 7–9, shown as "Space weather today: Kp N" with its badge. A delta-time loop that pauses when the tab is hidden. End: stardust bursts into the saved total; **Play again**.

**Done when** it holds a steady frame rate at 4× CPU slowdown, pauses when hidden, works upright (turned stage) and stardust survives a reload.

> **Prompt — S2.** Do step S2 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and S2, then only its Read line. Build the 60-second three-lane canvas runner, tap-left / tap-right, speed from real Kp. Our own Mars look; copy no existing game. Check at 4× slowdown, report, stop.

#### S3 — Me, and Training locked (about 2 h)
**Read:** `plan.md` §7 rows 3 and 5; `src/store/game.ts`; `src/store/leaderboard.ts`; `src/components/Twinkle.tsx`.

**Build**
- `src/screens/Profile.tsx`: Orbit on a teal podium and Nova on a pink one; the picked one cheers and becomes "you" everywhere. A call-sign shuffle (about 20 space words, no typing). Trophies: rank, six badges, the Space Book, best five runs. Big toggles: language, sound, reduced motion, replay intro, reset (inline "Are you sure?"), Sources.
- Sound only from files whose licence the team has checked (§7), off by default.
- `src/screens/Training.tsx`: Twinkle `sleepy`, three padlocked cards (Mind, Body, Reels) that wiggle when tapped.

**Done when** everything survives a reload, reset clears all of it, and nobody could take Training for a broken page.

> **Prompt — S3.** Do step S3 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and S3, then only its Read line. Build the Me screen (pick Orbit or Nova, call-sign shuffle, trophies, toggles) and the locked Training screen. Check, report, stop.

#### S4 — Resources (about 1.5 h)
**Read:** `plan.md` §7 row 4; `docs/06` §4; `src/store/game.ts` (`startMission`).

**Build** `src/screens/Resources.tsx`: four system cards in a row, each framed in its meter colour with one sourced kid sentence and two +5 upgrades priced in stardust. Four cargo slots across the top: four upgrades in total, then the rocket is full. Upgrades apply to the next mission. Tests for the cap and the starting values.

**Done when** you can't buy without stardust or past four, and the button says why.

> **Prompt — S4.** Do step S4 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and S4, then only its Read line. Build the four upgrade cards with the four-slot cap and tests. Check, report, stop.

### Phase F — finish

#### F2 — Bangla (about 2 h, with a Bangla speaker)
**Read:** `src/content/strings.en.ts`, `strings.bn.ts`.

Move any remaining player-facing text into strings, level text included (keys only; English words unchanged). Then fill Bangla in the plan §7.2 order. Claude drafts; **a team member reads and fixes every line before it ships.** Keep NASA names and dataset names in English. Check that no Bangla line overflows its card at 667 wide.

> **Prompt — F2.** Do step F2 in `docs/BUILD_SEQUENCE.md`. Read §3 and F2, then only its Read line. Move remaining text into strings without changing the English, then draft Bangla in the plan §7.2 order in batches of about 40 lines and stop after each batch for my corrections.

#### F3 — Balance (about 1.5 h)
`src/engine/balance.ts` (`npm run balance`) plays every path and prints the win rate, the usual losing meter per level, and any option in more than 70% of winning paths. Target: 20–60% of paths win, no option always right, a careful player can win level 6. Numbers change in `levels.ts` only, after a yes.

> **Prompt — F3.** Do step F3 in `docs/BUILD_SEQUENCE.md`. Read §3 and F3, plus `src/engine/types.ts`; search the engine for what you need. Write the balance script, propose the smallest number changes as a before/after table, and change nothing until I say yes.

#### F4 — Child play-test fixes (about 1 h)
One child aged 7–12, no help. Note every word they stumble on, every tap that misses, what they say. Ask: "What was this?" If they say "a quiz" or "a test", that's the top bug. Film hands and screen only.

> **Prompt — F4.** Do step F4 in `docs/BUILD_SEQUENCE.md`. My play-test notes: [paste]. Fix each stumble and missed tap, keep sentences under 15 words, list each note with what you changed. Check, report, stop.

#### F5 — Final pass (about 1 h)
A keyboard-only run, a reduced-motion run, an upright-phone run, an offline run. One 844 × 390 screenshot of every screen into `docs/screenshots/final/`. Tick plan §13; write down any gap.

> **Prompt — F5.** Do step F5 in `docs/BUILD_SEQUENCE.md`. Read §3 and F5, and `plan.md` §13 only. Do the four runs and the screenshots, fix only blocking problems, list the rest against plan §13. Report, stop.

---

## 6. Time and cuts

| Phase | Hours |
|---|---|
| R1–R4 | about 9 |
| F1 | 1 |
| D1–D2 | 5 |
| S1 | 1 |
| **To the film line** | **about 16** (about 10 with two people after R1) |
| L1–L2 | 5 |
| S2–S4 | 6.5 |
| F2–F5 | 5.5 |

**If time runs short, cut in this order:** sound → Bangla level text (keep the switch and buttons) → Resources upgrades → Space Words → Try-it toys → leaderboard (keep badges) → Quick Run → the welcome picture change (keep the screen).

**Never cut:** the six levels · the four meters and the HUD · landscape · the hook · Look first · Mission Replay · source lines · live DONKI in level 2 · the Sources page · the crew reacting.

Real deadlines are in plan §12.1: the 240-second video on **Fri 13 Nov, 6:30 PM**; the 30-second video and the finished project page on **Sat 14 Nov, 12:00**; freeze **Sat 09:00**.

---

## 7. Things only the team can supply

| Needed | By step | If missing |
|---|---|---|
| A yes to commit A5–A9 | Before R1 | The rework has no clean base |
| **Two clean welcome pictures**, 16:9, at least 1920 × 1080, **no text, buttons or device frame**, crew on the right two-thirds: the real-looking crew and the game crew | R2 | The cropped placeholders ship, edges faded |
| The name of the AI image tool used for the crew and welcome art | F1, S1 | Credited as "AI-generated by the team" |
| A hosting choice, and a yes before each push | F1 | The build stays local |
| Confirmation of each "Confirm" fact in `docs/06` §4 | D2, L2 | The sentence stays out |
| One chosen OSDR Veggie study (accession number, title, one plain sentence) | D2 | Level 5 shows the lettuce photo only |
| The five real names and roles; who is under 18; the Local Lead's answer on naming them | S1, videos | Placeholders, clearly marked |
| A narrator aged 18 or older | Video | An adult member reads |
| A Bangla speaker to check every line | F2 | Bangla stays on the switch and buttons only |
| The licence of each file in `public/assets/audio/` | S3 | No sound |
| Orbit's shoulder patch: does it look too much like NASA's insignia? | Before filming | Keep it; it's a dot at game size |
| A child aged 7–12 for 20 minutes | F4 | The youngest person available, and say so |

---

## 8. Where the ideas come from

- The team's welcome mock-ups ("CrewReady Astronaut Training Interface" 1 and 2): the deep-space look, the cyan Play button, the EN / বাংলা switch.
- `nasa guidelines/space-apps-2026-bangladesh-build-guide.md`, challenge 03: the 15-second demo, the Relevance trap, offline, Bangla, touch targets, the under-18 rule.
- `nasa guidelines/Space Apps Challenge Participants Guide.md` §02 and §08: the run of show and the three videos.
- Supercell on the Clash of Clans interface: a few big things, each in a fixed place. https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/
- Game feel: squash on pointer-down, about 95%, quick springy release, big effects only for big moments. https://itch.io/blog/1059831/making-a-game-feel-juicy-with-simple-effects
