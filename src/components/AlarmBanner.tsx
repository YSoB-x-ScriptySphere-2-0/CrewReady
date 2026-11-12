// Full-width striped banner for storms, alarms and Mission Replay. It slams in from the side and the
// scene shakes once (400 ms). With reduced motion it is simply there. BUILD_SEQUENCE.md §4.4.
// Sized in rem so it scales with the stage; one slim row in landscape (R4).
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
    <div ref={ref} role="alert" className="anim-slam relative w-full border-y-2 border-line bg-danger text-white shadow-[0_0.3rem_0_var(--color-lip)]">
      <div className="hazard h-[0.5rem]" aria-hidden />
      <div className="flex items-center justify-center gap-[0.75rem] px-[1rem] py-[0.25rem]">
        <span className="grid h-[2.25rem] w-[2.25rem] shrink-0 place-items-center rounded-full bg-space-deep text-white" aria-hidden>
          <Icon size={22} strokeWidth={2.75} />
        </span>
        <p className="min-w-0 font-display text-[1.625rem] leading-none font-extrabold tracking-wide uppercase">{title}</p>
        {sub ? <p className="min-w-0 font-display text-[1.125rem] leading-tight font-bold">· {sub}</p> : null}
      </div>
      <div className="hazard h-[0.5rem]" aria-hidden />
    </div>
  );
}
