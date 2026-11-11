> **Superseded in part by plan.md v7 (mentor pivot).** The game is now one Earth-to-Mars mission with six levels and four meters; base building, training deck, Moon mission, 3D runner and PWA are cut. Where this file disagrees with `plan.md`, `docs/00`, `docs/06` or `docs/08`, those win. Kept for reference only.

# Technical Asset Manifest & Pipeline Specification (DDS-ASSET)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-07-ASSET-MANIFEST-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md -> docs/04_DDS_UIUX_3D.md -> docs/07_ASSET_MANIFEST.md
Classification: Client-Side Digital Asset Registry, Audio Pipeline & Licensing Manifest
Target Environment: Static PWA / WebGL 60 FPS Mobile GPU Performance Budget

---

## 1. 3D Model Registry & Optimization Pipeline

All 3D assets reside locally in `public/assets/models/`. Every mesh uses glTF 2.0 binary (`.glb`) with Draco geometry compression, maximum $1024 \times 1024$ PBR texture atlases, and pre-baked animation channels. Models are pre-transformed with origin centered at the center of mass.

| Asset Filename | Visual Subject & Role | Polygon Budget | File Size | Animation Clips | 2D Poster Fallback Path |
|---|---|---|---|---|---|
| `companion_drone.glb` | **Twinkle** Autonomous Drone Guide | 14,200 tris | 1.8 MB | `idle_bob`, `fly_propel`, `alert_scan` | `/assets/posters/twinkle_2d.svg` |
| `crew_astronaut.glb` | Hero EVA Astronaut Avatar | 18,500 tris | 2.4 MB | `idle_breathing`, `salute`, `checklist_tap` | `/assets/posters/astronaut_2d.svg` |
| `24584_Curiosity_static.glb`| Mars Jezero Rover Exploration | 26,000 tris | 3.2 MB | Static (arm articulated via bones) | `/assets/posters/curiosity_2d.svg` |
| `Apollo Lunar Module.glb` | Shackleton Crater Historical Base | 22,000 tris | 2.9 MB | Static (separate descent stage mesh) | `/assets/posters/lunar_module_2d.svg` |
| `ISS_stationary.glb` | Orbital Staging Science Complex | 28,000 tris | 3.6 MB | `solar_truss_rotate` | `/assets/posters/iss_2d.svg` |
| `Space Exploration Vehicle.glb`| Outpost Surface Transport Rover | 19,400 tris | 2.2 MB | `wheel_roll`, `steering_yaw` | `/assets/posters/sev_rover_2d.svg` |

### 1.1 Detailed Animation Clip Specifications
- **`companion_drone.glb` (Twinkle):**
  - `idle_bob`: 120 frames @ 30 FPS, smooth vertical sine wave oscillation ($\pm 0.12\text{ m}$) with a $\pm 1.5^\circ$ roll tilt.
  - `fly_propel`: 60 frames @ 30 FPS, forward nose pitch ($12^\circ$ down), active engine bell particle emission triggers.
  - `alert_scan`: 90 frames @ 30 FPS, horizontal sweeping yaw ($\pm 35^\circ$) with rapid flashing cyan eye visor.
- **`crew_astronaut.glb`:**
  - `idle_breathing`: 150 frames @ 30 FPS, subtle chest cavity volume expansion and visor specular shift.
  - `salute`: 75 frames @ 30 FPS, right arm raises to helmet brow, honoring cadet mission completion.
  - `checklist_tap`: 90 frames @ 30 FPS, left wrist forearm display interaction during Training Deck drills.

### 1.2 Procedural Obstacles & Collectibles Registry (Quick Run)
To minimize draw calls and disk payloads, arcade runner entities are constructed via procedural Three.js geometries with custom GLSL PBR materials:

