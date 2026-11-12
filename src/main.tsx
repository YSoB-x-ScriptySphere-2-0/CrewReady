import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/baloo-da-2/500.css';
import '@fontsource/baloo-da-2/700.css';
import '@fontsource/baloo-da-2/800.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import App from './App';
import { Stage } from './components/Stage';
import { useGame } from './store/game';
import './index.css';

// Dev only: lets screenshots and play-tests jump to any screen (`__game.setState({...})`).
if (import.meta.env.DEV) (window as unknown as { __game: typeof useGame }).__game = useGame;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Stage>
      <App />
    </Stage>
  </StrictMode>,
);
