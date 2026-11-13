// The opening hook, rebuilt: after Welcome the child learns WHY they are going (Earth crisis, limited cargo),
// how Twinkle's buttons work, and then picks the 4 things the ship really needs from 12 (the other 8 are
// things a kid loves but can't keep a crew alive). Right or wrong, they learn the four lifelines
// (Power, Air & Water, Food, Shield) that every later decision will drain.
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Languages, Rocket, SkipForward, Square, Volume2, X } from 'lucide-react';
import { GameButton } from '../components/GameButton';
import { Hud } from '../components/Hud';
import { shakeScene } from '../components/motion';
import { Scene } from '../components/Scene';
import { speak, stopSpeaking, useCanSpeak } from '../components/speech';
import { Kid, Twinkle, type TwinkleMood } from '../components/Twinkle';
import type { Meter } from '../engine/types';
import { useGame } from '../store/game';
import { useI18n } from '../content/i18n';

type L = { en: string; bn: string };
const START: Record<Meter, number> = { P: 60, L: 70, F: 60, S: 70 };
const NEED = 4;

interface Item {
  id: string;
  emoji: string;
  name: L;
  correct: boolean;
  /** Why it is (or is not) on the ship. */
  why: L;
  meter?: Meter;
}

// Order is fixed and mixed so the four right answers are not grouped.
const ITEMS: Item[] = [
  { id: 'games', emoji: '🎮', correct: false, name: { en: 'Video games', bn: 'ভিডিও গেম' }, why: { en: 'Fun, but you can’t breathe or eat a game. It would even drain your power.', bn: 'মজার, কিন্তু গেম খেয়ে বা শ্বাস নিয়ে বাঁচা যায় না। উল্টো বিদ্যুৎ খরচ করে।' } },
  { id: 'air', emoji: '💧', correct: true, meter: 'L', name: { en: 'Air & Water', bn: 'বাতাস ও পানি' }, why: { en: 'No air = 3 minutes. No water = 3 days. Nothing else matters if these hit zero.', bn: 'বাতাস ছাড়া ৩ মিনিট, পানি ছাড়া ৩ দিন। এগুলো শেষ হলে আর কিছুই কাজে আসে না।' } },
  { id: 'comics', emoji: '📚', correct: false, name: { en: 'Comic books', bn: 'কমিক বই' }, why: { en: 'Great stories, but they can’t keep a crew alive.', bn: 'দারুণ গল্প, কিন্তু ক্রুকে বাঁচিয়ে রাখতে পারে না।' } },
  { id: 'power', emoji: '⚡', correct: true, meter: 'P', name: { en: 'Power', bn: 'বিদ্যুৎ' }, why: { en: 'It runs the lights, engines, computers and life support. No power, no ship.', bn: 'আলো, ইঞ্জিন, কম্পিউটার আর লাইফ সাপোর্ট চলে বিদ্যুতে। বিদ্যুৎ নেই, জাহাজও নেই।' } },
  { id: 'skate', emoji: '🛹', correct: false, name: { en: 'Skateboard', bn: 'স্কেটবোর্ড' }, why: { en: 'There are no roads in space. Nowhere to ride.', bn: 'মহাকাশে রাস্তা নেই, চালানোর জায়গাই নেই।' } },
  { id: 'shield', emoji: '🛡️', correct: true, meter: 'S', name: { en: 'Shield', bn: 'সুরক্ষা ঢাল' }, why: { en: 'It blocks deadly space radiation, dust and Sun storms.', bn: 'মহাকাশের ভয়ঙ্কর বিকিরণ, ধুলো আর সৌরঝড় ঠেকায়।' } },
  { id: 'teddy', emoji: '🧸', correct: false, name: { en: 'Teddy bear', bn: 'টেডি বিয়ার' }, why: { en: 'Cozy, but it gives you no air, food or safety.', bn: 'আরামদায়ক, কিন্তু বাতাস, খাবার বা নিরাপত্তা দেয় না।' } },
  { id: 'ball', emoji: '⚽', correct: false, name: { en: 'Football', bn: 'ফুটবল' }, why: { en: 'It floats away in zero gravity, and no one can play on a tiny ship.', bn: 'ওজনহীন জায়গায় ভেসে যাবে, ছোট জাহাজে খেলার জায়গাও নেই।' } },
  { id: 'food', emoji: '🌱', correct: true, meter: 'F', name: { en: 'Food', bn: 'খাবার' }, why: { en: 'Food gives your body and brain the energy to work every day.', bn: 'খাবার শরীর আর মস্তিষ্কে প্রতিদিন কাজ করার শক্তি জোগায়।' } },
  { id: 'phone', emoji: '📱', correct: false, name: { en: 'Phone', bn: 'মোবাইল ফোন' }, why: { en: 'No Wi-Fi or towers in deep space. It’s just a heavy brick.', bn: 'গভীর মহাকাশে ওয়াই-ফাই বা টাওয়ার নেই। এটা শুধু ভারী একটা ইট।' } },
  { id: 'phones', emoji: '🎧', correct: false, name: { en: 'Headphones', bn: 'হেডফোন' }, why: { en: 'Music is nice, but it keeps no one alive.', bn: 'গান ভালো লাগে, কিন্তু কাউকে বাঁচিয়ে রাখে না।' } },
  { id: 'guitar', emoji: '🎸', correct: false, name: { en: 'Guitar', bn: 'গিটার' }, why: { en: 'Fun to play, but it takes up space and keeps no one alive.', bn: 'বাজাতে মজা, কিন্তু জায়গা নেয়, বাঁচতে সাহায্য করে না।' } },
];

