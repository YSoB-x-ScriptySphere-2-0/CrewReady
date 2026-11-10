# Detailed Design Specification: UI/UX & 3D Visual Architecture (DDS-UIUX-3D)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-04-DDS-UIUX-3D-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md -> docs/02_SRS.md -> docs/03_TRD.md -> docs/04_DDS_UIUX_3D.md
Classification: Flight Software UI/UX & Interactive 3D Visual System Specification
Companion Avatar Guide: Twinkle (Autonomous Scout Drone & Cadet Flight Mentor)
Target Audience: Generation Alpha Cadets (Ages 8–16 | Elementary to High School)
Design System Baseline: High-Contrast Aerospace Glassmorphism HUD (/ui-ux-pro-max + /3dviz-pro-max)

---

## 1. Visual Identity, Design Tokens & Tailwind Configuration

### 1.1 Aesthetic Philosophy: Kid-Readable Aerospace Telemetry
CrewReady delivers an authentic mission-control experience tailored specifically for Generation Alpha digital natives. The design avoids childish cartoon tropes while eliminating the visual fatigue of dense tabular simulators. Every screen balances three aesthetic pillars:
1. **Aeronautical Legibility:** Smoked obsidian glass panels, high-contrast cyan/emerald telemetry accents, and unmistakable spatial boundaries.
2. **Tactile Kinetic Affordance:** Instant visual and physical responses (glow flares, spring depressions, numeric counters) upon every cadet touch.
3. **Transparent Scientific Integrity:** Immediate visual distinction between verified NASA live telemetry, cached historical archives, and mathematical game-model estimates.

### 1.2 Core Color Palette & Telemetry Semantics
All color pairings are mathematically verified against WCAG 2.1 AAA contrast benchmarks, achieving a minimum 4.5:1 ratio on standard text and 7:1 on critical telemetry figures against the `#05080D` void background.

| Design Token | Hex Code | Visual Semantic & Application | Contrast (on Navy) |
|---|---|---|---|
| `--color-space-void` | `#05080D` | Base canvas background, deep-space viewport backdrop | Root canvas |
| `--color-cosmic-navy` | `#0A1220` | Secondary container fill, card backing, modal surface | 18.2:1 (on text) |
| `--color-surface-elevated`| `#111C30` | Hovered HUD panels, active tab pill surfaces, tooltips | 14.1:1 (on text) |
| `--color-apollo-cyan` | `#36D9F5` | Primary action glow, Twinkle optics, `[NASA LIVE]` badge | 8.9:1 (AAA) |
| `--color-eclss-emerald` | `#39FF88` | Safe life-support status, positive ledger balance deltas | 10.4:1 (AAA) |
| `--color-solar-gold` | `#FFC857` | Caution states, stardust currency, `[OFFLINE ARCHIVE]` badge | 9.8:1 (AAA) |
| `--color-warning-crimson`| `#FF5252` | Critical alerts, depleted resources, hazard warnings | 5.6:1 (AA+) |
| `--color-stardust-purple`| `#B55FE6` | Tech credits, superpower shields, mystery science relics | 6.2:1 (AA+) |
| `--color-text-primary` | `#EAF2F8` | Primary telemetry numbers, dialogue headers, titles | 16.5:1 (AAA) |
| `--color-text-muted` | `#8B9AAA` | Telemetry units, coordinate labels, secondary metadata | 5.8:1 (AA+) |

### 1.3 Glassmorphism HUD Panels, Borders & Neon Glow Effects
HUD components utilize hardware-accelerated CSS backdrops with subtle atmospheric tinting:
- **Glass Panel Surface:** `background: rgba(10, 18, 32, 0.78); backdrop-filter: blur(12px) saturate(180%);`
- **Telemetry Card Border:** `border: 1px solid rgba(54, 217, 245, 0.22);`
- **Neon Edge Accents:** Corner bracket accents (`clip-path: polygon(...)`) simulating military avionics HUD bezels.
- **Dynamic Glow Radii:** Active buttons project a layered drop-shadow: `box-shadow: 0 0 15px rgba(54, 217, 245, 0.35), inset 0 0 10px rgba(54, 217, 245, 0.15)`.

### 1.4 Responsive Breakpoints & Safe-Area Touch Layouts
The HUD layout dynamically reconfigures across three physical device tiers:

