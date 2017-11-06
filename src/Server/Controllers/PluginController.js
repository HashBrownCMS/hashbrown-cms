'use strict';

const Glob = require('glob');
const FileSystem = require('fs');

const Controller = require('./Controller');

/**
 * The controller for serving plugin content
 *
 * @memberof HashBrown.Server.Controllers
 */
class PluginController extends Controller {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/js/plugins.js', this.getJs);
        app.get('/css/plugins.cs', this.getCss);
    }
    
    /**
     * Serves JS files
     */
    static getJs(req, res) {
        Glob(appRoot + '/plugins/*/client/**/*.js', (err, paths) => {
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
    static getCss(req, res) {
        Glob(appRoot + '/plugins/*/client/**/*.css', (err, paths) => {
            let compiledCss = '';

            for(let path of paths) {
                compiledCss += FileSystem.readFileSync(path, 'utf8');
            }

            res.send(compiledCss);
        });
    }
}

module.exports = PluginController;
