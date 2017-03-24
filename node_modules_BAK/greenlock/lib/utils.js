'use strict';

var path = require('path');
var homeRe = new RegExp("^~(\\/|\\\|\\" + path.sep + ")");
var re = /^[a-zA-Z0-9\.\-]+$/;
var punycode = require('punycode');
var PromiseA = require('bluebird');
var dns = PromiseA.promisifyAll(require('dns'));

module.exports.attachCertInfo = function (results) {
  // XXX Note: Parsing the certificate info comes at a great cost (~500kb)
  var getCertInfo = require('certpem').info;
  var certInfo = getCertInfo(results.cert);

  // subject, altnames, issuedAt, expiresAt
  Object.keys(certInfo).forEach(function (key) {
    results[key] = certInfo[key];
  });

  return results;
};

module.exports.isValidDomain = function (domain) {
  if (re.test(domain)) {
    return domain;
  }

  domain = punycode.toASCII(domain);

  if (re.test(domain)) {
    return domain;
  }

  return '';
};

module.exports.merge = function (/*defaults, args*/) {
  var allDefaults = Array.prototype.slice.apply(arguments);
  var args = allDefaults.shift();
  var copy = {};

  allDefaults.forEach(function (defaults) {
    Object.keys(defaults).forEach(function (key) {
      copy[key] = defaults[key];
    });
  });

  Object.keys(args).forEach(function (key) {
    copy[key] = args[key];
  });

  return copy;
};

module.exports.tplCopy = function (copy) {
  var homedir = require('homedir')();
  var tplKeys;

  copy.hostnameGet = function (copy) {
    return (copy.domains || [])[0] || copy.domain;
  };

  Object.keys(copy).forEach(function (key) {
    var newName;
    if (!/Get$/.test(key)) {
      return;
    }

    newName = key.replace(/Get$/, '');
    copy[newName] = copy[newName] || copy[key](copy);
  });

  tplKeys = Object.keys(copy);
  tplKeys.sort(function (a, b) {
    return b.length - a.length;
  });

  tplKeys.forEach(function (key) {
    if ('string' !== typeof copy[key]) {
      return;
    }

    copy[key] = copy[key].replace(homeRe, homedir + path.sep);
  });

  tplKeys.forEach(function (key) {
    if ('string' !== typeof copy[key]) {
      return;
    }

    tplKeys.forEach(function (tplname) {
      if (!copy[tplname]) {
        // what can't be templated now may be templatable later
        return;
      }
      copy[key] = copy[key].replace(':' + tplname, copy[tplname]);
    });
  });

  return copy;
};

module.exports.testEmail = function (email) {
  var parts = (email||'').split('@');
  var err;

  if (2 !== parts.length || !parts[0] || !parts[1]) {
    err = new Error("malformed email address '" + email + "'");
    err.code = 'E_EMAIL';
    return PromiseA.reject(err);
  }

  return dns.resolveMxAsync(parts[1]).then(function (records) {
    // records only returns when there is data
    if (!records.length) {
      throw new Error("sanity check fail: success, but no MX records returned");
    }
    return email;
  }, function (err) {
    if ('ENODATA' === err.code) {
      err = new Error("no MX records found for '" + parts[1] + "'");
      err.code = 'E_EMAIL';
      return PromiseA.reject(err);
    }
  });
};
