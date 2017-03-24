<!-- BANNER_TPL_BEGIN -->

About Daplie: We're taking back the Internet!
--------------

Down with Google, Apple, and Facebook!

We're re-decentralizing the web and making it read-write again - one home cloud system at a time.

Tired of serving the Empire? Come join the Rebel Alliance:

<a href="mailto:jobs@daplie.com">jobs@daplie.com</a> | [Invest in Daplie on Wefunder](https://daplie.com/invest/) | [Pre-order Cloud](https://daplie.com/preorder/), The World's First Home Server for Everyone

<!-- BANNER_TPL_END -->

# le-acme-core

Looking for **letiny-core**? Check the [v1.x branch](https://github.com/Daplie/le-acme-core/tree/v1.x).

<!-- rename to le-acme-core -->

A framework for building letsencrypt clients, forked from `letiny`.

Supports all of:

  * node with `ursa` (works fast)
  * node with `forge` (works on windows)
  * browser WebCrypto (not implemented, but... Let's Encrypt over WebRTC anyone?)
  * any javascript implementation

### These aren't the droids you're looking for

This is a library / framework for building letsencrypt clients.
You probably want one of these pre-built clients instead:

  * [`letsencrypt`](https://github.com/Daplie/node-letsencrypt) (compatible with the official client)
  * `letiny` (lightweight client cli)
  * [`letsencrypt-express`](https://github.com/Daplie/letsencrypt-express) (automatic https for express)

## Install & Usage:

```bash
npm install --save le-acme-core
```

To use the default dependencies:

```javascript
'use strict';

var ACME = require('le-acme-core').ACME.create();
```

For **testing** and **development**, you can also inject the dependencies you want to use:

```javascript
'use strict';

var ACME = require('le-acme-core').ACME.create({
  request: require('request')
, RSA: require('rsa-compat').RSA
});

// now uses node `request` (could also use jQuery or Angular in the browser)
ACME.getAcmeUrls(discoveryUrl, function (err, urls) {
  console.log(urls);
});
```

You will follow these steps to obtain certificates:

* discover ACME registration urls with `getAcmeUrls`
* register a user account with `registerNewAccount`
* implement a method to agree to the terms of service as `agreeToTos`
* get certificates with `getCertificate`
* implement a method to store the challenge token as `setChallenge`
* implement a method to get the challenge token as `getChallenge`
* implement a method to remove the challenge token as `removeChallenge`

### Demo

You can see this working for yourself, but you'll need to be on an internet connected computer with a domain.

Get a temporary domain for testing

```bash
npm install -g ddns-cli
ddns --random --email user@example.com --agree
```

Note: use **YOUR EMAIL** and accept the terms of service (run `ddns --help` to see them).

<!-- TODO tutorial on ddns -->

Install le-acme-core and its dependencies. **Note**: it's okay if you're on windows
and `ursa` fails to compile. It'll still work.

```bash
git clone https://github.com/Daplie/le-acme-core.git ~/le-acme-core
pushd ~/le-acme-core

npm install
```

Run the demo:

```bash
node examples/letsencrypt.js user@example.com example.com
```

Note: use **YOUR TEMPORARY DOMAIN** and **YOUR EMAIL**.

## API

The Goodies

```javascript
// Accounts
ACME.registerNewAccount(options, cb)        // returns "regr" registration data

    { newRegUrl: '<url>'                      //    no defaults, specify acmeUrls.newAuthz
    , email: '<email>'                        //    valid email (server checks MX records)
    , accountKeypair: {                       //    privateKeyPem or privateKeyJwt
        privateKeyPem: '<ASCII PEM>'
      }
    , agreeToTerms: fn (tosUrl, cb) {}        //    must specify agree=tosUrl to continue (or falsey to end)
    }

// Registration
ACME.getCertificate(options, cb)            // returns (err, pems={ privkey (key), cert, chain (ca) })

    { newAuthzUrl: '<url>'                    //    specify acmeUrls.newAuthz
    , newCertUrl: '<url>'                     //    specify acmeUrls.newCert

    , domainKeypair: {
        privateKeyPem: '<ASCII PEM>'
      }
    , accountKeypair: {
        privateKeyPem: '<ASCII PEM>'
      }
    , domains: ['example.com']

    , setChallenge: fn (hostname, key, val, cb)
    , removeChallenge: fn (hostname, key, cb)
    }

// Discovery URLs
ACME.getAcmeUrls(acmeDiscoveryUrl, cb)      // returns (err, acmeUrls={newReg,newAuthz,newCert,revokeCert})
```

Helpers & Stuff

```javascript
// Constants
ACME.productionServerUrl                // https://acme-v01.api.letsencrypt.org/directory
ACME.stagingServerUrl                   // https://acme-staging.api.letsencrypt.org/directory
ACME.acmeChallengePrefix                // /.well-known/acme-challenge/
ACME.knownEndpoints                     // new-authz, new-cert, new-reg, revoke-cert


// HTTP Client Helpers
ACME.Acme                               // Signs requests with JWK
    acme = new Acme(keypair)                // 'keypair' is an object with `privateKeyPem` and/or `privateKeyJwk`
    acme.post(url, body, cb)                // POST with signature
    acme.parseLinks(link)                   // (internal) parses 'link' header
    acme.getNonce(url, cb)                  // (internal) HEAD request to get 'replay-nonce' strings
```

## Example

Below you'll find a stripped-down example. You can see the full example in the example folder.

* [example/](https://github.com/Daplie/le-acme-core/blob/master/example/)

#### Register Account & Domain

This is how you **register an ACME account** and **get an HTTPS certificate**

```javascript
'use strict';

var ACME = require('le-acme-core').ACME.create();
var RSA = require('rsa-compat').RSA;

var email = 'user@example.com';                   // CHANGE TO YOUR EMAIL
var domains = 'example.com';                      // CHANGE TO YOUR DOMAIN
var acmeDiscoveryUrl = ACME.stagingServerUrl;   // CHANGE to production, when ready

var accountKeypair = null;                        // { privateKeyPem: null, privateKeyJwk: null };
var domainKeypair = null;                         // same as above
var acmeUrls = null;

RSA.generateKeypair(2048, 65537, function (err, keypair) {
    accountKeypair = keypair;
    // ...
    ACME.getAcmeUrls(acmeDiscoveryUrl, function (err, urls) {
        // ...
        runDemo();
    });
});

function runDemo() {
    ACME.registerNewAccount(
        { newRegUrl: acmeUrls.newReg
        , email: email
        , accountKeypair: accountKeypair
        , agreeToTerms: function (tosUrl, done) {

              // agree to the exact version of these terms
              done(null, tosUrl);
          }
        }
      , function (err, regr) {

            ACME.getCertificate(
                { newAuthzUrl: acmeUrls.newAuthz
                , newCertUrl: acmeUrls.newCert

                , domainKeypair: domainKeypair
                , accountKeypair: accountKeypair
                , domains: domains

                , setChallenge: challengeStore.set
                , removeChallenge: challengeStore.remove
                }
              , function (err, certs) {

                  // Note: you should save certs to disk (or db)
                  certStore.set(domains[0], certs, function () {

                      // ...

                  });

                }
            );
        }
    );
}
```

**But wait**, there's more!
See [example/letsencrypt.js](https://github.com/Daplie/le-acme-core/blob/master/example/letsencrypt.js)

#### Run a Server on 80, 443, and 5001 (https/tls)

That will fail unless you have a webserver running on 80 and 443 (or 5001)
to respond to `/.well-known/acme-challenge/xxxxxxxx` with the proper token

```javascript
var https = require('https');
var http = require('http');


var LeCore = deps.LeCore;
var httpsOptions = deps.httpsOptions;
var challengeStore = deps.challengeStore;
var certStore = deps.certStore;


//
// Challenge Handler
//
function acmeResponder(req, res) {
  if (0 !== req.url.indexOf(LeCore.acmeChallengePrefix)) {
    res.end('Hello World!');
    return;
  }

  var key = req.url.slice(LeCore.acmeChallengePrefix.length);

  challengeStore.get(req.hostname, key, function (err, val) {
    res.end(val || 'Error');
  });
}


//
// Server
//
https.createServer(httpsOptions, acmeResponder).listen(5001, function () {
  console.log('Listening https on', this.address());
});
http.createServer(acmeResponder).listen(80, function () {
  console.log('Listening http on', this.address());
});
```

**But wait**, there's more!
See [example/serve.js](https://github.com/Daplie/le-acme-core/blob/master/example/serve.js)

#### Put some storage in place

Finally, you need an implementation of `challengeStore`:

```javascript
var challengeCache = {};
var challengeStore = {
  set: function (hostname, key, value, cb) {
    challengeCache[key] = value;
    cb(null);
  }
, get: function (hostname, key, cb) {
    cb(null, challengeCache[key]);
  }
, remove: function (hostname, key, cb) {
    delete challengeCache[key];
    cb(null);
  }
};

var certCache = {};
var certStore = {
  set: function (hostname, certs, cb) {
    certCache[hostname] = certs;
    cb(null);
  }
, get: function (hostname, cb) {
    cb(null, certCache[hostname]);
  }
, remove: function (hostname, cb) {
    delete certCache[hostname];
    cb(null);
  }
};
```

**But wait**, there's more!
See

* [example/challenge-store.js](https://github.com/Daplie/le-acme-core/blob/master/challenge-store.js)
* [example/cert-store.js](https://github.com/Daplie/le-acme-core/blob/master/cert-store.js)

## Authors

  * ISRG
  * Anatol Sommer  (https://github.com/anatolsommer)
  * AJ ONeal <aj@daplie.com> (https://daplie.com)

## Licence

MPL 2.0

All of the code is available under the MPL-2.0.

Some of the files are original work not modified from `letiny`
and are made available under MIT and Apache-2.0 as well (check file headers).
