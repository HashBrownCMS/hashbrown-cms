'use strict';

let Controller = require('./Controller');

// Libs
let fs = require('fs');

/**
 * A controller for managing Plugins
 */
class PluginController extends Controller {
    static init() {
        let folders = fs.readdirSync(appRoot + '/plugins');
        
        for(let folder of folders) {
            let path = appRoot + '/plugins/' + folder + '/index.js';
            let plugin = require(path);

            plugin.init();
        }
    }
}

module.exports = PluginController;
