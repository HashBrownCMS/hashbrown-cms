'use strict';

var https = require('https');
var httpsOptions = require('./');
var server = https.createServer(httpsOptions).create();
var port = process.argv[2] || 8443;

server.on('request', function (req, res) {
  res.end('[' + req.method + ']' + ' ' + req.url);
});
server.listen(port, function () {
  console.log('Listening', server.address());
  console.log('<https://localhost.daplie.com:' + server.address().port + '/>');
});
