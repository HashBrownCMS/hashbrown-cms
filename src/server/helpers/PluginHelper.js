'use strict';

// Libs
let glob = require('glob');
let fs = require('fs');

// Cache
let cache = {
    js: '',
    css: ''
}

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
            glob(appRoot + '/plugins/*', (err, paths) => {
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
        if(cache.js) {
            res.send(cache.js);
        
        } else {
            glob(appRoot + '/plugins/*/client/client.js', (err, paths) => {
                for(let path of paths) {
                    cache.js += fs.readFileSync(path, 'utf8');
                }

                res.send(cache.js);
            });
        }
    }
    
    /**
     * Serves CSS files
     */
    static serveCssFiles(req, res) {
        if(cache.css) {
            res.send(cache.css);
        
        } else {
            glob(appRoot + '/plugins/*/client/client.css', (err, paths) => {
                for(let path of paths) {
                    cache.css += fs.readFileSync(path, 'utf8');
                }

                res.send(cache.css);
            });
        }
    }
}

module.exports = PluginHelper;
