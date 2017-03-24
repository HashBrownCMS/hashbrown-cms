#!/usr/bin/env node
'use strict';

var RSA = require('../').RSA;
var path = require('path');
var fs = require('fs');

var bitlen = 2048;
var exp = 65537;
var opts = { public: true, pem: true };
var cwd = process.cwd();
var privkeyPath = path.join(cwd, 'privkey.pem');
var pubkeyPath = path.join(cwd, 'pubkey.pem');

if (fs.existsSync(privkeyPath)) {
  console.error(privkeyPath, "already exists");
  process.exit(1);
}

RSA.generateKeypair(bitlen, exp, opts, function (err, keypair) {
  console.info('');
  console.info('');

  fs.writeFileSync(privkeyPath, keypair.privateKeyPem, 'ascii');
  console.info(privkeyPath + ':');
  console.info('');
  console.info(keypair.privateKeyPem);

  console.info('');

  fs.writeFileSync(pubkeyPath, keypair.publicKeyPem, 'ascii');
  console.info(pubkeyPath + ':');
  console.info('');
  console.info(keypair.publicKeyPem);
});
