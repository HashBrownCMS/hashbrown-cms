'use strict';

let HashBrownDriverConnection = require('../common/models/HashBrownDriverConnection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

class HashBrownDriver {
    static init(app) {
        ConnectionHelper.registerConnectionType('HashBrown Driver', HashBrownDriverConnection);
    }
}

module.exports = HashBrownDriver;
