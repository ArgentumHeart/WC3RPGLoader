import path from 'path';
import fs from 'fs/promises';
import { IDamagePerPlayer } from '../../types';

interface ISettingsService {
  getSettings: () => Promise<{ wc3path: string }>
}

export function createDamageService(settingsService: ISettingsService) {
  const PREFIX = 'call Preload( "';
  const AFFIX = '" )';
  const DMG_DELIMETER = ' - ';

  const parseFileStr = (str: string) => {
    return str
        .split('\n')
        .filter(el => el.indexOf(PREFIX) !== -1)
        .map(el => el.substring(el.indexOf(PREFIX) + PREFIX.length, el.indexOf(AFFIX)).trim())
        .filter(el => el !== "")
  }

  const parsePlayerDmg = (str: string, index: number) => {
    try {
      const splitArr = str.split(DMG_DELIMETER)
      const name = splitArr[0].split('#')[0];
      const className = splitArr[1];
      const dmgObj = splitArr[2]
        .split('//')
        .reduce((acc, curr) => {
          const dmgType = curr.split(': ')[0]
          const dmgNumber = parseInt(curr.split(': ')[1])
          acc[dmgType] = dmgNumber;
          return acc
        }, {} as {[damageType: string]: number})
        
      return {
        name,
        className,
        damage: dmgObj,
        slotNumber: index + 1,
      }
    } catch (e) {
      // shameless null plug
      return null
    }
  }

  return {
    async getLatestRunPerPlayer() {
      try {
        const settings = await settingsService.getSettings();
        const { wc3path } = settings;
        const damageFilePath = path.join(wc3path, 'CustomMapData', `Twilight's Eve Evo`, 'Damage.txt');
        const classFileStr = await fs.readFile(damageFilePath, 'utf-8');
        let infoArr = parseFileStr(classFileStr);
        const dungeonName = infoArr.shift() || "";
        const playersDmg = infoArr.map((str, index) => parsePlayerDmg(str, index)).filter(el => !!el);
        return {
            dungeonName: dungeonName,
            players: playersDmg
        }
      } catch (e) {
        return {
          dungeonName: "Error",
          players: []
        }
      }
    },

    async getLatestRunPerDamageType() {
      const damagePerPlayer = await this.getLatestRunPerPlayer()
      if (damagePerPlayer.players.length === 0) return {
        dungeonName: damagePerPlayer.dungeonName,
        damageTypes: {}
      }

      let damageTypesObj = {} as {[dmgType: string]: IDamagePerPlayer}
      for (const playerDmg of damagePerPlayer.players) {
          for (const [damageType, damagePercentage] of Object.entries(playerDmg.damage)) {
            if (!damageTypesObj[damageType]) {
              damageTypesObj[damageType] = {
                damageType,
                players: []
              }
            }

            damageTypesObj[damageType].players.push({
              slotNumber: playerDmg.slotNumber,
              playerName: playerDmg.name,
              damagePercentage,
              className: playerDmg.className,
            })
          }
      }
      
      return {
        dungeonName: damagePerPlayer.dungeonName,
        damageTypes: damageTypesObj,
      }
    }
  };
}