// Missions · Quick Run · Resources · Training · Me. Hidden inside a level.
// A place whose screen is not built yet shows a lock, so nothing looks broken.
import { BookOpen, Dumbbell, Lock, Map as MapIcon, Rocket, UserRound, type LucideIcon } from 'lucide-react';
import { BUILT_SCREENS, useGame, type Screen } from '../store/game';

const ITEMS: { label: string; icon: LucideIcon; screen: Screen; alsoActive?: Screen[] }[] = [
  { label: 'Missions', icon: MapIcon, screen: 'map', alsoActive: ['home'] },
  { label: 'Quick Run', icon: Rocket, screen: 'quickrun' },
  { label: 'Resources', icon: BookOpen, screen: 'resources' },
  { label: 'Training', icon: Dumbbell, screen: 'training' },
  { label: 'Me', icon: UserRound, screen: 'profile' },
];

export function BottomNav() {
  const { screen, go } = useGame();
  return (
    <nav aria-label="Main" className="sticky bottom-0 border-t-2 border-ink bg-paper text-ink">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {ITEMS.map(({ label, icon: Icon, screen: target, alsoActive }) => {
          const open = BUILT_SCREENS.has(target);
          const here = screen === target || alsoActive?.includes(screen);
          return (
            <li key={label}>
              <button
                onClick={() => go(target)}
                disabled={!open}
                aria-current={here ? 'page' : undefined}
                className={`flex min-h-16 w-full flex-col items-center justify-center gap-0.5 px-1 text-sm leading-tight font-bold ${here ? 'bg-ink/8' : ''} disabled:opacity-50`}
              >
                <span className="relative">
                  <Icon size={22} strokeWidth={2} aria-hidden />
                  {!open ? <Lock size={13} strokeWidth={2.5} aria-hidden className="absolute -right-2 -bottom-1 rounded-full bg-paper" /> : null}
                </span>
                <span className="text-center">{label}</span>
                {!open ? <span className="sr-only">(locked)</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
