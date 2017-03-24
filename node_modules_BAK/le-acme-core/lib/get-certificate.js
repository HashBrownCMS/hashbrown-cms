/*!
 * letiny
 * Copyright(c) 2015 Anatol Sommer <anatol@anatol.at>
 * Some code used from https://github.com/letsencrypt/boulder/tree/master/test/js
 * MPL 2.0
*/
'use strict';

function _toStandardBase64(str) {
  var b64 = str.replace(/-/g, "+").replace(/_/g, "/").replace(/=/g, "");

  switch (b64.length % 4) {
    case 2: b64 += "=="; break;
    case 3: b64 += "="; break;
  }

  return b64;
}

function certBufferToPem(cert) {
  cert = _toStandardBase64(cert.toString('base64'));
  cert = cert.match(/.{1,64}/g).join('\r\n');
  return '-----BEGIN CERTIFICATE-----\r\n'+cert+'\r\n-----END CERTIFICATE-----\r\n';
}

module.exports.create = function (deps) {
  var request = deps.request;
  var Acme = deps.Acme;
  var RSA = deps.RSA;

  // getCertificate // returns "pems", meaning "certs"
  function getCert(options, cb) {

    function bodyToError(res, body) {
      var err;

      if (!body) {
        err = new Error("[Error] letiny-core: no request body");
        err.code = "E_NO_RESPONSE_BODY";
        throw err;
      }

      if ('{' === body[0] || '{' === String.fromCharCode(body[0])) {
        try {
          body = JSON.parse(body.toString('utf8'));
        } catch(e) {
          err = new Error("[Error] letiny-core: body could not be parsed");
          err.code = "E_BODY_PARSE";
          err.description = body;
          throw err;
        }
      }

      if (Math.floor(res.statusCode / 100) !== 2) {
        err = new Error("[Error] letiny-core: not 200 ok");
        err.code = "E_STATUS_CODE";
        err.type = body.type;
        err.description = body;
        err.detail = body.detail;
        console.error("TODO: modules which depend on this module should expose this error properly but since some of them don't, I expose it here directly:");
        console.error(err.stack);
        console.error(body);
        throw err;
      }

      if (body.type && body.detail) {
        err = new Error("[Error] letiny-core: " + body.detail);
        err.code = body.type;
        err.type = body.type;
        err.description = body.detail;
        err.detail = body.detail;
        throw err;
      }

      return body;
    }

    function nextDomain() {
      if (state.domains.length > 0) {
        getChallenges(state.domains.shift());
        return;
      } else {
        getCertificate();
      }
    }

    function getChallenges(domain) {
      state.domain = domain;

      state.acme.post(state.newAuthzUrl, {
        resource: 'new-authz',
        identifier: {
          type: 'dns',
          value: state.domain,
        }
      }, function (err, res, body) {
        if (!err && res.body) {
          try {
            body = bodyToError(res, body);
          } catch(e) {
            err = e;
          }
        }

        getReadyToValidate(err, res, body);
      });
    }

    function getReadyToValidate(err, res, body) {
      var links;
      var authz;
      var httpChallenges;
      var challenge;
      var thumbprint;
      var keyAuthorization;

      function challengeDone(err) {
        if (err) {
          console.error('[letiny-core] setChallenge Error:');
          console.error(err && err.stack || err);
          ensureValidation(err, null, null, function () {
            options.removeChallenge(state.domain, challenge.token, function () {
              // ignore
            });
          });
          return;
        }

        state.acme.post(state.responseUrl, {
          resource: 'challenge',
          keyAuthorization: keyAuthorization
        }, function(err, res, body) {
          if (!err && res.body) {
            try {
              body = bodyToError(res, body);
            } catch(e) {
              err = e;
            }
          }

          ensureValidation(err, res, body, function unlink() {
            options.removeChallenge(state.domain, challenge.token, function () {
              // ignore
            });
          });
        });
      }

      if (err) {
        return handleErr(err);
      }

      if (Math.floor(res.statusCode/100)!==2) {
        return handleErr(null, 'Authorization request failed ('+res.statusCode+')');
      }

      links = Acme.parseLink(res.headers.link);
      if (!links || !('next' in links)) {
        return handleErr(err, 'Server didn\'t provide information to proceed (2)');
      }

      state.authorizationUrl = res.headers.location;
      state.newCertUrl = links.next;

      authz = body;

      httpChallenges = authz.challenges.filter(function(x) {
        return x.type === options.challengeType;
      });
      if (httpChallenges.length === 0) {
        return handleErr(null, 'Server didn\'t offer any challenge we can handle.');
      }
      challenge = httpChallenges[0];

      thumbprint = RSA.thumbprint(state.accountKeypair);
      keyAuthorization = challenge.token + '.' + thumbprint;

      state.responseUrl = challenge.uri;

      options.setChallenge(state.domain, challenge.token, keyAuthorization, challengeDone);
    }

    function ensureValidation(err, res, body, unlink) {
      var authz, challengesState;

      if (err || Math.floor(res.statusCode/100)!==2) {
        unlink();
        return handleErr(err, 'Authorization status request failed ('
          + (res && res.statusCode || err.code || err.message || err) + ')');
      }

      authz=body;

      if (authz.status==='pending') {
        setTimeout(function() {
          request({
            method: 'GET'
          , url: state.authorizationUrl
          }, function(err, res, body) {
            if (!err && res.body) {
              try {
                body = bodyToError(res, body);
              } catch(e) {
                err = e;
              }
            }

            ensureValidation(err, res, body, unlink);
          });
        }, 1000);
      } else if (authz.status==='valid') {
        log('Validating domain ... done');
        state.validatedDomains.push(state.domain);
        state.validAuthorizationUrls.push(state.authorizationUrl);
        unlink();
        nextDomain();
      } else if (authz.status==='invalid') {
        unlink();
        challengesState = (authz.challenges || []).map(function (challenge) {
          var result =  ' - ' + challenge.uri + ' [' + challenge.status + ']';
          if (challenge.error) {
            result += '\n   ' + challenge.error.detail;
          }
          return result;
        }).join('\n');
        return handleErr(null,
            'The CA was unable to validate the file you provisioned. '
          + (authz.detail ? 'Details: ' + authz.detail : '')
          + (challengesState ? '\n' + challengesState : ''), body);
      } else {
        unlink();
        return handleErr(null, 'CA returned an authorization in an unexpected state' + authz.detail, authz);
      }
    }

    function getCertificate() {
      var csr=RSA.generateCsrWeb64(state.certKeypair, state.validatedDomains);
      log('Requesting certificate...');
      state.acme.post(state.newCertUrl, {
        resource:'new-cert',
        csr:csr,
        authorizations:state.validAuthorizationUrls
      }, function (err, res, body ) {
        if (!err && res.body) {
          try {
            body = bodyToError(res, body);
          } catch(e) {
            err = e;
          }
        }

        downloadCertificate(err, res, body);
      });
    }

    function downloadCertificate(err, res, body) {
      var links, certUrl;

      if (err) {
        handleErr(err, 'Certificate request failed');
        return;
      }

      if (Math.floor(res.statusCode/100)!==2) {
        err = new Error("invalid status code: " + res.statusCode);
        err.code = "E_STATUS_CODE";
        err.description = body;
        handleErr(err);
        return;
      }

      links=Acme.parseLink(res.headers.link);
      if (!links || !('up' in links)) {
        return handleErr(err, 'Failed to fetch issuer certificate');
      }

      log('Requesting certificate: done');

      state.certificate=body;
      certUrl=res.headers.location;
      request({
        method: 'GET'
      , url: certUrl
      , encoding: null
      }, function(err, res, body) {
        if (!err) {
          try {
            body = bodyToError(res, body);
          } catch(e) {
            err = e;
          }
        }

        if (err) {
          return handleErr(err, 'Failed to fetch cert from '+certUrl);
        }

        if (res.statusCode!==200) {
          return handleErr(err, 'Failed to fetch cert from '+certUrl, res.body.toString());
        }

        if (body.toString()!==state.certificate.toString()) {
          return handleErr(null, 'Cert at '+certUrl+' did not match returned cert');
        }

        log('Successfully verified cert at '+certUrl);
        downloadIssuerCert(links);
      });
    }

    function downloadIssuerCert(links) {
      log('Requesting issuer certificate...');
      request({
        method: 'GET'
      , url: links.up
      , encoding: null
      }, function(err, res, body) {
        if (!err) {
          try {
            body = bodyToError(res, body);
          } catch(e) {
            err = e;
          }
        }

        if (err || res.statusCode!==200) {
          return handleErr(err, 'Failed to fetch issuer certificate');
        }

        state.chainPem = certBufferToPem(body);
        log('Requesting issuer certificate: done');
        done();
      });
    }

    function done() {
      var privkeyPem = RSA.exportPrivatePem(state.certKeypair);

      cb(null, {
        cert: certBufferToPem(state.certificate)
      , privkey: privkeyPem
      , chain: state.chainPem
        // TODO nix backwards compat
      , key: privkeyPem
      , ca: state.chainPem
      });
    }

    function handleErr(err, text, info) {
      log(text, err, info);
      cb(err || new Error(text));
    }

    var NOOP = function () {};
    var log = options.debug ? console.log : NOOP;
    var state={
      validatedDomains:[]
    , validAuthorizationUrls:[]
    , newAuthzUrl: options.newAuthzUrl
    , newCertUrl: options.newCertUrl
    };

    if (!options.challengeType) {
      options.challengeType = 'http-01';
    }
    if (-1 === [ 'http-01', 'tls-sni-01', 'dns-01' ].indexOf(options.challengeType)) {
      return handleErr(new Error("options.challengeType '" + options.challengeType + "' is not yet supported"));
    }
    if (!options.newAuthzUrl) {
      return handleErr(new Error("options.newAuthzUrl must be the authorization url"));
    }
    if (!options.newCertUrl) {
      return handleErr(new Error("options.newCertUrl must be the new certificate url"));
    }
    if (!options.accountKeypair) {
      if (!options.accountPrivateKeyPem) {
        return handleErr(new Error("options.accountKeypair must be an object with `privateKeyPem` and/or `privateKeyJwk`"));
      }
      console.warn("'accountPrivateKeyPem' is deprecated. Use options.accountKeypair.privateKeyPem instead.");
      options.accountKeypair = RSA.import({ privateKeyPem: options.accountPrivateKeyPem });
    }
    if (!options.domainKeypair) {
      if (!options.domainPrivateKeyPem) {
        return handleErr(new Error("options.domainKeypair must be an object with `privateKeyPem` and/or `privateKeyJwk`"));
      }
      console.warn("'domainPrivateKeyPem' is deprecated. Use options.domainKeypair.privateKeyPem instead.");
      options.domainKeypair = RSA.import({ privateKeyPem: options.domainPrivateKeyPem });
    }
    if (!options.setChallenge) {
      return handleErr(new Error("options.setChallenge must be function(hostname, challengeKey, tokenValue, done) {}"));
    }
    if (!options.removeChallenge) {
      return handleErr(new Error("options.removeChallenge must be function(hostname, challengeKey, done) {}"));
    }
    if (!(options.domains && options.domains.length)) {
      return handleErr(new Error("options.domains must be an array of domains such as ['example.com', 'www.example.com']"));
    }

    state.domains = options.domains.slice(0); // copy array
    try {
      state.accountKeypair = options.accountKeypair;
      state.certKeypair = options.domainKeypair;
      state.acme = new Acme(state.accountKeypair);
    } catch(err) {
      return handleErr(err, 'Failed to parse privateKey');
    }

    nextDomain();
  }

  return getCert;
};
