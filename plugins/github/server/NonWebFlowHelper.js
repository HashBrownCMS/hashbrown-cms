'use strict';

let request = require('request');
let Promise = require('bluebird');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let credentialCache = {};
let oAuthCache = {};

/**
 * The non web flow helper class
 */
class NonWebFlowHelper {
    static init(app) {
        app.post('/api/github/login/', NonWebFlowHelper.login);
        app.get('/api/github/oauth/:clientId/:clientSecret/:connection', NonWebFlowHelper.startOAuthFlow);
        app.get('/api/github/oauth/callback', NonWebFlowHelper.oAuthCodeCallback);
    }

    /**
     * Login
     */
    static login(req, res) {
        let username = req.body.username;
        let password = req.body.password;

        console.log('[GitHub] Authorising user "' + username + '"...');

        request({
            url: 'https://api.github.com/user',
            json: true,
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
            }
        }, function(err, response, body) {
            if(err) {
                throw err;
            }    

            if(response.body && response.body.message) {
                console.log('[GitHub] -> ' + response.body.message);
            }

            res.sendStatus(200);
        });
    }

    /**
     * Starts the OAuth web flow
     */
    static startOAuthFlow(req, res) {
        oAuthCache = {
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
