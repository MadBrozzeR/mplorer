const fs = require('node:fs/promises');

const KEY_RE = /\$\{(\w+)\}/g;

module.exports.template = function (file, substitutions) {
  return fs.readFile(file)
    .then(function (data) {
      if (substitutions instanceof Object) {
        return data.toString().replace(KEY_RE, function (value, key) {
          return substitutions[key] || value;
        });
      }

      return data.toString();
    });
}
