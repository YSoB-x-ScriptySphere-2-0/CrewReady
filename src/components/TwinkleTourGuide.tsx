// Twinkle's Tour Guide — Guided walkthrough of the flight deck buttons & NASA data sources
import { useEffect, useState } from 'react';
import {
  Play,
  Rocket,
  Map as MapIcon,
  Dumbbell,
  BookOpen,
  UserRound,
  Sun,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Database,
} from 'lucide-react';
import { type TwinkleMood, TwinkleSays } from './Twinkle';
import { MusicToggle } from './MusicToggle';

export interface TourStep {
  id: string;
  buttonName: string;
  badge: string;
  headline: string;
  mood: TwinkleMood;
  speech: string;
  description: string;
  sourceShort: string;
  sourceDataset: string;
  agency: string;
  icon: typeof Play;
  accent: string;
  btnPreview: {
    label: string;
    style: string;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'play',
    buttonName: 'PLAY / CONTINUE (Main Mission)',
    badge: 'Main Launch Button',
    headline: 'Command the 6-Level Mars Journey',
    mood: 'happy',
    speech: "Beep-boop! I'm Twinkle, your mission companion! The big PLAY button starts your epic 500-Sol expedition to Mars!",
    description:
      'Lead your astronaut crew (Orbit & Nova) across 6 authentic mission chapters from Earth launch to Jezero Base. Balance your Power, Air & Water, Food, and Shield as real cosmic crises strike.',
    sourceShort: 'NASA Earth Imagery, Solar Storms, Mars Climate & ISS Biology',
    sourceDataset:
      'NASA EPIC (natural-color deep-space Earth photos) · NASA DONKI & NOAA SWPC (live solar storm CMEs & radiation) · NASA InSight (real Sol 675 Martian temperature swings -96.9°C to -15.9°C) · NASA OSDR Veggie (ISS plant growth & nutrients) · NASA Mars 2020 Perseverance (Jezero Crater entry, descent, and touchdown telemetry).',
    agency: 'NASA / NOAA / JPL',
    icon: Play,
    accent: 'from-[#48e3f0] to-go text-go-text',
    btnPreview: {
      label: 'PLAY',
      style: 'bg-gradient-to-b from-[#48e3f0] to-go text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)]',
    },
  },
  {
    id: 'fly',
    buttonName: 'FLY (Orbital Spacecraft Runner)',
    badge: 'Arcade Mini-Game',
    headline: 'Pilot the Mars Exploration Spacecraft',
    mood: 'tablet',
    speech: 'Take the controls of our reconnaissance spacecraft! Steer across 3 orbital lanes, hop over low rocks, and collect stardust minerals!',
    description:
      'High-speed 3D arcade orbital flight. Steer left and right, jump over low Martian ridges, dodge monolith spires and satellite debris, deploy shields, trigger magnets, and blast hyperdrive boost!',
    sourceShort: 'NOAA SWPC Live Kp Solar Wind & NASA DONKI Superstorms',
    sourceDataset:
      'NOAA Space Weather Prediction Center Planetary K-Index: live 3-hour solar wind readings dynamically govern your spacecraft cruise velocity (fast, medium, slow) · NASA CCMC DONKI (May 2024 solar superstorm archive simulation).',
    agency: 'NOAA SWPC & NASA CCMC',
    icon: Rocket,
    accent: 'from-[#0F8F9C] to-go text-white',
    btnPreview: {
      label: 'Fly',
      style: 'bg-panel-up border-2 border-line text-text hover:border-go',
    },
  },
  {
    id: 'map',
    buttonName: 'MISSIONS (Flight Trajectory Map)',
    badge: 'Navigation Rail',
    headline: 'Track Your Interplanetary Route',
    mood: 'stars',
    speech: 'Track our 225-million-kilometer trajectory from Earth to Jezero Base!',
    description:
      'Interactive flight plan showing all 6 mission waypoints from Earth Launch Pad (Sol 0) through Deep Space Cruise, Mars Orbit, Atmospheric Entry, Greenhouse Farming, and the Sol 214 Dust Storm.',
    sourceShort: 'NASA JPL Orbital Trajectories & Perseverance Landing Site',
    sourceDataset:
      'NASA Jet Propulsion Laboratory (JPL) planetary transfer trajectories and Mars 2020 landing coordinates at Jezero Crater (18.38°N 77.58°E).',
    agency: 'NASA JPL',
    icon: MapIcon,
    accent: 'from-blue-500 to-indigo-600 text-white',
    btnPreview: {
      label: 'Missions',
      style: 'bg-panel-up border border-line text-text',
    },
  },
  {
    id: 'training',
    buttonName: 'TRAINING (Simulation Lab)',
    badge: 'Astronaut Drills',
    headline: 'Master Critical Space Survival Drills',
    mood: 'question',
    speech: 'Practice makes perfect, Commander! Train before facing real deep-space emergencies.',
    description:
      'Interactive simulation training: Solar Storm Emergency Shielding (positioning water wall shields), Greenhouse Hydroponic Water Balancer, and Mars Lander Retro-Thruster Touchdown Timing.',
    sourceShort: 'NASA Human Research Program (HRP) & ECLSS Life Support',
    sourceDataset:
      'NASA Human Research Program radiation safety protocols · NASA Environmental Control and Life Support System (ECLSS) 98% closed-loop water recovery standards.',
    agency: 'NASA HRP & ECLSS',
    icon: Dumbbell,
    accent: 'from-purple-500 to-indigo-500 text-white',
    btnPreview: {
      label: 'Training',
      style: 'bg-panel-up border border-line text-text',
    },
  },
  {
    id: 'resources',
    buttonName: 'RESOURCES (Science Data Lab)',
    badge: 'NASA STEM Library',
    headline: 'Inspect 3D NASA Spacecraft & Science Data',
    mood: 'tablet',
    speech: 'Curious about the science? Explore real 3D models and verified deep-space datasets!',
    description:
      'Hands-on interactive science lab with 3D models of NASA Curiosity Rover, Apollo Lunar Module, the International Space Station, and the Space Exploration Vehicle, alongside child-friendly glossary cards.',
    sourceShort: 'NASA Technical Reports (NTRS) & Open Science Data (OSDR)',
    sourceDataset:
      'NASA Technical Reports Server (NTRS), NASA Open Science Data Repository (OSDR), and official NASA 3D Asset Resources.',
    agency: 'NASA Science Fleet',
    icon: BookOpen,
    accent: 'from-emerald-500 to-teal-600 text-white',
    btnPreview: {
      label: 'Resources',
      style: 'bg-panel-up border border-line text-text',
    },
  },
  {
    id: 'profile',
    buttonName: 'ME / PROFILE (Astronaut Identity)',
    badge: 'Commander Dossier',
    headline: 'Your Flight Record, Badges & Callsign',
    mood: 'wink',
    speech: 'Customize your commander callsign, track earned mission badges, and adjust audio settings!',
    description:
      'View your astronaut ID, generate official mission callsigns, track earned mission badges (from Earth Departure to Outpost Commander), review flight telemetry, and check the Hall of Fame leaderboard.',
    sourceShort: 'NASA Astronaut Candidate Training & Selection Standards',
    sourceDataset:
      'NASA Astronaut Candidate Selection Requirements and Artemis Program crew specialization competency frameworks.',
    agency: 'NASA Flight Operations',
    icon: UserRound,
    accent: 'from-amber-400 to-orange-500 text-white',
    btnPreview: {
      label: 'Me',
      style: 'bg-panel-up border border-line text-text',
    },
  },
  {
    id: 'spaceweather',
    buttonName: 'SPACE WEATHER (Sun Storm Chip)',
    badge: 'Live Dashboard Telemetry',
    headline: 'Real-Time Solar Storm Telemetry',
    mood: 'surprised',
    speech: 'Keep an eye on the Sun! Solar storms blast radiation and stir up space weather!',
    description:
      'Live planetary K-index gauge right on your dashboard. When the Sun fires a coronal mass ejection, magnetic disturbances rise from calm (Kp 0–3) to extreme (Kp 7–9), increasing radiation danger.',
    sourceShort: 'NOAA SWPC Live 3-Hour Planetary K-Index Stream',
    sourceDataset:
      'NOAA Space Weather Prediction Center live JSON telemetry API, measuring geomagnetic field disturbances on a 0 to 9 planetary scale.',
    agency: 'NOAA SWPC',
    icon: Sun,
    accent: 'from-amber-500 to-rose-500 text-white',
    btnPreview: {
      label: 'Space weather',
      style: 'bg-panel border-2 border-line text-text',
    },
  },
];

