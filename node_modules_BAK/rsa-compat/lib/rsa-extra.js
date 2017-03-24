'use strict';

// for forge
function _bigIntToBase64Url(fbin) {
  var hex = fbin.toRadix(16);
  if (hex.length % 2) {
    // Invalid hex string
    hex = '0' + hex;
  }
  var buf;
  // See https://github.com/Daplie/rsa-compat.js/issues/9
  try {
    buf = Buffer.from(hex, 'hex');
  } catch(e) {
    buf = new Buffer(hex, 'hex');
  }
  var b64 = buf.toString('base64');
  var b64Url = b64.replace(/[+]/g, "-").replace(/\//g, "_").replace(/=/g,"");

  return b64Url;
}
/*
// I think this doesn't work because toByteArray() returns signed bytes
function _xxx_bigIntToBase64Url(fbin) {
  if (!fbin.toByteArray) {
    console.log('fbin');
    console.log(fbin);
  }
  var byteArray = fbin.toByteArray();
  var buf = Buffer.from(byteArray);
  var b64 = buf.toString('base64');
  var b64Url = b64.replace(/[+]/g, "-").replace(/\//g, "_").replace(/=/g,"");

  return b64Url;
}
*/

var extrac = module.exports = {
  //
  // internals
  //
  _forgeToPrivateJwk: function (keypair) {
    var k = keypair._forge;

    return {
      kty: "RSA"
    , n: _bigIntToBase64Url(k.n)
    , e: _bigIntToBase64Url(k.e)
    , d: _bigIntToBase64Url(k.d)
    , p: _bigIntToBase64Url(k.p)
    , q: _bigIntToBase64Url(k.q)
    , dp: _bigIntToBase64Url(k.dP)
    , dq: _bigIntToBase64Url(k.dQ)
    , qi: _bigIntToBase64Url(k.qInv)
    };
  }
, _forgeToPublicJwk: function (keypair) {
    var k = keypair._forge || keypair._forgePublic;
    return {
      kty: "RSA"
    , n: _bigIntToBase64Url(k.n)
    , e: _bigIntToBase64Url(k.e)
    };
  }



  //
  // Import Forge
  //
, _forgeImportJwk: require('./rsa-forge')._forgeImportJwk
, _forgeImportPublicJwk: require('./rsa-forge')._forgeImportPublicJwk
, _forgeImportPem: require('./rsa-forge')._forgeImportPem
, _forgeImportPublicPem: require('./rsa-forge')._forgeImportPublicPem
, importForge: function (keypair) {
    extrac._forgeImportJwk(keypair);
    if (keypair.privateKeyPem) {
      extrac._forgeImportPem(keypair);
    }
    if (keypair.publicKeyPem) {
      extrac._forgeImportPublicPem(keypair);
    }
    return keypair;
  }



  //
  // Export JWK
  //
, exportPrivateJwk: function (keypair) {
    var hasUrsaPrivate = keypair._ursa && true;
    var hasPrivatePem = keypair.privateKeyPem && true;
    var hasForgePrivate = keypair._forge && true;

    if (keypair.privateKeyJwk) {
      return keypair.privateKeyJwk;
    }

    if (!hasForgePrivate) {
      if (hasUrsaPrivate && !hasPrivatePem) {
        keypair.privateKeyPem = keypair._ursa.toPrivatePem().toString('ascii');
      }

      if (keypair.privateKeyPem) {
        extrac._forgeImportPem(keypair);
      }
    }

    if (keypair._forge) {
      return extrac._forgeToPrivateJwk(keypair);
    }

    throw new Error("None of privateKeyPem, _ursa, _forge, or privateKeyJwk found. No way to export private key Jwk");
  }
, exportPublicJwk: function (keypair) {
    var hasUrsaPublic = (keypair._ursa || keypair._ursaPublic) && true;
    var hasPublicPem = (keypair.privateKeyPem || keypair.publicKeyPem) && true;
    var hasForgePublic = keypair._forge && true;

    if (keypair.publicKeyJwk) {
      return keypair.publicKeyJwk;
    }

    if (keypair.privateKeyJwk) {
      return {
        kty: 'RSA'
      , n: keypair.privateKeyJwk.n
      , e: keypair.privateKeyJwk.e
      };
    }

    if (!hasForgePublic) {
      if (hasUrsaPublic && !hasPublicPem) {
        keypair.publicKeyPem = (keypair._ursa || keypair._ursaPublic).toPublicPem().toString('ascii');
      }

      if (keypair.publicKeyPem) {
        extrac._forgeImportPublicPem(keypair);
      }
    }

    if (keypair._forge || keypair._forgePublic) {
      return extrac._forgeToPublicJwk(keypair);
    }

    throw new Error("None of publicKeyPem privateKeyPem, _ursa, _forge, publicKeyJwk, or privateKeyJwk found. No way to export private key Jwk");
  }
};
