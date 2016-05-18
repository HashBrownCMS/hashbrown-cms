'use strict';

let request = require('request');
let Promise = require('bluebird');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let oAuthCache = {};

/**
 * The webflow helper class
 * Currently this doens't work unless Endomon is hosted already
 */
class WebFlowHelper {
    static init(app) {
        app.get('/api/github/oauth/:clientId/:clientSecret/:connection', WebFlowHelper.startOAuthFlow);
        app.get('/api/github/oauth/callback/code', WebFlowHelper.oAuthCodeCallback);
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
        
        let url = 'https://github.com/login/oauth/authorize';
        
        url += '?client_id=' + req.params.clientId;
        url += '&redirect_uri=http://' + req.headers.host + '/api/github/oauth/callback/code';
        url += '&scope=repo read:org user';

        res.redirect(url);
    }

    /**
     * GitHub OAuth code callback
     */
    static oAuthCodeCallback(req, res) {
        let code = req.query.code;
        
        // Exchange the code for a token
        request({
            url: 'https://github.com/login/oauth/access_token',
            method: 'POST',
            json: true,
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': 'true',
                'content-type': 'application/json'  
            },
            postData: {
                client_id: oAuthCache.clientId,
                client_secret: oAuthCache.clientSecret,
                code: code
            }
        }, function(err, response, body) {
            if(err) {
                throw err;
            }    

            if(response.body && response.body.message) {
                console.log('[GitHub] -> ' + response.body.message);
            }

            console.log(response.body);

/*            let token = response.body.access_token;

            ConnectionHelper.setConnectionSettingById(connectionCache, { token: token })
            .then(function() {
                res.redirect('/#/connections/' + oAuthCache.connection);

                connectionCache = {};
            });*/
        });
    }
}

module.exports = WebFlowHelper;
