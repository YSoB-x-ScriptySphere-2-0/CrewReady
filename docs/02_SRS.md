> **Superseded in part by plan.md v7 (mentor pivot).** The game is now one Earth-to-Mars mission with six levels and four meters; base building, training deck, Moon mission, 3D runner and PWA are cut. Where this file disagrees with `plan.md`, `docs/00`, `docs/06` or `docs/08`, those win. Kept for reference only.

# Software Requirements Specification (SRS)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-02-SRS-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md -> docs/02_SRS.md
Classification: Flight Software Technical Specification
Target Environment: Static Progressive Web App (PWA) / Modern Web Standards
Companion Avatar Identifier: Twinkle (Autonomous Scout Drone and Mentor)

---

## 1. System Overview and Architectural Boundaries

### 1.1 Scope and System Boundary
CrewReady: Beyond Us executes entirely client-side as an offline-first Progressive Web App (PWA). The system boundary encompasses the browser runtime, the local storage persistence layer, the client-side NASA Open API Gateway service, and the local CacheStorage service worker. Zero external database servers, zero cloud functions, and zero proprietary backend servers exist within the architecture.

```
+---------------------------------------------------------------------------------------------------+
|                                  BROWSER EXECUTION ENVIRONMENT                                    |
|                                                                                                   |
|  +------------------------+      +---------------------------+      +--------------------------+  |
|  |   View Presentation    | <--> |   Zustand Store Slices    | <--> | Deterministic Engine     |  |
|  |   React 18 + Tailwind  |      |   Authoritative State Hub |      | Pure Functions (src/)    |  |
|  +------------------------+      +---------------------------+      +--------------------------+  |
|              ^                                 ^                                                  |
|              |                                 |                                                  |
|              v                                 v                                                  |
|  +------------------------+      +---------------------------+      +--------------------------+  |
|  |   Three.js 3D Runner   |      |   LocalStorage Layer      | <--> | Resilient NASA API       |  |
|  |   WebGL 60 FPS Loop    |      |   crewready_v1_* (JSON)   |      | Gateway (DEMO_KEY / User)|  |
|  +------------------------+      +---------------------------+      +--------------------------+  |
|                                                                                  |                |
|  +-----------------------------------------------------------------------------+ | (Fallback)     |
|  |   Service Worker Cache Boundary: Pre-bundled Assets & JSON Fixtures         |<+                |
|  |   (public/assets/data/ - apod, epic, nasa_images, mcs_dust)                 |                  |
|  +-----------------------------------------------------------------------------+                  |
+---------------------------------------------------------------------------------------------------+
```

### 1.2 The Deterministic Rules Engine Invariant
All state mutations follow the pure function signature:
(State, Action) => (NewState, LedgerLog)
Components render state and dispatch user intents. Components never calculate physical life-support formulas, orbital mechanics, or consequence outcomes directly.

---

## 2. System Functional Requirements (FR-01 to FR-30)

### 2.1 Quick Run 3D Runner Mechanics (FR-01 to FR-06)

#### FR-01: 3-Lane Lateral Kinematics
- Given the spacecraft is active in the Quick Run flight corridor,
- When the player presses ArrowLeft / KeyA, or swipes left (>30px displacement),
- Then the spacecraft transitions from its current lane to the adjacent left lane over exactly 120ms using cubic bezier smoothing, clamping at x = -2.5 meters.

#### FR-02: Kinetic Collision Bounding Boxes
- Given active hazards (debris, radiation belts) moving along the longitudinal Z-axis,
- When the spacecraft bounding box (width 1.2m, height 0.8m, depth 2.4m) intersects a hazard box,
- Then the collision handler registers an impact, deducting 25% hull integrity unless an active deflector shield is engaged.

#### FR-03: Procedural Longitudinal Velocity Scaling
- Given a flight run initiated at baseline velocity v_0 = 12.0 m/s,
- When the elapsed flight distance increments,
- Then velocity scales according to v(d) = min(28.0, 12.0 + (d / 100) * 0.45) m/s, updating position every frame delta.

#### FR-04: Stardust Mineral Harvesting and Collision Ingestion
- Given stardust mineral nodes placed along the 3-lane trajectory,
- When the spacecraft bounding perimeter intersects a mineral node,
- Then stardust count increments by the node value (10 to 50 mg), the node is flagged invisible in the object pool, and an audio synthesized chime triggers.

