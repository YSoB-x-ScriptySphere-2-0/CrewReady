> **Superseded in part by plan.md v7 (mentor pivot).** The game is now one Earth-to-Mars mission with six levels and four meters; base building, training deck, Moon mission, 3D runner and PWA are cut. Where this file disagrees with `plan.md`, `docs/00`, `docs/06` or `docs/08`, those win. Kept for reference only.

# Product Requirements Document (PRD)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-01-PRD-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md
Classification: Open Source Educational Space Systems Trainer
Target Release: Production Static PWA (Client-Side Only)
Companion Avatar Identifier: Twinkle (Autonomous Scout Drone and Cadre Mentor)

---

## 0. Mandatory Authoring and UI/UX Directives

### 0.1 Downstream Documentation Directive
All downstream technical, design, and data documents (docs/02_SRS.md through docs/10_VIDEO_30S_SCRIPT.md and subsequent code implementations) must adhere strictly to these principles:
- Zero Generic AI/LLM Text Patterns: Exclude conversational filler, hyperbolic adjectives, marketing mottoes, and cliché transition phrases (such as "delve", "tapestry", "testament", "game changer", "beacon", "foster", or "seamless integration").
- Zero Childish Emojis: Prohibit unicode emojis across all system documentation, telemetry displays, data fixtures, and HUD components. UI icons must exclusively use verified SVG vectors from the Lucide React library.
- Authentic Aerospace Aesthetic: All interfaces must reflect functional mission control hardware and modern aerospace flight software standards. The visual style must never resemble generic automated templates or novelty game clones.
- Guide Avatar Nomenclature: The flight guide avatar and companion scout drone is strictly designated Twinkle. The identifier Astra is deprecated and prohibited across all modules.

### 0.2 Design System Tokens per /ui-ux-pro-max
- Color Contrast: Minimum 4.5:1 contrast ratio against #080B10 background across all interactive states.
- Touch Target Budget: Minimum 44x44 CSS pixels for all buttons, toggles, and modal triggers.
- Typography Scale: Base font size 16px; headings in Space Grotesk, data readouts and body in Inter with tabular figures (tnum).
- No Color-Only State Encoding: Every status must combine an SVG icon, explicit text label, and numeric telemetry value.

---

## 1. Executive Summary and Problem Framing

### 1.1 The Official Challenge Context
NASA Space Apps Challenge 2026: Build a Junior Astronaut Mission Trainer. The challenge mandates an interactive application enabling students to operate a lunar or Martian outpost by balancing competing systems engineering demands including life support, radiation shielding, power generation, and food production.

### 1.2 The Core Problem: STEM Engagement Drop-Off (Ages 10-16)
Space science education exhibits a severe attrition rate among learners aged 10-16 caused by an unaddressed pedagogical divide:
1. Superficial Gamification: Casual clicker games and trivia apps model life-support consumables as isolated, uncoupled gauges. Restoring oxygen incurs zero electrical penalty, while radiation shielding damage has no thermal or structural consequences. Learners memorize detached facts without developing systems intuition.
2. Inaccessible Simulators: Professional aerospace simulation tools expose over 150 interdependent telemetry parameters within dense, tabular views. Young learners experience rapid cognitive exhaustion, resulting in high bounce rates within three minutes of access.

### 1.3 The Solution Architecture
CrewReady: Beyond Us bridges this divide through a dual-loop hybrid engine:
- Instant Kinetic Engagement: A Three.js 3D orbital spacecraft runner providing tactile kinetic feedback, reflex drills, and stardust mineral harvesting.
- Authoritative Systems Engineering: A 6-variable coupled resource ledger where every decision adheres to the mission architecture law:
  Delta Protection_A implies -Delta Resource_B
- Constructive Socratic Debriefing: A Mission Black Box debrief that transforms failure into forensic analysis, comparing cadet decision paths directly against verified NASA operational standards.

---

## 2. Target User Personas

