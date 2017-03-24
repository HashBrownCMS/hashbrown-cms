[![Join the chat at https://gitter.im/Daplie/letsencrypt-express](https://badges.gitter.im/Daplie/letsencrypt-express.svg)](https://gitter.im/Daplie/letsencrypt-express?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

| [letsencrypt](https://github.com/Daplie/node-letsencrypt) (library)
| [letsencrypt-cli](https://github.com/Daplie/letsencrypt-cli)
| [letsencrypt-express](https://github.com/Daplie/letsencrypt-express)
| [letsencrypt-cluster](https://github.com/Daplie/letsencrypt-cluster)
| [letsencrypt-koa](https://github.com/Daplie/letsencrypt-koa)
| [letsencrypt-hapi](https://github.com/Daplie/letsencrypt-hapi)
|

# le-challenge-webroot

An fs-based strategy for node-letsencrypt for setting, retrieving,
and clearing ACME challenges issued by the ACME server

This places the acme challenge in an appropriate directory in the specified `webrootPath`
and removes it once the challenge has either completed or failed.

* Safe to use with node cluster
* Safe to use with ephemeral services (Heroku, Joyent, etc)

Install
-------

```bash
npm install --save le-challenge-fs@2.x
```

Usage
-----

```bash
var leChallenge = require('le-challenge-fs').create({
  webrootPath: '~/letsencrypt/srv/www/:hostname/.well-known/acme-challenge'   // defaults to os.tmpdir()
, loopbackPort: 5001                                                          // defaults to 80
, loopbackTimeout: 3000                                                       // defaults to 3000ms
, debug: false
});

var LE = require('letsencrypt');

LE.create({
  server: LE.stagingServerUrl                               // Change to LE.productionServerUrl in production
, challenge: leChallenge
});
```

NOTE: If you request a certificate with 6 domains listed,
it will require 6 individual challenges.

Exposed Methods
---------------

For ACME Challenge:

* `set(opts, domain, key, val, done)`
* `get(defaults, domain, key, done)`
* `remove(defaults, domain, key, done)`

For node-letsencrypt internals:

* `getOptions()` returns the internal defaults merged with the user-supplied options
* `loopback(defaults, domain, key, value, done)` test, by external means, that the ACME server's challenge server will succeed
