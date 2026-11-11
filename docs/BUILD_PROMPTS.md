> **Superseded in part by plan.md v7 (mentor pivot).** The game is now one Earth-to-Mars mission with six levels and four meters; base building, training deck, Moon mission, 3D runner and PWA are cut. Where this file disagrees with `plan.md`, `docs/00`, `docs/06` or `docs/08`, those win. Kept for reference only.

# Modular Build Prompts: Engineering Implementation Sprints
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-BUILD-PROMPTS-V1.0
System Authority: `plan.md` $\rightarrow$ `docs/00_PROJECT_CONTEXT.md` $\rightarrow$ `docs/01_PRD.md` $\rightarrow$ `docs/02_SRS.md` $\rightarrow$ `docs/03_TRD.md` $\rightarrow$ `docs/04_DDS_UIUX_3D.md` $\rightarrow$ `docs/05_DATABASE_SCHEMA.md` $\rightarrow$ `docs/06_SCIENCE_AND_NASA_DATA.md` $\rightarrow$ `docs/07_ASSET_MANIFEST.md` $\rightarrow$ `docs/08_MVP_SCOPE_AND_BUILD_SEQUENCE.md` $\rightarrow$ `docs/BUILD_PROMPTS.md`

---

## Sprint Implementation Execution Architecture
This document provides 7 self-contained, modular, spec-driven engineering prompts designed for direct handover to AI coding agents or engineers. Each prompt enforces our foundational invariants:
1. **Zero Backend Failure:** 100% client-side deterministic static PWA without cloud, Python, or external Node dependencies.
2. **Coupled 6-Resource Ledger:** Every mission decision mutates $\ge 2$ resources simultaneously in $[\text{Power}, \text{Oxygen}, \text{Water}, \text{Food}, \text{Shielding}, \text{Crew Time}]$.
3. **Resilient NASA Gateway:** Seamless client integration supporting `DEMO_KEY`, user settings key, and instant offline fixture fallbacks (`public/assets/data/`).
4. **Test-Driven Verification:** Pure engine mechanics, stoichiometry, and state persistence verified via Vitest prior to UI wiring.
5. **Cadet Accessibility & Socratic Pedagogy:** Kid-readable aerospace HUD (44px+ touch targets, bilingual English/Bengali `বাংলা`), guided by drone mentor **Twinkle** (never Astra).

---

### Prompt 1: Project Scaffolding, PWA Setup, Navigation Shell, Zustand Stores, i18n & NASA Gateway

