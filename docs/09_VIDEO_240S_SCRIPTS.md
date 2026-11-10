# Production Scripts & Storyboards (240-Second Local & Prescreening)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-09-VIDEO-240S-SCRIPTS-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/08_MVP_SCOPE_AND_BUILD_SEQUENCE.md -> docs/09_VIDEO_240S_SCRIPTS.md
Timing Standard: Spoken narration calibrated at 135 words per minute (~2.25 words per second).
Maximum Duration Cap: 240.0s hard cutoff (Target: 220.0s safe buffer). Subtitles: 100% English closed captions.
Under-18 Rule: Strict adult/synthetic voiceover; zero recognizable faces, voices, or names of minors.

---

### Project Context Ingestion Bindings
- **PROJECT_NAME:** CrewReady: Beyond Us
- **TEAM_NAME:** Team CrewReady [Dhaka Space Apps Consortium]
- **LOCATION_CITY:** Dhaka, Bangladesh
- **TEAM_MEMBERS:**
  - Member 1: [Lead Systems Architect & Project Director]
  - Member 2: [Full-Stack & 3D WebGL Engineer]
  - Member 3: [Aerospace Science & Data Specialist]
  - Member 4: [UI/UX & Pedagogical Lead]
  - Member 5: [Video, Audio & Narrative Producer]
- **CHALLENGE_TITLE:** NASA Space Apps Challenge 2026 — *Build a Junior Astronaut Mission Trainer*
- **CORE_PROBLEM:** The space education divide: games reduce life support to shallow trivia meters or alienate Gen Alpha with 150-switch cockpits, hiding the Coupled Systems Law ($\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$).
- **NASA_DATASETS:**
  - Mars Climate Sounder (MCS) DDR V6.2 dust opacity $\tau$ (PDS Atmospheres Node)
  - ISS ECLSS Operational Baselines (NASA/TP-2015-218211)
  - NASA Astronomy Picture of the Day API (`api.nasa.gov/planetary/apod`)
  - NASA DSCOVR EPIC API (`api.nasa.gov/EPIC/api/natural/images`)
  - NASA Image and Video Library (`images-api.nasa.gov`)
  - NASA POWER Solar Irradiance Profiles (`power.larc.nasa.gov`)
  - NASA Technical Reports Server (NTRS citations)
- **LIVE_DEMO_FEATURE:** 3D Twinkle Drone Guide, 3D Quick Run Runner, Mars Jezero Mission 2 with coupled 6-resource ledger, Black Box Forensic Debrief, Outpost Base Upgrades, and live NASA APOD debrief.
- **FUTURE_VISION_IMPACT:** Global Gen Alpha classroom scalability (bilingual EN/বাংলা, offline-first PWA), 4-player Multiplayer Co-Op roles, alliance tactical chat, Zero-G pose workout drills, and NASA micro-reels.

---

## 1. Video 1: Prescreening Pitch Script & Concept Storyboard (Target: 220s)
*Audience:* Local Prescreening Evaluators & Category Screeners.  
*Production Style:* Kinetic 2D/3D motion graphics (Remotion), UI concept mockups, Figma flows, NASA archival footage, and clean CapCut pacing.

### Scene 1.1: The Poetic Hook (00:00 – 00:15 | 15s | 34 words)
- **Visual Scene:** Zoom from deep space starfield into Earth night lights over South Asia. 3D Twinkle companion drone sweeps into view with soft thruster trails.
- **Production Source:** Remotion 3D canvas composition (`TwinkleHero.tsx`) + NASA Blue Marble archival backplate.
- **Spoken VO Script:** *"Twinkle, Twinkle, Little Star, how I wonder what you are..."* In Bangladesh, our national poet Kazi Nazrul Islam wrote in *Shonkolpo*: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..." ("I shall not stay shut in a closed room; I shall see the world...").
- **On-Screen Text Overlay:** `"Twinkle, Twinkle, Little Star..."` ──> `"থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..."` *(Universal Cosmic Curiosity)*.
- **SFX & Music:** Soft celesta chime blending into ambient aerospace drone synthesizer pad.

### Scene 1.2: Team Origin & Identity (00:15 – 00:30 | 15s | 34 words)
- **Visual Scene:** Animated lower-third cards and team portrait slate displaying individual avatars, university affiliations, and engineering roles.
- **Production Source:** Remotion kinetic layout (`TeamRosterGrid.tsx`) + vector avatar graphics.
- **Spoken VO Script:** From humanity's first nursery rhyme to our immortal national poetry, every child wonders what lies beyond. We are Team CrewReady from Dhaka, Bangladesh: five multidisciplinary engineers, researchers, and storytellers united for Space Apps 2026.
- **On-Screen Text Overlay:** `Team CrewReady | Dhaka, Bangladesh` • `[Roster: Lead · Dev · 3D · Science · Media]`.
- **SFX & Music:** Uplifting synthesizer chord swell; crisp digital ticks on roster card entries.

