# Official Character Concept Sheet & Turnaround Specification
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-CHARACTER-SHEET-V1.0
System Authority: `plan.md` $\rightarrow$ `docs/00_PROJECT_CONTEXT.md` $\rightarrow$ `docs/01_PRD.md` $\rightarrow$ `docs/04_DDS_UIUX_3D.md` $\rightarrow$ `docs/CHARACTER_CONCEPT_SHEET.md`
Classification: Official 3D Rigging, Turnaround & Character Design Reference
Aesthetic Target: Pixar Character Appeal meets Authentic NASA Aerospace Hardware (/3dviz-pro-max + /ui-ux-pro-max)

---

## 1. Visual Style & Global Aesthetic Rules

- **Design Philosophy:** "Pixar Charm $\times$ NASA Aerospace Precision". Characters possess expressive, age-appropriate facial anatomy (appealing proportions, large warm eyes, natural 12-year-old silhouette) merged with structurally accurate Extravehicular Mobility Unit (EMU / xEMU / Artemis xEVAS) space gear.
- **Background Setting:** Dark Cosmic Navy (`#0A1220`) engineering grid with subtle `#36D9F5` laser measurement coordinates, scale ticks (cm/inches), and aerospace callouts.
- **Textile & Material Realism:**
  - Multi-layer Thermal Micrometeoroid Garment (TMG) white Ortho-Fabric with micro-ripstop texture (Roughness: `0.72`, Metalness: `0.05`).
  - Anodized Aluminum & Titanium joint bearings at shoulders, elbows, hips, and knees for realistic pressurization flex.
  - Optical-grade Polycarbonate bubble visor with dual-layer anti-reflective and vacuum-deposited vapor gold solar coating.
  - Luminescent silicone piping and active fiber-optic telemetry seams (`#36D9F5` / `#39FF88`).

---

## 2. Character 1: Cadet Orbit (Lead Pilot & Explorer)

### 2.1 Identity & Demographics
- **Role:** Cadet Flight Pilot & Surface Scout.
- **Age:** 12-year-old human boy.
- **Physical Traits:** Messy, windswept dark brown hair with soft curls, warm sun-kissed skin tone, bright amber-brown eyes, lively adventurous grin, athletic build suitable for microgravity agility.
- **Attitude:** Curious, quick on thruster controls, protective of crew, always ready for the next orbital burn.

### 2.2 Flight Suit Specifications: "Apollo Falcon Mk-IV"
- **Base Suit:** Pristine matte-white Ortho-Fabric xEMU pressure suit with reinforced ballistic Kevlar scuff patches on shoulders and knees.
- **Primary Color Accents:** **Apollo Cyan (`#36D9F5`)** racing stripes down arms, outer thighs, and boot trim; high-visibility telemetry status piping.
- **Helmet Assembly:** Transparent oversized panoramic bubble visor (`Roughness: 0.05`, `Transmission: 0.95`, `IOR: 1.52`), soft blue interior ambient HUD projection, integrated dual LED ear-boom comm lights.
- **Torso & Chest Pack:** Miniaturized chest Display & Control Module (DCM) with tactile toggle switches, illuminated digital oxygen readout, and official **"Solar Falcon"** circular mission patch (golden peregrine falcon orbiting an Apollo blue globe).
- **Footwear:** Modern aerospace high-top pressurized lunar boots with lunar tread lugs, cyan heel dampener rings, and magnetic deck clamps.
- **Gloves:** Tactile silicone palm grips, capacitive fingertip pads for cockpit touchscreen navigation.

### 2.3 Turnaround Coordinates & Mesh Attributes
| Angle | Key Silhouette Elements | Focal Feature |
|---|---|---|
| **Front View (0°)** | Wide athletic stance, DCM chest plate centered, friendly open smile, transparent visor revealing facial micro-expressions. | Solar Falcon mission patch & cyan telemetry stripes. |
| **3/4 Hero Turn (45°)** | Dynamic weight-shifted posture, left arm raised in thumbs-up or wave, visor reflection catching celestial Earth glow. | Bubble curvature & joint articulation rings. |
| **Profile View (90°)** | Compact Portable Life Support System (PLSS) backpack profile, helmet neck disconnect ring, boot tread angle. | PLSS radiator vents & umbilical hose ports. |
| **Rear View (180°)** | Dual oxygen purge cylinders, lithium hydroxide scrubber bay, high-visibility cyan spine telemetry strip, utility waist tether hook. | Life-support thermal blanket & battery status LED. |

