# MVP Scope, Build Sequence & Execution Plan (GSD-AGILE)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-08-MVP-SCOPE-AND-BUILD-SEQUENCE-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md -> docs/02_SRS.md -> docs/03_TRD.md -> docs/04_DDS_UIUX_3D.md -> docs/05_DATABASE_SCHEMA.md -> docs/06_SCIENCE_AND_NASA_DATA.md -> docs/07_ASSET_MANIFEST.md -> docs/08_MVP_SCOPE_AND_BUILD_SEQUENCE.md
Classification: Agile Program Management & Modular Release Roadmapping
Methodology: GSD (Get Stuff Done) & Superpowers Spec-Driven Execution
Guiding Principle: "Working Prototype First. Every Choice Costs Something. Zero Backend Failure."

---

## 1. Scope Freeze & MoSCoW Classification Matrix

To guarantee a defect-free, fully playable client-side experience for live judging, all features are frozen into strict MoSCoW categories. Any proposed addition outside the Must-Have boundary is deferred to post-hackathon tiers.

| Category | Feature / Subsystem | Architectural Scope | Verification Gate |
|---|---|---|---|
| **MUST-HAVE (P0)** | **Navigation Shell & Bottom Dock** | 5-tab responsive HUD, status bar, volume & EN/বাংলা toggles | Touch targets $\ge 44\text{px}$, WCAG AAA |
| **MUST-HAVE (P0)** | **Deterministic 6-Resource Ledger** | Power, O2, H2O, Food, Shielding, Crew Time math engine | $\ge 2$ resource coupling invariant verified |
| **MUST-HAVE (P0)** | **Core Mission 0, 1 & 2 Storylines**| Earth Staging, Lunar Shackleton, Mars Jezero dust crisis | Socratic choices mutate ledger predictably |
| **MUST-HAVE (P0)** | **Mission Black Box Debrief** | Forensic timeline scrubber, tipping-point card, NASA APOD | Replays exact Sol cascade with APOD reward |
| **MUST-HAVE (P0)** | **3D Quick Run Arcade Runner** | Three.js 3-lane flight, Kessler debris, Stardust pickups | Solid 60 FPS mobile loop + 2D fallback |
| **MUST-HAVE (P0)** | **Resilient NASA API Gateway** | APOD, EPIC & NASA Images with silent offline fallback | Zero crash on 403 or offline disconnection |
| **MUST-HAVE (P0)** | **Offline-First Local Storage** | `crewready_v1_*` state persistence with try/catch | Survives browser refresh & `OFFLINE=1` |
| **SHOULD-HAVE (P1)**| **Outpost Base Upgrade Canvas** | 5 core installations (Hub, Solar, ECLSS, Veggie, Shield) | Stardust & Tech Credit economy balance |
| **SHOULD-HAVE (P1)**| **Training Deck Cognitive Drills** | Pattern Reflex, ECLSS Balancer & NASA EVA Photo Cards | Bonus score multiplier wired to runs |
| **SHOULD-HAVE (P1)**| **Web Audio Sound FX Engine** | Ambient cabin hum, UI clicks, Artemis liftoff, alarms | Zero autoplay, global mute respected |
| **SHOULD-HAVE (P1)**| **Science Provenance Drawer** | NTRS technical citations & in-app BibTeX copies | Direct clickable links to official NASA data |
| **COULD-HAVE (P2)** | **3D Docking Alignment Sim** | Orion to Lunar Gateway 3-axis reticle simulator | Procedural pitch/yaw/roll thruster impulse |
| **COULD-HAVE (P2)** | **Custom NASA API Key Input** | Profile settings key manager with key validator | Instant switch from `DEMO_KEY` to user key |
| **WON'T-HAVE (P3)** | **Multiplayer Co-Op Bridge** | 4-cadet room codes, real-time shared voting | Locked with `[Coming in Mission Tier 2]` badge |
| **WON'T-HAVE (P3)** | **Webcam Pose Workout** | TensorFlow.js Zero-G astronaut motion tracking | Locked with `[Coming in Mission Tier 2]` badge |
| **WON'T-HAVE (P3)** | **NASA Science Micro-Reels**| Vertical streaming short video player | Locked with `[Coming in Mission Tier 2]` badge |

