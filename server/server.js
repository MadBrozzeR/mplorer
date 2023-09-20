const fs = require('node:fs/promises');
const { FS, getValidatedPath } = require('./fs.js');
const { AsyncMemo } = require('./utils.js');
const { getConfig } = require('./config.js');

const ROOT = __dirname + '/../client/';
const SRC_RE = /^\/src\/(.+)$/;
const FILES_RE = /^\/(fs|file|unzip)\/(\w+)\/(.*)$/;

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
  const realPath = await getValidatedPath(fileName, root);

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

async function prepareFS (user) {
  const config = await useConfig();
  const fsRoot = config.fsRoot.replace('${user}', user) + '/';

  return new FS(fsRoot);
}

async function getFiles (user, path) {
  const request = this;

  const files = await prepareFS(user);

  try {
    const content = await files.readDir(path);
    request.send(JSON.stringify(content), 'json');
  } catch (error) {
    console.log(error);
    get404(request);
  }
}

async function readFile (user, path) {
  const files = await prepareFS(user);
  const file = await files.getFile(path);
  this.headers['Content-Length'] = file.data.length;
  this.headers['Content-Disposition'] = 'attachment; filename="' + file.name +'"';
  this.send(file.data, file.extension);
}

async function unzipFile (user, path) {
  try {
    const files = await prepareFS(user);
    const file = await files.unzip(path);

    this.send();
  } catch (error) {
    this.status = 500;
    this.send();
  }
}

function manipulateFiles ([_, action, user, path]) {
  switch (action) {
    case 'fs':
      getFiles.call(this, user, path);
      break;
    case 'file':
      readFile.call(this, user, path);
      break;
    case 'unzip':
      unzipFile.call(this, user, path);
      break;
  }
}

const ROUTER = {
  '/': { GET: getIndex },
};

module.exports = function (request) {
  request.match(SRC_RE, getResource)
    || request.match(FILES_RE, manipulateFiles)
    || request.route(ROUTER)
    || get404(request);
};