---

## 3. Character 2: Cadet Nova (Science Specialist & Systems Engineer)

### 3.1 Identity & Demographics
- **Role:** ECLSS Science Specialist & Habitation Systems Engineer.
- **Age:** 12-year-old human girl.
- **Physical Traits:** Rich dark braided hair tied back into a neat zero-G bun with loose playful strands, deep brown expressive eyes, confident warm reassuring smile, intelligent and observant posture.
- **Attitude:** Analytical, calm in emergencies, master of botany and chemical loops, believes every crisis has a physics solution.

### 3.2 Flight Suit Specifications: "Artemis Beacon Mk-IV"
- **Base Suit:** Ergonomic articulated Artemis white composite pressure suit optimized for agility and hydroponic dome maintenance.
- **Primary Color Accents:** **ECLSS Emerald (`#39FF88`)** circuit flow stripes down the ribs, forearms, and calves; anodized Solar Gold (`#FFC857`) visor bezel and shoulder rings.
- **Helmet Assembly:** Sculpted aero-visor with gold solar-radiation vapor tint, retractable chin sunshade, and heads-up green spectrometer display scanning environmental ppm.
- **Torso & Chest Pack:** Bio-telemetry DCM monitor displaying heart rate, hydration, and closed-loop Sabatier efficiency; official **"ECLSS Guardian"** diamond mission patch (sprouting green seedling intertwined with an emerald orbital ring).
- **Utility Gear:** Modular magnetic science tool holster on right thigh, digital diagnostic tablet clipped to left forearm gauntlet.
- **Footwear:** Lightweight EVA low-gravity boots with emerald shock-absorbing soles and pressurized flex tendons.

### 3.3 Turnaround Coordinates & Mesh Attributes
| Angle | Key Silhouette Elements | Focal Feature |
|---|---|---|
| **Front View (0°)** | Poised confident stance, diagnostic forearm datapad visible, calm warm smile, braided hair framed inside helmet dome. | Emerald life-support chevron stripes & gold visor trim. |
| **3/4 Hero Turn (45°)** | Holding diagnostic scanner or checking wrist telemetry, gentle head tilt, intelligent welcoming expression. | Forearm biometric display & suit contouring. |
| **Profile View (90°)** | Streamlined backpack profile with auxiliary water recycling tank and botanical sample canister slot. | Slim PLSS profile and shoulder bearing geometry. |
| **Rear View (180°)** | Triple-redundant bio-filter canisters, glowing emerald status bar (100% nominal), thermal cooling garment (LCVG) connector port. | Filter recharge bay and braided hair containment pouch. |

---

## 4. Character 3: Twinkle (Autonomous Scout Companion Drone)

### 4.1 Identity & Hardware Architecture
- **Designation:** Twinkle (Autonomous Aerospace Companion & Cadet Flight Mentor).
- **Form Factor:** Compact, friendly teardrop aerodynamic chassis with ultra-smooth glossy pearlescent white composite shell (`Roughness: 0.15`, `Clearcoat: 1.0`).
- **Scale:** 36 cm height, 32 cm width, 30 cm depth (perfect hovering shoulder-companion proportion).
- **Propulsion:** Triple micro-ion magnetic levitation thrusters mounted at the base, projecting a soft pulsing cyan plasma ring (`#36D9F5`, 20% alpha glow).

### 4.2 Emotive Visor & Expressions
- **Ocular Interface:** Curved dark obsidian visor glass housing twin emissive LED cyan dot-matrix eyes capable of instant organic micro-animations:
  - **Nominal / Happy:** Soft upward-curved crescent arcs with gentle eye-winks.
  - **Inquisitive / Predict-First:** One enlarged inquisitive pupil with tilted eyebrow vector (`"Cadet, check the battery levels!"`).
  - **Alert / Hazard Scan:** Rapid amber/cyan strobe ring with horizontal radar sweep line during solar flares and dust storms.
  - **Constructive Mentor:** Warm rounded circles projecting holographic NASA mission telemetry into the air between its antenna prongs.
