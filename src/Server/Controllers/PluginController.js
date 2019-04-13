'use strict';

const Path = require('path');

/**
 * The controller for serving plugin content
 *
 * @memberof HashBrown.Server.Controllers
 */
class PluginController extends HashBrown.Controllers.Controller {
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
    static async getJs(req, res) {
        let paths = await HashBrown.Helpers.FileHelper.list(Path.join(APP_ROOT, 'plugins', '*' , 'client', '**', '*.js'));
    
        let compiledJs = '';

        for(let path of paths) {
            let file = await HashBrown.Helpers.FileHelper.read(path);
            
            compiledJs += file.toString('utf8');
        }

        res.set('Content-Type', 'text/javascript');
        res.send(compiledJs);
    }
    
    /**
     * Serves CSS files
     */
    static async getCss(req, res) {
        let paths = await HashBrown.Helpers.FileHelper.list(Path.join(APP_ROOT, 'plugins', '*' , 'client', '**', '*.css'));
    
        let compiledCss = '';

        for(let path of paths) {
            let file = await HashBrown.Helpers.FileHelper.read(path);
            
            compiledCss += file.toString('utf8');
        }

        res.set('Content-Type', 'text/css');
        res.send(compiledCss);
    }
}

module.exports = PluginController;
