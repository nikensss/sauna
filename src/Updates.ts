#!/usr/bin/env node

import { Package } from './Package.js';

export class Updates {
  private readonly packages: Package[];

  constructor(packages: readonly Package[], ignored: string[] = []) {
    const isIgnored = (p: Package) => ignored.includes(p.getName());
    this.packages = [...packages.filter(p => !isIgnored(p))];
  }

  get major(): Package[] {
    return this.packages.filter(p => p.isMajorUpdate());
  }

  get minor(): Package[] {
    return this.packages.filter(p => p.isMinorUpdate());
  }

  get patch(): Package[] {
    return this.packages.filter(p => p.isPatchUpdate());
  }

  getUpdateCommand(updateType: 'major' | 'minor' | 'patch'): string {
    if (this[updateType].length === 0) return '';
    return this[updateType].reduce(
      (t, c) => `${t} ${c.getLatestVersionInstallReference()}`,
      'npm install'
    );
  }

  getUpdateCommands(): { major: string; minor: string; patch: string } {
    return {
      major: this.getUpdateCommand('major'),
      minor: this.getUpdateCommand('minor'),
      patch: this.getUpdateCommand('patch')
    };
  }
}