```markdown
### AGENT EXECUTION PROMPT: SPRINT 1 — CORE FOUNDATION & RESILIENT DATA LAYER

#### 1. Mission Brief & Context
Build the foundational client runtime for "CrewReady: Beyond Us" (NASA Space Apps Challenge 2026). Establish a strict client-side PWA architecture using Vite + React 18 + TypeScript strict mode + Tailwind CSS + Lucide React + Zustand. There are ZERO backend server dependencies.

#### 2. Authoritative Input Documents
- `AGENTS.md` (Operating Guardrails & Invariants)
- `docs/00_PROJECT_CONTEXT.md` (Product Identity & Twinkle Persona)
- `docs/03_TRD.md` (Technical Stack & Service Worker Caching)
- `docs/05_DATABASE_SCHEMA.md` (LocalStorage `crewready_v1_*` keys & Safe Storage Wrapper)
- `docs/06_SCIENCE_AND_NASA_DATA.md` (NASA Endpoints, Headers & Offline Fixtures)

#### 3. Strict Architectural Rules & Invariants
- Zero backend failure: Static client-only PWA with offline Service Worker (`sw.js`).
- Store schema versioning: `crewready_v1_schema_ver = 1` with automatic corrupted-state self-healing.
- NASA API Gateway: In-flight timeout (2500ms). Automatically catches 403, 429, timeouts, or network loss, falling back to bundled JSON fixtures in `public/assets/data/` while setting status to `[OFFLINE ARCHIVE]`.
- Iconography: Lucide React only. No Unicode emojis in system UI. Minimum touch target 44x44px.
- Bilingual Engine: Dynamic language toggle between English (`en`) and Bengali (`bn`) without DOM reload.

#### 4. Schemas & TypeScript Contracts
- `src/types/cadet.ts`:
  ```typescript
  export type CadetRank = 'Cadet Trainee' | 'Junior Specialist' | 'Flight Officer' | 'Mission Commander';
  export interface CadetProfile {
    callsign: string;
    rank: CadetRank;
    stardust: number;
    techCredits: number;
    badges: string[];
    createdAt: number;
  }
  ```
- `src/types/nasa.ts`:
  ```typescript
  export interface ApodPayload {
    title: string;
    date: string;
    explanation: string;
    url: string;
    media_type: 'image' | 'video';
    copyright?: string;
  }
  export interface EpicImageItem {
    identifier: string;
    caption: string;
    image: string;
    date: string;
  }
  ```

#### 5. Concrete Files to Generate
- `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`
- `public/manifest.json`, `public/sw.js` (Cache-First for GLB/data, Stale-While-Revalidate for app)
- `src/services/storage.ts` (`safeGetItem`, `safeSetItem`, migration, key prefix `crewready_v1_*`)
- `src/services/i18n.ts` & `public/assets/data/strings.json` (English & Bengali translation keys)
- `src/services/nasaApi.ts` (Resilient client for APOD, EPIC, and NASA Images with fixture fallback)
- `public/assets/data/apod_fallback.json`, `public/assets/data/epic_fallback.json`
- `src/store/settingsSlice.ts`, `src/store/runSlice.ts`, `src/store/missionSlice.ts`, `src/store/baseUpgradeSlice.ts`
- `src/components/common/Header.tsx`, `src/components/common/BottomNav.tsx` (5 tabs: Quick Run, Missions, Resources, Training, Profile)
- `src/App.tsx`, `src/main.tsx`
- `tests/storage.test.ts`, `tests/nasaApi.test.ts`

#### 6. Unit Testing & Verification Gates
1. Run storage test: `npx vitest run tests/storage.test.ts` (Asserts corrupted JSON triggers graceful reset).
2. Run NASA gateway test: `npx vitest run tests/nasaApi.test.ts` (Simulate offline network / 403 response; asserts fallback fixture returned with source flag `[OFFLINE ARCHIVE]`).
3. Compile bundle: `npm run build` (Must complete with zero TypeScript and linter errors).
```

---

### Prompt 2: 3D Quick Run Spacecraft Runner (Three.js/R3F, Lanes, Hazards & 2D Fallback)

