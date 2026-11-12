// Space Words (BUILD_SEQUENCE.md L2, plan §5.4): a hard word, a picture and ONE sentence, each taken word for word
// from plan.md or docs/06 §4 (the fact sheet). A word with no sourced sentence is left out, not invented.
//   Left out for that reason: regolith (no definition; the soil idea is only in a "Confirm" row of §4).
// `match` lists what to underline in game text (matched whole-word, any case).
import { Cloud, Gauge, FlaskConical, Radiation, Recycle, Rocket, SolarPanel, Sprout, Sunrise, Wind, type LucideIcon } from 'lucide-react';

export interface SpaceWord {
  id: string;
  word: string;
  match: string[];
  icon: LucideIcon;
  /** One sentence, from the source below. */
  sentence: string;
  /** Where the sentence comes from. */
  source: string;
}

export const SPACE_WORDS: SpaceWord[] = [
  { id: 'sol', word: 'Sol', match: ['sols?'], icon: Sunrise, sentence: 'One Mars day, called a sol, is about 24 hours and 40 minutes.', source: 'NASA Mars facts' },
  {
    id: 'launch-window',
    word: 'Launch window',
    match: ['launch windows?'],
    icon: Rocket,
    sentence: 'Rockets can go to Mars only about once every 26 months.',
    source: 'NASA Mars mission pages',
  },
  {
    id: 'radiation',
    word: 'Radiation',
    match: ['radiation'],
    icon: Radiation,
    sentence: 'In a Sun storm, astronauts hide behind bags of food and water.',
    source: 'NASA Orion storm-shelter pages',
  },
  {
    id: 'solar-panel',
    word: 'Solar panel',
    match: ['solar panels?'],
    icon: SolarPanel,
    sentence: 'Solar power depends on a clear panel and a clear sky.',
    source: 'NASA Opportunity and InSight missions',
  },
  {
    id: 'recycler',
    word: 'Recycler',
    match: ['recyclers?'],
    icon: Recycle,
    sentence: 'The recycler can turn used water back into clean water.',
    source: 'NASA ISS life support',
  },
  {
    id: 'carbon-dioxide',
    word: 'Carbon dioxide',
    match: ['carbon dioxide'],
    icon: Cloud,
    sentence: 'Mars air is mostly carbon dioxide and very thin.',
    source: 'NASA Mars facts',
  },
  {
    id: 'dust-storm',
    word: 'Dust storm',
    match: ['dust storms?'],
    icon: Wind,
    sentence: 'In 2018 a dust storm covered all of Mars.',
    source: 'NASA Opportunity mission pages',
  },
  {
    id: 'moxie',
    word: 'MOXIE',
    match: ['moxie'],
    icon: FlaskConical,
    sentence: 'MOXIE on Perseverance made 122 grams of oxygen from Mars air.',
    source: 'NASA MOXIE release',
  },
  {
    id: 'kp',
    word: 'Kp',
    match: ['kp'],
    icon: Gauge,
    sentence: 'Sun storms have 5 levels, from G1 (small) to G5 (extreme).',
    source: 'NOAA space weather scales',
  },
  {
    id: 'veggie',
    word: 'Veggie',
    match: ['veggie'],
    icon: Sprout,
    sentence: 'Astronauts sample red romaine lettuce grown inside the Veggie facility aboard the ISS.',
    source: 'NASA Image Library · NASA Veggie pages',
  },
];

export const wordById = (id: string) => SPACE_WORDS.find((w) => w.id === id);

/** One regex over every `match`, longest first, so "solar panels" wins over a shorter hit. */
const ALL = new RegExp(
  `\\b(${SPACE_WORDS.flatMap((w) => w.match)
    .sort((a, b) => b.length - a.length)
    .join('|')})\\b`,
  'gi',
);

/** Which word a piece of matched text belongs to. */
export function idForMatch(text: string): string | undefined {
  return SPACE_WORDS.find((w) => w.match.some((m) => new RegExp(`^(${m})$`, 'i').test(text)))?.id;
}

/** Splits text into plain runs and word hits, in order. Words in `skip` (already collected) stay plain. */
export function splitWords(text: string, skip: ReadonlySet<string> = new Set()): { text: string; id?: string }[] {
  const out: { text: string; id?: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(ALL)) {
    const id = idForMatch(m[0]);
    if (!id || skip.has(id)) continue;
    if (m.index! > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], id });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
