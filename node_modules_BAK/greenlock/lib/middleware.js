'use strict';

var utils = require('./utils');

function _log(debug) {
  if (debug) {
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    args.unshift("[le/lib/middleware.js]");
    console.log.apply(console, args);
  }
}

module.exports.create = function (le) {
  if (!le.challenges['http-01'] || !le.challenges['http-01'].get) {
    throw new Error("middleware requires challenge plugin with get method");
  }
  var log = le.log || _log;

  log(le.debug, "created middleware");
  return function (_app) {
    if (_app && 'function' !== typeof _app) {
      throw new Error("use le.middleware() or le.middleware(function (req, res) {})");
    }
    var prefix = le.acmeChallengePrefix || '/.well-known/acme-challenge/';

    return function (req, res, next) {
      if (0 !== req.url.indexOf(prefix)) {
        log(le.debug, "no match, skipping middleware");
        if ('function' === typeof _app) {
          _app(req, res, next);
        }
        else if ('function' === typeof next) {
          next();
        }
        else {
          res.statusCode = 500;
          res.end("[500] Developer Error: app.use('/', le.middleware()) or le.middleware(app)");
        }
        return;
      }

      log(le.debug, "this must be tinder, 'cuz it's a match!");

      var token = req.url.slice(prefix.length);
      var hostname = req.hostname || (req.headers.host || '').toLowerCase().replace(/:.*/, '');

      log(le.debug, "hostname", hostname, "token", token);

      var copy = utils.merge({ domains: [ hostname ] }, le);
      copy = utils.tplCopy(copy);

      // TODO tpl copy?
      // TODO need to restore challengeType
      le.challenges['http-01'].get(copy, hostname, token, function (err, secret) {
        if (err || !token) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end('{ "error": { "message": "Error: These aren\'t the tokens you\'re looking for. Move along." } }');
          return;
        }

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end(secret);
      });
    };
  };
};