```markdown
### AGENT EXECUTION PROMPT: SPRINT 2 — 3D KINETIC QUICK RUN SPACECRAFT RUNNER

#### 1. Mission Brief & Context
Build the hero kinetic entry module: the 3D Quick Run Spacecraft Runner ("Subway Surfers in deep space"). Young cadets pilot a spacecraft across 3 lateral lanes, dodging authentic scientific hazards (Kessler syndrome debris, solar flare radiation bursts, micrometeoroids) while harvesting Stardust Minerals and auxiliary power cells to fund their Outpost Base.

#### 2. Authoritative Input Documents
- `docs/01_PRD.md` (Kinetic Entry Hook & Cadet Game Loop)
- `docs/03_TRD.md` (Three.js/R3F, DPR bounds, Shader performance, Memory disposal)
- `docs/04_DDS_UIUX_3D.md` (Runner camera parameters, Lane layout, HUD overlay)
- `docs/07_ASSET_MANIFEST.md` (Craft, Asteroid, Satellite GLTF paths & procedural primitives)

#### 3. Strict Architectural Rules & Invariants
- 60 FPS Mobile Budget: Device Pixel Ratio strictly clamped: `Math.min(window.devicePixelRatio, 1.5)`.
- Memory Hygiene: Explicit geometry and material disposal on unmount or lane recycling.
- Multi-Input Support: Keyboard (`ArrowLeft`/`ArrowRight`, `A`/`D`), Touch swipe gestures, and on-screen HUD buttons.
- Zero WebGL Failure: If WebGL context is lost or unsupported, immediately unmount R3F Canvas and render the high-contrast `SpacecraftRunner2DPoster.tsx` vector arcade fallback.
- Active Superpower Sync: Check `baseUpgradeSlice` for unlocked abilities (Level 2 Shield Dome enables Deflector Shield).

#### 4. Mathematical Engine & Physics Contracts
- 3-Lane Track Coordinate System: $X \in \{-3.0, 0.0, +3.0\}$, Craft $Y = 0$, Camera $Z = +6.0, Y = +3.2$, LookAt $(0, 0, -8.0)$.
- Forward Velocity: $V(t) = V_0 + a \cdot t$, where $V_0 = 15.0\text{ m/s}$, max speed $45.0\text{ m/s}$.
- Bounding Volume Hierarchy (BVH) / Axis-Aligned Bounding Box (AABB) collision checks executed at 60 Hz.
- Shield Loss Function: Colliding with Kessler debris deducts $-25\%$ craft integrity; reaching $0\%$ triggers mission end.

#### 5. Concrete Files to Generate
- `src/engine/runnerPhysics.ts` (Pure kinematics, lane transitions, AABB collision, speed acceleration)
- `src/components/runner/RunnerCanvas.tsx` (R3F Canvas, lighting, starfield particle system)
- `src/components/runner/Spacecraft.tsx` (Spaceship model or procedural fallback with engine thruster glow)
- `src/components/runner/ObstacleManager.tsx` (Procedural spawner for space junk, solar flares, asteroids)
- `src/components/runner/CollectibleManager.tsx` (Stardust mineral crystals, auxiliary power orbs)
- `src/components/runner/RunnerHUD.tsx` (Speedometer arc, collected Stardust counter, shield health bar)
- `src/components/runner/SpacecraftRunner2DPoster.tsx` (Pure CSS/SVG canvas-free fallback)
- `src/views/RunnerView.tsx` (View container wiring controls, active powers, and runSlice mutations)
- `tests/runnerPhysics.test.ts` (Lane interpolation, collision detection, and scoring unit tests)

#### 6. Unit Testing & Verification Gates
1. Run kinematics tests: `npx vitest run tests/runnerPhysics.test.ts` (Asserts lane snapping, boundary clamping, and damage calculations).
2. Memory profiling check: Verify cleanup handlers remove all event listeners and RAF timers on unmount.
3. Build check: `npm run build` succeeds with zero errors.
```

---

### Prompt 3: Outpost Mission Engine & Coupled 6-Resource Ledger (Missions 0, 1 & 2)

