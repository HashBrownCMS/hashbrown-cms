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
var testCerts;

var tests = [
  function () {
    // TODO test that an altname also fetches the proper certificate
    return le.core.certificates.checkAsync({
      domains: testDomains
    }).then(function (certs) {
      if (!certs) {
        throw new Error("Either certificates.registerAsync (in previous test)"
          + " or certificates.checkAsync (in this test) failed.");
      }

      testCerts = certs;
      console.log('Issued At', new Date(certs.issuedAt).toISOString());
      console.log('Expires At', new Date(certs.expiresAt).toISOString());

      if (certs.expiresAt <= Date.now()) {
        throw new Error("Certificates are already expired. They cannot be tested for duplicate or forced renewal.");
      }
    });
  }

, function () {
    return le.core.certificates.renewAsync({
      email: testEmail
    , domains: testDomains
    }, testCerts).then(function () {
      throw new Error("Should not have renewed non-expired certificates.");
    }, function (err) {
      if ('E_NOT_RENEWABLE' !== err.code) {
        throw err;
      }
    });
  }

, function () {
    return le.core.certificates.renewAsync({
      email: testEmail
    , domains: testDomains
    , renewWithin: 720 * 24 * 60 * 60 * 1000
    }, testCerts).then(function (certs) {
      console.log('Issued At', new Date(certs.issuedAt).toISOString());
      console.log('Expires At', new Date(certs.expiresAt).toISOString());

      if (certs.issuedAt === testCerts.issuedAt) {
        throw new Error("Should not have returned existing certificates.");
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