const PRAISE: L[] = [
  { en: 'W pick! You’re cooking 🔥 All 4 right, no cap!', bn: 'দারুণ! তুমি তো পুরো ফায়ার 🔥 ৪টাই একদম ঠিক, নো ক্যাপ!' },
  { en: 'Big brain energy! 🧠 That loadout is chef’s kiss. Absolute legend!', bn: 'বিগ ব্রেইন এনার্জি! 🧠 একদম পারফেক্ট বাছাই। তুমি লিজেন্ড!' },
  { en: 'Lowkey genius! 💯 You get it: survival first, vibes later.', bn: 'লোকি জিনিয়াস! 💯 আগে বেঁচে থাকা, তারপর মজা। ঠিক ধরেছো!' },
];
const ENCOURAGE: L[] = [
  { en: 'Not quite, but that’s how explorers learn. Check the real four 👇', bn: 'পুরোপুরি হয়নি, তবে অভিযাত্রীরা এভাবেই শেখে। আসল চারটা দেখো 👇' },
  { en: 'Oof, close! Even astronauts miss at first. Here’s what actually keeps you alive 👇', bn: 'উফ, কাছাকাছি! নভোচারীরাও প্রথমে ভুল করে। আসলে কী বাঁচায় দেখো 👇' },
];

const TXT = {
  alert: { en: 'EARTH CRISIS', bn: 'পৃথিবীর মহাবিপদ' },
  skip: { en: 'Skip', bn: 'এড়িয়ে যাও' },
  hintBtn: { en: 'Hint', bn: 'ইঙ্গিত' },
  readBtn: { en: 'Read', bn: 'পড়ে শোনাও' },
  langBtn: { en: 'বাংলা', bn: 'English' },
  storyTitle: { en: 'Earth is in danger. You’re our hope.', bn: 'পৃথিবী বিপদে। তুমিই আমাদের আশা।' },
  story: [
    { e: '🌍', en: 'Earth is in a crisis. Humans need a NEW home.', bn: 'পৃথিবী ভয়ঙ্কর সংকটে। মানুষের দরকার একটি নতুন বাসস্থান।' },
    { e: '🚀', en: 'You are the Junior Commander. Your mission: find another planet.', bn: 'তুমি খুদে কমান্ডার। তোমার মিশন: আরেকটি গ্রহ খুঁজে বের করা।' },
    { e: '📦', en: 'But your ship is small. You can’t take everything!', bn: 'কিন্তু তোমার জাহাজ ছোট। সবকিছু নেওয়া যাবে না!' },
    { e: '⏳', en: 'Every decision uses something up. If a supply hits ZERO, the mission is over.', bn: 'প্রতিটি সিদ্ধান্তে কিছু না কিছু খরচ হবে। কোনোটা ZERO হলে মিশন শেষ।' },
    { e: '🔥', en: 'And the tasks get harder every single day.', bn: 'আর প্রতিদিন কাজগুলো আরও কঠিন হবে।' },
  ],
  guideTitle: { en: 'Twinkle’s quick guide', bn: 'টুইংকলের ছোট্ট গাইড' },
  guideIntro: { en: 'Hi! I’m Twinkle, your robot guide. Here’s what the buttons at the top do:', bn: 'হাই! আমি টুইংকল, তোমার রোবট গাইড। ওপরের বোতামগুলো কী করে শোনো:' },
  guide: [
    { k: '?', en: 'Hint: stuck? Tap it and I’ll give you a clue plus an explanation.', bn: 'ইঙ্গিত: আটকে গেলে এটা চাপো, আমি সংকেত আর ব্যাখ্যা দেব।' },
    { k: '🔊', en: 'Read: I’ll read the screen out loud for you.', bn: 'পড়ে শোনাও: আমি স্ক্রিনের লেখা জোরে পড়ে শোনাব।' },
    { k: 'বাং', en: 'Language: switch between English and বাংলা any time.', bn: 'ভাষা: যেকোনো সময় English আর বাংলা বদলাতে পারো।' },
  ],
  ready: { en: 'I’m ready!', bn: 'আমি তৈরি!' },
  qLabel: { en: 'MISSION QUESTION', bn: 'মিশনের প্রশ্ন' },
  q: { en: 'Your ship can carry only 4 things. Which 4 will keep you alive?', bn: 'তোমার জাহাজে মাত্র ৪টি জিনিস নেওয়া যাবে। কোন ৪টি তোমাকে বাঁচিয়ে রাখবে?' },
  explain: {
    en: 'Why only 4? Space is tiny and supplies are LIMITED. During the mission, every choice will use some of them up, and you must never let them run out.',
    bn: 'মাত্র ৪টি কেন? জায়গা কম, আর রসদ সীমিত। মিশনে প্রতিটি সিদ্ধান্তে এগুলো খরচ হবে, আর কখনোই শেষ হতে দেওয়া যাবে না।',
  },
  hint: {
    en: 'Hint: ask “can I live without it for a week?” Games and comics are fun, but you can’t breathe them. Think of what a body AND a ship need to keep going.',
    bn: 'ইঙ্গিত: নিজেকে জিজ্ঞেস করো, “এটা ছাড়া এক সপ্তাহ বাঁচা যাবে?” গেম আর কমিক মজার, কিন্তু সেগুলো দিয়ে শ্বাস নেওয়া যায় না। শরীর আর জাহাজ চলতে কী লাগে ভাবো।',
  },
  picked: { en: 'picked', bn: 'বাছাই' },
  check: { en: 'Launch check!', bn: 'যাচাই করো!' },
  pickMore: { en: 'Pick 4 to continue', bn: '৪টি বাছাই করো' },
  score: { en: 'right', bn: 'টি ঠিক' },
  realFour: { en: 'The Survival Four', bn: 'বেঁচে থাকার চার নায়ক' },
  oops: { en: 'Not on the ship', bn: 'জাহাজে নেওয়া হবে না' },
  missed: { en: 'You missed this one', bn: 'এটা তুমি বাদ দিয়েছো' },
  drain: {
    en: 'These 4 bars are your lifelines. Every choice drains them, and the tasks get harder each day. Keep ALL of them above zero!',
    bn: 'এই ৪টি বার তোমার প্রাণরেখা। প্রতিটি সিদ্ধান্তে এগুলো কমবে, আর প্রতিদিন কাজ কঠিন হবে। কোনোটাই শূন্য হতে দিও না!',
  },
  next: { en: 'Show me Earth’s story', bn: 'পৃথিবীর গল্প দেখাও' },
  bridgeTitle: { en: 'Every heroic choice counts!', bn: 'প্রতিটি সিদ্ধান্ত অত্যন্ত গুরুত্বপূর্ণ!' },
} as const;

