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
            
            if(!HashBrown.Service.FileService.exists(indexPath)) { continue; }

            require(indexPath);
        }
    }

    /**
     * Gets a list of all themes
     *
     * @return {Array} Themes
     */
    static async getThemes() {
        let path = Path.join(APP_ROOT, 'plugins');
        let folders = await HashBrown.Service.FileService.list(path);

        let themes = [];

        for(let plugin of folders) {
            let themesPath = Path.join(path, plugin, 'theme');
            let files = await HashBrown.Service.FileService.list(themesPath);

            for(let file of files) {
                if(Path.extname(file) !== '.css') { continue; }

                themes.push(plugin + '/' + Path.basename(file, '.css'));
            }
        }

        return themes;
    }
}

module.exports = PluginService;