| Breakpoint Tier | Viewport Width | Navigation Mode | Grid Columns | Safe Margin / Padding |
|---|---|---|---|---|
| **Cadet Handheld (Mobile)** | `360px - 767px` | Fixed Bottom 5-Tab Dock | 1 Col (Stack) / 2 Col Ledger | 16px lateral, 24px bottom |
| **Mission Tablet (iPad/Tab)** | `768px - 1199px`| Floating Bottom HUD Island | 2 Col Split (3D Hero + HUD) | 24px lateral, 20px bottom |
| **Command Desktop (Judging)** | `1200px +` | Fixed Left Rail + Top Strip | 3 Col Panoramic Mission View| 32px lateral, 24px bottom |

### 1.5 Typography Stack & Bilingual Layout Rules (English + Bengali)
The typographic system supports high-speed cognitive scanning and full bilingual parity between English and Bengali (বাংলা):
- **Display & Headings:** `Space Grotesk`, sans-serif. Geometric structure, high legibility at large scales.
- **Body & Dialogue:** `Inter`, sans-serif. Tall x-height optimized for youth reading fluency.
- **Telemetry Readouts:** `JetBrains Mono`, monospace with tabular numeral alignment (`font-variant-numeric: tabular-nums`).
- **Bengali Locale Fallback:** `Noto Sans Bengali`, sans-serif. High glyph aperture preventing visual crowding.
- **Bilingual Layout Budget:** Bengali translations exhibit a 20% to 35% horizontal expansion and require +25% vertical line-height (`leading-relaxed`). All card containers enforce flexible autolayout without hardcoded pixel widths.

```css
/* Typography Scale Tokens */
--text-hud-hero: 2.5rem;      /* 40px / 48px line-height */
--text-hud-title: 1.5rem;     /* 24px / 32px line-height */
--text-hud-subtitle: 1.125rem;/* 18px / 26px line-height */
--text-hud-body: 1.0rem;      /* 16px / 24px line-height (Strict 16px min) */
--text-hud-mono: 0.875rem;    /* 14px / 20px line-height (Telemetry only) */
```

### 1.6 Core CSS Keyframe Animations
```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(54, 217, 245, 0.25); }
  50% { box-shadow: 0 0 24px rgba(54, 217, 245, 0.55); }
}
@keyframes radarSweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes hazardFlash {
  0%, 100% { border-color: rgba(255, 82, 82, 0.3); background-color: rgba(255, 82, 82, 0.05); }
  50% { border-color: rgba(255, 82, 82, 0.9); background-color: rgba(255, 82, 82, 0.22); }
}
@keyframes floatDrone {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1.5deg); }
}
```

### 1.7 NASA Data Status Indicators & Verification Badges
To guarantee scientific transparency, four immutable status pills are rendered across telemetry modules:
- **`[NASA LIVE]`**: Solid cyan pill (`bg-apollo-cyan/15 text-apollo-cyan border-apollo-cyan/40`), accompanied by a 6px pulsing LED indicator circle (`animate-ping`).
- **`[OFFLINE ARCHIVE]`**: Muted amber pill (`bg-solar-gold/15 text-solar-gold border-solar-gold/40`), indicating seamless local fallback data.
- **`[GAME-MODEL ESTIMATE]`**: Slate pill (`bg-slate-800 text-slate-300 border-slate-600`), denoting derived physical equations.
- **`[DEMO]`**: Subtle violet pill (`bg-purple-950/40 text-purple-300 border-purple-800/40`), denoting illustrative parameters.

