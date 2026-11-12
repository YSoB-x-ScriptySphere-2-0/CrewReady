// The crew: Twinkle the robot guide, and the two kid astronauts Orbit and Nova.
// Art is cut from the team's pose sheets (ui reference/characters cutout) into public/art/.
// Characters appear only on the hook, story cards, Home, hints, Mission Replay and success.
import type { ReactNode } from 'react';

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
  height: number;
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
    <div className="flex items-end gap-1" key={mood}>
      <span className="anim-pop-in shrink-0">{speaker ?? <Twinkle mood={mood} size={size} />}</span>
      <div
        className="anim-bubble relative mb-4 min-w-0 rounded-[20px] border-[3px] border-ink bg-paper px-4 py-3 font-display text-xl leading-snug font-bold text-ink shadow-[0_5px_0_var(--color-ink)]"
        role="status"
      >
        <span aria-hidden className="absolute -left-[11px] bottom-4 h-5 w-5 rotate-45 border-b-[3px] border-l-[3px] border-ink bg-paper" />
        {children}
      </div>
    </div>
  );
}