### Scene 1.3: Generational Purpose (00:30 – 00:45 | 15s | 34 words)
- **Visual Scene:** Split frame: Gen Z engineers collaborating in IDE/Figma passing a glowing telemetry data-orb to a Gen Alpha student wearing an astronaut mission patch.
- **Production Source:** Figma interface prototype motion capture + CapCut color grading.
- **Spoken VO Script:** As Gen Z builders, our mission is empowering Gen Alpha champions to meet their cosmic curiosity—not with dry lectures, but through experiential aerospace engineering where every single choice has tangible consequences.
- **On-Screen Text Overlay:** `Gen Z Builders ──> Gen Alpha Champions` • `Experiential Aerospace Systems`.
- **SFX & Music:** Futuristic capacitor charging sound; smooth low-frequency whoosh transition.

### Scene 1.4: The Pedagogical Divide (00:45 – 01:05 | 20s | 45 words)
- **Visual Scene:** Split comparison screen. Left side: childish quiz app with flat, disconnected resource meters. Right side: industrial telemetry cockpit with 150 incomprehensible gauges and a red "QUIT" prompt.
- **Production Source:** Remotion split-screen template (`CompetitorFlaws.tsx`) with animated UI overlays.
- **Spoken VO Script:** NASA asked us to build a Junior Astronaut Mission Trainer. Today's tools fail: they either oversimplify life support into trivial clicker games where oxygen never drops, or intimidate 10-year-olds with industrial cockpits where eighty percent bounce within three minutes.
- **On-Screen Text Overlay:** `The Pedagogical Divide` • Left: `0-Trade-off Clicker Games` • Right: `150+ Parameter Cognitive Burnout`.
- **SFX & Music:** Flat warning buzz on trivia tap; chaotic radio distortion on flight simulator.

### Scene 1.5: The Coupled Systems Law (01:05 – 01:25 | 20s | 45 words)
- **Visual Scene:** Dynamic vector diagram of a 6-node polygonal mesh: Power, Oxygen, Water, Food, Shielding, and Crew Time. Nodes pulse and contract as arrows show energy trade-offs.
- **Production Source:** Remotion vector animation (`CoupledLedgerLaw.tsx`).
- **Spoken VO Script:** Neither teaches the core law of space architecture: the Coupled Systems Law. Protecting one subsystem always costs another. Every choice is a trade-off between power, oxygen, water, food, shielding, and crew time. Spaceflight has no free lunches.
- **On-Screen Text Overlay:** `Coupled Systems Law: ` $\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$ • `Every Decision Demands An Honest Trade-Off`.
- **SFX & Music:** Sub-bass impact drop on equation lock; mechanical gear ratchet sound.

### Scene 1.6: The CrewReady Architecture (01:25 – 01:45 | 20s | 45 words)
- **Visual Scene:** High-contrast aerospace HUD overview showing 5 bottom tabs. Twinkle drone floats in 3D over the central viewport. Language toggle switches between English and বাংলা.
- **Production Source:** Figma hi-fi interactive prototype recording (`CrewReadyAppShell.mp4`).
- **Spoken VO Script:** Meet CrewReady: Beyond Us. Guided by Twinkle, our Socratic scout drone, young cadets run lunar and Martian outposts. We fuse instant 3D arcade flight with authentic NASA mass-balance equations, accessible in English and Bengali.
- **On-Screen Text Overlay:** `CrewReady: Beyond Us` • `Arcade Adrenaline + Systems Engineering` • `Bilingual HUD [EN / বাংলা]`.
- **SFX & Music:** High-tech system boot chime; clean digital UI click series.

### Scene 1.7: Gameplay Loop & Mars Jezero Crisis (01:45 – 02:05 | 20s | 45 words)
- **Visual Scene:** Rapid sequence: cadet flying Quick Run in 3D space dodging debris, harvesting Stardust, then transitioning into Mission 2: Mars Jezero Colony as red dust storm warnings activate.
- **Production Source:** Figma screen capture + Remotion motion accents (`MissionTransition.tsx`).
- **Spoken VO Script:** The loop is simple yet profound: Cadets fly Quick Run to harvest Stardust minerals, then face mission crises. In Mission 2, an atmospheric dust storm strikes Mars Jezero Base, reducing solar array output by sixty-five percent.
- **On-Screen Text Overlay:** `Step 1: Quick Run (Collect Minerals)` ──> `Step 2: Mars Jezero Base (NASA Dust Crisis)`.
- **SFX & Music:** Spacecraft booster burn into howling Martian windstorm atmospheric filter.

### Scene 1.8: NASA Data Provenance (02:05 – 02:25 | 20s | 45 words)
- **Visual Scene:** NASA scientific data flow diagram: Mars Climate Sounder DDR V6.2 dust opacity data feeding the solar array curve; ISS ECLSS mass-balance reports calibrating life support rates.
- **Production Source:** Remotion scientific infographic (`NASADataProvenance.tsx`).
- **Spoken VO Script:** This is powered by real NASA data: Mars Climate Sounder optical depth profiles throttle solar energy, while ISS ECLSS reports set our oxygen and water recovery curves. Twinkle prompts: divert power to the oxygen reactor or greenhouse heaters?
- **On-Screen Text Overlay:** `NASA Open Data Integration` • `Mars Climate Sounder DDR V6.2` • `ISS ECLSS Baselines (NASA/TP-2015-218211)`.
- **SFX & Music:** Telemetry ping sequence; soft radar sweep audio accent.

