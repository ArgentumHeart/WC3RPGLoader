import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CharacterProvider } from './contexts/characterContext';
import { SettingsProvider } from './contexts/settingsContext';
import { ItemsProvider } from './contexts/itemsContext';
import { BuildsProvider } from './contexts/buildsContext';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <SettingsProvider>
    <ItemsProvider>
      <CharacterProvider>
        <BuildsProvider>
          <App />
        </BuildsProvider>
      </CharacterProvider>
    </ItemsProvider>
  </SettingsProvider>,
);
