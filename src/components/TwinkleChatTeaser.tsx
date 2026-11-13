// Twinkle AI Space Chat Teaser & Interactive Preview
// Introduces the upcoming fine-tuned Space AI Model that answers children's cosmic curiosity.
import { useState } from 'react';
import { 
  X, 
  Bot, 
  HelpCircle,
  Radio,
  Sparkles
} from 'lucide-react';
import { useI18n } from '../content/i18n';

interface SampleQA {
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  funFactEn: string;
  funFactBn: string;
}

const SAMPLE_QUESTIONS: SampleQA[] = [
  {
    qEn: 'Can we grow watermelons on Mars?',
    qBn: 'মঙ্গলে কি তরমুজ চাষ করা যাবে?',
    aEn: 'Yes, in pressurized hydroponic greenhouse domes! Real NASA tests on the ISS already proved plants can grow using recycled water and LED light recipes.',
    aBn: 'হ্যাঁ, বিশেষ কাঁচের ঘরে পানিতে ও বাতির আলোতে চাষ সম্ভব! নাসা ইতিমধ্যে লেটুস ও টমেটো সফলভাবে ফলিয়েছে।',
    funFactEn: 'Fun Fact: Astronauts on the Space Station have already grown and eaten fresh red romaine lettuce and space-grown chili peppers!',
    funFactBn: 'মজার তথ্য: মহাকাশ স্টেশনের নভোচারীরা ইতিমধ্যে মহাকাশে উৎপাদিত তাজা লাল লেটুস ও মরিচ সফলভাবে চাষ করে খেয়েছেন!',
  },
  {
    qEn: 'Why is Mars red?',
    qBn: 'মঙ্গল গ্রহ লাল দেখায় কেন?',
    aEn: 'Because Mars soil is full of iron oxide, which is the same as rusty iron! When sunlight hits the rusted surface dust, it glows red and orange.',
    aBn: 'কারণ মঙ্গলের লাল মাটিতে প্রচুর আয়রন অক্সাইড বা মরিচা আছে! সূর্যের আলোয় এই মরিচা লালচে-কমলা দেখায়।',
    funFactEn: 'Fun Fact: Billions of years ago, Mars had water that reacted with iron minerals, creating the rust we still see today!',
    funFactBn: 'মজার তথ্য: কোটি কোটি বছর আগে মঙ্গলে প্রচুর পানি ছিল, যা লোহার খনিজের সাথে বিক্রিয়া করে এই সুবিশাল মরিচার আস্তরণ তৈরি করেছে!',
  },
  {
    qEn: 'How do astronauts drink water in space?',
    qBn: 'মহাকাশচারীরা ওজনহীনতায় পানি পান করে কীভাবে?',
    aEn: 'Without gravity pulling down, water floats as round, dancing bubbles! Astronauts drink from sealed pouches using special one-way valve straws.',
    aBn: 'ওজনহীনতায় পানি গোল বলের মতো শূন্যে ভাসে! তাই মহাকাশচারীরা স্ট্র লাগানো সিল করা পাউচ দিয়ে পানি পান করে।',
    funFactEn: 'Fun Fact: Surface tension holds floating water together into crystal-clear spheres in microgravity!',
    funFactBn: 'মজার তথ্য: মাধ্যাকর্ষণ না থাকায় তরলের নিজস্ব পৃষ্ঠটান পানিকে শূন্যে নিখুঁত গোলকের মতো ধরে রাখে!',
  },
  {
    qEn: 'How loud is a rocket launch?',
    qBn: 'রকেট ওড়ার সময় কত বিকট শব্দ হয়?',
    aEn: 'Over 200 decibels! Sound waves are so powerful they could damage the launchpad, which is why NASA pumps thousands of gallons of water underneath during liftoff.',
    aBn: 'প্রায় ২০০ ডেসিবেল! এই শব্দ এতো শক্তিশালী যে প্যাড বাঁচাতে রকেটের নিচে লক্ষ লক্ষ লিটার পানি ঢালা হয়।',
    funFactEn: 'Fun Fact: NASA sound-suppression water systems dump 450,000 gallons of water in just about a minute!',
    funFactBn: 'মজার তথ্য: শব্দতরঙ্গের তীব্র ধাক্কা কমাতে নাসার সাউন্ড সাপ্রেশন সিস্টেমে মাত্র এক মিনিটে প্রায় সাড়ে চার লাখ গ্যালন পানি ঢালা হয়!',
  },
];

interface TwinkleChatTeaserProps {
  onClose: () => void;
}

