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
      en: 'A Martian day (Sol) gives you about 40 extra minutes compared to Earth!',
      bn: 'মঙ্গলের দিন পৃথিবীর চেয়ে প্রায় ৪০ মিনিট দীর্ঘ হয়!',
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
      en: 'Keep those solar panels spotless to power up every station module!',
      bn: 'প্যানেল পরিষ্কার রাখলে স্টেশনের প্রতিটি মডিউলে পুরো শক্তি পাওয়া যাবে!',
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
      en: 'Water shields work like magic to block harmful space rays!',
      bn: 'পানি দিয়ে তৈরি ঢাল মহাকাশের ক্ষতিকর রশ্মি অত্যন্ত কার্যকরভাবে আটকে দেয়!',
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
      en: 'MOXIE is a true breakthrough—making breathable oxygen right from thin Martian air!',
      bn: 'মক্সি যন্ত্র এক অপার বিস্ময়—মঙ্গলের পাতলা বাতাস থেকে মানুষের জন্য তাজা অক্সিজেন তৈরি করে!',
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
      en: 'Filtering 98% of water lets a crew journey millions of miles safely!',
      bn: '৯৮% পানি ফিল্টার করে মহাকাশচারীরা নিরাপদে কোটি মাইল পথ পাড়ি দিতে পারেন!',
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
      en: 'Fresh green plants boost crew nutrition and bring a little piece of Earth to space!',
      bn: 'তাজা শাকসবজি মহাকাশচারীদের প্রয়োজনীয় পুষ্টি দেয় এবং মনোবল চাঙা রাখে!',
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
      en: 'Earth and Mars align every 26 months, creating the shortest and fastest path!',
      bn: 'প্রতি ২৬ মাসে পৃথিবী ও মঙ্গল সবচেয়ে কাছে আসে, যা যাওয়ার সবচেয়ে দ্রুত পথ!',
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
      en: 'A Kp 9 reading means a super huge Sun storm—keep shields ready!',
      bn: 'কেপি ৯ মানে অত্যন্ত শক্তিশালী সৌর ঝড়—সর্বোচ্চ সুরক্ষা নেওয়া জরুরি!',
    },
  },
];

export const getExplainEntry = (id: string): ExplainEntry | undefined =>
  EXPLAIN_ENTRIES.find((e) => e.id === id);

// Inspiring Space Dialogue Generator for Twinkle
export const TWINKLE_GEN_ALPHA = {
  victory: [
    { en: 'Outstanding work! That was a stellar decision, Cadet!', bn: 'অসাধারণ কাজ! সত্যিই এক চমৎকার সিদ্ধান্ত, ক্যাডেট!' },
    { en: 'Fantastic flying! Our Mars crew is safe and sound!', bn: 'দুর্দান্ত সাফল্য! আমাদের মঙ্গল ক্রুরা এখন পুরোপুরি নিরাপদ!' },
    { en: 'You have true astronaut instinct! Mission control salutes you!', bn: 'তোমার মধ্যে রয়েছে সত্যিকারের নভোচারীর মেধা! মিশন কন্ট্রোল গর্বিত!' },
  ],
  danger: [
    { en: 'Caution cadet! Oxygen levels are dipping—let us act quickly!', bn: 'সাবধান ক্যাডেট! অক্সিজেন কমে যাচ্ছে—চলো দ্রুত ব্যবস্থা নিই!' },
    { en: 'Solar flare detected! Divert all available power to shields!', bn: 'সৌর ঝড়ের সংকেত! দ্রুত সব শক্তি সুরক্ষামূলক ঢালে দাও!' },
    { en: 'Dust alert! The Martian storm is blocking sunlight from the panels!', bn: 'ধুলোঝড়ের সংকেত! ধুলোয় সৌর প্যানেলে রোদ পৌঁছানো বাধা পাচ্ছে!' },
  ],
  hint: [
    { en: 'Commander tip: Water is great to drink and also blocks space radiation!', bn: 'কমান্ডার টিপ: পানি যেমন তৃষ্ণা মেটায়, তেমনই ক্ষতিকর রশ্মিও প্রতিহত করে!' },
    { en: 'Pro tip: Clean panels keep batteries charged and oxygen flowing!', bn: 'টিপ: পরিষ্কার প্যানেল মানেই লাইফ সাপোর্টের জন্য নিরবচ্ছিন্ন বিদ্যুৎ!' },
  ],
};
