// Explain Cards & Kid-Friendly NCTB Dictionary (plan.md §5.5 & BUILD_SEQUENCE.md K2/K4)
// Sourced strictly from docs/06 §4 kid wording column and Bangladesh primary science curriculum.
import {
  FlaskConical,
  Gauge,
  Radiation,
  Recycle,
  Rocket,
  SolarPanel,
  Sprout,
  Sunrise,
  type LucideIcon,
} from 'lucide-react';

export interface ExplainEntry {
  id: string;
  titleEn: string;
  titleBn: string;
  nctbAltBn: string; // Bangladesh primary textbook equivalent
  sentencesEn: string[]; // Under 12 words per sentence
  sentencesBn: string[];
  icon: LucideIcon;
  source: string;
  genAlphaComment: {
    en: string;
    bn: string;
  };
}

export const EXPLAIN_ENTRIES: ExplainEntry[] = [
  {
    id: 'sol',
    titleEn: 'Sol (Mars Day)',
    titleBn: 'সল (মঙ্গলের দিন)',
    nctbAltBn: 'মঙ্গলের ২৪ ঘণ্টা ৪০ মিনিটের দিন',
    sentencesEn: [
      'One Mars day is called a sol.',
      'It lasts 24 hours and 40 minutes.',
      'That is almost like a day on Earth!',
    ],
    sentencesBn: [
      'মঙ্গল গ্রহের একদিনকে বলা হয় "সল"।',
      'মঙ্গলের একদিন ২৪ ঘণ্টা ৪০ মিনিট লম্বা।',
      'এটি আমাদের পৃথিবীর দিনের মতোই প্রায় সমান!',
    ],
    icon: Sunrise,
    source: 'NASA Mars Facts',
    genAlphaComment: {
      en: 'No cap, you get 40 extra minutes to sleep on Mars!',
      bn: 'নো ক্যাপ! মঙ্গলে ঘুমানোর জন্য প্রতিদিন ৪০ মিনিট বেশি পাওয়া যাবে!',
    },
  },
  {
    id: 'solar-panel',
    titleEn: 'Solar Panel',
    titleBn: 'সৌর প্যানেল',
    nctbAltBn: 'সূর্যের আলো থেকে বিদ্যুৎ তৈরির বোর্ড',
    sentencesEn: [
      'Solar panels turn sunlight into electricity.',
      'Mars dust can cover the panels.',
      'Clean panels give full battery power.',
    ],
    sentencesBn: [
      'সৌর প্যানেল সূর্যের আলো থেকে বিদ্যুৎ তৈরি করে।',
      'মঙ্গলের ধুলোয় প্যানেল ঢেকে যেতে পারে।',
      'পরিষ্কার প্যানেল রাখলে পুরো ব্যাটারি চার্জ থাকে।',
    ],
    icon: SolarPanel,
    source: 'NASA Opportunity & InSight missions',
    genAlphaComment: {
      en: 'Keep those panels clean or our power is cooked!',
      bn: 'প্যানেল সাফ না রাখলে ব্যাটারি শেষ হয়ে যাবে দোস্ত!',
    },
  },
  {
    id: 'radiation',
    titleEn: 'Space Radiation',
    titleBn: 'মহাকাশের ক্ষতিকর রশ্মি',
    nctbAltBn: 'সূর্যের বিপজ্জনক অদৃশ্য বিকিরণ',
    sentencesEn: [
      'Sun storms shoot invisible dangerous rays.',
      'Water and thick walls block these rays.',
      'Astronauts shelter behind water bags.',
    ],
    sentencesBn: [
      'সূর্য ঝড় থেকে বিপজ্জনক অদৃশ্য রশ্মি ছড়ায়।',
      'পানি এবং ভারী দেওয়াল এই রশ্মি আটকে দেয়।',
      'ঝড় এলে মহাকাশচারীরা পানির ব্যাগের পেছনে লুকায়।',
    ],
    icon: Radiation,
    source: 'NASA Orion storm-shelter pages',
    genAlphaComment: {
      en: 'Water shield has +1000 aura against cosmic radiation!',
      bn: 'পানি দিয়ে তৈরি ঢাল মহাকাশের ক্ষতিকর রশ্মি সহজেই আটকে দেয়!',
    },
  },
  {
    id: 'moxie',
    titleEn: 'MOXIE (Oxygen Maker)',
    titleBn: 'মক্সি (অক্সিজেন তৈরির যন্ত্র)',
    nctbAltBn: 'বাতাস থেকে মানুষের শ্বাস নেওয়ার গ্যাস তৈরির যন্ত্র',
    sentencesEn: [
      'Mars air has no breathable oxygen.',
      'MOXIE pulls in carbon dioxide gas.',
      'It makes fresh breathable oxygen for astronauts.',
    ],
    sentencesBn: [
      'মঙ্গলের বাতাসে শ্বাস নেওয়ার অক্সিজেন নেই।',
      'মক্সি যন্ত্র বাতাস থেকে কার্বন ডাই-অক্সাইড টানে।',
      'এটি শ্বাস নেওয়ার জন্য তাজা অক্সিজেন তৈরি করে।',
    ],
    icon: FlaskConical,
    source: 'NASA MOXIE release',
    genAlphaComment: {
      en: 'MOXIE is the true GOAT making fresh air from thin Martian gas!',
      bn: 'মক্সি যন্ত্র আসলেই গ্রেট, মঙ্গলের পাতলা বাতাস থেকে তাজা অক্সিজেন বানায়!',
    },
  },
  {
    id: 'recycler',
    titleEn: 'Water Recycler',
    titleBn: 'পানি পুনব্যবহার যন্ত্র (রিসাইক্লার)',
    nctbAltBn: 'ব্যবহৃত পানি বিশুদ্ধ করার যন্ত্র',
    sentencesEn: [
      'Water is heavy to carry to Mars.',
      'The recycler filters every single drop.',
      'It turns used water back into clean water.',
    ],
    sentencesBn: [
      'পৃথিবী থেকে মহাকাশে বেশি পানি নেওয়া কঠিন।',
      'রিসাইক্লার প্রতি ফোঁটা পানি ছেঁকে পরিষ্কার করে।',
      'এটি ব্যবহৃত পানিকে আবার বিশুদ্ধ খাবার পানিতে পরিণত করে।',
    ],
    icon: Recycle,
    source: 'NASA ISS life support',
    genAlphaComment: {
      en: 'Zero waste mindset, that is an absolute W move!',
      bn: 'এক ফোঁটা পানিও অপচয় নয়, এটাই আসল বুদ্ধিমানের কাজ!',
    },
  },
  {
    id: 'veggie',
    titleEn: 'Veggie Plant Farm',
    titleBn: 'ভেজি মহাকাশ বাগান',
    nctbAltBn: 'মাটি ছাড়া পানিতে সবজি চাষ (হাইড্রোপনিক্স)',
    sentencesEn: [
      'Plants grow without soil in LED light.',
      'Astronauts eat fresh crunchy red lettuce.',
      'Fresh food keeps the crew happy and healthy.',
    ],
    sentencesBn: [
      'মাটি ছাড়াই এলইডি বাতির আলোতে গাছ বড় হয়।',
      'মহাকাশচারীরা তাজা লাল লেটুস পাতা খায়।',
      'তাজা শাকসবজি দলকে সুস্থ ও হাসিখুশি রাখে।',
    ],
    icon: Sprout,
    source: 'NASA Veggie pages OSD-745',
    genAlphaComment: {
      en: 'Space lettuce is crisp, fresh, and gives +100 health vibes!',
      bn: 'মহাকাশের লেটুস খেলে শক্তি ও মন দুটোই দারুণ থাকে!',
    },
  },
  {
    id: 'launch-window',
    titleEn: 'Launch Window',
    titleBn: 'লঞ্চ উইন্ডো (যাত্রা সময়)',
    nctbAltBn: 'পৃথিবী থেকে মঙ্গলে যাওয়ার সেরা সুযোগ',
    sentencesEn: [
      'Earth and Mars orbit at different speeds.',
      'They get close once every 26 months.',
      'Rockets must launch during this exact time.',
    ],
    sentencesBn: [
      'পৃথিবী ও মঙ্গল আলাদা গতিতে সূর্যকে ঘোরে।',
      'প্রতি ২৬ মাসে তারা সবচেয়ে কাছাকাছি আসে।',
      'রকেটকে ঠিক এই সময়েই রওনা হতে হয়।',
    ],
    icon: Rocket,
    source: 'NASA Mars Mission Logistics',
    genAlphaComment: {
      en: 'Miss the launch window and you wait over 2 years, bet!',
      bn: 'সময় মিস করলে দুই বছরেরও বেশি অপেক্ষা করতে হবে!',
    },
  },
  {
    id: 'kp',
    titleEn: 'Kp Space Weather Scale',
    titleBn: 'কেপি স্পেস ওয়েদার সূচক',
    nctbAltBn: 'মহাকাশের সৌরঝড় পরিমাপের স্কেল',
    sentencesEn: [
      'Kp measures how stormy the Sun is.',
      'Kp 0 to 3 means calm space weather.',
      'Kp 7 to 9 means a powerful solar storm.',
    ],
    sentencesBn: [
      'কেপি সূচক দিয়ে সূর্যের ঝড়ের মাত্রা মাপা হয়।',
      'কেপি ০ থেকে ৩ মানে মহাকাশ শান্ত।',
      'কেপি ৭ থেকে ৯ মানে শক্তিশালী সূর্যঝড়!',
    ],
    icon: Gauge,
    source: 'NOAA Space Weather Prediction Center',
    genAlphaComment: {
      en: 'Kp 9 is maximum danger mode, shields locked in!',
      bn: 'কেপি ৯ মানে মহা বিপদ, সাথে সাথে ঢাল শক্ত করে নাও!',
    },
  },
];

