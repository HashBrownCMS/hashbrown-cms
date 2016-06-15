'use strict';

let fs = require('fs');
let Promise = require('bluebird');

let Connection = require(appRoot + '/src/common/models/Connection');

/**
 * A connection for generating a local JSON tree
 */
class JsonTreeConnection extends Connection {
    structure() {
        super.structure();

        this.type = 'jsontree';
        this.tree = {};
    } 
   
    /**
     * Gets the json dir path
     *
     * @return {String} path
     */
    getPath() {
        return appRoot + '/projects/' + ProjectHelper.currentProject + '/storage/' + ProjectHelper.currentEnvironment + '/json';
    }

    /**
     * Ensures the JSON tree location
     */
    ensureLocation() {
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
    getTree() {
        return new Promise((resolve, reject) => {
            this.ensureLocation();
                
            let path = this.getPath();

            fs.readFile(path + '/tree.json', 'binary', (err, data) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    resolve(JSON.parse(data));
                
                }
            });
        });
    }

    /**
     * Saves the JSON tree
     *
     * @param {Object} json
     *
     * @returns {Promise} promise
     */
    setTree(json) {
        return new Promise((resolve) => {
            this.ensureLocation();

            let path = this.getPath();
            
            fs.writeFile(path + '/tree.json', JSON.stringify(json, null, 4), (err, data) => {
                if(err) {
                    reject(new Error(err));
                
                } else {
                    resolve();
                
                }
            });
        });
    }

    /**
     * Posts content properties to JSON tree
     *
     * @param {Object} properties
     * @param {String} id
     * @param {String} language
     * @param {Object} meta
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties, id, language, meta) {
        debug.log('Processing "' + properties.title + '"...', this);

        return new Promise((callback) => {
            this.getTree()
            .then((tree) => {
                if(!tree[id]) {
                    tree[id] = {};
                }

                if(!tree[id].properties) {
                    tree[id].properties = {};
                }

                tree[id].properties[language] = properties;

                if(meta) {
                    for(let k in meta) {
                        tree[id][k] = meta[k];
                    }
                }

                this.setTree(tree)
                .then(() => {
                    callback();
                });
            });
        });
    }
}

module.exports = JsonTreeConnection;
