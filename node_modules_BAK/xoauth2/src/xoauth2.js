'use strict';

var Stream = require('stream').Stream;
var utillib = require('util');
var querystring = require('querystring');
var http = require('http');
var https = require('https');
var urllib = require('url');
var crypto = require('crypto');

/**
 * Wrapper for new XOAuth2Generator.
 *
 * Usage:
 *
 *     var xoauthgen = createXOAuth2Generator({});
 *     xoauthgen.getToken(function(err, xoauthtoken){
 *         socket.send('AUTH XOAUTH2 ' + xoauthtoken);
 *     });
 *
 * @param {Object} options See XOAuth2Generator for details
 * @return {Object}
 */
module.exports.createXOAuth2Generator = function(options) {
    return new XOAuth2Generator(options);
};

/**
 * XOAUTH2 access_token generator for Gmail.
 * Create client ID for web applications in Google API console to use it.
 * See Offline Access for receiving the needed refreshToken for an user
 * https://developers.google.com/accounts/docs/OAuth2WebServer#offline
 *
 * @constructor
 * @param {Object} options Client information for token generation
 * @param {String} options.user         (Required) User e-mail address
 * @param {String} options.clientId     (Required) Client ID value
 * @param {String} options.clientSecret (Required) Client secret value
 * @param {String} options.refreshToken (Required) Refresh token for an user
 * @param {String} options.accessUrl    (Optional) Endpoint for token generation, defaults to 'https://accounts.google.com/o/oauth2/token'
 * @param {String} options.accessToken  (Optional) An existing valid accessToken
 * @param {int}    options.timeout      (Optional) TTL in seconds
 */
function XOAuth2Generator(options) {
    Stream.call(this);
    this.options = options || {};

    if (options && options.service) {
        if (!options.scope || !options.privateKey || !options.user) {
            throw new Error('Options "scope", "privateKey" and "user" are required for service account!');
        }

        var serviceRequestTimeout = Math.min(Math.max(Number(this.options.serviceRequestTimeout) || 0, 0), 3600);
        this.options.serviceRequestTimeout = serviceRequestTimeout || 5 * 60;
    }

    this.options.accessUrl = this.options.accessUrl || 'https://accounts.google.com/o/oauth2/token';
    this.options.customHeaders = this.options.customHeaders || {};
    this.options.customParams = this.options.customParams || {};

    this.token = this.options.accessToken && this.buildXOAuth2Token(this.options.accessToken) || false;
    this.accessToken = this.token && this.options.accessToken || false;

    var timeout = Math.max(Number(this.options.timeout) || 0, 0);
    this.timeout = timeout && Date.now() + timeout * 1000 || 0;
}
utillib.inherits(XOAuth2Generator, Stream);

/**
 * Returns or generates (if previous has expired) a XOAuth2 token
 *
 * @param {Function} callback Callback function with error object and token string
 */
XOAuth2Generator.prototype.getToken = function(callback) {
    if (this.token && (!this.timeout || this.timeout > Date.now())) {
        return callback(null, this.token, this.accessToken);
    }
    this.generateToken(callback);
};

/**
 * Updates token values
 *
 * @param {String} accessToken New access token
 * @param {Number} timeout Access token lifetime in seconds
 *
 * Emits 'token': { user: User email-address, accessToken: the new accessToken, timeout: TTL in seconds}
 */
XOAuth2Generator.prototype.updateToken = function(accessToken, timeout) {
    this.token = this.buildXOAuth2Token(accessToken);
    this.accessToken = accessToken;
    timeout = Math.max(Number(timeout) || 0, 0);
    this.timeout = timeout && Date.now() + timeout * 1000 || 0;

    this.emit('token', {
        user: this.options.user,
        accessToken: accessToken || '',
        timeout: Math.max(Math.floor((this.timeout - Date.now()) / 1000), 0)
    });
};

/**
 * Generates a new XOAuth2 token with the credentials provided at initialization
 *
 * @param {Function} callback Callback function with error object and token string
 */
