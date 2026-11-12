// Marvel-style Dynamic Comic Panel Overlay (BUILD_SEQUENCE.md K4 & Task 1)
// Displays stylized cinematic comic panels for Earth's 5 crises with comic sound chips,
// bold typography, and NCTB / kid-friendly textbook bilingual explanations.
import { 
  Users, 
  Factory, 
  Droplets, 
  Cpu, 
  Biohazard, 
  AlertTriangle,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useI18n } from '../content/i18n';

export type CrisisId = 'population' | 'pollution' | 'resources' | 'ai' | 'pandemic';

export interface CrisisDetail {
  id: CrisisId;
  comicSound: string;
  comicSoundBn: string;
  icon: typeof AlertTriangle;
  titleEn: string;
  titleBn: string;
  textEn: string;
  textBn: string;
  accent: string;
  borderCol: string;
  badgeCol: string;
}

export const CRISIS_DATA: CrisisDetail[] = [
  {
    id: 'population',
    comicSound: 'OVERFLOW!',
    comicSoundBn: 'ভিড় বাড়ছে!',
    icon: Users,
    titleEn: 'Mega-Cities Overcrowding',
    titleBn: 'জনসংখ্যা বিস্ফোরণ ও মেগা-সিটি',
    textEn: 'Billions of people fill every city. Space and homes are running out!',
    textBn: 'শহরগুলোতে উপচে পড়ছে ভিড়। বাসস্থান ও খোলা জায়গা কমে আসছে!',
    accent: 'from-amber-500/30 to-rose-600/30',
    borderCol: 'border-amber-400/80',
    badgeCol: 'bg-amber-500 text-amber-950',
  },
  {
    id: 'pollution',
    comicSound: 'SMOG SMASH!',
    comicSoundBn: 'বিষাক্ত ধোঁয়া!',
    icon: Factory,
    titleEn: 'Toxic Smog & Pollution',
    titleBn: 'পরিবেশ দূষণ ও ধোঁয়াশা',
    textEn: 'Dark factory smoke blocks the sun. Clean rivers and air are fading.',
    textBn: 'কারখানার বিষাক্ত ধোঁয়ায় ঢেকে গেছে আকাশ। কমে গেছে নির্মল বাতাস ও পানি।',
    accent: 'from-yellow-600/30 to-stone-800/40',
    borderCol: 'border-yellow-400/80',
    badgeCol: 'bg-yellow-500 text-yellow-950',
  },
  {
    id: 'resources',
    comicSound: 'EMPTY DRY!',
    comicSoundBn: 'পানি শেষ!',
    icon: Droplets,
    titleEn: 'Resource Drought',
    titleBn: 'প্রাকৃতিক সম্পদের সংকট',
    textEn: 'Clean drinking water is dried up. Energy power grids are flickering black.',
    textBn: 'নদী-নালা শুকিয়ে পানি শেষ। বিদ্যুৎ কেন্দ্রগুলোর আলো নিভে আসছে।',
    accent: 'from-blue-600/30 to-cyan-800/40',
    borderCol: 'border-cyan-400/80',
    badgeCol: 'bg-cyan-500 text-cyan-950',
  },
  {
    id: 'ai',
    comicSound: 'GLITCH ZAP!',
    comicSoundBn: 'সাইবার অ্যালার্ম!',
    icon: Cpu,
    titleEn: 'Rogue AI Swarm Alert',
    titleBn: 'এআই ও সাইবার বিভ্রান্তি',
    textEn: 'Super AI systems glitched! Satellites and robotics stopped obeying humans.',
    textBn: 'মহাকাশ কৃত্রিম বুদ্ধিমত্তায় সমস্যা দেখা দিয়েছে! যোগাযোগ সংকেত বিচ্ছিন্ন।',
    accent: 'from-red-600/30 to-purple-900/40',
    borderCol: 'border-red-400/80',
    badgeCol: 'bg-red-500 text-red-950',
  },
  {
    id: 'pandemic',
    comicSound: 'BIO-ALARM!',
    comicSoundBn: 'লকডাউন অ্যালার্ট!',
    icon: Biohazard,
    titleEn: 'Sudden Global Pandemic',
    titleBn: 'হঠাৎ মহামারী ও ভাইরাস',
    textEn: 'A sudden outbreak arrived like Covid. Bio-domes locked down entire nations.',
    textBn: 'করোনার মতো নতুন ভাইরাসের প্রাদুর্ভাব ঘটেছে। শহরগুলোতে চলছে কোয়ারেন্টাইন।',
    accent: 'from-emerald-600/30 to-teal-900/40',
    borderCol: 'border-emerald-400/80',
    badgeCol: 'bg-emerald-500 text-emerald-950',
  },
];