export function TwinkleChatTeaser({ onClose }: TwinkleChatTeaserProps) {
  const lang = useI18n((s) => s.lang);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [activeQA, setActiveQA] = useState<SampleQA>(SAMPLE_QUESTIONS[0]);

  const handleSelectQuestion = (idx: number) => {
    setSelectedIdx(idx);
    setActiveQA(SAMPLE_QUESTIONS[idx]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-deep/90 p-3 sm:p-5 select-none"
    >
      <div className="relative flex max-w-lg w-full max-h-[90vh] overflow-y-auto flex-col rounded-2xl border-3 border-go bg-panel p-4 sm:p-5 shadow-2xl anim-pop-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-go/20 text-go border border-go shadow-sm shrink-0">
              <Bot size={22} />
            </span>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="rounded-full bg-amber-400/20 border border-amber-400/40 px-2 py-0.5 font-display text-[9px] sm:text-[10px] font-black tracking-wider text-amber-300 uppercase">
                  {lang === 'bn' ? 'পরবর্তী আপডেটে আসছে' : 'Coming in the next update'}
                </span>
                <span className="inline-flex h-2 w-2 rounded-full bg-good animate-ping" />
              </div>
              <h2 className="font-display text-base sm:text-lg font-black text-white leading-tight">
                {lang === 'bn' ? 'টুইঙ্কেল এআই স্পেস চ্যাট' : 'Twinkle Space AI Chat'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel-up text-muted hover:text-white transition cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Feature Teaser Intro with User Requested Tagline */}
        <div className="mt-2.5 rounded-xl border border-cyan-400/30 bg-[#0E1B45]/90 p-3 text-xs text-text/95 leading-relaxed">
          <div className="flex items-center gap-1.5 text-cyan-300 font-display font-extrabold text-xs sm:text-sm mb-1">
            <Sparkles size={14} className="text-amber-300" />
            <span>
              {lang === 'bn'
                ? 'মহাকাশ নিয়ে যা খুশি প্রশ্ন করো, মেটাও তোমার কৌতূহল!'
                : 'Ask anything about space, meet your curiosity!'}
            </span>
          </div>
          <p className="font-sans text-[11px] sm:text-xs text-muted leading-relaxed">
            {lang === 'bn'
              ? 'মহাকাশ, ব্ল্যাকহোল, গ্রহ-নক্ষত্র কিংবা মঙ্গল অভিযান নিয়ে তোমার সব প্রশ্নের উত্তর দিতে আমরা নাসার আসল বৈজ্ঞানিক ডেটাসেটে টুইঙ্কেলকে প্রস্তুত করছি। পরবর্তী আপডেটে তুমি সরাসরি কথা বলতে পারবে!'
              : 'Ever wondered about black holes, Mars colonies, or how rockets work? Ask anything about space and meet your curiosity! Twinkle AI is being fine-tuned with NASA and NOAA science data for our next major update.'}
          </p>
        </div>

        {/* Interactive Sample Questions Selector */}
        <div className="mt-3">
          <span className="font-display text-xs font-black text-muted uppercase tracking-wider">
            {lang === 'bn' ? 'নমুনা প্রশ্ন চাপুন:' : 'Try a Curious Question:'}
          </span>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            {SAMPLE_QUESTIONS.map((qa, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectQuestion(idx)}
                className={`flex items-center gap-1.5 rounded-lg border p-2 text-left transition cursor-pointer ${
                  selectedIdx === idx
                    ? 'border-go bg-go/15 text-white font-extrabold shadow-sm'
                    : 'border-line bg-panel-up text-muted hover:text-text font-bold'
                }`}
              >
                <HelpCircle size={14} className="shrink-0 text-cyan-400" />
                <span className="font-display text-xs truncate">
                  {lang === 'bn' ? qa.qBn : qa.qEn}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulated Twinkle AI Response Box */}
        <div className="mt-3 rounded-xl border-2 border-line bg-space p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <img
              src={`${import.meta.env.BASE_URL}art/twinkle-happy.webp`}
              alt="Twinkle"
              className="h-6 w-6 object-contain"
            />
            <span className="font-display text-xs font-black text-cyan-300">
              Twinkle:
            </span>
          </div>

          <p className="font-display text-xs sm:text-sm font-bold text-white leading-relaxed">
            {lang === 'bn' ? activeQA.aBn : activeQA.aEn}
          </p>

          <div className="mt-2.5 rounded-lg border border-amber-400/30 bg-amber-500/10 p-2 text-xs text-amber-200">
            <span className="font-display font-extrabold text-amber-300">💡 {lang === 'bn' ? 'টুইঙ্কেলের মহাকাশ তথ্য:' : "Twinkle's Cosmic Fact:"} </span>
            <span className="font-sans font-medium">{lang === 'bn' ? activeQA.funFactBn : activeQA.funFactEn}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-line/60 pt-2 text-[11px] text-muted font-display font-bold">
          <span className="flex items-center gap-1">
            <Radio size={13} className="text-cyan-400" />
            <span>{lang === 'bn' ? 'নাসা ও নোয়া ডেটাসেটে প্রশিক্ষিত' : 'Trained on NASA & NOAA Datasets'}</span>
          </span>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-go px-3 py-1 font-display text-xs font-black text-go-text hover:brightness-105 transition cursor-pointer"
          >
            {lang === 'bn' ? 'দারুণ!' : 'Awesome!'}
          </button>
        </div>
      </div>
    </div>
  );
}
