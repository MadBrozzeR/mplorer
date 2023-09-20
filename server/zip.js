const { MBRZip } = require('mbr-zip');
const fs = require('node:fs/promises');

function extract (data, directory) {
  const zip = new MBRZip(data);
  const promises = [];

  zip.iterate(async function (name, record) {
    const fullPath = directory + '/' + name;

    if (fullPath[fullPath.length - 1] !== '/') {
      promises.push(new Promise(function (resolve, reject) {
        record.extract(function (error, data) {
          if (error) {
            reject(error);
          }

          const slashIndex = fullPath.lastIndexOf('/');

          fs.mkdir(fullPath.substring(0, slashIndex), { recursive: true })
            .then(function () {
              return fs.writeFile(fullPath, data);
            })
            .then(resolve);
        });
      }))
    }
  });

  return Promise.all(promises);
}

module.exports = { extract };
