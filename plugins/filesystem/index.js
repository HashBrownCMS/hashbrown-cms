'use strict';

const Deployer = require('./server/Deployer');

/**
 * The HashBrown FileSystem plugin
 */
class FileSystem {
    /**
     * Init this plugin
     */
    static init(app) {
        HashBrown.Helpers.ConnectionHelper.registerDeployer(Deployer);
    }
}

module.exports = FileSystem;
