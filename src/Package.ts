#!/usr/bin/env node

import chalk, { ChalkInstance } from 'chalk';
import { options } from './Commander.js';
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

  private getColor(): ChalkInstance {
    if (this.isMajorUpdate()) return chalk.red;
    if (this.isMinorUpdate()) return chalk.yellow;
    if (this.isPatchUpdate()) return chalk.blue;

    return chalk.bgGrey;
  }

  toString(): string {
    const name = this.name.padEnd(40, ' ');
    const s = `${name}${this.currentVersion.toString()}${this.latestVersion.toString()}`;
    const color = this.getColor();

    return options.isIgnored(this) ? color.strikethrough(s) : color(s);
  }
}