### 1.1 Non-Negotiable Core Invariants
1. **The Coupling Invariant:** Every mission dilemma choice must mutate at least $\ge 2$ resources in the ledger or trigger a bounded butterfly flag with an explicit physical reason string.
2. **Zero Backend Failure:** Zero external Node, Python, or database servers required. Static client PWA executes offline.
3. **Twinkle Voice Integrity:** The scout drone guide is strictly designated **Twinkle** and uses predict-first Socratic pedagogical phrasing.
4. **Child Safety (COPPA):** Zero minor faces or voices, zero biometric inputs, zero tracking cookies. Pseudonyms only.
5. **NASA Data Transparency:** Display `[NASA LIVE]` for real-time telemetry, `[OFFLINE ARCHIVE]` for fixtures, and `[GAME-MODEL ESTIMATE]` for derived equations.
6. **Bilingual Parity:** All user-facing strings must support English and Bengali (বাংলা) with automatic container expansion.

### 1.2 Screen-to-Component Architectural Traceability
Every primary user interface screen maps directly to designated React components and typed state slices:

| Screen Identifier | Primary Presentation Component | Authoritative State Slice | Associated Fallback Component |
|---|---|---|---|
| **Tab 1: Home Screen** | `src/views/HomeView.tsx` | `runSlice.ts`, `settingsSlice.ts` | `Twinkle2DPoster.tsx` |
| **Tab 1: Quick Run** | `src/views/RunnerView.tsx` | `runSlice.ts` | `SpacecraftRunner2DPoster.tsx` |
| **Tab 2: Mission Control** | `src/views/MissionsView.tsx` | `missionSlice.ts` | Static JSON Mission View |
| **Tab 2: Black Box Debrief**| `src/components/debrief/DebriefModal.tsx` | `missionSlice.ts` | Offline APOD Card |
| **Tab 3: Base Resources** | `src/views/BaseUpgradeView.tsx` | `baseUpgradeSlice.ts` | `OutpostBlueprint2DPoster.tsx` |
| **Tab 4: Training Deck** | `src/views/TrainingView.tsx` | `trainingSlice.ts` | 2D Reticle Reflex Drill |
| **Tab 5: Profile & Settings**| `src/views/ProfileView.tsx` | `profileSlice.ts`, `settingsSlice.ts` | Standard HTML Form |

### 1.3 Tab Navigation Route & State Specifications
The client-side single page architecture routes views through a persistent tab state enum:

| Tab Index | Route Identifier | Key UI Action | Primary State Mutation | Cache Strategy |
|---|---|---|---|---|
| **0** | `tab_quickrun` | Launch 3D flight runner | Increments Stardust currency | Three.js scene cached in memory |
| **1** | `tab_missions` | Execute Sol dilemma trade-off | Mutates $\ge 2$ ledger resources | Persisted in `crewready_v1_missions` |
| **2** | `tab_resources` | Upgrade outpost facilities | Debits Stardust & Tech Credits | Persisted in `crewready_v1_base` |
| **3** | `tab_training` | Complete cognitive mini-games | Sets temporary readiness multiplier | Transient memory state |
| **4** | `tab_profile` | Manage settings & pseudonyms | Updates audio, language, and API key | Persisted in `crewready_v1_settings` |

### 1.3 Technical Risk Management & Mitigation Matrix
- **Risk 1: Mobile WebGL Crash / Out of Memory:** Capping DPR to `1.5`, Draco geometry compression, immediate geometry/material disposal on unmount, and automatic 2D CSS/SVG poster fallbacks.
- **Risk 2: NASA API 403 Rate Limit on Demo Day:** Resilient Gateway with immediate 4-second timeout, silent fallback to local JSON fixtures (`public/assets/data/`), and visual pill indicator update to `[OFFLINE ARCHIVE]`.
- **Risk 3: LocalStorage Quota Exceeded:** Total client payload capped under 200 KB; automatic defensive try/catch wrapping around all storage reads and writes.

---

## 2. Agile Sprint Breakdown & Technical Build Sequence

The development lifecycle executes in 7 self-contained, modular sprints. Each sprint yields an independently verifiable build deployable as a static client-side PWA.