### 2.1 Junior Cadet (Ages 10-12 | Middle School)
- Cognitive Profile: Highly receptive to spatial-kinetic feedback, fast visual iteration, and clear milestones; easily overwhelmed by unstructured numeric tables.
- Core Requirements: Intuitive 44px touch targets, instant cause-and-effect indicators, and supportive Socratic guidance from Twinkle that prompts predictive thinking rather than delivering answers.
- Primary User Journey: Quick Run 3D flight -> Mission 0 Earth Launch Staging -> Basic lunar base resource upgrades.

### 2.2 Advanced Cadet (Ages 13-16 | High School)
- Cognitive Profile: Analytical learner motivated by optimization, mathematical efficiency ratios, authentic scientific telemetry, and ranking progression.
- Core Requirements: Direct exposure to NASA environmental telemetry (Mars Climate Sounder optical depth profiles), rigorous coupled ledger trade-offs, forensic black box failure analysis, and closed-loop base management.
- Primary User Journey: Mission 1 Lunar Night Survival -> Mission 2 Mars Jezero Dust Storm -> Closed-loop ECLSS infrastructure expansion.

### 2.3 STEM Educator and Flight Director (Adult Mentor / Teacher)
- Professional Profile: Formal science educator or informal robotics/aerospace club mentor facilitating structured 45-minute classroom modules.
- Core Requirements: Zero-login friction, zero student PII collection (strict COPPA compliance), transparent physical formulas labeled with [GAME-MODEL ESTIMATE], and alignment with national physical science curriculum baselines.
- Primary User Journey: Curriculum scenario overview -> Class challenge deployment -> Mission Black Box comparative evaluation.

---

## 3. Information Architecture and 5-Tab Cadet Navigation

The client application operates a single-page architecture governed by a persistent 5-tab navigation bar:

```
+---------------------------------------------------------------------------------------------------------+
|                                    TOP HUD BAR (Persistent Telemetry)                                   |
| Rank: Flight Cadet | Stardust: 1,240 mg | Tech Credits: 450 | Audio: Muted | Locale: EN / [BN]           |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  [TAB 1: QUICK RUN]     [TAB 2: MISSIONS]      [TAB 3: RESOURCES]    [TAB 4: TRAINING]   [TAB 5: PROFILE]
|  - 3D Kinetic Runner    - Mission 0: Earth     - Central Hub         - Docking Sim       - Cadet Dossier
|  - 3-Lane Flight        - Mission 1: Moon      - Solar Array         - Memory Grid       - Badge Rack   
|  - Science Hazards      - Mission 2: Mars      - Water Recycler      - Science Quizzes   - Telemetry Log
|  - In-Flight Shields    - Coupled Ledger       - Hydroponic Bay      - Locked Teasers    - Safe Settings
|  - Stardust Vacuum      - Black Box Debrief    - Radiation Dome                                         
|                                                                                                         |
+---------------------------------------------------------------------------------------------------------+
|                                      BOTTOM PERSISTENT NAVIGATION BAR                                   |
| [Lucide: Zap] Quick Run | [Lucide: Compass] Missions | [Lucide: Hammer] Base | [Lucide: Brain] Training | [Lucide: User] Profile
+---------------------------------------------------------------------------------------------------------+
```

### 3.1 Persistent Top Navigation Header
Maintains real-time display of cadet callsign rank, stardust inventory, tech credit balance, master audio mute toggle, and instant bilingual locale switcher (English / Bengali).

### 3.2 View Routing State Machine
All tab navigation transitions update Zustand store slice (settingsSlice.activeTab). Views mount without document reloads or remote network round-trips.

---

## 4. Detailed Feature Specifications (PRD-F01 to PRD-F20)

### PRD-F01: Hero Launch View and Twinkle Diagnostic Greeting
- Description: Primary home screen presenting the interactive 3D Twinkle scout drone model (companion_drone.glb) and rapid mission launch triggers.
- Behavior: Highlights the 56px Quick Run call-to-action button. Twinkle delivers dynamic Socratic status readouts reflecting the outpost's active life support condition.
- Telemetry Display: Habitat power index, ECLSS loop health percentage, and total harvested stardust minerals.