const pick = (l: L, lang: 'en' | 'bn') => l[lang];

const CSS = `
@keyframes ib-twinkle{0%,100%{opacity:.25}50%{opacity:1}}
@keyframes ib-pulse{0%,100%{transform:scale(1);box-shadow:0 0 40px 8px rgba(255,70,50,.55)}50%{transform:scale(1.06);box-shadow:0 0 70px 20px rgba(255,70,50,.85)}}
@keyframes ib-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes ib-glow{0%,100%{box-shadow:0 0 0 0 rgba(34,215,230,.0)}50%{box-shadow:0 0 22px 2px rgba(34,215,230,.55)}}
@keyframes ib-confetti{0%{transform:translateY(-10vh) rotate(0);opacity:1}100%{transform:translateY(105vh) rotate(540deg);opacity:0}}
@keyframes ib-stripe{from{background-position:0 0}to{background-position:40px 0}}
.ib-in{animation:ib-in .5s cubic-bezier(.2,.8,.3,1) both}
.ib-earth{animation:ib-pulse 2.4s ease-in-out infinite}
.ib-star{animation:ib-twinkle 3s ease-in-out infinite}
.ib-ready{animation:ib-glow 1.8s ease-in-out infinite}
.ib-confetti{position:fixed;top:0;pointer-events:none;z-index:60;animation:ib-confetti 2.6s linear forwards}
.ib-stripes{background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.18) 0 10px,transparent 10px 20px);background-size:40px 40px;animation:ib-stripe 1.2s linear infinite}
@media (prefers-reduced-motion:reduce){.ib-in,.ib-earth,.ib-star,.ib-ready,.ib-stripes{animation:none!important}.ib-confetti{display:none}}
`;

