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
  { word: 'Sol', def: 'A Mars day (a sol) is 24 hours 39 minutes.', source: 'NASA Mars facts' },
  { word: 'Radiation', def: "On the way to Mars, Curiosity's radiation detector measured about 1.8 millisieverts a day; on the surface about 0.7.", source: 'Curiosity RAD results' },
  { word: 'Carbon Dioxide', def: 'Mars air is mostly carbon dioxide and far too thin to breathe.', source: 'NASA Mars facts' },
  { word: 'Regolith', def: 'Piling Mars soil over a habitat is one way planners propose to block radiation.', source: 'NTRS regolith shielding studies' },
  { word: 'Solar Power', def: 'Mars gets less than half the sunlight Earth does.', source: 'NASA Mars facts' },
  { word: 'Dust Storm', def: 'The 2018 dust storm circled the planet and ended the Opportunity rover\'s mission.', source: 'NASA Opportunity mission pages' },
  { word: 'MOXIE', def: 'Perseverance carried MOXIE, which made oxygen from Mars air — about 122 grams in total.', source: 'NASA MOXIE release (Sept 2023)' },
  { word: 'Veggie', def: 'Astronauts ate lettuce grown on the Space Station for the first time in August 2015.', source: 'NASA Veggie pages; OSDR Veggie studies' },
  { word: 'Recycler', def: 'The Space Station now recycles about 98% of its water.', source: 'NASA ECLSS release (2023)' },
  { word: 'Oxygen', def: 'Each astronaut needs about 0.84 kg of oxygen a day.', source: 'NASA life-support baseline values (NTRS)' },
  { word: 'Storm Shelter', def: 'Water and food are good radiation shields, so crews plan to shelter behind their supplies.', source: 'NASA Orion storm-shelter and space radiation pages; NTRS' },
  { word: 'Radio Delay', def: 'A radio message between Mars and Earth takes roughly 5 to 20 minutes each way.', source: 'NASA Mars communications pages' },
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
