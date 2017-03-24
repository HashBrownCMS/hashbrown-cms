'use strict';

var LE = require('../').LE;
var le = LE.create({
  server: 'staging'
, acme: require('le-acme-core').ACME.create()
, store: require('le-store-certbot').create({
    configDir: '~/letsencrypt.test/etc'
  , webrootPath: '~/letsencrypt.test/var/:hostname'
  })
, challenge: require('le-challenge-fs').create({
    webrootPath: '~/letsencrypt.test/var/:hostname'
  })
, debug: true
});

// TODO test generateRsaKey code path separately
// and then provide opts.accountKeypair to create account

//var testId = Math.round(Date.now() / 1000).toString();
var testId = 'test1000';
var testEmail = 'coolaj86+le.' + testId + '@gmail.com';
// TODO integrate with Daplie Domains for junk domains to test with
var testDomains = [ 'pokemap.hellabit.com', 'www.pokemap.hellabit.com' ];

var tests = [
  function () {
    return le.core.certificates.checkAsync({
      domains: [ 'example.com', 'www.example.com' ]
    }).then(function (cert) {
      if (cert) {
        throw new Error("Bogus domain should not have certificate.");
      }
    });
  }

, function () {
    return le.core.certificates.getAsync({
      email: testEmail
    , domains: testDomains
    }).then(function (certs) {
      if (!certs) {
        throw new Error("Should have acquired certificate for domains.");
      }
    });
  }
];

function run() {
  //var express = require(express);
  var server = require('http').createServer(le.middleware());
  server.listen(80, function () {
    console.log('Server running, proceeding to test.');

    function next() {
      var test = tests.shift();
      if (!test) {
        server.close();
        console.info('All tests passed');
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
