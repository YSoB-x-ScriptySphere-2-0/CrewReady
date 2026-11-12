import { lazy, Suspense, useEffect, useState } from 'react';
import { Home } from './screens/Home';
import { Hook } from './screens/Hook';
import { Play } from './screens/Play';
import { LevelOpening } from './screens/LevelOpening';
import { MissionMap } from './screens/MissionMap';
import { Replay } from './screens/Replay';
import { Story } from './screens/Story';
import { Success } from './screens/Success';
import { Welcome } from './screens/Welcome';
import { useGame } from './store/game';
import { useSpace } from './store/space';

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
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const { screen, seenIntro, go } = useGame();
  const hash = useHash();
  // Real NASA data starts loading as soon as the app opens, so the storm size is known by PLAY.
  useEffect(() => void useSpace.getState().load(), []);

  if (hash === '#kit')
    return (
      <Suspense fallback={null}>
        <Kit />
      </Suspense>
    );

  // Every time someone opens/refreshes the game, show Welcome first
  if (!welcomeDismissed) {
    return (
      <Welcome
        onStart={() => {
          setWelcomeDismissed(true);
          // First time (intro not finished, even if quit half-way): the hook. After that: Home, never the hook again.
          if (!seenIntro) go('hook');
          else if (screen === 'hook') go('home');
        }}
      />
    );
  }

  if (screen === 'hook') return <Hook />;
  if (screen === 'story') return <Story />;
  if (screen === 'map') return <MissionMap />;
  if (screen === 'level') return <LevelOpening />;
  if (screen === 'play') return <Play />;
  if (screen === 'replay') return <Replay />;
  if (screen === 'success') return <Success />;
  return <Home />;
}
