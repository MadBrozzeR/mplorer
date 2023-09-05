const fs = require('node:fs/promises');
const { template } = require('../../tools/hypermark/hypermark.js');

const ROOT = __dirname + '/html';

function getExtension (fileName) {
  const index = fileName.lastIndexOf('.');

  if (index > -1) {
    return fileName.substring(index + 1);
  }

  return '';
}

async function getIndex (request) {
  try {
    const index = await template(ROOT + '/index.html', { title: 'Hello!' });

    request.send(index, 'html');
  } catch (error) {
    console.log(error);

    request.status = 500;
    request.send();
  }
}

async function getSource (match) {
  const request = this;
  const path = ROOT + '/src/' + match[1];

  try {
    const file = await fs.readFile(path);
    request.send(file, getExtension(path));
  } catch (error) {
    console.log('Error in accessing file (' + match + '):', error);

    request.status = 404;
    request.send();
  }
}

function getFavicon () {
  this.send();
}

module.exports = { getIndex, getSource, getFavicon };