### Scene 1.9: Black Box Forensic Debrief (02:25 – 02:45 | 20s | 45 words)
- **Visual Scene:** Mission Black Box modal. An interactive Sol scrubber scrubs backwards, highlighting Sol 4's heater decision that cascaded into water-freezer failure. APOD Mars rover reward unlocks.
- **Production Source:** Figma debrief prototype motion capture + NASA APOD high-res imagery.
- **Spoken VO Script:** When life support fails, our Black Box debrief forensic timeline pinpoints the exact Sol tipping point without penalizing the cadet, paired with NASA Astronomy Picture of the Day debrief rewards and base upgrades.
- **On-Screen Text Overlay:** `Mission Black Box Debrief` • `Forensic Sol Scrubber` • `Tipping-Point Diagnosis` • `NASA APOD Cosmic Reward`.
- **SFX & Music:** Sonar chirp; forensic tape rewind sound effect; victorious APOD chime.

### Scene 1.10: Zero-Crash PWA Architecture (02:45 – 03:05 | 20s | 45 words)
- **Visual Scene:** Architecture diagram: client-side Vite + React PWA, Service Worker caching 3D models and JSON fixtures, running offline on low-spec tablets. COPPA zero-tracking shield badge.
- **Production Source:** Remotion tech stack explainer (`ZeroBackendStack.tsx`).
- **Spoken VO Script:** CrewReady runs everywhere: zero backend servers, zero login barriers, fully offline-first PWA cached on low-cost school tablets. Strict COPPA compliance protects youth privacy with pseudonyms and zero tracking cookies.
- **On-Screen Text Overlay:** `Zero-Crash Static Architecture` • `100% Client-Side PWA` • `Offline-First Service Worker` • `COPPA Compliant`.
- **SFX & Music:** Affirmative digital validation tone; solid mechanical latch sound.

### Scene 1.11: Future Roadmap & Global Vision (03:05 – 03:25 | 20s | 45 words)
- **Visual Scene:** 3D teaser cards showcasing post-hackathon expansions: 4-cadet Multiplayer Co-Op with Commander, Engineer, Medic, and Scientist roles; astronaut Zero-G motion workouts.
- **Production Source:** Remotion 3D card deck carousel (`RoadmapTeasers.tsx`).
- **Spoken VO Script:** Our post-hackathon Tier 2 vision expands into 4-player Multiplayer Co-Op with specialized crew roles, tactical alliance chat, Zero-G physical motion tracking workouts, and NASA micro-reels for science classrooms globally.
- **On-Screen Text Overlay:** `Mission Tier 2 Roadmap` • `4-Player Multiplayer Co-Op Bridge` • `Zero-G Motion Workouts` • `NASA Micro-Reels`.
- **SFX & Music:** Rising symphonic strings; futuristic communication sync hum.

### Scene 1.12: Call to Action & Conclusion (03:25 – 03:40 | 15s | 34 words)
- **Visual Scene:** Aerospace closing card with open-source GitHub repository URL, QR code, Space Apps Challenge logos, team credits, and 3D Twinkle giving an astronaut salute.
- **Production Source:** Remotion title outro card (`OutroCard.tsx`) + CapCut final master export.
- **Spoken VO Script:** Join us in shaping humanity’s next explorers. Explore our open-source codebase on GitHub. We are Team CrewReady: Beyond Us—curiosity begins here.
- **On-Screen Text Overlay:** `CrewReady: Beyond Us` • `github.com/[REPO_URL]` • `NASA Space Apps Challenge 2026`.
- **SFX & Music:** Full orchestral resolution; clean radio transmission cutoff click.

---

## 2. Video 2: Local Judging Live Demo Script & Screen Capture Storyboard (Target: 220s)
*Audience:* City Local Judges & Technical Evaluation Panel (Space Apps Bangladesh).  
*Production Style:* Authentic screen recordings of live running software (OBS Studio 60 FPS), Picture-in-Picture webcam of adult presenter, live devtools proof, NASA API live telemetry, and CapCut sound design.

### Beat 2.1: WHO — The Poetic Hook (00:00 – 00:15 | 15s | 34 words)
- **Visual Scene:** Adult presenter on camera with live CrewReady application running on an external monitor behind them. 3D Twinkle drone animates on the browser screen.
- **Production Source:** OBS Studio 1080p recording (Presenter 4K webcam + live local build).
- **Spoken VO Script:** *"Twinkle, Twinkle, Little Star, how I wonder what you are..."* In Bangladesh, our national poet Kazi Nazrul Islam declared: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..." ("I shall not stay shut in a closed room; I shall see the world...").
- **On-Screen Text Overlay:** `"Twinkle, Twinkle, Little Star..."` ──> `"থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..."` *(Kazi Nazrul Islam)*.
- **SFX & Music:** Atmospheric ambient pad; warm low-frequency pulse.