### PRD-F02: Quick Run 3D Spacecraft Runner Kinematics
- Description: Client-side 3-lane orbital runner powered by Three.js and React Three Fiber targeting a locked 60 FPS update loop.
- Controls: Touch swipe thresholds (30px horizontal drag), keyboard arrow keys (ArrowLeft / ArrowRight), and WASD keys (A / D).
- Kinematics: Constant longitudinal flight velocity with smooth horizontal lane interpolation across fixed coordinates x in {-2.5, 0, 2.5} meters over 120ms.

### PRD-F03: Quick Run Scientific Flight Hazards
- Description: Procedurally spawned aerospace obstacles derived from validated orbital mechanics scenarios.
- Hazard Classes:
  1. Kessler Debris Fragments: Discarded upper stages and fragmentation debris; impact deducts 25% hull integrity.
  2. Solar Particle Corridors: Ionizing radiation ribbons; traversing unshielded drains 15% life support shielding.
  3. Atmospheric Dust Plumes: Low-altitude particulate clouds reducing solar collector generation and visual contrast.
- Performance Safeguard: Automatically falls back to an accelerated 2D SVG canvas if render loop drops below 30 FPS over 180 consecutive frames.

### PRD-F04: Quick Run Mineral Economy and Pickups
- Description: In-flight resource collection fueling outpost expansion and module fabrication.
- Collectibles:
  1. Stardust Minerals: Solid lunar/Martian regolith deposits yielding 10 to 50 raw mineral units per pickup.
  2. Auxiliary Power Cells: Immediate 20% runner battery recharge; surplus converts to Tech Credits at run conclusion.
- Auditory Feedback: Low-latency synthesized audio pulse under 75 dB accompanied by high-contrast visual badge counters.

### PRD-F05: Quick Run Active Superpowers
- Description: Deployable spacecraft countermeasures unlocked and upgraded through the Outpost Base building subsystem.
- Countermeasure Systems:
  1. Kinetic Deflector Shield: Generates 6 seconds of debris immunity; engaged via spacebar or double-tap gesture.
  2. Electromagnetic Mineral Attractor: Magnetically collects stardust across all three lanes within a 15-meter forward radius for 8 seconds.
- Telemetry Display: Radial circular timer indicating active duration and remaining cooldown intervals.

### PRD-F06: Outpost Mission 0 — Earth Launch Staging and Payload Allocation
- Description: Introductory engineering scenario teaching mass, volume, and power budget balancing before launch departure.
- Real Telemetry Integration: Displays real-time full-disc DSCOVR Earth observation telemetry and imagery via api.nasa.gov EPIC (`/EPIC/api/natural/images`), with sun-Earth coordinates and timestamps.
- Trade-off Matrix: Allocate cargo payload mass between redundant oxygen scrubber canisters, auxiliary solar panels, and hydroponic seeds.
- Constraint: Launch vehicle payload limit (45,000 kg). Exceeding mass budget prevents launch ignition.

### PRD-F07: Outpost Mission 1 — Lunar Shackleton Crater Outpost Operation
- Description: Artemis-scale lunar south pole outpost management confronting 354-hour continuous lunar night thermal challenges.
- Core Dilemma: Direct emergency fuel cell reserves to subsurface water-ice extraction drills or sustain habitat heating and carbon dioxide scrubbers.
- NASA Data Grounding: Lunar Reconnaissance Orbiter (LRO) Diviner thermal radiometer data confirming permanently shadowed region temperatures down to 40 K.

