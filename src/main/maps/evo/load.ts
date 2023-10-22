import fs from 'fs/promises';
import { allClasses } from '../../../constants/evo/classes';

type Loadout = string[];
export interface Class {
  hero: string;
  gold: string;
  level?: string;
  powerShards: string;
  inventory: Loadout;
  stashes: Loadout[];
  code: string;
}

const extractItem = (str: string, key: string, end = '" )'): string => {
  if (str.indexOf(key) === -1 || str.indexOf(end) === -1) {
    return '';
  }
  const item = str
    .slice(
      // 10 is a 'magic' number to cut color code before name
      // |cff8B4513Scepter of Mastery    <--- example of the name
      str.indexOf(key) + key.length + 10,
      str.indexOf(end, str.indexOf(key) + 1),
    )
    .trim();

  if (item.endsWith('|r')) {
    return item.slice(0, item.length - 2);
  }

  return item;
};

const extractKey = (str: string, key: string, end = '"'): string => {
  if (str.indexOf(key) === -1 || str.indexOf(end) === -1) {
    return '';
  }
  return str.slice(
    str.indexOf(key) + key.length,
    str.indexOf(end, str.indexOf(key) + 1),
  );
};

const parseClassFile = (str: string): Class => {
  return {
    hero: extractKey(str, 'Hero: ', '"'),
    gold: extractKey(str, 'Gold: ', '"'),
    powerShards: extractKey(str, 'Shard: ', '"'),
    code: extractKey(str, '"-l ', '"'),
    inventory: [...Array(6)].map((_, index) => {
      return extractItem(str, `"Item ${index + 1}: `).trim();
    }),
    stashes: [...Array(6)].map((_, stashIndex) => {
      return [...Array(6)].map((__, index) => {
        return extractItem(
          str,
          `"Stash${stashIndex ? stashIndex + 1 : ''} Item ${index + 1}: `,
        ).trim();
      });
    }),
  };
};
const loadClass = async (path: string) => {
  const classDir = await fs.readdir(path);
  console.log(classDir);
  const name = classDir
    .filter((el) => el.indexOf('[Level ') !== -1)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    .pop();

  if (!name) {
    return null;
  }

  const classFile = await fs.readFile(`${path}/${name}`, 'utf-8');
  console.log(`${path}/${name}`);
  return Object.assign(parseClassFile(classFile), {
    level: name?.slice(6, name && name.length ? name.length - 5 : 0),
  });
};

export const loadTevefData = async (path: string) => {
  console.log(path);
  const potentialClasses = await fs.readdir(path);
  console.log(potentialClasses);
  const classes = potentialClasses.filter((el) => allClasses.includes(el));
  console.log(classes);
  const data = await Promise.all(
    classes.map((cl) => loadClass(`${path}/${cl}`)),
  );

  return data;
};