### Beat 2.2: WHO — Team Roll Call (00:15 – 00:30 | 15s | 34 words)
- **Visual Scene:** Presenter introduces the team; Picture-in-Picture graphic slate displays member names, professional headshots, and specialized hackathon roles.
- **Production Source:** OBS Studio PiP overlay + CapCut animated graphic callout.
- **Spoken VO Script:** That universal wonder drives us. We are Team CrewReady from Dhaka: [MEMBER_1] on Architecture, [MEMBER_2] on Full-Stack 3D, [MEMBER_3] on Aerospace Science, [MEMBER_4] on UI/UX, and [MEMBER_5] on Video Production.
- **On-Screen Text Overlay:** `Team CrewReady — Dhaka, Bangladesh` • `[MEMBER_1] (Lead)` • `[MEMBER_2] (3D/Dev)` • `[MEMBER_3] (Science)` • `[MEMBER_4] (UI/UX)` • `[MEMBER_5] (Media)`.
- **SFX & Music:** Clean digital selection click accompanying each team member badge.

### Beat 2.3: WHO — Gen Z for Gen Alpha (00:30 – 00:45 | 15s | 34 words)
- **Visual Scene:** Direct full-screen capture of CrewReady landing view: responsive HUD with Stardust and Tech Credit counters, rotating 3D Twinkle drone, and "Quick Run" CTA.
- **Production Source:** OBS direct browser capture (`HomeView.tsx` at 1920x1080 @ 60 FPS).
- **Spoken VO Script:** We are Gen Z engineers building for Gen Alpha champions. Kids today have infinite curiosity; our duty is giving them authentic tools to master the science of space colonization.
- **On-Screen Text Overlay:** `Gen Z Engineers Building for Gen Alpha Space Explorers`.
- **SFX & Music:** Gentle servo sound of the 3D companion drone inspecting the cursor.

### Beat 2.4: WHY — The Challenge & The Divide (00:45 – 01:05 | 20s | 45 words)
- **Visual Scene:** Fast side-by-side split screen showing a standard trivial quiz app with disconnected health/mana bars versus a daunting industrial flight simulator dashboard.
- **Production Source:** CapCut split-screen composite with real competitor screenshots.
- **Spoken VO Script:** We tackled the Junior Astronaut Mission Trainer challenge. Why? Space games are broken. They either treat survival as trivial trivia with zero trade-offs, or bombard 10-year-olds with 150-switch cockpits that cause instant cognitive burnout.
- **On-Screen Text Overlay:** `NASA Space Apps 2026: Build a Junior Astronaut Mission Trainer` • `Trivial Quizzes vs. 150-Switch Burnout`.
- **SFX & Music:** Dull rejection buzz on trivia quiz; high-pitched alarm chirp on cockpit sim.

### Beat 2.5: WHY — The Coupled Systems Law (01:05 – 01:25 | 20s | 45 words)
- **Visual Scene:** Zooming in on the 6-resource ledger HUD in the live web application: Power, Oxygen, Water, Food, Shielding, and Crew Time. Animated trade-off arrows connect meters.
- **Production Source:** OBS screen zoom on `LedgerBar.tsx` + Remotion formula overlay.
- **Spoken VO Script:** Real space engineering is governed by the Coupled Systems Law: protecting life support always expends another system. Delta Protection-A equals minus Delta Resource-B. If you run heaters, you burn battery power; if you delay repairs, micro-leaks compound.
- **On-Screen Text Overlay:** `Coupled Systems Law: ` $\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$ • `[Power, Oxygen, Water, Food, Shielding, Crew Time]`.
- **SFX & Music:** Deep resonant bass drop; crisp electrical spark on resource connection.

### Beat 2.6: WHY — The Bilingual Hybrid Engine (01:25 – 01:45 | 20s | 45 words)
- **Visual Scene:** Live click on the top-right language toggle: the entire user interface transitions instantly from English to বাংলা. Twinkle speaks in Bengali: *"ক্যাডেট, কমান্ড নিতে প্রস্তুত?"*
- **Production Source:** Live screen recording of `LanguageToggle.tsx` and i18n store state switch.
- **Spoken VO Script:** CrewReady solves this by pairing 3D arcade excitement with real ECLSS thermodynamics, wrapped in a kid-readable aerospace HUD with complete English and Bengali parity and zero backend dependencies.
- **On-Screen Text Overlay:** `The CrewReady Solution` • `3D WebGL Arcade + Deterministic ECLSS` • `Full Bilingual Parity [English / বাংলা]`.
- **SFX & Music:** Playful digital chirps from Twinkle; snappy interface click.

### Beat 2.7: WHAT — Quick Run 3D Arcade (01:45 – 02:00 | 15s | 34 words)
- **Visual Scene:** Cadet launches Quick Run. 3-lane Three.js spacecraft runner weaves between orbital space debris and solar particle waves, collecting golden Stardust minerals.
- **Production Source:** OBS direct 60 FPS recording of `RunnerView.tsx` with smooth keyboard lane changes.
- **Spoken VO Script:** Watch live. Our cadet launches Quick Run directly in the browser. Dodging orbital debris at sixty frames per second, they harvest Stardust minerals and power cells to fund their outpost base upgrades.
- **On-Screen Text Overlay:** `Tab 1: Quick Run (Three.js WebGL)` • `Kessler Debris Evasion` • `Stardust Mineral Harvesting`.
- **SFX & Music:** Deep spaceship engine rumble; cheerful crystalline pickup chimes.

