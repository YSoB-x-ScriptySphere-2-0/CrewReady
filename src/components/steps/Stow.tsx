// Level 1 — stow the ship. A cutaway of your seat with two cubbies (left zone). Tap an item and it flies into
// a cubby; tap a cubby to send it back to the hold. Each item says what happens next to you and in the hold.
import { useRef, useState } from 'react';
import { Check, Package, Rocket } from 'lucide-react';
import { iconFor } from '../../content/icons';
import { stow } from '../../engine/engine';
import type { GameState, StowStep } from '../../engine/types';
import { GameButton } from '../GameButton';
import { usePress } from '../motion';
import { hop, LeftSlot, ToyArea, type Done } from './shared';
import { useI18n, tMission } from '../../content/i18n';

const itemHtml = '<span style="display:grid;place-items:center;width:40px;height:40px;border:2px solid #3a4a8c;border-radius:12px;background:#1c2b63"></span>';

/** The seat, drawn flat. */
function Seat() {
  return (
    <svg viewBox="0 0 80 110" className="h-[5.5rem] w-[4rem] shrink-0" aria-hidden>
      <rect x="18" y="6" width="44" height="58" rx="12" fill="#5A5F7D" stroke="#3a4a8c" strokeWidth="3" />
      <rect x="26" y="14" width="28" height="12" rx="5" fill="#7d82a3" />
      <rect x="10" y="60" width="60" height="22" rx="9" fill="#5A5F7D" stroke="#3a4a8c" strokeWidth="3" />
      <rect x="22" y="82" width="8" height="22" fill="#3a4a8c" />
      <rect x="50" y="82" width="8" height="22" fill="#3a4a8c" />
      <rect x="12" y="100" width="56" height="7" rx="3" fill="#3a4a8c" />
    </svg>
  );
}

function ItemCard({ label, inReach, inHold, picked, onClick }: { label: string; inReach: string; inHold: string; picked: boolean; onClick: () => void }) {
  const lang = useI18n((s) => s.lang);
  const Icon = iconFor(label);
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={picked}
      {...press}
      className={`toy !mb-[0.3rem] flex h-[calc(100%-0.3rem)] min-h-0 w-full items-center gap-[0.375rem] rounded-tile p-[0.25rem] text-left text-text ${picked ? 'border-[3px] border-go bg-panel-up [--lip:var(--color-go-lip)]' : 'bg-panel'}`}
    >
      <span data-item-icon className="grid h-[2.25rem] w-[2.25rem] shrink-0 place-items-center rounded-[0.625rem] border-2 border-line bg-space" aria-hidden>
        <Icon size={20} strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-[0.8125rem] leading-[1.1] font-extrabold">{tMission(label)}</span>
        <span className={`block text-[0.6875rem] leading-[1.1] ${picked ? 'font-bold' : 'text-muted'}`}>{lang === 'bn' ? `কাছে রাখলে: ${tMission(inReach)}` : `Next to you: ${inReach}.`}</span>
        <span className={`block text-[0.6875rem] leading-[1.1] ${picked ? 'text-muted' : 'font-bold'}`}>{lang === 'bn' ? `হোল্ডে রাখলে: ${tMission(inHold)}` : `In the hold: ${inHold}.`}</span>
      </span>
      {picked ? (
        <span className="grid h-[1.5rem] w-[1.5rem] shrink-0 place-items-center rounded-full bg-go text-go-text" aria-hidden>
          <Check size={16} strokeWidth={3.5} />
        </span>
      ) : null}
    </button>
  );
}