interface TwinkleTourGuideProps {
  onClose: () => void;
  initialStepIndex?: number;
}

export function TwinkleTourGuide({ onClose, initialStepIndex = 0 }: TwinkleTourGuideProps) {
  const [index, setIndex] = useState(initialStepIndex);
  const step = TOUR_STEPS[index];
  const isFirst = index === 0;
  const isLast = index === TOUR_STEPS.length - 1;

  // Keyboard navigation: Left/Right arrows, Esc to exit, Enter to proceed
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (!isLast) setIndex((i) => i + 1);
      } else if (e.key === 'ArrowLeft') {
        if (!isFirst) setIndex((i) => i - 1);
      } else if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter') {
        if (isLast) onClose();
        else setIndex((i) => i + 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFirst, isLast, onClose]);

  const Icon = step.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Twinkle's Tour Guide"
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-5 text-text backdrop-blur-md select-none overflow-y-auto"
    >
      <div className="relative flex w-full max-w-2xl flex-col rounded-3xl border-2 border-line bg-panel p-4 sm:p-6 shadow-2xl">
        {/* Top Header Strip: Twinkle Tag, Step Counter, Music & Close */}
        <div className="flex items-center justify-between gap-2 border-b border-line/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-go/20 text-go font-display font-extrabold text-xs border border-go/40">
              <Sparkles size={14} />
            </span>
            <span className="font-display text-sm font-extrabold tracking-wide uppercase text-go">
              Twinkle&apos;s Flight Deck Tour
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-space-deep/80 px-2.5 py-0.5 font-display text-xs font-bold text-muted border border-line/50">
              {index + 1} / {TOUR_STEPS.length}
            </span>
            <MusicToggle compact />
            <button
              onClick={onClose}
              aria-label="Close tour"
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/10 hover:bg-white/20 text-text transition active:scale-95"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-2.5">
          {TOUR_STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Jump to step ${i + 1}: ${s.buttonName}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === index ? 'w-8 bg-go shadow-[0_0_8px_rgba(34,215,230,0.6)]' : 'w-2 bg-line hover:bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-3 py-1">
          {/* Twinkle Speech Bubble */}
          <div className="shrink-0">
            <TwinkleSays mood={step.mood} size={54}>
              <span className="text-[1rem] leading-snug">{step.speech}</span>
            </TwinkleSays>
          </div>

          {/* Button Card & Details */}
          <div className="rounded-2xl border-2 border-line/80 bg-space-deep/60 p-4 shadow-inner">
            {/* Button Preview & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-b ${step.accent} shadow-md`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-text leading-tight">
                    {step.buttonName}
                  </h2>
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-muted">
                    {step.badge}
                  </span>
                </div>
              </div>

              {/* Sample Button Replica */}
              <div className="hidden sm:block">
                <span className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 font-display text-xs font-extrabold ${step.btnPreview.style}`}>
                  <Icon size={14} />
                  <span>{step.btnPreview.label}</span>
                </span>
              </div>
            </div>

            {/* What this button does */}
            <p className="font-sans text-sm sm:text-base leading-relaxed text-text/90 mb-3">
              {step.description}
            </p>

            {/* Small Font Data Source Box */}
            <div className="rounded-xl border border-line/50 bg-panel/85 p-2.5 text-left">
              <div className="flex items-center gap-1.5 text-go text-[0.6875rem] font-extrabold uppercase tracking-wider mb-1">
                <Database size={12} />
                <span>NASA & NOAA Science Data Used</span>
                <span className="ml-auto text-muted/70 font-mono text-[0.625rem]">{step.agency}</span>
              </div>

              {/* In Small Font: What data has been used there shortly as source */}
              <p className="font-sans text-[0.75rem] leading-snug text-muted">
                {step.sourceDataset}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Previous, Skip, Next / Start */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/60 pt-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={isFirst}
            className="inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-xl border border-line bg-panel-up px-3.5 py-1.5 font-display text-xs font-bold text-text transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-panel active:translate-y-0.5 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Previous</span>
          </button>

          <button
            onClick={onClose}
            className="text-xs text-muted hover:text-text underline-offset-4 hover:underline cursor-pointer"
          >
            Skip to Intro
          </button>

          {isLast ? (
            <button
              onClick={onClose}
              autoFocus
              className="anim-pop inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl border-2 border-go bg-gradient-to-b from-[#48e3f0] to-go px-5 py-2 font-display text-sm font-extrabold text-go-text shadow-[0_0.25rem_0_var(--color-go-lip),0_0_1rem_rgba(34,215,230,0.4)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <span>Start Mission</span>
              <ArrowRight size={16} strokeWidth={2.75} />
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(TOUR_STEPS.length - 1, i + 1))}
              autoFocus
              className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl border-2 border-go bg-gradient-to-b from-[#48e3f0] to-go px-5 py-2 font-display text-sm font-extrabold text-go-text shadow-[0_0.25rem_0_var(--color-go-lip)] transition hover:brightness-105 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight size={16} strokeWidth={2.75} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TwinkleTourGuide;
