'use strict';

const Path = require('path');

/**
 * The helper class for plugins
 *
 * @memberof HashBrown.Server.Service
 */
class PluginService {
    /**
     * Initialises all plugins located at /plugins/:name/server/index.js
     *
     * @param {Object} app Express.js server instance
     */
    static async init(app) {
        let paths = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'plugins', '*'));
        
        for(let path of paths) {
            let plugin = require(Path.join(path, 'index.js'));
            
            plugin.init(app);
        }
    }
}

module.exports = PluginService;