```markdown
### AGENT EXECUTION PROMPT: SPRINT 3 — OUTPOST MISSION ENGINE & COUPLED LEDGER

#### 1. Mission Brief & Context
Implement the core educational heart of CrewReady: the deterministic Outpost Mission Engine. Young flight commanders manage life-support trade-offs across 3 progressive campaigns: Mission 0 (Earth Orbit Launch & Staging), Mission 1 (Lunar Shackleton Crater Water-Ice Extraction), and Mission 2 (Mars Jezero Colony Global Dust Storm Crisis).

#### 2. Authoritative Input Documents
- `docs/01_PRD.md` (Mission Progression & Sacred Educational Loop)
- `docs/02_SRS.md` (Coupled Ledger Functional Requirements & Socratic Pedagogy)
- `docs/03_TRD.md` (Deterministic Engine Architecture)
- `docs/06_SCIENCE_AND_NASA_DATA.md` (ECLSS Equations, NASA MCS Dust Data, Solar Flux)

#### 3. Strict Architectural Rules & Invariants
- The Sacred Coupling Invariant: Every dilemma option MUST mutate $\ge 2$ resources in $[\text{Power}, \text{Oxygen}, \text{Water}, \text{Food}, \text{Shielding}, \text{Crew Time}]$, each accompanied by an explicit, kid-comprehensible `reason` string.
- Socratic Drone Mentor: Twinkle prompts cadets with predict-first questions before decisions are confirmed. Twinkle NEVER reveals the optimal choice in advance.
- Bounded Butterfly Effects: Flagged state persists forward across Sols (e.g., deferring solar panel cleaning on Sol 3 triggers a catastrophic micro-inverter burnout on Sol 7).
- Real NASA Telemetry Grounding: Mission 0 integrates real-time or offline-cached NASA EPIC full-disc Earth imagery; Mission 2 dynamically attenuates solar power based on Mars Climate Sounder (MCS) dust optical depth $\tau$.

#### 4. Mathematical Engine & Data Schemas
- 6-Resource Ledger:
  $$\mathbf{R} = [P\,(\text{kW}),\; O_2\,(\%),\; H_2O\,(\text{L}),\; F\,(\text{kg}),\; S\,(\%),\; T\,(\text{hrs})]$$
- Safe Operating Thresholds: $P \in [0, 100]$, $O_2 \in [0, 100]$, $H_2O \in [0, 500]$, $F \in [0, 250]$, $S \in [0, 100]$, $T \in [0, 24]$.
- `src/types/mission.ts`:
  ```typescript
  export interface ResourceDelta {
    power?: number;
    oxygen?: number;
    water?: number;
    food?: number;
    shielding?: number;
    crewTime?: number;
    reason: string;
  }
  export interface DilemmaOption {
    id: string;
    text: string;
    consequenceHint: string;
    deltas: ResourceDelta;
    butterflyFlag?: string;
  }
  export interface MissionDilemma {
    id: string;
    sol: number;
    title: string;
    context: string;
    twinklePrompt: string;
    options: [DilemmaOption, DilemmaOption];
  }
  ```

#### 5. Concrete Files to Generate
- `src/engine/science.ts` (Pure deterministic calculations: solar flux, power throttling, life support consumption)
- `src/engine/eclss.ts` (Sabatier reaction stoichiometry, water distillation recovery, O2 leakage rates)
- `src/data/missions/mission0_earth.json` (Earth staging, payload mass balancing, EPIC Earth telemetry)
- `src/data/missions/mission1_moon.json` (Shackleton crater, permanently shadowed regions, water-ice drill vs power)
- `src/data/missions/mission2_mars.json` (Jezero dust storm, MCS optical depth, battery vs oxygen priority)
- `src/components/missions/LedgerHUD.tsx` (6 resource meters, danger thresholds, Lucide icons, delta preview badges)
- `src/components/missions/TwinkleDialogue.tsx` (Predict-first bubble, speech animations, Socratic questions)
- `src/components/missions/DilemmaCard.tsx` (Bilingual dilemma prompt, side-by-side trade-off choices, coupling preview)
- `src/views/MissionsView.tsx` (Mission selection map, active mission coordinator, Sol progression bar)
- `tests/scienceEngine.test.ts` (Verifies ledger math, $\ge 2$ coupling invariant validation, and failure trigger states)

#### 6. Unit Testing & Verification Gates
1. Run engine tests: `npx vitest run tests/scienceEngine.test.ts` (Asserts 100% of dilemmas mutate $\ge 2$ resources; confirms system failure triggers when any vital resource hits 0).
2. Verify EPIC integration: Mission 0 renders NASA EPIC Earth photo with fallback to `epic_fallback.json` if offline.
3. Build check: `npm run build` passes with zero errors.
```

---

### Prompt 4: Mission Black Box Debrief (Forensic Timeline, Tipping Point & NASA APOD)