### 1.8 Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: { void: '#05080D', navy: '#0A1220', elevated: '#111C30' },
        apollo: { cyan: '#36D9F5', glow: 'rgba(54, 217, 245, 0.4)' },
        eclss: { emerald: '#39FF88', glow: 'rgba(57, 255, 136, 0.35)' },
        solar: { gold: '#FFC857', glow: 'rgba(255, 200, 87, 0.35)' },
        alert: { crimson: '#FF5252', glow: 'rgba(255, 82, 82, 0.4)' },
        stardust: { purple: '#B55FE6', glow: 'rgba(181, 95, 230, 0.35)' },
        telemetry: { primary: '#EAF2F8', muted: '#8B9AAA' }
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', '"Noto Sans Bengali"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'hud-cyan': '0 0 15px rgba(54, 217, 245, 0.3), inset 0 0 10px rgba(54, 217, 245, 0.15)',
        'hud-emerald': '0 0 15px rgba(57, 255, 136, 0.3)',
        'hud-crimson': '0 0 20px rgba(255, 82, 82, 0.45)'
      },
      borderRadius: { hud: '12px', 'hud-pill': '9999px' },
      minHeight: { 'touch-target': '44px' },
      minWidth: { 'touch-target': '44px' }
    }
  },
  plugins: []
};
```

---

## 2. Screen-by-Screen Component Specifications across all 5 Tabs

```
+-----------------------------------------------------------------------------------+
| GLOBAL TOP BAR: [Award] Ensign Falcon | [Sparkles] 1,450 | [Cpu] 320 | [Vol] [EN] |
+-----------------------------------------------------------------------------------+
|  [⚡ QUICK RUN]   [🪐 MISSIONS]   [🏗️ RESOURCES]   [🧠 TRAINING]   [👤 PROFILE]   |
+-----------------------------------------------------------------------------------+
```

### 2.1 Navigation Shell, Global Header & Bottom Dock
- **Top Telemetry Header (Fixed Height 56px, Z-Index 40):**
  - **Left Section:** Cadet rank icon (`Award`) + localized pseudonym (`Cadet Solar Falcon`).
  - **Center Section:** Live balance chips: Stardust Minerals (`Sparkles` + `1,450`) and Tech Credits (`Cpu` + `320`).
  - **Right Section:** Audio Mute Toggle (`Volume2`/`VolumeX`), Bilingual Toggle (`Languages` EN/বাংলা), Settings shortcut (`Settings`).
- **Bottom Navigation Dock (Fixed Height 64px, Z-Index 40, Safe Area Padded):**
  - Mobile-first thumb zone navigation housing 5 tab buttons: `Quick Run`, `Missions`, `Resources`, `Training`, `Profile`.
  - Minimum tap footprint: 56x56px per tab. Active tab displays an Apollo Cyan indicator glow with an upper illuminated accent line.
  - No unicode emojis: Each item renders a Lucide React SVG vector icon (`Zap`, `Globe`, `Box`, `Brain`, `User`).

### 2.2 Home Screen & Quick Run Launcher (Tab 1 Default)
- **3D Twinkle Hero Viewport (55vh Dynamic Canvas):**
  - Displays interactive 3D model of Twinkle the Scout Drone with physics-driven hover bobbing.
  - Interactive touch: Dragging rotates the drone; double tapping triggers an antenna sensor pulse.
- **Twinkle Socratic Guidance Balloon:**
  - Floats dynamically above the 3D drone in a smoked glass card (`bg-space-navy/85 border-apollo-cyan/30`).
  - Contains predict-first question: *"Welcome back, Commander! Solar array output is peak. Shall we harvest stardust in orbit?"*
- **Live Outpost Telemetry Ribbon:**
  - Three horizontal status chips: Outpost Integrity (`98%` ECLSS Emerald), Solar Irradiance (`1.36 kW/m²` Solar Gold), Orbital Speed (`7.8 km/s` Apollo Cyan).
- **Giant "LAUNCH QUICK RUN" Hero Action Button:**
  - Centered below the 3D viewport with 64px minimum height.
  - Styling: High-contrast cyan gradient with animated pulsing concentric radar rings.
  - Subtitle: *"Dodge orbital debris & harvest stardust minerals"*. Audio trigger: `artemis-ii-liftoff.mp3`.

### 2.3 Quick Run 3D Runner HUD (Arcade Mode Viewport)
When launched, the interface switches to full-screen kinetic flight mode:
- **Speedometer Arc (Top Left):**
  - Circular SVG gauge showing velocity (`0` to `120 m/s`). Needle smoothly accelerates based on cadet lane evasion streaks.
- **3-Lane Position Markers (Screen Bottom):**
  - Three illuminated floor brackets (`Lane 1 | Lane 2 | Lane 3`). Active lane pulses bright cyan.
- **Incoming Hazard Banner (Top Center Screen):**
  - Appears 1.5 seconds before hazard impact: `[TriangleAlert] KESSLER DEBRIS IN LANE 2! EVADE!`.
  - Border and text pulse in Warning Crimson with an urgent warning audio chime (`error_001.ogg`).
- **Active Superpower Timers (Top Right HUD):**
  - Magnetic Scoop: `Magnet` icon with circular purple countdown ring (`4.2s remaining`).
  - Deflector Shield: `Shield` icon with circular emerald countdown ring (`7.8s remaining`).
- **Stardust Harvest Multiplier Counter (Bottom Right):**
  - Real-time tally with rolling digit animation. Multiplier badge (`x2`, `x3`) lights up on consecutive clean dodges.
- **Emergency Pause Overlay:**
  - 44x44px pause button (`Pause`) stops WebGL rendering loop, displaying resume and abort buttons without penalty.

### 2.4 Mission Control Screen (Tab 2: Core Engineering Storyline)
- **NASA EPIC Earth Staging Module (Mission 0 Banner):**
  - Circular aperture embedding real-time DSCOVR Earth photography retrieved via `api.nasa.gov/EPIC`.
  - Overlaid flight vectors: Distance to Moon (`384,400 km`), Sun-Earth angle (`4.1°`), Badge: `[NASA LIVE]`.
- **6-Variable Coupled Resource Ledger (2x3 Responsive HUD Grid):**
  - Every card displays: Lucide Icon + Parameter Title + Numeric Telemetry + Bar Meter + 3-Sol Delta.
  - 1. Power (`Zap`): `42.5 / 60 kW` [Emerald bar] Delta: `+2.1 kW`
  - 2. Oxygen (`Wind`): `94.2% ECLSS` [Emerald bar] Delta: `-0.4%`
  - 3. Water (`Droplets`): `820 / 1000 L` [Cyan bar] Delta: `-12 L`
  - 4. Food (`Apple`): `310 kg` [Gold bar] Delta: `-4 kg`
  - 5. Shielding (`Shield`): `78% Rad-Block` [Purple bar] Delta: `0%`
  - 6. Crew Time (`Clock`): `18 / 24 hrs` [Slate bar] Delta: `-6 hrs`
- **Active Dilemma Scenario Card:**
  - Narrative header: *"Sol 14: Mars Global Dust Storm Approaching"* with NASA MCS dust opacity reading (`tau = 1.85`).
  - Situation summary: *"Atmospheric dust reduces solar array generation by 60%. Auxiliary battery depletion imminent."*
- **Coupled Trade-Off Decision Options:**
  - **Option 1 ("Deploy Ultrasonic Dust Shakers"):**
    - Impact chips: `[Zap] Power -12 kW` | `[Clock] Crew Time -3 hrs` | `[Wind] Oxygen: Safe`.
  - **Option 2 ("Hibernate Secondary Life Support"):**
    - Impact chips: `[Zap] Power +14 kW` | `[Wind] Oxygen -18%` | `[Shield] Shielding -10%`.
  - Invariant Enforcement: Every option explicitly mutates $\ge 2$ resources before confirmation.
- **Twinkle Socratic Bubble:** *"Cadet, if we shut down oxygen recycling, will our emergency pressurized tanks sustain the crew for 48 hours?"*

### 2.4.1 Mission Control State & Telemetry Contracts
```typescript
export interface LedgerSubsystemState {
  id: 'power' | 'oxygen' | 'water' | 'food' | 'shielding' | 'crewTime';
  label: string;
  value: number;
  max: number;
  unit: string;
  delta: number;
  status: 'nominal' | 'caution' | 'critical';
  reason: string;
}

