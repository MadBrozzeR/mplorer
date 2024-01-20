import fs from 'node:fs/promises';
import type { Stats } from 'node:fs';
import { extract } from './zip';

const TRAIL_SLASH_RE = /\/+$/;
const TIPPED_SLASH_RE = /^\/+|\/+$/g;

class ThePath {
  root: string;
  path: string[] = [];

  constructor(root: string) {
    this.root = root.replace(TRAIL_SLASH_RE, '');
  }

  getPath() {
    const path = this.path.join('/');

    return path ? ('/' + path) : '';
  }

  async usePath(path: string) {
    const realRoot = await fs.realpath(this.root);
    const decodedPath = this.getPath() + path ? ('/' + decodeURIComponent(path)) : '';
    const realPath = await fs.realpath(realRoot + decodedPath);
    const isValid = realRoot === realPath
      || realPath.substring(0, realRoot.length + 1) === realRoot + '/';

    if (!isValid) {
      throw new Error('Out of root: ' + path);
    }

    const trimmedPath = realPath.substring(realRoot.length).replace(TIPPED_SLASH_RE, '');
    return trimmedPath ? trimmedPath.split('/') : [];
  }

  async update (path: string) {
    this.path = await this.usePath(path);

    return this;
  }

  getTip() {
    return this.path[this.path.length - 1] || '';
  }

  getExtension() {
    const file = this.getTip();
    const index = file.lastIndexOf('.');

    if (index > -1) {
      return file.substring(index + 1);
    }

    return '';
  }

  getFullPath() {
    return this.root + this.getPath();
  }

  readFile() {
    return fs.readFile(this.getFullPath());
  }
}

function statsToObj (stats: Stats) {
  return {
    name: null as string | null,
    type: stats.isDirectory() ? 'directory' : 'file',
    size: stats.size,
    atime: stats.atimeMs,
    ctime: stats.ctimeMs,
    mtime: stats.mtimeMs,
    birthtime: stats.birthtimeMs,
  }
}

async function getValidatedPath (path: string, root: string) {
  const realRoot = await fs.realpath(root);
  const decodedPath = path ? ('/' + decodeURIComponent(path)) : '';
  const realPath = await fs.realpath(realRoot + decodedPath);
  const isValid = realRoot === realPath
    || realPath.substring(0, realRoot.length + 1) === realRoot + '/';

  if (!isValid) {
    throw new Error('Out of root: ' + path);
  }

  return realPath;
}

const MIME: Record<string, string> = {
  'png': 'image/png',
  'svg': 'image/svg+xml',
};

class FS {
  path: ThePath;

  constructor(root: string) {
    this.path = new ThePath(root);
  }

  async readDir(path: string) {
    const fullPath = await this.getFullPath(path) + '/';

    const dir = await fs.readdir(fullPath);

    const stats = await Promise.all(dir.map(function (fileName) {
      const name = (fullPath + fileName);
      return fs.stat(name).then(statsToObj);
    }));

    for (let index = 0 ; index < dir.length ; ++index) {
      const stat = stats[index];

      if (stat) {
        stat.name = dir[index] || '';
      }
    }

    return stats;
  };

  async getFile(path: string) {
    await this.path.update(path);
    const extension = this.path.getExtension();

    try {
      const data = await this.path.readFile();

      return {
        path: path,
        name: this.path.getTip(),
        extension: extension,
        data: data,
        mime: MIME[extension] || null,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getFullPath(path: string) {
    await this.path.update(path);

    return this.path.getFullPath();
  }

  async unzip(path: string) {
    await this.path.update(path);

    if (this.path.getExtension() !== 'zip') {
      throw new Error('Not a ZIP file: ' + path);
    }

    const fullPath = this.path.getFullPath();
    const dirname = fullPath.substring(0, fullPath.length - 4);

    try {
      await fs.access(dirname);
      throw new Error('Directory exists');
    } catch (error) {
      if (error instanceof Error && error.message === 'Directory exists') {
        throw error;
      }

      const fileData = await this.path.readFile();

      return extract(fileData, dirname);
    }
  }
}

export { FS, getValidatedPath };
