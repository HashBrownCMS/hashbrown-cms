'use strict';

let GitHubConnection = require('../common/models/GitHubConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let restler = require('restler');
let fs = require('fs');

let config = require('../config.json');

let route = '';

class GitHubPages {
    static init(app) {
        ConnectionHelper.registerConnectionType('GitHub Pages', GitHubConnection);

        app.get('/api/github/oauth/start', (req, res) => {
            route = req.query.route;

            res.redirect('https://github.com/login/oauth/authorize?client_id=' + config.client.id + '&scope=repo');
        });

        app.get('/api/github/oauth/callback', (req, res) => {
            let code = req.query.code;
            let data = {
                code: code,
                client_id: config.client.id,
                client_secret: config.client.secret
            };
            let headers = {
                'Accept': 'application/json'
            };

            restler.post('https://github.com/login/oauth/access_token', {
                data: data,
                headers: headers    
            })
            .on('complete', (data, response) => {
                let token = data.access_token;

                res.redirect('/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/#' + route + '?token=' + token);
            });
        });

        app.get('/api/github/repos', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/user/repos?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                res.send(data);
            });
        });

        app.get('/api/github/:owner/:repo/dirs', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/contents?access_token=' + req.query.token, {
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

        app.get('/api/github/:owner/:repo/templates', (req, res) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/contents/_layouts?access_token=' + req.query.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let templates = [];

                if(data) {
                    for(let i in data) {
                        let file = data[i];

                        templates[templates.length] = file.path.replace('_layouts', '');
                    }
                }

                res.send(templates);
            });
        });
    }
}

module.exports = GitHubPages;
