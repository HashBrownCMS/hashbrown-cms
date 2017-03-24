'use strict';

var LE = require('../').LE;
var le = LE.create({
  server: 'staging'
, acme: require('le-acme-core').ACME.create()
, store: require('le-store-certbot').create({
    configDir: '~/letsencrypt.test/etc/'
  , webrootPath: '~/letsencrypt.test/tmp/:hostname'
  })
, debug: true
});

// TODO test generateRsaKey code path separately
// and then provide opts.accountKeypair to create account

//var testId = Math.round(Date.now() / 1000).toString();
var testId = 'test1000';
var testEmail = 'coolaj86+le.' + testId + '@gmail.com';
var testAccountId = '939573edbf2506c92c9ab32131209d7b';

var tests = [
  function () {
    return le.core.accounts.checkAsync({
      accountId: testAccountId
    }).then(function (account) {
      if (!account) {
        throw new Error("Test account should exist when searched by account id.");
      }
    });
  }

, function () {
    return le.core.accounts.checkAsync({
      email: testEmail
    }).then(function (account) {
      console.log('account.regr');
      console.log(account.regr);
      if (!account) {
        throw new Error("Test account should exist when searched by email.");
      }
    });
  }
];

function run() {
  var test = tests.shift();
  if (!test) {
    console.info('All tests passed');
    return;
  }

  test().then(run);
}

run();
