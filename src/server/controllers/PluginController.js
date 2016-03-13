'use strict';

let Controller = require('./Controller');

// Promise
let Promise = require('bluebird');

// Libs
let fs = require('fs');
let glob = require('glob');

/**
 * A controller for managing Plugins
 */
class PluginController extends Controller {
    /**
     * Initialises all plugins located at /plugins/:name/server/index.js
     */
    static init() {
        return new Promise(function(callback) {
            glob(appRoot + '/plugins/*/server/index.js', function(err, paths) {
                for(let path of paths) {
                    let plugin = require(path);

                    plugin.init();
                }

                callback();
            });
        });
    }
}

module.exports = PluginController;
