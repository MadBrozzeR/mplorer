import fs from 'node:fs/promises';
import type { Request } from 'mbr-serv-request';
import { FS, getValidatedPath } from './fs';
import { AsyncMemo, wait } from './utils';
import { getConfig } from './config';
import { readTSFile } from './ts-transpiler';

const ROOT = __dirname + '/../client/';
const SRC_RE = /^\/src\/(.+)$/;
const FILES_RE = /^\/(fs|file|unzip)\/(\w+)\/(.*)$/;

const NODE_MODULES = __dirname + '/../node_modules/';

const CACHE: Record<string, string> = {
  'favicon.ico': 'max-age=604800',
};

const useConfig = AsyncMemo(getConfig());

function getPathParts (path: string) {
  let [name, params = ''] = path.split('?');
  const dotIndex = name.lastIndexOf('.');
  let extension = dotIndex > -1 ? name.substring(dotIndex + 1) : null;

  if (!extension) {
    name += '.ts';
    extension = 'ts';
  }

  return { name, params, extension };
}

function get404 (request: Request) {
  request.status = 404;
  request.send('404', 'html');
}

async function getFile (fileName: string, root: string) {
  const realPath = await getValidatedPath(fileName, root);

  return await fs.readFile(realPath);
}

async function getResource (this: Request, regMatch: RegExpExecArray) {
  const request = this;
  const pathParts = getPathParts(regMatch[1]);

  try {
    if (request.request.method !== 'GET') {
      throw new Error('Not a GET');
    }

    let file: Buffer | string = await getFile(pathParts.name, ROOT);
    let extension = pathParts.extension;

    if (pathParts.extension === 'ts') {
      file = await readTSFile(file);
      extension = 'js';
    }

    if (pathParts.name in CACHE) {
      request.headers['Cache-Control'] = CACHE[pathParts.name];
    }

    request.send(file, extension || '');
  } catch (error) {
    console.log(error);
    get404(request);
  }
}

async function getIndex (request: Request) {
  request.send(await getFile('index.html', ROOT));
}

async function prepareFS (user: string) {
  const config = await useConfig();
  const fsRoot = config.fsRoot.replace('${user}', user) + '/';

  return new FS(fsRoot);
}

async function getFiles (this: Request, user: string, path: string) {
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

async function readFile (this: Request, user: string, path: string) {
  const files = await prepareFS(user);
  const file = await files.getFile(path);
  this.headers['Content-Length'] = file.data.length.toString();
  this.headers['Content-Disposition'] = 'attachment; filename="' + encodeURIComponent(file.name) +'"';
  this.send(file.data, file.extension);
}

async function unzipFile (this: Request, user: string, path: string) {
  try {
    const files = await prepareFS(user);
    const file = await files.unzip(path);

    this.send();
  } catch (error) {
    this.status = 500;
    this.send();
  }
}

function manipulateFiles (this: Request, [_, action, user, path]: RegExpExecArray) {
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
  '/src/splux.js': NODE_MODULES + 'splux/index.js',
  '/src/mbr-style.js': NODE_MODULES + 'mbr-style/index.js',
  '/src/mbr-state.js': NODE_MODULES + 'mbr-state/index.js',
};

module.exports = async function (request: Request) {
  const config = await useConfig();
  await wait(config.responseDelay || 0);

  request.route(ROUTER)
    || request.match(SRC_RE, getResource)
    || request.match(FILES_RE, manipulateFiles)
    || get404(request);
};
