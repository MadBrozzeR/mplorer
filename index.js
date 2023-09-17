const http = require('node:http');
const server = require('./server.js');
const { Request } = require('mbr-serv');

const PORT = 8070;

function wait (delay) {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
}

http.createServer(function (request, response) {
  console.log(request.method, '>', request.url);
  wait(500).then(function () {
    server(new Request(request, response));
  });
}).listen(PORT, function () {
  console.log('FS Dev Server is running on port ' + PORT);
});
