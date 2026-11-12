// Profile & astronaut settings logic — BUILD_SEQUENCE.md S3 / plan.md §7 rows 3 & 5

export type Astronaut = 'orbit' | 'nova';

export interface ProfileSettings {
  astronaut: Astronaut;
  callsign: string;
  sound: boolean;
  reducedMotion: boolean;
  language: 'en' | 'bn';
}

export const CALLSIGNS = [
  'Astro',
  'Comet',
  'Starlight',
  'Apollo',
  'Pioneer',
  'Voyager',
  'Curiosity',
  'Perseverance',
  'Orion',
  'Cosmo',
  'Meteor',
  'Nebula',
  'Eclipse',
  'Aurora',
  'Titan',
  'Zenith',
  'Polaris',
  'Galaxy',
  'Solar',
  'Nova',
  'Orbit',
] as const;

export const BADGE_DETAILS: Record<number, { title: string; desc: string; icon: string }> = {
  1: { title: 'Earth Departure', desc: 'Packed balanced supplies for the 7-month cruise', icon: 'Rocket' },
  2: { title: 'Storm Shelter', desc: 'Sheltered behind water tanks during solar storm', icon: 'ShieldAlert' },
  3: { title: 'First Sol', desc: 'Survived thin air and minus 62°C Mars cold', icon: 'Compass' },
  4: { title: 'Dust Survivor', desc: 'Saved solar battery power through global dust', icon: 'Sun' },
  5: { title: 'Bio Farmer', desc: 'Grew space lettuce and recycled 98% water', icon: 'Sprout' },
  6: { title: 'Outpost Commander', desc: 'Protected crew specialists and reached Sol 500', icon: 'Award' },
};

export const SPACE_WORDS_DEFAULT = [
  { word: 'Sol', def: 'A Mars solar day: 24 hours and 39 minutes.', source: 'NASA Mars Facts' },
  { word: 'Radiation', def: 'High-energy particles from the Sun and deep space.', source: 'NASA Space Radiation' },
  { word: 'Solar Panel', def: 'Generates electricity from sunlight to power spacecraft.', source: 'NASA Facts' },
  { word: 'Recycler', def: 'Machine that recovers 98% of clean water from crew moisture.', source: 'NASA ECLSS' },
  { word: 'Carbon Dioxide', def: 'The heavy gas making up 95% of Mars thin atmosphere.', source: 'InSight Weather' },
  { word: 'Regolith', def: 'Mars mineral soil and loose rock piled over habitats for shielding.', source: 'NTRS Shielding Studies' },
  { word: 'MOXIE', def: 'NASA machine on Perseverance that made oxygen from Mars air.', source: 'NASA MOXIE 2023' },
  { word: 'Veggie', def: 'Plant growth chamber on ISS where astronauts ate space lettuce in 2015.', source: 'NASA Veggie / OSDR' },
];

const PROFILE_KEY = 'crewready_profile_settings';

export const DEFAULT_PROFILE: ProfileSettings = {
  astronaut: 'orbit',
  callsign: 'Pioneer',
  sound: false,
  reducedMotion: false,
  language: 'en',
};

export function loadProfile(): ProfileSettings {
  try {
    if (typeof localStorage === 'undefined') return { ...DEFAULT_PROFILE };
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      astronaut: parsed.astronaut === 'nova' ? 'nova' : 'orbit',
      callsign: typeof parsed.callsign === 'string' && parsed.callsign ? parsed.callsign : DEFAULT_PROFILE.callsign,
      sound: !!parsed.sound,
      reducedMotion: !!parsed.reducedMotion,
      language: parsed.language === 'bn' ? 'bn' : 'en',
    };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveProfile(profile: ProfileSettings): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }
  } catch {
    // Ignore quota
  }
}

export function getRankTitle(badgeCount: number): string {
  if (badgeCount >= 6) return 'Mars Pioneer';
  if (badgeCount >= 5) return 'Commander';
  if (badgeCount >= 3) return 'Systems Officer';
  if (badgeCount >= 1) return 'Flight Specialist';
  return 'Cadet Astronaut';
}

export function shuffleCallsign(current: string): string {
  const choices = CALLSIGNS.filter((c) => c !== current);
  return choices[Math.floor(Math.random() * choices.length)] || 'Cosmo';
}

export function resetAllGameData(): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem('crewready_v1_mission');
      localStorage.removeItem('crewready_fly_best_distance');
      localStorage.removeItem('crewready_fly_total_stardust');
      localStorage.removeItem('crewready_cargo_upgrades');
    }
  } catch {
    // Ignore
  }
}
