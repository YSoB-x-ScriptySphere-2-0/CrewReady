// The story cards (BUILD_SEQUENCE.md A2, modernized with 3Dviz Pro Max):
// 3D Earth Crisis & Hero Junior Astronaut preparation for humanity.
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Rocket, SkipForward, Globe, Shield, Sparkles } from 'lucide-react';
import { GameButton, RoundButton } from '../components/GameButton';
import { useCountTo } from '../components/motion';
import { Badge, Panel, SourceLine } from '../components/Panel';
import { isStageTurned, stageDelta } from '../components/stageMath';
import { Scene } from '../components/Scene';
import { Kid, Twinkle } from '../components/Twinkle';
import neows from '../content/samples/neows.json';
import { useGame } from '../store/game';
import { fmtDate, useSpace } from '../store/space';
import { t, useI18n } from '../content/i18n';
import { CrisisEarth3D } from '../components/3d/CrisisEarth3D';
import { HeroCadetRocket3D } from '../components/3d/HeroCadetRocket3D';

/** A number that ticks up from 0 when the card opens. */
function CountUp({ to }: { to: number }) {
  const [target, setTarget] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setTarget(to), 250);
    return () => clearTimeout(timer);
  }, [to]);
  return <>{useCountTo(target, 1200)}</>;
}

/** Planetary defense radar with real NASA asteroid tracking count */
function AsteroidRadarFigure({ count }: { count: number }) {
  const lang = useI18n((s) => s.lang);
  return (
    <div className="flex flex-col items-start gap-[0.25rem]">
      <div className="flex items-center gap-[0.5rem] rounded-full border-2 border-line bg-panel-up px-[0.75rem] py-[0.0625rem] font-display text-[0.8125rem] font-extrabold tracking-wider text-text uppercase">
        <span className="inline-flex h-[0.625rem] w-[0.625rem] rounded-full bg-good" aria-hidden />
        <span>{lang === 'bn' ? 'নাসা প্ল্যানেটারি ডিফেন্স রাডার' : 'Planetary Defense Radar'}</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-[0.5rem] gap-y-[0.25rem]">
        <span className="font-display text-[2rem] leading-none font-extrabold text-text tabular-nums">
          <CountUp to={count} />
        </span>
        <span className="font-display text-[1.125rem] font-bold text-muted">
          {lang === 'bn' ? 'গ্রহাণু নজরদারিতে' : 'tracked this week'}
        </span>
        <span className="rounded-[0.5rem] border-2 border-line bg-space-deep px-[0.5rem] font-display text-[0.875rem] font-bold text-good">
          {lang === 'bn' ? 'সব নিরাপদ' : 'All clear'}
        </span>
      </div>
    </div>
  );
}

function NeowsStrip() {
  const res = useSpace((s) => s.neows);
  const count = res?.data.count ?? neows.count;
  const badge = res?.badge ?? 'NASA ARCHIVE';
  const fetched = fmtDate(res?.fetchedAt ?? neows.fetchedAt);
  const lang = useI18n((s) => s.lang);

  return (
    <article aria-label="Planetary Defense" className="mt-2 rounded-[1rem] border-2 border-line bg-panel/85 p-2.5 text-text">
      <AsteroidRadarFigure count={count} />
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <Badge kind={badge} />
        <span className="text-xs font-bold text-muted">
          {badge === 'NASA LIVE' ? (lang === 'bn' ? 'সরাসরি নাসা লাইভ তথ্য' : 'From NASA, just now') : `NASA: ${fetched}`}
        </span>
      </div>
      <div className="mt-1">
        <SourceLine text={`NASA NeoWs · ${badge === 'NASA LIVE' ? 'LIVE' : 'ARCHIVE'} · ${fetched}`} bare />
      </div>
    </article>
  );
}