### PRD-F08: Outpost Mission 2 — Mars Jezero Colony Dust Storm Survival
- Description: Long-duration surface colony survival during an extensive Martian global dust storm.
- Core Dilemma: Atmospheric dust reduces solar array generation by up to 78%. Players must cycle power between the Sabatier methane/water reactor and moisture extraction.
- NASA Data Grounding: Driven by NASA Mars Climate Sounder (MCS) Level 5 DDR optical depth records (tau >= 3.5), calibrated against NASA POWER solar surface irradiance profiles.

### PRD-F09: Authoritative 6-Variable Coupled Resource Ledger
- Description: Deterministic mathematical engine tracking the six fundamental outpost variables:
  Ledger = [Power (kW), Oxygen (%), Water (L), Food (kg), Shielding (%), Crew Time (hrs)]
- Coupling Invariant: Every selectable decision option MUST mutate at least two resources with an explicit reason string.
- Failure Thresholds: Exhaustion of Power, Oxygen, Water, or Food triggers immediate outpost abort and routes to the Black Box debrief.

### PRD-F10: Bounded Butterfly Effect State Flagging Engine
- Description: Causal delay scheduler recording operational compromises that trigger downstream emergencies 2 to 5 Sols later.
- State Architecture: Persists boolean and numeric flags in missionSlice.activeFlags (e.g., DEFERRED_PUMP_MAINTENANCE = true).
- Resolution: Automatically schedules secondary failure events (e.g., Coolant Loop B cavitation) with explicit historical attribution.

### PRD-F11: Twinkle Predict-First Socratic Scaffolding Dialogues
- Description: Non-intrusive pedagogical mentoring model prompting student hypothesis formation before consequence calculation.
- Pedagogical Contract: Before decision execution, Twinkle prompts: "Cadet, if we shut down the primary water recycler, how will our oxygen electrolysis loop react?"
- Guidance Rules: Twinkle never reveals optimal answers directly, maintains encouraging dialogue, and highlights physical conservation laws.

### PRD-F12: Mission Black Box Debrief — Forensic Narrative Timeline
- Description: Visual chronological reconstruction of all mission decisions following successful completion or emergency abort.
- Timeline Presentation: Interactive telemetry traces plotting resource levels across Sols 1 through 30.
- Event Log: Each log node details the event title, chosen decision, immediate ledger deltas, and delayed butterfly flag manifestations.
- Scientific Discovery Reward: Mission completions fetch and present the daily Astronomy Picture of the Day from api.nasa.gov APOD (`/planetary/apod`) with educational astrophysical context narrated by Twinkle.

### PRD-F13: Mission Black Box Debrief — Tipping-Point Diagnostics
- Description: Automated root-cause diagnostic identifying the exact historical decision that triggered irreversible subsystem collapse.
- NASA Benchmark Comparison: Side-by-side telemetry panel contrasting the student's strategy against standard NASA ISS flight rules and NTRS technical baselines (NASA/TP-2015-218211).
- Scientific Disclosure: Prominently displays the [GAME-MODEL ESTIMATE] badge detailing simplifications made to real aerospace equations.

### PRD-F14: Mission Black Box Debrief — One-Click Replay and Branch Exploration
- Description: Non-punitive iteration tool permitting cadets to rewind the outpost simulation to the identified tipping-point Sol.
- Workflow: Cadets re-evaluate the critical dilemma, select an alternative engineering path, and observe alternative subsystem trajectories.

### PRD-F15: Outpost Base Infrastructure — Central Command Hub
- Description: Headquarters leveling system (Levels 1 to 3) dictating maximum building tier ceilings across the outpost.
- Resource Cost: Consumes Stardust Minerals collected in Quick Run and Tech Credits earned through mission completions.
- Capability Matrix: Level 1 establishes basic habitat survival; Level 2 unlocks closed-loop recycling; Level 3 enables autonomous planetary rovers.

