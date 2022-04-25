#!/usr/bin/env node

import child_process from 'child_process';
import ora from 'ora';
import { promisify } from 'util';
import { PackageInfo } from './Package';

export interface CommandError {
  killed: boolean;
  code: number;
  signal: string | null;
  cmd: string;
  stdout: string;
  stderr: string;
}

const isCommandError = (err: unknown): err is CommandError => {
  const commandError = err as CommandError;
  if (typeof commandError.stdout !== 'string') return false;
  if (typeof commandError.stderr !== 'string') return false;

  return true;
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

export const getPackageInfo = async (path?: string): Promise<Record<string, PackageInfo>> => {
  const spinner = ora().start('getting outdated packages...');
  const command = (path ? `cd ${path} && ` : '') + 'npm outdated --json';
  try {
    const result = await exec(command);
    spinner.succeed('outdated packages retrieved!');
    return result;
  } catch (ex) {
    spinner.fail(`ex`);
    throw ex;
  }
};
