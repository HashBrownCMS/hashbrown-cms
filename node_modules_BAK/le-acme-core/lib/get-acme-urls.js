/*!
 * letiny-core
 * Copyright(c) 2015 AJ ONeal <aj@daplie.com> https://daplie.com
 * Apache-2.0 OR MIT (and hence also MPL 2.0)
*/
'use strict';

module.exports.create = function (deps) {
  var request = deps.request;
  var knownUrls = deps.LeCore.knownEndpoints;

  function getAcmeUrls(acmeDiscoveryUrl, cb) {
    if ('string' !== typeof acmeDiscoveryUrl) {
      cb(new Error("getAcmeUrls: acmeDiscoveryUrl must be a string"));
    }

    // TODO check response header on request for cache time
    return request({
      url: acmeDiscoveryUrl
    , encoding: 'utf8'
    }, function (err, resp) {
      if (err) {
        cb(err);
        return;
      }

      var data = resp.body;

      if ('string' === typeof data) {
        try {
          data = JSON.parse(data);
        } catch(e) {
          e.raw = data;
          e.url = acmeDiscoveryUrl;
          e.stack += '\n\nresponse data:\n'
            + data + '\n\nacmeDiscoveryUrl:' + acmeDiscoveryUrl;
          cb(e);
          return;
        }
      }

      if (5 !== Object.keys(data).length) {
        console.warn("This Let's Encrypt / ACME server has been updated with urls that this client doesn't understand");
        console.warn(data);
      }

      if (!knownUrls.every(function (url) {
        return data[url];
      })) {
        console.warn("This Let's Encrypt / ACME server is missing urls that this client may need.");
        console.warn(data);
      }

      cb(null, {
        newAuthz: data['new-authz']
      , newCert: data['new-cert']
      , newReg: data['new-reg']
      , revokeCert: data['revoke-cert']
      , keyChange: data['key-change']
      });
    });
  }

  return getAcmeUrls;
};
