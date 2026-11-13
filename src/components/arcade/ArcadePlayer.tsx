// Full-screen player for one arcade game: header, the game, then a result card that pays stardust.
// Used by the Arcade screen and by the bonus round after each mission level.
import { useCallback, useState, type ComponentType } from 'react';
import { Sparkles, Trophy, X, Flame, Lightbulb } from 'lucide-react';
import { useI18n } from '../../content/i18n';
import { useArcade } from '../../store/arcade';
import { useWallet } from '../../store/wallet';
import type { GameId, Settlement } from '../../minigames/arcade/rewards';
import { BlasterGame, FocusGame, GemSwapGame, MergeGame, StarMatchGame, type GameProps } from './games';

export interface GameMeta {
  id: GameId;
  icon: string;
  genre: { en: string; bn: string };
  title: { en: string; bn: string };
  blurb: { en: string; bn: string };
  Component: ComponentType<GameProps>;
}

export const GAMES: GameMeta[] = [
  {
    id: 'match',
    icon: '🃏',
    genre: { en: 'Memory', bn: 'স্মৃতি' },
    title: { en: 'Star Match', bn: 'স্টার ম্যাচ' },
    blurb: { en: 'Flip cards and find the matching space pairs.', bn: 'কার্ড উল্টে একই জোড়া খুঁজে বের করো।' },
    Component: StarMatchGame,
  },
  {
    id: 'blaster',
    icon: '🎯',
    genre: { en: 'Shooter', bn: 'শুটার' },
    title: { en: 'Asteroid Blaster', bn: 'অ্যাস্টেরয়েড ব্লাস্টার' },
    blurb: { en: 'Blast falling asteroids before they hit Earth.', bn: 'পৃথিবীতে পড়ার আগেই গ্রহাণু ফাটাও।' },
    Component: BlasterGame,
  },
  {
    id: 'focus',
    icon: '🧠',
    genre: { en: 'Focus', bn: 'মনোযোগ' },
    title: { en: 'Signal Focus', bn: 'সিগন্যাল ফোকাস' },
    blurb: { en: 'Tap the stars, ignore the black holes. Stay sharp!', bn: 'তারা ট্যাপ করো, ব্ল্যাক হোল এড়াও।' },
    Component: FocusGame,
  },
  {
    id: 'gems',
    icon: '💎',
    genre: { en: 'Match-3', bn: 'ম্যাচ-৩' },
    title: { en: 'Gem Swap', bn: 'জেম সোয়াপ' },
    blurb: { en: 'Swap cosmic gems to chain big combos.', bn: 'মহাজাগতিক রত্ন বদলে বড় কম্বো বানাও।' },
    Component: GemSwapGame,
  },
  {
    id: 'merge',
    icon: '🪐',
    genre: { en: 'Puzzle', bn: 'ধাঁধা' },
    title: { en: 'Cosmic Merge', bn: 'কসমিক মার্জ' },
    blurb: { en: 'Swipe to merge worlds all the way up to a Sun.', bn: 'সোয়াইপ করে গ্রহ মিলিয়ে সূর্য বানাও।' },
    Component: MergeGame,
  },
];

export const gameMeta = (id: GameId) => GAMES.find((g) => g.id === id)!;

