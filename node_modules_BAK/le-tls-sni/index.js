'use strict';

var forge = require('node-forge');
var pki = forge.pki;
var rsa = require('rsa-compat').RSA;
var sha256 = forge.md.sha256;

var pair;

module.exports.generate = function (args, domain, token, secret, cb) {
  var subject, sanA, sanB, digester = sha256.create(), suffix = ".acme.invalid";
  switch (args.challengeType) {
    case "tls-sni-02":
      digester.update(token);
      sanA = digester.digest().toHex();
      sanA = sanA.slice(0,32) + "." + sanA.slice(32,64) + ".token.acme.invalid";
      subject = sanA;
      suffix = ".ka.acme.invalid";
      /* fall through */
    case "tls-sni-01":
      digester.update(secret);
      sanB = digester.digest().toHex();
      sanB = sanB.slice(0,32) + "." + sanB.slice(32,64) + suffix;
      if (!subject) subject = sanB;
      break;
    default:
      cb(new Error("incompatible challenge type"));
      return;
  }
  if (pair) {
    pairGenerated(null, pair);
  } else {
    rsa.generateKeypair(2048, 0x10001, { public: true, pem: true }, pairGenerated);
  }
  function pairGenerated(err, newPair) {
    if (err) {
      cb(err);
      return;
    }
    pair = newPair;
    pair.publicKey = pki.publicKeyFromPem(pair.publicKeyPem);
    pair.privateKey = pki.privateKeyFromPem(pair.privateKeyPem);
    var cert = pki.createCertificate();
    cert.publicKey = pair.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date(Date.now() - 2 * 60 * 60 * 1000);
    cert.validity.notAfter = new Date(Date.now() + 2 * 60 * 60 * 1000);
    var attrs = [{
      name: "commonName"
    , value: subject
    }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    var altNames = [], certAltNames = [];
    if (sanA) {
      certAltNames.push({
        type: 2, // dNSName
        value: sanA
      });
      altNames.push(sanA);
    }
    certAltNames.push({
      type: 2, // dNSName
      value: sanB
    });
    altNames.push(sanB);
    cert.setExtensions([{
      name: "subjectAltName"
    , altNames: certAltNames
    }]);
    cert.sign(pair.privateKey, digester);
    cb(null, {
      privkey: pair.privateKeyPem
    , cert: pki.certificateToPem(cert)
    , subject: subject
    , altnames: altNames
    , issuedAt: cert.validity.notBefore.getTime()
    , expiresAt: cert.validity.notAfter.getTime()
    });
  }
};

