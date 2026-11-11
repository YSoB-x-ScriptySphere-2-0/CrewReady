# Frontend Engineering Plan & Visual Prompt Pack: Building "CrewReady: Beyond Us"

This document provides:
1. **The Architecture & Frontend Engineering Blueprint** to implement the responsive real-world UI in React + Vite + Tailwind CSS + Three.js.
2. **The Complete Production Prompt Pack (12 Screens + Character Sheet)** for AI visual generators (Midjourney / Imagen 3 / Gemini / Flux) to create 100% faithful reference images.

---

## Part 1: Frontend Architecture & Execution Plan

### 1. Design Token System & Tailwind Configuration
To match the tactile, aerospace-grade, kid-friendly look in the code:

```typescript
// tailwind.config.js - Core palette & tactile elevations
module.exports = {
  theme: {
    extend: {
      colors: {
        'space-void': '#05080D',      // Deepest background
        'cosmic-navy': '#0A1220',     // Surface glass panel
        'elevated': '#111C30',        // Elevated cards
        'apollo-cyan': '#36D9F5',     // Primary interactive & oxygen
        'eclss-emerald': '#39FF88',   // Nominal state, food & health
        'solar-gold': '#FFC857',      // Power & highlights
        'alert-crimson': '#FF5252',   // Danger & emergency alerts
        'stardust-purple': '#B55FE6', // Stardust & premium ranks
      },
      fontFamily: {
        game: ['Space Grotesk', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'hud-cyan': '0 0 20px rgba(54, 217, 245, 0.35)',
        'hud-amber': '0 0 20px rgba(255, 200, 87, 0.35)',
        'hud-emerald': '0 0 20px rgba(57, 255, 136, 0.35)',
        'hud-crimson': '0 0 20px rgba(255, 82, 82, 0.4)',
      }
    }
  }
}
```

### 2. Tactile Button & HUD Interaction System
Kids need immediate visual and audible feedback. Every button must have:
- Minimum height of **48px–56px** for finger touch targets.
- 3D physical press effect: `border-b-4 active:border-b-1 active:translate-y-[2px]`.
- Sound trigger on press (`soundManager.play('click' | 'launch' | 'thruster')`).
- Maximum 3 words per label (e.g. `PLAY`, `FLY NOW`, `LET'S GO`, `START MISSION`, `CHOOSE THIS`, `BACK TO BASE`).

```tsx
// Reusable Tactile Button Pattern
<button
  onClick={onAction}
  className="h-14 px-6 rounded-2xl bg-apollo-cyan hover:bg-cyan-300 text-space-void font-heading font-black text-base uppercase tracking-wider border-b-4 border-b-[#0C7C99] active:border-b-1 active:translate-y-[3px] shadow-hud-cyan transition-all flex items-center justify-center gap-2"
>
  <span>LET'S GO</span>
  <ChevronRight className="w-5 h-5 stroke-[3]" />
</button>
```

### 3. Screen Hierarchy & Routing
```
App.tsx
├── WelcomeView (Screen 01)
├── CadetCreationView (Screen 02)
└── Header + BottomNav Layout (Screens 03-12)
    ├── Tab 1: HomeView (Screen 03)
    ├── Tab 2: MissionsView (Screens 05, 06, 07, 08, 09)
    │   ├── MissionSelectionScreen (Screen 05)
    │   ├── MissionBriefingScreen (Screen 06)
    │   ├── LedgerHUD + OutpostView (Screen 07)
    │   ├── DilemmaCard (Screen 08)
    │   └── DebriefModal (Screen 09)
    ├── Tab 3: BaseUpgradeView (Screen 10)
    ├── Tab 4: TrainingView (Screen 11)
    ├── Tab 5: ProfileView (Screen 12)
    └── Sortie Launcher: RunnerView / 3D Canvas (Screen 04)
```

---

## Part 2: Master UI Prompt Pack (12 Reference Screens)

Each prompt below is optimized for modern visual image generators (Midjourney, Imagen 3, Flux), structured side-by-side (Desktop 1440×900 left, Mobile 390×844 right).

### Style Prefix for All Prompts:
> *"UI UX presentation mockup (Desktop 1440x900 and Mobile 390x844 side-by-side) for kids space game 'CrewReady: Beyond Us'. Pixar aesthetic meets authentic NASA aerospace hardware. Dark cosmic navy (#0A1220) glass panels, Apollo Cyan (#36D9F5) and ECLSS Emerald (#39FF88) neon telemetry, Space Grotesk and Inter typography, 44px+ touch targets, crisp vector-grade UI."*