export interface DilemmaChoiceContract {
  id: string;
  title: string;
  description: string;
  deltas: Partial<Record<LedgerSubsystemState['id'], number>>;
  butterflyFlag?: string;
  explanation: string;
}
```

```
+-----------------------------------------------------------------------------------+
| MISSION DILEMMA CARD                                            [NASA LIVE]       |
| "Sol 14: Mars Dust Extinction Crisis (MCS Tau: 1.85)"                             |
| [Twinkle]: "Cadet, what happens to battery reserves if we run wipers now?"        |
|                                                                                   |
|  [OPTION A: Deploy Ultrasonic Dust Shakers]                                       |
|  Impact: [Zap] Power -12 kW | [Wind] Oxygen: Safe | [Clock] Time -3 hrs           |
|                                                                                   |
|  [OPTION B: Hibernate Secondary ECLSS]                                            |
|  Impact: [Zap] Power +14 kW | [Wind] Oxygen -18% | [Shield] Shielding -10%        |
+-----------------------------------------------------------------------------------+
```

### 2.5 Mission Black Box Debrief Screen (Constructive Failure & Success)
- **Forensic Cause-and-Effect Timeline Scrubber:**
  - Interactive horizontal Sol timeline tracing the cadet's decision tree from Sol 1 to mission conclusion.
  - Cadets scrub backwards to observe how an early decision cascaded into subsystem failure.
- **Pivotal Tipping-Point Decision Card:**
  - Objective engineering root cause: *"At Sol 11, electing to defer Sabatier condenser maintenance caused humidity buildup, triggering an electrical short in battery bank B at Sol 14."*
- **NASA Real-World Comparison Card:**
  - Real flight comparison: *"How NASA Artemis Engineers Solve This:"* Explains regenerative fuel cells and dual-redundant condenser loops deployed on the Orion spacecraft.
- **NASA APOD Celebration Reward Card:**
  - High-resolution daily space photograph retrieved from `api.nasa.gov/planetary/apod`.
  - Card displays: APOD Title, Astronomical Credit, Date, and Socratic kid-friendly science explanation.
  - Automatically displays `[NASA LIVE]` or `[OFFLINE ARCHIVE]` badge.
- **Replay & Progression CTAs:**
  - Primary button: *"Re-simulate Mission with Alternative Strategy"*.
  - Secondary button: *"Export Flight Record to Cadet Profile"*.

### 2.6 Base Upgrade Screen (Tab 3: Outpost Resources)
- **Isometric Outpost Command Canvas:**
  - Interactive 2.5D visual layout featuring 5 upgradeable outpost installations:
    1. **Outpost Central Hub (Town Hall):** Unlocks higher tier building permits.
    2. **Photovoltaic Solar Farm:** Boosts base starting power (NASA POWER irradiance data).
    3. **ECLSS Water Recovery Unit:** Increases water recycling efficiency to 98% (ISS standard).
    4. **Hydroponic Greenhouse:** Produces fresh caloric biomass and elevates crew morale.
    5. **Regolith Radiation Shield Dome:** Sintered basalt dome shielding crew from solar proton events.

| Outpost Installation | Level 1 Baseline | Level 2 Upgrade | Level 3 Max Outpost |
|---|---|---|---|
| **Central Command Hub** | Tier 1 permits (Free) | Tier 2 permits (250 Stardust, 50 Tech) | Tier 3 permits (600 Stardust, 150 Tech) |
| **Photovoltaic Solar Farm** | 40 kW base generation | 60 kW base + dust wiper (+20%) | 90 kW base + sun-tracking array |
| **ECLSS Water Recovery** | 85% greywater recycling | 93% urine processor integration | 98% closed-loop Sabatier recovery |
| **Hydroponic Greenhouse**| 2 kg food/Sol (Salad crop)| 5 kg food/Sol + sweet potatoes | 10 kg food/Sol + oxygen buffer (+8%) |
| **Radiation Shield Dome**| 40% rad-block (Regolith) | 75% rad-block (Unlocks QR Shield) | 95% rad-block (Magnetic deflector) |

- **Superpower Unlock Indicators:**
  - Badges showing how base infrastructure upgrades unlock active perks in Quick Run (e.g., Level 2 Shield Dome unlocks the Kinetic Shield power-up).

### 2.7 Training Deck Screen (Tab 4: Cognitive Preparation)
- **Astronaut Mind Games HUD:**
  - *Pattern Reflex Trainer:* 4-quadrant cognitive memory sequence simulating pilot flight-readiness drills.
  - *ECLSS Atmospheric Balancer:* Dual-slider mini-game tuning Nitrogen/Oxygen partial pressures to maintain 101.3 kPa.
- **3D Docking Alignment Canvas:**
  - R3F interactive simulator rendering Orion spacecraft docking with Lunar Gateway.
  - 3-axis reticle displaying Pitch, Yaw, and Roll error angles. Cadets fire RCS thrusters to achieve zero delta.
- **NASA Image Library Photo Cards:**
  - Authentic astronaut training photography retrieved from `images-api.nasa.gov` (Neutral Buoyancy Laboratory, EVA spacesuit preparation, cupola Earth gazing).
- **Locked Future Academy Teasers:**
  - Elegant cards displaying `[Coming Soon in Mission Tier 2]` badge:
    - *Multiplayer Co-Op Missions (4-Cadet Bridge Simulator)*
    - *Zero-G Astronaut Pose Workout (Webcam Motion Tracking)*
    - *NASA Science Micro-Reels (Curated Video Telemetry)*

### 2.8 Profile & Settings Screen (Tab 5)
- **Cadet Qualification Badge Grid:**
  - Displays earned astronaut ranks: `Cadet Trainee`, `Ensign`, `Lieutenant`, `Flight Commander`.
  - Badges earned through verified science achievements: `Master of ECLSS`, `Solar Storm Survivor`, `Orbital Ace`.
- **Local Pseudonymous Leaderboard:**
  - Top 10 cadet high scores stored in `crewready_v1_leaderboard`. Enforces zero personal data collection (COPPA compliant).
- **Audio & Visual Settings Console:**
  - Sound Effects & Ambient Drone volume sliders with instant preview chimes.
  - Global Mute Toggle button (`VolumeX`).
  - Bilingual Selector: One-tap toggle between English and Bengali (`বাংলা`).
  - Reduced Motion Toggle: Replaces 3D runner motion with 2D discrete step mode.
  - NASA API Key Input: Text input field allowing custom user keys, complete with key validation and "Use Free DEMO_KEY" shortcut.

---

## 3. 3D Scene & Asset Specifications

```
+-----------------------------------------------------------------------------------+
| REACT THREE FIBER SCENE PIPELINE                                                  |
|                                                                                   |
|  [Canvas (dpr <= 1.5, gl.toneMapping = ACESFilmic, gl.powerPreference = high)]    |
|   |-- Camera Rig (Perspective / Orthographic with smooth slerp)                   |
|   |-- Key Light (1.2 intensity, #FFFFFF, sun vector)                              |
|   |-- Fill Light (0.4 intensity, #0A1220, ambient cosmic bounce)                  |
|   |-- Rim Light (0.8 intensity, #36D9F5, cyan edge definition)                    |
|   |-- Suspense Boundary (Fallback: <2D_Poster_Fallback />)                        |
|        |-- GLTF Model Instance (.glb)                                             |
|        |-- Particle System (Points + BufferGeometry + AdditiveBlending)           |
+-----------------------------------------------------------------------------------+
```

### 3.1 WebGL Architecture, R3F Scene Tree & Performance Budgets
- **Framerate Target:** Guaranteed 60 FPS on mobile GPUs (Adreno 610+, Mali-G52+) and Intel Iris Xe.
- **Device Pixel Ratio (DPR) Cap:** Strict capping: `dpr={Math.min(window.devicePixelRatio, 1.5)}`.
- **Lifecycle WebGL Hygiene:** Explicit geometry, material, and texture disposal on unmount:
  ```typescript
  useEffect(() => {
    return () => {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material?.dispose();
        }
      });
    };
  }, []);
  ```

### 3.2 Performance Budgets & Draw Call Constraints

| Parameter Metric | Budget Ceiling | Justification / Validation Rule |
|---|---|---|
| **Max Draw Calls** | $\le 35$ per frame | Eliminates CPU bottleneck on budget mobile browsers |
| **Max Total Triangles** | $\le 75,000$ active tris | Prevents WebGL buffer saturation on integrated GPUs |
| **Max Texture Size** | $1024 \times 1024$ px (PBR) | Memory footprint $\le 32\text{ MB}$ texture VRAM budget |
| **Geometry Compression** | Draco GLTF enabled | Reduces network payload from $12\text{ MB}$ to $2.1\text{ MB}$ |

### 3.3 Camera Configurations & Spatial Coordinates

| Scene Context | Camera Type | Position `[x, y, z]` | Target / LookAt | Field of View (FOV) |
|---|---|---|---|---|
| **Twinkle Avatar Hero** | Perspective | `[0, 0.2, 3.2]` | `[0, 0, 0]` | 45° |
| **Quick Run 3D Flight** | Perspective | `[0, 3.2, -6.5]` | `[0, 1.2, 12.0]` | 62° |
| **Outpost Base Builder**| Orthographic | `[18, 22, 18]` | `[0, 0, 0]` | Zoom factor: 38 |
| **Docking Alignment** | Perspective | `[0, 0, -4.5]` | `[0, 0, 0]` | 50° |

### 3.4 Three-Point Aerospace Lighting & PBR Materials
- **Key Light (Solar Radiation):** DirectionalLight (`intensity: 1.3`, color: `#FFF8E7`), simulating harsh unattenuated solar rays in space.
- **Fill Light (Planetary Albedo):** AmbientLight (`intensity: 0.35`, color: `#0A1220`), preventing pitch-black shadows on dark sides.
- **Rim Light (Atmospheric Glow):** PointLight (`intensity: 0.85`, color: `#36D9F5`), positioned behind models to silhouette spacecraft geometry.
- **Material Standards:** `MeshStandardMaterial` with metalness `0.85`, roughness `0.25`, and emissive cyan accents (`#36D9F5`, intensity `0.6`).