```markdown
### AGENT EXECUTION PROMPT: SPRINT 4 — MISSION BLACK BOX DEBRIEF & NASA CELEBRATION

#### 1. Mission Brief & Context
Build the forensic education system: the Mission Black Box Debrief modal. In CrewReady, failure is never a punishment—it is an authentic aerospace learning forensic investigation. Cadets scrub through a step-by-step Sol timeline, isolate the pivotal tipping-point decision that cascaded into failure, compare their choices with NASA real-world solutions, and receive a daily NASA APOD celebration reward.

#### 2. Authoritative Input Documents
- `docs/01_PRD.md` (Forensic Debriefing Philosophy & APOD Reward)
- `docs/02_SRS.md` (Black Box Scrubbing & Real-World Solution Comparison)
- `docs/05_DATABASE_SCHEMA.md` (Run History & Debrief Event Logs)
- `docs/06_SCIENCE_AND_NASA_DATA.md` (APOD API Client & Pedagogical Annotations)

#### 3. Strict Architectural Rules & Invariants
- Non-Blaming Constructive Tone: Twinkle acts as flight recorder analyst (*"Power dropped to 0 kW on Sol 14 because battery heating was starved"*), never blaming the cadet.
- Interactive Timeline Scrubber: Cadets drag or click through past Sols to observe the step-by-step decay of vital resources.
- Pivotal Tipping-Point Detection: Pure deterministic algorithm identifies the single decision that initiated the irreversible cascade.
- NASA APOD Celebration: Integrates `nasaApi.ts` to display today's APOD image, scientific description, and copyright attribution, with silent fallback to `apod_fallback.json`.
- Quick Iteration: Single-click "Replay with Alternate Strategy" immediately resets the ledger while preserving earned cadet experience.

#### 4. Algorithmic Specifications & Schemas
- `src/types/debrief.ts`:
  ```typescript
  export interface ForensicSolRecord {
    sol: number;
    decisionTitle: string;
    selectedOption: string;
    deltas: ResourceDelta;
    ledgerSnapshot: Record<string, number>;
    entropyContribution: number; // 0 to 1 scale indicating system destabilization
  }
  export interface BlackBoxSummary {
    missionId: string;
    outcome: 'success' | 'failure';
    tippingPointSol: number;
    primaryRootCause: string;
    nasaEngineeringComparison: string;
    records: ForensicSolRecord[];
  }
  ```
- Tipping Point Classifier: Evaluates entropy metric $\Delta E = \sum_i \frac{|R_{i,\text{target}} - R_{i,\text{current}}|}{R_{i,\text{max}}}$, marking the highest single jump as the pivot.

#### 5. Concrete Files to Generate
- `src/engine/debriefAnalyzer.ts` (Deterministic tipping point detector and root-cause classifier)
- `src/components/debrief/DebriefModal.tsx` (Full-screen forensic HUD modal with high-contrast layout)
- `src/components/debrief/TimelineScrubber.tsx` (Horizontal interactive Sol scrubber with mini graph)
- `src/components/debrief/TippingPointCard.tsx` (Visual isolation of the critical cascading choice)
- `src/components/debrief/NasaComparisonCard.tsx` (Real Artemis/Apollo engineering solution contrast)
- `src/components/debrief/ApodRewardCard.tsx` (Daily NASA APOD card with offline fallback, image zoom, and explanation)
- `src/components/debrief/ReplayButton.tsx` (One-click state reset with alternate path suggestions)
- `tests/debrief.test.ts` (Unit tests for tipping point detection and timeline analysis)

#### 6. Unit Testing & Verification Gates
1. Run debrief tests: `npx vitest run tests/debrief.test.ts` (Validates accurate root-cause isolation across test scenarios).
2. Test APOD fallback: Disconnect network in browser dev tools; debrief must cleanly render `apod_fallback.json` with `[OFFLINE ARCHIVE]` pill indicator.
3. Build check: `npm run build` succeeds without warnings.
```

---

### Prompt 5: Base Upgrade Hub (Outpost Facilities, Economy Balance & Superpowers)

