#!/usr/bin/env node

import child_process from 'child_process';
import { promisify } from 'util';
import { PackageInfo } from './Package';

const exec = promisify(child_process.exec);

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

export const getPackageInfo = async (path?: string): Promise<Record<string, PackageInfo>> => {
  try {
    const command = (path ? `cd ${path} && ` : '') + 'npm outdated --json';
    return JSON.parse((await exec(command)).stdout);
  } catch (ex) {
    if (isCommandError(ex)) return JSON.parse(ex.stdout);
    throw ex;
  }
};