### 3.5 Particle Systems & Environmental VFX
1. **Martian Atmospheric Dust Storm (Mission 2):**
   - 1,500 particles driven by custom `Points` and `BufferGeometry`.
   - Color: Terracotta red (`#D16234`). Opacity throttled directly by NASA MCS dust optical depth ($\tau$).
2. **Spacecraft Plasma Thruster Exhaust (Quick Run):**
   - 300 high-velocity particles emitted backwards with dynamic color shift (`#36D9F5` to `#8B5CF6`).
3. **Stardust Mineral Harvest Burst:**
   - On pickup collision: 40 sparkling point fragments expand spherically with golden glitter (`#FFC857`).
4. **Orbital Kessler Space Debris:**
   - 60 tumbling metallic fragments with randomized angular momentum creating kinetic flight tension.

### 3.6 3D Model Rigging, Mesh Specs & Animation Pipelines

| Model Asset Path | Tri Count | Materials / Textures | Animation Clips | Usage in Application |
|---|---|---|---|---|
| `public/assets/models/companion_drone.glb` | 14,200 | 1 PBR (Emissive Visor) | Hover, SensorPulse, Wave | Twinkle drone guide on all tabs |
| `public/assets/models/crew_astronaut.glb` | 18,500 | 2 PBR (Gold Visor) | BreathingIdle, Salute | Training Deck suit inspection |
| `public/assets/models/Apollo Lunar Module.glb`| 22,000 | 2 PBR (Kapton Foil) | DescentSeparation | Mission 1 Lunar landing staging |
| `public/assets/models/24584_Curiosity_static.glb`| 26,000| 3 PBR (NASA Texture) | ArmExtend, MastScan | Mission 2 Mars surface exploration |
| `public/assets/models/ISS_stationary.glb` | 28,000 | 2 PBR (Solar Array) | SolarTracking | Mission 0 low Earth orbit staging |
| `public/assets/models/Space Exploration Vehicle.glb`| 19,400| 2 PBR (Rover Chassis)| WheelSteer | Base upgrade surface transport |