### Beat 2.8: WHAT — Mars Jezero Colony & MCS Data (02:00 – 02:18 | 18s | 40 words)
- **Visual Scene:** Navigate to Missions tab. Select Mission 2: Mars Jezero Colony. Sol 4 begins: atmospheric dust storm warning flashes red. Telemetry header shows `[NASA LIVE]` with MCS optical depth $\tau = 1.45$.
- **Production Source:** OBS recording of `MissionsView.tsx` displaying live NASA data indicators.
- **Spoken VO Script:** Now, Mission 2: Mars Jezero Colony. Real NASA Mars Climate Sounder Level 5 DDR dust opacity data triggers an atmospheric dust storm! Solar array generation collapses by sixty-five percent. Twinkle prompts: divert emergency battery power or throttle life support?
- **On-Screen Text Overlay:** `Tab 2: Mission Control — Mars Jezero Base` • `NASA Mars Climate Sounder DDR V6.2` • `Dust Opacity ` $\tau = 1.45 \implies \text{Solar } -65\%$.
- **SFX & Music:** Pulsing hazard Klaxon; ambient howling Martian dust storm audio filter.

### Beat 2.9: WHAT — Coupled Ledger Shift & Black Box (02:18 – 02:33 | 15s | 34 words)
- **Visual Scene:** Cadet clicks "Divert Power to Habitat Heaters". Ledger numbers animate: Power drops 20 kW, crew time drops 2 hrs, Sabatier O2 margin decreases. Outpost enters critical state; Mission Black Box opens.
- **Production Source:** OBS recording of `LedgerBar.tsx` mutation and `DebriefModal.tsx` trigger.
- **Spoken VO Script:** Choosing heating drains 20 kilowatts, narrowing oxygen recycling margins. When systems fail, the Mission Black Box forensic debrief highlights the exact tipping point decision, explaining the real-world NASA engineering context without demoralizing the cadet.
- **On-Screen Text Overlay:** `6-Variable Coupled Ledger Mutation` • `Power -20kW \| Crew Time -2h` • `Mission Black Box Forensic Sol Scrubber`.
- **SFX & Music:** Power surge hum; audio rewind tape effect; gentle debrief chime.

### Beat 2.10: WHAT — Base Upgrades & Live APOD (02:33 – 02:45 | 12s | 27 words)
- **Visual Scene:** Navigate to Base Resources tab. Cadet spends Stardust to upgrade ECLSS Water Recycler to 98% efficiency. Click debrief reward: live NASA APOD modal opens with high-resolution imagery.
- **Production Source:** OBS capture of `BaseUpgradeView.tsx` and `ApodCard.tsx` consuming live NASA feed.
- **Spoken VO Script:** Cadets reinvest Stardust into base modules—upgrading water recovery to ninety-eight percent—and receive verified NASA Astronomy Picture of the Day debrief rewards with real educational citations.
- **On-Screen Text Overlay:** `Tab 3: Base Resources & NASA APOD` • `ECLSS Water Recovery Upgraded to 98% (ISS Standard)` • `Live NASA APOD Telemetry`.
- **SFX & Music:** Satisfying base construction impact clang; celestial harmonic chime.

### Beat 2.11: SO WHAT — Zero Backend & Offline DevTools Test (02:45 – 03:05 | 20s | 45 words)
- **Visual Scene:** Presenter opens Chrome DevTools Network panel, selects "Offline", and refreshes the browser page. The app loads instantly with zero errors; HUD badge updates to `[OFFLINE ARCHIVE]`.
- **Production Source:** Screen recording of DevTools offline toggle and Service Worker network cache hits.
- **Spoken VO Script:** CrewReady is built with zero external server failure points. As proven right here in Chrome DevTools with Wi-Fi severed, our offline-first PWA caches all assets locally, running flawlessly on low-spec mobile devices with zero user tracking.
- **On-Screen Text Overlay:** `Zero Backend Failure Invariant` • `Offline-First Service Worker (sw.js)` • `[OFFLINE ARCHIVE] Local Fixture Fallback` • `COPPA Compliant`.
- **SFX & Music:** Mouse click on offline toggle; triumphant confirmation chime upon instant page refresh.

### Beat 2.12: SO WHAT — Tier 2 Vision & Classroom Roadmap (03:05 – 03:25 | 20s | 45 words)
- **Visual Scene:** Presenter clicks on locked feature cards in Training tab: 4-Player Multiplayer Co-Op Bridge, Zero-G Astronaut Pose Workout, and NASA Science Micro-Reels display elegant preview dialogs.
- **Production Source:** OBS capture of `TrainingView.tsx` and Tier 2 preview modal interactions.
- **Spoken VO Script:** Beyond hackathon MVP, our Tier 2 roadmap introduces 4-cadet Multiplayer Co-Op with Commander, Engineer, Medic, and Scientist roles, physical Zero-G pose workouts, and NASA micro-reels to empower classrooms across Bangladesh and the globe.
- **On-Screen Text Overlay:** `Mission Tier 2 Vision & Academy Roadmap` • `4-Player Multiplayer Co-Op Bridge` • `Zero-G Motion Tracking` • `NASA Micro-Reels`.
- **SFX & Music:** Inspiring orchestral string progression; soft digital connection sync tone.

