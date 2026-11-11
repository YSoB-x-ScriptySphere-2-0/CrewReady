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

/** Orbit or Nova, standing at a given height. Decorative unless `label` is set. */
export function Kid({ who, pose, height, label, className = '' }: { who: 'orbit' | 'nova'; pose: OrbitPose | NovaPose; height: number; label?: string; className?: string }) {
  return (
    <img
      src={art(`${who}-${pose}`)}
      alt={label ?? ''}
      aria-hidden={label ? undefined : true}
      style={{ height }}
      className={`w-auto shrink-0 select-none ${className}`}
      draggable={false}
      decoding="async"
    />
  );
}

/** Twinkle with a speech bubble — hints, the hook, Mission Replay. */
export function TwinkleSays({ children, mood = 'happy', size = 72 }: { children: ReactNode; mood?: TwinkleMood; size?: number }) {
  return (
    <div className="rise flex items-end gap-1">
      <Twinkle mood={mood} size={size} />
      <div className="relative mb-4 rounded-card border-2 border-ink bg-paper px-4 py-3 text-lg text-ink shadow-card" role="status">
        <span aria-hidden className="absolute -left-2 bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-ink bg-paper" />
        {children}
      </div>
    </div>
  );
}