---

### Prompt 00: Official Character Concept & Turnaround Sheet
```text
Official Character Concept Sheet for 'CrewReady: Beyond Us' on a dark cosmic navy engineering grid (#0A1220):
1. Cadet Orbit: 12-year-old boy, messy brown hair, adventurous smile, white astronaut suit with Apollo Cyan (#36D9F5) stripes, transparent bubble visor, Solar Falcon chest patch, high-top lunar boots.
2. Cadet Nova: 12-year-old girl, dark braided hair bun, confident warm expression, Artemis white suit with ECLSS Emerald (#39FF88) circuit stripes, gold visor trim, forearm datapad, ECLSS Guardian patch.
3. Twinkle: Cute companion scout drone, glossy white teardrop aero-chassis, glowing cyan LED eyes, anti-gravity hover thruster, twin antennae with green beacon.
Style: Pixar charm meets authentic NASA xEMU suit joints and fabrics. Full orthographic turnaround views.
```

---

### Prompt 01: Welcome / Entry Screen
```text
UI UX mockup of Page 01 Welcome Screen for 'CrewReady: Beyond Us' (Desktop and Mobile side-by-side).
Background: Orbital station cupola window overlooking realistic glowing blue Earth.
Foreground: Cadet Orbit (Apollo Cyan suit, waving) and Cadet Nova (ECLSS Emerald suit, warm smile) floating in microgravity, with Twinkle drone hovering between them with smiling LED eyes.
UI Overlay:
- Top right: Sound toggle and 'EN / বাংলা' language pill.
- Center-left: Bold title 'CREWREADY' with subtitle 'Junior Astronaut Training'.
- Buttons: Chunky Apollo Cyan 3D button 'PLAY' with glow, secondary navy button 'HOW TO PLAY'.
- Badges at bottom: 'NASA Open Data' and '100% Client-Side Safe'.
Tactile aerospace buttons, kid-friendly layout.
```

---

### Prompt 02: Make Your Astronaut (Cadet Customizer)
```text
UI UX mockup of Page 02 Make Your Astronaut Screen for kids space game (Desktop and Mobile side-by-side).
Viewport: High-detail airlock staging bay with 3D preview of Cadet Orbit or Cadet Nova in full xEMU pressure suit with Twinkle floating beside them.
Customization Deck:
1. 'CHOOSE CADET': Two character preset cards ('Orbit' with cyan highlights, 'Nova' with emerald/gold highlights).
2. 'YOUR SPACE NAME': Input box showing 'ORBIT-07'.
3. 'SUIT ACCENT': 5 tactile color pills (Apollo Cyan, ECLSS Emerald, Solar Gold, Stardust Purple, Artemis White).
4. 'HELMET': Bubble Visor, Aero Shield, Radiation Gold Tint.
5. 'MISSION PATCH': Solar Falcon, ECLSS Guardian, Artemis Beacon, Mars Pioneer.
Primary Action: Chunky cyan 3D button labeled "I'M READY".
Tactile, readable fitting-room interface.
```

---

### Prompt 03: Home / Mission Control Station
```text
UI UX mockup of Page 03 Mission Control Home for 'CrewReady: Beyond Us' (Desktop and Mobile side-by-side).
Header: Callsign 'ORBIT-07', Rank 'CADET PILOT', glowing Stardust counter '+450', and Twinkle avatar status pip.
Hero Viewport: Panoramic orbital station cupola overlooking planet Earth, with Cadet Orbit and Cadet Nova looking out while Twinkle hovers playfully.
Action Cards:
1. 'FLY YOUR SHIP': 3D spacecraft entering asteroid field with bright cyan button 'FLY NOW'.
2. 'YOUR MISSION': Moon Shackleton Crater base preview with orange button 'LET'S GO'.
Tracker Bar: 'TODAY'S GOAL: Collect 50 Stardust' with glowing progress bar (35/50).
Bottom Navigation: 5 clean icons: Home, Missions, My Base, Training, Profile.
Clean, inviting aerospace game hub.
```

---

