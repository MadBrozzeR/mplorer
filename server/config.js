const fs = require('node:fs/promises');

const FILE = {
  CONFIG: __dirname + '/../config.json',
  EXAMPLE: __dirname + '/../config.example.json',
};

async function getConfig () {
  let file;

  try {
    file = await fs.readFile(FILE.CONFIG);
  } catch (error) {
    try {
      file = await fs.readFile(FILE.EXAMPLE);
    } catch (error) {
      console.log('Failed to read config file');
    }
  }

  if (file) {
    try {
      return JSON.parse(file.toString());
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

module.exports = { getConfig };
