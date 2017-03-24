/*!
 * letiny
 * Copyright(c) 2015 Anatol Sommer <anatol@anatol.at>
 * Some code used from https://github.com/letsencrypt/boulder/tree/master/test/js
 * MPL 2.0
*/
'use strict';

module.exports.create = function (deps) {

  var NOOP = function () {
  };
  var log = NOOP;
  var request = deps.request || require('request');
  var RSA = deps.RSA;
  var generateSignature = RSA.signJws;

  function Acme(keypair) {
    if (!keypair) {
      throw new Error("no keypair given. that's bad");
    }
    if ('string' === typeof keypair) {
      // backwards compat
      keypair = RSA.import({ privateKeyPem: keypair });
    }
    this.keypair = keypair;
    this.nonces=[];
  }

  Acme.prototype.getNonce=function(url, cb) {
    var self=this;

    request.head({
      url:url,
    }, function(err, res/*, body*/) {
      if (err) {
        return cb(err);
      }
      if (res && 'replay-nonce' in res.headers) {
        log('Storing nonce: '+res.headers['replay-nonce']);
        self.nonces.push(res.headers['replay-nonce']);
        cb();
        return;
      }

      cb(new Error('Failed to get nonce for request'));
    });
  };

  Acme.prototype.post=function(url, body, cb) {
    var self=this, payload, jws, signed;

    if (this.nonces.length===0) {
      this.getNonce(url, function(err) {
        if (err) {
          return cb(err);
        }
        self.post(url, body, cb);
      });
      return;
    }

    log('Using nonce: '+this.nonces[0]);
    payload=JSON.stringify(body, null, 2);
    jws=generateSignature(
        self.keypair, new Buffer(payload), this.nonces.shift()
    );
    signed=JSON.stringify(jws, null, 2);

    log('Posting to '+url);
    log(signed);
    log('Payload:'+payload);

//process.exit(1);
//return;
    return request.post({
      url: url
    , body: signed
    , encoding: null
    }, function(err, res, body) {
      var parsed;

      if (err) {
        console.error('[letiny-core/lib/acme-client.js] post');
        console.error(err.stack);
        return cb(err);
      }
      if (res) {
        log(('HTTP/1.1 '+res.statusCode));
      }

      Object.keys(res.headers).forEach(function(key) {
        var value, upcased;
        value=res.headers[key];
        upcased=key.charAt(0).toUpperCase()+key.slice(1);
        log((upcased+': '+value));
      });

      if (body && !body.toString().match(/[^\x00-\x7F]/)) {
        try {
          parsed=JSON.parse(body);
          log(JSON.stringify(parsed, null, 2));
        } catch(err) {
          log(body.toString());
        }
      }

      if ('replay-nonce' in res.headers) {
        log('Storing nonce: '+res.headers['replay-nonce']);
        self.nonces.push(res.headers['replay-nonce']);
      }

      cb(err, res, body);
    });
  };

  Acme.parseLink = function parseLink(link) {
    var links;
    try {
      links=link.split(',').map(function(link) {
        var parts, url, info;
        parts=link.trim().split(';');
        url=parts.shift().replace(/[<>]/g, '');
        info=parts.reduce(function(acc, p) {
          var m=p.trim().match(/(.+) *= *"(.+)"/);
          if (m) {
            acc[m[1]]=m[2];
          }
          return acc;
        }, {});
        info.url=url;
        return info;
      }).reduce(function(acc, link) {
        if ('rel' in link) {
          acc[link.rel]=link.url;
        }
        return acc;
      }, {});
      return links;
    } catch(err) {
      return null;
    }
  };

  return Acme;
};