#### FR-05: Kinetic Deflector Shield Activation
- Given the cadet possesses an active shield charge and presses Spacebar or double-taps the display,
- When the shield triggers,
- Then the spacecraft enters invulnerable state for 6.0 seconds (plus 2.0s per Base Shield Dome upgrade tier), deflecting all debris impacts without hull damage.

#### FR-06: Electromagnetic Mineral Attractor Field
- Given the player activates the magnetic attractor superpower,
- When active,
- Then all stardust nodes within a forward cone of 15.0 meters across all 3 lanes translate toward the spacecraft position at 35.0 m/s until ingested.

---

### 2.2 Deterministic Mission Engine and Coupled 6-Resource Ledger (FR-07 to FR-15)

#### FR-07: Authoritative 6-Variable Coupled Resource Ledger
- Given an active outpost mission with ledger [Power, Oxygen, Water, Food, Shielding, CrewTime],
- When a cadet commits any decision option,
- Then the engine mutates at least 2 ledger variables with explicit signed deltas and an attached scientific reason string.

#### FR-08: Photovoltaic Dust Deposition Calculation
- Given Mars Mission 2 during an active dust storm event with optical depth tau,
- When the daily solar cycle resolves,
- Then power generation scales according to P_gen = P_nominal * exp(-0.75 * tau), displaying the [GAME-MODEL ESTIMATE] badge.

#### FR-09: Sabatier Reactor Mass and Energy Balance
- Given the cadet activates the Sabatier closed-loop recovery reactor,
- When the action executes,
- Then Oxygen increases by +15% and Water increases by +25 L, while Power decreases by -22 kW and Crew Maintenance Time decreases by -2.5 hours.

#### FR-10: Subsurface Water-Ice Drill Operations
- Given Lunar Mission 1 at Shackleton Crater permanently shadowed regions,
- When thermal melting drills are engaged,
- Then Water reserves increase by +60 L, but habitat Battery Power decreases by -35 kW and thermal radiators lose 10% thermal margin.

#### FR-11: Outpost Life Support Critical Abort Triggers
- Given an ongoing outpost operational Sol,
- When any core consumable [Power, Oxygen, Water, Food] reaches exactly 0.0,
- Then the mission state transitions to ABORTED within the same execution frame, locking user inputs and routing to the Black Box debrief.

#### FR-12: Bounded Butterfly Consequence Queuing
- Given a decision option containing a delayed consequence descriptor,
- When the cadet selects the option (e.g., deferring airlock gasket replacement),
- Then a butterfly flag is appended to missionSlice.activeFlags with triggerSol = currentSol + N (where 2 <= N <= 5).

#### FR-13: Butterfly Flag Event Manifestation
- Given an active simulation advancing to Sol S,
- When S matches triggerSol of a pending butterfly flag,
- Then the engine injects the secondary failure event (e.g., Airlock B depressurization), deducting resources and citing the historical root cause.

#### FR-14: Twinkle Socratic Predict-First Prompting
- Given a presented mission dilemma with multiple choice options,
- When the option modal mounts before selection,
- Then Twinkle presents a Socratic prompt (e.g., "Cadet, what happens to our oxygen synthesis if battery reserves drop below 15 kW?") with zero answer spoilers.

#### FR-15: Launch Payload Mass Limit Enforcement
- Given Mission 0 Earth Launch staging interface,
- When the cadet allocates subsystem cargo modules,
- Then the total wet mass M_total is verified against M_max = 45,000 kg; launch commit remains disabled while M_total > M_max.

---

### 2.3 Mission Black Box Forensic Debrief (FR-16 to FR-20)

#### FR-16: Chronological Forensic Decision Logging
- Given an active mission from Sol 1 to Sol N,
- When each decision executes,
- Then the Black Box recorder appends a immutable log entry capturing: {sol, promptId, choiceId, deltas, ledgerSnapshot, activeFlags}.

#### FR-17: Automated Tipping-Point Sol Classifier
- Given a mission terminating in critical abort,
- When the Black Box debrief initializes,
- Then the classifier traces backward along the ledger derivative vectors to identify the single Sol where resource depletion entered an irreversible dive.

#### FR-18: NASA Operational Benchmark Comparison
- Given the tipping-point decision identified in the debrief,
- When rendered in the Black Box interface,
- Then a comparative panel displays the cadet's choice alongside real NASA ISS/Artemis flight rules (e.g., maintaining 30-day consumable reserve margins).

#### FR-19: Simplified vs. Flight-Rule Scientific Disclosure
- Given any scientific metric rendered within the debrief or telemetry HUD,
- When derived from simplified educational equations,
- Then the UI displays the [GAME-MODEL ESTIMATE] badge with a modal detailing real NASA flight-rule baseline equations.

