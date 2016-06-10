'use strict';

// Libs
let glob = require('glob');
let fs = require('fs');

class PluginHelper {
    /**
     * Initialises all plugins located at /plugins/:name/server/index.js
     *
     * @param {Object} app Express.js server instance
     */
    static init(app) {
        return new Promise(function(callback) {
            glob(appRoot + '/plugins/*/server/index.js', function(err, paths) {
                for(let path of paths) {
                    let plugin = require(path);

                    plugin.init(app);
                }

                callback();
            });
        });
    }
}

module.exports = PluginHelper;
