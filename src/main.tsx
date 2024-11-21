import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StandsProvider } from './context/StandsContext';
import { SettingsProvider } from './context/SettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <StandsProvider>
        <App />
      </StandsProvider>
    </SettingsProvider>
  </StrictMode>
);