### Prompt 04: Fly Your Ship (3D Space Navigation Runner)
```text
UI UX mockup of Page 04 Fly Your Ship Gameplay Screen (Desktop and Mobile side-by-side).
Center 3D Gameplay: Third-person view behind sleek white NASA scout craft navigating cosmic orbital ring corridor. Twinkle drone flies alongside ship as forward sensor scout.
HUD Overlay:
- Top Left: Cadet Orbit pilot portrait icon and mission goal 'REACH THE FINISH'.
- Top Center: Distance meter 'DISTANCE: 1,420 / 2,000 m'.
- Top Right: Stardust gems '+85' and tactile 'PAUSE' button.
- Bottom Left: Segmented green shield meter (85%) and velocity '120 KM/H'.
- Bottom Touch Controls (Mobile): Chunky cyan left/right thruster arrow pads.
Arcade space runner aesthetic with high-visibility HUD.
```

---

### Prompt 05: Missions (Planet Destination Selection)
```text
UI UX mockup of Page 05 Missions Screen for 'CrewReady: Beyond Us' (Desktop and Mobile side-by-side).
Header: 'SELECT DESTINATION' with subtitle 'Choose where your crew will explore'.
Destination Cards:
1. EARTH ORBIT (Cadet): Blue Earth, space station, tag 'READY'.
2. MOON (Advanced): Grey Shackleton crater, biodomes, tag 'READY'.
3. MARS (Master): Jezero crater, rust dunes, dust storm, tag 'LOCKED'.
Selected Moon Card details:
- Crew: Cadet Orbit (Pilot), Cadet Nova (ECLSS Engineer), Twinkle (Scout).
- Challenge: 14-day lunar night and power balance.
- Primary Button: Apollo Cyan tactile button 'LET'S GO'.
Vibrant planetary illustrations with kid-readable briefing chips.
```

---

### Prompt 06: Mission Briefing
```text
UI UX mockup of Page 06 Mission Briefing Screen (Desktop and Mobile side-by-side).
Background: Moon Shackleton Crater outpost with biodomes and solar arrays.
Center Briefing Card in cosmic navy glass:
- Header: 'MISSION BRIEFING: Shackleton Crater Research Station'.
- Crew Dossier: Cadet Orbit (Pilot) and Cadet Nova (Science Lead) illustrated in suit gear.
- Twinkle Speech Callout: Drone projecting holographic telemetry with question: 'Cadet, how will we survive the 14-day lunar night?'
- 3 Objectives: Maintain 6 life-support loops, store battery power, resolve dust storm events.
- 6-Resource Ledger Preview: Power, Oxygen, Water, Food, Shield, Crew Time.
- Primary Action: Glowing cyan button 'START MISSION'.
Clear typography, structured briefing layout.
```

---

### Prompt 07: Mission Operations (Base Ledger HUD)
```text
UI UX mockup of Page 07 Mission Operations HUD for 'CrewReady: Beyond Us' (Desktop and Mobile side-by-side).
Top Bar: 'SOL 14 OF 30' with amber hazard badge 'DUST STORM DETECTED'.
Center Viewport: 2.5D isometric Mars outpost view. Cadet Orbit in white/cyan suit sweeps solar arrays outside; Cadet Nova monitors greenhouse biodome inside; Twinkle drone hovers with alert expression.
6-Resource LED Gauges (horizontal bars with status chips):
- Power (Yellow): 72% [GOOD]
- Oxygen (Cyan): 95% [GOOD]
- Water (Blue): 88% [GOOD]
- Food (Green): 64% [GOOD]
- Shield (Purple): 40% [LOW]
- Crew Time (Orange): 80% [GOOD]
Twinkle Speech Bubble: 'Storm winds are picking up, Cadet! Check our solar panels!'
Bottom Bar: Big cyan tactile button 'TAKE ACTION'.
High-contrast telemetry, zero cognitive overload.
```

---

### Prompt 08: Mission Dilemma / Emergency Decision
```text
UI UX mockup of Page 08 Mission Event Dilemma Screen (Desktop and Mobile side-by-side).
Top Alert Banner: Flashing crimson banner 'ALERT! DUST STORM INCOMING'.
Center Event Card:
- Illustration of red dust covering outpost solar panels.
- Twinkle Drone dialogue: 'Cadet, dust is blocking our solar panels! What should we do?'
Two Decision Buttons:
- Option 1 (Cyan border): 'FIX IT NOW' (Send Cadet Orbit on EVA sweep) with resource trade-offs '+Power / -Oxygen -Time', button 'CHOOSE THIS'.
- Option 2 (Emerald border): 'CONSERVE POWER' (Cadet Nova powers down science labs) with trade-offs '+Safety / -Research', button 'CHOOSE THIS'.
Chunky touch buttons, bold consequence labels.
```

