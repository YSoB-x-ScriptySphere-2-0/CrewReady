// Space Arcade hub: every mini-game in one list, best scores, game of the day, daily streak.
// Stardust earned here goes to the shared wallet and is spent on hints and cargo upgrades.
import { useState } from 'react';
import { ArrowLeft, Flame, Sparkles, Star } from 'lucide-react';
import { useGame } from '../store/game';
import { useWallet } from '../store/wallet';
import { useArcade } from '../store/arcade';
import { useI18n } from '../content/i18n';
import { dayKey, featuredGame, FEATURED_BONUS, FULL_PAY_PLAYS, type GameId } from '../minigames/arcade/rewards';
import { ArcadePlayer, GAMES } from '../components/arcade/ArcadePlayer';

export function Arcade() {
  const go = useGame((s) => s.go);
  const lang = useI18n((s) => s.lang) as 'en' | 'bn';
  const dust = useWallet((s) => s.stardust);
  const { bests, plays, playsDay, streak, lastDay, streakPaidDay } = useArcade();
  const [playing, setPlaying] = useState<GameId | null>(null);

  const today = dayKey();
  const featured = featuredGame(today);
  const bn = lang === 'bn';
  const playsToday = (id: GameId) => (playsDay === today ? plays[id] ?? 0 : 0);
  // Show the streak as alive if you played today or yesterday.
  const streakShown = lastDay === today ? streak : lastDay && streak > 0 ? streak : 0;
  const bonusReady = streakPaidDay !== today;

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-space p-3 text-text select-none font-sans sm:p-5">
      <header className="flex flex-shrink-0 items-center justify-between border-b-2 border-line/40 pb-3">
        <button type="button" onClick={() => go('home')} className="flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-line bg-panel-up px-3 font-display text-sm font-bold cursor-pointer">
          <ArrowLeft size={16} /> {bn ? 'হোম' : 'Home'}
        </button>
        <h1 className="font-display text-xl font-black tracking-wide text-white sm:text-2xl">🎮 {bn ? 'স্পেস আর্কেড' : 'Space Arcade'}</h1>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full border border-amber-400/50 bg-amber-500/15 px-3 py-1 font-display text-sm font-black text-amber-300">
            <Sparkles size={14} /> {dust} ✦
          </span>
        </div>
      </header>

      <section className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-panel/70 p-2.5 text-xs font-bold text-muted sm:text-sm">
        <span className="inline-flex items-center gap-1 text-orange-300">
          <Flame size={15} /> {streakShown}-{bn ? 'দিনের ধারা' : 'day streak'}
        </span>
        <span>
          {bonusReady
            ? bn ? `আজ প্রথম খেলায় +${Math.min(streakShown + 1, 5)} ✦ বোনাস` : `First win today: +${Math.min(streakShown + 1, 5)} ✦ streak bonus`
            : bn ? 'আজকের ধারা বোনাস নেওয়া হয়েছে ✓' : 'Today’s streak bonus collected ✓'}
        </span>
        <span className="ml-auto text-cyan-200">{bn ? 'স্টারডাস্ট = টুইঙ্কলের ইঙ্গিত + কার্গো আপগ্রেড' : 'Stardust buys hints + cargo upgrades'}</span>
      </section>

      <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((g) => {
          const isFeatured = g.id === featured;
          const left = Math.max(0, FULL_PAY_PLAYS - playsToday(g.id));
          return (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setPlaying(g.id)}
                className={`relative flex h-full w-full items-start gap-3 rounded-2xl border-2 bg-panel p-3 text-left transition active:scale-[0.99] hover:border-go cursor-pointer ${isFeatured ? 'border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.3)]' : 'border-line'}`}
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-line bg-space text-3xl">{g.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="rounded-md bg-go/20 px-1.5 py-px font-display text-[10px] font-black tracking-wider text-go uppercase">{bn ? g.genre.bn : g.genre.en}</span>
                    {isFeatured && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-400 px-1.5 py-px font-display text-[10px] font-black text-black">
                        <Star size={10} /> +{FEATURED_BONUS} ✦
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block font-display text-base font-black text-white">{bn ? g.title.bn : g.title.en}</span>
                  <span className="block text-xs leading-snug text-muted">{bn ? g.blurb.bn : g.blurb.en}</span>
                  <span className="mt-1 flex items-center gap-3 text-[11px] font-bold">
                    <span className="text-amber-300">{bn ? 'সেরা' : 'Best'}: {bests[g.id] ?? '—'}</span>
                    <span className="text-muted">{left > 0 ? (bn ? `আজ ${left}টি পূর্ণ-পুরস্কার বাকি` : `${left} full-pay plays left today`) : bn ? 'আজ অর্ধেক পুরস্কার' : 'half pay today'}</span>
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {playing && <ArcadePlayer game={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