| Entity Name | Geometry Primitive | Visual Material & Shader Profile | Gameplay Collision Box |
|---|---|---|---|
| **Micrometeoroid** | `DodecahedronGeometry(0.4, 1)` | Iron-nickel bump texture, tumbling tumble physics | Spherical radius: $0.45\text{ m}$ |
| **Kessler Debris Satellite** | `CylinderGeometry` + Solar Panel Planes | Specular foil `#EAF2F8`, broken antenna array | Bounding box: $1.2 \times 0.6 \times 0.6\text{ m}$ |
| **Solar Flare Ring** | `TorusGeometry(1.2, 0.15, 16, 48)` | Additive glowing plasma `#FFC857` with pulse | Annular ring: $r_{\text{in}}=1.05\text{ m}, r_{\text{out}}=1.35\text{ m}$ |
| **Stardust Crystal** | `OctahedronGeometry(0.35, 0)` | Refractive dielectric purple `#B55FE6` + spark halo | Spherical pickup trigger: $0.60\text{ m}$ |
| **Auxiliary Energy Cell** | `CylinderGeometry(0.2, 0.2, 0.6, 12)` | High-emissive Apollo Cyan `#36D9F5` cylinder | Cylindrical pickup trigger: $0.50\text{ m}$ |

### 1.3 2D SVG/PNG Poster Fallback Pipeline
For low-spec mobile GPUs or WebGL initialization delays, every 3D model maintains an exact 2D vector fallback:
- **Twinkle Drone (`/assets/posters/twinkle_2d.svg`):** Scalable vector graphic rendering Twinkle's spherical chassis, glowing cyan visor, antenna sensor, and pulsing thruster glow.
- **Astronaut Avatar (`/assets/posters/astronaut_2d.svg`):** Clean aerospace silhouette in white and Apollo Cyan with reflective gold visor.
- **Curiosity Rover (`/assets/posters/curiosity_2d.svg`):** Technical schematic side-elevation on dark cosmic navy grid paper.
- **Lunar Module (`/assets/posters/lunar_module_2d.svg`):** Two-stage Apollo LM descent/ascent blueprint with gold foil hatch accents.

```xml
<!-- Inline Poster Sample: Twinkle Autonomous Scout Drone -->
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
  <circle cx="50" cy="50" r="32" fill="#0A1220" stroke="#36D9F5" stroke-width="2.5"/>
  <rect x="30" y="42" width="40" height="14" rx="7" fill="#36D9F5" filter="drop-shadow(0 0 4px #36D9F5)"/>
  <line x1="50" y1="18" x2="50" y2="8" stroke="#36D9F5" stroke-width="2"/>
  <circle cx="50" cy="6" r="3" fill="#39FF88"/>
  <ellipse cx="50" cy="80" rx="14" ry="4" fill="rgba(54, 217, 245, 0.4)"/>
</svg>
```

### 1.4 PBR Material Slots & Texture Channel Packing
To minimize VRAM overhead on mobile chipsets, all PBR texture maps are channel-packed:

| Texture Map | Channel Composition | Resolution | Compression Format |
|---|---|---|---|
| **Albedo / BaseColor** | RGB: Base Diffuse Color, A: Alpha Cutout | $1024 \times 1024$ | KTX2 / Basis Universal |
| **Normal Map** | RGB: Tangent Space Normal (OpenGL $+Y$) | $1024 \times 1024$ | KTX2 / Basis Universal |
| **ARM Packed Map** | R: Ambient Occlusion, G: Roughness, B: Metalness | $1024 \times 1024$ | KTX2 / Basis Universal |
| **Emissive Map** | RGB: Glow Color (`#36D9F5` / `#39FF88`) | $512 \times 512$ | KTX2 / Basis Universal |

---

## 2. Audio Asset Map & Sound FX Pipeline

Audio files live in `public/assets/audio/`. The audio pipeline guarantees **zero autoplay**; playback strictly activates upon explicit cadet interaction and respects global mute. Formats are compressed `.ogg` (Vorbis) for modern web engines, `.mp3` for voice recordings, and uncompressed `.wav` for low-latency alarms.