#### FR-20: One-Click Tipping-Point Replay Rewind
- Given the completion of a Black Box forensic review,
- When the cadet clicks "Reroute Telemetry",
- Then the simulation restores the exact ledger and flag snapshot of the tipping-point Sol, allowing branch exploration without restarting Sol 1.

---

### 2.4 Outpost Base Building and Progression (FR-21 to FR-25)

#### FR-21: Command Hub Leveling State Machine
- Given the Outpost Central Hub at Tier L (where L in {1, 2}),
- When the cadet provides required Stardust Minerals and Tech Credits and confirms upgrade,
- Then Hub level increments to L + 1, unlocking the ability to upgrade secondary facilities to Tier L + 1.

#### FR-22: Solar Photovoltaic Grid Tier Multipliers
- Given Solar Array upgrade from Tier L to L + 1,
- When applied,
- Then baseline mission starting power increases by +15 kW per tier, and Quick Run spacecraft lateral agility increases by 8%.

#### FR-23: ECLSS Water Recovery System (WRS) Closed-Loop Efficiency
- Given Water Recycler facility upgrades,
- When upgraded from Tier 1 to Tier 3,
- Then wastewater reclamation rate increases progressively from 70% to 85% to 98%, matching the current ISS ECLSS operational baseline.

#### FR-24: Hydroponic Crop Bay Growth Multiplier
- Given Hydroponic Greenhouse module leveling,
- When active,
- Then daily outpost food ration consumption burn rate is reduced by 12% per tier through fresh edible biomass supplementation.

#### FR-25: Electromagnetic Radiation Dome Deflector Integration
- Given Radiation Dome upgrades in the Base tab,
- When upgraded,
- Then passive outpost shielding degradation during solar particle events decreases by 20% per tier, and runner active shield duration extends by +2.0s per tier.

---

### 2.5 Training Deck and Localization Systems (FR-26 to FR-30)

#### FR-26: Orbital Docking Alignment Kinematics
- Given the Docking Alignment mini-game in the Training Deck,
- When the cadet adjusts pitch, yaw, and translation thrusters,
- Then alignment tolerance must fall within +/- 0.5 degrees and lateral offset < 0.05 meters before contact to award a docking clearance score.

#### FR-27: ECLSS Emergency Valve Memory Sequence
- Given the Valve Sequence Memory mini-game,
- When a randomized sequence of N valves illuminates across a 3x3 grid,
- Then the cadet must reproduce the exact sequence within N * 1.2 seconds to advance, scaling up to N = 7 steps.

#### FR-28: Mission Readiness Multiplier Calculation
- Given completion of cognitive training mini-games,
- When score S is recorded,
- Then a readiness multiplier M = 1.0 + (S / 1000) * 0.25 (capped at 1.25x) is applied to all scores and Tech Credit earnings in subsequent mission runs.

#### FR-29: Deterministic Bilingual Translation Resolution
- Given any user-facing text element across all views and dialogs,
- When rendered by the UI component tree,
- Then text resolves via the translation hook t(key), returning the corresponding English string if locale === 'en' or Bengali string if locale === 'bn'.

#### FR-30: Bengali (বাংলা) Unicode Glyph Rendering Integrity
- Given the active locale set to bn,
- When complex Bengali conjunct glyphs (যুক্তবর্ণ) render in the HUD,
- Then the layout engine must render verified Unicode blocks without character dropping, ligature fragmentation, or box-character fallbacks.

#### FR-31: NASA Open APIs Ingestion & Key Resolution Protocol
- Given an application view requiring live NASA telemetry (APOD reward in Black Box debrief, EPIC Earth in Mission 0, or astronaut EVA photography in Training Deck),
- When the API request dispatches,
- Then the client resolves the API key in priority order: (1) `localStorage.getItem('crewready_v1_nasa_api_key')`, (2) `import.meta.env.VITE_NASA_API_KEY`, (3) default fallback `DEMO_KEY`, attaching the resolved key to the request query parameters.

#### FR-32: Zero-Crash Fallback to Pre-Bundled JSON Fixtures
- Given any live NASA Open API request initiated by the client,
- When the request encounters network disconnection, timeout (>2.5 seconds), HTTP 429 rate limit, or HTTP 5xx server error,
- Then the client automatically aborts the fetch and resolves the corresponding pre-bundled JSON fixture from `public/assets/data/` (`apod_fixtures.json`, `epic_fixtures.json`, or `nasa_images_fixtures.json`), toggling the telemetry HUD indicator from `[NASA LIVE]` to `[OFFLINE ARCHIVE]` without throwing unhandled exceptions.

