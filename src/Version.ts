#!/usr/bin/env node

import { logger } from './Logger.js';

export class Version {
  private major: number;
  private minor: number;
  private patch: number;
  private _raw: string;

  constructor(semVer: string) {
    logger.debug({ semVer }, 'new Version instance');
    const [major, minor, patch] = semVer.split('.').map(n => parseInt(n, 10));
    if (typeof major !== 'number') throw new Error(`Could not figure out major in ${semVer}`);
    if (typeof minor !== 'number') throw new Error(`Could not figure out minor in ${semVer}`);
    if (typeof patch !== 'number') throw new Error(`Could not figure out patch in ${semVer}`);
    [this.major, this.minor, this.patch] = [major, minor, patch];
    this._raw = semVer;
  }

  get raw(): string {
    return this._raw;
  }

  isNewerThan(version: Version): boolean {
    logger.debug({ this: this, other: version }, 'comparing if this is newer than other');
    if (this.major !== version.major) return this.major > version.major;
    if (this.minor !== version.minor) return this.minor > version.minor;
    if (this.patch !== version.patch) return this.patch > version.patch;
    return false;
  }

  isMajorUpdate(version: Version): boolean {
    return this.major > version.major;
  }

  isMinorUpdate(version: Version): boolean {
    if (this.isMajorUpdate(version)) return false;
    return this.minor > version.minor;
  }

  isPatchUpdate(version: Version): boolean {
    if (this.isMajorUpdate(version)) return false;
    if (this.isMinorUpdate(version)) return false;
    return this.patch > version.patch;
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`.padEnd(10, ' ');
  }
}
