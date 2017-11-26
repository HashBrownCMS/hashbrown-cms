'use strict';

const Deployer = require('./server/Deployer');

/**
 * The HashBrown API plugin
 */
class API {
    /**
     * Init this plugin
     */
    static init(app) {
        HashBrown.Helpers.ConnectionHelper.registerDeployer(Deployer);
    }
}

module.exports = API;
