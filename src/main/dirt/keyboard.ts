import { Key, keyboard, clipboard } from '@nut-tree/nut-js';

/*
export const executeCommand = async (command: string) => {
  keyboard.config.autoDelayMs = 50;
  return clipboard.setContent(command).then(
    async () => {
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
      await keyboard.type(Key.LeftControl, Key.V);
      await keyboard.pressKey(Key.Enter);
      await keyboard.releaseKey(Key.Enter);
    }
  );
};
*/

export const executeCommand = async (command: string) => {
  keyboard.config.autoDelayMs = 1;
  await keyboard.pressKey(Key.Enter);
  await keyboard.releaseKey(Key.Enter);
  await keyboard.type(command);
  await keyboard.pressKey(Key.Enter);
  await keyboard.releaseKey(Key.Enter);
};
