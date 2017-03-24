'use strict';

var ursa = require('ursa');

function notToJson() {
  return undefined;
}

var ursac = module.exports = {



  //
  // to components
  //
  _privateJwkToComponents: function (jwk) {
    var components = [];

    [ 'n', 'e', 'p', 'q', 'dp', 'dq', 'qi', 'd' ].forEach(function (key) {
      components.push(new Buffer(jwk[key], 'base64'));
    });

    return components;
  }
, _publicJwkToComponents: function (jwk) {
    var components = [];
    [ 'n', 'e' ].forEach(function (key) {
      components.push(new Buffer(jwk[key], 'base64'));
    });

    return components;
  }



  //
  // Generate New Keypair
  //
, generateKeypair: function (bitlen, exp, options, cb) {
    var keypair = ursa.generatePrivateKey(bitlen || 2048, exp || 65537);

    keypair.toJSON = notToJson;

    cb(null, {
      _ursa: keypair
    });
  }



  //
  // Import
  //
, _ursaImportPem: function (keypair) {
    if (keypair._ursa) {
      return;
    }

    if (keypair.privateKeyPem) {
      keypair._ursa = ursa.createPrivateKey(keypair.privateKeyPem);
      keypair._ursa.toJSON = notToJson;
    }
    else if (keypair.publicKeyPem) {
      ursac._ursaImportPublicPem(keypair);
    }
  }
, _ursaImportPublicPem: function (keypair) {
    if (keypair._ursa || keypair._ursaPublic) {
      return;
    }

    if (keypair.publicKeyPem) {
      keypair._ursaPublic = ursa.createPublicKey(keypair.publicKeyPem);
      keypair._ursaPublic.toJSON = notToJson;
    }
  }
, _ursaImportJwk: function (keypair) {
    if (keypair._ursa) {
      return;
    }

    if (keypair.privateKeyJwk) {
      keypair._ursa = ursa.createPrivateKeyFromComponents.apply(
        ursa
      , ursac._privateJwkToComponents(keypair.privateKeyJwk)
      );
      keypair._ursa.toJSON = notToJson;
    }
    else if (keypair.publicKeyJwk) {
      ursac._ursaImportPublicJwk(keypair);
    }
  }
, _ursaImportPublicJwk: function (keypair) {
    if (keypair._ursa || keypair._ursaPublic) {
      return;
    }

    if (keypair.publicKeyJwk) {
      keypair._ursaPublic = ursa.createPublicKeyFromComponents.apply(
        ursa
      , ursac._publicJwkToComponents(keypair.publicKeyJwk)
      );
      keypair._ursaPublic.toJSON = notToJson;
    }
  }
, import: function (keypair) {
    ursac._ursaImportJwk(keypair);
    ursac._ursaImportPem(keypair);

    return keypair;
  }



  //
  // Export Public / Private PEMs
  //
, _pemBinToPem: function (pem) {
    return pem.toString('ascii').replace(/[\n\r]+/g, '\r\n');
  }
, exportPrivatePem: function (keypair) {
    if (keypair.privateKeyPem) {
      return keypair.privateKeyPem;
    }

    if (keypair._ursa) {
      return ursac._pemBinToPem(keypair._ursa.toPrivatePem());
    }

    if (keypair.privateKeyJwk) {
      ursac._ursaImportJwk(keypair);

      return ursac._pemBinToPem(keypair._ursa.toPrivatePem());
    }

    throw new Error("None of privateKeyPem, _ursa, or privateKeyJwk found. No way to export private key PEM");
  }
, exportPublicPem: function (keypair) {
    if (keypair.publicKeyPem) {
      return keypair.publicKeyPem;
    }

    if (keypair._ursa || keypair._ursaPublic) {
      return ursac._pemBinToPem((keypair._ursa || keypair._ursaPublic).toPublicPem());
    }

    if (keypair.publicKeyJwk) {
      ursac._ursaImportPublicJwk(keypair);

      return ursac._pemBinToPem(keypair._ursaPublic.toPublicPem());
    }

    if (keypair.privateKeyJwk) {
      ursac._ursaImportJwk(keypair);

      return ursac._pemBinToPem(keypair._ursa.toPublicPem());
    }

    if (keypair.privateKeyPem) {
      ursac._ursaImportPem(keypair);

      return ursac._pemBinToPem(keypair._ursa.toPublicPem());
    }

    throw new Error("None of publicKeyPem, _ursa, publicKeyJwk, privateKeyPem, or privateKeyJwk found. No way to export public key PEM");
  }
//, exportPrivateKeyJwk: NOT IMPLEMENTED HERE
//, exportPublicKeyJwk: NOT IMPLEMENTED HERE



};