### PRD-F16: Outpost Base Infrastructure — ECLSS Life Support Subsystem Upgrades
- Description: Modular facility construction engine governing passive outpost resilience and active runner superpowers.
- Subsystem Modules:
  1. Solar Photovoltaic Grid: Increases base starting power reserves; elevates Quick Run craft acceleration.
  2. ECLSS Water Recovery System (WRS): Raises water recycling efficiency from 70% to 98% (matching ISS baseline).
  3. Hydroponic Crop Greenhouse: Lowers daily food consumption burn rate and improves crew morale endurance.
  4. Radiation Shield Dome: Mitigates solar particle damage; lengthens Quick Run active shield duration by 2.0s per tier.

### PRD-F17: Training Deck — Astronaut Cognitive Mini-Games & NASA Media Library
- Description: Tactile cognitive training modules reinforcing operational discipline and spatial coordination, paired with real astronaut training telemetry.
- Modules:
  1. Orbital Docking Alignment: Vector alignment simulation requiring pitch, yaw, and translation alignment within 0.5-degree tolerance.
  2. ECLSS Sequence Memory Grid: High-tempo spatial pattern recall simulating emergency valve isolation protocols.
  3. NASA Imagery Visualizer: Streams authentic astronaut EVA and ISS operational preparation photography from the NASA Image and Video Library (`images-api.nasa.gov`).
- Incentive: Completion yields a 1.25x Mission Readiness Multiplier applied to score accumulation in subsequent mission runs.

### PRD-F18: Training Deck — Mission Readiness Science Quizzes
- Description: Rapid-fire scientific assessments validating comprehension of orbital mechanics, ECLSS thermodynamics, and radiation physics.
- Provenance: Quiz answers, formulas, and remediation feedback are strictly grounded in NASA Technical Reports Server (NTRS) publications and verified aerospace monographs.
- Progression: Correct responses award Tech Credits; incorrect answers trigger Twinkle scientific briefings explaining core physical laws.

### PRD-F19: Cadet Profile, Ranks, Local Pseudonymous Leaderboard, and NASA API Key Governance
- Description: Local cadet profile dossier, mission qualification badges, privacy-first local leaderboards, and telemetry configuration.
- Privacy Architecture: Zero external user accounts, zero email collection, zero analytics cookies (strict COPPA compliance).
- Pseudonym Generator: Deterministically constructs aerospace callsigns (e.g., "Cadet Solar Falcon") from browser entropy.
- Ranks: Trainee -> Flight Cadet -> Sub-Lieutenant -> Mission Commander based on verified scientific challenge completion.
- NASA API Key Management: Cadets or judges can optionally input a free personal API key in Settings (persisted to `localStorage` under `crewready_v1_nasa_api_key`) to elevate request quotas from DEMO_KEY (30 req/hr) to 1,000 req/hr.

### PRD-F20: Tier 2 Visual Teasers and Locked Feature Enclosure
- Description: Elegant locked badges designating post-competition expansion modules while sustaining learner engagement.
- Teasers:
  1. Multiplayer Co-Op: Shared 2-player life support console via local room codes ([Locked: Mission Tier 2]).
  2. Zero-G Body Stimulation: Neuromuscular conditioning simulator ([Locked: Mission Tier 2]).
  3. NASA Science Micro-Reels: Curated NASA video telemetry cards ([Locked: Mission Tier 2]).

---

## 5. Educational Learning Outcomes Mapped to NASA Core Demands

| NASA Challenge Demand | Core Physical Principle | In-Game Mission / Base Feature | Observable Educational Learning Outcome |
|---|---|---|---|
| 1. Life Support (ECLSS) | Mass conservation; stoichiometry of water electrolysis; 0.84 kg O2/day human baseline. | Mission 1 Lunar ECLSS; Base Water Recycler Module. | Cadets calculate that water recovery deficits directly throttle oxygen generation capacity. |
| 2. Radiation Shielding | Mass stopping power (g/cm2); BISO solar particle fluence; regolith burial depth. | Quick Run Radiation Belts; Base Radiation Shield Dome. | Cadets evaluate structural mass penalties against long-term habitat ionizing radiation exposure limits. |
| 3. Power Generation | Photovoltaic irradiance decay; dust attenuation coefficient (tau); fuel cell chemistry. | Mission 2 Jezero Dust Storm; Base Solar Photovoltaic Grid. | Cadets calculate power degradation under variable atmospheric opacity using real NASA MCS telemetry. |
| 4. Food Production | Edible biomass yield per m2; photoperiod lighting energy loads; caloric baselines. | Mission 0 Cargo Staging; Base Hydroponic Greenhouse. | Cadets differentiate between shelf-stable packaged mass and the high electrical cost of biological life support. |

