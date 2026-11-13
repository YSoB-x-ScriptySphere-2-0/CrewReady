# CrewReady — Build Sequence v11

Goes with `plan.md` v11. The plan says **what** the game is. This file says **how to build it**, in what order, and what "done" means. On game content the plan wins; on look and build order this file wins. Older files in `docs/` (01–05, 07, 08, `CHARACTER_CONCEPT_SHEET`) are history: don't read them.

## 1. How to use this file (and spend few tokens)

1. **One step, one new chat.** A long chat re-sends its whole history with every message, so a fresh chat per step is the biggest saving there is.
2. Paste the step's **prompt**. It's short on purpose: the spec is here, not in the prompt.
3. Claude reads **§3, §4 and that one step**, then only the files on the step's **Read** line. Nothing else unless a search shows it's needed.
4. Don't move on until the step's **Done when** passes and you've looked at the screenshot yourself.
5. A fix to the last step is just a sentence in the same chat ("the GO button overlaps Twinkle at 667 wide").

**v11 (13 Nov): start with §5b.** Phases R, D, S, L and F1 are built. §5b lists the bug fixes (phase B) and the changes for children (phase K) that come from the 13 Nov audit and the child play-test. The older step text below stays as the record of what each part must do.

**The one idea of v11:** a child must understand the game without help: simple words, a ? and a bulb on every screen, Twinkle's tour, one points story, and play that feels like play (bonus rounds). **The one idea of v10.1, still true:** the game is still more reading than seeing. From now on every screen is judged by §4.1a, *See it, don't read it*, and R5 makes the levels pass it before we film.

---

## 2. Where the project stands

**13 Nov 2026 (v11).** Everything in the table below is built. Tests: 153 passing. The audit found the bugs listed in §5b phase B; the play-test found the game still too hard for a child (phase K). Every on-screen fact now matches `docs/06` §4.

**12 Nov 2026 (v10.1), for the record:**

| Area | State | Files |
|---|---|---|
| Rules, levels, saving | **Done, tested.** Don't rewrite | `src/engine/*`, `src/content/levels.ts`, `src/store/game.ts` |
| Screens | **Work, but upright and quiz-like.** Hook, Story, Home, Map, LevelOpening, Play, Replay, Success, `#kit` | `src/screens/*` |
| Shared parts | Scene, Hud, GameButton, Panel, Decision, AlarmBanner, RewardCrate, Dock, Twinkle (crew), LevelChrome, five hands-on steps | `src/components/*`, `src/components/steps/*` |
| Replay blame, leaderboard, APOD sample | Done (A8, A9) | `src/engine/blame.test.ts`, `src/store/leaderboard.ts`, `src/content/apod.ts` |
| Crew art | 30 cut-outs. **Nova is now in the pink suit** (re-cut 12 Nov, same file names and sizes) | `public/art/*.webp` |
| Welcome screen | **Built in Antigravity; the visual reference for every screen.** Full-bleed art, crossfade, bar → Play, How to Play, EN / বাংলা switch, shown on every load. Needs R0 (wording, blur) and R2 (stage, loading) | `src/screens/Welcome.tsx`, `src/App.tsx` |
| Strings | `t()` helper with English and Bangla for the welcome screen only | `src/content/i18n.ts`, `strings.en.ts`, `strings.bn.ts` |
| Antigravity extras | Home: Kp gauge with NOAA G-scale labels. Story: asteroid "radar". LevelChrome: sol and place badge. Decision: shaded planets in the level-3 clock. Dock: frosted glass | see R0 |
| Welcome art | `welcome-1.webp`, `welcome-2.webp`: cleaned in Antigravity (mock-up letters and language pill removed). Usable. A dark frame corner remains top right; R2 hides it with the backdrop fade. Upright crops (704 × 818); a 16:9 version is nice to have (§7) | `public/art/welcome-*` |
| Not built | Real NASA data, Sources, learning layer, Fly (endless runner), Me, Resources, Training, Bangla beyond the welcome screen, offline, publishing | — |

Stack: Vite 8, React 19, TypeScript, Tailwind 4, Zustand 5, Vitest, `lucide-react`, Baloo Da 2 + Nunito. `npm run dev` (port 5173, in `.claude/launch.json`) · `npm test` · `npm run build`. If new Tailwind classes don't show in the preview, restart the dev server.

Known: a random player rarely wins level 6 (Air & Water). That's for balance (F3), not before.

---

## 3. Rules for every step

**Working**
1. Do the one step named. Finish, check, report, stop.
2. Reuse what exists. Edit files; don't rewrite them. Never touch engine numbers or level words unless the step says so.
3. Build from the shared parts (§4.6). If a part is missing, add it to the kit, don't make a look-alike.
4. Every button does something or is clearly locked. A new screen goes into `BUILT_SCREENS`.
5. No invented facts or numbers. Facts come only from `docs/06_SCIENCE_AND_NASA_DATA.md` §4, using its **kid wording** column; a fact marked ✗ there never appears. If one is missing, leave it out and say so.
6. Words are for a 7-year-old in Bangladesh: under 12 words a sentence, the plan §5.5 simple words, one idea per screen, a picture before a sentence. A hard word stays only with an explain card.
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

### 4.1a See it, don't read it (the rule every screen is judged by)

A 7-year-old reads slowly, and a judge watches a silent video. So **the scene tells the story and the words only label it.** Today a level is: read a question, read three options, read a reason. In v10.1 it is: **watch something happen, touch something, watch what it did.**

**1. Every decision opens with an event moment (2–3 s, no reading needed).** The danger plays out in the scene before any choice appears. The words come after, as a caption.

| Level · decision | What the player sees happen |
|---|---|
| 1 · last seat | The cargo bay: one empty seat outlined, three objects floating beside it |
| 2 · storm | A wave of orange light rolls from the Sun toward the ship; the Shield pill blinks |
| 2 · filter | The water tank's gauge drops; brown drips in the pipe |
| 2 · landing zone | Mars fills the window; three zones light up on the real Jezero photo |
| 3 · protect | Radiation dots fall on the bare habitat roof |
| 3 · leak | Air streams out of a crack; the Air & Water pill ticks down **until the player chooses** |
| 3 · oxygen maker | The oxygen box hums; its power cable lights up; the battery bar sinks a little |
| 4 · panels | A brown dust wall rolls in from the horizon and the sky darkens |
| 4 · cleaning | The panels sit grey; the power bar barely fills |
| 5 · farm, water, pump | Plants droop when the water bar is low; the pump stops with a puff |
| 6 · storm + dust | The orange wave and the dust wall arrive together |
| 6 · scrubber | The carbon dioxide bar in the cabin creeps up; the crew yawns |
| 6 · samples | The rover, the delta and the habitat on one map, with a dotted route to each |

