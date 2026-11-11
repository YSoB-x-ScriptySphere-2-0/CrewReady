import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/baloo-da-2/500.css';
import '@fontsource/baloo-da-2/700.css';
import '@fontsource/baloo-da-2/800.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/700.css';
import '@fontsource/nunito/800.css';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
