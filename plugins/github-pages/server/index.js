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

            res.redirect('https://github.com/login/oauth/authorize?client_id=' + config.client.id);
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

                res.redirect(appRoot + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/' + route + '?token=' + token);
            });
        });

        app.get('/api/github/repos/', (req, res) => {
            let connectionId = req.query.connectionId;

            if(connectionId) {
                ConnectionHelper.getConnectionById(connectionId)
                .then((connection) => {
                    connection.getOrgs()
                    .then((orgs) => {
                        res.send(orgs);
                    });
                });

            } else {
                res.send(400);
            
            }
        });
    }
}

module.exports = GitHubPages;