**2. Choices are pictures first.** A `ChoiceCard` is a picture (an icon scene: shelter = crew behind water bags), then 2–5 words ("Hide behind water"). The full option sentence lives in Read-to-me and in the result.

**3. The result is shown in the scene, then counted.** After GO, the scene acts out the choice in about 1.5 s (the crew run into the shelter and the wave splashes off it; the panels fold and the lights dim), then the **chain reaction** (lights dim → plants slow → Food −5) draws the cost as pictures, then the HUD counts. The reason sentence is one line under the chain, never the main thing.

**4. Numbers are drawn, not written.** Storm size is a bigger or smaller wave; dust size a thicker or thinner wall; the battery is 7 blocks; message delay is a dot that travels. Every number on screen also has a picture.

**5. A word budget.** Count the words a player must read to act (labels, bubbles, cards; not the source line or Read-to-me):

| Screen | Most words |
|---|---|
| Decision (bubble + all cards) | 20 |
| Result | 12 |
| Level opening | 15 |
| Hands-on step | 10 |
| Story card | 20 |
| Replay | 25 |

Anything over budget is cut, turned into a picture, or moved to Read-to-me.

**6. The silent test.** Mute the sound, cover every word, and play a level. Can you still tell what went wrong and what your choice cost? If not, the screen isn't done.

