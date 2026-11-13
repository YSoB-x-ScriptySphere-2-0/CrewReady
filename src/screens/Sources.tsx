// Sources, Credits & Science — BUILD_SEQUENCE.md S1 / plan.md §4.3, §8.1, §8.3 / docs/06 §5
// The one calm page, on paper, that may scroll. Every SourceLine opens it and Back returns where you were.

import { ArrowLeft, ExternalLink, BookOpen, HeartHandshake, ShieldCheck, Sparkles, Users, GraduationCap } from 'lucide-react';
import { useGame, type Screen } from '../store/game';
import { Badge, type BadgeKind } from '../components/Panel';

// Track the screen that opened Sources so Back returns exactly where the player was
let lastActiveScreen: Screen = 'home';
useGame.subscribe((state) => {
  if (state.screen !== 'sources') {
    lastActiveScreen = state.screen;
  }
});

interface DatasetEntry {
  name: string;
  agency: string;
  whereUsed: string;
  badge: BadgeKind;
  dateOrMode: string;
  url: string;
  description: string;
}

const DATASETS: DatasetEntry[] = [
  {
    name: 'Space Weather Database of Notifications, Knowledge, Information (DONKI)',
    agency: 'NASA Space Weather CCMC',
    whereUsed: 'Levels 2 and 6 (Solar storms), Home space-weather chip, Fly speed',
    badge: 'NASA LIVE',
    dateOrMode: 'Live query with May 2024 superstorm archive fallback',
    url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/',
    description:
      'Coronal Mass Ejections (CME), Solar Energetic Particle (SEP) events, and Geomagnetic Storms (GST). When live space weather is calm, the game loads the extreme May 2024 solar storm.',
  },
  {
    name: 'Planetary K-index',
    agency: 'NOAA Space Weather Prediction Center (SWPC)',
    whereUsed: 'Home live Kp gauge, Level 2 storm calculation, Fly hazard speed',
    badge: 'NASA LIVE',
    dateOrMode: 'Live (updated every 3 hours) / Archive fallback',
    url: 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json',
    description:
      'Measures disturbances in Earth’s magnetic field on a 0–9 scale. Kp ≥ 8 triggers a Large solar storm in the game engine.',
  },
  {
    name: 'Near-Earth Object Web Service (NeoWs)',
    agency: 'NASA JPL / Planetary Defense Coordination Office',
    whereUsed: 'Story Card 1 (Asteroid flyby radar)',
    badge: 'NASA LIVE',
    dateOrMode: 'Live asteroid feeds / 2026 archive snapshot',
    url: 'https://cneos.jpl.nasa.gov/',
    description:
      'Tracks near-Earth asteroids passing Earth this week. The game displays real miss distances and confirms that none will hit us.',
  },
  {
    name: 'Earth Polychromatic Imaging Camera (EPIC)',
    agency: 'NASA Goddard / NOAA DSCOVR',
    whereUsed: 'Level 1 (The Last Departure — Earth photo card)',
    badge: 'NASA LIVE',
    dateOrMode: 'Daily full-disc natural color imagery',
    url: 'https://epic.gsfc.nasa.gov/',
    description:
      'Photographs the entire sunlit side of Earth from about 1.6 million kilometres (one million miles) away, toward the Sun.',
  },
  {
    name: 'InSight Mars Weather Service (TWINS / SEIS)',
    agency: 'NASA JPL',
    whereUsed: 'Levels 3 & 4 (Martian daily temperature swings and weather)',
    badge: 'NASA ARCHIVE',
    dateOrMode: 'October 2020 (Sol 675 archive)',
    url: 'https://science.nasa.gov/mission/insight/',
    description:
      'Real Martian atmospheric data recorded on Elysium Planitia. Sol 675 measured daily temperatures averaging −62.3 °C (from −96.9 °C to −15.9 °C).',
  },
  {
    name: 'Open Science Data Repository (OSDR) Veggie Study OSD-745',
    agency: 'NASA Biological & Physical Sciences',
    whereUsed: 'Level 5 (Space Station greenhouse and lettuce farming)',
    badge: 'NASA ARCHIVE',
    dateOrMode: 'August 2015 (VEG-01B mission)',
    url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-745',
    description:
      'Microbiological and nutritional analysis of lettuce crops grown on the ISS. Checks of the space-grown lettuce for harmful germs and for nutrients.',
  },
  {
    name: 'Astronomy Picture of the Day (APOD)',
    agency: 'NASA / MTU (Nemiroff & Bonnell)',
    whereUsed: 'Mission Success screen reward card',
    badge: 'NASA LIVE',
    dateOrMode: 'Daily curated astronomy photographs / Archive fallback',
    url: 'https://science.nasa.gov/apod/',
    description:
      'Features daily astronomical imagery. Falls back to verified solar storm and planetary aurora photography if the daily live feed is video or unavailable.',
  },
  {
    name: 'NASA Image and Video Library',
    agency: 'NASA',
    whereUsed: 'Jezero Crater orbital imagery, Perseverance rover photos, ISS modules',
    badge: 'NASA ARCHIVE',
    dateOrMode: 'Curated build-time mission assets',
    url: 'https://images.nasa.gov/',
    description:
      'Official public photography of Jezero Crater landing sites, Perseverance rover, and the International Space Station.',
  },
  {
    name: 'NASA Technical Reports Server (NTRS)',
    agency: 'NASA',
    whereUsed: 'Science baseline: regolith radiation shielding & life support',
    badge: 'NASA ARCHIVE',
    dateOrMode: 'Technical baselines (2014–2023)',
    url: 'https://ntrs.nasa.gov/',
    description:
      'Engineering baselines for ECLSS oxygen consumption (0.84 kg O₂/person/day), 98% water recovery, and Martian regolith shielding mass ratios.',
  },
];

