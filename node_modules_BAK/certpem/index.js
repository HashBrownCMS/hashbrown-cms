'use strict';

var certInfo = module.exports;
module.exports.certpem = certInfo;

require('buffer-v6-polyfill');

// this is really memory expensive to do
// (about half of a megabyte of loaded code)
certInfo._pemToBinAb  = function (pem) {
  var b64 = pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, '');
  var buf = Buffer.from(b64, 'base64');
  var ab = new Uint8Array(buf).buffer;          // WORKS
  //var ab = buf.buffer                         // Doesn't work

  return ab;
};
certInfo.debug = certInfo.getCertInfo = function (pem) {
  var ab = module.exports._pemToBinAb(pem);
  var merge = require("node.extend");

  var common = require("asn1js/org/pkijs/common");
  var _asn1js = require("asn1js");
  var _pkijs = require("pkijs");
  var _x509schema = require("pkijs/org/pkijs/x509_schema");

  // #region Merging function/object declarations for ASN1js and PKIjs
  var asn1js = merge(true, _asn1js, common);

  var x509schema = merge(true, _x509schema, asn1js);

  var pkijs_1 = merge(true, _pkijs, asn1js);
  var pkijs = merge(true, pkijs_1, x509schema);

  var asn1 = pkijs.org.pkijs.fromBER(ab);
  var certSimpl = new pkijs.org.pkijs.simpl.CERT({ schema: asn1.result });

  return certSimpl;
};

certInfo.info = certInfo.getBasicInfo = function (pem) {
  var c = certInfo.getCertInfo(pem);
  var domains = [];
  var sub;

  c.extensions.forEach(function (ext) {
    if (ext.parsedValue && ext.parsedValue.altNames) {
      ext.parsedValue.altNames.forEach(function (alt) {
        domains.push(alt.Name);
      });
    }
  });

  sub = c.subject.types_and_values[0].value.value_block.value || null;

  return {
    subject: sub
  , altnames: domains
    // for debugging during console.log
    // do not expect these values to be here
  , _issuedAt: c.notBefore.value
  , _expiresAt: c.notAfter.value
  , issuedAt: new Date(c.notBefore.value).valueOf()
  , expiresAt: new Date(c.notAfter.value).valueOf()
  };
};

certInfo.getCertInfoFromFile = function (pemFile) {
  return require('fs').readFileSync(pemFile, 'ascii');
};

/*
certInfo.testGetCertInfo = function (pathname) {
  var path = require('path');
  var pemFile = pathname || path.join(__dirname, '..', 'tests', 'example.cert.pem');
  return certInfo.getCertInfo(certInfo.getCertInfoFromFile(pemFile));
};

certInfo.testBasicCertInfo = function (pathname) {
  var path = require('path');
  var pemFile = pathname || path.join(__dirname, '..', 'tests', 'example.cert.pem');
  return certInfo.getBasicInfo(certInfo.getCertInfoFromFile(pemFile));
};
*/
