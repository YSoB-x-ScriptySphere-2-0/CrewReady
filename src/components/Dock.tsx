// Navigation outside levels: a rail down the left edge, five round icon buttons (Missions, Fly,
// Resources, Training, Me). A bottom bar would eat height we don't have. Unbuilt places show a padlock,
// so nothing looks broken. Put it in `Scene`'s `rail` slot. BUILD_SEQUENCE.md §4.2, §4.6.
import { BookOpen, Dumbbell, Lock, Map as MapIcon, Rocket, UserRound, type LucideIcon } from 'lucide-react';
import { BUILT_SCREENS, useGame, type Screen } from '../store/game';
import { usePress } from './motion';

const ITEMS: { label: string; icon: LucideIcon; screen: Screen; alsoActive?: Screen[] }[] = [
  { label: 'Missions', icon: MapIcon, screen: 'map', alsoActive: ['home'] },
  { label: 'Fly', icon: Rocket, screen: 'fly' },
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
      title={label}
      {...press}
      className="group grid place-items-center rounded-full disabled:cursor-not-allowed disabled:opacity-100"
    >
      <span
        data-pressed={press['data-pressed']}
        className={`toy !mb-[0.45rem] grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full ${
          here ? 'bg-go text-go-text border-go-lip [--lip:var(--color-go-lip)]' : open ? 'bg-panel/80 text-text border-text/30' : 'bg-locked text-muted [--lip:var(--color-locked-lip)]'
        }`}
        aria-hidden
      >
        <Icon size={26} strokeWidth={2.5} />
        {!open ? (
          <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full border-2 border-line bg-panel text-text">
            <Lock size={11} strokeWidth={3} />
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function Dock() {
  const { screen, go } = useGame();
  return (
    <nav aria-label="Main" className="flex h-full w-[4.5rem] flex-col items-center justify-center border-r-2 border-line bg-space-deep/85 py-[0.5rem]">
      <ul className="flex flex-col items-center gap-[0.25rem]">
        {ITEMS.map(({ label, icon, screen: target, alsoActive }) => {
          const isHere = screen === target || !!alsoActive?.includes(screen);
          return (
            <li key={label}>
              <DockButton label={label} icon={icon} open={BUILT_SCREENS.has(target)} here={isHere} onClick={() => go(target)} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