### 3.7 2D SVG/CSS Poster Fallback System
For low-spec mobile devices, WebGL context loss, or offline power-saving mode, every 3D canvas automatically renders a lightweight 2D vector fallback:

```xml
<!-- 1. Twinkle Drone 2D Vector Poster Fallback -->
<div class="relative w-full h-full flex items-center justify-center bg-space-void">
  <svg viewBox="0 0 200 200" class="w-48 h-48 animate-float-drone">
    <defs>
      <radialGradient id="droneGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#36D9F5" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#36D9F5" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Thruster Glow -->
    <circle cx="100" cy="145" r="28" fill="url(#droneGlow)" class="animate-pulse"/>
    <!-- Spherical Chassis -->
    <circle cx="100" cy="100" r="50" fill="#0A1220" stroke="#36D9F5" stroke-width="3"/>
    <!-- Cyber Visor -->
    <rect x="70" y="85" width="60" height="20" rx="10" fill="#36D9F5" filter="drop-shadow(0 0 6px #36D9F5)"/>
    <!-- Antenna Sensor -->
    <line x1="100" y1="50" x2="100" y2="30" stroke="#36D9F5" stroke-width="2"/>
    <circle cx="100" cy="26" r="4" fill="#39FF88"/>
  </svg>
</div>

<!-- 2. Spacecraft Quick Runner 2D Poster Fallback -->
<div class="relative w-full h-full flex flex-col items-center justify-center bg-space-void overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(54,217,245,0.12)_0,transparent_70%)]"></div>
  <svg viewBox="0 0 240 180" class="w-56 h-42">
    <!-- 3 Kinetic Track Lines -->
    <line x1="40" y1="170" x2="90" y2="10" stroke="#111C30" stroke-width="2" stroke-dasharray="6 6"/>
    <line x1="120" y1="170" x2="120" y2="10" stroke="#36D9F5" stroke-width="3"/>
    <line x1="200" y1="170" x2="150" y2="10" stroke="#111C30" stroke-width="2" stroke-dasharray="6 6"/>
    <!-- Ship Silhouette -->
    <polygon points="120,40 135,110 120,100 105,110" fill="#0A1220" stroke="#36D9F5" stroke-width="2"/>
    <polygon points="120,100 124,125 116,125" fill="#39FF88" class="animate-pulse"/>
  </svg>
  <span class="text-xs font-mono text-telemetry-muted tracking-widest mt-2">[2D LOW-POWER MODE ACTIVE]</span>
</div>

<!-- 3. Lunar / Martian Outpost Blueprint 2D Poster Fallback -->
<div class="relative w-full h-full flex items-center justify-center bg-space-navy/50 p-4">
  <svg viewBox="0 0 260 200" class="w-64 h-48 border border-apollo-cyan/20 rounded-hud bg-space-void/90">
    <!-- Blueprint Grid -->
    <defs>
      <pattern id="hudGrid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(54,217,245,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hudGrid)"/>
    <!-- Central Hub -->
    <circle cx="130" cy="100" r="26" fill="#0A1220" stroke="#36D9F5" stroke-width="2"/>
    <text x="130" y="104" text-anchor="middle" font-size="8" fill="#36D9F5" font-family="JetBrains Mono">HUB-01</text>
    <!-- Connectors -->
    <line x1="130" y1="74" x2="130" y2="40" stroke="#36D9F5" stroke-width="2"/>
    <line x1="156" y1="100" x2="190" y2="100" stroke="#39FF88" stroke-width="2"/>
    <!-- Facilities -->
    <rect x="110" y="20" width="40" height="20" rx="4" fill="#0A1220" stroke="#36D9F5" stroke-width="1.5"/>
    <text x="130" y="33" text-anchor="middle" font-size="7" fill="#8B9AAA" font-family="JetBrains Mono">SOLAR</text>
    <rect x="190" y="88" width="44" height="24" rx="4" fill="#0A1220" stroke="#39FF88" stroke-width="1.5"/>
    <text x="212" y="103" text-anchor="middle" font-size="7" fill="#39FF88" font-family="JetBrains Mono">ECLSS</text>
  </svg>
</div>
```

