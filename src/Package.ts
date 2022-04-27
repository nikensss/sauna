#!/usr/bin/env node

import chalk from 'chalk';
import { Version } from './Version.js';

/**
 * PackageInfo is the data provided by the `npm outdated --json` command.
 */
export interface PackageInfo {
  current: string;
  wanted: string;
  latest: string;
  dependent: string;
  location: string;
}

/**
 * The Package class represents the data available about a package and its
 * available update according to `npm outdated --json` data.
 */
export class Package {
  private name: string;
  private currentVersion: Version;
  private latestVersion: Version;

  constructor(name: string, packageInfo: PackageInfo) {
    this.name = name;
    this.currentVersion = new Version(packageInfo.current);
    this.latestVersion = new Version(packageInfo.latest);
  }

  getName(): string {
    return this.name;
  }

  getLatestVersion(): Version {
    return this.latestVersion;
  }

  getLatestVersionInstallReference(): string {
    return `${this.getName()}@${this.getLatestVersion().raw}`;
  }

  hasUpdate(): boolean {
    return this.isMajorUpdate() || this.isMinorUpdate() || this.isPatchUpdate();
  }

  isMajorUpdate(): boolean {
    return this.latestVersion.isMajorUpdate(this.currentVersion);
  }

  isMinorUpdate(): boolean {
    return this.latestVersion.isMinorUpdate(this.currentVersion);
  }

  isPatchUpdate(): boolean {
    return this.latestVersion.isPatchUpdate(this.currentVersion);
  }

  toString(): string {
    const name = this.name.padEnd(40, ' ');
    const s = `${name}${this.currentVersion.toString()}\t${this.latestVersion.toString()}`;
    if (this.isMajorUpdate()) return chalk.red(s);
    if (this.isMinorUpdate()) return chalk.yellow(s);
    if (this.isPatchUpdate()) return chalk.blue(s);

    return chalk.bgGrey(s);
  }
}
