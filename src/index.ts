#!/usr/bin/env node

import { getPackageInfo } from './get_package_info';
import { Package } from './Package';
import { Updates } from './Updates';

const main = async () => {
  const [, , path] = process.argv;
  const packages = Object.entries(await getPackageInfo(path))
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
  console.log(packages.map(p => p.toString()).join('\n'));

  const updates = new Updates(packages);

  const { patch, minor, major } = updates.getUpdateCommands();

  if (patch) console.log(`\nUpdate patches:\n${patch}`);
  if (minor) console.log(`\nUpdate minor:\n${minor}`);
  if (major) console.log(`\nUpdate major:\n${major}`);
};

main().catch(console.error);