```markdown
### AGENT EXECUTION PROMPT: SPRINT 5 — OUTPOST BASE UPGRADE HUB & RESOURCE ECONOMY

#### 1. Mission Brief & Context
Build the Base Upgrade Hub (Tab 3: Resources). Drawing inspiration from tactical base builders (Clash of Clans) adapted for space science, cadets spend Stardust Minerals harvested in Quick Run and Tech Credits earned in Outpost Missions to upgrade 5 modular facilities: Outpost Central Hub, Solar Power Farm, ECLSS Water Recycler, Hydroponics Greenhouse, and Radiation Shield Dome.

#### 2. Authoritative Input Documents
- `docs/01_PRD.md` (Base Upgrade Progression & Economy Loop)
- `docs/02_SRS.md` (5-Tier Facility Upgrade Matrix & Buff Calculations)
- `docs/04_DDS_UIUX_3D.md` (Outpost Isometric Overview & Blueprint Poster Fallback)
- `docs/05_DATABASE_SCHEMA.md` (`crewready_v1_base` schema and mutation rules)

#### 3. Strict Architectural Rules & Invariants
- Dual-Currency Economy: Facility upgrades require both Stardust Minerals (kinetic arcade skill) and Tech Credits (scientific mission problem-solving).
- Cross-Module Buffs:
  - Solar Farm level boosts starting mission battery reserves (+10 kW per tier).
  - ECLSS Recycler reduces mission water consumption by 5% per tier (up to 98% ISS benchmark).
  - Level 2 Radiation Shield Dome unlocks the Deflector Shield superpower inside the 3D Quick Run runner.
- Blueprint Poster Fallback: High-contrast 2D SVG schematic (`OutpostBlueprint2DPoster.tsx`) provided for instantaneous rendering on all screens.
- Persistence: All facility tiers and balances serialize to `crewready_v1_base` with defensive try/catch.

#### 4. Facility Schemas & Upgrade Matrix
- Facilities:
  1. `central_hub`: Outpost command center; gates max level of other facilities.
  2. `solar_farm`: Photovoltaic array utilizing NASA POWER solar irradiance data.
  3. `water_recycler`: Urine processing and catalytic distillation unit.
  4. `greenhouse`: Veggie/plant growth chamber sustaining food and crew morale.
  5. `shield_dome`: Water-jacketed regolith magnetic deflection dome.
- `src/types/base.ts`:
  ```typescript
  export interface FacilityConfig {
    id: string;
    nameKey: string;
    tier: number; // 1 to 5
    maxTier: number;
    stardustCost: number;
    techCreditCost: number;
    buffDescriptionKey: string;
    unlockedSuperpower?: string;
  }
  ```

#### 5. Concrete Files to Generate
- `src/data/baseUpgrades.json` (5-tier upgrade costs, requirements, and quantitative buff modifiers)
- `src/engine/baseEconomy.ts` (Pure transaction validator, balance debiting, and buff calculation engine)
- `src/components/base/OutpostIsometricView.tsx` (Interactive visual base map with status indicators)
- `src/components/base/FacilityCard.tsx` (Card detailing tier, upgrade cost, science rationale, and upgrade button)
- `src/components/base/CostBenefitModal.tsx` (Modal previewing exact resource returns per Sol before purchase)
- `src/components/base/OutpostBlueprint2DPoster.tsx` (Technical 2D blueprint architectural schematic)
- `src/views/BaseUpgradeView.tsx` (Tab 3 root view integrating wallet balances and facility grids)
- `tests/baseEconomy.test.ts` (Unit tests verifying cost deductions, prerequisites, and buff triggers)

#### 6. Unit Testing & Verification Gates
1. Run economy tests: `npx vitest run tests/baseEconomy.test.ts` (Asserts transactions fail if balance insufficient; verifies Level 2 Shield Dome triggers Quick Run shield flag).
2. Persistence check: Reload page; verify upgraded facility tiers survive browser restart.
3. Build check: `npm run build` succeeds cleanly.
```

---

### Prompt 6: Training Deck (Cognitive Drills, Docking Sim, NASA Images & ECLSS Quizzes)