| File Path | Audio Category | Frequency & Bitrate | Trigger Event / Function | Polyphony Limit |
|---|---|---|---|---|
| `public/assets/audio/ui/click_001.ogg` | UI Micro-Interaction | 44.1 kHz, 96 kbps | Cadet button tap, option focus | 4 channels |
| `public/assets/audio/ui/click_002.ogg` | UI Micro-Interaction | 44.1 kHz, 96 kbps | Subsystem toggle flip | 4 channels |
| `public/assets/audio/ui/select_001.ogg` | Navigation Feedback | 44.1 kHz, 112 kbps | Bottom tab switch (`Quick Run`, `Missions`) | 2 channels |
| `public/assets/audio/ui/open_001.ogg` | Modal Transition | 44.1 kHz, 128 kbps | Science Provenance drawer entrance | 1 channel |
| `public/assets/audio/ui/close_001.ogg` | Modal Transition | 44.1 kHz, 128 kbps | Dialog dismissal, airlock seal sound | 1 channel |
| `public/assets/audio/ui/confirmation_001.ogg`| Positive Feedback | 44.1 kHz, 128 kbps | Trade-off decision confirmation | 2 channels |
| `public/assets/audio/ui/error_001.ogg` | Caution Alert | 44.1 kHz, 128 kbps | Subsystem limit breach, hazard collision | 2 channels |
| `public/assets/audio/ui/glass_001.ogg` | Collectible Feedback | 44.1 kHz, 128 kbps | Stardust crystal harvested in runner | 6 channels |
| `public/assets/audio/nasa/artemis-ii-liftoff.mp3`| Historical Aerospace | 44.1 kHz, 160 kbps | "LAUNCH QUICK RUN" hero action button | 1 channel |
| `public/assets/audio/nasa/artemis-ii-launch-orion-communications-check...` | Mission Atmosphere | 44.1 kHz, 128 kbps | Mission 0 staging radio chatter | 1 channel |
| `public/assets/audio/ambience/freesound_community-028301_spaceship-am.mp3` | Continuous Ambience | 44.1 kHz, 112 kbps | Sub-bass 28 Hz habitat cabin loop (0.15 vol) | 1 looping channel |
| `public/assets/audio/ambience/531855__klankbeeld__fire-alarm-room.wav` | Crisis Siren | 44.1 kHz, 16-bit PCM | Emergency ECLSS life-support failure | 1 looping channel |

### 2.1 Audio Preloading & CacheStorage Strategy
The client Service Worker preloads core UI sound effects on application boot. Ambience audio tracks stream on demand to avoid delaying first contentful paint (FCP). If audio loading fails, the built-in Web Audio API oscillator synthesis triggers automatically as an emergency fallback:

```typescript
// Emergency Web Audio Synthesizer Fallback
export function synthesizeBeep(frequency: number = 880, duration: number = 0.08): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('[AUDIO] Audio synthesis unsupported or blocked:', err);
  }
}
```

---

## 3. 2D UI Icons, Badges & Vector Graphics

CrewReady strictly bans unicode emojis across all production HUD displays, enforcing high-contrast Lucide React SVG vectors and custom aerospace insignia:

### 3.1 Lucide React Telemetry Vector Mapping
- **Power Subsystem:** `<Zap className="w-5 h-5 text-solar-gold" />`
- **Oxygen ECLSS:** `<Wind className="w-5 h-5 text-eclss-emerald" />`
- **Potable Water:** `<Droplets className="w-5 h-5 text-apollo-cyan" />`
- **Food Reserves:** `<Apple className="w-5 h-5 text-solar-gold" />`
- **Radiation Shield:** `<Shield className="w-5 h-5 text-stardust-purple" />`
- **Crew Sol Time:** `<Clock className="w-5 h-5 text-telemetry-muted" />`
- **Currency - Stardust:** `<Sparkles className="w-4 h-4 text-solar-gold" />`
- **Currency - Tech Credits:** `<Cpu className="w-4 h-4 text-apollo-cyan" />`
- **Cadet Rank:** `<Award className="w-5 h-5 text-apollo-cyan" />`
- **System Hazard Alert:** `<TriangleAlert className="w-5 h-5 text-alert-crimson" />`

### 3.2 Custom Mission Patches & Status Badges
- **Mission 0 Patch (`mission0_patch.svg`):** Circular vector patch showing Earth full-disc, Artemis trajectory, and Apollo Cyan vector chevron.
- **Mission 1 Patch (`mission1_patch.svg`):** Hexagonal lunar polar badge depicting Shackleton Crater rim, sunlight ridge, and frozen ice crystal.
- **Mission 2 Patch (`mission2_patch.svg`):** Shield badge featuring Jezero delta topography, Curiosity rover track, and terracotta dust gale.
- **Status Pills:**
  - `[NASA LIVE]`: Cyan pill with pulsating circular radar LED ring (`animate-ping`).
  - `[OFFLINE ARCHIVE]`: Amber badge with static radio dish icon.
  - `[GAME-MODEL ESTIMATE]`: Monospace slate badge with balance scale icon.

