'use strict';

// Libs
const Glob = require('glob');
const FileSystem = require('fs');

class PluginHelper {
    /**
     * Initialises all plugins located at /plugins/:name/server/index.js
     *
     * @param {Object} app Express.js server instance
     *
     * @returns {Promise} Client side file URLs
     */
    static init(app) {
        app.get('/js/plugins.js', PluginHelper.serveJsFiles);
        app.get('/css/plugins.cs', PluginHelper.serveCssFiles);

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

    /**
     * Serves JS files
     */
    static serveJsFiles(req, res) {
        Glob(appRoot + '/plugins/**/client.js', (err, paths) => {
            let compiledJs = '';

            for(let path of paths) {
                compiledJs += FileSystem.readFileSync(path, 'utf8');
            }

            res.send(compiledJs);
        });
    }
    
    /**
     * Serves CSS files
     */
    static serveCssFiles(req, res) {
        Glob(appRoot + '/plugins/**/client.css', (err, paths) => {
            let compiledCss = '';

            for(let path of paths) {
                compiledCss += FileSystem.readFileSync(path, 'utf8');
            }

            res.send(compiledCss);
        });
    }
}

module.exports = PluginHelper;