```markdown
### AGENT EXECUTION PROMPT: SPRINT 6 — TRAINING DECK & COGNITIVE ASTRONAUT PREP

#### 1. Mission Brief & Context
Build the Training Deck (Tab 4: Training). Prepare cadets for extraterrestrial flight through four STEM training modules: (1) Cognitive Pattern Reflex Memory, (2) Orion Spacecraft 3D/2D Docking Alignment Simulator, (3) NASA Image Library Astronaut EVA Spacewalk Explorer, and (4) ECLSS Science Balancer Quizzes backed by authentic NASA NTRS technical reports.

#### 2. Authoritative Input Documents
- `docs/01_PRD.md` (Astronaut Training Pedagogy & Readiness Multipliers)
- `docs/02_SRS.md` (Cognitive Games, Docking Reticle, and NTRS Citations)
- `docs/04_DDS_UIUX_3D.md` (Docking Reticle Canvas & Pitch/Yaw/Roll HUD)
- `docs/06_SCIENCE_AND_NASA_DATA.md` (NASA Image API & NTRS Technical Report References)

#### 3. Strict Architectural Rules & Invariants
- Readiness Multiplier: Completing training drills awards a temporary score multiplier (e.g., $1.2\times$) applied to subsequent Quick Runs and Mission scores.
- Zero API Key Required for NASA Images: Use `images-api.nasa.gov/search?q=astronaut+training&media_type=image` with instant fallback to `public/assets/data/nasa_images_fallback.json`.
- Authentic Science Citations: Every ECLSS quiz question must provide a clickable link to official NASA NTRS technical papers (e.g., NASA/TP-2015-218211) and copyable BibTeX references.
- Docking Alignment Sim: Interactive 3-axis reticle (pitch, yaw, roll) where cadets fire thruster RCS pulses to align within $\pm 2.0^{\circ}$ docking tolerance.

#### 4. Schemas & Data Structures
- `src/types/training.ts`:
  ```typescript
  export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    scientificExplanation: string;
    ntrsCitation: {
      reportNumber: string;
      title: string;
      url: string;
      bibtex: string;
    };
  }
  export interface DockingState {
    pitch: number; // degrees
    yaw: number;
    roll: number;
    distance: number; // meters
    inTolerance: boolean;
  }
  ```

#### 5. Concrete Files to Generate
- `src/components/training/PatternReflexGame.tsx` (Cognitive Simon-Says memory sequence game)
- `src/components/training/DockingSimCanvas.tsx` (Interactive 3-axis target reticle with thruster controls)
- `src/components/training/NasaPhotoGallery.tsx` (NASA Image Library explorer with modal preview)
- `src/components/training/ScienceQuizModule.tsx` (Socratic science quiz with instant feedback and NTRS links)
- `src/components/training/ScienceProvenanceDrawer.tsx` (Slide-out drawer displaying NTRS papers and BibTeX citations)
- `src/data/scienceQuizzes.json` (Curated questions covering ECLSS, orbital mechanics, and radiation)
- `public/assets/data/nasa_images_fallback.json` (Pre-bundled authentic NASA training photos)
- `src/views/TrainingView.tsx` (Tab 4 container presenting the training suite and readiness status)
- `tests/training.test.ts` (Unit tests for memory sequence validation, docking math, and quiz scoring)

#### 6. Unit Testing & Verification Gates
1. Run training tests: `npx vitest run tests/training.test.ts` (Verifies docking tolerance boundaries and quiz scoring calculations).
2. Offline test: Disconnect network; verify NASA photo gallery immediately loads pre-bundled offline photos.
3. Build check: `npm run build` succeeds with zero errors.
```

---

### Prompt 7: Audio Manager, UI Polish, Offline Verification & Build Audit

