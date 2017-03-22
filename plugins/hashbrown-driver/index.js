'use strict';

let Connection = require('./server/Connection');
let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');

class HashBrownDriver {
    static init(app) {
        ConnectionHelper.registerConnectionType('HashBrown Driver', Connection);
    }
}

module.exports = HashBrownDriver;