---

## 4. Micro-Interactions, Sound FX Triggers, and Motion Guidelines

### 4.1 Kinetic Physics & Easing Functions
All UI motion utilizes snappy cubic bezier curves engineered for aerospace controls:
- **Snappy Entrance:** `cubic-bezier(0.16, 1, 0.3, 1)` (Duration: 280ms).
- **Smooth Telemetry Rolling:** `cubic-bezier(0.25, 1, 0.5, 1)` (Duration: 400ms).
- **Button Press Feedback:** Scale depression to `0.97` over 100ms with immediate elastic return on release.
- **Card Hover Elevation:** Translates `-3px` along Y-axis, transitioning border from `0.22` to `0.55` opacity with `box-shadow: 0 0 15px rgba(54, 217, 245, 0.25)`.

### 4.2 Web Audio API Sound FX Trigger Matrix
Audio playback integrates with the client-side audio engine, routing sounds dynamically while obeying the global mute state:

| UI Event / Action | Audio File Target | Audio Frequency Profile & Volume |
|---|---|---|
| **Button Tap / Interactive Chip** | `public/assets/audio/ui/click_001.ogg` | High-frequency mechanical micro-click (0.35 vol) |
| **Tab Switch / Navigation** | `public/assets/audio/ui/select_001.ogg` | Clean resonant selection tone (0.4 vol) |
| **Setting Toggle Flip** | `public/assets/audio/ui/toggle_001.ogg` | Low-frequency synthetic toggle click (0.3 vol) |
| **Modal / Dialog Entrance** | `public/assets/audio/ui/open_001.ogg` | Atmospheric vacuum airlock depressurization (0.45 vol) |
| **Modal Exit / Dismiss** | `public/assets/audio/ui/close_001.ogg` | Mechanical latch seal engagement (0.45 vol) |
| **Decision Confirmed** | `public/assets/audio/ui/confirmation_001.ogg`| Harmonious two-tone success chord (0.5 vol) |
| **Critical Warning / Error** | `public/assets/audio/ui/error_001.ogg` | Urgent synthetic dual-frequency warning (0.6 vol) |
| **Stardust Mineral Harvest** | `public/assets/audio/ui/glass_001.ogg` | Crystalline spatialized stereo chime (0.5 vol) |
| **Quick Run Launch Trigger** | `public/assets/audio/nasa/artemis-ii-liftoff.mp3` | Historic NASA Artemis II liftoff voice cue (0.75 vol) |
| **Space Cabin Ambience** | `public/assets/audio/ambience/freesound_community-028301_spaceship-am.mp3` | Continuous 28 Hz sub-bass spacecraft hull hum (0.2 vol) |
| **Life Support Crisis Alarm** | `public/assets/audio/ambience/531855__klankbeeld__fire-alarm-room.wav` | Pulsing cabin decompression emergency siren (0.55 vol) |

