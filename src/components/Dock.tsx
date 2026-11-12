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
      className="group relative grid place-items-center rounded-2xl disabled:cursor-not-allowed disabled:opacity-75"
    >
      <span
        data-pressed={press['data-pressed']}
        className={`toy !mb-[0.4rem] grid h-[3.25rem] w-[3.25rem] place-items-center rounded-2xl transition-all duration-150 ${
          here
            ? 'bg-gradient-to-b from-go/35 to-go/20 text-go border-2 border-go shadow-[0_0_16px_rgba(34,215,230,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] [--lip:var(--color-go-lip)]'
            : open
              ? 'bg-white/[0.08] hover:bg-white/[0.16] hover:border-white/40 border border-white/20 text-white/90 shadow-sm backdrop-blur-sm [--lip:rgba(0,0,0,0.35)]'
              : 'bg-black/30 text-muted/50 border border-white/10 [--lip:rgba(0,0,0,0.3)]'
        }`}
        aria-hidden
      >
        <Icon size={24} strokeWidth={2.4} />
        {!open ? (
          <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full border border-white/20 bg-space-deep/90 text-muted">
            <Lock size={10} strokeWidth={2.5} />
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function Dock() {
  const { screen, go } = useGame();
  return (
    <nav aria-label="Main" className="flex h-full w-[4.75rem] flex-col items-center justify-center border-r border-white/15 bg-space-deep/45 backdrop-blur-xl py-[0.5rem] shadow-[4px_0_24px_rgba(0,0,0,0.35)]">
      <ul className="flex flex-col items-center gap-[0.35rem]">
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
