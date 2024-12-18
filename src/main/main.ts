/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, globalShortcut } from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { loadTevefData } from './load';
import { Prisma, PrismaClient } from '@prisma/client';
import { executeCommand } from './dirt/keyboard';
import {
  armFishing,
  stopFishingAndUnregisterHotkeys,
} from './services/fishing';
import { parseLastRun } from './lastrun';
import { createClassesService } from './services/classes';
import { createItemsService } from './services/items';
import { createSettingsService } from './services/settings';
import { createBuildsService } from './services/builds';
import { createDamageService } from './services/damage';

let mainWindow: BrowserWindow | null = null;

const DB_PATH =
  process.env.NODE_ENV === 'development'
    ? 'file:./dev.db'
    : 'file:' + path.join(app.getAppPath(), '../prisma/dev.db');

export const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: DB_PATH,
    },
  },
});

const settingsService = createSettingsService(app.getPath.bind(app));
const damageService = createDamageService(settingsService);
const classesService = createClassesService(prismaClient);
const itemsService = createItemsService(prismaClient);
const buildsService = createBuildsService(app.getPath.bind(app));

ipcMain.on('loadData', async (event, arg) => {
  const data = await loadTevefData(arg);
  event.reply('loadData', data);
});

ipcMain.on('load', async (event, arg) => {
  // clear previous hotkey forcefully
  globalShortcut.unregister('A');
  globalShortcut.register('A', async () => {
    globalShortcut.unregister('A');
    // eslint-disable-next-line no-restricted-syntax
    for (const command of arg) {
      // eslint-disable-next-line no-await-in-loop
      await executeCommand(command);
    }
  });
});

ipcMain.on('fishing_arm', async (_, arg) => {
  armFishing(arg.hotkey, arg.up, arg.down, arg.delay, arg.isAutosave);
});

ipcMain.on('fishing_disarm', async () => {
  stopFishingAndUnregisterHotkeys();
});

ipcMain.on('settings_read', async (event) => {
  event.reply('settings_read', await settingsService.getSettings());
});

ipcMain.on('get_latest_damage_by_type', async (event) => {
  const res = await damageService.getLatestRunPerDamageType();
  event.reply('get_latest_damage_by_type', res);
});

ipcMain.on('get_all_classes', async (event) => {
  event.reply('get_all_classes', await classesService.getAllClasses());
});

ipcMain.on('get_all_items', async (event) => {
  event.reply('get_all_items', await itemsService.getAllItemsDict());
});

ipcMain.on('request_last_run', async (event, arg) => {
  const data = await parseLastRun(arg);
  event.reply('last_run_info', data);
});

ipcMain.on('settings_write', async (event, arg) => {
  const res = await settingsService.writeSettings(arg);
  // we expect boolean on the other side, true means success.
  // should change it probably
  event.reply('settings_write', !res);
});

ipcMain.on('get_all_builds', async (event) => {
  event.reply('get_all_builds', await buildsService.getBuilds());
});

ipcMain.on('save_build', async (event, arg) => {
  await buildsService.saveBuild(arg);
  event.reply('get_all_builds', await buildsService.getBuilds());
});

ipcMain.on('delete_build', async (event, arg) => {
  await buildsService.deleteBuild(arg);
  event.reply('get_all_builds', await buildsService.getBuilds());
});

ipcMain.on('get_selected_builds', async (event) => {
  event.reply('get_selected_builds', await buildsService.getSelectedBuilds());
});

ipcMain.on('save_selected_build', async (event, arg) => {
  await buildsService.saveSelectedBuild(
    arg.playerName,
    arg.playerClass,
    arg.buildId,
  );
  event.reply('get_selected_builds', await buildsService.getSelectedBuilds());
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    minHeight: 500,
    minWidth: 900,
    width: 1200,
    height: 700,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
