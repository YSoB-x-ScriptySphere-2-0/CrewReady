// Profile / Me screen — BUILD_SEQUENCE.md S3 / plan.md §7 row 3
import { useState } from 'react';
import {
  ArrowLeft,
  Shuffle,
  Volume2,
  VolumeX,
  Eye,
  Globe,
  RotateCcw,
  BookOpen,
  Award,
  FileText,
  AlertTriangle,
  Trophy,
} from 'lucide-react';
import { useGame } from '../store/game';
import { SPACE_WORDS } from '../content/words';
import { useWords } from '../store/words';
import { Kid } from '../components/Twinkle';
import {
  loadProfile,
  saveProfile,
  getRankTitle,
  shuffleCallsign,
  resetAllGameData,
  BADGE_DETAILS,
  type Astronaut,
  type ProfileSettings,
} from '../engine/profile';

export function Profile() {
  const [profile, setProfile] = useState<ProfileSettings>(() => loadProfile());
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSpaceBook, setShowSpaceBook] = useState(false);

  const { badges, leaderboard, go } = useGame();
  const collected = useWords((s) => s.collected);

  const handlePickAstronaut = (who: Astronaut) => {
    const updated = { ...profile, astronaut: who };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleShuffle = () => {
    const nextSign = shuffleCallsign(profile.callsign);
    const updated = { ...profile, callsign: nextSign };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...profile, sound: !profile.sound };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleToggleMotion = () => {
    const updated = { ...profile, reducedMotion: !profile.reducedMotion };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleToggleLang = () => {
    const updated = { ...profile, language: profile.language === 'en' ? ('bn' as const) : ('en' as const) };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleReplayIntro = () => {
    useGame.setState({ seenIntro: false });
    go('hook');
  };

  const handleResetData = () => {
    resetAllGameData();
    useGame.setState({
      badges: [],
      leaderboard: [],
      seenIntro: false,
      runId: 0,
      lastSavedRun: -1,
    });
    setProfile(loadProfile());
    setConfirmReset(false);
    go('home');
  };

  const rank = getRankTitle(badges.length);

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-space p-3 text-text sm:p-5 select-none font-sans">
      {/* Top Header */}
      <header className="flex flex-shrink-0 items-center justify-between border-b-2 border-line/40 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => go('home')}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-panel/80 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-panel hover:text-text active:translate-y-0.5"
            aria-label="Back to Mission Control"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Mission Control</span>
          </button>
          <div>
            <h1 className="font-display text-lg sm:text-2xl font-extrabold uppercase tracking-wider text-text">
              Astronaut Profile &amp; Quarters
            </h1>
            <p className="text-[11px] text-muted sm:text-xs">
              Rank: <span className="font-bold text-go">{rank}</span> · Call-sign: <span className="font-bold text-text">{profile.callsign}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => go('sources')}
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-line bg-panel/80 px-3 py-1.5 text-xs font-bold text-muted transition hover:bg-panel hover:text-text"
        >
          <FileText className="h-3.5 w-3.5 text-go" />
          <span>Sources &amp; Science</span>
        </button>
      </header>

      {/* Main Content Grid: Left Podiums, Right Trophies & Toggles */}
      <div className="mt-2 grid flex-grow grid-cols-1 sm:grid-cols-12 gap-3 min-h-0">
        {/* Left Column: Astronaut Selection Podiums (5 cols) */}
        <div className="flex flex-col justify-between rounded-2xl border-2 border-line bg-panel/70 p-2.5 sm:p-3 sm:col-span-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
              Choose Astronaut
            </span>
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-1 rounded-lg border border-line bg-panel-up px-2 py-0.5 text-xs font-bold text-muted hover:text-text"
              title="Shuffle Call-sign"
            >
              <Shuffle className="h-3 w-3" />
              <span>Name: <strong>{profile.callsign}</strong></span>
            </button>
          </div>

          {/* Podiums Row */}
          <div className="my-auto flex items-end justify-center gap-3 sm:gap-6 py-1">
            {/* Orbit Podium (Teal) */}
            <div
              onClick={() => handlePickAstronaut('orbit')}
              className={`group flex cursor-pointer flex-col items-center transition ${
                profile.astronaut === 'orbit' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Kid
                who="orbit"
                pose={profile.astronaut === 'orbit' ? 'cheer' : 'stand'}
                height={95}
                label="Orbit Astronaut"
              />
              <div
                className={`mt-1.5 flex h-11 w-24 sm:w-28 flex-col items-center justify-center rounded-xl border-2 shadow-sm transition ${
                  profile.astronaut === 'orbit'
                    ? 'border-go bg-[#19A7B8]/30 shadow-[0_0_0.75rem_rgba(25,167,184,0.4)]'
                    : 'border-line/60 bg-panel'
                }`}
                style={{ borderColor: '#19A7B8' }}
              >
                <span className="font-display text-xs font-extrabold tracking-wide text-[#19A7B8]">
                  ORBIT
                </span>
                <span className="text-[9px] font-bold text-muted">Teal Suit</span>
              </div>
            </div>

            {/* Nova Podium (Pink) */}
            <div
              onClick={() => handlePickAstronaut('nova')}
              className={`group flex cursor-pointer flex-col items-center transition ${
                profile.astronaut === 'nova' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Kid
                who="nova"
                pose={profile.astronaut === 'nova' ? 'cheer' : 'stand'}
                height={95}
                label="Nova Astronaut"
              />
              <div
                className={`mt-1.5 flex h-11 w-24 sm:w-28 flex-col items-center justify-center rounded-xl border-2 shadow-sm transition ${
                  profile.astronaut === 'nova'
                    ? 'border-[#E8338B] bg-[#E8338B]/30 shadow-[0_0_0.75rem_rgba(232,51,139,0.4)]'
                    : 'border-line/60 bg-panel'
                }`}
                style={{ borderColor: '#E8338B' }}
              >
                <span className="font-display text-xs font-extrabold tracking-wide text-[#E8338B]">
                  NOVA
                </span>
                <span className="text-[9px] font-bold text-muted">Pink Suit</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-muted">
            Tap podium to choose active pilot. Represents you in missions and Fly.
          </p>
        </div>

        {/* Right Column: Trophies, Space Book, Settings (7 cols) */}
        <div className="flex flex-col gap-2.5 sm:col-span-7 overflow-y-auto pr-1">
          {/* Trophies & Badges Section */}
          <div className="rounded-2xl border-2 border-line bg-panel/70 p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-star" />
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
                  Mission Badges ({badges.length} / 6)
                </span>
              </div>
              <button
                onClick={() => setShowSpaceBook(!showSpaceBook)}
                className="inline-flex items-center gap-1 rounded-lg border border-line bg-panel-up px-2.5 py-1 text-xs font-bold text-muted hover:text-text"
              >
                <BookOpen className="h-3.5 w-3.5 text-go" />
                <span>{showSpaceBook ? 'Hide Words' : 'Space Book'}</span>
              </button>
            </div>

            {/* Badges Row */}
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((lvl) => {
                const earned = badges.includes(lvl);
                const info = BADGE_DETAILS[lvl];
                return (
                  <div
                    key={lvl}
                    className={`flex flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition ${
                      earned
                        ? 'border-star bg-star/15 text-star'
                        : 'border-line/40 bg-space/30 text-muted/40'
                    }`}
                    title={earned ? `${info.title}: ${info.desc}` : `Level ${lvl} Badge (Locked)`}
                  >
                    <Award className="h-6 w-6" />
                    <span className="mt-1 font-display text-[11px] font-extrabold">Lvl {lvl}</span>
                    <span className="text-[9px] line-clamp-1">{earned ? info.title : 'Locked'}</span>
                  </div>
                );
              })}
            </div>

            {/* Space Book Modal / Expand */}
            {showSpaceBook && (
              <div className="mt-3 rounded-xl border border-line bg-space/80 p-3">
                <div className="flex items-center justify-between border-b border-line/40 pb-1.5">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-text">
                    Space Book — Mission Vocabulary
                  </span>
                  <span className="text-[10px] text-muted">{collected.length} of {SPACE_WORDS.length} collected</span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {SPACE_WORDS.filter((w) => collected.includes(w.id)).map((item) => (
                    <div key={item.id} className="rounded-lg border border-line/50 bg-panel/60 p-2">
                      <div className="font-display text-xs font-extrabold text-go">{item.word}</div>
                      <div className="mt-0.5 text-[11px] text-muted">{item.sentence}</div>
                      <div className="mt-1 text-[9px] text-muted/70">{item.source}</div>
                    </div>
                  ))}
                  {collected.length === 0 ? <p className="text-[11px] text-muted">Tap an underlined word in the game to collect it.</p> : null}
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Summary */}
          {leaderboard.length > 0 && (
            <div className="rounded-2xl border-2 border-line bg-panel/70 p-3 sm:p-4">
              <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
                Best Five Outpost Runs
              </span>
              <div className="mt-2 divide-y divide-line/30">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-star">#{idx + 1}</span>
                      <span className="font-bold uppercase text-text">{entry.result}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted">
                      <span>{entry.stars} ⭐</span>
                      <span>{entry.healthy}/4 Systems</span>
                      <span className="text-[10px] text-muted/60">{new Date(entry.at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Big Settings Toggles */}
          <div className="rounded-2xl border-2 border-line bg-panel/70 p-3 sm:p-4">
            <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
              Settings &amp; Preferences
            </span>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Language Switch */}
              <button
                onClick={handleToggleLang}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5"
              >
                <Globe className="h-5 w-5 text-go" />
                <span className="mt-1 text-[11px] font-bold text-muted">Language</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {profile.language === 'en' ? 'English' : 'বাংলা'}
                </span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5"
              >
                {profile.sound ? <Volume2 className="h-5 w-5 text-go" /> : <VolumeX className="h-5 w-5 text-muted" />}
                <span className="mt-1 text-[11px] font-bold text-muted">Sound</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {profile.sound ? 'ON' : 'OFF (Silent)'}
                </span>
              </button>

              {/* Reduced Motion Toggle */}
              <button
                onClick={handleToggleMotion}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5"
              >
                <Eye className="h-5 w-5 text-go" />
                <span className="mt-1 text-[11px] font-bold text-muted">Motion</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {profile.reducedMotion ? 'Reduced' : 'Full'}
                </span>
              </button>

              {/* Replay Intro */}
              <button
                onClick={handleReplayIntro}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5"
              >
                <RotateCcw className="h-5 w-5 text-star" />
                <span className="mt-1 text-[11px] font-bold text-muted">Intro</span>
                <span className="font-display text-xs font-extrabold text-text">Replay Hook</span>
              </button>
            </div>

            {/* Reset Mission & Data */}
            <div className="mt-3 border-t border-line/40 pt-2.5">
              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-loss transition"
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Reset All Local Save Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-loss">Are you sure? Clears all progress!</span>
                  <button
                    onClick={handleResetData}
                    className="rounded-lg border border-loss bg-loss/20 px-3 py-1 text-xs font-extrabold text-loss hover:bg-loss hover:text-white"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-xs font-bold text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
