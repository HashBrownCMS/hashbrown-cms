'use strict';

let config = require('./config.json');

let ContentHelper = require(appRoot + '/src/server/helpers/ContentHelper');

// Lib
let glob = require('glob');
let path = require('path');
let fs = require('fs');

// Promise
let Promise = require('bluebird');

class SimpleRender {
    static init(app) {
        app.get('/api/simplerender/templates', SimpleRender.getAllTemplates);
    }

    /**
     * Get all templates
     */
    static getAllTemplates(req, res) {
        glob(appRoot + '/plugins/simplerender/common/jade/**/*.jade', function(err, paths) {
            let templates = {};
            
            for(let i in paths) {
                let markup = fs.readFileSync(paths[i], 'utf8');
                let id = path.basename(paths[i]);
                
                templates[id] = markup;
            }
                                   
            res.send(templates);
        });   
    }
}

module.exports = SimpleRender;
