'use strict';

var generate = require("./").generate;
var getCertInfo = require('certpem').info;

var opts = {};
var domain = 'example.com';
var token = 'token-id';
var key = 'secret-key';

opts.challengeType = "tls-sni-01";
generate(opts, domain, token, key, function(err, certs) {
  if (err) {
    throw err;
  }

  commonValidation(certs, opts.challengeType);
  if (certs.altnames.length !== 1) {
    throw new Error("FAIL: wrong number of alternative names for tls-sni-01");
  }

  opts.challengeType = "tls-sni-02";
  generate(opts, domain, token, key, function(err, certs) {
    if (err) {
      throw err;
    }

    commonValidation(certs, opts.challengeType);
    if (certs.altnames[0] === certs.altnames[1]) {
      throw new Error("FAIL: alternative names are the same for tls-sni-02");
    }
    if (certs.altnames.length !== 2) {
      throw new Error("FAIL: wrong number of alternative names for tls-sni-02");
    }

    console.info("PASS");
  });

});

function commonValidation(certs, type) {
  var certInfo = getCertInfo(certs.cert);
  if (certInfo.subject !== certs.subject) {
    throw new Error("FAIL: mismatching subject for " + type);
  }
  if (certInfo.altnames.length !== certs.altnames.length) {
    throw new Error("FAIL: mismatching number of alternative names for " + type);
  }
  certInfo.altnames.forEach(function(domain) {
    if (certs.altnames.indexOf(domain) === -1) {
      throw new Error("FAIL: mismatching alternative names for " + type);
    }
  });
  if (!timeMatches(certInfo.issuedAt,certs.issuedAt)) {
    throw new Error("FAIL: mismatching issuance time for " + type);
  }
  if (!timeMatches(certInfo.expiresAt,certs.expiresAt)) {
    throw new Error("FAIL: mismatching expiry time for " + type);
  }
  if (certInfo.issuedAt >= Date.now()) {
    throw new Error("FAIL: issued in the future for " + type);
  }
  if (certInfo.expiresAt <= Date.now()) {
    throw new Error("FAIL: expiry in the past for " + type);
  }
}

function timeMatches(time1, time2) {
  return Math.abs(time1 - time2) < 1000;
}
