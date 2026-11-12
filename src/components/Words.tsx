// Space Words in the text (L2): a word the player has not collected yet is underlined. Tapping it opens a small
// card (a picture and one sentence) and adds it to the Space Book. Collected words go back to plain text.
import { useEffect, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { splitWords, wordById } from '../content/words';
import { useWords } from '../store/words';
import { GameButton } from './GameButton';

/** Plain text with the not-yet-collected Space Words underlined and tappable. */
export function Words({ text }: { text: string }) {
  const collected = useWords((s) => s.collected);
  const show = useWords((s) => s.show);
  const parts = useMemo(() => splitWords(text, new Set(collected)), [text, collected]);
  if (parts.length === 1 && !parts[0].id) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.id ? (
          <button
            key={i}
            type="button"
            onClick={() => show(p.id!)}
            aria-label={`Space word: ${p.text}. Tap to learn it.`}
            className="inline cursor-pointer rounded-[0.25rem] align-baseline font-[inherit] text-inherit underline decoration-go decoration-2 underline-offset-[0.25rem]"
          >
            {p.text}
          </button>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}

/** The word card, once for the whole app. Esc or a tap on Got it closes it. */
export function WordCardHost() {
  const open = useWords((s) => s.open);
  const close = useWords((s) => s.close);
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open, close]);
  const word = open ? wordById(open.id) : undefined;
  if (!open || !word) return null;
  const Icon = word.icon;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-space-deep/70 p-[1rem]" onClick={close} role="presentation">
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`Space word: ${word.word}`}
        onClick={(e) => e.stopPropagation()}
        className="rise relative w-full max-w-[28rem] rounded-panel border-2 border-line bg-panel px-[1rem] pt-[1.5rem] pb-[0.75rem] text-text"
      >
        <span className="absolute -top-[0.875rem] left-[1rem]">
          <span className="inline-flex items-center rounded-full border-2 border-line bg-go px-[0.75rem] py-[0.0625rem] font-display text-[0.9375rem] leading-snug font-extrabold tracking-wide text-go-text uppercase">Space Word</span>
        </span>
        <div className="flex items-center gap-[0.75rem]">
          <span className="grid h-[3.75rem] w-[3.75rem] shrink-0 place-items-center rounded-[1rem] bg-space-deep" aria-hidden>
            <Icon size={34} strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-[1.5rem] leading-tight font-extrabold">{word.word}</h2>
            <p className="text-[1rem] leading-snug">{word.sentence}</p>
          </div>
        </div>
        <p className="mt-[0.25rem] text-[0.8125rem] text-muted">Source: {word.source}</p>
        <div className="mt-[0.375rem] flex items-center justify-between gap-[0.5rem]">
          <span className="flex items-center gap-[0.375rem] font-display text-[0.9375rem] font-bold" role="status">
            <BookOpen size={20} strokeWidth={2.5} aria-hidden />
            {open.isNew ? 'Added to your Space Book!' : 'In your Space Book'}
          </span>
          <GameButton variant="go" onClick={close} className="!min-h-[2.75rem] !px-[1.5rem]">
            Got it
          </GameButton>
        </div>
      </section>
    </div>
  );
}
