#!/usr/bin/env node

import child_process from 'child_process';
import ora from 'ora';
import { promisify } from 'util';
import { logger } from './Logger.js';
import { PackageInfo } from './Package.js';
import { z } from 'zod';

const commandErrorValidator = z.object({
  killed: z.boolean(),
  code: z.number(),
  signal: z.string().nullable(),
  cmd: z.string(),
  stdout: z.string(),
  stderr: z.string()
});

export type CommandError = z.infer<typeof commandErrorValidator>;

const isCommandError = (err: unknown): err is CommandError => {
  logger.debug('checking if command execution failed');

  const isValid = commandErrorValidator.safeParse(err).success;

  logger.debug((isValid ? 'not a ' : '') + 'command error');

  return isValid;
};

const exec = async (command: string): Promise<Record<string, PackageInfo>> => {
  const _exec = promisify(child_process.exec);
  try {
    return JSON.parse((await _exec(command)).stdout);
  } catch (ex) {
    if (!isCommandError(ex)) throw ex;
    if (ex.stderr !== '') throw new Error(ex.stderr);
    return JSON.parse(ex.stdout);
  }
};

const isPackageInfo = (o: unknown): o is Record<string, PackageInfo> => {
  logger.debug('checking if npm returned the necessary data');

  if (o === null) return false;
  if (!o) return false;
  if (typeof o !== 'object') return false;

  const necessaryFields = ['current', 'latest'];
  const packageInfo = o as Record<string, PackageInfo>;

  for (const [packageName, packageData] of Object.entries(packageInfo)) {
    const availableFields = Object.keys(packageData).sort();
    logger.debug({ packageName, availableFields });

    // ensure every necessary field is included in the available fields
    if (!necessaryFields.every(field => availableFields.includes(field))) {
      logger.debug(`${packageName} is missing data: ${availableFields.join(', ')}`);
      logger.debug(`Expected: ${necessaryFields.join(', ')}`);
      return false;
    }
  }

  logger.debug('npm returned the necessay data');
  return true;
};

export const getPackageInfo = async (path?: string): Promise<Record<string, PackageInfo>> => {
  logger.debug('getting outdated packages');
  const spinner = ora().start('getting outdated packages...');
  const command = (path ? `cd ${path} && ` : '') + 'npm outdated --json --long';

  try {
    const result = await exec(command);
    spinner.succeed('outdated packages retrieved!');
    if (!isPackageInfo(result)) {
      const err = new Error('Missing properties in result of `npm outdated`');
      logger.debug({ err });
      throw err;
    }

    return result;
  } catch (ex) {
    spinner.fail(`${ex}`);
    throw ex;
  }
};
