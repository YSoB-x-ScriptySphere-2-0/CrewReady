// The level-complete reward: a supply crate drops in, bounces, the lid flips open and the badge pops out.
// 1.6 s, then it's done (`onDone`). With reduced motion the badge is simply shown. BUILD_SEQUENCE.md §4.4.
// Sized in em: set the font size on `className` to scale the whole crate (default 1rem = 16 px at 375 tall).
import { useEffect, type ReactNode } from 'react';
import { reducedMotion } from './motion';

export function RewardCrate({ children, label, onDone, className = '' }: { children: ReactNode; label: string; onDone?: () => void; className?: string }) {
  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, reducedMotion() ? 0 : 1600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className={`relative mx-auto flex h-[16.875em] w-[13.75em] shrink-0 items-end justify-center text-[1rem] ${className}`} role="img" aria-label={label}>
      {/* the badge rises out of the crate */}
      <div className="crate-badge anim-badge-out absolute top-0 left-1/2 z-10">{children}</div>
      <div className="anim-crate-drop relative">
        {/* lid, hinged on the left */}
        <div className="crate-lid anim-lid-open absolute -top-[1.625em] -left-[0.5em] h-[1.875em] w-[11em] rounded-[0.625em] border-2 border-lip bg-crate" aria-hidden>
          <div className="mx-auto mt-[0.375em] h-[0.375em] w-[60%] rounded-full bg-crate-lip/60" />
        </div>
        <div className="relative h-[7.375em] w-[10em] overflow-hidden rounded-[0.875em] border-2 border-lip bg-crate shadow-[0_0.375em_0_var(--color-crate-lip)]" aria-hidden>
          <div className="absolute inset-x-0 top-[2.375em] h-[0.1875em] bg-crate-lip/70" />
          <div className="absolute inset-x-0 top-[4.75em] h-[0.1875em] bg-crate-lip/70" />
          <div className="absolute inset-y-0 left-[1.375em] w-[0.1875em] bg-crate-lip/70" />
          <div className="absolute inset-y-0 right-[1.375em] w-[0.1875em] bg-crate-lip/70" />
          <svg viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 h-[3em] w-[3em] -translate-x-1/2 -translate-y-1/2">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" fill="var(--color-star)" stroke="var(--color-crate-lip)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** A round prize badge (level badge or Outpost result) to put inside the crate. Sized in em, like the crate. */
export function PrizeBadge({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-[6.5em] w-[6.5em] place-items-center rounded-full border-2 border-lip bg-star text-go-text shadow-[0_0.3em_0_var(--color-crate-lip)]">
        <div className="grid h-[5em] w-[5em] place-items-center rounded-full border-2 border-line bg-panel text-text">{children}</div>
      </div>
      {sub ? (
        <span className="-mt-[0.75em] rounded-full border-2 border-go-lip bg-go px-[0.75em] font-display text-[1.125em] leading-snug font-extrabold whitespace-nowrap text-go-text">{sub}</span>
      ) : null}
    </div>
  );
}
