'use strict';

var forge = require('node-forge');

function notToJson() {
  return undefined;
}

var forgec = module.exports = {



  //
  // to components
  //
  _toStandardBase64: function (str) {
    var b64 = str.replace(/-/g, "+").replace(/_/g, "/").replace(/=/g, "");

    switch (b64.length % 4) {
      case 2: b64 += "=="; break;
      case 3: b64 += "="; break;
    }

    return b64;
  }
, _base64UrlToBin: function (base64) {
    var std64 = forgec._toStandardBase64(base64);
    var hex = new Buffer(std64, 'base64').toString("hex");

    return new forge.jsbn.BigInteger(hex, 16);
  }
, _privateJwkToComponents: function (jwk) {
    var components = [];

    // [ 'n', 'e', 'd', 'p', 'q', 'dP', 'dQ', 'qInv' ]
    [ 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi' ].forEach(function (key) {
      components.push(forgec._base64UrlToBin(jwk[key]));
    });

    return components;
  }
, _publicJwkToComponents: function (jwk) {
    var components = [];
    [ 'n', 'e' ].forEach(function (key) {
      components.push(forgec._base64UrlToBin(jwk[key]));
    });

    return components;
  }



  //
  // Generate New Keypair
  //
, generateKeypair: function (bitlen, exp, options, cb) {
    var fkeypair = forge.pki.rsa.generateKeyPair({ bits: bitlen || 2048, e: exp || 0x10001 });
    var result = {
      _forge: fkeypair.privateKey
    , _forgePublic: fkeypair.publicKey
    };

    result._forge.toJSON = notToJson;
    result._forgePublic.toJSON = notToJson;

    cb(null, result);
  }



  //
  // Import (no-op)
  //
, _forgeImportJwk: function (keypair) {
    if (!keypair._forge && keypair.privateKeyJwk) {
      keypair._forge = forge.pki.rsa.setPrivateKey.apply(
        forge.pki.rsa
      , forgec._privateJwkToComponents(keypair.privateKeyJwk)
      );
      keypair._forge.toJSON = notToJson;
    }

    forgec._forgeImportPublicJwk(keypair);
  }
, _forgeImportPublicJwk: function (keypair) {
    if (keypair._forgePublic) {
      return;
    }

    if (keypair._forge) {
      keypair._forgePublic = forge.pki.rsa.setPublicKey(keypair._forge.n, keypair._forge.e);
    }
    else if (keypair.publicKeyJwk) {
      keypair._forgePublic = forge.pki.rsa.setPublicKey.apply(
        forge.pki.rsa
      , forgec._publicJwkToComponents(keypair.publicKeyJwk || keypair.privateKeyJwk)
      );
    }
    if (keypair._forgePublic) {
      keypair._forgePublic.toJSON = notToJson;
    }
  }
, _forgeImportPem: function (keypair) {
    if (!keypair._forge && keypair.privateKeyPem) {
      keypair._forge = forge.pki.privateKeyFromPem(keypair.privateKeyPem);
      keypair._forge.toJSON = notToJson;
    }

    forgec._forgeImportPublicPem(keypair);
  }
, _forgeImportPublicPem: function (keypair) {
    if (keypair._forgePublic) {
      return;
    }

    if (keypair._forge) {
      keypair._forgePublic = forge.pki.rsa.setPublicKey(keypair._forge.n, keypair._forge.e);
    }
    else if (keypair.publicKeyPem) {
      keypair._forgePublic = keypair._forgePublic || forge.pki.publicKeyFromPem(keypair.publicKeyPem);
    }
    if (keypair._forgePublic) {
      keypair._forgePublic.toJSON = notToJson;
    }
  }
, import: function (keypair) {
    // no-op since this must be done anyway in extra
    return keypair;
  }



  //
  // Export Public / Private PEMs
  //
, exportPrivatePem: function (keypair) {
    if (keypair.privateKeyPem) {
      return keypair.privateKeyPem;
    }

    if (keypair.privateKeyJwk && !keypair._forge) {
      forgec._forgeImportJwk(keypair);
    }

    if (keypair._forge) {
      return forge.pki.privateKeyToPem(keypair._forge);
    }

    throw new Error("None of privateKeyPem, _forge, or privateKeyJwk found. No way to export private key PEM");
  }
, exportPublicPem: function (keypair) {
    if (keypair.publicKeyPem) {
      return keypair.publicKeyPem;
    }

    if ((keypair.privateKeyJwk || keypair.publicKeyJwk)
      && !(keypair._forge || keypair._forgePublic)
    ) {
      forgec._forgeImportPublicJwk(keypair);
    }

    if (!keypair._forge) {
      if (keypair.privateKeyPem) {
        forgec._forgeImportPem(keypair);
      }
    }
    if (keypair.publicKeyPem) {
      return keypair.publicKeyPem;
    }
    if (keypair._forge || keypair._forgePublic) {
      return forge.pki.publicKeyToPem(keypair._forgePublic || keypair._forge);
    }

    throw new Error("None of publicKeyPem, _forge, _forgePublic, publicKeyJwk, privateKeyPem, or privateKeyJwk found. No way to export public key PEM");
  }
//, exportPrivateKeyJwk: NOT IMPLEMENTED HERE
//, exportPublicKeyJwk: NOT IMPLEMENTED HERE



};
