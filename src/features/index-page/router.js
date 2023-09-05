const { getIndex, getSource, getFavicon } = require('./index-page.js');

const SOURCE_RE = /^\/src\/(.+)(\?.+)?$/

const ROUTER = {
  '/': { GET: getIndex },
  '/favicon.ico': { GET: getFavicon },
};

module.exports = function (request) {
  return request.match(SOURCE_RE, getSource) || request.route(ROUTER);
};
