import { globalShortcut } from 'electron';
import { keyboard, Key, screen, Point } from '@nut-tree/nut-js';

let fishing: NodeJS.Timeout | undefined
let clicks = 0;
const maxFishingClicks = 20;
const optimalDelay = 0.4;
const averageDelay = 1;
const badDelay = 2;
const hotkeyDelays = {
  '8': () => clicks === maxFishingClicks / 2 ? badDelay : optimalDelay,
  '9': () => optimalDelay,
  '0': () => averageDelay
};

export function armFishing(rodHotkey: any) {
  disarmFishing();
  Object.entries(hotkeyDelays).forEach(([hotkey, getDelay]) => {
    globalShortcut.register(getCommandFor(hotkey), async () => {
      if (!fishing) {
        click(rodHotkey);
        fishing = setInterval(() => {
          click(rodHotkey)
        }, 1000 * 5);

        clicks = 0;
        while (fishing) {
          await new Promise(resolve => setTimeout(resolve, 1000 * getDelay()));
          await clickIfNeeded(452, 630, 255, 204, 0, Key.Up);
          await clickIfNeeded(453, 632, 5, 250, 5, Key.Down);
        }
      }
    })
  });
  globalShortcut.register(getCommandFor('-'), () => stop());
}

export function disarmFishing() {
  Object.entries(hotkeyDelays).forEach(([hotkey, _getDelay]) => { globalShortcut.unregister(getCommandFor(hotkey)); });
  stop();
}

const getCommandFor = (hotkey: string) => 'CommandOrControl+' + hotkey;

const stop = () => {
  try {
    clearInterval(fishing);
    fishing = undefined;
  } catch (e) {

  }
}

const clickIfNeeded = async (width: number, height: number, red: number, green: number, blue: number, key: Key) => {
  var color = await screen.colorAt(new Point(width, height));
  if (closeEnough(color.R, red) && closeEnough(color.G, green) && closeEnough(color.B, blue)) {
    click(key);
    clicks = ++clicks % maxFishingClicks;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

const click = async (key: Key) => {
  await keyboard.pressKey(key)
  await keyboard.releaseKey(key);
}

const closeEnough = (a: number, b: number) => Math.abs(a - b) < 10;