### Beat 2.13: SO WHAT — Open-Source Repository Close (03:25 – 03:40 | 15s | 34 words)
- **Visual Scene:** Presenter back on camera alongside the live application. End-card appears with open-source GitHub repository URL, QR code, Team CrewReady roster, and Twinkle waving goodbye.
- **Production Source:** OBS live split-frame + CapCut graphic title card.
- **Spoken VO Script:** Every choice spends something. Every system affects another. Try CrewReady right now on our open-source GitHub repository. We are Team CrewReady: Beyond Us. The universe is waiting!
- **On-Screen Text Overlay:** `CrewReady: Beyond Us` • `Open Source: github.com/[REPO_URL]` • `NASA Space Apps Challenge 2026`.
- **SFX & Music:** Final cinematic orchestral chord; clean radio comms beep cutoff.

---

## 3. Dual-Column Master Production Run-Sheet (Video 2: 220s / 135 WPM)

| Timestamp & Duration | Visual & On-Screen Action | Audio & Spoken Voiceover | On-Screen Text & Captions |
|---|---|---|---|
| **00:00–00:15** (15s) | Presenter on camera; 3D Twinkle rotates on background monitor. | "Twinkle, Twinkle, Little Star, how I wonder what you are..." In Bangladesh, poet Kazi Nazrul Islam declared: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..." ("I shall not stay shut in a closed room; I shall see the world..."). | Twinkle, Twinkle... ──> থাকব না কো বদ্ধ ঘরে... (Kazi Nazrul Islam) |
| **00:15–00:30** (15s) | Picture-in-picture team roster slate pops up with 5 member cards. | That universal wonder drives us. We are Team CrewReady from Dhaka: [MEMBER_1] on Architecture, [MEMBER_2] on Full-Stack 3D, [MEMBER_3] on Aerospace Science, [MEMBER_4] on UI/UX, and [MEMBER_5] on Video Production. | Team CrewReady — Dhaka, Bangladesh: Lead · 3D/Dev · Science · UI/UX · Media |
| **00:30–00:45** (15s) | Full-screen app HUD: Twinkle inspects mouse cursor; CTA pulses. | We are Gen Z engineers building for Gen Alpha champions. Kids today have infinite curiosity; our duty is giving them authentic tools to master the science of space colonization. | Gen Z Engineers Building for Gen Alpha Space Champions |
| **00:45–01:05** (20s) | Split comparison: trivial quiz app versus 150-switch cockpit sim. | We tackled the Junior Astronaut Mission Trainer challenge. Why? Space games are broken. They either treat survival as trivial trivia with zero trade-offs, or bombard 10-year-olds with 150-switch cockpits that cause instant cognitive burnout. | NASA Space Apps 2026: Junior Astronaut Mission Trainer (Trivial vs 150-Switch) |
| **01:05–01:25** (20s) | Zoom on 6-resource ledger HUD with animated trade-off arrows. | Real space engineering is governed by the Coupled Systems Law: protecting life support always expends another system. Delta Protection-A equals minus Delta Resource-B. If you run heaters, you burn battery power; if you delay repairs, micro-leaks compound. | Coupled Systems Law: $\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$ |
| **01:25–01:45** (20s) | Click EN/বাংলা toggle: entire UI updates instantly to Bengali. | CrewReady solves this by pairing 3D arcade excitement with real ECLSS thermodynamics, wrapped in a kid-readable aerospace HUD with complete English and Bengali parity and zero backend dependencies. | The CrewReady Solution: 3D WebGL Arcade + Deterministic ECLSS [EN / বাংলা] |
| **01:45–02:00** (15s) | Cadet launches Quick Run; 3D ship weaves through debris fields. | Watch live. Our cadet launches Quick Run directly in the browser. Dodging orbital debris at sixty frames per second, they harvest Stardust minerals and power cells to fund their outpost base upgrades. | Quick Run: Three.js WebGL Orbital Debris Evasion & Stardust Harvesting |
| **02:00–02:18** (18s) | Mars Jezero Base UI: Sol 4 dust storm alert; MCS telemetry live. | Now, Mission 2: Mars Jezero Colony. Real NASA Mars Climate Sounder Level 5 DDR dust opacity data triggers an atmospheric dust storm! Solar array generation collapses by sixty-five percent. Twinkle prompts: divert emergency battery power or throttle life support? | Mars Jezero Colony: NASA Mars Climate Sounder DDR V6.2 ($\tau = 1.45 \implies -65\%$) |
| **02:18–02:33** (15s) | Ledger numbers drop: Power -20kW; Black Box scrubber opens. | Choosing heating drains 20 kilowatts, narrowing oxygen recycling margins. When systems fail, the Mission Black Box forensic debrief highlights the exact tipping point decision, explaining the real-world NASA engineering context without demoralizing the cadet. | 6-Resource Ledger Mutation & Mission Black Box Forensic Timeline Scrubber |
| **02:33–02:45** (12s) | Upgrade Water Recycler to 98%; APOD modal displays Mars image. | Cadets reinvest Stardust into base modules—upgrading water recovery to ninety-eight percent—and receive verified NASA Astronomy Picture of the Day debrief rewards with real educational citations. | Base Upgrades: 98% ECLSS Water Recovery & Live NASA APOD Telemetry Reward |
| **02:45–03:05** (20s) | Chrome DevTools toggles Offline; page refreshes with zero lag. | CrewReady is built with zero external server failure points. As proven right here in Chrome DevTools with Wi-Fi severed, our offline-first PWA caches all assets locally, running flawlessly on low-spec mobile devices with zero user tracking. | Zero Backend Failure Invariant: Offline-First Service Worker (`OFFLINE=1`) |
| **03:05–03:25** (20s) | Click preview modals for Multiplayer, Pose Workouts, Micro-Reels. | Beyond hackathon MVP, our Tier 2 roadmap introduces 4-cadet Multiplayer Co-Op with Commander, Engineer, Medic, and Scientist roles, physical Zero-G pose workouts, and NASA micro-reels to empower classrooms across Bangladesh and the globe. | Mission Tier 2 Vision: 4-Player Co-Op Bridge, Zero-G Workouts, Micro-Reels |
| **03:25–03:40** (15s) | Presenter beside live app; final QR code and GitHub repo link. | Every choice spends something. Every system affects another. Try CrewReady right now on our open-source GitHub repository. We are Team CrewReady: Beyond Us. The universe is waiting! | CrewReady: Beyond Us • github.com/[REPO_URL] • Space Apps 2026 |

