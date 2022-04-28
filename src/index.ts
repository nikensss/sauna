#!/usr/bin/env node

import { options } from './Commander.js';
import { getPackageInfo } from './get_package_info.js';
import { Package } from './Package.js';
import { Updates } from './Updates.js';
import { logger } from './Logger.js';

const main = async () => {
  logger.debug('start');
  const packages = Object.entries(await getPackageInfo(options.path))
    .map(([name, info]) => new Package(name, info))
    .sort((a, b) => {
      if (!a.hasUpdate() && !b.hasUpdate()) return 0;
      if (a.hasUpdate() && !b.hasUpdate()) return -1;
      if (!a.hasUpdate() && b.hasUpdate()) return 1;

      if (a.isPatchUpdate() && b.isPatchUpdate()) return 0;
      if (a.isPatchUpdate() && !b.isPatchUpdate()) return -1;

      if (a.isMinorUpdate() && b.isMinorUpdate()) return 0;
      if (a.isMinorUpdate() && b.isPatchUpdate()) return 1;
      if (a.isMinorUpdate() && b.isMajorUpdate()) return -1;

      if (a.isMajorUpdate() && b.isMajorUpdate()) return 0;
      if (a.isMajorUpdate() && !b.isMajorUpdate()) return 1;

      console.log({ a, b });
      throw new Error('Invalid version comparison');
    });

  logger.debug('printing list of available updates');
  console.log(packages.map(p => p.toString()).join('\n'));

  logger.debug('creating "Updates" instance');
  const updates = new Updates(packages);

  logger.debug('getting update commands');
  const { patch, minor, major } = updates.getUpdateCommands();

  logger.debug('printing update commands');
  if (patch) console.log(`\nUpdate patches:\n${patch}`);
  if (minor) console.log(`\nUpdate minor:\n${minor}`);
  if (major) console.log(`\nUpdate major:\n${major}`);
  logger.debug('end');
};

main().catch(console.error);
