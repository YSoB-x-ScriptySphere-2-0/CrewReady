# Database & Persistence Specification (DDS-DATA)
## CrewReady: Beyond Us | NASA Space Apps Challenge 2026
### Document Identifier: DOCS-05-DATABASE-SCHEMA-V1.0
System Authority: plan.md -> docs/00_PROJECT_CONTEXT.md -> docs/01_PRD.md -> docs/02_SRS.md -> docs/03_TRD.md -> docs/04_DDS_UIUX_3D.md -> docs/05_DATABASE_SCHEMA.md
Classification: Client-Side Schema, Offline Storage & Economy Data Architecture
Target Environment: Offline-First Progressive Web App (PWA) / LocalStorage Persistence

---

## 1. Data Architecture Overview

### 1.1 Offline-First LocalStorage Key Mapping
All mutable client-side state is stored in browser `localStorage` under isolated keys prefixed with `crewready_v1_*`. No external server, remote cookie, or backend database is ever queried during runtime persistence.

| Storage Key | TypeScript Type / Slice | Sync Strategy | Max Size Budget |
|---|---|---|---|
| `crewready_v1_profile` | `CadetProfile` | Write-through on state change | 8 KB |
| `crewready_v1_missions` | `MissionStoreState` | Sol completion / debrief save | 64 KB |
| `crewready_v1_base` | `BaseFacilitiesState` | Facility tier upgrade | 16 KB |
| `crewready_v1_runs` | `QuickRunHistoryState` | Run termination / score post | 32 KB |
| `crewready_v1_training` | `TrainingDeckState` | Drill / quiz completion | 16 KB |
| `crewready_v1_settings` | `SettingsState` | Immediate toggle mutation | 4 KB |
| `crewready_v1_nasa_api_key` | `string` | Encrypted/raw local token | 1 KB |
| `crewready_v1_schema_ver` | `number` | System initialization check | 1 KB |

### 1.2 Schema Versioning & Migration Strategy
The current database schema version is strictly `1`. The initialization lifecycle validates `crewready_v1_schema_ver`:
```typescript
const CURRENT_SCHEMA_VERSION = 1;

export function initializeStorage(): void {
  try {
    const rawVersion = localStorage.getItem('crewready_v1_schema_ver');
    const version = rawVersion ? parseInt(rawVersion, 10) : 0;
    if (version < CURRENT_SCHEMA_VERSION) {
      migrateStorage(version, CURRENT_SCHEMA_VERSION);
      localStorage.setItem('crewready_v1_schema_ver', CURRENT_SCHEMA_VERSION.toString());
    }
  } catch (error) {
    console.warn('[STORAGE] Access error, falling back to in-memory state:', error);
  }
}
```

### 1.3 Corrupted State Reset & Safe Storage Access Wrapper
All read/write operations must use a safe JSON wrapper with graceful degradation to pre-bundled seed state:
```typescript
export function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (err) {
    console.error(`[STORAGE] Corrupted state at ${key}. Resetting to fallback.`, err);
    return fallback;
  }
}

export function safeSetItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[STORAGE] Quota exceeded or storage blocked for ${key}:`, err);
    return false;
  }
}
```

---

## 2. Core Entity TypeScript Interfaces & JSON Schemas

### 2.1 Profile & Progression Schemas
Enforces strict COPPA compliance: zero email, zero phone, zero real name. Pseudonyms only (`Cadet Polar Falcon`).

```typescript
export type CadetRank = 'Cadet Trainee' | 'Ensign' | 'Lieutenant' | 'Commander' | 'Flight Director';

export interface BadgeRecord {
  id: string;                    // e.g. "badge_eclss_master"
  title: string;                 // e.g. "Sabatier Systems Master"
  description: string;           // e.g. "Maintained 95%+ oxygen loop across 30 Sols"
  unlockedAt: string;            // ISO 8601 UTC timestamp
  iconName: string;              // Lucide React SVG icon name
  tier: 'bronze' | 'silver' | 'gold';
}

export interface SettingsState {
  language: 'en' | 'bn';
  soundVolume: number;           // 0.0 to 1.0
  ambienceVolume: number;        // 0.0 to 1.0
  isMuted: boolean;
  reducedMotion: boolean;
  nasaApiKey: string;            // Default "DEMO_KEY"
  useOfflineOnly: boolean;
}

