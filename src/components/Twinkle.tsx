// The crew: Twinkle the robot guide, and the two kid astronauts Orbit and Nova.
// Art is cut from the team's pose sheets (ui reference/characters cutout) into public/art/.
// Characters appear only on the hook, story cards, Home, hints, Mission Replay and success.
import { useEffect, useState, type ReactNode } from 'react';
import { Square, Volume2 } from 'lucide-react';
import { useI18n } from '../content/i18n';
import { speak, stopSpeaking, useCanSpeak } from './speech';
import { Words } from './Words';

export type TwinkleMood = 'happy' | 'neutral' | 'question' | 'worried' | 'stars' | 'surprised' | 'sad' | 'tablet' | 'wink' | 'hearts' | 'squint' | 'sleepy';
export type KidPose = 'stand' | 'wave' | 'arms' | 'cheer' | 'tablet' | 'think' | 'point';
export type OrbitPose = KidPose | 'run' | 'surprised' | 'thumbs';
export type NovaPose = KidPose | 'helmet';

const art = (name: string) => `${import.meta.env.BASE_URL}art/${name}.webp`;

const TWINKLE_ALT: Record<TwinkleMood, string> = {
  happy: 'Twinkle the robot, smiling',
  neutral: 'Twinkle the robot',
  question: 'Twinkle the robot, thinking',
  worried: 'Twinkle the robot, looking worried',
  stars: 'Twinkle the robot, with star eyes',
  surprised: 'Twinkle the robot, alarmed',
  sad: 'Twinkle the robot, looking sad',
  tablet: 'Twinkle the robot, holding a data screen',
  wink: 'Twinkle the robot, winking',
  hearts: 'Twinkle the robot, with heart eyes',
  squint: 'Twinkle the robot, laughing',
  sleepy: 'Twinkle the robot, asleep',
};

export function Twinkle({ mood = 'happy', size = 72 }: { mood?: TwinkleMood; size?: number }) {
  return <img src={art(`twinkle-${mood}`)} alt={TWINKLE_ALT[mood]} style={{ height: size }} className="w-auto shrink-0 select-none" draggable={false} decoding="async" />;
}

/**
 * Orbit or Nova, standing at a given height. Decorative unless `label` is set.
 * Changing `pose` makes the kid pop into the new pose once (a reaction); `bob` bobs once on open.
 */
export function Kid({
  who,
  pose,
  height,
  label,
  className = '',
  bob,
}: {
  who: 'orbit' | 'nova';
  pose: OrbitPose | NovaPose;
  height: number | string;
  label?: string;
  className?: string;
  bob?: boolean;
}) {
  return (
    <img
      key={pose}
      src={art(`${who}-${pose}`)}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      style={{ height }}
      className={`w-auto shrink-0 select-none ${bob ? 'anim-bob' : 'anim-pop-in'} ${className}`}
      draggable={false}
      decoding="async"
    />
  );
}

export type Reaction = 'choosing' | 'good' | 'small-loss' | 'big-loss';

/** How the player's kid reacts (§4.5). Nova has no "surprised" pose on the sheet, so she thinks it over. */
export function kidPose(who: 'orbit' | 'nova', r: Reaction): OrbitPose | NovaPose {
  if (r === 'choosing') return 'think';
  if (r === 'good') return who === 'orbit' ? 'thumbs' : 'cheer';
  if (r === 'big-loss') return who === 'orbit' ? 'surprised' : 'think';
  return 'stand';
}
/** Twinkle's face for the same moments. */
export const TWINKLE_FOR: Record<Reaction, TwinkleMood> = { choosing: 'question', good: 'happy', 'small-loss': 'neutral', 'big-loss': 'surprised' };

/** A total change of 15 or more down counts as a big loss. */
export function reactionFor(totalChange: number): Reaction {
  if (totalChange >= 0) return 'good';
  return totalChange <= -15 ? 'big-loss' : 'small-loss';
}

/**
 * A speech bubble from Twinkle (or from `speaker`, e.g. the player's kid). Twinkle pops in with a little bounce
 * and the bubble grows from Twinkle (250 ms). Changing `mood` replays it.
 */
export function TwinkleSays({ children, mood = 'happy', size = 72, speaker }: { children: ReactNode; mood?: TwinkleMood; size?: number; speaker?: ReactNode }) {
  return (
    <div className="flex items-end gap-[0.5rem]" key={mood}>
      <span className="anim-pop-in shrink-0">{speaker ?? <Twinkle mood={mood} size={size} />}</span>
      <Bubble className="mb-[0.75rem]">{children}</Bubble>
    </div>
  );
}

/** A speech bubble with a tail on its left. Dark panel and thin line, never paper (§4.3). */
export function Bubble({ children, className = '', speak: speakText }: { children: ReactNode; className?: string; /** What Read to me says. Defaults to the bubble's own text; pass the full sentence when the bubble shows a short one. */ speak?: string }) {
  const text = speakText ?? (typeof children === 'string' ? children : undefined);
  return (
    <div
      className={`anim-bubble relative min-w-0 rounded-[1.25rem] border-2 border-line bg-panel px-[1rem] py-[0.5rem] font-display text-[1.125rem] leading-snug font-bold text-text shadow-[0_0.3rem_0_var(--color-lip)] ${className}`}
      role="status"
    >
      <span aria-hidden className="absolute bottom-[0.875rem] -left-[0.5rem] h-[0.875rem] w-[0.875rem] rotate-45 border-b-2 border-l-2 border-line bg-panel" />
      {text ? (
        <div className="flex items-center gap-[0.5rem]">
          <span className="min-w-0 flex-1">{typeof children === 'string' ? <Words text={children} /> : children}</span>
          <ReadToMe text={text} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

/** The speaker on a bubble. One tap speaks, another stops; leaving the screen stops it. Hidden if no voice fits the language. */
function ReadToMe({ text }: { text: string }) {
  const can = useCanSpeak();
  const lang = useI18n((s) => s.lang);
  const [on, setOn] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    if (on) stopSpeaking();
    setOn(false); // the text changed: stop what was being read
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!can) return null;
  return (
    <button
      type="button"
      aria-label={on ? 'Stop reading' : 'Read to me'}
      aria-pressed={on}
      onClick={() => {
        if (on) {
          stopSpeaking();
          setOn(false);
        } else setOn(speak(text, lang, () => setOn(false)));
      }}
      className="grid h-[2.75rem] w-[2.75rem] shrink-0 place-items-center rounded-full border-2 border-line bg-panel-up text-text"
    >
      {on ? <Square size={18} strokeWidth={3} aria-hidden /> : <Volume2 size={22} strokeWidth={2.5} aria-hidden />}
    </button>
  );
}
