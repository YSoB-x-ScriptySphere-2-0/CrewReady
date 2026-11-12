// L2: Space Words come only from the plan or docs/06, and the text matcher finds them.
import { describe, expect, it } from 'vitest';
import images from '../../public/data/images.json?raw';
import facts from '../../docs/06_SCIENCE_AND_NASA_DATA.md?raw';
import plan from '../../plan.md?raw';
import { SPACE_WORDS, idForMatch, splitWords } from './words';

const norm = (s: string) => s.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ');
const sources = norm(plan + facts + images);

describe('Space Words', () => {
  it('there are at most 12', () => expect(SPACE_WORDS.length).toBeLessThanOrEqual(12));
  it('every sentence appears word for word in the plan, docs/06 or the saved NASA image text', () => {
    for (const w of SPACE_WORDS) expect(sources, w.word).toContain(norm(w.sentence).replace(/\.$/, ''));
  });
  it('one sentence each, with an icon and a source', () => {
    for (const w of SPACE_WORDS) {
      expect(w.sentence.split(/(?<=[.!?])\s+/).length, w.word).toBe(1);
      expect(w.icon, w.word).toBeTruthy();
      expect(w.source, w.word).not.toBe('');
    }
  });
  it('ids are unique', () => expect(new Set(SPACE_WORDS.map((w) => w.id)).size).toBe(SPACE_WORDS.length));
});

describe('finding words in text', () => {
  it('underlines each word, plural or not, any case', () => {
    const parts = splitWords('Solar panels need sunlight. A SOL is a day. Radiation!');
    expect(parts.filter((p) => p.id).map((p) => p.id)).toEqual(['solar-panel', 'sol', 'radiation']);
    expect(parts.map((p) => p.text).join('')).toBe('Solar panels need sunlight. A SOL is a day. Radiation!');
  });
  it('a collected word stays plain', () => {
    expect(splitWords('A sol is a day.', new Set(['sol'])).some((p) => p.id)).toBe(false);
  });
  it('does not catch part of another word', () => {
    expect(splitWords('Solo, solid, solution, skp').some((p) => p.id)).toBe(false);
  });
  it('knows which word a match belongs to', () => {
    expect(idForMatch('Dust storms')).toBe('dust-storm');
    expect(idForMatch('launch window')).toBe('launch-window');
  });
});
