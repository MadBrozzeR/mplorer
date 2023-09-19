const { MBRZip } = require('mbr-zip');
const fs = require('node:fs/promises');

function extract (data, directory) {
  const zip = MBRZip(data);

  zip.iterare(function (name, record) {
    
  });
}
