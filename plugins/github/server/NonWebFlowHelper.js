'use strict';

let request = require('request');
let Promise = require('bluebird');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let oAuthCache = {};

/**
 * The non web flow helper class
 */
class NonWebFlowHelper {
    static init(app) {
        app.get('/api/github/oauth/:username/:password/:clientId/:clientSecret/:connection', GitHub.startOAuthFlow);
        app.get('/api/github/oauth/callback/code', GitHub.oAuthCodeCallback);
    }

    /**
     * Starts the OAuth web flow
     */
    static startOAuthFlow(req, res) {
        oAuthCache = {
            username: req.params.username,
            password: req.params.password,
            clientId: req.params.clientId,
            clientSecret: req.params.clientSecret,
            connection: req.params.connection
        };

        return new Promise(function(callback) {
            request({
                url: 'https://api.github.com/authorizations',
                json: true,
                method: 'POST',
                postData: {
                    client_id: oAuthCache.clientId,
                    client_secret: oAuthCache.clientSecret
                },
                headers: {
                    'User-Agent': 'Endomon-CMS',
                    'Host': 'api.github.com',
                    'Authorization': 'Basic ' + new Buffer(credentials.usr + ':' + credentials.pwd).toString('base64')
                }
            }, function(err, response, body) {
                if(err) {
                    throw err;
                }    

                if(response.body && response.body.message) {
                    console.log('[GitHub] -> ' + response.body.message);
                }

                callback(response);
            });
        });
    }

    /**
     * GitHub OAuth code callback
     */
    static oAuthCodeCallback(req, res) {
    }
}

module.exports = NonWebFlowHelper;
