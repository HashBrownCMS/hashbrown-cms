'use strict';

var PromiseA = require('bluebird');
var path = require('path');
var requestAsync = PromiseA.promisify(require('request'));
var LE = require('../').LE;
var le = LE.create({
  server: 'staging'
, acme: require('le-acme-core').ACME.create()
, store: require('le-store-certbot').create({
    configDir: '~/letsencrypt.test/etc'.split('/').join(path.sep)
  , webrootPath: '~/letsencrypt.test/var/:hostname'.split('/').join(path.sep)
  })
, challenge: require('le-challenge-fs').create({
    webrootPath: '~/letsencrypt.test/var/:hostname'.split('/').join(path.sep)
  })
, debug: true
});
var utils = require('../lib/utils');

if ('/.well-known/acme-challenge/' !== LE.acmeChallengePrefix) {
  throw new Error("Bad constant 'acmeChallengePrefix'");
}

var baseUrl;
// could use localhost as well, but for the sake of an FQDN for testing, we use this
// also, example.com is just a junk domain to make sure that it is ignored
// (even though it should always be an array of only one element in lib/core.js)
var domains = [ 'localhost.daplie.com', 'example.com' ]; // or just localhost
var token = 'token-id';
var secret = 'key-secret';

var tests = [
  function () {
    console.log('Test Url:', baseUrl + token);
    return requestAsync({ url: baseUrl + token }).then(function (req) {
      if (404 !== req.statusCode) {
        console.log(req.statusCode);
        throw new Error("Should be status 404");
      }
    });
  }

, function () {
    var copy = utils.merge({ domains: domains }, le);
    copy = utils.tplCopy(copy);
    return PromiseA.promisify(le.challenge.set)(copy, domains[0], token, secret);
  }

, function () {
    return requestAsync(baseUrl + token).then(function (req) {
      if (200 !== req.statusCode) {
        console.log(req.statusCode, req.body);
        throw new Error("Should be status 200");
      }

      if (req.body !== secret) {
        console.error(token, secret, req.body);
        throw new Error("req.body should be secret");
      }
    });
  }

, function () {
    var copy = utils.merge({ domains: domains }, le);
    copy = utils.tplCopy(copy);
    return PromiseA.promisify(le.challenge.remove)(copy, domains[0], token);
  }

, function () {
    return requestAsync(baseUrl + token).then(function (req) {
      if (404 !== req.statusCode) {
        console.log(req.statusCode);
        throw new Error("Should be status 404");
      }
    });
  }
];

function run() {
  //var express = require(express);
  var server = require('http').createServer(le.middleware());
  server.listen(0, function () {
    console.log('Server running, proceeding to test.');
    baseUrl = 'http://' + domains[0] + ':' + server.address().port + LE.acmeChallengePrefix;

    function next() {
      var test = tests.shift();
      if (!test) {
        console.info('All tests passed');
        server.close();
        return;
      }

      test().then(next, function (err) {
        console.error('ERROR');
        console.error(err.stack);
        server.close();
      });
    }

    next();
  });
}

run();
