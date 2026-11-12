// Full-width striped banner for storms, alarms and Mission Replay. It slams in from the side and the
// scene shakes once (400 ms). With reduced motion it is simply there. BUILD_SEQUENCE.md §4.4.
import { useEffect, useRef } from 'react';
import { TriangleAlert, type LucideIcon } from 'lucide-react';
import { shakeScene } from './motion';

export function AlarmBanner({
  title,
  sub,
  icon: Icon = TriangleAlert,
  shake = true,
}: {
  title: string;
  sub?: string;
  icon?: LucideIcon;
  shake?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => shakeScene(ref.current), 330); // as it lands
    return () => clearTimeout(t);
  }, [shake]);
  return (
    <div ref={ref} role="alert" className="anim-slam relative w-full border-y-[3px] border-ink bg-danger text-white shadow-[0_6px_0_var(--color-ink)]">
      <div className="hazard h-3 border-b-[3px] border-ink" aria-hidden />
      <div className="flex items-center justify-center gap-3 px-4 py-2.5">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-paper text-danger" aria-hidden>
          <Icon size={26} strokeWidth={2.75} />
        </span>
        <div className="min-w-0 text-center">
          <p className="font-display text-[28px] leading-none font-extrabold tracking-wide uppercase sm:text-[38px]">{title}</p>
          {sub ? <p className="mt-1 font-display text-lg leading-tight font-bold sm:text-xl">{sub}</p> : null}
        </div>
      </div>
      <div className="hazard h-3 border-t-[3px] border-ink" aria-hidden />
    </div>
  );
}
