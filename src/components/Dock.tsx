// The bottom bar outside levels: five chunky round icon buttons (Missions, Quick Run, Resources, Training, Me).
// Unbuilt places show a padlock, so nothing looks broken. Replaces BottomNav. BUILD_SEQUENCE.md §4.7.
import { BookOpen, Dumbbell, Lock, Map as MapIcon, Rocket, UserRound, type LucideIcon } from 'lucide-react';
import { BUILT_SCREENS, useGame, type Screen } from '../store/game';
import { usePress } from './motion';

const ITEMS: { label: string; icon: LucideIcon; screen: Screen; alsoActive?: Screen[] }[] = [
  { label: 'Missions', icon: MapIcon, screen: 'map', alsoActive: ['home'] },
  { label: 'Quick Run', icon: Rocket, screen: 'quickrun' },
  { label: 'Resources', icon: BookOpen, screen: 'resources' },
  { label: 'Training', icon: Dumbbell, screen: 'training' },
  { label: 'Me', icon: UserRound, screen: 'profile' },
];

function DockButton({ label, icon: Icon, open, here, onClick }: { label: string; icon: LucideIcon; open: boolean; here: boolean; onClick: () => void }) {
  const press = usePress(!open);
  return (
    <button
      onClick={onClick}
      disabled={!open}
      aria-current={here ? 'page' : undefined}
      aria-label={open ? label : `${label} (locked)`}
      {...press}
      className="group flex w-full flex-col items-center gap-1 rounded-tile px-0.5 pt-1 text-ink disabled:cursor-not-allowed disabled:opacity-100"
    >
      <span
        data-pressed={press['data-pressed']}
        className={`toy !mb-[7px] grid h-[52px] w-[52px] place-items-center rounded-full ${here ? 'bg-go text-white [--lip:var(--color-go-lip)]' : open ? 'bg-white' : 'bg-locked text-muted [--lip:var(--color-locked-lip)]'}`}
        aria-hidden
      >
        <Icon size={26} strokeWidth={2.5} />
        {!open ? (
          <span className="absolute -right-1.5 -bottom-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-ink bg-paper text-ink">
            <Lock size={13} strokeWidth={3} />
          </span>
        ) : null}
      </span>
      <span className={`font-display text-base leading-none font-extrabold tracking-tight whitespace-nowrap ${open ? '' : 'text-muted'}`}>{label}</span>
    </button>
  );
}

export function Dock() {
  const { screen, go } = useGame();
  return (
    <nav
      aria-label="Main"
      className="on-paper sticky bottom-0 z-30 border-t-[3px] border-ink/85 bg-paper/85 backdrop-blur-xl pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(27,31,59,0.16),inset_0_1.5px_0_rgba(255,255,255,0.75)] transition-colors"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-5 gap-1 px-1">
        {ITEMS.map(({ label, icon, screen: target, alsoActive }) => {
          const isHere = screen === target || !!alsoActive?.includes(screen);
          return (
            <li key={label} className="relative flex flex-col items-center">
              <DockButton
                label={label}
                icon={icon}
                open={BUILT_SCREENS.has(target)}
                here={isHere}
                onClick={() => go(target)}
              />
              {isHere ? (
                <span
                  aria-hidden
                  className="anim-pop absolute -bottom-1 h-1 w-6 rounded-full bg-go shadow-[0_0_8px_var(--color-go)]"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
