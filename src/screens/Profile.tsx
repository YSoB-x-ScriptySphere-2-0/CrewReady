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
  Star,
  Rocket,
  Compass,
  Sparkles,
  Users,
} from 'lucide-react';
import { useGame } from '../store/game';
import { t, useI18n } from '../content/i18n';
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
import { getFlyStats, getFlyLeaderboard, type FlyStats, type FlyRunEntry } from '../fly/storage';
import { spaceMusic } from '../services/audio';

export function Profile() {
  const [profile, setProfile] = useState<ProfileSettings>(() => loadProfile());
  const [confirmReset, setConfirmReset] = useState(false);
  const [showSpaceBook, setShowSpaceBook] = useState(false);

  const lang = useI18n((s) => s.lang);
  const badges = useGame((s) => s.badges);
  const leaderboard = useGame((s) => s.leaderboard);
  const go = useGame((s) => s.go);
  const collected = useWords((s) => s.collected);

  const [leaderboardScope, setLeaderboardScope] = useState<'own' | 'global' | 'local'>('own');
  const [ownCategory, setOwnCategory] = useState<'missions' | 'fly'>('missions');
  const [flyStats, setFlyStats] = useState<FlyStats>(() => getFlyStats());
  const [flyRuns, setFlyRuns] = useState<FlyRunEntry[]>(() => getFlyLeaderboard());

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
    spaceMusic.toggleMute();
  };

  const handleToggleMotion = () => {
    const updated = { ...profile, reducedMotion: !profile.reducedMotion };
    setProfile(updated);
    saveProfile(updated);
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? ('bn' as const) : ('en' as const);
    const updated = { ...profile, language: nextLang };
    setProfile(updated);
    saveProfile(updated);
    useI18n.getState().setLang(nextLang);
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
    setFlyStats(getFlyStats());
    setFlyRuns([]);
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
            <p className="text-xs text-muted">
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
                <span className="text-xs font-semibold text-muted">Teal Suit</span>
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
                <span className="text-xs font-semibold text-muted">Pink Suit</span>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted">
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
                    <span className="mt-1 font-display text-xs font-extrabold">Lvl {lvl}</span>
                    <span className="text-xs font-medium line-clamp-1">{earned ? info.title : 'Locked'}</span>
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
                  <span className="text-xs text-muted">{collected.length} of {SPACE_WORDS.length} collected</span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                  {SPACE_WORDS.filter((w) => collected.includes(w.id)).map((item) => (
                    <div key={item.id} className="rounded-lg border border-line/50 bg-panel/60 p-2">
                      <div className="font-display text-xs font-extrabold text-go">{item.word}</div>
                      <div className="mt-0.5 text-xs text-muted">{item.sentence}</div>
                      <div className="mt-1 text-xs text-muted/70">{item.source}</div>
                    </div>
                  ))}
                  {collected.length === 0 ? <p className="text-xs text-muted">Tap an underlined word in the game to collect it.</p> : null}
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard Section */}
          <div className="rounded-2xl border-2 border-line bg-panel/70 p-3 sm:p-4">
            {/* Header with Title and Scope Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-line/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-star" />
                <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
                  Leaderboard &amp; Records
                </span>
              </div>

              {/* Scope Switcher: Own Records | Global | Local */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <button
                  onClick={() => setLeaderboardScope('own')}
                  className={`rounded-lg px-2.5 py-1 font-bold transition ${
                    leaderboardScope === 'own'
                      ? 'bg-go text-go-text shadow-sm'
                      : 'bg-panel-up text-muted hover:text-text'
                  }`}
                >
                  Your Best Runs
                </button>
                <button
                  onClick={() => setLeaderboardScope('global')}
                  className={`relative inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition ${
                    leaderboardScope === 'global'
                      ? 'bg-go text-go-text shadow-sm'
                      : 'bg-panel-up text-muted hover:text-text'
                  }`}
                  title="Global Leaderboard (Coming to next update)"
                >
                  <Globe className="h-3 w-3" />
                  <span>Global</span>
                  <span className="rounded bg-star/20 px-1 py-0.2 text-[9px] font-extrabold text-star">
                    Next update
                  </span>
                </button>
                <button
                  onClick={() => setLeaderboardScope('local')}
                  className={`relative inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-bold transition ${
                    leaderboardScope === 'local'
                      ? 'bg-go text-go-text shadow-sm'
                      : 'bg-panel-up text-muted hover:text-text'
                  }`}
                  title="Local Leaderboard (Coming to next update)"
                >
                  <Users className="h-3 w-3" />
                  <span>Local</span>
                  <span className="rounded bg-star/20 px-1 py-0.2 text-[9px] font-extrabold text-star">
                    Next update
                  </span>
                </button>
              </div>
            </div>

            {/* View 1: Own Records / Your Best Runs (Missions & Fly) */}
            {leaderboardScope === 'own' && (
              <div className="mt-3">
                {/* Category Switcher: Missions vs Fly */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex rounded-xl border border-line bg-panel p-0.5 text-xs font-bold">
                    <button
                      onClick={() => setOwnCategory('missions')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 transition ${
                        ownCategory === 'missions'
                          ? 'bg-panel-up text-text font-extrabold shadow-sm'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      <Rocket className="h-3.5 w-3.5 text-go" />
                      <span>Missions ({leaderboard.length})</span>
                    </button>
                    <button
                      onClick={() => setOwnCategory('fly')}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 transition ${
                        ownCategory === 'fly'
                          ? 'bg-panel-up text-text font-extrabold shadow-sm'
                          : 'text-muted hover:text-text'
                      }`}
                    >
                      <Compass className="h-3.5 w-3.5 text-[#19A7B8]" />
                      <span>Fly Runner ({flyStats.bestDistance > 0 ? `${flyStats.bestDistance}m` : '0m'})</span>
                    </button>
                  </div>
                  <span className="text-[11px] font-medium text-muted hidden sm:inline">
                    Own Personal Records
                  </span>
                </div>

                {/* Missions Best Runs */}
                {ownCategory === 'missions' && (
                  <div className="mt-3">
                    {/* Mission Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Best Outcome</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-go truncate">
                          {leaderboard[0]?.result ? leaderboard[0].result.toUpperCase() : 'No runs yet'}
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Peak Stars</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-star inline-flex items-center justify-center gap-1">
                          <Star className="h-3 w-3 fill-[var(--color-star)] text-star" />
                          <span>{leaderboard.length > 0 ? Math.max(...leaderboard.map((e) => e.stars)) : 0} Stars</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Best Systems</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-good">
                          {leaderboard.length > 0 ? Math.max(...leaderboard.map((e) => e.healthy)) : 0}/4 Healthy
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Total Sol 500</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-text">
                          {leaderboard.length} Completed
                        </div>
                      </div>
                    </div>

                    {/* Mission Runs List */}
                    {leaderboard.length > 0 ? (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                          Top Outpost Survival Runs (Best 5)
                        </div>
                        <div className="divide-y divide-line/30 rounded-xl border border-line/40 bg-space/40 px-2.5 py-1">
                          {leaderboard.slice(0, 5).map((entry, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`font-display font-extrabold ${idx === 0 ? 'text-star' : 'text-muted'}`}>
                                  #{idx + 1}
                                </span>
                                <span
                                  className={`rounded px-1.5 py-0.5 font-display text-[10px] font-extrabold uppercase ${
                                    entry.result === 'thriving'
                                      ? 'border border-[#2fa84f]/40 bg-[#2fa84f]/20 text-[#2fa84f]'
                                      : entry.result === 'stable'
                                      ? 'border border-go/40 bg-go/20 text-go'
                                      : 'border border-star/40 bg-star/20 text-star'
                                  }`}
                                >
                                  {entry.result}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-muted">
                                <span className="inline-flex items-center gap-1 font-bold text-star">
                                  <Star className="h-3.5 w-3.5 fill-[var(--color-star)] text-star" aria-hidden="true" />
                                  <span>{entry.stars}</span>
                                </span>
                                <span className="font-medium">{entry.healthy}/4 Systems</span>
                                <span className="text-[11px] text-muted/70">{new Date(entry.at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-line/40 bg-space/40 p-4 text-center">
                        <Rocket className="mx-auto h-7 w-7 text-muted/40 mb-1" />
                        <div className="font-display text-xs font-extrabold text-text">No Mission Records Yet</div>
                        <p className="mt-0.5 text-xs text-muted max-w-xs mx-auto">
                          Survive Sol 500 in Mission Control to evaluate your base and record your outpost survival rank!
                        </p>
                        <button
                          onClick={() => go('home')}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-go bg-go/20 px-3 py-1 font-display text-xs font-bold text-go hover:bg-go hover:text-go-text transition"
                        >
                          <Rocket className="h-3 w-3" />
                          <span>Launch Mission</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Fly Best Runs */}
                {ownCategory === 'fly' && (
                  <div className="mt-3">
                    {/* Fly Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Best Distance</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-go truncate">
                          {flyStats.bestDistance.toLocaleString()} m
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Stardust Bank</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-star inline-flex items-center justify-center gap-1">
                          <Sparkles className="h-3 w-3 text-star" />
                          <span>{flyStats.totalStardust.toLocaleString()} ✦</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Flight Mastery</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-[#19A7B8] truncate">
                          {flyStats.bestDistance >= 2000
                            ? 'Ace Navigator'
                            : flyStats.bestDistance >= 1000
                            ? 'Flight Specialist'
                            : flyStats.bestDistance >= 500
                            ? 'Orbit Pilot'
                            : 'Cadet Pilot'}
                        </div>
                      </div>
                      <div className="rounded-xl border border-line/60 bg-space/60 p-2 text-center">
                        <div className="text-[10px] font-bold uppercase text-muted">Runs Tracked</div>
                        <div className="mt-0.5 font-display text-xs font-extrabold text-text">
                          {flyRuns.length} Runs
                        </div>
                      </div>
                    </div>

                    {/* Fly Runs List */}
                    {flyRuns.length > 0 ? (
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">
                          Top Orbit Flight Runs (Best 5)
                        </div>
                        <div className="divide-y divide-line/30 rounded-xl border border-line/40 bg-space/40 px-2.5 py-1">
                          {flyRuns.slice(0, 5).map((entry, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1.5 text-xs">
                              <div className="flex items-center gap-2">
                                <span className={`font-display font-extrabold ${idx === 0 ? 'text-star' : 'text-muted'}`}>
                                  #{idx + 1}
                                </span>
                                <span className="inline-flex items-center gap-1 font-bold text-text">
                                  <Compass className="h-3.5 w-3.5 text-[#19A7B8]" />
                                  <span>{entry.distance.toLocaleString()} m</span>
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-muted">
                                <span className="inline-flex items-center gap-1 font-bold text-star">
                                  <Sparkles className="h-3 w-3 text-star" />
                                  <span>+{entry.stardust} ✦</span>
                                </span>
                                <span className="text-[11px] text-muted/70">{new Date(entry.at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-line/40 bg-space/40 p-4 text-center">
                        <Compass className="mx-auto h-7 w-7 text-muted/40 mb-1" />
                        <div className="font-display text-xs font-extrabold text-text">No Flight Records Yet</div>
                        <p className="mt-0.5 text-xs text-muted max-w-xs mx-auto">
                          Blast off in Fly mode, dodge asteroids and spire monoliths, and set your distance high score!
                        </p>
                        <button
                          onClick={() => go('fly')}
                          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#19A7B8] bg-[#19A7B8]/20 px-3 py-1 font-display text-xs font-bold text-[#19A7B8] hover:bg-[#19A7B8] hover:text-space transition"
                        >
                          <Compass className="h-3 w-3" />
                          <span>Start Flying</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Future Update Teaser Banner */}
                <div className="mt-3 flex items-center justify-between rounded-xl border border-line/50 bg-space/60 px-3 py-2 text-xs text-muted">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-go flex-shrink-0" />
                    <span>
                      <strong className="text-text">Global &amp; Local Leaderboard</strong> — In future we will add global and local leaderboard, coming to the next update!
                    </span>
                  </div>
                  <button
                    onClick={() => setLeaderboardScope('global')}
                    className="text-xs font-bold text-go hover:underline whitespace-nowrap ml-2"
                  >
                    Preview
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Global Leaderboard (Future Preview) */}
            {leaderboardScope === 'global' && (
              <div className="mt-3 rounded-xl border border-line/60 bg-space/80 p-4 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-go/40 bg-go/10 text-go mb-2">
                  <Globe className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <span className="inline-block rounded-full border border-star/40 bg-star/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-star mb-1">
                    Coming to the next update
                  </span>
                </div>
                <h3 className="font-display text-base font-extrabold text-text">
                  Global Planetary Leaderboard
                </h3>
                <p className="mt-1 text-xs text-muted max-w-md mx-auto leading-relaxed">
                  Worldwide astronaut rankings are currently calibrating! In future we will add global and local leaderboard features. Compete with space cadets across Earth &amp; Mars for the longest flight distance and highest outpost survival score in the next update.
                </p>

                {/* Futuristic Mockup */}
                <div className="mt-3.5 rounded-xl border border-line/40 bg-panel/60 p-3 max-w-sm mx-auto text-left text-xs space-y-2 opacity-90">
                  <div className="flex items-center justify-between font-bold text-muted/70 text-[10px] uppercase border-b border-line/30 pb-1">
                    <span>Expedition Pilot</span>
                    <span>Best Run</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span className="font-medium">1. Commander Chen · ISS Alpha</span>
                    <span className="font-bold text-star">3,420 m · Thriving</span>
                  </div>
                  <div className="flex items-center justify-between text-muted">
                    <span className="font-medium">2. Captain Amara · Olympus Base</span>
                    <span className="font-bold text-star">2,890 m · Thriving</span>
                  </div>
                  <div className="flex items-center justify-between text-text bg-panel-up/70 rounded-lg px-2 py-1 border border-go/30">
                    <span className="font-bold text-go">3. {profile.callsign} (Your Record)</span>
                    <span className="font-bold text-go">
                      {flyStats.bestDistance > 0 ? `${flyStats.bestDistance.toLocaleString()} m` : 'Your Record'}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => setLeaderboardScope('own')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-go hover:underline"
                  >
                    <span>Back to Your Records</span>
                  </button>
                </div>
              </div>
            )}

            {/* View 3: Local Leaderboard (Future Preview) */}
            {leaderboardScope === 'local' && (
              <div className="mt-3 rounded-xl border border-line/60 bg-space/80 p-4 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-go/40 bg-go/10 text-go mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="inline-block rounded-full border border-star/40 bg-star/15 px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-star mb-1">
                    Coming to the next update
                  </span>
                </div>
                <h3 className="font-display text-base font-extrabold text-text">
                  Local Squad &amp; Classroom Leaderboard
                </h3>
                <p className="mt-1 text-xs text-muted max-w-md mx-auto leading-relaxed">
                  Local and squad rankings are in development! In future we will add global and local leaderboard systems so you can challenge your classmates, school space club, and local Wi-Fi squadron. Coming to the next update!
                </p>

                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-md mx-auto text-xs">
                  <div className="rounded-xl border border-line/40 bg-panel/50 p-2.5 text-center">
                    <div className="font-display font-extrabold text-go">Classroom Squad</div>
                    <div className="text-[10px] text-muted mt-0.5">PIN-based local roster</div>
                  </div>
                  <div className="rounded-xl border border-line/40 bg-panel/50 p-2.5 text-center">
                    <div className="font-display font-extrabold text-star">Local Wi-Fi Beacon</div>
                    <div className="text-[10px] text-muted mt-0.5">Zero-login peer sync</div>
                  </div>
                  <div className="rounded-xl border border-line/40 bg-panel/50 p-2.5 text-center">
                    <div className="font-display font-extrabold text-[#19A7B8]">Squad Co-op</div>
                    <div className="text-[10px] text-muted mt-0.5">Shared Mars outpost</div>
                  </div>
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => setLeaderboardScope('own')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-go hover:underline"
                  >
                    <span>Back to Your Records</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Big Settings Toggles */}
          <div className="rounded-2xl border-2 border-line bg-panel/70 p-3 sm:p-4">
            <span className="font-display text-xs sm:text-sm font-extrabold uppercase tracking-wide text-text">
              {t('profile.settings')}
            </span>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Language Switch */}
              <button
                onClick={handleToggleLang}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5 leading-snug break-words"
              >
                <Globe className="h-5 w-5 text-go" />
                <span className="mt-1 text-xs font-bold text-muted">{t('profile.lang')}</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {lang === 'en' ? 'English' : 'বাংলা'}
                </span>
              </button>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5 leading-snug break-words"
              >
                {profile.sound ? <Volume2 className="h-5 w-5 text-go" /> : <VolumeX className="h-5 w-5 text-muted" />}
                <span className="mt-1 text-xs font-bold text-muted">{t('profile.sound')}</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {profile.sound ? t('profile.soundOn') : t('profile.soundOff')}
                </span>
              </button>

              {/* Reduced Motion Toggle */}
              <button
                onClick={handleToggleMotion}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5 leading-snug break-words"
              >
                <Eye className="h-5 w-5 text-go" />
                <span className="mt-1 text-xs font-bold text-muted">{t('profile.motion')}</span>
                <span className="font-display text-xs font-extrabold text-text">
                  {profile.reducedMotion ? t('profile.motionReduced') : t('profile.motionFull')}
                </span>
              </button>

              {/* Replay Intro */}
              <button
                onClick={handleReplayIntro}
                className="flex flex-col items-center justify-center rounded-xl border-2 border-line bg-panel p-2.5 text-center transition hover:border-text active:translate-y-0.5 leading-snug break-words"
              >
                <RotateCcw className="h-5 w-5 text-star" />
                <span className="mt-1 text-xs font-bold text-muted">{t('profile.intro')}</span>
                <span className="font-display text-xs font-extrabold text-text">{t('profile.replayIntro')}</span>
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
                  <span>{t('profile.reset')}</span>
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-loss">{t('profile.resetConfirm')}</span>
                  <button
                    onClick={handleResetData}
                    className="rounded-lg border border-loss bg-loss/20 px-3 py-1 text-xs font-extrabold text-loss hover:bg-loss hover:text-white leading-snug break-words"
                  >
                    {t('profile.resetYes')}
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="text-xs font-bold text-muted hover:text-text leading-snug"
                  >
                    {t('profile.cancel')}
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
