// The responsive stage around the whole app (BUILD_SEQUENCE.md §4.2).
// Supports both mobile portrait and desktop widescreen seamlessly without forced 90-degree rotation.
import { useLayoutEffect, useState, type ReactNode } from 'react';
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

  // Allow natural CSS reflow and standard browser zoom without forcing an artificial root font size.
  useLayoutEffect(() => {
    document.documentElement.style.fontSize = '';
    setStageTurned(false); // Native responsive layout without forced rotation
  }, []);
  return g;
}

export function Stage({ children }: { children: ReactNode }) {
  useStageGeometry();
  return (
    <div className="fixed inset-0 overflow-hidden bg-space-deep select-none">
      <div
        data-stage
        className="relative h-full w-full overflow-hidden bg-space text-text flex flex-col"
        style={{
          ['--stage-h' as string]: '100%',
        }}
      >
        <div className="min-h-full w-full overflow-x-hidden overflow-y-auto flex flex-col">{children}</div>
      </div>
    </div>
  );
}