function Stars() {
  const stars = useMemo(
    () => Array.from({ length: 36 }, (_, i) => ({ i, x: (i * 53) % 100, y: (i * 37) % 100, d: (i % 7) * 0.4, s: 1 + (i % 3) })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span key={s.i} className="ib-star absolute rounded-full bg-white" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }} />
      ))}
    </div>
  );
}

function Confetti() {
  const bits = useMemo(() => Array.from({ length: 26 }, (_, i) => ({ i, left: (i * 41) % 100, delay: (i % 9) * 0.12, e: ['⭐', '✨', '🚀', '💫', '🎉'][i % 5] })), []);
  return (
    <>
      {bits.map((b) => (
        <span key={b.i} aria-hidden className="ib-confetti text-2xl" style={{ left: `${b.left}%`, animationDelay: `${b.delay}s` }}>
          {b.e}
        </span>
      ))}
    </>
  );
}

/** Top bar: Skip on the left, then Hint, Read and Language, the three buttons Twinkle explains. */
function IntroBar({ lang, onHint, hintOn, readText, showHint }: { lang: 'en' | 'bn'; onHint?: () => void; hintOn?: boolean; readText: string; showHint: boolean }) {
  const leaveIntro = useGame((s) => s.leaveIntro);
  const setLang = useI18n((s) => s.setLang);
  const canSpeak = useCanSpeak();
  const [reading, setReading] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    stopSpeaking();
    setReading(false);
  }, [readText]);
  const pill = 'inline-flex min-h-[2.5rem] items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs sm:text-sm font-display font-extrabold text-white backdrop-blur-md transition active:scale-95 hover:bg-white/20 cursor-pointer';
  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-2 px-3 pt-2 pb-1">
      <button type="button" onClick={() => leaveIntro('home')} className={pill}>
        <SkipForward size={14} />
        {pick(TXT.skip, lang)}
      </button>
      <div className="flex items-center gap-2">
        {showHint && (
          <button type="button" onClick={onHint} aria-pressed={hintOn} aria-label={pick(TXT.hintBtn, lang)} className={`${pill} ${hintOn ? '!border-amber-300 !bg-amber-400/30' : 'ib-ready'}`}>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-[0.8rem] font-black text-black">?</span>
            {pick(TXT.hintBtn, lang)}
          </button>
        )}
        {canSpeak && (
          <button
            type="button"
            aria-label={pick(TXT.readBtn, lang)}
            aria-pressed={reading}
            onClick={() => {
              if (reading) {
                stopSpeaking();
                setReading(false);
              } else setReading(speak(readText, lang, () => setReading(false)));
            }}
            className={pill}
          >
            {reading ? <Square size={14} /> : <Volume2 size={16} />}
            <span className="hidden sm:inline">{pick(TXT.readBtn, lang)}</span>
          </button>
        )}
        <button type="button" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')} className={pill} aria-label="Change language">
          <Languages size={16} />
          {pick(TXT.langBtn, lang)}
        </button>
      </div>
    </header>
  );
}