```
+-------------------------------------------------------------------------------------------------------+
| MODULAR BUILD SEQUENCE:                                                                               |
| Sprint 1: Foundation ──> Sprint 2: Runner ──> Sprint 3: Ledger ──> Sprint 4: Debrief ──>             |
| Sprint 5: Base Hub   ──> Sprint 6: Training Deck ──> Sprint 7: Polish & Submission Video Packaging   |
+-------------------------------------------------------------------------------------------------------+
```

### 2.1 Sprint 1: Foundation, PWA Scaffolding & Resilient Gateway
- **Objective:** Establish the production static environment, layout shell, typed state hub, and offline-first data layer.
- **User Story:** *As a young cadet, I want the mission interface to launch instantly with bilingual support and high-contrast aerospace HUD, so I can start training immediately.*
- **Estimated Effort:** 8 Story Points (SP).
- **Subtasks & Scope:**
  - 1.1: Initialize Vite + React 18 + TypeScript strict mode + Tailwind CSS.
  - 1.2: Configure PWA manifest (`public/manifest.json`), service worker, and CacheStorage offline boundaries.
  - 1.3: Build typed Zustand store slices: `runSlice.ts`, `missionSlice.ts`, `settingsSlice.ts`.
  - 1.4: Implement safe storage wrapper (`src/services/storage.ts`) with schema version checking and automatic reset.
  - 1.5: Build bilingual localization provider (`src/services/i18n.ts`) supporting English and Bengali (`strings.json`).
  - 1.6: Build NASA API gateway (`src/services/nasaApi.ts`) with AbortController, DEMO_KEY, and offline fixtures.
- **Definition of Done (DoD):**
  - Application compiles with `npm run build` with zero TypeScript warnings in strict mode.
  - Top header and 5-tab navigation bar render with 44px+ touch targets and Lucide SVG icons.
  - Language switcher toggles UI text between English and Bengali without page reload.
  - Unit tests verify storage wrapper recovers from corrupted `localStorage` data.
- **Verification Command:** `npm run build && npx vitest run tests/storage.test.ts`

### 2.2 Sprint 2: 3D Quick Run Spacecraft Runner
- **Objective:** Deliver the tactile, kinetic hook that grabs Gen Alpha cadets within the first 10 seconds of gameplay.
- **User Story:** *As an energetic student, I want to pilot my spacecraft through orbital hazards and harvest stardust minerals, so I can power up my space outpost.*
- **Estimated Effort:** 13 Story Points (SP).
- **Subtasks & Scope:**
  - 2.1: Mount Three.js / React Three Fiber Canvas with DPR capped at `1.5` and `ACESFilmic` tone mapping.
  - 2.2: Implement 3-lane lateral motion kinematics with keyboard arrows (`← / →`), touch swipes, and HUD buttons.
  - 2.3: Build obstacle procedural generation: Kessler space debris, solar radiation rings, and micrometeoroids.
  - 2.4: Implement collectible harvest system: Stardust minerals (`+10`) and auxiliary energy cells (`+20% speed`).
  - 2.5: Design arcade HUD overlay: Speedometer circular arc, hazard warning banners, active superpower radial timers.
  - 2.6: Implement 2D CSS/SVG vector fallback (`SpacecraftRunner2DPoster.tsx`) for low-power or WebGL-disabled devices.
- **Definition of Done (DoD):**
  - Solid 60 FPS verified on mobile Chrome/Safari with zero memory leaks over 5-minute continuous run.
  - Collision detection correctly deducts craft shields; harvesting Stardust crystals increments store balance.
  - Automatic fallback renders `SpacecraftRunner2DPoster` if WebGL context is lost.
- **Verification Command:** `npx vitest run tests/runnerPhysics.test.ts`

