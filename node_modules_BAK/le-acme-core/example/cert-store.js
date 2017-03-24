/*!
 * letiny-core
 * Copyright(c) 2015 AJ ONeal <aj@daplie.com> https://daplie.com
 * Apache-2.0 OR MIT (and hence also MPL 2.0)
*/
'use strict';

// It's good to have a place to store the certificates so you can,
// y'know, use them! :-)

// you receive a hostname and must give back an object
// with a public cert chain and a private key

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

module.exports = certStore;
