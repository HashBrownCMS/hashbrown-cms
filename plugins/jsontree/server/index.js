'use strict';

let JsonTreeConnection = require('../common/models/JsonTreeConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

class GitHub {
    static init(app) {
        ConnectionHelper.registerConnectionType('jsontree', JsonTreeConnection);
    }
}

module.exports = GitHub;
