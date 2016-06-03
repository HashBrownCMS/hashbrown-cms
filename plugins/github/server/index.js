'use strict';

let GitHubConnection = require('../common/models/GitHubConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let token = '';

class GitHub {
    static init(app) {
        ConnectionHelper.registerConnectionType('github', GitHubConnection);

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

module.exports = GitHub;