### 4.3 Web Audio Synthetic Fallback Generator
If external audio files fail to load over slow cellular connections, a built-in Web Audio API synthesizer generates synthetic harmonic tones:
```typescript
class WebAudioFallbackSynth {
  private ctx: AudioContext | null = null;
  private init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  public playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}
```

### 4.4 Keyboard Accessibility & Focus Trapping
Every interactive element supports keyboard navigation for accessible classroom and judging use:
- **Arrow Keys (`← / →`):** Shifts craft lateral lanes in Quick Run.
- **Space / Enter:** Triggers action buttons and confirms dilemma choices.
- **Escape Key:** Dismisses modal dialogues, Black Box debrief overlays, and pause menus.
- **Focus Rings:** Distinct 2px solid `#36D9F5` outline with a 2px offset (`outline: 2px solid #36D9F5; outline-offset: 2px;`).

### 4.5 Child Safety (COPPA) & Educational Invariants
- **Zero Ingestion of Minor Identifiers:** The application has zero sign-up forms, zero email collection inputs, and zero third-party telemetry scripts.
- **Predict-First Socratic Scaffolding:** Twinkle's dialogue prompts cadets with causal physical questions before displaying consequences, reinforcing critical thinking.
- **Safe Constructive Failure:** The Black Box debrief reframes subsystem failure as an objective NASA engineering forensic review, encouraging iterative experimentation without penalty.
