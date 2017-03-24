le-store-certbot
================

The "certbot" storage strategy for node-letsencrypt.

This le storage strategy aims to maintain compatibility with the
configuration files and file structure of the official certbot client.

Note: You cannot use this strategy on ephemeral instances (heroku, aws elastic).

Usage
-----

```bash
npm install --save le-store-certbot@2.x
```

```bash
var leStore = require('le-store-certbot').create({
  configDir: require('homedir')() + '/letsencrypt/etc'          // or /etc/letsencrypt or wherever
, privkeyPath: ':configDir/live/:hostname/privkey.pem'          //
, fullchainPath: ':configDir/live/:hostname/fullchain.pem'      // Note: both that :configDir and :hostname
, certPath: ':configDir/live/:hostname/cert.pem'                //       will be templated as expected by
, chainPath: ':configDir/live/:hostname/chain.pem'              //       node-letsencrypt

, workDir: require('homedir')() + '/letsencrypt/var/lib'
, logsDir: require('homedir')() + '/letsencrypt/var/log'

, webrootPath: '~/letsencrypt/srv/www/:hostname/.well-known/acme-challenge'

, debug: false
});

var LE = require('letsencrypt');

LE.create({
  server: LE.stagingServerUrl                               // Change to LE.productionServerUrl in production
, store: leStore
});
```

Example File Structure
----------------------

```
~/letsencrypt/
└── etc
    ├── accounts
    │   └── acme-staging.api.letsencrypt.org
    │       └── directory
    │           └── cd96ac4889ddfa47bfc66300ab223342
    │               ├── meta.json
    │               ├── private_key.json
    │               └── regr.json
    ├── archive
    │   └── example.daplie.me
    │       ├── cert0.pem
    │       ├── chain0.pem
    │       ├── fullchain0.pem
    │       └── privkey0.pem
    ├── live
    │   └── example.daplie.me
    │       ├── cert.pem
    │       ├── chain.pem
    │       ├── fullchain.pem
    │       ├── privkey.pem
    │       └── privkey.pem.bak
    └── renewal
        ├── example.daplie.me.conf
        └── example.daplie.me.conf.bak
```