export const getExplainEntry = (id: string): ExplainEntry | undefined =>
  EXPLAIN_ENTRIES.find((e) => e.id === id);

// Gen Alpha Dialogue Generator for Twinkle
export const TWINKLE_GEN_ALPHA = {
  victory: [
    { en: 'Aura +1000! You totally cooked that decision, cadet!', bn: 'অরা +১০০০! তুমি পুরো বস লেভেলের সিদ্ধান্ত নিয়েছ!' },
    { en: 'Massive W move! Mars colony is thriving!', bn: 'মার্ভেলাস ডব্লিউ চাল! আমাদের মঙ্গল কলোনি এখন নিরাপদ!' },
    { en: 'No cap, you are the most locked-in astronaut alive!', bn: 'নো ক্যাপ! তোমার চেয়ে চৌকস মহাকাশচারী আর নেই!' },
  ],
  danger: [
    { en: 'Hold up, our oxygen is looking kinda cooked! Lock in!', bn: 'থামো দোস্ত, অক্সিজেন কমে যাচ্ছে! দ্রুত সমাধান খোঁজো!' },
    { en: 'The Sun is throwing hands! Raise shields now!', bn: 'সূর্য তো রেগে আগুন! এখনই ঢাল চালু করো!' },
    { en: 'Not the vibe! Dust is burying our solar panels!', bn: 'ভালো ঠেকছে না! ধুলোয় তো সৌর প্যানেল ঢেকে যাচ্ছে!' },
  ],
  hint: [
    { en: 'Psst cadet! Remember water blocks both thirst AND radiation!', bn: 'শোনো ক্যাডেট! পানি কিন্তু তেষ্টা ও ক্ষতিকর রশ্মি দুটোই আটকায়!' },
    { en: 'Let him cook! Clean panels mean maximum power for the base!', bn: 'ধৈর্য ধরো! পরিষ্কার প্যানেল মানেই পুরো ব্যাটারি চার্জ!' },
  ],
};
