'use strict';

var RSA = require('../').RSA;

RSA.generateKeypair(null, null, null, function (err, keys) {
  if (!keys.privateKeyJwk) {
    throw new Error("Expected privateKeyJwk, but it is missing");
  }

  if (
     keys.publicKeyJwk
  || keys.privateKeyPem
  || keys.publicKeyPem
  || keys.thumbprint
  || keys._ursa
  || keys._forge
  ) {
    console.error(Object.keys(keys));
    throw new Error("Got unexpected keys");
  }

  var options = {
    public: true        // export public keys
  , pem: true           // export pems
  , jwk: false          // export jwks
  , internal: true      // preserve internal intermediate formats (_ursa, _forge)
  //, thumbprint: true    // JWK sha256 thumbprint
  };
  RSA.generateKeypair(512, 65537, options, function (err, keys) {
    if (
        (keys.publicKeyJwk && !keys.thumbprint)
    || !keys.privateKeyPem
    || !keys.publicKeyPem
    //|| !keys.thumbprint
    || !(keys._ursa || keys._forge)
    ) {
      console.error(Object.keys(keys));
      throw new Error("Missing expected keys");
    }

    console.log('All is well!');
  });

});
