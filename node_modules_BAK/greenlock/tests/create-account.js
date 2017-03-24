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

//var testId = Math.round(Date.now() / 1000).toString();
var testId = 'test1000';
var fakeEmail = 'coolaj86+le.' + testId + '@example.com';
var testEmail = 'coolaj86+le.' + testId + '@gmail.com';
var testAccount;

var tests = [
  function () {
    return le.core.accounts.checkAsync({
      email: testEmail
    }).then(function (account) {
      if (account) {
        console.error(account);
        throw new Error("Test account should not exist.");
      }
    });
  }
, function () {
    return le.core.accounts.registerAsync({
      email: testEmail
    , agreeTos: false
    , rsaKeySize: 2048
    }).then(function (/*account*/) {
      throw new Error("Should not register if 'agreeTos' is not truthy.");
    }, function (err) {
      if (err.code !== 'E_ARGS') {
        throw err;
      }
    });
  }
, function () {
    return le.core.accounts.registerAsync({
      email: testEmail
    , agreeTos: true
    , rsaKeySize: 1024
    }).then(function (/*account*/) {
      throw new Error("Should not register if 'rsaKeySize' is less than 2048.");
    }, function (err) {
      if (err.code !== 'E_ARGS') {
        throw err;
      }
    });
  }
, function () {
    return le.core.accounts.registerAsync({
      email: fakeEmail
    , agreeTos: true
    , rsaKeySize: 2048
    }).then(function (/*account*/) {
      // TODO test mx record
      throw new Error("Registration should NOT succeed with a bad email address.");
    }, function (err) {
      if (err.code !== 'E_EMAIL') {
        throw err;
      }
    });
  }
, function () {
    return le.core.accounts.registerAsync({
      email: testEmail
    , agreeTos: true
    , rsaKeySize: 2048
    }).then(function (account) {
      testAccount = account;

      console.log(testEmail);
      console.log(testAccount);

      if (!account) {
        throw new Error("Registration should always return a new account.");
      }
      if (!account.email) {
        throw new Error("Registration should return the email.");
      }
      if (!account.id) {
        throw new Error("Registration should return the account id.");
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