### 2.3 Sprint 3: Deterministic Outpost Mission Engine & Coupled Ledger
- **Objective:** Implement the core educational challenge: coupled systems engineering across Earth, Moon, and Mars.
- **User Story:** *As a junior flight commander, I want to solve realistic life-support dilemmas where every decision balances power against oxygen, so I learn real aerospace trade-offs.*
- **Estimated Effort:** 13 Story Points (SP).
- **Subtasks & Scope:**
  - 3.1: Implement pure deterministic physics engine (`src/engine/science.ts`, `src/engine/eclss.ts`).
  - 3.2: Build 6-Resource Ledger HUD: Power (kW), Oxygen (%), Water (L), Food (kg), Shielding (%), Crew Time (hrs).
  - 3.3: Implement Socratic Dilemma cards for Mission 0 (Earth), Mission 1 (Lunar Shackleton), and Mission 2 (Mars Jezero).
  - 3.4: Enforce Coupling Invariant: validator asserts every choice mutates $\ge 2$ resources with human-readable rationale.
  - 3.5: Build Twinkle Socratic dialogue bubble with predict-first scaffolding.
  - 3.6: Implement bounded butterfly effect triggers (e.g., Sol 11 deferred maintenance causing Sol 14 power crisis).
- **Definition of Done (DoD):**
  - 100% of unit tests pass in `tests/scienceEngine.test.ts`.
  - Every decision mutates $\ge 2$ ledger resources simultaneously and visibly in the UI.
  - Missions 0, 1, and 2 are fully playable from launch to resolution.
- **Verification Command:** `npx vitest run tests/scienceEngine.test.ts`

### 2.4 Sprint 4: Mission Black Box Debrief & Forensic Replay
- **Objective:** Transform mission failure and success into constructive aerospace forensic education.
- **User Story:** *As an aspiring engineer who just experienced system failure, I want to review what happened step-by-step and see how NASA engineers solve it, so I can improve my mission strategy.*
- **Estimated Effort:** 8 Story Points (SP).
- **Subtasks & Scope:**
  - 4.1: Build horizontal Sol timeline scrubber allowing backwards stepping through cadet decisions.
  - 4.2: Build Pivotal Tipping-Point Decision card highlighting root-cause subsystem entropy.
  - 4.3: Implement NASA Real-World Engineering comparison card explaining authentic Artemis solutions.
  - 4.4: Integrate NASA APOD celebration card displaying daily astronomy image, credit, and science explanation.
  - 4.5: Add one-click "Replay Mission with Alternative Strategy" and "Save to Flight Records" buttons.
- **Definition of Done (DoD):**
  - Mission termination (survival or resource collapse) immediately opens the Black Box Debrief modal.
  - Timeline scrubber accurately isolates the pivotal cascading decision.
  - APOD card successfully renders live or offline image with full attribution.
  - Replay action cleanly resets ledger state while preserving earned cadet rank.
- **Verification Command:** `npx vitest run tests/debrief.test.ts`

### 2.5 Sprint 5: Outpost Base Building Hub (Outpost Resources)
- **Objective:** Connect the arcade economy (Stardust) and narrative economy (Tech Credits) into base progression.
- **User Story:** *As an outpost architect, I want to invest my harvested minerals into upgrading our solar arrays and water recycling, so our base can endure harsher extraterrestrial environments.*
- **Estimated Effort:** 8 Story Points (SP).
- **Subtasks & Scope:**
  - 5.1: Build isometric 2.5D outpost overview canvas with interactive facility placement slots.
  - 5.2: Implement 5 facility upgrade cards: Central Hub, Solar Farm, ECLSS Recycler, Greenhouse, Shield Dome.
  - 5.3: Program 5-Tier Upgrade Matrix mapping Stardust and Tech Credits to passive buffs and runner superpowers.
  - 5.4: Build real-time cost-benefit preview modal detailing resource returns per Sol.
  - 5.5: Create 2D Outpost Blueprint vector fallback poster.
- **Definition of Done (DoD):**
  - Spending harvested Stardust and Tech Credits successfully upgrades facility levels from 1 to 5.
  - Upgraded facilities increase starting power/water in subsequent mission runs.
  - Level 2 Shield Dome unlocks the kinetic Deflector Shield power-up inside the Quick Run runner.
- **Verification Command:** `npx vitest run tests/baseEconomy.test.ts`

