// The level-complete reward: a supply crate drops in, bounces, the lid flips open and the badge pops out.
// 1.6 s, then it's done (`onDone`). With reduced motion the badge is simply shown. BUILD_SEQUENCE.md §4.4.
import { useEffect, type ReactNode } from 'react';
import { reducedMotion } from './motion';

export function RewardCrate({ children, label, onDone }: { children: ReactNode; label: string; onDone?: () => void }) {
  useEffect(() => {
    if (!onDone) return;
    const t = setTimeout(onDone, reducedMotion() ? 0 : 1600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="relative mx-auto flex h-[270px] w-[220px] items-end justify-center" role="img" aria-label={label}>
      {/* the badge rises out of the crate */}
      <div className="crate-badge anim-badge-out absolute top-0 left-1/2 z-10">{children}</div>
      <div className="anim-crate-drop relative">
        {/* lid, hinged on the left */}
        <div className="crate-lid anim-lid-open absolute -top-[26px] -left-[8px] h-[30px] w-[176px] rounded-[10px] border-[3px] border-ink bg-crate" aria-hidden>
          <div className="mx-auto mt-[6px] h-[6px] w-[60%] rounded-full bg-crate-lip/60" />
        </div>
        <div className="relative h-[118px] w-[160px] overflow-hidden rounded-[14px] border-[3px] border-ink bg-crate shadow-[0_6px_0_var(--color-crate-lip),0_6px_0_3px_var(--color-ink)]" aria-hidden>
          <div className="absolute inset-x-0 top-[38px] h-[3px] bg-ink/45" />
          <div className="absolute inset-x-0 top-[76px] h-[3px] bg-ink/45" />
          <div className="absolute inset-y-0 left-[22px] w-[3px] bg-ink/45" />
          <div className="absolute inset-y-0 right-[22px] w-[3px] bg-ink/45" />
          <svg viewBox="0 0 24 24" className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5-4.9-4.6 6.6-.8z" fill="var(--color-star)" stroke="var(--color-ink)" strokeWidth="2" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** A round prize badge (level badge or Outpost result) to put inside the crate. */
export function PrizeBadge({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-[104px] w-[104px] place-items-center rounded-full border-[3px] border-ink bg-star text-ink shadow-[0_5px_0_var(--color-ink)]">
        <div className="grid h-[80px] w-[80px] place-items-center rounded-full border-[3px] border-ink bg-paper">{children}</div>
      </div>
      {sub ? (
        <span className="-mt-3 rounded-full border-[3px] border-ink bg-go px-3 font-display text-lg leading-snug font-extrabold whitespace-nowrap text-white">{sub}</span>
      ) : null}
    </div>
  );
}