---

## 3. Non-Functional Requirements (NFRs)

### 3.1 Performance Budget
- Sustained Frame Rate: Locked 60 FPS on standard integrated mobile GPUs (Intel Iris Xe, ARM Mali-G57, Qualcomm Adreno 610).
- Frame Delta Tolerance: Frame drop rate shall not exceed 2.0% across any 3-minute Quick Run flight session.
- Initial Cold Load Time: Sub-2.0 seconds on standard 4G broadband connections; sub-300ms on subsequent visits via Service Worker cache.
- Bundle Footprint: Total compressed JavaScript/WASM bundle size shall not exceed 1.8 MB.

### 3.2 Security and Privacy Governance
- COPPA Compliance: Zero collection, storage, or transmission of personal identifiable information (PII).
- Storage Isolation: All persistent data resides exclusively in window.localStorage under the isolated namespace crewready_v1_*.
- Zero External Analytics: No external tracking scripts, advertising SDKs, or third-party telemetry beacons permitted.

### 3.3 Reliability and Offline Availability
- Zero Backend Failure Invariant: 100% of functional requirements must operate seamlessly without internet connectivity.
- Offline Cache Strategy: Cache-first service worker architecture serving pre-bundled HTML, CSS, JS, GLB models, and JSON fixtures.
- Crash Recovery: If local storage data becomes corrupted or unparseable, the system silently re-seeds default state without throwing unhandled exceptions.

### 3.4 Usability and Accessibility (WCAG 2.1 AA)
- Contrast Ratio: Minimum 4.5:1 contrast against dark background (#080B10) across all text labels, metrics, and interactive borders.
- Touch Target Dimensions: Every interactive button, selector, and modal trigger must measure at least 44x44 CSS pixels.
- Typography Scale: Base body text shall not fall below 16px; headings in Space Grotesk, numeric readouts in Inter with tabular digits (tnum).
- Multimodal Status Indication: No system state or resource warning may rely solely on color. Statuses must pair color with an SVG icon and clear text.

---

## 4. Interface Requirements and Display Protocols

### 4.1 Persistent Cadet HUD Interface
The top HUD bar remains mounted across all views, displaying:
1. Cadet Rank Badge: Visual rank icon with title label.
2. Stardust Reservoir: Real-time numeric balance with Lucide Sparkles vector icon.
3. Tech Credit Balance: Real-time numeric balance with Lucide Zap vector icon.
4. Audio Master Mute Toggle: Min 44x44px button cycling between audio active and muted.
5. Language Selector: High-contrast toggle switching between English and Bengali (বাংলা).

### 4.2 3D Canvas Fallback Architecture
Every 3D canvas (Twinkle drone, Quick Run spacecraft, Base isometric view) implements an automated hardware capability check:
- If WebGL 2.0 context is unavailable or frame rate drops below 30 FPS for >180 consecutive frames,
- The system gracefully unmounts the Three.js canvas and renders an accelerated 2D SVG/Canvas graphic poster maintaining full gameplay functionality.

---

## 5. Edge Cases and Resilience Engineering

### 5.1 Solar Generation Zero-Point During Dust Storms
- Condition: Mars global dust storm optical depth reaches extreme levels (tau >= 4.0), reducing photovoltaic output to 0.0 kW.
- Handling: Life support automatically switches to emergency fuel cell reserves. Twinkle issues a priority brownout alert, prompting immediate manual shutdown of non-essential subsystems to prevent fatal hypoxia.

### 5.2 Critical Hypoxia Depletion Loop
- Condition: Oxygen drops to exactly 0.0% while habitat power remains available.
- Handling: The deterministic rules engine halts the Sol simulation loop within the current frame delta, records HYPOXIA_CRITICAL as the terminal failure code, and transitions to the Black Box Debrief interface.

### 5.3 LocalStorage Quota Exceeded or Corruption
- Condition: Browser storage quota exceeded or JSON payload corrupted via external tamper.
- Handling: All JSON parsing is wrapped in try/catch blocks. Upon JSON.parse error, the state manager purges corrupted keys, restores default values from public/assets/data/missions.json, and logs a non-fatal warning.

### 5.4 Offline Network Disconnect Mid-Session
- Condition: Physical network connection severed during gameplay.
- Handling: Zero operational disruption. Service worker satisfies all asset requests locally. The PWA shell continues execution with zero network timeout dialogs.