const SIMPLIFICATIONS = [
  {
    inGame: 'Four meters from 0 to 100 (Power, Air & Water, Food, Shield)',
    inReality: 'Hundreds of complex physical measurements with differing engineering units.',
  },
  {
    inGame: '"Air & Water" is linked as one resource meter',
    inReality: 'Oxygen generation, CO₂ scrubbing, humidity condensing, and water recycling are separate, coupled subsystems.',
  },
  {
    inGame: '"Shield" goes down when radiation hits',
    inReality: 'Physical shielding does not wear out; astronauts accumulate radiation dose over time. We flipped the meter so all four resource bars decrease under strain.',
  },
  {
    inGame: 'A storm costs a fixed number of meter points by size (10, 20, or 30)',
    inReality: 'Actual radiation absorbed dose depends on particle energy spectra, shielding material density, and exposure duration.',
  },
  {
    inGame: 'Space weather measured near Earth is used on the way to Mars',
    inReality: 'A CME directed at Earth might miss Mars depending on planetary orbital positions. We use real solar storm events as authentic examples of solar activity.',
  },
  {
    inGame: 'Radioing Earth costs a fixed amount of air and water',
    inReality: 'The true cost depends on orbital positions (about 3 to 22 minutes message travel time each way) and the physical rate of outpost life-support consumption.',
  },
];

const TEAM = [
  { name: 'Barkat Ullah Shah Riyad', role: 'UI/UX Designer & Developer' },
  { name: 'Student teammate', role: 'Team Lead & Systems Architect' },
  { name: 'Student teammate', role: 'Back-End Developer & Debugger' },
  { name: 'Student teammate', role: 'Researcher & Script Writer' },
  { name: 'Student teammate', role: 'Video Editor & Script Writer' },
  { name: 'Student teammate', role: 'Front-End Developer & Designer' },
];

const CLASS_LEARNINGS = [
  { level: 'Level 1 · Launch', quote: 'A rocket can’t carry everything. More shielding means less food.' },
  { level: 'Level 2 · Space Storm', quote: 'The Sun has storms. Astronauts watch alerts and shelter behind dense supplies like water.' },
  { level: 'Level 3 · The Outpost', quote: 'Mars is so far that radio messages take minutes. The crew has to make critical choices on their own.' },
  { level: 'Level 4 · Dust Season', quote: 'Solar power depends on clear skies. When dust blocks sunlight, you must choose which machines stay powered.' },
  { level: 'Level 5 · Life Support', quote: 'Growing fresh food costs water, electricity, and time — but a greenhouse sustains the crew long-term.' },
  { level: 'Level 6 · Survival', quote: 'Nobody survives Mars alone. Diverse crew specializations protect different mission systems.' },
];