---

## 6. Technical Invariants and Operational Constraints

### 6.1 Zero Backend Failure and NASA API Invariant
- Static progressive web app architecture executing 100% within the browser runtime.
- Zero server runtime dependencies, zero external database connections, and zero dynamic backend hosting requirements.
- NASA Open Data Integration: Resilient client-side service consuming api.nasa.gov APOD/EPIC and images-api.nasa.gov using DEMO_KEY or user settings key.
- Zero-Crash Offline Resilience: If offline, rate-limited (HTTP 429), or timed out (>2.5s), the data service seamlessly falls back to pre-packaged JSON fixtures in public/assets/data/ with visual [NASA LIVE] / [OFFLINE ARCHIVE] HUD badges.
- Complete offline functionality guaranteed via Service Worker asset and fixture caching.

### 6.2 Authoritative Local Storage Contract
- All progression data persists in browser localStorage under the strict prefix crewready_v1_*.
- Direct localStorage mutations outside Zustand store slice actions are strictly prohibited.
- Automatic recovery logic restores valid baseline state from public/assets/data/ if stored JSON fails parsing.

### 6.3 Bilingual Infrastructure (i18n)
- Native bilingual support for English (en) and Bengali (bn | বাংলা) from day one.
- Zero raw text strings in UI components; all labels, dialogue, and debrief narratives reference keys via t('key').
- Strict typography validation ensuring Bengali Unicode ligatures render without visual clipping or font replacement errors.

### 6.4 Child Safety and COPPA Compliance
- Strict compliance with Children's Online Privacy Protection Act (COPPA).
- Zero student PII collection, transmission, or external logging.
- Media submissions and marketing video assets strictly exclude faces, voices, or identifiable data of minors.

---

## 7. Success Metrics and Verification Acceptance Criteria

### 7.1 Quantitative Success Metrics (O1 to O5)
- O1: Instant Engagement: First-time cadets launch Quick Run within 15 seconds of initial page render.
- O2: Pedagogical Efficacy: Over 80% of cadets accurately identify the root cause of outpost failure after one Black Box debrief review.
- O3: 60 FPS Performance Budget: Sustained 60 FPS on integrated mobile GPUs (Intel Iris, Mali-G57, Adreno 610) with frame drops under 2%.
- O4: Accessibility Compliance: 100% adherence to WCAG 2.1 AA standards (4.5:1 contrast, 44px tap targets, screen-reader semantics).
- O5: Offline Reliability: 100% of gameplay features, missions, and training modules fully operable in offline airplane mode.

### 7.2 Verification Acceptance Criteria Matrix
1. Coupled Ledger Gate: Automated validation confirms every mission decision option in missions.json alters >= 2 ledger variables.
2. Twinkle Socratic Gate: Review verifies that Twinkle dialogue prompts formulate inquiries without revealing outcome weights.
3. Offline PWA Gate: Browser tests verify zero failed network requests when executing all missions under offline network conditions.
4. NASA API Zero-Crash Gate: Network disconnection or HTTP 429 response during APOD/EPIC requests automatically resolves valid fallback JSON without unhandled Promise rejections or UI freezes.
5. Bilingual Parity Gate: Translation parity scripts verify 100% key synchronization between en.json and bn.json.
6. Scientific Provenance Gate: All mathematical equations and derived simulations display the visible [GAME-MODEL ESTIMATE] UI badge.
