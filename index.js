const http = require('node:http');
const server = require('./server.js');
const { Request } = require('mbr-serv');

const PORT = 8070;

http.createServer(function (request, response) {
  server(new Request(request, response));
}).listen(PORT, function () {
  console.log('FS Dev Server is running on port ' + PORT);
});