function Speech({ mood, children }: { mood: TwinkleMood; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2" key={mood}>
      <span className="anim-pop-in shrink-0">
        <Twinkle mood={mood} size={64} />
      </span>
      <div className="relative mb-2 min-w-0 rounded-[1.25rem] border-2 border-line bg-panel px-4 py-2 font-display text-[0.95rem] sm:text-base font-bold leading-snug text-text shadow-[0_0.3rem_0_var(--color-lip)]">
        <span aria-hidden className="absolute bottom-3 -left-2 h-3.5 w-3.5 rotate-45 border-b-2 border-l-2 border-line bg-panel" />
        {children}
      </div>
    </div>
  );
}

export function Hook() {
  const leaveIntro = useGame((s) => s.leaveIntro);
  const lang = useI18n((s) => s.lang);
  const [step, setStep] = useState<'brief' | 'pick' | 'result' | 'bridge'>('brief');
  const [sel, setSel] = useState<string[]>([]);
  const [hint, setHint] = useState(false);
  const [praise] = useState(() => Math.floor(Math.random() * PRAISE.length));
  const [enc] = useState(() => Math.floor(Math.random() * ENCOURAGE.length));
  const topRef = useRef<HTMLDivElement>(null);

  const right = sel.filter((id) => ITEMS.find((i) => i.id === id)?.correct).length;
  const perfect = right === NEED;

  useEffect(() => {
    topRef.current?.scrollTo?.({ top: 0 });
  }, [step]);

  const toggle = (id: string) => {
    setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < NEED ? [...s, id] : s));
  };
  const check = () => {
    if (sel.length !== NEED) return;
    if (right !== NEED) shakeScene();
    setStep('result');
  };

  /* ---------- Bridge: the four lifelines + hand-off to Earth's story ---------- */
  if (step === 'bridge') {
    return (
      <Scene bare place="space" top={<Hud meters={START} stars={0} lead={<button type="button" onClick={() => leaveIntro('home')} className="inline-flex min-h-[2.25rem] items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 text-xs font-display font-bold text-white cursor-pointer"><SkipForward size={14} />{pick(TXT.skip, lang)}</button>} />}>
        <style>{CSS}</style>
        <div className="flex h-full min-h-0 flex-1 items-center gap-6 overflow-y-auto px-6 py-3">
          <div className="hidden min-h-0 w-[34%] shrink-0 items-end justify-center sm:flex">
            <Kid who="orbit" pose="arms" height="min(15rem, 90%)" label="Orbit" className="max-h-full" />
          </div>
          <div className="ib-in flex min-w-0 flex-1 flex-col items-start justify-center gap-4">
            <h1 className="rounded-[1.25rem] bg-panel/85 px-4 py-2 font-display text-[1.6rem] sm:text-[2.25rem] leading-snug font-extrabold text-text">{pick(TXT.bridgeTitle, lang)}</h1>
            <p className="text-base sm:text-lg font-medium leading-relaxed text-text/90">{pick(TXT.drain, lang)}</p>
            <GameButton variant="go" icon={ArrowRight} onClick={() => leaveIntro('story')} className="!min-h-[3rem] !px-6">
              {pick(TXT.next, lang)} 🌍
            </GameButton>
          </div>
        </div>
      </Scene>
    );
  }

  const readText =
    step === 'brief'
      ? `${pick(TXT.storyTitle, lang)} ${TXT.story.map((s) => s[lang]).join(' ')} ${pick(TXT.guideIntro, lang)} ${TXT.guide.map((g) => g[lang]).join(' ')}`
      : step === 'pick'
        ? `${pick(TXT.q, lang)} ${pick(TXT.explain, lang)}`
        : `${perfect ? pick(PRAISE[praise], lang) : pick(ENCOURAGE[enc], lang)} ${ITEMS.filter((i) => i.correct).map((i) => `${pick(i.name, lang)}. ${pick(i.why, lang)}`).join(' ')}`;

  return (
    <Scene bare place="space" top={null}>
      <style>{CSS}</style>
      <div className="relative flex h-[100dvh] min-h-0 flex-col overflow-hidden">
      <Stars />
      {step === 'result' && perfect && <Confetti />}
      <IntroBar lang={lang} showHint={step === 'pick'} hintOn={hint} onHint={() => setHint((h) => !h)} readText={readText} />

      <div ref={topRef} className="relative z-10 min-h-0 flex-1 overflow-y-auto px-3 pb-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          {/* ---------------- BRIEF ---------------- */}
          {step === 'brief' && (
            <>
              <div className="ib-in relative overflow-hidden rounded-3xl border-2 border-red-400/60 bg-gradient-to-br from-[#3a0f1c]/95 via-[#1a1138]/95 to-panel/95 p-4 sm:p-5 shadow-2xl">
                <div className="ib-stripes absolute inset-x-0 top-0 h-2 bg-red-500/80" aria-hidden />
                <div className="flex items-center gap-4 pt-2">
                  <div className="ib-earth grid h-16 w-16 sm:h-20 sm:w-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-700 text-4xl sm:text-5xl" aria-hidden>
                    🌍
                  </div>
                  <div className="min-w-0">
                    <span className="rounded-full bg-red-500 px-2.5 py-0.5 font-display text-[0.7rem] font-black tracking-widest text-white">⚠ {pick(TXT.alert, lang)}</span>
                    <h1 className="mt-1 font-display text-xl sm:text-3xl font-black leading-tight text-white">{pick(TXT.storyTitle, lang)}</h1>
                  </div>
                </div>
                <ul className="mt-3 flex flex-col gap-2">
                  {TXT.story.map((s, i) => (
                    <li key={i} className="ib-in flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.07] px-3 py-2" style={{ animationDelay: `${0.25 + i * 0.35}s` }}>
                      <span className="text-2xl sm:text-3xl" aria-hidden>{s.e}</span>
                      <span className="font-display text-[0.95rem] sm:text-lg font-bold leading-snug text-text">{s[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ib-in rounded-3xl border-2 border-go/50 bg-panel/90 p-3 sm:p-4 shadow-xl" style={{ animationDelay: '2s' }}>
                <Speech mood="wink">{pick(TXT.guideIntro, lang)}</Speech>
                <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                  {TXT.guide.map((g) => (
                    <li key={g.k} className="flex items-start gap-2 rounded-2xl border border-line bg-space/70 p-2.5">
                      <span className={`grid h-9 min-w-9 shrink-0 place-items-center rounded-full px-1 font-display text-sm font-black ${g.k === '?' ? 'bg-amber-400 text-black' : 'border border-white/30 bg-white/15 text-white'}`}>{g.k}</span>
                      <span className="font-display text-[0.85rem] font-bold leading-snug text-text">{g[lang]}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-end">
                  <GameButton variant="go" icon={Rocket} onClick={() => setStep('pick')} className="ib-ready !min-h-[3rem] !px-6">
                    {pick(TXT.ready, lang)}
                  </GameButton>
                </div>
              </div>
            </>
          )}

          {/* ---------------- PICK ---------------- */}
          {step === 'pick' && (
            <div className="ib-in rounded-3xl border-2 border-go/60 bg-panel/90 p-3 sm:p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-amber-300 to-amber-500 font-display text-3xl font-black text-black shadow-[0_0.25rem_0_#a16207]" aria-hidden>?</span>
                <div className="min-w-0">
                  <span className="font-display text-[0.7rem] font-black tracking-widest text-amber-300">{pick(TXT.qLabel, lang)}</span>
                  <h1 className="font-display text-lg sm:text-2xl font-black leading-snug text-white">{pick(TXT.q, lang)}</h1>
                </div>
              </div>

              <p className="mt-2 rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 font-display text-[0.85rem] sm:text-sm font-bold leading-snug text-cyan-100">
                💡 {pick(TXT.explain, lang)}
              </p>
              {hint && (
                <div className="ib-in mt-2">
                  <Speech mood="question">{pick(TXT.hint, lang)}</Speech>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2" aria-live="polite">
                {Array.from({ length: NEED }, (_, i) => (
                  <span key={i} className={`h-3 flex-1 rounded-full border border-white/30 transition-all ${i < sel.length ? 'bg-go shadow-[0_0_10px_var(--color-go)]' : 'bg-white/10'}`} />
                ))}
                <span className="font-display text-sm font-black tabular-nums text-white">{sel.length}/{NEED}</span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" role="group" aria-label={pick(TXT.q, lang)}>
                {ITEMS.map((it) => {
                  const on = sel.includes(it.id);
                  const full = sel.length >= NEED && !on;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(it.id)}
                      className={`relative flex min-h-[5.5rem] sm:min-h-[6.5rem] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1.5 py-2 font-display transition active:scale-95 cursor-pointer ${
                        on ? 'border-go bg-go/20 shadow-[0_0_18px_rgba(34,215,230,.55)] -translate-y-0.5' : full ? 'border-line/50 bg-space/40 opacity-65' : 'border-line bg-space/70 hover:border-go/60 hover:bg-panel-up'
                      }`}
                    >
                      {on && <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-go text-go-text"><Check size={14} strokeWidth={4} /></span>}
                      <span className="text-3xl sm:text-4xl" aria-hidden>{it.emoji}</span>
                      <span className="text-[0.75rem] sm:text-sm font-extrabold leading-tight text-text">{pick(it.name, lang)}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex justify-end">
                <GameButton variant="go" icon={Rocket} disabled={sel.length !== NEED} onClick={check} className="!min-h-[3rem] !px-6">
                  {sel.length === NEED ? pick(TXT.check, lang) : pick(TXT.pickMore, lang)}
                </GameButton>
              </div>
            </div>
          )}

          {/* ---------------- RESULT ---------------- */}
          {step === 'result' && (
            <>
              <div className="ib-in rounded-3xl border-2 border-line bg-panel/90 p-3 sm:p-4 shadow-xl">
                <Speech mood={perfect ? 'stars' : 'worried'}>
                  <span className="block">{perfect ? pick(PRAISE[praise], lang) : pick(ENCOURAGE[enc], lang)}</span>
                  <span className="mt-1 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-black tracking-wide text-amber-300">{right}/{NEED} {pick(TXT.score, lang)}</span>
                </Speech>
              </div>

              <section className="ib-in rounded-3xl border-2 border-good/70 bg-panel/90 p-3 sm:p-4 shadow-xl" style={{ animationDelay: '.2s' }}>
                <h2 className="font-display text-base sm:text-xl font-black text-white">🛡️ {pick(TXT.realFour, lang)}</h2>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {ITEMS.filter((i) => i.correct).map((it) => {
                    const got = sel.includes(it.id);
                    return (
                      <li key={it.id} className={`flex items-start gap-2.5 rounded-2xl border-2 p-2.5 ${got ? 'border-good bg-good/15' : 'border-amber-400/70 bg-amber-400/10'}`}>
                        <span className="text-3xl" aria-hidden>{it.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-display text-sm font-black text-white">
                            {pick(it.name, lang)}
                            {got ? <Check size={16} className="text-green-400" strokeWidth={4} /> : <span className="rounded-full bg-amber-400 px-1.5 text-[0.65rem] text-black">{pick(TXT.missed, lang)}</span>}
                          </div>
                          <p className="font-display text-[0.8rem] font-bold leading-snug text-text/90">{pick(it.why, lang)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {sel.some((id) => !ITEMS.find((i) => i.id === id)?.correct) && (
                <section className="ib-in rounded-3xl border-2 border-danger/70 bg-panel/90 p-3 sm:p-4 shadow-xl" style={{ animationDelay: '.4s' }}>
                  <h2 className="font-display text-base sm:text-lg font-black text-white">🚫 {pick(TXT.oops, lang)}</h2>
                  <ul className="mt-2 flex flex-col gap-2">
                    {sel.map((id) => ITEMS.find((i) => i.id === id)!).filter((i) => !i.correct).map((it) => (
                      <li key={it.id} className="flex items-start gap-2.5 rounded-2xl border border-danger/50 bg-danger/10 p-2.5">
                        <span className="text-2xl" aria-hidden>{it.emoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1 font-display text-sm font-black text-white">{pick(it.name, lang)} <X size={15} className="text-red-400" strokeWidth={4} /></div>
                          <p className="font-display text-[0.8rem] font-bold leading-snug text-text/90">{pick(it.why, lang)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="flex justify-end">
                <GameButton variant="go" icon={ArrowRight} onClick={() => setStep('bridge')} className="ib-ready !min-h-[3rem] !px-6" >
                  {lang === 'bn' ? 'পরের ধাপ' : 'Next'}
                </GameButton>
              </div>
            </>
          )}
        </div>
      </div>
      </div>
    </Scene>
  );
}
