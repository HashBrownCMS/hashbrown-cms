'use strict';

var challenge = require('./').create({});

var opts = challenge.getOptions();
var domain = 'example.com';
var token = 'token-id';
var key = 'secret-key';

var sni = opts.sni = {
  _cached: {}
, cacheCerts: function (certs) {
    sni._cached[certs.subject] = certs;
    certs.altnames.forEach(function(domain) {
      sni._cached[domain] = certs;
    });
  }
, uncacheCerts: function (certs) {
    delete sni._cached[certs.subject];
    certs.altnames.forEach(function(domain) {
      delete sni._cached[domain];
    });
  }
, numberCached: function () {
    var n = 0;
    for (key in sni._cached) { if (sni._cached.hasOwnProperty(key)) {
      n++;
    }}
    return n;
  }
};

var test2 = makeTest("tls-sni-02");
var test1 = makeTest("tls-sni-01", test2);
test1();

function makeTest(type, next) {
  return function() {

    opts.challengeType = type;

    challenge.set(opts, domain, token, key, function (err) {
      // if there's an error, there's a problem
      if (err) {
        throw err;
      }
    
      if (!sni.numberCached()) {
        throw new Error("FAIL: certificate(s) not cached");
      }
    
      challenge.remove(opts, domain, token, function () {
        // if there's an error, there's a problem
        if (err) {
          throw err;
        }
    
        if (sni.numberCached()) {
          throw new Error("FAIL: certificate(s) not uncached");
        }
    
        if (next) {
          next()
        } else {
          console.info('PASS');
        }
      });
    });

  };
}
