import { lazy, Suspense, useEffect, useState } from 'react';
import { Home } from './screens/Home';
import { Hook } from './screens/Hook';
import { Play } from './screens/Play';
import { LevelOpening } from './screens/LevelOpening';
import { MissionMap } from './screens/MissionMap';
import { Replay } from './screens/Replay';
import { Success } from './screens/Success';
import { Sources } from './screens/Sources';
import { Fly } from './screens/Fly';
import { Resources } from './screens/Resources';
import { Profile } from './screens/Profile';
import { Training } from './screens/Training';
import { Welcome } from './screens/Welcome';
import { useGame } from './store/game';
import { useSpace } from './store/space';
import { WordCardHost } from './components/Words';
import { TwinkleTourGuide } from './components/TwinkleTourGuide';
import { CinematicIntro3D } from './components/3d/CinematicIntro3D';
import { spaceMusic } from './services/audio';

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

function Screens() {
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showCinematicIntro, setShowCinematicIntro] = useState(false);
  const { screen, seenIntro, go } = useGame();
  const hash = useHash();
  // Real NASA data starts loading as soon as the app opens, so the storm size is known by PLAY.
  useEffect(() => void useSpace.getState().load(), []);

  // Adapt space music mode to current screen
  useEffect(() => {
    if (screen === 'fly') {
      spaceMusic.setMode('fly');
    } else if (screen === 'hook') {
      spaceMusic.setMode('alarm');
    } else {
      spaceMusic.setMode('normal');
    }
  }, [screen]);

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
          // Show Marvel cinematic intro if player hasn't seen the intro yet
          if (!seenIntro) {
            setShowCinematicIntro(true);
          } else if (screen === 'hook') {
            go('home');
          }
        }}
        onOpenTour={() => {
          setWelcomeDismissed(true);
          setShowTour(true);
        }}
      />
    );
  }

  // Marvel-style Cinematic 3D Intro
  if (showCinematicIntro) {
    return (
      <CinematicIntro3D
        onComplete={() => {
          setShowCinematicIntro(false);
          setShowTour(true);
        }}
      />
    );
  }

  // Tour Guide of Twinkle before the intro, or when opened
  if (showTour) {
    return (
      <TwinkleTourGuide
        onClose={() => {
          setShowTour(false);
          if (!seenIntro) {
            go('hook');
          }
        }}
      />
    );
  }

  if (screen === 'hook') return <Hook />;
  if (screen === 'story') {
    return (
      <CinematicIntro3D
        onComplete={() => {
          go('home');
        }}
      />
    );
  }
  if (screen === 'map') return <MissionMap />;
  if (screen === 'level') return <LevelOpening />;
  if (screen === 'play') return <Play />;
  if (screen === 'replay') return <Replay />;
  if (screen === 'success') return <Success />;
  if (screen === 'sources') return <Sources />;
  if (screen === 'fly') return <Fly />;
  if (screen === 'resources') return <Resources />;
  if (screen === 'profile') return <Profile />;
  if (screen === 'training') return <Training />;
  return <Home />;
}


export default function App() {
  return (
    <>
      <Screens />
      <WordCardHost />
    </>
  );
}
