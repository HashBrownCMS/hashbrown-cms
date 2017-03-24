/*!
 * letiny-core
 * Copyright(c) 2015 AJ ONeal <aj@daplie.com> https://daplie.com
 * Apache-2.0 OR MIT (and hence also MPL 2.0)
*/
'use strict';

// Finally, you need an implementation of `challengeStore`:

// Note:
// key is the xxxx part of `/.well-known/acme-challenge/xxxx`
// value is what is needs to be return the the requesting server
//
// it is very common to store this is a directory as a file
// (and you can totally do that if you want to, no big deal)
// but that's super inefficient considering that you need it
// for all of 500ms and there's no sense in that.

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

module.exports = challengeStore;
