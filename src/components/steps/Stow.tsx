// Level 1 — stow the ship. A cutaway of your seat with two cubbies. Tap an item and it flies into a cubby;
// tap a cubby to send it back to the hold. Each item says what happens next to you and in the hold.
import { useRef, useState } from 'react';
import { Check, Package, Rocket } from 'lucide-react';
import { iconFor } from '../../content/icons';
import { stow } from '../../engine/engine';
import type { GameState, StowStep } from '../../engine/types';
import { GameButton } from '../GameButton';
import { usePress } from '../motion';
import { hop, ToyArea, type Done } from './shared';

const itemHtml = '<span style="display:grid;place-items:center;width:44px;height:44px;border:3px solid #1B1F3B;border-radius:12px;background:#E9DFCC"></span>';

/** The seat, drawn flat. */
function Seat() {
  return (
    <svg viewBox="0 0 80 110" className="h-[110px] w-[80px] shrink-0" aria-hidden>
      <rect x="18" y="6" width="44" height="58" rx="12" fill="#5A5F7D" stroke="#1B1F3B" strokeWidth="3" />
      <rect x="26" y="14" width="28" height="12" rx="5" fill="#7d82a3" />
      <rect x="10" y="60" width="60" height="22" rx="9" fill="#5A5F7D" stroke="#1B1F3B" strokeWidth="3" />
      <rect x="22" y="82" width="8" height="22" fill="#1B1F3B" />
      <rect x="50" y="82" width="8" height="22" fill="#1B1F3B" />
      <rect x="12" y="100" width="56" height="7" rx="3" fill="#1B1F3B" />
    </svg>
  );
}

function ItemCard({ label, inReach, inHold, picked, onClick }: { label: string; inReach: string; inHold: string; picked: boolean; onClick: () => void }) {
  const Icon = iconFor(label);
  const press = usePress();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={picked}
      {...press}
      className={`toy flex w-full items-start gap-3 rounded-tile p-3 text-left text-ink ${picked ? 'bg-[#ffe3ec] [--lip:#e9a3bb]' : 'bg-white'}`}
    >
      <span data-item-icon className={`grid h-12 w-12 shrink-0 place-items-center rounded-[12px] border-[3px] border-ink ${picked ? 'bg-white' : 'bg-edge'}`} aria-hidden>
        <Icon size={26} strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-xl leading-tight font-extrabold">{label}</span>
        <span className={`mt-1 block text-base leading-snug ${picked ? 'font-bold text-ink' : 'text-muted'}`}>Next to you: {inReach}.</span>
        <span className={`block text-base leading-snug ${picked ? 'text-muted' : 'font-bold text-ink'}`}>In the hold: {inHold}.</span>
      </span>
      {picked ? (
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-go text-white" aria-hidden>
          <Check size={20} strokeWidth={3.5} />
        </span>
      ) : null}
    </button>
  );
}

export function Stow({ step, game, onDone }: { step: StowStep; game: GameState; onDone: Done }) {
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
        label={item ? `Cubby ${k + 1}: ${item.label}. Tap to send it back to the hold.` : `Cubby ${k + 1}: empty`}
        className={`grid h-[92px] w-[92px] shrink-0 place-items-center !bg-[#3a3f63] disabled:!bg-[#3a3f63] ${nudge && full ? 'anim-wiggle' : ''}`}
      >
        <span ref={(el) => void (cubbyRefs.current[k] = el)} className="grid place-items-center">
          {item ? (
            <span className={`grid h-14 w-14 place-items-center rounded-[12px] border-[3px] border-ink bg-edge ${landedAt === k ? 'anim-land' : ''}`} aria-hidden>
              <Icon size={30} strokeWidth={2.25} />
            </span>
          ) : (
            <span className="h-14 w-14 rounded-[12px] border-[3px] border-dashed border-paper/50" aria-hidden />
          )}
        </span>
      </ToyArea>
    );
  };

  return (
    <div>
      {/* Cutaway: cubby, seat, cubby. */}
      <div className="rounded-panel border-[3px] border-ink bg-[#262a4d] px-3 pt-3 pb-1 text-paper shadow-panel">
        <p className="text-center font-display text-lg leading-tight font-extrabold">Next to your seat</p>
        <div className="mt-2 flex items-end justify-center gap-2 sm:gap-5">
          {cubbies.slice(0, Math.ceil(step.pick / 2)).map((_, k) => cubby(k))}
          <Seat />
          {cubbies.slice(Math.ceil(step.pick / 2)).map((_, k) => cubby(k + Math.ceil(step.pick / 2)))}
        </div>
      </div>

      <p className="mt-4 font-display text-lg font-extrabold" aria-live="polite">
        {full ? 'Both cubbies full. Tap one to empty it.' : `The hold: tap ${step.pick - picked.length} more.`}
      </p>
      <div ref={list} className="mt-2 grid gap-x-3 gap-y-1 sm:grid-cols-2">
        {step.items.map((it) => (
          <div key={it.flag} data-flag={it.flag}>
            <ItemCard {...it} picked={picked.includes(it.flag)} onClick={() => toggle(it.flag)} />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <GameButton variant="go" icon={Rocket} disabled={!full} onClick={() => onDone(stow(game, step, picked))}>
          Ready for launch ({picked.length}/{step.pick})
        </GameButton>
      </div>
    </div>
  );
}