---

## 4. Production Pipeline, Voiceover Pacing & Subtitle Specifications

### 4.1 Production Architecture & Tooling Distribution
To ensure high production polish without introducing external server dependencies, assets are created and combined through four dedicated pipelines:
1. **Remotion (Code-Driven Programmatic Video):**
   - Composes the opening Twinkle-to-Nazrul poetic sequence, the kinetic typography for the Coupled Systems Law ($\Delta \text{Protection}_A \implies -\Delta \text{Resource}_B$), and data-provenance flow diagrams.
   - Generates exact 60.0 FPS motion assets with frame-accurate timing.
2. **OBS Studio (High-Fidelity Screen Recording):**
   - Captures full 1080p @ 60 FPS gameplay from the local Vite development server (`http://localhost:5173`).
   - Records Quick Run WebGL flight, Mars Jezero dust storm triggers, Black Box Sol scrubber, and the Chrome DevTools offline disconnect test.
3. **NASA Public Domain & Creative Commons Media:**
   - Real NASA DSCOVR EPIC Earth rotation sequences and Mars Curiosity/Perseverance rover footage sourced from `images-api.nasa.gov`.
   - All external media strictly verified as NASA public domain / CC-BY compliant.
4. **CapCut / Final Video Editing Master:**
   - Assembles Remotion clips, OBS screen recordings, presenter PiP overlays, and ambient aerospace audio tracks.
   - Master export specifications: 1920x1080 resolution, 16:9 widescreen, MP4 format (H.264 / AAC, 320 kbps audio, 12 Mbps video bitrate).

### 4.2 Spoken Cadence & Word-Count Allocation
- **Target Cadence:** Exactly 135 words per minute (~2.25 words per second).
- **Word-Count Allocation Table:**
  - Block 1 (WHO: 00:00–00:45 | 45s): ~102 words.
  - Block 2 (WHY: 00:45–01:45 | 60s): ~135 words.
  - Block 3 (WHAT: 01:45–02:45 | 60s): ~136 words.
  - Block 4 (SO WHAT: 02:45–03:40 | 55s): ~124 words.
  - **Total Spoken Words:** ~497 words over 220.0 seconds (leaves a 20.0-second safety cushion before the 240.0-second disqualification threshold).
- **Audio Conduct & Mixing Levels:**
  - Dialog / VO: Normalized to -14 LUFS integrated loudness (-1.0 dB True Peak).
  - Background Music: Ducked to -24 dB during voiceover speech; swells to -16 dB during the 3-second opening hook and closing crescendo.
  - Zero minor voices; recorded by adult team members or high-fidelity neural text-to-speech.

