const fs = require('node:fs/promises');

const TRAIL_SLASH_RE = /\/+$/;
const MULTIPLE_SLASH_RE = /\/{2,}/g;
const TIPPED_SLASH_RE = /^\/+|\/+$/g;

function ThePath (root) {
  this.root = root.replace(TRAIL_SLASH_RE, '');
  this.path = [];
}
ThePath.prototype.usePath = async function (path) {
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
ThePath.prototype.update = async function (path) {
  this.path = await this.usePath(path);

  return this;
}
ThePath.prototype.getPath = function () {
  const path = this.path.join('/');

  return path ? ('/' + path) : '';
}
ThePath.prototype.getTip = function () {
  return this.path[this.path.length - 1] || '';
}
ThePath.prototype.getExtension = function () {
  const file = this.getTip();
  const index = file.lastIndexOf('.');

  if (index > -1) {
    return file.substring(index + 1);
  }

  return '';
}
ThePath.prototype.getFullPath = function () {
  return this.root + this.getPath();
}

function getExtension (file) {
  const index = file.lastIndexOf('.');

  if (index > -1) {
    return file.substring(index + 1);
  }

  return '';
}

function statsToObj (stats) {
  return {
    name: null,
    type: stats.isDirectory() ? 'directory' : 'file',
    size: stats.size,
    atime: stats.atimeMs,
    ctime: stats.ctimeMs,
    mtime: stats.mtimeMs,
    birthtime: stats.birthtimeMs,
  }
}

async function getValidatedPath (path, root) {
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

const SPACE_RE = / /g;

const MIME = {
  'png': 'image/png',
  'svg': 'image/svg+xml',
};

function FS (root) {
  this.path = new ThePath(root);
}
FS.prototype.readDir = async function (path) {
  const fullPath = await this.getFullPath(path) + '/';

  const dir = await fs.readdir(fullPath);

  const stats = await Promise.all(dir.map(function (fileName) {
    const name = (fullPath + fileName);
    return fs.stat(name).then(statsToObj);
  }));

  for (let index = 0 ; index < dir.length ; ++index) {
    stats[index].name = dir[index];
  }

  return stats;
};
FS.prototype.getFile = async function (path) {
  await this.path.update(path);
  const extension = this.path.getExtension();

  const data = await fs.readFile(this.path.getFullPath());

  return {
    path: path,
    name: this.path.getTip(),
    extension: extension,
    data: data,
    mime: MIME[extension] || null,
  };
}
FS.prototype.getFullPath = async function (path) {
  await this.path.update(path);

  return this.path.getFullPath();
}

module.exports = { FS, getValidatedPath };
