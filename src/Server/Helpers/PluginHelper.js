'use strict';

const Glob = require('glob');

/**
 * The helper class for plugins
 *
 * @memberof HashBrown.Server.Helpers
 */
class PluginHelper {
    /**
     * Initialises all plugins located at /plugins/:name/server/index.js
     *
     * @param {Object} app Express.js server instance
     *
     * @returns {Promise} Client side file URLs
     */
    static init(app) {
        return new Promise((resolve, reject) => {
            Glob(appRoot + '/plugins/*', (err, paths) => {
                for(let path of paths) {
                    let plugin = require(path + '/index.js');
                    
                    plugin.init(app);
                }

                resolve();
            });
        });
    }
}

module.exports = PluginHelper;
