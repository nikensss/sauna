#!/usr/bin/env node

import { Command } from 'commander';
import { Package } from './Package.js';

const program = new Command();

program
  .option(
    '-p, --path <string>',
    'The path to run in. If not specified, the current directory is used.'
  )
  .option(
    '-i, --ignore <package_names...>',
    'The packages with updates that should be ignored (separated by a white space). The packages will be visible in the list of available updates, but the update commands will not include them.'
  );

const opts = program.parse().opts();

export interface Options {
  readonly path: string;
  readonly ignore: string[];
  isIgnored: (pkg: Package) => boolean;
}

export const options: Options = {
  path: opts.path || '',
  ignore: opts.ignore || [],
  isIgnored: (pkg: Package): boolean => {
    return options.ignore.some(p => pkg.getName().includes(p));
  }
};
