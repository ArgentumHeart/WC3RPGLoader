import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useSettingsContext } from './settingsContext';
import { Class } from './main/maps/evo/load';

interface CharacterContext {
  allClasses: Class[];
  setAllClasses: (classes: Class[]) => void;
  onLoadClick: (character: Class, legacy?: boolean) => void;
  loadClasses: () => void;
  getCharacterById: (id?: string) => Class | undefined;
}
export const CharacterContext = createContext({} as CharacterContext);
export const CharacterProvider: FC<PropsWithChildren> = ({ children }) => {
  const { wc3path, battleTag, extraLines } = useSettingsContext();
  const [allClasses, setAllClasses] = useState<Class[]>([]);
  const loadClasses = () => {
    window.electron.ipcRenderer.sendMessage(
      'ipc',
      `${wc3path}/CustomMapData/Twilight's Eve Evo/${battleTag}`,
    );
  };
  const getCharacterById = (id?: string) => {
    if (!id) {
      return undefined;
    }
    return allClasses.find((character) => character.hero === id);
  };
  const onLoadClick = (character: Class, legacy?: boolean) => {
    if (character && character.code) {
      window.electron.ipcRenderer.sendMessage(
        'load',
        [
          '-rp',
          '-lc',
          character.code.slice(0, character.code.length / 2),
          character.code.slice(
            character.code.length / 2,
            character.code.length,
          ),
          '-le',
          ...extraLines.split('\n'),
        ],
        legacy,
      );
    }
  };
  const value = {
    allClasses,
    setAllClasses,
    onLoadClick,
    loadClasses,
    getCharacterById,
  };
  useEffect(() => {
    window.electron.ipcRenderer.on('ipc', (arg: any) => {
      console.log(arg);
      // @ts-ignore
      setAllClasses(arg);
    });
  }, []);

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};
export const useCharacterContext = () => useContext(CharacterContext);
