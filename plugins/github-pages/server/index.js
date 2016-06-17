'use strict';

let GitHubConnection = require('../common/models/GitHubConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let restler = require('restler');

let config = require('../config.json');

class GitHubPages {
    static init(app) {
        ConnectionHelper.registerConnectionType('GitHub Pages', GitHubConnection);

        app.get('/api/github/oauth/start', (req, res) => {
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
                data: JSON.stringify(data),
                headers: headers    
            })
            .on('complete', (data, response) => {
                res.send(data);
            });
        });

        app.get('/api/github/orgs/', (req, res) => {
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
