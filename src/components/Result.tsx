// The result, shown as pictures (BUILD_SEQUENCE.md §4.1a, R5): the choice's scene stamps in, then the chain
// reaction draws the cost as icons (cause → effect → …), then the meter chips pop. One short line sits under it.
// About 1.5 s in all; with reduced motion everything is simply there.
import type { CSSProperties, ReactNode } from 'react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { pictureFor } from '../content/pictures';
import { tMission } from '../content/i18n';
import type { Outcome } from '../engine/types';
import { ScenePicture } from './Decision';
import { ChangeChip, type Change } from './GameButton';
import { Panel } from './Panel';
import { Words } from './Words';

const STEP = 0.2;
const delay = (i: number) => ({ '--fsx': 0, '--fsy': 0, '--d': '0.35s', '--dl': `${i * STEP}s` }) as unknown as CSSProperties;

const Pop = ({ i, children }: { i: number; children: ReactNode }) => (
  <span className="ev-scale inline-flex" style={delay(i)}>
    {children}
  </span>
);

const Arrow = ({ i }: { i: number }) => (
  <span className="ev-scale inline-flex text-muted" style={delay(i)} aria-hidden>
    <ChevronRight size={22} strokeWidth={3} />
  </span>
);

export function ResultMoment({
  label,
  outcome,
  changes,
  fallback,
  ribbon,
  tone,
}: {
  /** The label of the option (or step) that was chosen. */
  label: string;
  outcome: Outcome;
  changes: Change[];
  /** The icon for a hands-on step, which has no picture of its own. */
  fallback: LucideIcon;
  ribbon: string;
  tone: 'good' | 'danger';
}) {
  const pic = pictureFor(label);
  const chain = pic?.chain ?? [fallback];
  const line = tMission(pic?.line ?? outcome.reasons[0] ?? '');
  const extras = outcome.reasons.slice(1);
  let i = 0;
  return (
    <Panel compact ribbon={ribbon} tone={tone} className="min-h-0 flex-1">
      <div className="flex flex-wrap items-center gap-x-[0.25rem] gap-y-[0.5rem]">
        <span className="anim-stamp inline-flex">
          <ScenePicture scene={pic?.scene ?? [fallback]} size="lg" />
        </span>
        {chain.map((Icon, k) => (
          <span key={k} className="inline-flex items-center gap-[0.25rem]">
            <Arrow i={++i} />
            <Pop i={i}>
              <span className="grid h-[2.5rem] w-[2.5rem] place-items-center rounded-full border-2 border-line bg-panel-up" aria-hidden>
                <Icon size={22} strokeWidth={2.5} />
              </span>
            </Pop>
          </span>
        ))}
        <Arrow i={++i} />
        <span className="flex min-w-0 flex-wrap gap-[0.375rem]">
          {changes.map((c, k) => (
            <Pop key={c.meter} i={i + k}>
              <ChangeChip change={c} />
            </Pop>
          ))}
          {!changes.length ? <span className="text-muted">No meters moved — yet.</span> : null}
        </span>
      </div>
      <p className="mt-[0.5rem] text-[0.9375rem] leading-snug"><Words text={line} /></p>
      {/* Carry-over consequences keep their words for screen readers; the chips above already show what they cost. */}
      {extras.length ? (
        <ul className="sr-only">
          {extras.map((r, k) => (
            <li key={k}>{r}</li>
          ))}
        </ul>
      ) : null}
    </Panel>
  );
}