```markdown
### AGENT EXECUTION PROMPT: SPRINT 7 — AUDIO ENGINE, FINAL POLISH & BUILD AUDIT

#### 1. Mission Brief & Context
Finalize the production release of "CrewReady: Beyond Us". Implement a zero-autoplay Web Audio API sound manager, complete high-contrast UI polish per `/ui-ux-pro-max`, perform end-to-end offline and COPPA verification, and execute a comprehensive build audit ready for live judging.

#### 2. Authoritative Input Documents
- `AGENTS.md` (Operating Guardrails, Invariants & Submission Rules)
- `docs/03_TRD.md` (Web Audio API, Performance Budgets, Bundle Limits)
- `docs/04_DDS_UIUX_3D.md` (High-Contrast Theme, WCAG AAA, Typography, Lucide Icons)
- `docs/11_SUBMISSION_CHECKLIST.md` (NASA Challenge Gates, Disclaimers, and Video Proofing)

#### 3. Strict Architectural Rules & Invariants
- Zero Autoplay Sound Policy: Audio must never play without explicit user interaction. Global mute toggle is persistently visible in the top header.
- Synthesized Web Audio + Audio Elements: Provide synthetic Web Audio oscillator fallbacks for clicks, thrusters, and sirens so audio works even if audio files fail to load.
- Strict COPPA Compliance: Zero login forms, zero email collection, zero external tracking cookies. Cadet identity is stored locally as an anonymous pseudonym (e.g., "Cadet Solar Falcon").
- Mandatory Scientific Badges:
  - Display `[NASA LIVE]` for real-time telemetry feeds.
  - Display `[OFFLINE ARCHIVE]` for pre-bundled fallback fixtures.
  - Display `[GAME-MODEL ESTIMATE]` on all derived mathematical models.
- Production Performance Target: Total gzipped bundle $< 5\text{ MB}$, initial paint $< 1.2\text{s}$, solid 60 FPS.

#### 4. Audio Engine Architecture
- `src/services/soundManager.ts`:
  ```typescript
  export class SoundManager {
    private ctx: AudioContext | null = null;
    private muted: boolean = false;
    playClick(): void;
    playThruster(): void;
    playAlarm(): void;
    playSuccess(): void;
    setMuted(muted: boolean): void;
    isMuted(): boolean;
  }
  ```

#### 5. Concrete Files to Generate
- `src/services/soundManager.ts` (Web Audio API synthesis with sound asset fallback)
- `src/components/common/SoundToggle.tsx` (Header mute/unmute button with volume icon)
- `src/components/common/DisclaimerBadge.tsx` (Standardized `[GAME-MODEL ESTIMATE]` / `[NASA LIVE]` pills)
- `src/views/ProfileView.tsx` (Tab 5: Cadet rank card, callsign customizer, language switcher, NASA API key input)
- `src/components/profile/ApiKeyModal.tsx` (Modal to test and save personal NASA API keys)
- `tests/soundManager.test.ts`, `tests/e2eFlow.test.ts` (Integration tests for full cadet journey)

#### 6. Final Build Audit & Acceptance Gates
1. Run all test suites: `npx vitest run` (100% pass across all sprint tests).
2. Execute production build: `npm run build` (Must generate cleanly with zero warnings).
3. Test production preview: `npm run preview` on `http://localhost:4173/`.
4. Offline verification test: In browser DevTools Network tab, select "Offline" and refresh. The application must load instantly, allow full gameplay across Quick Run and Missions, and display `[OFFLINE ARCHIVE]` badges without runtime errors.
5. Lighthouse Audit: Run Chrome DevTools Lighthouse audit verifying $\ge 90$ across Performance, Accessibility, and Best Practices.
```

---

## 2. Sprint Traceability Matrix

| Sprint | Focus Area | Key Architectural Deliverable | Primary Test File | Invariant Enforced |
|---|---|---|---|---|
| **Sprint 1** | Scaffolding & Data | PWA, Zustand stores, i18n, NASA Gateway | `tests/storage.test.ts`, `tests/nasaApi.test.ts` | Zero Backend Failure |
| **Sprint 2** | Kinetic 3D Runner | 3-Lane runner, debris collision, 2D fallback | `tests/runnerPhysics.test.ts` | 60 FPS Mobile Budget |
| **Sprint 3** | Mission Engine | 6-Resource coupled ledger, Missions 0–2 | `tests/scienceEngine.test.ts` | Coupled Ledger ($\ge 2$ mutations) |
| **Sprint 4** | Black Box Debrief | Forensic timeline, tipping-point card, APOD | `tests/debrief.test.ts` | Socratic Constructive Debrief |
| **Sprint 5** | Base Hub | Outpost facilities, dual economy, buffs | `tests/baseEconomy.test.ts` | Cross-Module Progression |
| **Sprint 6** | Training Deck | Cognitive games, docking sim, NTRS quiz | `tests/training.test.ts` | NASA Provenance & Citations |
| **Sprint 7** | Polish & Audit | Sound manager, COPPA audit, offline check | `tests/e2eFlow.test.ts` | WCAG AAA & Zero Autoplay |

---

## 3. Engineering Quality Gates & Verification Rules
1. **Never mock away hardware failures:** Every 3D canvas must have an actively mounted and styled 2D SVG/CSS fallback.
2. **Never swallow errors silently:** When live NASA API requests fail or time out (>2500ms), log a warning, switch source badge to `[OFFLINE ARCHIVE]`, and serve pre-bundled local data.
3. **No untested equations:** Any stoichiometric or solar calculation must have corresponding unit tests asserting mathematical fidelity against NASA technical reports.
4. **Child Safety by Default:** No user-submitted text ever leaves the local machine. All cadet data stays in `localStorage`.
