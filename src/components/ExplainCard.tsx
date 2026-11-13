// Explain Card Modal & Read-to-me Experience (plan.md §5.5 & BUILD_SEQUENCE.md K2)
// Teaches space concepts using simple NCTB-familiar terms and awards +2 Stardust on first read.
import { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen,
} from 'lucide-react';
import { ExplainEntry } from '../content/explain';
import { useI18n } from '../content/i18n';
import { useWallet } from '../store/wallet';
import { speak, stopSpeaking } from './speech';
import { SourceLinks } from './Panel';

interface ExplainCardProps {
  entry: ExplainEntry;
  onClose: () => void;
}

export function ExplainCard({ entry, onClose }: ExplainCardProps) {
  const lang = useI18n((s) => s.lang);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [newlyEarned, setNewlyEarned] = useState(false);

  // Award +2 Stardust if read for the first time
  useEffect(() => {
    const earned = useWallet.getState().earn('explain_card', 2, { cardId: entry.id });
    if (earned > 0) {
      setNewlyEarned(true);
    }
  }, [entry.id]);

  const handleReadToMe = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToRead = lang === 'bn' 
        ? `${entry.titleBn}. ${entry.sentencesBn.join(' ')}`
        : `${entry.titleEn}. ${entry.sentencesEn.join(' ')}`;
      
      speak(textToRead, lang, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  const Icon = entry.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-5 select-none"
    >
      <div className="relative flex max-w-md w-full max-h-[90vh] overflow-y-auto flex-col rounded-2xl border-3 border-go bg-panel p-4 sm:p-5 shadow-2xl anim-pop-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-go/20 text-go border border-go">
              <Icon size={20} />
            </span>
            <div>
              <span className="font-display text-[10px] sm:text-xs font-black tracking-wider text-amber-300 uppercase">
                {lang === 'bn' ? 'মহাকাশ জ্ঞান' : 'SPACE SCIENCE FACT'}
              </span>
              <h2 className="font-display text-base sm:text-lg font-black text-white leading-tight">
                {lang === 'bn' ? entry.titleBn : entry.titleEn}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel-up text-muted hover:text-white transition cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Bangladesh Textbook Equivalent Pill */}
        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-line bg-space-deep/80 px-2.5 py-1 text-xs text-cyan-300">
          <BookOpen size={13} className="shrink-0 text-cyan-400" />
          <span className="font-display font-extrabold truncate">
            {lang === 'bn' ? `পাঠ্যবইয়ের সহজ নাম: ${entry.nctbAltBn}` : `Simple Concept: ${entry.sentencesEn[0]}`}
          </span>
        </div>

        {/* Content Sentences (Under 12 words per line) */}
        <div className="mt-3 space-y-1.5 rounded-xl border border-line/80 bg-space p-3 text-sm text-text">
          {(lang === 'bn' ? entry.sentencesBn : entry.sentencesEn).map((sentence, idx) => (
            <p key={idx} className="font-display font-bold leading-relaxed">
              • {sentence}
            </p>
          ))}
        </div>

        {/* Twinkle's Gen Alpha Take */}
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-400/40 bg-amber-500/10 p-2.5">
          <img
            src={`${import.meta.env.BASE_URL}art/twinkle-happy.webp`}
            alt="Twinkle"
            className="h-8 w-8 object-contain shrink-0"
          />
          <div>
            <span className="font-display text-[11px] font-black text-amber-300 uppercase">
              Twinkle Says:
            </span>
            <p className="font-display text-xs font-bold text-white leading-snug">
              "{lang === 'bn' ? entry.genAlphaComment.bn : entry.genAlphaComment.en}"
            </p>
          </div>
        </div>

        {/* First-Read Stardust Reward Notification */}
        {newlyEarned && (
          <div className="mt-2.5 flex items-center justify-center gap-1.5 rounded-full border border-good bg-good/20 py-1 text-xs font-display font-black text-good anim-pop-in">
            <Sparkles size={14} />
            <span>{lang === 'bn' ? '+২ ✦ স্টারডাস্ট অর্জিত!' : '+2 ✦ Stardust Collected!'}</span>
          </div>
        )}

        {/* Footer: Read-to-me & Source */}
        <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2.5">
          <span className="font-display text-[11px] text-muted max-w-[14rem]">
            <SourceLinks text={entry.source} />
          </span>

          <button
            type="button"
            onClick={handleReadToMe}
            className="flex min-h-[2.25rem] items-center gap-1.5 rounded-full border border-line bg-panel-up px-3 py-1 font-display text-xs font-extrabold text-white hover:bg-panel transition cursor-pointer"
          >
            {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isSpeaking ? (lang === 'bn' ? 'থামান' : 'Stop') : (lang === 'bn' ? 'পড়ে শোনাও' : 'Read to Me')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