### 2.6 Sprint 6: Training Deck & Web Audio Sound Engine
- **Objective:** Implement astronaut cognitive readiness prep and atmospheric audio soundscapes.
- **User Story:** *As a student astronaut, I want to train my docking precision and reflex memory while listening to real NASA liftoff audio, so I feel like a real flight cadet.*
- **Estimated Effort:** 8 Story Points (SP).
- **Subtasks & Scope:**
  - 6.1: Build Pattern Reflex cognitive memory sequence trainer.
  - 6.2: Implement ECLSS Atmospheric Balancer dual-slider drill (tuning O2/N2 partial pressures to 101.3 kPa).
  - 6.3: Build Orion spacecraft docking alignment simulation reticle with pitch, yaw, and roll controls.
  - 6.4: Integrate NASA Image Library gallery displaying authentic astronaut EVA spacewalk photos.
  - 6.5: Build Web Audio API Sound Manager controlling ambient drone, UI micro-clicks, and sirens with global mute.
  - 6.6: Implement in-app Science Provenance Drawer with official NASA NTRS citations and copyable BibTeX references.
- **Definition of Done (DoD):**
  - Completing mini-games awards a temporary readiness multiplier to subsequent runs.
  - Global audio mute toggle immediately halts all sound channels with zero latency.
  - Science Provenance Drawer displays clickable NTRS citations and copyable BibTeX references.
- **Verification Command:** `npx vitest run tests/training.test.ts`

### 2.7 Sprint 7: Final Polish, Verification & Submission Packaging
- **Objective:** Final hardening, accessibility verification, multi-device cross-browser testing, and video artifact preparation.
- **User Story:** *As a global challenge judge, I want to test the application on my mobile phone or laptop without installing anything, experiencing zero crashes or server dependency.*
- **Estimated Effort:** 5 Story Points (SP).
- **Subtasks & Scope:**
  - 7.1: Run Lighthouse PWA audit achieving $\ge 90$ in Performance, Accessibility, and Best Practices.
  - 7.2: Perform strict COPPA review: verify zero PII input fields, zero external tracking cookies, pseudonyms only.
  - 7.3: Conduct multi-browser verification: Chromium (Desktop/Android), Safari (macOS/iOS), Firefox.
  - 7.4: Execute offline test harness: verify zero UI stalls when toggling network to `Offline`.
  - 7.5: Stage, record, and package video demonstration artifacts.
  - 7.6: Generate final documentation index, architecture verification, and submission checklist.
  - 7.7: Verify all public model URLs, CC0 sound licenses, and NASA data provenance tags.
- **Definition of Done (DoD):**
  - Clean production build generates under 5 MB gzip.
  - Static preview loads and runs flawlessly on `http://localhost:4173/`.
  - All automated test suites (`vitest`) pass with 100% success rate.
  - GitHub Pages / Vercel static deployment pipeline passes with zero warnings.
- **Verification Command:** `npm run build && npm run preview`

---

## 3. Feature-to-Video Readiness Matrix

Demonstrations must be visually compelling, scientifically rigorous, and strictly compliant with youth safety rules (no recognizable minor faces or voices).

| Video Deliverable | Target Duration | Mandatory Visible Features | Staged Narrative Flow |
|---|---|---|---|
| **Video 1: The 30s Hook (Elevator Pitch)** | 30 seconds | • 3D Twinkle Drone hero introduction<br>• Instant Quick Run 3D flight & debris dodge<br>• Stardust mineral collection<br>• Giant GO launch action | "Gen Alpha cadets don't want boring tables; they want to fly, explore, and run real spacecraft." |
| **Video 2: The 2-Minute Technical Demo** | 120 seconds | • 6-Resource coupled ledger in action<br>• Sol 14 Mars dust dilemma decision<br>• Coupled trade-off preview ($\ge 2$ mutations)<br>• Constructive Black Box debrief replay<br>• NASA APOD daily astronomy reward | "Every choice spends something. Watch how saving battery power shuts down oxygen recovery." |
| **Video 3: The 3-Minute Complete Walkthrough** | 180 seconds | • Complete Mission 0, 1, and 2 story arcs<br>• Outpost Base upgrade progression<br>• Training Deck docking & cognitive games<br>• In-App Science Provenance Drawer<br>• English & Bengali (`বাংলা`) instant toggle<br>• Offline resilience demonstration | "From Kazi Nazrul's Shonkolpo to NASA Artemis, empowering the next generation to look beyond." |