---

### Prompt 09: Mission Debrief (Flight Log & Rewards)
```text
UI UX mockup of Page 09 Mission Debrief Screen (Desktop and Mobile side-by-side).
Header: Celebratory gold banner 'MISSION COMPLETE! +150 STARDUST'.
Center Card:
- Timeline scrubber showing Sol 1-30 milestones.
- Crew Celebration: Cadet Orbit giving thumbs-up, Cadet Nova cheering, Twinkle displaying happy winking LED eyes.
- Socratic Debrief: Twinkle explaining: 'Cleaning the solar panels gave our base 40% more electricity during the storm!'
- NASA APOD Reward: Real Mars Perseverance rover photography card.
Bottom Actions: Secondary button 'SEE CHOICES', primary cyan button 'BACK TO BASE'.
Positive reinforcement, clean constructive debrief.
```

---

### Prompt 10: My Base (Habitat Upgrade)
```text
UI UX mockup of Page 10 My Base Screen for kids space game (Desktop and Mobile side-by-side).
Top Header: 'MY BASE' with Stardust balance '450' and Tech Credits '12'.
Center Area: 2.5D isometric planetary outpost on Mars with 5 interactive modular facilities:
1. Central Hub (Level 2/5)
2. Solar Array Tower (Level 1/5) - Cadet Orbit standing on service gantry
3. Hydroponic Greenhouse (Level 2/5) - Cadet Nova tending crops inside
4. Sabatier Reactor (Level 1/5)
5. Water Ice Drill (Level 1/5) - Twinkle scanning soil
Selected Facility Card: Shows upgrade costs and resource yields, with chunky button 'UPGRADE'.
Engaging base-builder aesthetic with clear level pips.
```

---

### Prompt 11: Training Academy
```text
UI UX mockup of Page 11 Training Academy Screen for 'CrewReady: Beyond Us' (Desktop and Mobile side-by-side).
Header: 'ASTRONAUT TRAINING' with flight readiness score '100% READY'.
Three Mini-Game Cards:
1. 'MEMORY PATTERN': Flashing cockpit buttons with Cadet Orbit avatar, difficulty 'CADET', button 'START'.
2. 'AIR BALANCE': Oxygen/CO2 stoichiometry puzzle with Cadet Nova avatar, difficulty 'ADVANCED', button 'START'.
3. 'DOCK THE SHIP': 3D kinetic ring alignment sim with Twinkle guidance, difficulty 'MASTER', button 'START'.
Bottom Card: Real NASA astronaut spacewalk training photo gallery.
Arcade training deck with bold badges.
```

---

### Prompt 12: Cadet Profile (Dossier & Achievements)
```text
UI UX mockup of Page 12 Cadet Profile Screen (Desktop and Mobile side-by-side).
Hero Section: Full-height portrait card of selected astronaut (Cadet Orbit in Apollo Cyan xEMU suit or Cadet Nova in Artemis Emerald suit) with Twinkle hovering beside their shoulder.
Profile Header: Callsign 'ORBIT-07', Rank 'JUNIOR PILOT', Total Stardust '1,250'.
Badges Showcase: Grid of 5 aerospace merit badges (First Orbit, Solar Flare Survivor, Mars Explorer, Ice Miner, Master Pilot).
Flight Log: Sortie history list with dates, missions, and 'SEE REPORT' buttons.
Settings: Language toggle ('EN / বাংলা') and NASA API key options.
Polished dossier layout with celebratory badge grid.
```

---

## Part 3: Verification & Implementation Checklist

When implementing these screens in the codebase:
1. **Responsive Verification**: Ensure all panels stack on mobile ($<768\text{px}$) with the `BottomNav` fixed at the bottom.
2. **Text Readability**: Ensure every button has at least a 4.5:1 color contrast ratio against its background.
3. **No Color-Only State**: All status gauges and warning states must include explicit text labels (`GOOD`, `LOW`, `DANGER`).
4. **COPPA / Safety**: Zero personal data collection forms or external analytics.
5. **Zero Backend Failure**: All API requests have immediate fallback fixtures bundled in `public/assets/data/`.