export function Story() {
  const go = useGame((s) => s.go);
  const lang = useI18n((s) => s.lang);
  const [i, setI] = useState(0);
  const [selectedHero, setSelectedHero] = useState<'orbit' | 'nova'>('orbit');

  const CARDS = [
    {
      title: t('story.1.title'),
      badge: lang === 'bn' ? 'পৃথিবীর সংকট' : 'Earth Crisis Alert',
      body: t('story.1.text'),
      hint: lang === 'bn' ? '৩ডি পৃথিবী ঘুরিয়ে বিভিন্ন মহাদেশের সংকট দেখো!' : 'Spin the 3D Earth to inspect global crisis zones!',
    },
    {
      title: t('story.2.title'),
      badge: lang === 'bn' ? 'বীর মহাকাশচারী ডাক' : 'Hero Astronaut Call',
      body: t('story.2.text'),
      hint: lang === 'bn' ? 'তোমার প্রিয় মহাকাশ বীরকে বেছে নাও!' : 'Choose your favorite junior astronaut hero!',
    },
    {
      title: t('story.3.title'),
      badge: lang === 'bn' ? 'লঞ্চ প্যাড প্রস্তুতি' : 'Launch Pad Readiness',
      body: t('story.3.text'),
      hint: lang === 'bn' ? '৩ডি রকেট ঘুরিয়ে থ্রাস্টার ও ঢাল পরীক্ষা করো!' : 'Spin your 3D rocket, test fire thrusters and shields!',
    },
  ];

  const last = i === CARDS.length - 1;
  const next = () => (last ? go('home') : setI(i + 1));
  const back = () => setI((n) => Math.max(0, n - 1));
  const forward = () => setI((n) => Math.min(CARDS.length - 1, n + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') forward();
      if (e.key === 'ArrowLeft') back();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const { dx, dy } = stageDelta(e.clientX - s.x, e.clientY - s.y);
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? forward : back)();
  };

  const card = CARDS[i];

  return (
    <Scene bare place="space">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-[0.75rem] px-[0.75rem] pt-[0.5rem]">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-full border border-go/40 bg-go/20 text-go">
            <Globe size={18} />
          </div>
          <ol className="flex items-center gap-[0.5rem]" aria-label={`Story card ${i + 1} of ${CARDS.length}`}>
            {CARDS.map((c, n) => (
              <li
                key={c.title}
                aria-hidden
                className={`h-[0.875rem] rounded-full border-2 border-line transition-all ${
                  n === i ? 'w-[2.25rem] bg-go' : n < i ? 'w-[0.875rem] bg-text' : 'w-[0.875rem] bg-transparent'
                }`}
              />
            ))}
          </ol>
        </div>

        <GameButton
          variant="small"
          icon={SkipForward}
          onClick={() => go('home')}
          className="!mb-0 !min-h-[2.5rem] !px-3.5 !text-xs sm:!text-sm"
        >
          {t('btn.skip')}
        </GameButton>
      </div>

      {/* Main Content Area */}
      <div
        className="flex min-h-0 flex-1 gap-[0.75rem] px-[0.75rem] pt-[0.35rem] pb-[0.75rem]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ touchAction: isStageTurned() ? 'pan-x' : 'pan-y' }}
      >
        {/* Left Column: Interactive 3D Scenes */}
        <div className="relative min-h-0 w-[52%] shrink-0 overflow-hidden rounded-[1.25rem] border-2 border-line bg-space-deep/80 shadow-2xl">
          {i === 0 ? (
            <CrisisEarth3D height="100%" />
          ) : i === 1 ? (
            <div className="flex h-full flex-col items-center justify-between p-3 select-none">
              <div className="flex w-full items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full border border-go/40 bg-panel px-3 py-1 font-display text-xs font-extrabold text-go">
                  <Sparkles size={14} />
                  <span>{lang === 'bn' ? 'স্পেস হিরো নির্বাচন' : 'Choose Your Space Hero'}</span>
                </span>
                <span className="text-xs font-bold text-muted">
                  {lang === 'bn' ? 'যেকোনো একজনকে বেছে নাও' : 'Tap to suit up!'}
                </span>
              </div>

              {/* Both Hero & Heroine Avatars side by side */}
              <div className="flex w-full flex-1 items-end justify-center gap-4 py-2">
                <button
                  type="button"
                  onClick={() => setSelectedHero('orbit')}
                  className={`group flex flex-col items-center rounded-2xl border-2 p-2.5 transition active:scale-95 ${
                    selectedHero === 'orbit'
                      ? 'border-go bg-go/20 shadow-[0_0_20px_rgba(34,215,230,0.4)]'
                      : 'border-line/60 bg-panel/50 hover:border-text/40'
                  }`}
                >
                  <Kid who="orbit" pose="wave" height="8.5rem" bob className="object-contain" />
                  <span className="mt-1.5 rounded-full bg-go px-3 py-0.5 font-display text-xs font-extrabold text-go-text">
                    {lang === 'bn' ? 'ক্যাডেট অরবিট' : 'Hero Orbit'}
                  </span>
                  <span className="text-[10px] text-muted">{lang === 'bn' ? 'নীল নিয়ন স্যুট' : 'Teal Hero Suit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedHero('nova')}
                  className={`group flex flex-col items-center rounded-2xl border-2 p-2.5 transition active:scale-95 ${
                    selectedHero === 'nova'
                      ? 'border-nova bg-nova/20 shadow-[0_0_20px_rgba(232,51,139,0.4)]'
                      : 'border-line/60 bg-panel/50 hover:border-text/40'
                  }`}
                >
                  <Kid who="nova" pose="wave" height="8.5rem" bob className="object-contain" />
                  <span className="mt-1.5 rounded-full bg-nova px-3 py-0.5 font-display text-xs font-extrabold text-white">
                    {lang === 'bn' ? 'ক্যাডেট নোভা' : 'Heroine Nova'}
                  </span>
                  <span className="text-[10px] text-muted">{lang === 'bn' ? 'গোলাপি স্টার স্যুট' : 'Pink Star Suit'}</span>
                </button>
              </div>

              {/* Readiness status pills */}
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                <span className="flex items-center gap-1 rounded-full border border-good/50 bg-good/20 px-2.5 py-0.5 text-good font-bold">
                  ✓ {lang === 'bn' ? 'স্পেসস্যুট সিলড' : 'Spacesuit Sealed'}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-star/50 bg-star/20 px-2.5 py-0.5 text-star font-bold">
                  ★ {lang === 'bn' ? 'সাহস ১০০%' : 'Courage 100%'}
                </span>
              </div>
            </div>
          ) : (
            <HeroCadetRocket3D height="100%" who={selectedHero} onSelectWho={setSelectedHero} />
          )}
        </div>

        {/* Right Column: Hero Narrative, NASA Intel & Next/Back buttons */}
        <Panel
          key={card.title}
          ribbon={card.badge}
          tone="go"
          as="article"
          compact
          className="!mt-[0.5rem] flex min-h-0 min-w-0 flex-1 flex-col justify-between"
        >
          <div className="overflow-y-auto pr-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-go/20 px-2.5 py-0.5 font-display text-xs font-extrabold text-go uppercase tracking-wider">
                {lang === 'bn' ? `ধাপ ${i + 1} / ৩` : `Step ${i + 1} of 3`}
              </span>
              <span className="text-xs font-bold text-muted">{card.hint}</span>
            </div>

            <h1 className="mt-1 font-display text-xl sm:text-2xl leading-snug font-extrabold text-text" aria-live="polite">
              {card.title}
            </h1>

            <p className="mt-1.5 text-sm sm:text-base leading-relaxed text-text/90 font-medium">
              {card.body}
            </p>

            {/* Step 1 includes real NASA Planetary Defense asteroid monitor */}
            {i === 0 ? <NeowsStrip /> : null}

            {/* Step 2 shows Twinkle's encouragement */}
            {i === 1 ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-line bg-panel-up/70 p-2.5">
                <Twinkle mood="happy" size={48} />
                <p className="text-xs sm:text-sm font-bold text-text leading-snug">
                  {lang === 'bn'
                    ? 'টুইংকল বলছে: "তুমি হবে আমাদের সবচেয়ে সেরা মহাকাশ বীর! পুরো পৃথিবী তোমার সাথে আছে!"'
                    : 'Twinkle says: "You are going to be our greatest space hero! All of Earth is cheering for you!"'}
                </p>
              </div>
            ) : null}

            {/* Step 3 shows Launch Checklist */}
            {i === 2 ? (
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-text">
                <div className="flex items-center gap-1.5 rounded-xl border border-line bg-space-deep/80 p-2">
                  <Rocket size={16} className="text-go shrink-0" />
                  <span>{lang === 'bn' ? 'রকেট ইঞ্জিন: ফুল' : 'Engines: 100%'}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-line bg-space-deep/80 p-2">
                  <Shield size={16} className="text-shield shrink-0" />
                  <span>{lang === 'bn' ? 'সুরক্ষা ঢাল: সচল' : 'Shields: Active'}</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Action Row */}
          <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/40 pt-2.5">
            {i > 0 ? (
              <RoundButton icon={ArrowLeft} label={t('btn.back')} onClick={back} />
            ) : (
              <div />
            )}

            <GameButton
              variant="go"
              icon={last ? Rocket : ArrowRight}
              onClick={next}
              className="!min-h-[2.875rem] !px-4 sm:!px-6 !text-sm sm:!text-base"
            >
              {last ? (lang === 'bn' ? 'মিশন গ্রহণ করো ও চলো!' : 'Accept Mission & Launch!') : t('btn.next')}
            </GameButton>
          </div>
        </Panel>
      </div>
    </Scene>
  );
}