interface ComicPanelOverlayProps {
  activeCrisisIndex: number;
  onSelectCrisis?: (index: number) => void;
}

export function ComicPanelOverlay({ activeCrisisIndex, onSelectCrisis }: ComicPanelOverlayProps) {
  const lang = useI18n((s) => s.lang);
  const current = CRISIS_DATA[activeCrisisIndex % CRISIS_DATA.length];
  const Icon = current.icon;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-3 sm:p-5 select-none">
      {/* Top Marvel Header: Call to Humanity */}
      <div className="flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2 rounded-xl border-2 border-red-500/80 bg-red-950/80 px-3.5 py-1.5 shadow-lg shadow-red-950/50">
          <ShieldAlert size={20} className="text-red-400 animate-pulse" />
          <div className="flex flex-col">
            <span className="font-display text-[10px] sm:text-xs font-black tracking-widest text-red-400 uppercase">
              {lang === 'bn' ? 'জরুরি বৈশ্বিক সতর্কবার্তা' : 'CRITICAL EARTH EVENT: SOL-214'}
            </span>
            <span className="font-display text-xs sm:text-sm font-extrabold text-white">
              {lang === 'bn' ? 'মানবতার ভবিষ্যৎ এখন তোমার হাতে!' : 'YOUR DECISION MATTERS TO KEEP HUMANITY ALIVE'}
            </span>
          </div>
        </div>

        {/* Marvel Comic SFX Sound Banner (Dynamic Angle) */}
        <div className="pointer-events-auto hidden sm:flex items-center -rotate-6 rounded-lg border-2 border-amber-300 bg-amber-400 px-3 py-1 text-black font-display font-black text-sm tracking-wider shadow-[0_4px_0_#92400e]">
          <Flame size={16} className="mr-1 text-red-600 fill-red-600" />
          <span>{lang === 'bn' ? current.comicSoundBn : current.comicSound}</span>
        </div>
      </div>

      {/* Center-Right Comic Strip Card */}
      <div className="pointer-events-auto flex items-center justify-end">
        <div 
          key={current.id}
          className={`w-full max-w-sm sm:max-w-md transform transition-all duration-500 rounded-2xl border-3 ${current.borderCol} bg-gradient-to-br ${current.accent} bg-panel/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-none`}
        >
          {/* Card Category Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-display text-[11px] font-extrabold tracking-wider uppercase ${current.badgeCol}`}>
              <Icon size={14} />
              <span>{lang === 'bn' ? `সংকট ${activeCrisisIndex + 1} / 5` : `Threat ${activeCrisisIndex + 1} of 5`}</span>
            </span>

            {/* Comic Sound chip on small screens */}
            <span className="sm:hidden font-display text-xs font-black text-amber-300 uppercase">
              {lang === 'bn' ? current.comicSoundBn : current.comicSound}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-lg sm:text-xl font-black text-white tracking-wide">
            {lang === 'bn' ? current.titleBn : current.titleEn}
          </h3>

          {/* Body Text */}
          <p className="mt-1 font-display text-xs sm:text-sm font-bold text-text/90 leading-relaxed">
            {lang === 'bn' ? current.textBn : current.textEn}
          </p>

          {/* Interactive Thumb Navigation Strip */}
          <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-white/20">
            {CRISIS_DATA.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCrisis?.(idx)}
                aria-label={c.titleEn}
                className={`h-2 sm:h-2.5 flex-1 rounded-full transition-all cursor-pointer ${
                  idx === activeCrisisIndex 
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Comic Dialogue Box */}
      <div className="pointer-events-auto flex items-end justify-between">
        <div className="rounded-xl border-2 border-cyan-400/80 bg-space-deep/90 px-3.5 py-2 text-white shadow-xl max-w-lg">
          <p className="font-display text-xs sm:text-sm font-extrabold text-cyan-300">
            {lang === 'bn' ? (
              <>
                <span className="text-amber-400">টুইঙ্কেল:</span> "চিন্তা নেই দোস্ত! - <span className="underline decoration-go text-white">CrewREADY</span> তোমাকে প্রস্তুত করতে একদম তৈরি!"
              </>
            ) : (
              <>
                <span className="text-amber-400">Twinkle:</span> "No worries dude. - <span className="underline decoration-go text-white">CrewREADY</span> is ready to make you READY!"
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
