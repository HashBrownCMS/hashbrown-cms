/*!
 * rsa-compat
 * Copyright(c) 2016 AJ ONeal <aj@daplie.com> https://daplie.com
 * Apache-2.0 OR MIT (and hence also MPL 2.0)
*/
'use strict';

var cryptoc = module.exports;
var rsaExtra = require('./rsa-extra');
var rsaForge = require('./rsa-forge');
var rsaUrsa;

try {
  rsaUrsa = require('./rsa-ursa');
} catch(e) {
  rsaUrsa = {};
  // things will run a little slower on keygen, but it'll work on windows
  // (but don't try this on raspberry pi - 20+ MINUTES key generation)
}

// order of crypto precdence is
// * native
// * ursa
// * forge extra (the new one aimed to be less-forgey)
// * forge (fallback)
Object.keys(rsaUrsa).forEach(function (key) {
  if (!cryptoc[key]) {
    cryptoc[key] = rsaUrsa[key];
  }
});

Object.keys(rsaForge).forEach(function (key) {
  if (!cryptoc[key]) {
    cryptoc[key] = rsaForge[key];
  }
});

Object.keys(rsaExtra).forEach(function (key) {
  if (!cryptoc[key]) {
    cryptoc[key] = rsaExtra[key];
  }
});
