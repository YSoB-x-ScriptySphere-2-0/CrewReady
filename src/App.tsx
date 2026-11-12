import { lazy, Suspense, useEffect, useState } from 'react';
import { Home } from './screens/Home';
import { Hook } from './screens/Hook';
import { Play } from './screens/Play';
import { LevelOpening } from './screens/LevelOpening';
import { MissionMap } from './screens/MissionMap';
import { Replay } from './screens/Replay';
import { Story } from './screens/Story';
import { Success } from './screens/Success';
import { useGame } from './store/game';

/** Hidden dev page with every game-kit part (G1). Not linked from the game. */
const Kit = lazy(() => import('./screens/Kit').then((m) => ({ default: m.Kit })));
function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return hash;
}

export default function App() {
  const screen = useGame((s) => s.screen);
  const hash = useHash();
  if (hash === '#kit')
    return (
      <Suspense fallback={null}>
        <Kit />
      </Suspense>
    );
  if (screen === 'hook') return <Hook />;
  if (screen === 'story') return <Story />;
  if (screen === 'map') return <MissionMap />;
  if (screen === 'level') return <LevelOpening />;
  if (screen === 'play') return <Play />;
  if (screen === 'replay') return <Replay />;
  if (screen === 'success') return <Success />;
  return <Home />;
}