### 3.1 Storyboard Timecodes for Video 1 (The 30s Elevator Hook)
- **0:00 – 0:08 (Launch Screen):** Camera pans down across 3D Twinkle Drone hovering in space. Twinkle greets cadet. Giant pulsating "GO!" button is pressed.
- **0:08 – 0:20 (Tactile Flight):** Spaceship accelerates into orbital flight. Cadet dodges Kessler space debris across 3 lanes, harvests glowing Stardust crystals.
- **0:20 – 0:30 (Systems Challenge):** Transition to Mission Control. Twinkle prompts: *"Cadet, solar storm inbound! How will you protect our base?"* Logo reveal: **CrewReady: Beyond Us**.

### 3.2 Storyboard Timecodes for Video 2 (Technical Demo)
- **0:00 – 0:20 (Hook & Telemetry):** Twinkle Drone welcomes cadet to Mission Control. Live DSCOVR EPIC Earth full-disc imagery is shown on Mission 0 staging.
- **0:20 – 0:50 (Coupled Ledger Law):** Cadet selects Mission 2 (Mars Jezero). Sol 14 global dust storm hits ($\tau = 1.85$). Cadet views dilemma options; UI explicitly highlights simultaneous mutations on Power, Oxygen, and Time.
- **0:50 – 1:20 (Constructive Failure):** Cadet prioritizes power diversion to habitat heating; life support oxygen falls to 0%. Habitat fails constructively.
- **1:20 – 1:45 (Black Box Forensic Scrubber):** Debrief opens. Timeline scrubber isolates the Sol 11 tipping point. NASA real-world Orion comparison card explains regenerative fuel cells.
- **1:45 – 2:00 (Reward & Provenance):** Daily NASA APOD image is unlocked. Provenance drawer is opened showing NTRS publication citation.

### 3.3 Storyboard Timecodes for Video 3 (Complete Walkthrough)
- **0:00 – 0:30 (Generational Philosophy):** Kazi Nazrul's *Shonkolpo* quote rendered in Bengali script. Introduction of Gen Z team empowering Gen Alpha explorers.
- **0:30 – 1:15 (The Full Mission Trilogy):** Rapid tour of Mission 0 (Earth Staging), Mission 1 (Lunar Shackleton ice mining), and Mission 2 (Mars Jezero storm survival).
- **1:15 – 1:45 (Outpost Base Economy):** Upgrading the Solar Farm and ECLSS Water Recycler using Stardust harvested from arcade flight runs.
- **1:45 – 2:15 (Training Deck Drills):** Docking alignment simulation with Lunar Gateway; astronaut checklist review using real NASA EVA photos.
- **2:15 – 2:45 (Bilingual & Child Safety):** One-tap switch to Bengali (`বাংলা`). Demonstration of zero-PII pseudonym cadet profile.
- **2:45 – 3:00 (NASA Open Data & Conclusion):** Science Provenance Drawer review. Closing slogan: *"Every choice spends something. Every system affects another. Every mission teaches why."*

---

## 4. Strict Fallback Cut-Lines: Engineering Contingency Protocol

If engineering velocity is compressed during delivery, features must be dropped strictly according to this prioritized schedule. Under no circumstance may the coupled 6-resource ledger or the Black Box debrief be simplified or removed.

| Degradation Level | Trigger Condition | Features Dropped / Simplified | Invariants Preserved |
|---|---|---|---|
| **CUT LEVEL 1** | T-48h: Minor sprint delay | • Defer 3D Docking Alignment simulation<br>• Defer custom NASA API key input in settings | Full 3D Runner, 3 Missions, Coupled Ledger, Black Box Debrief, Base Upgrades |
| **CUT LEVEL 2** | T-24h: Moderate sprint delay | • Replace 3D Outpost with 2.5D SVG Blueprint map<br>• Reduce Base Facility tiers from 5 to 3<br>• Condense Training Deck to 2 cognitive drills | 3D Quick Run, 3 Missions, Coupled Ledger, Black Box Debrief, APOD Reward |
| **CUT LEVEL 3** | T-12h: Severe emergency | • Replace Three.js Runner with 2D Canvas lateral runner<br>• Freeze storyline to Mission 1 & 2<br>• Lock Base Upgrades to 3 essential facilities | **ABSOLUTE CORE:** Coupled 6-Resource Ledger, Twinkle Guide, Black Box Debrief, NASA Citations |

