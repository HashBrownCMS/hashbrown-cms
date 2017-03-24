'use strict';

var DAY = 24 * 60 * 60 * 1000;
var MIN = 60 * 1000;
var defaults = {
  // don't renew before the renewWithin period
  renewWithin: 7 * DAY
, _renewWithinMin: 3 * DAY
  // renew before the renewBy period
, renewBy: 2 * DAY
, _renewByMin: Math.floor(DAY / 2)
  // just to account for clock skew really
, _dropDead: 5 * MIN
};

// autoSni = { renewWithin, renewBy, getCertificates, tlsOptions, _dbg_now }
module.exports.create = function (autoSni) {

  if (!autoSni.getCertificatesAsync) { autoSni.getCertificatesAsync = require('bluebird').promisify(autoSni.getCertificates); }
  if (!autoSni.renewWithin) { autoSni.renewWithin = autoSni.notBefore || defaults.renewWithin; }
  if (autoSni.renewWithin < defaults._renewWithinMin) {
    throw new Error("options.renewWithin should be at least 3 days");
  }
  if (!autoSni.renewBy) { autoSni.renewBy = autoSni.notAfter || defaults.renewBy; }
  if (autoSni.renewBy < defaults._renewByMin) {
    throw new Error("options.renewBy should be at least 12 hours");
  }
  if (!autoSni.tlsOptions) { autoSni.tlsOptions = autoSni.httpsOptions || {}; }




  autoSni._dropDead = defaults._dropDead;
  //autoSni.renewWithin = autoSni.notBefore;                          // i.e. 15 days
  autoSni._renewWindow = autoSni.renewWithin - autoSni.renewBy;      // i.e. 1 day
  //autoSni.renewRatio = autoSni.notBefore = autoSni._renewWindow;   // i.e. 1/15 (6.67%)




  var tls = require('tls');




  var _autoSni = {




    // in-process cache
    _ipc: {}
  , getOptions: function () {
      return JSON.parse(JSON.stringify(defaults));
    }




    // cache and format incoming certs
  , cacheCerts: function (certs) {
      var meta = {
        certs: certs
      , tlsContext: 'string' === typeof certs.cert && tls.createSecureContext({
          key: certs.privkey
        , cert: certs.cert + certs.chain
        , rejectUnauthorized: autoSni.tlsOptions.rejectUnauthorized

        , requestCert: autoSni.tlsOptions.requestCert  // request peer verification
        , ca: autoSni.tlsOptions.ca                    // this chain is for incoming peer connctions
        , crl: autoSni.tlsOptions.crl                  // this crl is for incoming peer connections
        }) || { '_fake_tls_context_': true }

      , subject: certs.subject
      , auto: 'undefined' === typeof certs.auto ? true : certs.auto
        // stagger renewal time by a little bit of randomness
      , renewAt: (certs.expiresAt - (autoSni.renewWithin - (autoSni._renewWindow * Math.random())))
        // err just barely on the side of safety
      , expiresNear: certs.expiresAt - autoSni._dropDead
      };
      var link = { subject: certs.subject };

      certs.altnames.forEach(function (domain) {
        autoSni._ipc[domain] = link;
      });
      autoSni._ipc[certs.subject] = meta;

      return meta;
    }




  , uncacheCerts: function (certs) {
      certs.altnames.forEach(function (domain) {
        delete autoSni._ipc[domain];
      });
      delete autoSni._ipc[certs.subject];
    }




    // automate certificate registration on request
  , sniCallback: function (domain, cb) {
      var certMeta = autoSni._ipc[domain];
      var promise;
      var now = (autoSni._dbg_now || Date.now());

      if (certMeta && !certMeta.then && certMeta.subject !== domain) {
        //log(autoSni.debug, "LINK CERT", domain);
        certMeta = autoSni._ipc[certMeta.subject];
      }

      if (!certMeta) {
        //log(autoSni.debug, "NO CERT", domain);
        // we don't have a cert and must get one
        promise = autoSni.getCertificatesAsync(domain, null).then(autoSni.cacheCerts);
        autoSni._ipc[domain] = promise;
      }
      else if (certMeta.then) {
        //log(autoSni.debug, "PROMISED CERT", domain);
        // we are already getting a cert
        promise = certMeta
      }
      else if (now >= certMeta.expiresNear) {
        //log(autoSni.debug, "EXPIRED CERT");
        // we have a cert, but it's no good for the average user
        promise = autoSni.getCertificatesAsync(domain, certMeta.certs).then(autoSni.cacheCerts);
        autoSni._ipc[certMeta.subject] = promise;
      } else {

        // it's time to renew the cert
        if (certMeta.auto && now >= certMeta.renewAt) {
          //log(autoSni.debug, "RENEWABLE CERT");
          // give the cert some time (2-5 min) to be validated and replaced before trying again
          certMeta.renewAt = (autoSni._dbg_now || Date.now()) + (2 * MIN) + (3 * MIN * Math.random());
          // let the update happen in the background
          autoSni.getCertificatesAsync(domain, certMeta.certs).then(autoSni.cacheCerts);
        }

        // return the valid cert right away
        cb(null, certMeta.tlsContext);
        return;
      }

      // promise the non-existent or expired cert
      promise.then(function (certMeta) {
        cb(null, certMeta.tlsContext);
      }, function (err) {
        console.error('ERROR in le-sni-auto:');
        console.error(err.stack || err);
        cb(err);
        // don't reuse this promise
        delete autoSni._ipc[certMeta && certMeta.subject ? certMeta.subject : domain];
      });
    }




  };

  Object.keys(_autoSni).forEach(function (key) {
    autoSni[key] = _autoSni[key];
  });
  _autoSni = null;

  return autoSni;
};
