'use strict';

const Path = require('path');

/**
 * The controller for serving plugin content
 *
 * @memberof HashBrown.Server.Controller
 */
class PluginController extends HashBrown.Controller.ControllerBase {
    /**
     * Initialises this controller
     */
    static init(app) {
        app.get('/js/plugins.js', this.js);
        app.get('/css/plugins.css', this.css);
    }
    
    /**
     * Serves JS files
     */
    static async js(req, res) {
        let paths = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'plugins', '*', 'script.js'));
    
        let compiledJs = '/* HashBrown plugins */';

        for(let path of paths) {
            compiledJs += '\n\n/* [' + Path.basename(Path.dirname(path)) + '] */\n\n';

            let file = await HashBrown.Service.FileService.read(path);
            
            compiledJs += file.toString('utf8');
        }

        res.set('Content-Type', 'text/javascript');
        res.send(compiledJs);
    }
    
    /**
     * Serves CSS files
     */
    static async css(req, res) {
        let paths = await HashBrown.Service.FileService.list(Path.join(APP_ROOT, 'plugins', '*', 'style.css'));
    
        let compiledCss = '/* HashBrown plugins */';

        for(let path of paths) {
            compiledCss += '\n\n/* [' + Path.basename(Path.dirname(path)) + '] */\n\n';
            
            let file = await HashBrown.Service.FileService.read(path);
            
            compiledCss += file.toString('utf8');
        }

        res.set('Content-Type', 'text/css');
        res.send(compiledCss);
    }
}

module.exports = PluginController;
