type Loadout = string[];

export interface IClassLoad {
  hero: string;
  gold: string;
  level?: string;
  notes: string;
  sigils: string;
  powerShards: string;
  inventory: Loadout;
  stashes: Loadout[];
  code: string;
}

interface IDamagePerPlayer { 
  damageType: string;
  players: Array<{
    slotNumber: number;
    playerName: string;
    className: string;
    damagePercentage: number;
  }> 
}

type TItem = {
  integerId: number;
  id: string;
  name: string;
  icon: string;
  legacyItem: boolean;
  description: string;
  effects: string[];
  restriction: string;
  rarity: TRarity;
  source?: string;
  sourceShort?: string;
  recipe: string[];
  partOf: string[];
  godlyCraft: boolean;
}

type TRarity = {
  id: number;
  name: string;
  color: string;
}