### 3.3 Cadet Rank Insignia Vector Suite
- **Cadet Trainee:** Single Apollo Cyan chevron outline (`chevron-up`).
- **Ensign:** Double stacked chevrons with emerald center pip.
- **Lieutenant:** Triple chevrons with solar gold center star.
- **Flight Commander:** Quad chevrons flanked by stylized delta wings.
- **Flight Director:** Golden laurel wreath surrounding the Artemis orbit trajectory.

### 3.4 Custom Mission Patch Vector Specifications
```xml
<!-- Mission 0 Patch: Earth Orbital Staging -->
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16">
  <circle cx="60" cy="60" r="56" fill="#0A1220" stroke="#36D9F5" stroke-width="3"/>
  <circle cx="60" cy="60" r="32" fill="#111C30" stroke="#39FF88" stroke-width="1.5" stroke-dasharray="4 2"/>
  <path d="M 40 75 Q 60 30 80 75" fill="none" stroke="#36D9F5" stroke-width="2"/>
  <circle cx="60" cy="45" r="4" fill="#FFC857"/>
  <text x="60" y="105" text-anchor="middle" font-size="8" fill="#EAF2F8" font-family="Space Grotesk">ORBIT-0</text>
</svg>

<!-- Mission 1 Patch: Shackleton Polar Base -->
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16">
  <polygon points="60,6 112,36 112,96 60,114 8,96 8,36" fill="#0A1220" stroke="#FFC857" stroke-width="3"/>
  <circle cx="60" cy="60" r="28" fill="#05080D" stroke="#36D9F5" stroke-width="2"/>
  <path d="M 50 60 L 60 48 L 70 60 L 60 72 Z" fill="#36D9F5"/>
  <text x="60" y="100" text-anchor="middle" font-size="8" fill="#FFC857" font-family="Space Grotesk">SHACKLETON</text>
</svg>

<!-- Mission 2 Patch: Jezero Colony Delta -->
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" class="w-16 h-16">
  <path d="M 60 8 L 112 30 L 112 85 Q 60 116 60 116 Q 8 85 8 85 L 8 30 Z" fill="#0A1220" stroke="#FF5252" stroke-width="3"/>
  <circle cx="60" cy="55" r="24" fill="#111C30" stroke="#D16234" stroke-width="2"/>
  <path d="M 46 65 Q 60 45 74 65" fill="none" stroke="#FFC857" stroke-width="2.5"/>
  <text x="60" y="102" text-anchor="middle" font-size="8" fill="#FF5252" font-family="Space Grotesk">JEZERO-MARS</text>
</svg>
```

---

## 4. Pre-Bundled Static JSON Data Fixtures

All fixture datasets are pre-packaged in `public/assets/data/` to ensure immediate `OFFLINE=1` runtime resilience:

| JSON File Path | Originating NASA Source | Payload Size | Offline Gameplay Functionality |
|---|---|---|---|
| `public/assets/data/mcs_dust_records.json` | MRO Mars Climate Sounder (PDS DDR V6.2) | 14 KB | Martian dust optical depths ($\tau = 0.22\text{ to }1.85$) |
| `public/assets/data/iss_eclss_rates.json` | NASA/TP-2015-218211 ECLSS Baselines | 8 KB | Daily metabolic rates ($0.84\text{ kg }\text{O}_2, 2.5\text{ L }\text{H}_2\text{O}$) |
| `public/assets/data/apod_fixtures.json` | NASA APOD Archive (`api.nasa.gov`) | 22 KB | 14 curated high-res cosmic images and science texts |
| `public/assets/data/epic_fixtures.json` | DSCOVR EPIC Instrument Team | 18 KB | Earth full-disc imagery records with J2000 coordinates |
| `public/assets/data/nasa_images_fixtures.json`| NASA Image & Video Library | 28 KB | 20 verified astronaut EVA training photographs |
| `public/assets/data/strings.json` | CrewReady Localization Team | 34 KB | Complete English & Bengali (`বাংলা`) translation strings |

