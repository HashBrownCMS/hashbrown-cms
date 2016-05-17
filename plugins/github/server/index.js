'use strict';

let request = require('request');
let config = require('./config.json');
let Promise = require('bluebird');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let oAuthCache = {};

class GitHub {
    static init(app) {
        app.get('/api/github/:org/:repo/publish', GitHub.publish);
        app.get('/api/github/:org/:repo/dirs', GitHub.getRootDirectories);
        app.get('/api/github/orgs', GitHub.getOrgs);
        app.get('/api/github/:org/repos', GitHub.getRepos);
        app.get('/api/github/oauth/:clientId/:clientSecret/:connection', GitHub.startOAuthFlow);
        app.get('/api/github/oauth/callback/code', GitHub.oAuthCodeCallback);
    }

    /**
     * Api call
     *
     * @param {String} path
     *
     * @return {Promise} promise
     */
    //static apiCall(path) {
    //    console.log('[GitHub] Calling API endpoint "' + path + '"...');

    //    return new Promise(function(callback) {
    //        request({
    //            url: 'https://api.github.com/' + path,
    //            json: true,
    //            headers: {
    //                'User-Agent': 'Endomon-CMS',
    //                'Host': 'api.github.com',
    //                'Authorization': 'Basic ' + new Buffer(credentials.usr + ':' + credentials.pwd).toString('base64')
    //            }
    //        }, function(err, response, body) {
    //            if(err) {
    //                throw err;
    //            }    

    //            if(response.body && response.body.message) {
    //                console.log('[GitHub] -> ' + response.body.message);
    //            }

    //            callback(response);
    //        });
    //    });
    //}
    
    /**
     * Api call
     *
     * @param {String} path
     * @param {String} token
     *
     * @return {Promise} promise
     */
    static apiCall(path) {
        return new Promise(function(callback) {
            
        });
    }

    /**
     * Facilitates the GitHub OAuth web flow
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
        
        console.log('[GitHub] Requesting OAuth token with id "' + oAuthCache.clientId + '", secret "' + oAuthCache.clientSecret + '" and temporary code "' + code + '"');
    
        // Exchange the code for a token
        request({
            url: 'https://github.com/login/oauth/access_token',
            type: 'post',
            json: true,
            data: {
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

            console.log('[GitHub] -> ', response.body);
/*
            ConnectionHelper.setConnectionSettingById(connectionCache, { token: token })
            .then(function() {
                res.redirect('/#/connections/' + oAuthCache.connection);

                connectionCache = '';
            });*/
        });
    }

    /**
     * Gets all root directories
     */
    static getRootDirectories(req, res) {
        GitHub.apiCall('repos/' + req.params.org + '/' + req.params.repo + '/contents/')
        .then(function(response) {
            let files = response.body;
            let dirs = [];

            for(let file of files) {
                if(file.type == 'dir') {
                    dirs[dirs.length] = file.path;
                }
            }

            res.send(dirs);
        }); 
    }

    /**
     * Gets all organisations
     */
    static getOrgs(req, res) {
        GitHub.apiCall('user/orgs/', req.query.token)
        .then(function(response) {
            let orgs = response.body;

            res.send(orgs);
        }); 
    }
    
    /**
     * Gets all repositories
     */
    static getRepos(req, res) {
        GitHub.apiCall('orgs/' + req.params.org + '/repos/')
        .then(function(response) {
            let repos = response.body;

            res.send(repos);
        }); 
    }

    /**
     * Publishes content
     */
    static publish(req, res) {
        let content = req.body.content;        
        let media = req.body.media;

        // TODO: Render content to YAML if needed
        // TODO: Push content to repo if needed
        // TODO: Push media to repo if needed

        res.sendStatus(200);
    }

    /**
     * Gets all issues
     */
    static getAllIssues(req, res) {
        GitHub.apiCall('repos/' + config.org + '/' + config.repo + '/issues?state=all')
        .then(function(response) {
            res.send(response.body);
        }); 
   } 
}

module.exports = GitHub;
