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
import { useI18n } from './content/i18n';
import { registerServiceWorker } from './services/sw';
import './index.css';

registerServiceWorker();

// Dev only: lets screenshots and play-tests jump to any screen (`__game.setState({...})`).
if (import.meta.env.DEV) {
  (window as unknown as { __game: typeof useGame; __i18n: typeof useI18n }).__game = useGame;
  (window as unknown as { __i18n: typeof useI18n }).__i18n = useI18n;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Stage>
      <App />
    </Stage>
  </StrictMode>,
);
