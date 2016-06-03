'use strict';

let GitHubConnection = require('../common/models/GitHubConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

let token = '';

class GitHub {
    static init(app) {
        ConnectionHelper.registerConnectionType('github', GitHubConnection);
    }
}

module.exports = GitHub;
