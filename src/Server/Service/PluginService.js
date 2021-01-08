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
            let indexPath = Path.join(plugin, 'src', 'Server', 'index.js');
            
            if(!HashBrown.Service.FileService.exists(indexPath)) { continue; }

            require(indexPath);

            // Locales
            let localeFiles = await HashBrown.Service.FileService.list(Path.join(plugin, 'i18n'));

            for(let file of localeFiles) {
                if(Path.extname(file) !== '.json') { continue; }

                HashBrown.Service.LocaleService.appendSystemLocale(
                    Path.basename(file, Path.extname(file)),
                    require(file)
                );
            }
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

    /**
     *  Gets a list of all plugins
     *
     *  @return {Array} Plugins
     */
    static async getPlugins() {
        let path = Path.join(APP_ROOT, 'plugins');
        let folders = await HashBrown.Service.FileService.list(path);

        let plugins = [];

        for(let plugin of folders) {
            let packageData = {};
            let packagePath = Path.join(plugin, 'package.json');

            if(HashBrown.Service.FileService.exists(packagePath)) {
                packageData = require(packagePath);
            }

            if(!packageData.name) {
                packageData.name = Path.basename(plugin);
            }

            plugins.push(packageData);
        }

        plugins.sort((a, b) => {
            return a.name > b.name ? -1 : 1;
        });

        return plugins;
    }
}

module.exports = PluginService;