export function ArcadePlayer({
  game,
  onClose,
  doneLabel,
  bonus,
}: {
  game: GameId;
  onClose: () => void;
  /** Label of the result button when it just closes (bonus round: "Continue"). */
  doneLabel?: { en: string; bn: string };
  /** Bonus round after a level: shows that framing in the header. */
  bonus?: { levelId: number };
}) {
  const lang = useI18n((s) => s.lang) as 'en' | 'bn';
  const meta = gameMeta(game);
  const submit = useArcade((s) => s.submit);
  const dust = useWallet((s) => s.stardust);
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<{ score: number; pay: Settlement } | null>(null);

  const onEnd = useCallback(
    (score: number) => {
      // Pay exactly once per run; the score comes from the game itself, never from stale component state.
      setResult({ score, pay: submit(game, score) });
    },
    [submit, game],
  );

  const Game = meta.Component;
  const t = (p: { en: string; bn: string }) => (lang === 'bn' ? p.bn : p.en);

  return (
    <div role="dialog" aria-modal="true" aria-label={t(meta.title)} className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/95 p-3 select-none">
      <div className="relative flex h-full max-h-[36rem] w-full max-w-[46rem] flex-col overflow-hidden rounded-2xl border-[3px] border-go bg-panel p-3.5 shadow-2xl sm:p-5">
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-go bg-go/20 text-xl">{meta.icon}</span>
            <div>
              <span className="font-display text-[10px] font-black tracking-wider text-amber-300 uppercase sm:text-xs">
                {bonus ? (lang === 'bn' ? `বোনাস রাউন্ড · লেভেল ${bonus.levelId}` : `BONUS ROUND · LEVEL ${bonus.levelId}`) : t(meta.genre)}
              </span>
              <h2 className="font-display text-sm leading-tight font-black text-white sm:text-base">{t(meta.title)}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-1 font-display text-xs font-black text-amber-300" aria-label={`${dust} stardust`}>
              <Sparkles size={13} /> {dust} ✦
            </span>
            <button type="button" onClick={onClose} aria-label={lang === 'bn' ? 'বন্ধ করো' : 'Close'} className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel-up text-muted hover:text-white cursor-pointer">
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden py-2.5">
          <Game key={round} lang={lang} onEnd={onEnd} />
        </div>

        {result && (
          <div className="absolute inset-0 z-30 grid place-items-center overflow-y-auto bg-space-deep/92 p-4 anim-pop-in">
            <div className="flex w-full max-w-sm flex-col items-center rounded-2xl border-[3px] border-go bg-panel p-5 text-center shadow-2xl">
              <div className="mb-2 grid h-14 w-14 place-items-center rounded-full border-2 border-amber-400 bg-amber-400/20 text-amber-400">
                <Trophy size={30} />
              </div>
              <h3 className="font-display text-xl font-black text-white">
                {result.pay.isBest ? (lang === 'bn' ? 'নতুন রেকর্ড! 🎉' : 'New best score! 🎉') : lang === 'bn' ? 'খেলা শেষ!' : 'Round complete!'}
              </h3>
              <p className="mt-1 font-display text-sm font-bold text-muted">
                {lang === 'bn' ? 'স্কোর' : 'Score'}: <span className="text-white">{result.score}</span>
              </p>

              <div className="mt-3 w-full space-y-1 rounded-xl border border-line bg-space p-2.5 text-left font-display text-xs font-bold text-text">
                <Row label={lang === 'bn' ? 'স্কোরের জন্য' : 'For your score'} value={result.pay.base} />
                {result.pay.featuredBonus > 0 && <Row label={lang === 'bn' ? 'আজকের বিশেষ গেম বোনাস' : 'Game of the day bonus'} value={result.pay.featuredBonus} />}
                {result.pay.streakBonus > 0 && (
                  <Row
                    label={
                      <span className="inline-flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" />
                        {lang === 'bn' ? `${result.pay.streak} দিনের ধারা` : `${result.pay.streak}-day streak`}
                      </span>
                    }
                    value={result.pay.streakBonus}
                  />
                )}
              </div>
              <div className="mt-2.5 flex items-center gap-2 rounded-full border-2 border-amber-400/60 bg-amber-500/20 px-4 py-1.5 font-display text-base font-black text-amber-300">
                <Sparkles size={18} />
                <span>+{result.pay.total} ✦ {lang === 'bn' ? 'স্টারডাস্ট' : 'Stardust'}</span>
              </div>
              {result.pay.halfPay && (
                <p className="mt-1.5 text-[11px] font-bold text-muted">{lang === 'bn' ? 'আজ এই গেম ৩ বার খেলেছ: পুরস্কার অর্ধেক। অন্য গেম চেষ্টা করো!' : 'You’ve played this 3 times today: half pay. Try another game!'}</p>
              )}
              <p className="mt-2 flex items-start gap-1.5 text-left text-[11px] leading-snug font-bold text-cyan-200">
                <Lightbulb size={13} className="mt-px shrink-0" />
                {lang === 'bn' ? 'স্টারডাস্ট দিয়ে টুইঙ্কলের ইঙ্গিত (৫ ✦) আর কার্গো আপগ্রেড কিনতে পারো।' : 'Spend stardust on Twinkle’s hints (5 ✦) and cargo upgrades in Resources.'}
              </p>

              <div className="mt-4 flex w-full gap-2">
                {!bonus && (
                  <button
                    type="button"
                    onClick={() => {
                      setResult(null);
                      setRound((n) => n + 1);
                    }}
                    className="flex-1 rounded-xl border-2 border-line bg-panel-up py-3 font-display text-sm font-black text-white hover:bg-panel cursor-pointer"
                  >
                    {lang === 'bn' ? 'আবার খেলো' : 'Play again'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-gradient-to-b from-[#48e3f0] to-go py-3 font-display text-sm font-black text-go-text shadow-[0_0.3rem_0_var(--color-go-lip)] active:translate-y-0.5 cursor-pointer"
                >
                  {doneLabel ? t(doneLabel) : lang === 'bn' ? 'ফিরে যাও' : 'Back to Arcade'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-amber-300">+{value} ✦</span>
    </div>
  );
}
