'use strict';

var RSA = require('../').RSA;
var fs = require('fs');
var path = require('path');

var privkeyPemRef = fs.readFileSync(path.join(__dirname, 'privkey.pem'), 'ascii');
var privkeyJwkRef = JSON.parse(fs.readFileSync(path.join(__dirname, 'privkey.jwk'), 'ascii'));

var refs = {
  privPem: RSA.exportPrivatePem({ privateKeyJwk: privkeyJwkRef })
, privJwk: RSA.exportPrivateJwk({ privateKeyPem: privkeyPemRef })
};

var hasUrsa;
var imported;

try {
  hasUrsa = require('ursa') && true;
} catch(e) {
  hasUrsa = false;
}



//
//
// PEM tests
//
//
console.log('JWK -> PEM ?', privkeyPemRef === refs.privPem);
if (privkeyPemRef !== refs.privPem) {
  // Watch out for tricky whitespaces (\n instead of \r\n, trailing \r\n, etc)
  console.log('REF:');
  console.log(JSON.stringify(privkeyPemRef));
  console.log('GEN:');
  console.log(JSON.stringify(refs.privPem));
  throw new Error("Failed to validate importedJwk against referencePem");
}

console.log('PEM -> _ -> PEM ?', privkeyPemRef === refs.privPem);
if (hasUrsa) {
  imported = RSA.import({ privateKeyPem: privkeyPemRef });
  refs.privPem2 = RSA.exportPrivatePem({ _ursa: imported._ursa });
}
else {
  imported = RSA.import({ privateKeyPem: privkeyPemRef });
  refs.privPem2 = RSA.exportPrivatePem({ _forge: imported._forge });
}
if (privkeyPemRef !== refs.privPem2) {
  console.log('REF:');
  console.log(JSON.stringify(privkeyPemRef));
  console.log('GEN:');
  console.log(JSON.stringify(refs.privPem2));
  throw new Error("Failed to validate importedPem against referencePem");
}


//
//
// JWK tests
//
//
console.log('PEM -> JWK ?', privkeyJwkRef.n === refs.privJwk.n);
if (![ 'kty', 'n', 'e', 'p', 'q', 'dp', 'dq', 'qi', 'd' ].every(function (k) {
  return privkeyJwkRef[k] === refs.privJwk[k];
})) {
  console.log('REF:');
  console.log(privkeyJwkRef);
  console.log('GEN:');
  console.log(refs.privJwk);
  throw new Error("Failed to validate importedPem against referenceJwk");
}

imported = RSA.import({ privateKeyJwk: privkeyJwkRef });
refs.privJwk2 = RSA.exportPrivateJwk({ _forge: imported._forge });
console.log('JWK -> _ -> JWK ?', privkeyJwkRef.n === refs.privJwk2.n);
if (privkeyJwkRef.n !== refs.privJwk2.n) {
  console.log('REF:');
  console.log(privkeyJwkRef);
  console.log('GEN:');
  console.log(refs.privJwk2);
  throw new Error("Failed to validate importedJwk against referenceJwk");
}

console.log('');
