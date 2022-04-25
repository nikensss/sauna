#!/usr/bin/env node

import { Command } from 'commander';

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

export const options = program.parse().opts();
