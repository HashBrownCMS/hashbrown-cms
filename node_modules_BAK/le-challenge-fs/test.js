'use strict';

//var httpsOptions = require('localhost.daplie.com-certificates').merge({});
var webrootPath = '/tmp/acme-challenge';
var challenge = require('./').create({ debug: true, webrootPath: webrootPath });

var opts = challenge.getOptions();
var domain = 'example.com';
var token = 'token-id';
var key = 'secret-key';

challenge.remove(opts, domain, token, function () {
  // ignore error, if any

  challenge.set(opts, domain, token, key, function (err) {
    // if there's an error, there's a problem
    if (err) { throw err; }

    // throw new Error("manually check /tmp/acme-challenge");

    challenge.get(opts, domain, token, function (err, _key) {
      // if there's an error, there's a problem
      if (err) { throw err; }

      // should retrieve the key
      if (key !== _key) {
        throw new Error("FAIL: could not get key by token");
      }

      challenge.remove(opts, domain, token, function () {
        // if there's an error, there's a problem
        if (err) { throw err; }

        challenge.get(opts, domain, token, function (err, _key) {
          // error here is okay

          // should NOT retrieve the key
          if (_key) {
            throw new Error("FAIL: should not get key");
          }

          console.info('[PASS] unit test');
        });
      });
    });
  });
});

function loopbackTest() {
  var http = require('http');
  var serveStatic = require('serve-static')(webrootPath, { dotfiles: 'allow' });
  var finalhandler = require('finalhandler');
  var server = http.createServer(function (req, res) {
    req.url = req.url.replace(/^\/\.well-known\/acme-challenge\//, '/');
    serveStatic(req, res, finalhandler(req, res));
  });

  server.listen(0, function () {
    var port = server.address().port;

    opts.webrootPath = webrootPath;
    opts.loopbackPort = port;
    opts.loopbackTimeout = 500;
    challenge.test(opts, 'localhost', 'foo', 'bar', function (err) {
      server.close();
      if (err) { console.error(err.stack); return; }

      console.info('[PASS] localhost loopback');
    });
  });
}
loopbackTest();
