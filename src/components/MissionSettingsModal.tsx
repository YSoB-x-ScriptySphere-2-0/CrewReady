import { Settings, X, Globe, Volume2, UserRound, ChevronRight } from 'lucide-react';
import { useI18n } from '../content/i18n';
import { useGame } from '../store/game';
import { spaceMusic } from '../services/audio';
import { MusicToggle } from './MusicToggle';

export function MissionSettingsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const lang = useI18n((s) => s.lang);
  const go = useGame((s) => s.go);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-line bg-panel p-4 sm:p-6 shadow-2xl text-text">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2">
            <Settings className="text-go h-6 w-6" />
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">
              {lang === 'bn' ? 'মিশন সেটিংস' : 'Mission Settings'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-space-deep text-muted hover:text-white transition cursor-pointer"
            aria-label={lang === 'bn' ? 'বন্ধ করো' : 'Close'}
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-3.5">
          {/* Language Selection */}
          <div className="rounded-2xl border border-line bg-space-deep/60 p-3.5">
            <div className="flex items-center gap-2 mb-2 font-display text-xs font-black uppercase tracking-wider text-muted">
              <Globe size={15} className="text-go" />
              <span>{lang === 'bn' ? 'ভাষা নির্বাচন / Language' : 'Language Selection'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => useI18n.getState().setLang('en')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-display text-sm font-extrabold transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-go text-go-text border-go shadow-[0_0_12px_rgba(34,215,230,0.4)]'
                    : 'bg-panel border-line text-muted hover:text-text'
                }`}
              >
                <span>🇬🇧 English</span>
              </button>
              <button
                type="button"
                onClick={() => useI18n.getState().setLang('bn')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-display text-sm font-extrabold transition cursor-pointer ${
                  lang === 'bn'
                    ? 'bg-go text-go-text border-go shadow-[0_0_12px_rgba(34,215,230,0.4)]'
                    : 'bg-panel border-line text-muted hover:text-text'
                }`}
              >
                <span>🇧🇩 বাংলা</span>
              </button>
            </div>
          </div>

          {/* Audio & Music */}
          <div className="rounded-2xl border border-line bg-space-deep/60 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 size={20} className="text-go" />
                <div>
                  <div className="font-display text-sm font-extrabold text-white">
                    {lang === 'bn' ? 'মহাকাশ সঙ্গীত ও সাউন্ড' : 'Space Music & Sound'}
                  </div>
                  <div className="text-xs text-muted">
                    {spaceMusic.getMuted() ? (lang === 'bn' ? 'সাউন্ড বন্ধ' : 'Muted') : (lang === 'bn' ? 'সাউন্ড চালু (উচ্চ ভলিউম)' : 'Playing (Loud & Clear)')}
                  </div>
                </div>
              </div>
              <MusicToggle compact />
            </div>
          </div>

          {/* Visit Full Profile & Settings Screen */}
          <button
            type="button"
            onClick={() => {
              onClose();
              go('profile');
            }}
            className="flex items-center justify-between rounded-2xl border border-white/20 bg-panel-up/80 p-3 hover:bg-panel active:scale-[0.98] transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-space-deep text-go">
                <UserRound size={17} />
              </div>
              <div className="text-left">
                <div className="font-display text-sm font-extrabold text-white">
                  {lang === 'bn' ? 'ক্যাডেট প্রোফাইল ও সব সেটিংস' : 'Cadet Profile & Full Settings'}
                </div>
                <div className="text-[11px] text-muted">
                  {lang === 'bn' ? 'মিশন প্রোগ্রেস ও বিস্তারিত অপশন' : 'View cadet stats, badges & full controls'}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-muted" />
          </button>

          {/* Resume Mission Button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-1 flex w-full items-center justify-center rounded-2xl bg-go py-3 font-display text-base font-black text-go-text shadow-lg hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            {lang === 'bn' ? 'মিশনে ফিরে যাও' : 'Resume Mission'}
          </button>
        </div>
      </div>
    </div>
  );
}