XOAuth2Generator.prototype.generateToken = function(callback) {
    var urlOptions;
    if (this.options.service) {
        // service account - https://developers.google.com/identity/protocols/OAuth2ServiceAccount
        var iat = Math.floor(Date.now() / 1000); // unix time
        var token = jwtSignRS256({
            iss: this.options.service,
            scope: this.options.scope,
            sub: this.options.user,
            aud: this.options.accessUrl,
            iat: iat,
            exp: iat + this.options.serviceRequestTimeout,
        }, this.options.privateKey);

        urlOptions = {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: token
        };
    }
    else {
        // web app - https://developers.google.com/identity/protocols/OAuth2WebServer
        urlOptions = {
            client_id: this.options.clientId || '',
            client_secret: this.options.clientSecret || '',
            refresh_token: this.options.refreshToken,
            grant_type: 'refresh_token'
        };
    }

    for (var param in this.options.customParams) {
        urlOptions[param] = this.options.customParams[param];
    }

    var payload = querystring.stringify(urlOptions);
    var self = this;
    postRequest(this.options.accessUrl, payload, this.options, function (error, response, body) {
        var data;

        if (error) {
            return callback(error);
        }

        try {
            data = JSON.parse(body.toString());
        } catch (E) {
            return callback(E);
        }

        if (!data || typeof data !== 'object') {
            return callback(new Error('Invalid authentication response'));
        }

        if (data.error) {
            return callback(new Error(data.error));
        }

        if (data.access_token) {
            self.updateToken(data.access_token, data.expires_in);
            return callback(null, self.token, self.accessToken);
        }

        return callback(new Error('No access token'));
    });
};

/**
 * Converts an access_token and user id into a base64 encoded XOAuth2 token
 *
 * @param {String} accessToken Access token string
 * @return {String} Base64 encoded token for IMAP or SMTP login
 */
XOAuth2Generator.prototype.buildXOAuth2Token = function(accessToken) {
    var authData = [
        'user=' + (this.options.user || ''),
        'auth=Bearer ' + accessToken,
        '',
        ''
    ];
    return new Buffer(authData.join('\x01'), 'utf-8').toString('base64');
};

/**
 * Custom POST request handler.
 * This is only needed to keep paths short in Windows – usually this module
 * is a dependency of a dependency and if it tries to require something
 * like the request module the paths get way too long to handle for Windows.
 * As we do only a simple POST request we do not actually require complicated
 * logic support (no redirects, no nothing) anyway.
 *
 * @param {String} url Url to POST to
 * @param {String|Buffer} payload Payload to POST
 * @param {Function} callback Callback function with (err, buff)
 */
function postRequest(url, payload, params, callback) {
    var options = urllib.parse(url),
        finished = false,
        response = null,
        req;

    options.method = 'POST';

    /**
     * Cleanup all the event listeners registered on the request, and ensure that *callback* is only called one time
     *
     * @note passes all the arguments passed to this function to *callback*
     */
    var cleanupAndCallback = function() {
        if (finished === true) {
            return;
        }
        finished = true;
        req.removeAllListeners();
        if (response !== null) {
            response.removeAllListeners();
        }
        callback.apply(null, arguments);
    };

    req = (options.protocol === 'https:' ? https : http).request(options, function(res) {
        response = res;
        var data = [];
        var datalen = 0;

        res.on('data', function(chunk) {
            data.push(chunk);
            datalen += chunk.length;
        });

        res.on('end', function() {
            return cleanupAndCallback(null, res, Buffer.concat(data, datalen));
        });

        res.on('error', function(err) {
            return cleanupAndCallback(err);
        });
    });

    req.on('error', function(err) {
        return cleanupAndCallback(err);
    });

    if (payload) {
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setHeader('Content-Length', typeof payload === 'string' ? Buffer.byteLength(payload) : payload.length);
    }

    for (var customHeaderName in params.customHeaders) {
      req.setHeader(customHeaderName, params.customHeaders[customHeaderName]);
    }

    req.end(payload);
}

/**
 * Encodes a buffer or a string into Base64url format
 *
 * @param {Buffer|String} data The data to convert
 * @return {String} The encoded string
 */
function toBase64URL(data) {
    if (typeof data === 'string') {
        data = new Buffer(data);
    }

    return data.toString('base64')
        .replace(/=+/g, '')     // remove '='s
        .replace(/\+/g, '-')    // '+' → '-'
        .replace(/\//g, '_');   // '/' → '_'
}

/**
 * Header used for RS256 JSON Web Tokens, encoded as Base64URL.
 */
var JWT_RS256_HEADER = toBase64URL('{"alg":"RS256","typ":"JWT"}');

/**
 * Creates a JSON Web Token signed with RS256 (SHA256 + RSA)
 * Only this specific operation is needed so it's implemented here
 * instead of depending on jsonwebtoken.
 *
 * @param {Object} payload The payload to include in the generated token
 * @param {String} privateKey Private key in PEM format for signing the token
 * @return {String} The generated and signed token
 */
function jwtSignRS256(payload, privateKey) {
    var signaturePayload = JWT_RS256_HEADER + '.' + toBase64URL(JSON.stringify(payload));

    var rs256Signer = crypto.createSign('RSA-SHA256');
    rs256Signer.update(signaturePayload);
    var signature = toBase64URL(rs256Signer.sign(privateKey));

    return signaturePayload + '.' + signature;
}
