const fs = require('node:fs/promises');

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

const SPACE_RE = / /g;

function FS (root) {
  this.root = root;
}
FS.prototype.readDir = async function (path) {
  const dirName = decodeURIComponent(this.root + (path ? (path + '/') : ''));

  const dir = await fs.readdir(dirName);

  const stats = await Promise.all(dir.map(function (fileName) {
    const name = (dirName + fileName);
    return fs.stat(name).then(statsToObj);
  }));

  for (let index = 0 ; index < dir.length ; ++index) {
    stats[index].name = dir[index];
  }

  return stats;
};

module.exports = { FS };