### 4.1 Sample Fixture Data Contracts
```json
// Sample: public/assets/data/iss_eclss_rates.json
{
  "sourceDoc": "NASA/TP-2015-218211",
  "rates": {
    "oxygen_consumption_kg_per_day": 0.84,
    "co2_production_kg_per_day": 1.00,
    "water_requirement_liters_per_day": 2.50,
    "sabatier_loop_closure_rate": 0.50,
    "urine_processor_recovery_rate": 0.98
  }
}
```

---

## 5. Asset Performance Budgets per Viewport

To maintain solid 60 FPS on mobile GPUs (Adreno 610, Mali-G52) and budget laptops:

| Viewport / Tab Scene | Max Active Polygons | Max Draw Calls | VRAM Budget | Device Pixel Ratio (DPR) |
|---|---|---|---|---|
| **Tab 1: Home (Twinkle Hero)** | 18,000 tris | $\le 16$ calls | 18 MB | `Math.min(window.devicePixelRatio, 1.5)` |
| **Tab 1: Quick Run 3D Flight** | 32,000 tris | $\le 28$ calls | 32 MB | `Math.min(window.devicePixelRatio, 1.5)` |
| **Tab 2: Mission Control (EPIC)** | 1,200 tris | $\le 10$ calls | 12 MB | `1.0` (Fixed 2D canvas overlay) |
| **Tab 3: Outpost Base Builder** | 45,000 tris | $\le 35$ calls | 42 MB | `Math.min(window.devicePixelRatio, 1.5)` |
| **Tab 4: Training Docking Sim** | 24,000 tris | $\le 20$ calls | 24 MB | `Math.min(window.devicePixelRatio, 1.5)` |

### 5.1 WebGL Memory Hygiene & Garbage Collection
- **Geometry Disposal:** Every custom mesh calls `geometry.dispose()` on unmount.
- **Texture Eviction:** Materials call `texture.dispose()` to prevent mobile GPU context loss.
- **Mipmapping Strategy:** Mipmaps are generated only on diffuse albedo textures; normal and roughness maps use linear filtering without redundant mipmap allocations.
- **Frame Drop Watchdog:** If framerate falls below 45 FPS for 3 consecutive seconds, the engine automatically throttles DPR to `1.0` and hides dynamic dust particle systems.

---

## 6. License, Provenance & Attribution Registry

All incorporated digital assets comply with open-source and educational distribution standards:

1. **Software & Custom Art:** Licensed under the **Apache License 2.0**.
2. **NASA 3D Models & Imagery:** Sourced from official NASA 3D Resources (`nasa3d.arc.nasa.gov`), NASA Image and Video Library (`images.nasa.gov`), and DSCOVR EPIC. Per NASA Media Usage Guidelines, NASA content is not protected by copyright and is in the public domain for educational and non-commercial projects.
3. **Audio Sound FX:**
   - NASA Artemis liftoff audio clips: Public domain US Government work.
   - UI sounds (`click`, `select`, `confirmation`, `toggle`, `open`, `close`): CC0 1.0 Universal Public Domain Dedication.
   - Spaceship ambience drone (`freesound_community-028301`): Creative Commons Attribution (CC BY 3.0 / CC0).
4. **Vector Typography:**
   - Space Grotesk: SIL Open Font License (OFL 1.1).
   - Inter: SIL Open Font License (OFL 1.1).
   - JetBrains Mono: Apache License 2.0.
   - Noto Sans Bengali: SIL Open Font License (OFL 1.1).

### 6.1 Attribution Notice Template for In-App Credits Drawer
```
CrewReady: Beyond Us
Developed for the NASA Space Apps Challenge 2026.
Astronaut models, Curiosity Rover, and Lunar Module assets courtesy of NASA 3D Resources.
Planetary atmospheric extinction profiles provided by NASA Planetary Data System (MCS DDR V6.2).
Solar irradiance baselines courtesy of NASA POWER Project (NASA Langley Research Center).
Audio telemetry and countdown recordings courtesy of NASA Artemis Program.
Interface vectors provided by Lucide Icons (ISC License).
```
