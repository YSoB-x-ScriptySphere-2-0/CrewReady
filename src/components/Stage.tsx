// The landscape frame around the whole app (BUILD_SEQUENCE.md §4.2).
// Sideways phone, tablet, laptop: it fills the window. Upright phone: the same stage is drawn a
// quarter-turn, with a 2-second "Turn your phone" hint from Twinkle. Nothing blocks the game.
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { setStageTurned, stageGeometry, type StageGeometry } from './stageMath';

const read = (): StageGeometry => {
  const v = window.visualViewport;
  return stageGeometry(v?.width ?? window.innerWidth, v?.height ?? window.innerHeight);
};

function useStageGeometry(): StageGeometry {
  const [g, setG] = useState<StageGeometry>(read);
  useLayoutEffect(() => {
    const on = () => setG(read());
    on();
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    window.visualViewport?.addEventListener('resize', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
      window.visualViewport?.removeEventListener('resize', on);
    };
  }, []);
  // Everything is sized in rem, so the root size is what scales the stage.
  useLayoutEffect(() => {
    document.documentElement.style.fontSize = `${g.rootPx}px`;
    setStageTurned(g.turned);
  }, [g.rootPx, g.turned]);
  return g;
}

/** Twinkle's hint, shown for 2 seconds each time the phone is upright. */
function TurnHint({ show }: { show: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!show) return setOn(false);
    setOn(true);
    const t = setTimeout(() => setOn(false), 2000);
    return () => clearTimeout(t);
  }, [show]);
  if (!on) return null;
  return (
    <div
      role="status"
      className="pointer-events-none absolute bottom-[1rem] left-1/2 z-[70] flex -translate-x-1/2 items-center gap-[0.75rem] rounded-full border-2 border-line bg-panel/85 py-[0.25rem] pr-[1.25rem] pl-[0.5rem] text-text"
    >
      <img src="/art/twinkle-question.webp" alt="" className="h-[3rem] w-[3rem] object-contain" />
      <span className="font-display text-[1.125rem] leading-none font-extrabold whitespace-nowrap">Turn your phone</span>
    </div>
  );
}

export function Stage({ children }: { children: ReactNode }) {
  const g = useStageGeometry();
  return (
    <div className="fixed inset-0 overflow-hidden bg-space-deep">
      <div
        data-stage
        data-turned={g.turned}
        className="absolute overflow-hidden bg-space text-text"
        style={{
          width: g.w,
          height: g.h,
          left: '50%',
          top: '50%',
          marginLeft: -g.w / 2,
          marginTop: -g.h / 2,
          transform: g.turned ? 'rotate(90deg)' : undefined,
          ['--stage-h' as string]: `${g.h}px`,
        }}
      >
        {/* Old screens still scroll here until R3-R4 fit them to the three zones. */}
        <div className="h-full w-full overflow-x-hidden overflow-y-auto">{children}</div>
        <TurnHint show={g.turned} />
      </div>
    </div>
  );
}