### 4.3 Key Timecoded Subtitle Excerpts (`subtitles_en.srt`)
```srt
1
00:00:00,500 --> 00:00:04,500
"Twinkle, Twinkle, Little Star, how I wonder what you are..."

2
00:00:04,600 --> 00:00:10,000
In Bangladesh, poet Kazi Nazrul Islam wrote: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে..."

3
00:00:10,200 --> 00:00:14,800
("I shall not stay shut in a closed room; I shall see the world...")

4
00:00:15,000 --> 00:00:22,000
We are Team CrewReady from Dhaka: [MEMBER_1], [MEMBER_2], [MEMBER_3], [MEMBER_4], and [MEMBER_5].

5
00:00:30,000 --> 00:00:40,000
We are Gen Z engineers building for Gen Alpha champions to master the science of space colonization.

6
00:00:45,000 --> 00:00:55,000
NASA Space Apps 2026: Build a Junior Astronaut Mission Trainer. Space games are broken.

7
00:01:05,000 --> 00:01:15,000
Coupled Systems Law: Delta Protection-A equals minus Delta Resource-B. Every choice is a trade-off.

8
00:01:25,000 --> 00:01:35,000
CrewReady pairs 3D arcade excitement with real ECLSS thermodynamics in English and Bengali.

9
00:01:45,000 --> 00:01:55,000
Watch live. Our cadet launches Quick Run directly in the browser, dodging debris at 60 FPS.

10
00:02:00,000 --> 00:02:10,000
Mission 2: Real NASA Mars Climate Sounder dust opacity data triggers an atmospheric dust storm!

11
00:02:18,000 --> 00:02:28,000
When systems fail, the Mission Black Box forensic debrief highlights the exact tipping point.

12
00:02:33,000 --> 00:02:43,000
Cadets upgrade water recovery to 98% and unlock live NASA Astronomy Picture of the Day debriefs.

13
00:02:45,000 --> 00:02:55,000
Zero backend failure: Chrome DevTools shows our offline-first PWA caching all assets locally.

14
00:03:05,000 --> 00:03:20,000
Tier 2 roadmap: 4-cadet Multiplayer Co-Op, Zero-G pose workouts, and NASA micro-reels.

15
00:03:25,000 --> 00:03:40,000
Try CrewReady on GitHub at github.com/[REPO_URL]. We are Team CrewReady: Beyond Us!
```

---

## 5. Local Lead Submission Checklist & Rubric Audit

### 5.1 Official 118-Point Judging Rubric Audit
| Rubric Category | Target Score | Video 2 Evidence & Verification Point |
|---|---|---|
| **Impact (20 pts)** | 20 / 20 | Solves Gen Alpha STEM dropout; low-bandwidth offline PWA; demonstrated in Dhaka classroom context. |
| **Creativity (20 pts)** | 20 / 20 | Unique fusion: 3D Three.js runner + coupled ECLSS ledger + Twinkle Socratic drone guide. |
| **Validity (20 pts)** | 20 / 20 | Verified NASA ECLSS mass-balances (NASA/TP-2015-218211) and `[GAME-MODEL ESTIMATE]` disclaimers. |
| **Relevance (20 pts)** | 20 / 20 | Fully executes 2026 Junior Astronaut prompt across Power, Oxygen, Water, Food, Shielding, and Time. |
| **Presentation (20 pts)** | 20 / 20 | Flawless 220s pacing (under 240s cap), authentic WHO/WHY/WHAT/SO WHAT arc, 100% English subtitles. |
| **Teamwork (5 pts)** | 5 / 5 | Full team roll call spoken aloud on camera with multidisciplinary roles displayed. |
| **User Experience (5 pts)** | 5 / 5 | WCAG AAA high-contrast aerospace HUD, 44px touch targets, full English and Bengali parity. |
| **NASA Data Usage (5 pts)** | 5 / 5 | NASA Mars Climate Sounder Level 5 DDR opacity named aloud and shown actively driving gameplay. |
| **Eligibility Gates (3 pts)**| 3 / 3 | Challenge named (1 pt), public GitHub repository opens without login (1 pt), NASA page complete (1 pt). |

### 5.2 Local Lead Google Form & Drive Protocol Checklist
- [ ] **Hard Duration Gate:** Total runtime is verified between 218.0s and 224.0s (strictly $\le 240.0$ seconds).
- [ ] **Team & Member Naming:** Team CrewReady and every single member's full name is spoken aloud and displayed on screen in Block 1.
- [ ] **Official Challenge Named:** "Build a Junior Astronaut Mission Trainer" explicitly stated and cited in the UI.
- [ ] **NASA Datasets Explicitly Named:** Mars Climate Sounder (MCS) DDR V6.2 dust opacity and ISS ECLSS baselines (NASA/TP-2015-218211) named on camera.
- [ ] **Under-18 Child Safety Gate:** Zero faces, voices, or identifiable likenesses of minors appear in any recording.
- [ ] **Zero Backend Proof:** Offline PWA functionality demonstrated on screen with network severed.
- [ ] **Public Open-Source Link:** GitHub repository link displayed on screen and confirmed accessible without login.
- [ ] **Google Drive Permissions:** Google Drive upload link shared with **"Anyone with the link can view"** permissions.
- [ ] **Dual Video Host:** High-resolution MP4 uploaded to unlisted/public YouTube URL and backed up on Google Drive.
- [ ] **Closed Captions Attached:** `subtitles_en.srt` uploaded as sidecar captions file on YouTube and bundled in Google Drive folder.
- [ ] **Licensing & Third-Party Credits:** All third-party 3D models, textures, NASA open APIs, and audio assets credited in the video description.
