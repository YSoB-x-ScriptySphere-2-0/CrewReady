// Twinkle AI Space Chat Teaser & Interactive Preview (Task 4)
// Introduces the upcoming fine-tuned Space AI Model that answers children's cosmic curiosity.
import { useState } from 'react';
import { 
  X, 
  Bot, 
  HelpCircle,
  Radio
} from 'lucide-react';
import { useI18n } from '../content/i18n';

interface SampleQA {
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
  genAlphaEn: string;
  genAlphaBn: string;
}

const SAMPLE_QUESTIONS: SampleQA[] = [
  {
    qEn: 'Can we grow watermelons on Mars?',
    qBn: 'মঙ্গলে কি তরমুজ চাষ করা যাবে?',
    aEn: 'Yes, in pressurized hydroponic greenhouse domes! Real NASA tests grew lettuce and tomatoes in water and LED light.',
    aBn: 'হ্যাঁ, বিশেষ কাঁচের ঘরে পানিতে ও বাতির আলোতে চাষ সম্ভব! নাসা ইতিমধ্যে লেটুস ও টমেটো সফলভাবে ফলিয়েছে।',
    genAlphaEn: 'No cap, space watermelon would be the ultimate hydration flex!',
    genAlphaBn: 'নো ক্যাপ! মঙ্গলে তরমুজ ফলালে পানির তেষ্টা মেটানোর সেরা উপায় হবে!',
  },
  {
    qEn: 'Why is Mars red?',
    qBn: 'মঙ্গল গ্রহ লাল দেখায় কেন?',
    aEn: 'Because Mars soil is full of iron oxide, which is rusty iron! When sunlight hits rust, it glows red and orange.',
    aBn: 'কারণ মঙ্গলের লাল মাটিতে প্রচুর আয়রন অক্সাইড বা মরিচা আছে! সূর্যের আলোয় এই মরিচা লালচে-কমলা দেখায়।',
    genAlphaEn: 'Mars has that permanent rusty aesthetic, 100% natural rizz!',
    genAlphaBn: 'মঙ্গলের মাটিতে মরিচা থাকার কারণেই এর লাল রঙের এমন আকর্ষণীয় রূপ!',
  },
  {
    qEn: 'How do astronauts drink water in space?',
    qBn: 'মহাকাশচারীরা ওজনহীনতায় পানি পান করে কীভাবে?',
    aEn: 'Water floats in floating round bubbles without gravity! Astronauts drink from sealed pouches using special straws.',
    aBn: 'ওজনহীনতায় পানি গোল বলের মতো শূন্যে ভাসে! তাই মহাকাশচারীরা স্ট্র লাগানো সিল করা পাউচ দিয়ে পানি পান করে।',
    genAlphaEn: 'Floating water bubbles are peak space physics, so satisfying!',
    genAlphaBn: 'বাতাসে ভাসমান পানির বুদবুদ দেখা সত্যিই দারুণ এক অভিজ্ঞতা!',
  },
  {
    qEn: 'How loud is a rocket launch?',
    qBn: 'রকেট ওড়ার সময় কত বিকট শব্দ হয়?',
    aEn: 'Around 200 decibels! Sound waves are so strong that launch pads use giant water torrents to absorb the noise vibrations.',
    aBn: 'প্রায় ২০০ ডেসিবেল! এই শব্দ এতো শক্তিশালী যে প্যাড বাঁচাতে রকেটের নিচে লক্ষ লক্ষ লিটার পানি ঢালা হয়।',
    genAlphaEn: 'That acoustic boom is max volume, bass-boosted to the max!',
    genAlphaBn: 'শব্দটি এতোই প্রচণ্ড যে কান বাঁচাতে বিশেষ সুরক্ষা নিতে হয়!',
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
      <div className="relative flex max-w-lg w-full flex-col overflow-hidden rounded-2xl border-3 border-go bg-panel p-4 sm:p-5 shadow-2xl anim-pop-in">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-go/20 text-go border border-go">
              <Bot size={20} />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[10px] font-black tracking-wider text-amber-300 uppercase">
                  {lang === 'bn' ? 'শীঘ্রই আসছে' : 'COMING SOON'}
                </span>
                <span className="inline-flex h-2 w-2 rounded-full bg-good animate-ping" />
              </div>
              <h2 className="font-display text-base sm:text-lg font-black text-white leading-tight">
                {lang === 'bn' ? 'টুইঙ্কেল এআই স্পেস চ্যাট' : 'Twinkle Space AI Model'}
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

        {/* Feature Teaser Intro */}
        <div className="mt-2.5 rounded-xl border border-line bg-space-deep p-2.5 text-xs text-text/90 leading-relaxed">
          <p className="font-display font-bold">
            {lang === 'bn'
              ? 'মহাকাশ, ব্ল্যাকহোল কিংবা ভিনগ্রহ নিয়ে তোমার মাথায় হাজারো প্রশ্ন? আমরা তৈরি করছি বিশেষায়িত এআই স্পেস মডেল! শীঘ্রই তুমি টুইঙ্কেলের সাথে সরাসরি কথা বলে নাসার আসল বৈজ্ঞানিক তথ্য জানতে পারবে।'
              : 'Ever wondered about black holes, aliens, or Mars rovers? We are training a specialized AI space model! Soon you will be able to chat with Twinkle in real-time with verified NASA science!'}
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
              Twinkle AI:
            </span>
          </div>

          <p className="font-display text-xs sm:text-sm font-bold text-white leading-relaxed">
            {lang === 'bn' ? activeQA.aBn : activeQA.aEn}
          </p>

          <p className="mt-2 font-display text-xs font-extrabold text-amber-300 italic">
            "{lang === 'bn' ? activeQA.genAlphaBn : activeQA.genAlphaEn}"
          </p>
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
            {lang === 'bn' ? 'বুঝতে পেরেছি' : 'Got It!'}
          </button>
        </div>
      </div>
    </div>
  );
}
