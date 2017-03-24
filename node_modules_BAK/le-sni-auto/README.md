le-sni-auto
===========

An auto-sni strategy for registering and renewing letsencrypt certificates using SNICallback.

This does a couple of rather simple things:

  * caches certificates in memory
  * calls `getCertificatesAsync(domain, null)` when a certificate is not in memory
  * calls `getCertificatesASync(domain, certs)` when a certificate is up for renewal or expired

Install
=======

```bash
npm install --save le-sni-auto@2.x
```

Usage
=====

With node-letsencrypt
---------------------

```javascript
'use strict';



var leSni = require('le-sni-auto').create({

  renewWithin: 10 * 24 * 60 * 60 1000       // do not renew more than 10 days before expiration
, renewBy: 5 * 24 * 60 * 60 1000         // do not wait more than 5 days before expiration

, tlsOptions: {
    rejectUnauthorized: true              // These options will be used with tls.createSecureContext()
  , requestCert: false                    // in addition to key (privkey.pem) and cert (cert.pem + chain.pem),
  , ca: null                              // which are provided by letsencrypt
  , crl: null
  }

});



var le = require('letsencrypt').create({
  server: 'staging'

, sni: leSni

, approveDomains: function (domain, cb) {
    // here you would lookup details such as email address in your db
    cb(null, { email: 'john.doe@gmail.com.', domains: [domain, 'www.' + domain], agreeTos: true }}
  }
});



var redirectHttps = require('redirect-https').create();
http.createServer(le.middleware(redirectHttps));



var app = require('express')();
https.createServer(le.httpsOptions, le.middleware(app)).listen(443);
```

You can also provide a thunk-style `getCertificates(domain, certs, cb)`.

Standalone
----------

```javascript
'use strict';



var leSni = require('le-sni-auto').create({
  renewWithin: 10 * 24 * 60 * 60 1000       // do not renew prior to 10 days before expiration
, renewBy: 5 * 24 * 60 * 60 1000         // do not wait more than 5 days before expiration

  // key (privkey.pem) and cert (cert.pem + chain.pem) will be provided by letsencrypt
, tlsOptions: { rejectUnauthorized: true, requestCert: false, ca: null, crl: null }

, getCertificatesAsync: function (domain, certs) {
    // return a promise with an object with the following keys:
    // { privkey, cert, chain, expiresAt, issuedAt, subject, altnames }
  }
});



// some default certificates that work with localhost
// (because default certificates are required as a fallback)
var httpsOptions = require('localhost.daplie.com-certificates').merge({
  SNICallback: leSni.sniCallback
});

https.createServer(httpsOptions, app);
```

You can also provide a thunk-style `getCertificates(domain, certs, cb)`.

API
===

* create(options)
  * `getCertificates(domain, certs, cb)` or `getCertificatesAsync(domain, certs)`
  * `renewWithin` (default 7 days, min 3 days)
  * `renewBy` (default 2 days, min 12 hours)
* `sniCallback(domain, cb)`
* `cacheCerts(certs)`
* `uncacheDomain(domain)`

.renewWithin
-----------

Specifies the maximum amount of time (in ms) before
the certificate expires to renew it.

Say the cert expires in 90 days and you would like
to renew, **at earliest** 10 days before it expires.

You would set this to `10 * 24 * 60 * 60 * 1000`.

.renewBy
--------

Specifies the maximum amount of time (in ms) before
the certificate expires to renew it.

Say the cert expires in 90 days and you would like
to renew, **at latest** 10 days before it expires.

You would set this to `10 * 24 * 60 * 60 * 1000`.

**MUST** be **less than** `renewWithin`.

.sniCallback()
-----------

This gets passed to `https.createServer(httpsOptions, app)` as `httpsOptions.SNICallback`.

```javascript
var leSni = require('le-sni-auto').create({
  renewWithin: 10 * 24 * 60 * 60 1000
});

var httpsOptions = require('localhost.daplie.com-certificates').merge({
  SNICallback: leSni.sniCallback
});

function app(req, res) {
  res.end("Hello, World!");
}

https.createServer(httpsOptions, app);
```

.cacheCerts()
-----------

Manually load a certificate into the cache.

This is useful in a cluster environment where the master
may wish to inform multiple workers of a new or renewed certificate,
or to satisfy tls-sni-01 challenges.

```
leSni.cacheCerts({
, privkey: '<<privkey.pem>>'
, cert: '<<cert.pem + chain.pem>>'
, subject: 'example.com'
, altnames: [ 'example.com', 'www.example.com' ]
, issuedAt: 1470975565000
, expiresAt: 1478751565000
, auto: true
});
```

.uncacheCerts()
-----------

Remove cached certificates from the cache.

This is useful once a tls-sni-01 challenge has been satisfied.

```
leSni.uncacheCerts({
, subject: 'example.com'
, altnames: [ 'example.com', 'www.example.com' ]
});
```