export function Stow({ step, game, onDone, slot }: { step: StowStep; game: GameState; onDone: Done; slot?: HTMLElement | null }) {
  const lang = useI18n((s) => s.lang);
  // cubbies[k] holds an item flag or null.
  const [cubbies, setCubbies] = useState<(string | null)[]>(() => Array.from({ length: step.pick }, () => null));
  const [landedAt, setLandedAt] = useState(-1);
  const [nudge, setNudge] = useState(0);
  const cubbyRefs = useRef<(HTMLElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const full = cubbies.every(Boolean);
  const picked = cubbies.filter((c): c is string => !!c);

  const toggle = (flag: string) => {
    const at = cubbies.indexOf(flag);
    if (at >= 0) return empty(at);
    const free = cubbies.indexOf(null);
    if (free < 0) return setNudge((n) => n + 1); // both full: the cubbies wiggle
    const src = list.current?.querySelector(`[data-flag="${flag}"] [data-item-icon]`);
    hop(src, cubbyRefs.current[free], itemHtml);
    setCubbies(cubbies.map((c, k) => (k === free ? flag : c)));
    setLandedAt(free);
  };
  const empty = (k: number) => {
    const flag = cubbies[k];
    if (!flag) return;
    hop(cubbyRefs.current[k], list.current?.querySelector(`[data-flag="${flag}"] [data-item-icon]`), itemHtml);
    setCubbies(cubbies.map((c, j) => (j === k ? null : c)));
    setLandedAt(-1);
  };

  const cubby = (k: number) => {
    const flag = cubbies[k];
    const item = step.items.find((it) => it.flag === flag);
    const Icon = item ? iconFor(item.label) : Package;
    return (
      <ToyArea
        key={`${k}-${nudge}`}
        onClick={() => empty(k)}
        disabled={!item}
        label={item ? (lang === 'bn' ? `খাঁপ ${k + 1}: ${tMission(item.label)}। ফেরত পাঠাতে ট্যাপ করো।` : `Cubby ${k + 1}: ${item.label}. Tap to send it back to the hold.`) : (lang === 'bn' ? `খাঁপ ${k + 1}: খালি` : `Cubby ${k + 1}: empty`)}
        className={`grid h-[4rem] w-[4rem] shrink-0 place-items-center !bg-space-deep disabled:!bg-space-deep ${nudge && full ? 'anim-wiggle' : ''}`}
      >
        <span ref={(el) => void (cubbyRefs.current[k] = el)} className="grid place-items-center">
          {item ? (
            <span className={`grid h-[2.75rem] w-[2.75rem] place-items-center rounded-[0.625rem] border-2 border-line bg-panel-up ${landedAt === k ? 'anim-land' : ''}`} aria-hidden>
              <Icon size={24} strokeWidth={2.25} />
            </span>
          ) : (
            <span className="h-[2.75rem] w-[2.75rem] rounded-[0.625rem] border-2 border-dashed border-text/40" aria-hidden />
          )}
        </span>
      </ToyArea>
    );
  };

  const half = Math.ceil(step.pick / 2);
  return (
    <>
      <LeftSlot slot={slot}>
        {/* Cutaway: cubby, seat, cubby. */}
        <div className="flex h-full w-full flex-col items-center justify-center rounded-panel border-2 border-line bg-panel/85 px-[0.5rem] py-[0.5rem] text-text">
          <p className="text-center font-display text-[0.9375rem] leading-tight font-extrabold">{lang === 'bn' ? 'তোমার আসনের পাশে' : 'Next to your seat'}</p>
          <div className="mt-[0.25rem] flex items-end justify-center gap-[0.25rem]">
            {cubbies.slice(0, half).map((_, k) => cubby(k))}
            <Seat />
            {cubbies.slice(half).map((_, k) => cubby(k + half))}
          </div>
        </div>
      </LeftSlot>

      <div className="flex h-full min-h-0 flex-col gap-[0.5rem]">
        <div ref={list} className="grid min-h-0 flex-1 grid-cols-2 gap-x-[0.5rem] gap-y-[0.125rem]">
          {step.items.map((it) => (
            <div key={it.flag} data-flag={it.flag} className="min-h-0">
              <ItemCard {...it} picked={picked.includes(it.flag)} onClick={() => toggle(it.flag)} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-[0.5rem]">
          <p className="min-w-0 font-display text-[0.8125rem] sm:text-[0.9375rem] leading-tight font-extrabold" aria-live="polite">
            {full
              ? (lang === 'bn' ? 'দুটো খাঁপাই পূর্ণ। বদলাতে ট্যাপ করো।' : 'Both cubbies full. Tap one to empty it.')
              : (lang === 'bn' ? `আরও ${step.pick - picked.length}টি বেছে নাও।` : `Tap ${step.pick - picked.length} more.`)}
          </p>
          <GameButton
            variant="go"
            icon={Rocket}
            disabled={!full}
            onClick={() => onDone(stow(game, step, picked))}
            className="!min-h-[2.875rem] !px-3 sm:!px-4 !text-xs sm:!text-sm leading-snug break-words max-w-[14rem]"
          >
            {lang === 'bn'
              ? `উড্ডয়নের প্রস্তুতি (${picked.length}/${step.pick})`
              : `Ready for launch (${picked.length}/${step.pick})`}
          </GameButton>
        </div>
      </div>
    </>
  );
}