export function Sources() {
  const go = useGame((s) => s.go);

  const handleBack = () => {
    go(lastActiveScreen);
  };

  return (
    <div className="h-full w-full overflow-y-auto bg-paper text-ink font-sans selection:bg-go/25 selection:text-ink">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-ink/15 bg-paper px-4 py-3 sm:px-8 sm:py-4">
        <button
          onClick={handleBack}
          className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/20 bg-white/80 px-4 py-1.5 font-display text-base font-extrabold tracking-wide uppercase transition hover:border-ink hover:bg-white active:translate-y-0.5"
          aria-label="Back to previous screen"
        >
          <ArrowLeft size={18} strokeWidth={2.75} className="transition group-hover:-translate-x-0.5" />
          <span>Back</span>
        </button>

        <div className="text-right">
          <span className="font-display text-xs font-extrabold tracking-widest text-ink/60 uppercase">CrewReady Mission Documentation</span>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
        {/* Title */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-3.5 py-1 text-xs font-bold tracking-wider text-ink/75 uppercase">
            <ShieldCheck size={14} className="text-good" />
            <span>NASA Space Apps Challenge 2026</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Sources, Credits & Science
          </h1>
          <p className="mt-2 text-base text-ink/75 sm:text-lg">
            How real NASA and NOAA science drives every decision in CrewReady.
          </p>
        </div>

        {/* 1. Datasets & NASA APIs */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <BookOpen size={22} className="text-go-lip" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              1. NASA & NOAA Datasets
            </h2>
          </div>
          <p className="mb-6 text-sm text-ink/80 leading-relaxed sm:text-base">
            Every screen displaying a scientific fact is grounded in open datasets published by NASA and NOAA.
          </p>

          <div className="grid gap-4">
            {DATASETS.map((ds) => (
              <article
                key={ds.name}
                className="rounded-2xl border-2 border-ink/10 bg-white/70 p-5 shadow-sm transition hover:border-ink/25 hover:bg-white"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge kind={ds.badge} />
                    <span className="text-xs font-bold text-ink/60 uppercase tracking-wider">{ds.agency}</span>
                  </div>
                  <a
                    href={ds.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-go-lip hover:underline"
                  >
                    <span>Dataset Portal</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <h3 className="mt-2 font-display text-lg font-extrabold leading-snug text-ink">{ds.name}</h3>
                <p className="mt-1 text-sm text-ink/85 leading-relaxed">{ds.description}</p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-paper/60 px-3 py-1.5 text-xs text-ink/75">
                  <span><strong>Where used:</strong> {ds.whereUsed}</span>
                  <span><strong>Mode:</strong> {ds.dateOrMode}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 2. What We Simplified */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <Sparkles size={22} className="text-star" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              2. What We Simplified
            </h2>
          </div>
          <p className="mb-6 text-sm text-ink/80 leading-relaxed sm:text-base">
            To make space exploration intuitive for a 7-to-12-year-old child, engineering complexities were converted into tangible game mechanics without misrepresenting scientific principles.
          </p>

          <div className="overflow-hidden rounded-2xl border-2 border-ink/10 bg-white/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-ink/10 bg-paper/80 font-display text-xs font-extrabold tracking-wider text-ink/70 uppercase">
                  <tr>
                    <th className="p-4 sm:w-1/2">In CrewReady (The Game)</th>
                    <th className="p-4 sm:w-1/2">In Reality (Spaceflight Science)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {SIMPLIFICATIONS.map((row, idx) => (
                    <tr key={idx} className="transition hover:bg-white/60">
                      <td className="p-4 font-bold text-ink">{row.inGame}</td>
                      <td className="p-4 text-ink/80 leading-relaxed">{row.inReality}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. The Honesty Note */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <ShieldCheck size={22} className="text-good" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              3. The Honesty Note
            </h2>
          </div>

          <blockquote className="rounded-2xl border-2 border-good/40 bg-good/10 p-6 text-base italic leading-relaxed text-ink shadow-sm sm:text-lg">
            “The asteroid and the Mars Continuity Programme are fiction made for this game. NASA tracks near-Earth asteroids and tests ways to deflect them, and knows of no asteroid that is a real danger to Earth in the next 100 years. Mars is not yet a safe home for people. Our meter numbers are simplified for play and are not engineering values. Everything else — the storms, the dust, the delay, the lettuce — is real, and each screen names its source.”
          </blockquote>
        </section>

        {/* 4. Image Credits */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <HeartHandshake size={22} className="text-go-lip" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              4. Photography & Media Credits
            </h2>
          </div>

          <ul className="grid gap-3 text-sm text-ink/85 sm:text-base">
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>Jezero Crater & Mars Imagery:</strong> NASA / JPL-Caltech / University of Arizona.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>Earth from Deep Space:</strong> NASA Goddard Space Flight Center / DSCOVR EPIC Science Team.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>InSight Lander on Mars:</strong> NASA / JPL-Caltech.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>Veggie Plant Growth Facility:</strong> NASA Biological & Physical Sciences.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>Solar Eruptions & Prominences:</strong> NASA Solar Dynamics Observatory (SDO) / SOHO.
            </li>
            <li className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
              <strong>Saved APOD (“Aurora over Earth”, shown only when today’s picture cannot load):</strong> Photograph from the International Space Station (ISS Expedition Crew), via NASA Astronomy Picture of the Day Archive.
            </li>
          </ul>
        </section>

        {/* 5. Credits for Generated & Third-Party Content */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <Sparkles size={22} className="text-go-lip" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              5. Generated & Third-Party Content
            </h2>
          </div>

          <div className="space-y-4 text-sm text-ink/85 sm:text-base leading-relaxed">
            <div className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <h3 className="font-display text-base font-extrabold text-ink">Character & Welcome Art</h3>
              <p className="mt-1">
                The crew pictures (Orbit, Nova, Twinkle) and the welcome scenes were made with ChatGPT image generation (OpenAI). The team chose the poses, removed mock-up text and cut out the backgrounds. No NASA logo appears on any suit or machine.
              </p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <h3 className="font-display text-base font-extrabold text-ink">Sound & Audio</h3>
              <p className="mt-1">
                Every sound is made in code by the game itself (Web Audio). No recorded sound files are played.
              </p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <h3 className="font-display text-base font-extrabold text-ink">Typography & Icons</h3>
              <p className="mt-1">
                Fonts: <em>Baloo Da 2</em> by Ek Type (OFL) and <em>Nunito</em> by Vernon Adams (OFL). Vector iconography: Lucide React (ISC License).
              </p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white/60 p-4">
              <h3 className="font-display text-base font-extrabold text-ink">AI Code & Design Assistants</h3>
              <p className="mt-1">
                Claude Code (Anthropic) and Antigravity (Google DeepMind) served as development agents assisting the team with level simulation balancing, TypeScript test authoring, and workflow automation. Every fact on screen was checked on 13 Nov 2026 against the NASA or NOAA source named for it (docs/06 §4); facts we could not confirm were removed.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Team with Roles */}
        <section className="mb-12">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <Users size={22} className="text-ink" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              6. The Team
            </h2>
          </div>

          <p className="mb-3 text-sm text-ink/70">Team CrewReady · Cumilla, Bangladesh</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TEAM.map((m) => (
              <div key={m.role} className="rounded-xl border border-ink/10 bg-white/60 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink/50">{m.role}</p>
                <p className="font-display text-base font-extrabold text-ink">{m.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Use It in Class */}
        <section className="mb-14">
          <div className="mb-4 flex items-center gap-2.5 border-b-2 border-ink/10 pb-2">
            <GraduationCap size={22} className="text-go-lip" />
            <h2 className="font-display text-2xl font-extrabold tracking-wide text-ink">
              7. Use It in Class
            </h2>
          </div>

          <div className="rounded-2xl border-2 border-ink/10 bg-white/80 p-6 shadow-sm">
            <p className="text-base text-ink leading-relaxed">
              CrewReady is designed as a self-contained <strong>15-minute STEM classroom activity</strong>. It runs entirely in any modern browser on low-cost devices and Chromebooks, requires no accounts or student logins, and collects zero personal data.
            </p>

            <h3 className="mt-6 font-display text-lg font-extrabold text-ink">
              What a child can explain after playing:
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {CLASS_LEARNINGS.map((item, i) => (
                <div key={i} className="rounded-xl border border-ink/10 bg-paper/60 p-3.5">
                  <span className="font-display text-xs font-extrabold text-go-lip uppercase tracking-wider">{item.level}</span>
                  <p className="mt-1 text-sm italic text-ink/90">“{item.quote}”</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom Back Button */}
        <div className="text-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-6 py-2.5 font-display text-base font-extrabold tracking-wide text-white transition hover:bg-space active:translate-y-0.5"
          >
            <ArrowLeft size={18} strokeWidth={2.75} />
            <span>Return to Mission</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default Sources;
