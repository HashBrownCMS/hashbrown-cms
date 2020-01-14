'use strict';

const Path = require('path');

/**
 * The helper class for plugins
 *
 * @memberof HashBrown.Server.Service
 */
class PluginService {
    /**
     * Initialises all plugins located at /plugins/:name/src/Server/index.js
     */
    static async init() {
        let path = Path.join(APP_ROOT, 'plugins');
        let folders = await HashBrown.Service.FileService.list(path);

        for(let plugin of folders) {
            let indexPath = Path.join(path, plugin, 'src', 'Server', 'index.js');
            let indexExists = await HashBrown.Service.FileService.exists(indexPath);

            require(indexPath);
        }
    }
}

module.exports = PluginService;