export interface CadetProfile {
  id: string;                    // UUID v4
  callsign: string;              // e.g. "Cadet Solar Falcon"
  rank: CadetRank;
  stardustMinerals: number;      // Earned in Quick Run, spent on Base Upgrades
  techCredits: number;           // Earned in Missions, spent on Base Upgrades
  readinessMultiplier: number;   // 1.0 to 2.5 (boosted by Training Deck)
  badges: BadgeRecord[];
  createdAt: string;             // ISO 8601
  lastActive: string;            // ISO 8601
}
```

### 2.2 Quick Run Records & High Scores
```typescript
export interface HazardEncounter {
  hazardType: 'kessler_debris' | 'solar_radiation' | 'micrometeoroid';
  lane: 1 | 2 | 3;
  timestampMs: number;
  evaded: boolean;
  activeShield: boolean;
}

export interface QuickRunSession {
  sessionId: string;             // UUID v4
  timestamp: string;             // ISO 8601
  distanceMeters: number;
  durationSeconds: number;
  stardustHarvested: number;
  topSpeedKmh: number;
  hazardsEvaded: number;
  encounters: HazardEncounter[];
  finalScore: number;
}
```

### 2.3 6-Resource Coupled Ledger Schema
Models the non-negotiable physical mass-balance: `Power`, `Oxygen`, `Water`, `Food`, `Shielding`, `Crew Time`.

```typescript
export interface LedgerState {
  powerKw: number;               // Current generation vs storage (0 - 100 kW)
  oxygenPercent: number;         // Cabin ECLSS O2 concentration (0% - 100%)
  waterLiters: number;           // Recycled & reserve potable water (0 - 1500 L)
  foodKg: number;                // Packaged rations & greenhouse crops (0 - 500 kg)
  shieldingPercent: number;      // Radiation protection index (0% - 100%)
  crewTimeHours: number;         // Sol discretionary labor budget (0 - 24 hrs)
}

export interface LedgerDelta {
  powerKw?: number;
  oxygenPercent?: number;
  waterLiters?: number;
  foodKg?: number;
  shieldingPercent?: number;
  crewTimeHours?: number;
  reason: string;                // Human-readable physical explanation
}

export interface LedgerHistoryEntry {
  sol: number;
  ledger: LedgerState;
  deltasApplied: LedgerDelta[];
  activeAlerts: string[];
}
```

### 2.4 Mission Definitions & Decision Trees (Coupling Invariant $\ge 2$)
```typescript
export interface ButterflyFlag {
  flagKey: string;               // e.g. "delayed_airlock_seal_repair"
  triggerAfterSols: number;      // e.g. 3 Sols later
  consequenceTitle: string;
  consequenceDelta: LedgerDelta;
}

export interface ChoiceOption {
  id: string;                    // e.g. "opt_deploy_shakers"
  label: string;                 // Action text
  deltas: LedgerDelta;           // MUST mutate >= 2 resources
  butterflyFlags?: ButterflyFlag[];
  feedbackPedagogy: string;      // Socratic follow-up explanation from Twinkle
}

export interface DilemmaStep {
  sol: number;
  title: string;
  scenarioNarrative: string;
  nasaDataSource: 'EPIC' | 'MCS' | 'POWER' | 'NTRS';
  telemetryEvidence: Record<string, number | string>;
  twinklePrompt: string;         // Predict-first Socratic question
  choices: [ChoiceOption, ChoiceOption]; // Strict binary trade-off
}

export interface MissionConfig {
  missionId: 'mission_0_earth' | 'mission_1_moon' | 'mission_2_mars';
  title: string;
  targetDestination: 'Low Earth Orbit' | 'Shackleton Crater' | 'Jezero Crater';
  totalSols: number;
  startingLedger: LedgerState;
  dilemmas: DilemmaStep[];
}
```

### 2.5 Mission Black Box Debrief Record
```typescript
export interface ForensicEvent {
  sol: number;
  choiceMadeId: string;
  resourcesSnapshot: LedgerState;
  tippingPointFactor: number;    // Subsystem entropy score (0.0 to 1.0)
}

export interface PivotalDecision {
  sol: number;
  choiceLabel: string;
  rootCauseAnalysis: string;     // Objective causality statement
  nasaEngineeringSolution: string; // How NASA solved it in real life
}

export interface ApodPayload {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  copyright?: string;
  isCachedFixture?: boolean;
}

export interface MissionDebrief {
  missionId: string;
  completedAt: string;
  outcome: 'success' | 'failure';
  failureSubsystem?: keyof LedgerState;
  solsSurvived: number;
  forensicTimeline: ForensicEvent[];
  pivotalDecision?: PivotalDecision;
  apodReward: ApodPayload;
  techCreditsAwarded: number;
}
```

### 2.6 Base Facilities & Upgrades
```typescript
export type FacilityId = 'central_hub' | 'solar_farm' | 'water_recycler' | 'greenhouse' | 'shield_dome';

