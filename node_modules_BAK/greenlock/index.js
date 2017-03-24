'use strict';

var DAY = 24 * 60 * 60 * 1000;
//var MIN = 60 * 1000;
var ACME = require('le-acme-core').ACME;

var LE = module.exports;
LE.LE = LE;
// in-process cache, shared between all instances
var ipc = {};

function _log(debug) {
  if (debug) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.unshift("[le/index.js]");
    console.log.apply(console, args);
  }
}

LE.defaults = {
  productionServerUrl: ACME.productionServerUrl
, stagingServerUrl: ACME.stagingServerUrl

, rsaKeySize: ACME.rsaKeySize || 2048
, challengeType: ACME.challengeType || 'http-01'
, challengeTypes: ACME.challengeTypes || [ 'http-01', 'tls-sni-01', 'dns-01' ]

, acmeChallengePrefix: ACME.acmeChallengePrefix
};

// backwards compat
Object.keys(LE.defaults).forEach(function (key) {
  LE[key] = LE.defaults[key];
});

// show all possible options
var u; // undefined
LE._undefined = {
  acme: u
, store: u
, challenge: u
, challenges: u
, sni: u
, httpsOptions: u

, register: u
, check: u

, renewWithin: u // le-auto-sni and core
//, renewBy: u // le-auto-sni
, acmeChallengePrefix: u
, rsaKeySize: u
, challengeType: u
, server: u
, agreeToTerms: u
, _ipc: u
, duplicate: u
, _acmeUrls: u
};
LE._undefine = function (le) {
  Object.keys(LE._undefined).forEach(function (key) {
    if (!(key in le)) {
      le[key] = u;
    }
  });

  return le;
};
LE.create = function (le) {
  var PromiseA = require('bluebird');

  le.acme = le.acme || ACME.create({ debug: le.debug });
  le.store = le.store || require('le-store-certbot').create({ debug: le.debug });
  le.core = require('./lib/core');
  var log = le.log || _log;

  if (!le.challenges) {
    le.challenges = {};
  }
  if (!le.challenges['http-01']) {
    le.challenges['http-01'] = require('le-challenge-fs').create({ debug: le.debug });
  }
  if (!le.challenges['tls-sni-01']) {
    le.challenges['tls-sni-01'] = require('le-challenge-sni').create({ debug: le.debug });
  }
  if (!le.challenges['dns-01']) {
    try {
      le.challenges['dns-01'] = require('le-challenge-ddns').create({ debug: le.debug });
    } catch(e) {
      try {
        le.challenges['dns-01'] = require('le-challenge-dns').create({ debug: le.debug });
      } catch(e) {
        // not yet implemented
      }
    }
  }

  le = LE._undefine(le);
  le.acmeChallengePrefix = LE.acmeChallengePrefix;
  le.rsaKeySize = le.rsaKeySize || LE.rsaKeySize;
  le.challengeType = le.challengeType || LE.challengeType;
  le._ipc = ipc;
  le.agreeToTerms = le.agreeToTerms || function (args, agreeCb) {
    agreeCb(new Error("'agreeToTerms' was not supplied to LE and 'agreeTos' was not supplied to LE.register"));
  };

  if (!le.renewWithin) { le.renewWithin = 7 * DAY; }
  // renewBy has a default in le-sni-auto

  if (!le.server) {
    throw new Error("opts.server must be set to 'staging' or a production url, such as LE.productionServerUrl'");
  }
  if ('staging' === le.server) {
    le.server = LE.stagingServerUrl;
  }
  else if ('production' === le.server) {
    le.server = LE.productionServerUrl;
  }

  if (le.acme.create) {
    le.acme = le.acme.create(le);
  }
  le.acme = PromiseA.promisifyAll(le.acme);
  le._acmeOpts = le.acme.getOptions();
  Object.keys(le._acmeOpts).forEach(function (key) {
    if (!(key in le)) {
      le[key] = le._acmeOpts[key];
    }
  });

  if (le.store.create) {
    le.store = le.store.create(le);
  }
  le.store = PromiseA.promisifyAll(le.store);
  le.store.accounts = PromiseA.promisifyAll(le.store.accounts);
  le.store.certificates = PromiseA.promisifyAll(le.store.certificates);
  le._storeOpts = le.store.getOptions();
  Object.keys(le._storeOpts).forEach(function (key) {
    if (!(key in le)) {
      le[key] = le._storeOpts[key];
    }
  });


  //
  // Backwards compat for <= v2.1.7
  //
  if (le.challenge) {
    console.warn("Deprecated use of le.challenge. Use le.challenges['" + LE.challengeType + "'] instead.");
    le.challenges[le.challengeType] = le.challenge;
  }

  LE.challengeTypes.forEach(function (challengeType) {
    var challenger = le.challenges[challengeType];

    if (!challenger) {
      return;
    }

    if (challenger.create) {
      challenger = le.challenges[challengeType] = challenger.create(le);
    }
    challenger = le.challenges[challengeType] = PromiseA.promisifyAll(challenger);
    le['_challengeOpts_' + challengeType] = challenger.getOptions();
    Object.keys(le['_challengeOpts_' + challengeType]).forEach(function (key) {
      if (!(key in le)) {
        le[key] = le['_challengeOpts_' + challengeType][key];
      }
    });

    // TODO wrap these here and now with tplCopy?
    if (!challenger.set || 5 !== challenger.set.length) {
      throw new Error("le.challenges[" + challengeType + "].set receives the wrong number of arguments."
        + " You must define setChallenge as function (opts, domain, token, keyAuthorization, cb) { }");
    }
    if (challenger.get && 4 !== challenger.get.length) {
      throw new Error("le.challenges[" + challengeType + "].get receives the wrong number of arguments."
        + " You must define getChallenge as function (opts, domain, token, cb) { }");
    }
    if (!challenger.remove || 4 !== challenger.remove.length) {
      throw new Error("le.challenges[" + challengeType + "].remove receives the wrong number of arguments."
        + " You must define removeChallenge as function (opts, domain, token, cb) { }");
    }

    if (!le._challengeWarn && (!challenger.loopback || 4 !== challenger.loopback.length)) {
      le._challengeWarn = true;
      console.warn("le.challenges[" + challengeType + "].loopback should be defined as function (opts, domain, token, cb) { ... } and should prove (by external means) that the ACME server challenge '" + challengeType + "' will succeed");
    }
    else if (!le._challengeWarn && (!challenger.test || 5 !== challenger.test.length)) {
      le._challengeWarn = true;
      console.warn("le.challenges[" + challengeType + "].test should be defined as function (opts, domain, token, keyAuthorization, cb) { ... } and should prove (by external means) that the ACME server challenge '" + challengeType + "' will succeed");
    }
  });

  le.sni = le.sni || null;
  if (!le.httpsOptions) {
    le.httpsOptions = {};
  }
  if (!le.httpsOptions.SNICallback) {
    if (!le.getCertificatesAsync && !le.getCertificates) {
      if (Array.isArray(le.approveDomains)) {
        le.approvedDomains = le.approveDomains;
        le.approveDomains = null;
      }
      if (!le.approveDomains) {
        le.approvedDomains = le.approvedDomains || [];
        le.approveDomains = function (lexOpts, certs, cb) {
          if (!(le.approvedDomains.length && le.email && le.agreeTos)) {
            throw new Error("le-sni-auto is not properly configured. Missing one or more of approveDomains(domain, certs, callback) or approvedDomains (array), email, or agreeTos");
          }
          if (lexOpts.domains.every(function (domain) {
            return -1 !== le.approvedDomains.indexOf(domain);
          })) {
            lexOpts.domains = le.approvedDomains.slice(0);
            lexOpts.email = le.email;
            lexOpts.agreeTos = le.agreeTos;
            return cb(null, { options: lexOpts, certs: certs });
          }
          log(le.debug, 'unapproved domain', lexOpts.domains, le.approvedDomains);
          cb(new Error("unapproved domain"));
        };
      }

      le.getCertificates = function (domain, certs, cb) {
        // certs come from current in-memory cache, not lookup
        log(le.debug, 'le.getCertificates called for', domain, 'with certs for', certs && certs.altnames || 'NONE');
        var opts = { domain: domain, domains: certs && certs.altnames || [ domain ] };

        le.approveDomains(opts, certs, function (_err, results) {
          if (_err) {
            log(le.debug, 'le.approveDomains called with error', _err);
            cb(_err);
            return;
          }

          log(le.debug, 'le.approveDomains called with certs for', results.certs && results.certs.altnames || 'NONE', 'and options:');
          log(le.debug, results.options);

          var promise;

          if (results.certs) {
            log(le.debug, 'le renewing');
            promise = le.core.certificates.renewAsync(results.options, results.certs);
          }
          else {
            log(le.debug, 'le getting from disk or registering new');
            promise = le.core.certificates.getAsync(results.options);
          }

          return promise.then(function (certs) { cb(null, certs); }, cb);
        });
      };
    }
    le.sni = le.sni || require('le-sni-auto');
    if (le.sni.create) {
      le.sni = le.sni.create(le);
    }
    le.httpsOptions.SNICallback = le.sni.sniCallback;
  }
  if (!le.httpsOptions.key || !le.httpsOptions.cert) {
    le.httpsOptions = require('localhost.daplie.com-certificates').merge(le.httpsOptions);
  }
  /*
  le.sni = PromiseA.promisifyAll(le.sni);
  le._sniOpts = le.sni.getOptions();
  Object.keys(le._sniOpts).forEach(function (key) {
    if (!(key in le)) {
      le[key] = le._sniOpts[key];
    }
  });
  */

  if (le.core.create) {
    le.core = le.core.create(le);
  }

  le.renew = function (args, certs) {
    return le.core.certificates.renewAsync(args, certs);
  };

  le.register = function (args) {
    return le.core.certificates.getAsync(args);
  };

  le.check = function (args) {
    // TODO must return email, domains, tos, pems
    return le.core.certificates.checkAsync(args);
  };

  le.middleware = le.middleware || require('./lib/middleware');
  if (le.middleware.create) {
    le.middleware = le.middleware.create(le);
  }

  return le;
};
