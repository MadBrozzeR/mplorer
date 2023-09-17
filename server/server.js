const fs = require('node:fs/promises');
const { FS } = require('./fs.js');
const { AsyncMemo } = require('./utils.js');
const { getConfig } = require('./config.js');

const ROOT = __dirname + '/../client/';
const SRC_RE = /^\/src\/(.+)$/;
const FILES_RE = /^\/fs\/(\w+)\/(.*)$/;

const CACHE = {
  'favicon.ico': 'max-age=604800',
};

const useConfig = AsyncMemo(getConfig());

function getPathParts (path) {
  const [name, params = ''] = path.split('?');
  const dotIndex = name.lastIndexOf('.');
  const extension = dotIndex > -1 ? name.substring(dotIndex + 1) : null;

  return { name, params, extension };
}

function get404 (request) {
  request.status = 404;
  request.send('404', 'html');
}

async function getFile (fileName, root) {
  const rootPath = await fs.realpath(root) + '/';
  const realPath = await fs.realpath(rootPath + fileName);

  if (realPath.substring(0, rootPath.length) !== rootPath) {
    throw new Error('Out of root: ' + fileName);
  }

  return await fs.readFile(realPath);
}

async function getResource (regMatch) {
  const request = this;
  const pathParts = getPathParts(regMatch[1]);

  try {
    if (request.request.method !== 'GET') {
      throw new Error('Not a GET');
    }

    const file = await getFile(pathParts.name, ROOT);

    if (pathParts.name in CACHE) {
      request.headers['Cache-Control'] = CACHE[pathParts.name];
    }

    request.send(file, pathParts.extension);
  } catch (error) {
    console.log(error);
    get404(request);
  }
}

async function getIndex (request) {
  request.send(await getFile('index.html', ROOT));
}

async function getFiles ([_, user, path]) {
  const request = this;
  const config = await useConfig();
  const fsRoot = config.fsRoot.replace('${user}', user) + '/';

  const files = new FS(fsRoot);

  try {
    const content = await files.readDir(path);
    request.send(JSON.stringify(content), 'json');
  } catch (error) {
    console.log(error);
    get404(request);
  }
}

const ROUTER = {
  '/': { GET: getIndex },
};

module.exports = function (request) {
  request.match(SRC_RE, getResource)
    || request.match(FILES_RE, getFiles)
    || request.route(ROUTER)
    || get404(request);
};