- **Sensors & Details:**
  - Twin flexible carbon-fiber top antennae with blinking green nominal beacon LED.
  - Retractable miniature multi-joint utility arm from lower belly for emergency valve toggles and Stardust collection.
  - Dual side acoustic speaker grilles for non-intrusive flight chimes and gentle audio cues.

### 4.3 Turnaround Coordinates & Mesh Attributes
| Angle | Key Silhouette Elements | Focal Feature |
|---|---|---|
| **Front View (0°)** | Symmetrical teardrop chassis, large glowing cyan visor eyes, hovering plasma disc at base, dual antenna sensors. | Emotive eyes & polished white aerodynamic finish. |
| **3/4 Hero Turn (45°)** | Expressive forward tilt (12° inquisitive angle), side thruster cowlings visible, reflective highlight across glossy top shell. | 3D depth of visor glass & ion thruster glow. |
| **Profile View (90°)** | Aerodynamic teardrop cross-section, antenna sweep angle, belly utility hatch seam, ion exhaust vector. | Sleek curved profile & low-drag aerospace curvature. |
| **Rear View (180°)** | Dual heat radiation exhaust gills, central stardust containment canister hatch, maintenance data-link port. | Radiator vents & golden backup power cell port. |

---

## 5. Master Color Tokens & PBR Material Matrix

```typescript
export const CHARACTER_DESIGN_TOKENS = {
  // Global Shared Aerospace Palette
  spaceVoid: '#05080D',        // Deep void backdrop
  cosmicNavy: '#0A1220',       // Engineering turnaround grid
  gridLine: 'rgba(54, 217, 245, 0.15)', // Coordinate scale ticks
  orthoWhite: '#F8FAFC',       // Primary suit fabric (TMG)
  jointTitanium: '#475569',    // High-pressure mechanical bearings
  visorGoldTint: '#FFD700',    // Vacuum-deposited gold solar film
  visorGlass: '#0E1726',       // Polycarbonate substrate

  // Cadet Orbit Identity Tokens
  orbit: {
    callsign: 'Cadet Orbit',
    primaryAccent: '#36D9F5',  // Apollo Cyan
    secondaryAccent: '#0C7C99',// Shadow cyan seam
    hairColor: '#3D2314',      // Messy warm brown
    eyeColor: '#5C381E',       // Amber brown
    patch: 'Solar Falcon',
  },

  // Cadet Nova Identity Tokens
  nova: {
    callsign: 'Cadet Nova',
    primaryAccent: '#39FF88',  // ECLSS Emerald
    secondaryAccent: '#169E4C',// Deep foliage green
    hairColor: '#171219',      // Dark braided obsidian
    eyeColor: '#2B1A12',       // Deep warm espresso
    patch: 'ECLSS Guardian',
    accentGold: '#FFC857',     // Artemis solar trim
  },

  // Twinkle Scout Drone Identity Tokens
  twinkle: {
    name: 'Twinkle',
    chassisWhite: '#FFFFFF',   // Glossy aero shell
    visorObsidian: '#080E18',  // Eye display lens
    eyeGlowCyan: '#36D9F5',    // Emissive eye matrix
    thrusterPlasma: '#36D9F5', // Ion levitation burn
    beaconGreen: '#39FF88',    // Top antenna status pip
    alertAmber: '#FFC857',     // Warning flash state
  }
};
```

---

## 6. Procedural 3D Rigging & Three.js Budget Guidelines

For seamless 60 FPS client-side WebGL rendering on mobile devices:
1. **Total Triangle Budget per Character:**
   - Cadet Orbit / Cadet Nova: $\le 18,500$ triangles (with LOD0 $\le 18,500$, LOD1 $\le 6,500$, LOD2 2D poster fallback).
   - Twinkle Drone: $\le 14,200$ triangles.
2. **Skeleton & Rigging:**
   - Cadets: Standard humanoid bipedal rig (54 bones), with twist bones on forearms and thighs for natural suit convolute wrinkling.
   - Visor Blendshapes: `visor_retract`, `visor_gold_tint`, `smile_open`, `wink_left`, `inquisitive_brow`.
   - Twinkle: 6 bones (Root, Chassis, Antenna_L, Antenna_R, UtilityArm_Base, UtilityArm_Claw) + eye matrix shader uniform.
3. **PBR Material Slots:** Maximum 2 draw calls per character via unified atlas textures ($1024 \times 1024$ px).