### 4.1 Feature Flag Configuration for Contingency Degradation
Contingency levels are controlled via client-side feature flags in `src/config/features.ts`:
```typescript
export interface FeatureFlags {
  enable3dRunner: boolean;
  enable3dBaseCanvas: boolean;
  enableDockingSim: boolean;
  maxBaseTiers: 3 | 5;
  activeMissionsCount: 2 | 3;
}

export const getActiveFeatureFlags = (cutLevel: 0 | 1 | 2 | 3 = 0): FeatureFlags => {
  return {
    enable3dRunner: cutLevel < 3,
    enable3dBaseCanvas: cutLevel < 2,
    enableDockingSim: cutLevel < 1,
    maxBaseTiers: cutLevel >= 2 ? 3 : 5,
    activeMissionsCount: cutLevel >= 3 ? 2 : 3
  };
};
```

### 4.2 Zero-Backend Invariant Enforcement
At all cut levels, the application remains a pure static Progressive Web App (PWA). There are zero remote server endpoints, zero external database clusters, and zero cloud function dependencies. The application can never crash or fail during a live judge evaluation due to server downtime.

### 4.3 Judge Walkthrough Verification Checklist
1. **Network Disconnect Test:** Open DevTools, set network to `Offline`, reload page -> App must load completely and play without network errors.
2. **Coupling Rule Test:** Make any mission choice -> Verify at least two meters move simultaneously with written causal justification.
3. **Black Box Test:** Intentionally drain power to 0 kW -> Verify Black Box debrief opens with forensic Sol timeline and APOD reward.
4. **Bilingual Test:** Tap EN/বাংলা toggle -> Verify all text updates smoothly without layout disruption.
5. **Touch Target Test:** Verify all buttons exceed 44x44 CSS pixels on touch interfaces.
6. **Persistence Test:** Advance to Sol 5, refresh browser window -> Outpost state and Sol progress must restore identically from localStorage.
7. **Audio Safety Test:** Tap global mute toggle in top navigation -> Ambient drone and sound FX must immediately silence with zero bleed.

---

## 5. Continuous Integration & Static Deployment Specification

To guarantee zero regression during fast-paced hackathon iterations, the project enforces a GitHub Actions static validation workflow (`.github/workflows/deploy.yml`):

```yaml
name: Static PWA Build & Verification Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Runtime
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Strict TypeScript Compilation
        run: npx tsc --noEmit

      - name: Execute Deterministic Science Engine Unit Tests
        run: npm run test:unit

      - name: Production Static Build
        run: npm run build

      - name: Validate Asset Size Budget
        run: |
          MAX_SIZE=5242880 # 5 MB
          DIST_SIZE=$(du -sb dist | cut -f1)
          if [ $DIST_SIZE -gt $MAX_SIZE ]; then
            echo "ERROR: Production bundle exceeds 5 MB budget ($DIST_SIZE bytes)"
            exit 1
          fi

      - name: Deploy to GitHub Pages (Static Hosting)
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: crewready.spaceapps.org # Optional custom domain

### 5.1 Post-Build Lighthouse Performance Assertion
Automated headless Chrome runs verify that the static PWA complies with Gen Alpha device constraints:
- **First Contentful Paint (FCP):** $\le 1.2\text{ s}$ on simulated 4G mobile.
- **Largest Contentful Paint (LCP):** $\le 2.4\text{ s}$ on simulated mobile CPU.
- **Cumulative Layout Shift (CLS):** $0.00$ (zero sudden layout jumps).
- **Time to Interactive (TTI):** $\le 2.0\text{ s}$.

### 5.2 Local Development Verification Script
To verify the complete static build locally prior to git push:
```bash
# Clean install, lint, test, build, and static preview
npm ci
npm run lint
npx vitest run
npm run build
npm run preview -- --port 4173 --host
```
```
