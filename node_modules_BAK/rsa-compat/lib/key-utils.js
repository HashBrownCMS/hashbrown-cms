// Copyright 2014 ISRG.  All rights reserved
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
'use strict';

var utils = {

  fromStandardB64: function(x) {
    return x.replace(/[+]/g, "-").replace(/\//g, "_").replace(/=/g,"");
  },

  toStandardB64: function(x) {
    var b64 = x.replace(/-/g, "+").replace(/_/g, "/").replace(/=/g, "");

    switch (b64.length % 4) {
      case 2: b64 += "=="; break;
      case 3: b64 += "="; break;
    }

    return b64;
  },

  b64enc: function(buffer) {
    return utils.fromStandardB64(buffer.toString("base64"));
  },

  b64dec: function(str) {
    return new Buffer(utils.toStandardB64(str), "base64");
  },

  isB64String: function(x) {
    return ("string" === typeof x) && !x.match(/[^a-zA-Z0-9_-]/);
  },

  fieldsPresent: function(fields, object) {
    for (var i in fields) {
      if (!(fields[i] in object)) {
        return false;
      }
    }
    return true;
  },

  validSignature: function(sig) {
    return (("object" === typeof sig) &&
      ("alg" in sig) && ("string" === typeof sig.alg) &&
      ("nonce" in sig) && utils.isB64String(sig.nonce) &&
      ("sig" in sig) && utils.isB64String(sig.sig) &&
      ("jwk" in sig) && utils.validJWK(sig.jwk));
  },

  validJWK: function(jwk) {
    return (("object" === typeof jwk) && ("kty" in jwk) && (
      ((jwk.kty === "RSA")
        && ("n" in jwk) && utils.isB64String(jwk.n)
        && ("e" in jwk) && utils.isB64String(jwk.e)) ||
      ((jwk.kty === "EC")
        && ("crv" in jwk)
        && ("x" in jwk) && utils.isB64String(jwk.x)
        && ("y" in jwk) && utils.isB64String(jwk.y))
    ) && !("d" in jwk));
  },

  // A simple, non-standard fingerprint for a JWK,
  // just so that we don't have to store objects
  keyFingerprint: function(jwk) {
    switch (jwk.kty) {
      case "RSA": return jwk.n;
      case "EC": return jwk.crv + jwk.x + jwk.y;
    }
    throw "Unrecognized key type";
  }
};

module.exports = utils;
