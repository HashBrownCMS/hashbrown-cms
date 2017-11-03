'use strict';

let Connection = require('./server/Connection');
let ConnectionHelper = require('Server/Helpers/ConnectionHelper');

class HashBrownDriver {
    static init(app) {

        //ConnectionHelper.registerConnectionType('HashBrown Driver', Connection);
    }
}

module.exports = HashBrownDriver;
