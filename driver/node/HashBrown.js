'use strict';

let fs = require('fs');

let config = require('./config.json');

class HashBrown {
    /**
     * Inits the driver
     *
     * @param {Object} app Express.js app object
     */
    static init(app) {
        Controller.init(app);
    }

    /**
     * Gets the json dir path
     *
     * @return {String} path
     */
    static getPath() {
        return __dirname + '/storage/json';
    }

    /**
     * Ensures the JSON tree location
     */
    static ensureLocation() {
        let path = this.getPath();
        
        if(!fs.existsSync(path + '/tree.json')){
            if(!fs.existsSync(path)) {
                this.mkdirRecursively(path);
            }
            
            fs.writeFileSync(path + '/tree.json', '{}');
        }
    }
    
    /**
     * Makes a directory recursively
     *
     * @param {String} dirPath
     */
    static mkdirRecursively(dirPath) {
        let parents = dirPath.split('/');
        let finalPath = '/';

        for(let i in parents) {
            finalPath += parents[i];

            if(!fs.existsSync(finalPath)) {
                fs.mkdirSync(finalPath);
            }

            if(i < parents.length - 1) {
                finalPath += '/';
            }
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

let Controller = require('./Controller');

