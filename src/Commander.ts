#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program.option('-p, --path <string>', 'the path to run in');

export const options = program.parse().opts();
