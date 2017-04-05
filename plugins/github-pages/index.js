'use strict';

let Connection = require('./server/Connection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let fs = require('fs');

let route = '';

class GitHubPages {
    static init(app) {
        let config = ConfigHelper.getSync('plugins/github');

        ConnectionHelper.registerConnectionType('GitHub Pages', Connection);

        /**
         * Starts the oAuth flow
         */
        app.get('/plugins/github/oauth/start', (req, res) => {
            if(!config || !config.clientId || !config.clientSecret) {
                res.status(502).send('Malformed or non-existent GitHub config file (/config/plugins/github.cfg)');
            }

            route = req.query.route;

            res.redirect('https://github.com/login/oauth/authorize?client_id=' + config.clientId + '&scope=repo read:org');
        });

        /**
         * Ends the oAuth flow
         */
        app.get('/plugins/github/oauth/end', (req, res) => {
            let code = req.query.code;
            let data = {
                code: code,
                client_id: config.clientId,
                client_secret: config.clientSecret
            };

            let headers = {
                'Accept': 'application/json'
            };

            RequestHelper.post('https://github.com/login/oauth/access_token', {
                data: data,
                headers: headers    
            })
            .on('complete', (data, response) => {
                let token = data.access_token;
                
                res.send(token);
            });
        });

        /**
         * Lists all user orgs
         */
        app.get('/plugins/github/orgs', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
           
            RequestHelper.get('https://api.github.com/user/orgs?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                res.send(data);
            });
        });

        /**
         * Lists all user repos
         */
        app.get('/plugins/github/repos', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            let apiUrl = '';
            
            if(req.query.org && req.query.org != 'undefined') {
                apiUrl = 'https://api.github.com/users/' + req.query.org + '/repos';
            } else {
                apiUrl = 'https://api.github.com/user/repos';
            }
            
            RequestHelper.get(apiUrl + '?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                res.send(data);
            });
        });

        /**
         * Lists all branches
         */
        app.get('/plugins/github/:owner/:repo/branches', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            RequestHelper.get('https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/branches?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                res.send(data);
            });
        });

        /**
         * Lists all root directories
         */
        app.get('/plugins/github/:owner/:repo/dirs', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            RequestHelper.get('https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/contents?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let dirs = [];

                if(data) {
                    for(let i in data) {
                        let file = data[i];

                        if(file.type == 'dir') {
                            dirs[dirs.length] = file.path;
                        }
                    }
                }

                res.send(dirs);
            });
        });
    }
}

module.exports = GitHubPages;
