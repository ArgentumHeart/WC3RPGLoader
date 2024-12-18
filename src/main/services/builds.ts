import path from 'path';
import fs from 'fs/promises';

export function createBuildsService(
  getPath: (type: 'userData' | 'documents') => string,
) {
  const getDefaultBuilds = () => ({});
  const getDefaultSelectedBuilds = () => ({});

  const getBuildsFilePath = () => path.join(getPath('userData'), 'builds.json');
  const getSelectedBuildsFilePath = () =>
    path.join(getPath('userData'), 'selectedBuilds.json');
  const getBuildIdFilePath = () =>
    path.join(getPath('userData'), 'buildId.json');

  const readFile = async (filePath: string, defaultValue: any) => {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.log(e);
      return defaultValue;
    }
  };

  const writeFile = async (filePath: string, data: any) => {
    try {
      await fs.writeFile(filePath, JSON.stringify(data));
    } catch (e) {
      console.log(e);
    }
  };

  const readNextBuildId = async () => {
    const buildIdData = await readFile(getBuildIdFilePath(), { nextId: 1 });
    return buildIdData.nextId;
  };

  const incrementBuildId = async () => {
    const buildIdData = await readFile(getBuildIdFilePath(), { nextId: 1 });
    buildIdData.nextId += 1;
    await writeFile(getBuildIdFilePath(), buildIdData);
  };

  return {
    async getBuilds() {
      return await readFile(getBuildsFilePath(), getDefaultBuilds());
    },
    async saveBuild(build: any) {
      try {
        const builds = await this.getBuilds();
        if (!build.id) {
          build.id = await readNextBuildId();
          await incrementBuildId();
        }
        builds[build.id] = build;
        await writeFile(getBuildsFilePath(), builds);
        return 0;
      } catch (e) {
        console.log(e);
        return 1;
      }
    },
    async deleteBuild(buildId: number) {
      try {
        const builds = await this.getBuilds();
        delete builds[buildId];
        await writeFile(getBuildsFilePath(), builds);
        return 0;
      } catch (e) {
        console.log(e);
        return 1;
      }
    },
    async getSelectedBuilds() {
      return await readFile(
        getSelectedBuildsFilePath(),
        getDefaultSelectedBuilds(),
      );
    },
    async saveSelectedBuild(
      playerName: string,
      playerClass: string,
      buildId: number,
    ) {
      try {
        const selectedBuilds = (await this.getSelectedBuilds()) ?? {};
        selectedBuilds[playerName] = selectedBuilds[playerName] ?? {};
        selectedBuilds[playerName][playerClass] = buildId;
        await writeFile(getSelectedBuildsFilePath(), selectedBuilds);
        return 0;
      } catch (e) {
        console.log(e);
        return 1;
      }
    },
  };
}