None of this changes a rule, a number or a fact. Event moments only *show* what the plan's level text already says.

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
| `space` / `space-deep` | `#0B1437` / `#070B1E` | Backdrop behind every scene. A scene may add **one** soft radial light (the Earth's edge, a far nebula) |
| `panel` | `#14204D` | Panels, cards, HUD pills. Over a busy scene it may be 70–85% opaque, but never blurred |
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
- **Buttons, three kinds.** Main: cyan `go` with a gentle top-to-bottom gradient and its lip, exactly one per screen (Play, GO, Next, Continue). It may carry **one soft cyan halo** (`0 0 1.25rem` of `go` at 45%): the only glow in the game, because it marks the one thing to press. Second: an outlined pill, 2 px border of `text` at 30%, dark fill (`panel` at 70%), white text (How to Play, Map, Ask Twinkle, Start over). Small: icon-only round buttons.
- **Still banned:** `backdrop-blur` (it stutters on the cheap phones we promise to reach, and over our dark scenes a 70–85% dark fill looks the same), any other glow, neon, emoji (use lucide icons), the NASA logo (also on suits in artwork), motion that loops forever (`animate-ping`, `animate-pulse`; the welcome bar may move while it loads, because it ends), walls of text (§4.1a), cream paper cards on the dark stage.

### 4.3a What we keep from the Antigravity notes

`improvement-suggestions.md` (12 Nov) proposed a style for every page. Checked against our rules and `docs/human design standards.md`:

| Suggestion | Decision | Why |
|---|---|---|
| Deep navy base, the welcome screen as the reference | **Keep** | It's §4 already |
| One cyan main button per screen | **Keep** | It's the `go` token |
| Cyan button with a gradient and a glow | **Keep, tamed**: gentle gradient, the lip, one soft halo, on the main button only | It is the focal point; the design standards allow an effect that has a job, and this one says "press here" |
| Frosted glass for second buttons, the Dock, How to Play | **Keep the look, drop the blur**: dark 70–85% fills with a thin light border | Same look over a dark scene, no stutter on low-end phones |
| Paper cards on the dark stage for decisions | **Drop** | Two surface styles on one screen; dark `panel` cards with a cyan selected border |
| Loading lines ("Preparing Life Support Systems…", "Syncing NASA Space Weather…") | **Keep the feel.** Mission-prep lines stay ("Preparing life support…", "Fuelling the rocket…", "Waking up Twinkle…"): they are clearly part of the story, like a countdown. **A line that names NASA data shows only while that data really loads** (after D1, "Checking today's Sun with NASA…" runs while the DONKI call does). The bar may be paced to last at least 1.8 s | Our citation rule and the challenge: never present static or invented data as live |
| "Impact Risk: 0.00% · Safe Flybys Verified" on the asteroid card | **Drop** | Not in the data. The plan's line is "None will hit us." |
| Kp gauge with NOAA G1–G5 names | **Keep** if the Kp → G mapping is added to `docs/06` §4 with NOAA's scale as its source; sentence cut under 15 words; no looping beacon | Real scale, but every fact needs its line in `docs/06` |
| Look-first arrows scaled by size | **Keep**: one ▼ for 5–10, two for 15–20, three for 25+ | Shows "how much" without numbers |
| Chain reaction with emoji | **Keep the idea, use icons**; built in R5, not L1 | No emoji; it is the heart of "see it, don't read it" |
| Show radiation and delay as pictures, not paragraphs | **Keep**, and made a rule for every screen | §4.1a |
| A sol and place badge in the level HUD | **Keep** | Teaches "sol" by repetition |

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

Order: **R0 → R1 → R2 → R3 → R4 → R5 → F1 → D1 → D2 → S1** reaches the **film line** (everything the 240-second video shows). Then **L1 → L2 → S2 → S3 → S4 → F2 → F3 → F4 → F5**.

**Two tools at once: use §5a.** It splits the steps into two lanes that never wait for each other, with a prompt for each. The single-step prompts below still apply; §5a only adds a lane preface and says when to merge.

### 5a. Two lanes at once (Claude Code + Antigravity)

R0 and R1 are done, so both lanes start from that. Each lane works in **its own folder and branch** (a git worktree), so neither overwrites the other's files mid-step. The lanes are split by **which files they own**, not by how important the step is.

**Set up once (you, 5 minutes)**
```bash
git add -A && git commit -m "R0+R1: clean-up, stage, v10 tokens"      # after you've looked at it
git branch lane-b
git worktree add ../crewready-lane-b lane-b
```
Claude Code stays in the main folder (branch `game-kit-g1-g2`, **Lane A**). Open `../crewready-lane-b` in Antigravity (**Lane B**). Run `npm install` in the second folder. Each lane runs its own dev server (Lane B: `npm run dev -- --port 5174`).

**Who owns what**

| | Lane A: screens (Claude Code) | Lane B: data and new screens (Antigravity) |
|---|---|---|
| Steps, in order | R2 → R3 → R4 → **M1** → R5 → D2b → L1 → L2 | D1 → D2a → S1 → S2 (Fly) → S4 → S3 → F1 docs |
| Owns | `src/screens/*` that exist today, `src/components/*` (Decision, steps, Hud, Scene…), `src/content/icons.ts`, `strings.*` | `scripts/`, `public/data/`, `src/services/`, `src/engine/` (new files only), and the **new** screens `Sources`, `Fly`, `Resources`, `Profile`, `Training` plus `src/fly/` |
| May touch, one line only | | `BUILT_SCREENS` in `store/game.ts` and the screen routes in `App.tsx`: add your own line, change nothing else there |
| Never touches | `scripts/`, `src/services/`, new-screen files | Any existing screen, any file in `src/components/` (if a part is missing, ask Lane A or add a **new** file) |

**Merge points** (you run them; nothing is merged without you)
- **M0 — now.** The commit above. Both lanes start.
- **M1 — after Lane A finishes R4 *and* Lane B finishes D2a.** Merge `lane-b` into the main branch: `git merge lane-b`. Conflicts should only be `store/game.ts` and `App.tsx`. Then both lanes carry on from the merged result: Lane A needs `stormSize()` from D2a before R5 (event moments read the real storm size). If Lane B is slower, Lane A does D2b-free work first (see "While you wait" below).
- **M2 — after Lane B finishes S1 and S2** (or when Lane A finishes R5). Merge again. Lane B then does S4 and S3 on the merged base, and re-pulls: `git merge game-kit-g1-g2` in its folder.
- After each merge: `npm test`, `npm run build`, and click through Home → map → a level → Sources → Fly.

**While you wait.** If one lane runs out of steps it can do, it does the next one on its list below, in order. If one is truly blocked (Lane A on R5 before M1), take **L1** (Try-it toys: new files in `src/components/toys/`) instead.

**The film line moves.** The 240-second video needs R2–R5, D1, D2 and S1. Fly and Resources are shown for about five seconds each, so S2 is nice to have on film but not blocking.

**Lane prefaces: paste one at the top of every prompt in that lane**

> **Lane A preface (Claude Code).** You are Lane A in `docs/BUILD_SEQUENCE.md` §5a, on branch `game-kit-g1-g2` in the main folder. Touch only the files Lane A owns. Do not create or edit anything in `scripts/`, `src/services/`, or the new screens Sources, Fly, Resources, Profile, Training. If you need data from the services, import the function and use it as is. Commit only when I say yes.

> **Lane B preface (Antigravity).** You are Lane B in `docs/BUILD_SEQUENCE.md` §5a, on branch `lane-b` in `crewready-lane-b`. Touch only the files Lane B owns. Do **not** edit any existing screen or anything in `src/components/`; build new screens from the shared parts as they are. In `store/game.ts` and `App.tsx` change only your own one line. Obey §3 and §4.3 strictly: no invented facts or numbers, no `backdrop-blur`, no glow except the one halo on the main button, no looping animation, no emoji, no NASA logo. The API key never appears in any file, log or reply. Commit only when I say yes.

**The prompts, lane by lane**

*Lane A, in this order, each in a fresh chat:*

| Order | Prompt |
|---|---|
| A1 | Lane A preface + the **R2** prompt below. |
| A2 | Lane A preface + the **R3** prompt. |
| A3 | Lane A preface + the **R4** prompt. Then you run **M1**. |
| A4 | Lane A preface + the **R5** prompt. Needs `stormSize()` from M1. |
| A5 | Lane A preface + "Do step D2 in `docs/BUILD_SEQUENCE.md`, **part b only**: put the real data (from `src/services/nasa.ts`) with the right badge and date on every card, and level 2's alarm and IntelCard show the real event. `stormSize()` and the offline worker are already done in part a. Check, report, stop." |
| A6 | Lane A preface + the **L1** prompt, then **L2**. |

*Lane B, in this order, each in a fresh chat:*

| Order | Prompt |
|---|---|
| B1 | Lane B preface + the **D1** prompt below. |
| B2 | Lane B preface + "Do step D2 in `docs/BUILD_SEQUENCE.md`, **part a only**: the pure `stormSize()` in `src/engine/` with a test per table row of `docs/06` §3, fed at mission start, and the offline web-app manifest and service worker. Do **not** change any card or screen; Lane A does that in part b. Check, report, stop." |
| B3 | Lane B preface + the **S1** prompt. It builds the Sources page; the `SourceLine` part already opens it, so you only add the screen and its two lines. |
| B4 | Lane B preface + the **S2** prompt (Fly). |
| B5 | Lane B preface + the **S4** prompt (Resources), then **S3** (Me and Training). Sound stays off (no files with unchecked licences). |
| B6 | Lane B preface + the **F1** prompt, **docs only** (LICENSE, README, `docs/AI_USE.md`, the key check). It must not push or deploy: you decide that yourself. |

After both lanes finish: **F2** (Bangla, with a Bangla speaker) → **F3** → **F4** → **F5**, one lane at a time, because they touch everything.

### 5b. v11 — do these next (13 Nov 2026)

Phases R, D, S, L and F1 below are built. The 13 Nov audit (tests, build, code review, a browser play-through and a map of the points) and the child play-test give the work for the judged build. **Order: B1 → B2 → B3 → K1 → K2 → K3 → K4 → K5 → F4 (second play-test) → F5.** B1–B3 touch different files and can run at the same time; K1 must come before K2; K3 before K5.

**Already done on 13 Nov (don't redo):** every `docs/06` §4 fact checked, and the wrong lines fixed in `levels.ts`, `Resources.tsx`, `Sources.tsx`, `Training.tsx`, `TwinkleTourGuide.tsx` and `services/nasa.ts` (list in `docs/06` §4). The real team names and the ChatGPT art credit are on the Sources page and in `docs/AI_USE.md`. The level 1 hint says 15 per crate. The archive storm is now the 10 May 2024 Kp 9 storm. The build's unused Fly import and `.env.example` (now `DEMO_KEY`) were fixed in the working tree. Tests: 153 passing.

#### Phase B — fix every bug the audit found

##### B1 — Points, saving and data rules (the Back-End Developer, about 2.5 h)
**Read:** `src/store/game.ts`, `src/engine/resources.ts`, `src/engine/profile.ts`, `src/screens/Resources.tsx` (lines 100–300), `src/screens/Home.tsx` (start and continue), `src/services/nasa.ts` (DONKI and Kp).

**Fix**
1. **Upgrades reach every mission.** Today they apply only from Resources' Launch button; Home, the Map and Success ignore them. Apply them inside the store's `startMission` (game **and** checkpoint, before the first level) and in `retryLevel`'s restart branch. Upgrades are **used up** when a mission launches (plan §5.7). No refund after launch.
2. **Resources Launch** asks "Start over?" when a mission is in progress, like Home does.
3. **Prices.** The buttons say 25 ✦; the engine charges 15 then 30. Show the engine's `nextCost`, through `t()`.
4. **No star farming.** `retryLevel` keeps `max(checkpoint.stars, game.stars)`, so stars from a failed try are kept and earned again. Restart from `checkpoint.stars`.
5. **Badges and rank last.** Add a saved lifetime `earnedBadges` that a new mission never clears; rank reads it.
6. **Reset really resets** the whole store, words, Fly totals, cargo and the tour flag. Today the mission comes straight back.
7. **Home after a loss.** "Continue" resumes the failed level with an empty bar. Send it to Mission Replay (Try again) instead.
8. **Broken saves never crash.** `persist.merge` checks every field (level index in range, four numeric bars, flags, crew, log); anything wrong starts a fresh mission.
9. **No free choice in level 4.** With the cliff landing, D is 0, so "Leave them out" changes nothing (plan §5.2). Smallest fix: `P: -max(D, 5)`. Run `npm run balance` and paste the before/after.
10. **Stars at zero.** Options that cost a star change one thing when you have no stars. Report the real (clamped) change, and add these cases to the "two changes" test as known and documented.
11. **Live storms use all of DONKI.** The live branch sizes storms from Kp only; also read SEP and CME speed for the same window, so the `docs/06` §3 rules apply live. Remember the event that sized X at mission start and show **that** event on the level 2 card.
12. **Right badges.** NOAA Kp is labelled `NASA LIVE`: use `NOAA LIVE`. The Sources page's fixed "NASA LIVE" labels become "Live when online" (they are reference cards, not readings).

**Done when** a test proves each of 1, 4, 5, 6, 8 and 9; buying an upgrade then pressing Home → Play starts with 45 in that bar; the balance report still has 20–60% wins; `npm test` and `npm run build` pass.

> **Prompt — B1.** Do step B1 in `docs/BUILD_SEQUENCE.md`. Read §3 and B1, then only its Read line. Fix the twelve items in order with a test for 1, 4, 5, 6, 8 and 9. Change level numbers only for item 9, and show the balance before/after. Check, report, stop.

##### B2 — Fly (the Front-End Developer, about 1.5 h)
**Read:** `src/screens/Fly.tsx`, `src/fly/engine.ts`, `src/fly/engine.test.ts`.

**Fix**
1. **The HUD is frozen mid-run** (hearts, stardust, distance, power timer only update at game over). Keep a small HUD state and set it from the loop only when a shown value changes.
2. **At 667 × 375 the top of the start card is cut off** and cannot be reached. Fit it without scrolling (two columns), or `justify-start` with `my-auto` inside.
3. **Fast frames skip rocks.** Test the swept range (`prevZ` to `nextZ`) against the hit box, for obstacles and stardust.
4. **`stepGame` changes its input.** Copy obstacles and items before setting `passed` / `collected`; add a test that the same state twice gives the same result.
5. **Input leaks.** Enter on a focused button also starts a run; a tap on the music button changes lane. Ignore keys whose target is a button; stop pointer events on the music button.
6. "Return home" is about 24 px tall: make it 44 px.
7. Swipe direction goes through `stageDelta()` (§4.2) if the upright turned stage is kept (B3 item 1).

**Done when** the HUD counts during a run; the start card fits at 667 × 375; the rule tests (including the new two) pass; the 4× CPU slowdown check holds.

> **Prompt — B2.** Do step B2 in `docs/BUILD_SEQUENCE.md`. Read §3 and B2, then only its Read line. Fix the seven Fly items with tests for 3 and 4. Check at 667 × 375 and at 4× slowdown, report, stop.

##### B3 — Screens, stage and the banned list (Barkat, about 2.5 h)
**Read:** `src/components/Stage.tsx` (and `git diff` on it), `Dock.tsx`, `Decision.tsx`, `3d/HeroCadetRocket3D.tsx`, `3d/CrisisEarth3D.tsx`; `src/screens/Profile.tsx`, `Story.tsx`, `MissionMap.tsx`, `Home.tsx`, `Play.tsx`.

**Fix**
1. **Stage, upright phones.** The uncommitted change to `Stage.tsx` removed the quarter-turn, the "Turn your phone" hint and the 4:3–21:9 clamp, so a phone held upright now gets a squashed landscape layout. **Decide with the Captain:** restore it (recommended: §4.2 and plan §7.1 promise it), or change §4.2 on purpose. Not both.
2. **Dock below 768 px** becomes a bottom bar that covers Home's space-weather card and the map. Keep the left rail at every landscape size.
3. **Profile Motion toggle** only saves a field; call `setReducedMotion` on toggle and at start.
4. **The astronaut pick is never used** (every screen shows the default). Keep one `hero` field in the game store; Profile and the K4 opening write it; every `Kid` reads it.
5. **Story swipe vs 3D drag.** Turning the 3D Earth flips the card. Ignore swipes that start inside a `[data-3d]` mount; add `touch-action: none` there.
6. **3D rebuilds.** `HeroCadetRocket3D` rebuilds its whole renderer on every hero switch and never calls `forceContextLoss()`. Build once and swap the suit material. Same cleanup in `CrisisEarth3D`.
7. **Timers.** Clear `Decision`'s 320 ms commit timeout on unmount, and ignore a second press while it is pending. Guard the double tap on the map's current stop.
8. **Touch targets under 44 px:** the 3D modal close buttons (`Play`, `LevelOpening`), the tour's close and step dots, the hook's Skip. Escape closes modals and focus returns.
9. **The banned list (§4.3)** is broken in many files: `backdrop-blur` (CrisisEarth3D, HeroCadetRocket3D, Dock, MusicToggle, Fly, Hook, Play, LevelOpening, TwinkleTourGuide), looping animations, emoji in string tables. Replace with 70–85% dark fills, end the loops, use lucide icons.
10. **Kp dot colour.** Kp 4–6 ("Busy Sun") shows the green "calm" dot: test `tone === 'active'`.
11. **Strings.** Sources, the tour, Play's hint panel ("Twinkle's hint", "Lowest:", "Nice!"), LevelOpening card sentences go through `t()`.

**Done when** `grep -rn "backdrop-blur\|animate-ping\|animate-pulse" src` is empty; 390 × 844 upright works by touch (if kept); every pressable is 44 px or more; the picked hero shows on every screen; tests and build pass.

> **Prompt — B3.** Do step B3 in `docs/BUILD_SEQUENCE.md`. Read §3, §4.2, §4.3 and B3, then only its Read line. Ask me item 1 first and wait. Then fix items 2–11. Check at 844, 667 and upright, report, stop.

#### Phase K — make it easy and fun for a child (plan v11 §4, §5.3, §5.5–5.7)

The play-test said: **still a bit complicated.** Phase K answers it in five steps.

##### K1 — Simple words everywhere (the Researcher with Claude, about 2 h)
**Read:** plan §5.5; `docs/06` §4 (the kid wording column); `src/content/levels.ts`, `strings.en.ts`, `icons.ts` (`short` labels), `words.ts`.

**Build**
- Rewrite every player line using plan §5.5: the swap table, under 12 words a sentence, one idea a line. Keep every rule, number and option meaning. Fact lines use the `docs/06` §4 kid wording exactly (or shorter).
- `src/content/plainWords.test.ts`: fails if a hard word from the §5.5 table ("habitat", "regolith", "specialist", "consequence", "trajectory", "telemetry"…) appears in any player string outside an explain card, or a sentence is over 12 words.
- Keep a list of the words that stay (radiation, oxygen, solar panel, sol…) with their explain card ids for K2.
- Bangla: mark changed keys "needs a check" for F2; write no new Bangla.

**Done when** the test passes; a team member reads every changed line aloud at a 7-year-old's pace, and nothing needs explaining.

> **Prompt — K1.** Do step K1 in `docs/BUILD_SEQUENCE.md`. Read §3, plan §5.5 and K1, then only its Read line. Rewrite every player line in simple words (plan §5.5 swap table, under 12 words), fact lines exactly as `docs/06` §4 kid wording, and add the plain-words test. Change no rule, number or option meaning. Show me a before/after table in batches of about 40 lines and stop after each batch.

##### K2 — Twinkle's tour, explain cards (?) and Hint (bulb) (Barkat, about 3 h)
**Read:** plan §5.3 and §5.5; `src/components/Words.tsx`, `Twinkle.tsx`, `LevelChrome.tsx`, `Hud.tsx`; `src/screens/Play.tsx` (hint panel); `src/store/words.ts`.

**Build**
- **`ExplainCard`** (grow it from the Space Words card): big picture, title, 2–4 short sentences (40 words at most), Read-to-me, source line. Content in `src/content/explain.ts`, one entry per plan §5.5 list, sentences only from `docs/06` §4 kid wording or plan text.
- **Two buttons, always in the same place** in the top strip of every level screen, and on Home, Map, Resources and Fly: **?** (explain this screen) and **bulb** (hint, levels only). Each has its icon and its word under it ("Explain", "Hint"); they never look alike.
- **Twinkle's tour in mission 1:** before the first crate, a spotlight dims the stage except one thing at a time, with Twinkle's one line from plan §5.3: the four bars and the goal → ? → bulb → a choice card and GO → the star and stardust counters. One tap moves on; **Skip tour** always shows. Saved so it shows once; "Replay the tour" in Profile.
- The Home "flight deck tour" (`TwinkleTourGuide`) stays, with its K1 wording, opened from Home's ? button.
- Opening an explain card for the first time adds it to the Space Book (and later gives +2 ✦ through K3).

**Done when** a first-time player meets the tour before packing; every level screen has ? and bulb in the same spot; every card's facts match `docs/06`; keyboard and reduced motion work; tests and build pass.

> **Prompt — K2.** Do step K2 in `docs/BUILD_SEQUENCE.md`. Read §3, §4, plan §5.3 and §5.5, and K2, then only its Read line. Build the explain card, the ? and bulb buttons in fixed places, and Twinkle's five-stop tour in mission 1. Facts only from `docs/06` §4. Play mission 1 as a new player, check, report, stop.

##### K3 — One points story (the Back-End Developer, about 2 h)
**Read:** plan §5.7; `src/fly/storage.ts` (stardust), `src/engine/resources.ts`, `src/store/game.ts`, `src/screens/Home.tsx`, `Fly.tsx` (end card), `Resources.tsx` (header).

**Build**
- `src/store/wallet.ts`: one place for stardust (moves the Fly total over without losing it), with `earn(source, amount)` and `spend(amount)`. Sources: Fly, bonus round (K5), first clear of a level (+10), first explain card (+2). Saved and guarded like the rest.
- Science Stars: each level's stars count once (B1 item 4); lifetime stars and badges feed the rank.
- **Home wallet:** ⭐ and ✦ side by side, top right. A tap opens the "How points work" explain card with the loop picture from plan §5.7.
- **Fly end card:** "Spend it in Resources" button. **Resources header:** "Earn ✦ in Fly and bonus rounds." **Level-complete crate:** shows "+10 ✦" the first time.
- Tests: every earn path, the spend cap, first-clear only once, the Fly total carried over.

**Done when** a new player can say where stardust comes from and what it buys, from the screens alone; tests and build pass.

> **Prompt — K3.** Do step K3 in `docs/BUILD_SEQUENCE.md`. Read §3, plan §5.7 and K3, then only its Read line. Add the wallet with its earn and spend paths, the Home wallet and the "How points work" card, and the Fly and Resources links, with tests. Check, report, stop.

##### K4 — The 3D opening: "Earth is too full" → you suit up (Barkat in the game, the Video Editor in Remotion, about 3 h)
**Read:** plan §4.0 and §4.2; `src/screens/Story.tsx`, `src/components/3d/CrisisEarth3D.tsx`, `HeroCadetRocket3D.tsx`; `src/App.tsx` (hook → story route); `crewready-video/src/` (Remotion).

**Build**
- `src/screens/Intro.tsx` replaces the three story cards (keep `Story.tsx` until it works). Three beats from plan §4.2, each about 8 s, with the `FICTION` tag and at most 20 words:
  1. **Too Full:** the 3D Earth turns; city lights on the night side spread and join until it glows (an emissive texture whose mask grows over time). A soft crowd hum when sound is on.
  2. **A Second Home:** the camera pulls back; Mars slides in; a dotted path draws between them.
  3. **You!:** two big cards, Orbit and Nova. The pick writes the `hero` field (B3 item 4). The chosen kid steps forward, the helmet closes, a "Junior Astronaut" badge stamps on, Twinkle flies in → mission 1 and the K2 tour.
- One tap anywhere moves to the next beat; **Skip** always shows. Reduced motion or no WebGL: three still pictures with the same words. Low-end check: steady at 4× CPU slowdown; pixel ratio capped at 1.5.
- NeoWs leaves the story and goes on the Fly start card with the F4 wording.
- **Remotion (video only):** an `EarthIntro` composition in `crewready-video/` with the same three beats, 1920 × 1080, for both videos' openings. The game never loads Remotion.

**Done when** a new player goes hook → three beats → hero pick → mission 1 in under 40 seconds (or under 5 with Skip); the picked hero shows everywhere after; no asteroid line is left in the story; tests and build pass.

> **Prompt — K4.** Do step K4 in `docs/BUILD_SEQUENCE.md`. Read §3, §4, plan §4.0 and §4.2, and K4, then only its Read line. Build the three-beat 3D opening with the hero pick, its still-picture fallback, and move NeoWs to Fly. No new facts. Check at 844, 667 and 4× slowdown, report, stop.

##### K5 — Bonus rounds: one mini-game per level (the Front-End Developer, about 4 h)
**Read:** plan §5.6; `src/components/toys/` (the Try-it toys: copy their structure); `src/screens/Play.tsx` (where the level ends and the crate shows); `src/store/wallet.ts` (from K3).

**Build**
- `src/minigames/`: pure rules for each game (spawn, hit, score, end), tested; same seed, same game.
- `BonusRound` shell: one picture and at most 5 words, a 3-2-1, a timer bar, the score turning into stardust (at most 30), **Skip**, Play again once. Shown after the level's last step, before the reward crate.
- The six games in plan §5.6, built in this order: L2 Space Rock Zapper, L3 Leak Patrol, L4 Panel Wipe, then L1 Countdown, L5 Seed Match, L6 Rock Sorter.
- Rules: stardust only, never bars or stars (a test proves the game store is untouched); one thumb or the keyboard; 44 px targets; colour is never the only clue (Seed Match and Rock Sorter also use shape); reduced motion keeps them playable; our own art, no copied game.

**Done when** each built level offers its round, skipping works, stardust lands in the wallet, the store test passes, and each plays at 667 × 375.

> **Prompt — K5.** Do step K5 in `docs/BUILD_SEQUENCE.md`. Read §3, §4, plan §5.6 and K5, then only its Read line. Build the BonusRound shell and the six games in the listed order with pure tested rules; stardust only. Stop after each game for me to play it.

##### After K5 — the second play-test
Run F4 again with a child aged 7–12 who has not played. Ask afterwards: "What were you trying to do?" (the answer should be "keep the bars up") and "What is stardust for?" Fix what they stumble on.

### Phase R — rework what's built

#### R0 — Bring the Antigravity work in line (about 45 min)
**Read:** §4.3a; `src/screens/Story.tsx`, `src/screens/Home.tsx`, `src/screens/Welcome.tsx`; search `src/components/Decision.tsx`, `Dock.tsx` and `LevelChrome.tsx` for `animate-`, `blur`, `shadow-[0_0` and `boxShadow`.

**Fix**
- Story: replace "Impact Risk: 0.00% · Safe Flybys Verified" with the plan's "None will hit us." Remove the looping ping.
- Home: keep the Kp gauge; cut its sentence under 15 words; no looping beacon. Add the Kp → NOAA G-scale rows to `docs/06` §4 with their source, or drop the G labels.
- Welcome: loading lines follow §4.3a (mission-prep lines stay; the NASA line waits for D1). Replace `backdrop-blur` with dark 70–85% fills and keep the look. `animate-pulse` goes. The Play button keeps its one halo.
- Dock (glass), Decision (ping, planet glow), LevelChrome: no blur, no loops, no glow. The shaded planets keep their light edge.

**Done when** `grep` finds no `backdrop-blur`, `animate-ping` or `animate-pulse` in `src/`; every sentence a player sees is under 15 words and in the plan or `docs/06`; tests and build pass.

> **Prompt — R0.** Do step R0 in `docs/BUILD_SEQUENCE.md`. Read §3, §4.3, §4.3a and R0, then only its Read line. Remove the invented asteroid line, blur, extra glow and looping motion, and fix the NASA loading line, keeping the welcome screen's look. Change nothing else. Check, report, stop.

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

#### R2 — Finish the welcome screen (about 1 h)
The screen exists (Antigravity, cleaned in R0). Shown on every load, crossfade, bar → Play, How to Play and the switch already work. What's left:

**Read:** `src/screens/Welcome.tsx`, `src/App.tsx`, `src/content/i18n.ts`, `plan.md` §7 row W.

**Finish**
- **Tie the bar to real loading.** Today it's a fixed 2.4 s timer. Count real things: fonts ready, each crew image and the first scenes decoded, the save read. At least 1.8 s so the change is seen, at most 5 s, then go on anyway. Reduced motion: one straight cut.
- **Fit the stage.** Lay it out inside R1's `Stage`: title, Play and How to Play on the left; the crew art on the right two-thirds. Drop the separate upright layout: the turned stage covers it. Fade the placeholder art's left 20% and top 15% into the backdrop so its leftover mock-up text doesn't show. Clean art later must need no code change.
- **Play** asks for full screen and landscape (§4.2), then goes to the hook the first time and to Home after that (check the `screen === 'hook'` branch in `App.tsx` doesn't skip the hook for a player who quit half-way through it).
- **How to Play:** three picture panels, one line each: "Watch your four meters." · "Tap a choice to look. Tap GO to pick it." · "If a meter hits zero, you try again."
- **Strings:** the kit's strings go through `t()` too. Bangla lines Antigravity wrote stay, but mark them "needs a check" for F2.

**Done when** reloading always shows the change then Play; throttled to "Slow 4G" the bar really waits; the hook's first choice is reachable within 15 seconds of load; the switch survives a reload.

> **Prompt — R2.** Do step R2 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and R2, then only its Read line. Tie the welcome bar to real loading, fit the screen into the stage, and finish Play, How to Play and strings. Write no new Bangla. Check, report, stop.

#### R3 — Level screens in landscape, with Look first (about 3 h)
**Read:** `src/screens/LevelOpening.tsx`, `src/screens/Play.tsx`, `src/components/Decision.tsx`, `src/components/LevelChrome.tsx`, `src/components/Hud.tsx`, `src/components/steps/*`, `src/content/icons.ts`. Search `src/engine/engine.ts` for how a choice's changes are worked out; don't read it all.

**Build**
- **Level opening:** the scene fills the stage. Left: the crew. Right: ribbon ("LEVEL 3 · FIRST BREATH"), one line, the task list as three or four icon chips, the IntelCard, **GO!**. Carry-over costs still play onto the HUD one by one with their reason.
- **Decision:** Twinkle's bubble on top of the right zone; three `ChoiceCard`s in a row under it.
  - **Look first:** the first tap selects a card. It lifts, and every meter it will touch wiggles and shows arrows: one ▲/▼ for 5–10, two for 15–20, three for 25 or more (no numbers; stars show a star). Tapping another card moves the selection. **GO** confirms. Keyboard: arrows move, Enter confirms.
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

#### R5 — Make it seen, not read (about 4 h)
The step that turns a reading game into a watching-and-touching game. Spec: §4.1a.

**Read:** §4.1a; `src/components/Decision.tsx`, `src/components/Scene.tsx`, `src/content/icons.ts`; search `src/content/levels.ts` for option labels and reason lines only.

**Build**
- **Event moments:** `src/components/events/`, one small SVG/CSS animation per row of the §4.1a table, played in the `Scene` before the choices appear. 2–3 s, tap to skip, reduced motion shows the end frame. Storm and dust read their size (X, D) from the store, so a bigger real storm draws a bigger wave.
- **Picture cards:** each option gets a short label (2–5 words) and an icon scene in `src/content/icons.ts` (`short`, `scene`). The full sentence stays in `levels.ts` for Read-to-me and the result. Words change only by shortening; no new meaning.
- **Result in the scene, then the chain:** after GO, a 1.5 s acted result (reusing the event's parts), then the chain reaction: two or three icons linking left to right and ending in the meter chips, from a `chain` map per option written from its reason line. The reason sentence is one line under it.
- **Live pressure in level 3:** during the leak, Air & Water ticks down until a choice is made (display only; the engine's numbers still decide the cost).
- **Word budget:** a test counts the words on every decision, result and opening against the §4.1a table and fails if any is over.

**Done when** the silent test (§4.1a) passes on all six levels; the word-budget test passes; a bigger storm visibly draws a bigger wave; engine tests are untouched.

> **Prompt — R5.** Do step R5 in `docs/BUILD_SEQUENCE.md`. Read §3, §4.1a and R5, then only its Read line. Add an event moment before each decision, picture-first cards with short labels, the acted result plus chain reaction after GO, and the word-budget test. Change no rule, number or fact. Do the silent test on all six levels, check, report, stop.

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
*Split for §5a: **part a** (Lane B) is `stormSize()` and its tests, plus the offline manifest and worker. **Part b** (Lane A, after merge M1) is every card and screen showing real data.*

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

#### L1 — The four Try-it toys (about 2 h)
**Read:** `plan.md` §5.4; `src/content/icons.ts`; `src/content/levels.ts` (reason lines only: search for them); the result part of `src/components/Decision.tsx`; `src/screens/LevelOpening.tsx`.

**Build**
- The chain reaction is built in R5.
- **Try it:** one toy each for levels 2–5, in `src/components/toys/`, shown after the level opening and before the first decision. Ten seconds, no score, no meter change, a **Skip**. The four toys and what the hand should feel are in plan §5.4. Each ends with one line from that level's "I learned" sentence.
- The level-3 toy reuses the message clock.

**Done when** each toy works with one thumb and with the keyboard, can be skipped, and changes no meter (a test proves the store is untouched).

> **Prompt — L1.** Do step L1 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and L1, then only its Read line. Add the four ten-second Try-it toys. They teach only what the plan already says and never change a meter. Check, report, stop.

#### L2 — Space Words and Read to me (about 2 h)
**Read:** `docs/06` §4; `src/components/Twinkle.tsx`; `src/content/strings.en.ts`; `src/store/game.ts`.

**Build**
- **Space Words:** `src/content/words.ts` holds up to 12 words (sol, radiation, solar panel, recycler, carbon dioxide, launch window…), each with an icon and one sentence **taken from `docs/06` §4 or the plan**. Leave out any word with no sourced sentence, and list it in the report. The first time a word appears it's underlined; a tap opens a small card and adds it to the Space Book (saved).
- **Read to me:** a speaker button on every speech bubble, using the browser's own speech. Pick a voice for the current language; if there is none, hide the button. One tap speaks, another stops. Leaving the screen stops it.

**Done when** words collect and survive a reload; speech works in English in the preview and the button hides when no voice exists.

> **Prompt — L2.** Do step L2 in `docs/BUILD_SEQUENCE.md`. Read §3 and L2, then only its Read line. Add tappable Space Words with sourced one-line meanings and a saved Space Book, and a Read-to-me button on speech bubbles. Invent no definitions. Check, report, stop.

### Phase S — the side screens

#### S2 — Fly, the endless runner (about 4 h)
**Read:** `plan.md` §7 row 2; `src/services/nasa.ts` (Kp); `src/store/game.ts`; `src/components/stageMath.ts`.

**Build** `src/screens/Fly.tsx` and `src/fly/` (game logic, kept apart from drawing so it can be tested), a `<canvas>` on the stage. Seen from behind Orbit (or Nova): three lanes running into the distance, forever.
- **Controls (all four work):** tap the **left or right half** of the screen to change lane · swipe **up** (read through `stageDelta`) or tap the round **Hop** button, or ↑ / Space, to hop low rocks · ← / → keys. Two thumbs, no reading.
- **Things:** tall rocks (change lane), low rocks (hop over), debris, stardust in lines and arcs with a "+1" pop.
- **Powers** (glowing pickups, switch on by themselves, about 6 s, one at a time, a shrinking ring around the pilot and one icon with its ring in the corner): **Shield** (takes one hit) · **Magnet** (pulls stardust in) · **Boost** (fast, can't be hit, stardust worth double). Each has an icon and a name, never colour alone.
- **Run:** three hull pips; a hit costs one and a stumble; at zero the run ends. It speeds up with distance. Starting speed and speed-up from today's Kp: slow 0–3, medium 4–6, fast 7–9, shown as "Space weather today: Kp N" with its badge (docs/06 §4).
- **End:** a card with distance and stardust, the best distance on this device, the stardust bursting into the saved total, **Fly again**. The first screen is one **Fly** button, not a menu.
- **Engine:** a fixed-step update with a delta-time loop that pauses when the tab is hidden. The spawn, hit and power rules are pure functions with tests; the same seed gives the same run. Our own Mars look; copy no existing game's art, names or sounds.

**Done when** it holds a steady frame rate at 4× CPU slowdown, pauses when hidden, works upright (turned stage), the rule tests pass, and stardust and best distance survive a reload.

> **Prompt — S2.** Do step S2 in `docs/BUILD_SEQUENCE.md`. Read §3, §4 and S2, then only its Read line. Build Fly: an endless three-lane canvas runner (tap left/right half, swipe up or Hop to hop, three auto-powers Shield / Magnet / Boost, three hull pips, speeds up, start speed from real Kp). Pure tested rules. Our own Mars look; copy no existing game. Check at 4× slowdown, report, stop.

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
| R0–R5 | about 13 |
| F1 | 1 |
| D1–D2 | 5 |
| S1 | 1 |
| **To the film line** | **about 20** (about 12 with two people after R1) |
| L1–L2 | 4 |
| S2–S4 | 7.5 |
| F2–F5 | 5.5 |

**v11 (phase B and K, about 18 h with three people in parallel):** B1 2.5 · B2 1.5 · B3 2.5 · K1 2 · K2 3 · K3 2 · K4 3 · K5 4 · second play-test 1. If short: drop K5 games from the end of its list (keep three), then K4 down to its three still pictures. Never cut phase B, K1, the ? and bulb, or the tour's goal line.

**If time runs short, cut in this order:** sound → Bangla level text (keep the switch and buttons) → Resources upgrades → Space Words → Try-it toys → leaderboard (keep badges) → Fly → the welcome picture change (keep the screen).

**Never cut:** the six levels · the four meters and the HUD · landscape · the hook · Look first · the level-2 storm and level-4 dust event moments · the chain reaction · Mission Replay · source lines · live DONKI in level 2 · the Sources page · the crew reacting.

Real deadlines are in plan §12.1: the 240-second video on **Fri 13 Nov, 6:30 PM**; the 30-second video and the finished project page on **Sat 14 Nov, 12:00**; freeze **Sat 09:00**.

---

## 7. Things only the team can supply

| Needed | By step | If missing |
|---|---|---|
| **Wide welcome pictures** (nice to have): the same two scenes as 16:9, at least 1920 × 1080, no text, crew on the right two-thirds, same framing | R2 | The cleaned upright pictures ship, with the backdrop fade |
| ~~The name of the AI image tool~~ **Done 13 Nov:** ChatGPT image generation (OpenAI) | — | — |
| A hosting choice, and a yes before each push | F1 | The build stays local |
| ~~Confirmation of each "Confirm" fact~~ **Done 13 Nov** (`docs/06` §4). The Science lead opens each link once before judging | — | A ✗ fact stays out |
| ~~One OSDR Veggie study~~ **Done:** OSD-745 | — | — |
| ~~The real names and roles~~ **Done:** six members, Cumilla (plan §10). Still needed: who is under 18, and the Local Lead's answer on naming them | videos | — |
| The Captain's decision on the upright phone stage (B3 item 1) | B3 | Restore §4.2 |
| A second child aged 7–12 for the play-test after K5 | F4 | The youngest person available, and say so |
| A narrator aged 18 or older | Video | An adult member reads |
| A Bangla speaker to check every line | F2 | Bangla stays on the switch and buttons only |
| The licence of each file in `public/assets/audio/` | S3 | No sound |
| Orbit's shoulder patch: does it look too much like NASA's insignia? | Before filming | Keep it; it's a dot at game size |
| A child aged 7–12 for 20 minutes | F4 | The youngest person available, and say so |

---

## 8. Where the ideas come from

- The team's welcome mock-ups ("CrewReady Astronaut Training Interface" 1 and 2): the deep-space look, the cyan Play button, the EN / বাংলা switch.
- `improvement-suggestions.md` (Antigravity session, 12 Nov): what was kept and dropped is in §4.3a.
- `docs/human design standards.md`: the quality bar; its §3 and §5 are why glass and glow stay out.
- `nasa guidelines/space-apps-2026-bangladesh-build-guide.md`, challenge 03: the 15-second demo, the Relevance trap, offline, Bangla, touch targets, the under-18 rule.
- `nasa guidelines/Space Apps Challenge Participants Guide.md` §02 and §08: the run of show and the three videos.
- Supercell on the Clash of Clans interface: a few big things, each in a fixed place. https://supercell.com/en/games/clashofclans/blog/news/weve-revamped-the-clash-of-clans-user-interface/
- Game feel: squash on pointer-down, about 95%, quick springy release, big effects only for big moments. https://itch.io/blog/1059831/making-a-game-feel-juicy-with-simple-effects
