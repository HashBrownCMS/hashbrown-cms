'use strict';

let fs = require('fs');

let Controller = require('./Controller');

let config = require('./config.json');

class HashBrown {
    /**
     * Inits the driver
     *
     * @param {Object} app Express.js app object
     */
    static init(app) {
        app.get('/hashbrown/content/tree', this.getTree);
    }

    /**
     * Gets the json dir path
     *
     * @return {String} path
     */
    static getPath() {
        return this.config.root + '/hashbrown/json';
    }

    /**
     * Ensures the JSON tree location
     */
    static ensureLocation() {
        let path = this.getPath();
        
        if(!fs.existsSync(path + '/tree.json')){
            if(!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            
            fs.writeFileSync(path + '/tree.json', '{}');
        }
    }
    
    /**
     * Gets the entire JSON tree
     *
     * @returns {Promise(Object)} tree
     */
    static getTree() {
        return new Promise((resolve, reject) => {
            HashBrown.ensureLocation();
                
            let path = HashBrown.getPath();

            fs.readFile(path + '/tree.json', 'utf8', (err, data) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    resolve(JSON.parse(data));
                
                }
            });
        });
    }
}

module.exports = HashBrown;