export interface PassiveBuff {
  targetSubsystem: keyof LedgerState | 'quick_run_shield' | 'quick_run_magnet';
  buffMagnitude: number;         // e.g. +15 kW or +0.10 multiplier
  buffUnit: string;
}

export interface UpgradeTier {
  level: number;                 // 1 to 5
  costStardust: number;
  costTechCredits: number;
  buff: PassiveBuff;
  visualModelKey: string;
}

export interface BaseFacility {
  id: FacilityId;
  name: string;
  currentLevel: number;
  maxLevel: 5;
  tiers: UpgradeTier[];
}
```

### 2.7 Training Deck Results & NASA Image Card Schemas
```typescript
export interface MiniGameScore {
  gameType: 'pattern_reflex' | 'eclss_balancer' | 'docking_alignment';
  score: number;
  accuracyPercent: number;
  timestamp: string;
}

export interface NasaTrainingImage {
  nasaId: string;
  title: string;
  description: string;
  imageUrl: string;
  secondaryCreator: string;
  dateCreated: string;
  keywords: string[];
}
```

---

## 3. Outpost Base Upgrade Progression Matrix (Levels 1–5)

The dual-currency economy guarantees zero grind while reinforcing engineering learning:
- **Stardust Minerals** (from Quick Run) finance structural and mechanical engineering modules.
- **Tech Credits** (from Mission Dilemmas & Debriefs) fund life support, software, and radiation shielding.

| Facility Identifier | Tier | Stardust Cost | Tech Credits | Applied System Buff | Unlocked Game Capability |
|---|---|---|---|---|---|
| **Central Outpost Hub** | L1 | 0 | 0 | Baseline permit | Tier 1 building zone |
| | L2 | 150 | 50 | Base efficiency +5% | Tier 2 modules & 2nd drone sensor |
| | L3 | 400 | 120 | Base efficiency +10% | Tier 3 modules & solar auto-orient |
| | L4 | 800 | 250 | Base efficiency +18% | Mission 2 dust scrubbers unlocked |
| | L5 | 1500 | 500 | Master Outpost command | Global readiness multiplier $\times 1.5$ |
| **Photovoltaic Solar Farm** | L1 | 80 | 20 | Starting Power: 40 kW | Basic solar array |
| | L2 | 200 | 60 | Starting Power: 55 kW | Automated mechanical wipers |
| | L3 | 450 | 150 | Starting Power: 70 kW | NASA POWER sun-tracking vectors |
| | L4 | 900 | 300 | Starting Power: 85 kW | High-efficiency perovskite cells |
| | L5 | 1800 | 600 | Starting Power: 100 kW| Micro-nuclear Stirling backup |
| **ECLSS Water Recycler** | L1 | 100 | 30 | Recovery Rate: 85% | Greywater hygiene loop |
| | L2 | 250 | 80 | Recovery Rate: 90% | Catalytic oxidation reactor |
| | L3 | 500 | 180 | Recovery Rate: 94% | Urine Processing Assembly (UPA) |
| | L4 | 1000 | 350 | Recovery Rate: 96% | Vacuum distillation system |
| | L5 | 2000 | 700 | Recovery Rate: 98% | Closed-loop Sabatier condensate recovery |
| **Hydroponic Greenhouse**| L1 | 120 | 40 | Food Yield: 2 kg/Sol | Dwarf wheat & microgreens |
| | L2 | 280 | 90 | Food Yield: 4 kg/Sol | NASA Veggie LED spectrum lamps |
| | L3 | 600 | 200 | Food Yield: 7 kg/Sol | Sweet potato aeroponic misting |
| | L4 | 1200 | 400 | Food Yield: 11 kg/Sol| Automated harvesting robotics |
| | L5 | 2200 | 800 | Food Yield: 16 kg/Sol| Atmospheric O2 buffer boost (+8%) |
| **Radiation Shield Dome** | L1 | 140 | 50 | Rad-Block: 40% | Sintered lunar regolith bricks |
| | L2 | 320 | 110 | Rad-Block: 60% | **Unlocks Quick Run Kinetic Shield** |
| | L3 | 700 | 240 | Rad-Block: 75% | Water-jacket wall radiation barrier |
| | L4 | 1400 | 450 | Rad-Block: 88% | Electromagnetic deflector coils |
| | L5 | 2500 | 900 | Rad-Block: 96% | Active plasma magnetosphere shield |

---

## 4. Pre-Bundled Static JSON Data Contracts

Pre-bundled in `public/assets/data/` for `OFFLINE=1` zero-crash resilience when external NASA endpoints hit rate limits (HTTP 403) or offline modes:

### 4.1 Mars Dust Records (`mcs_dust_records.json`)
```json
{
  "dataset": "NASA PDS Mars Climate Sounder (MCS) DDR V6.2",
  "records": [
    { "sol": 1, "latitude": -18.44, "longitude": 77.45, "dust_opacity_tau": 0.22, "pv_derate": 0.94 },
    { "sol": 14, "latitude": -18.44, "longitude": 77.45, "dust_opacity_tau": 1.85, "pv_derate": 0.40 }
  ]
}
```

### 4.2 ISS ECLSS Baselines (`iss_eclss_rates.json`)
```json
{
  "source": "NASA/TP-2015-218211",
  "crew_member_daily_consumption": {
    "oxygen_kg": 0.84,
    "water_kg": 2.50,
    "food_dry_kg": 0.62,
    "co2_production_kg": 1.00
  },
  "recycling_efficiencies": { "iss_water_recovery_percent": 98.0, "sabatier_co2_reduction_percent": 50.0 }
}
```

### 4.3 NASA APOD Fixtures (`apod_fixtures.json`)
```json
[
  {
    "date": "2026-10-04",
    "title": "Artemis Camp at Shackleton Rim",
    "explanation": "Permanently shadowed crater floors harbor ancient water-ice reserves vital for long-duration deep space exploration.",
    "url": "/assets/data/images/apod_shackleton.webp",
    "media_type": "image",
    "isCachedFixture": true
  }
]
```

### 4.4 NASA EPIC Full-Disc Vectors (`epic_fixtures.json`)
```json
[
  {
    "identifier": "20261004012530",
    "caption": "DSCOVR Earth polychromatic imaging camera natural full disc",
    "image": "epic_1b_20261004012530",
    "date": "2026-10-04 01:20:45",
    "dscovr_j2000_position": { "x": -1485320.4, "y": 284100.1, "z": -12040.5 },
    "sun_j2000_position": { "x": 149597870.7, "y": 0.0, "z": 0.0 }
  }
]
```

### 4.5 NASA Image Search Results (`nasa_images_fixtures.json`)
```json
[
  {
    "nasa_id": "iss065e012345",
    "title": "Astronaut EVA Spacewalk Extravehicular Mobility Unit Inspection",
    "description": "Astronaut performs pre-EVA suit pressure checks inside the Quest Airlock.",
    "imageUrl": "/assets/data/images/iss_eva_drill.webp",
    "dateCreated": "2021-06-16",
    "keywords": ["ISS", "EVA", "EMU", "Airlock", "Spacewalk"]
  }
]
```

### 4.6 Bilingual Localization Lexicon (`strings.json`)
```json
{
  "en": {
    "hud.power": "Power Output",
    "hud.oxygen": "ECLSS Oxygen",
    "mission.storm_warning": "Warning: Severe dust storm approaching outpost."
  },
  "bn": {
    "hud.power": "বিদ্যুৎ উৎপাদন",
    "hud.oxygen": "জীবন-সহায়ক অক্সিজেন",
    "mission.storm_warning": "সতর্কতা: ঘাঁটির দিকে তীব্র ধূলিঝড় ধেয়ে আসছে।"
  }
}
```

---

## 5. Future Multiplayer & Academy Schemas (Post-Competition Roadmap)

Prepared for smooth post-competition scaling with zero database refactoring:

```typescript
export type CrewRole = 'Commander' | 'LifeSupportEngineer' | 'PowerSpecialist' | 'ScienceOfficer';

export interface MultiplayerCrewMember {
  cadetId: string;
  callsign: string;
  role: CrewRole;
  isReady: boolean;
  latencyMs: number;
}

export interface MultiplayerRoomState {
  roomCode: string;              // 6-character alphanumeric code, e.g. "ORION4"
  createdAt: string;
  missionId: string;
  hostCadetId: string;
  members: MultiplayerCrewMember[];
  sharedLedger: LedgerState;     // Synchronized authoritative ledger
  votingState: {
    sol: number;
    votes: Record<string, string>; // cadetId -> choiceId
    resolvedAt?: string;
  };
}

export interface AllianceStructure {
  allianceId: string;
  allianceName: string;          // e.g. "Artemis Pioneers Alliance"
  motto: string;
  cadetMembersCount: number;
  aggregateStardustHarvested: number;
  collectiveOutpostTier: number;
}
```
