'use strict';

let fs = require('fs');

class PluginController {
    init(app) {
        this.app = app;

        let folders = fs.readdirSync('./plugins');
        
        for(let folder of folders) {
            let path = '../../plugins/' + folder;
            let plugin = require(path);

            new plugin(this);
        }
    }

    hook(method, url, callback) {
        this.app[method](url, callback);
    }
}

module.exports = new PluginController();
