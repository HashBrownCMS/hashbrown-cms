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
     * Ensures the JSON tree location
     */
    ensureLocation() {
        let path = appRoot + '/public/json';
        
        if(!fs.existsSync(path + '/tree.json')){
            if(!fs.existsSynd(path)) {
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
        return new Promise((callback) => {
            this.ensureLocation();
            
            fs.readFile(appRoot + '/public/json/tree.json', 'binary', (err, data) => {
                if(err) {
                    throw err;
                }
                
                callback(JSON.parse(data));
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
        return new Promise((callback) => {
            this.ensureLocation();

            fs.writeFile(appRoot + '/public/json/tree.json', JSON.stringify(json, null, 4), (err, data) => {
                if(err) {
                    throw err;
                }
                
                callback();
            });
        });
    }

    /**
     * Posts content properties to JSON tree
     *
     * @param {Object} properties
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties, id, language) {
        console.log('[JSON Tree] Processing "' + properties.title + '"...');

        return new Promise((callback) => {
            this.getTree()
            .then((tree) => {
                if(!tree[id]) {
                    tree[id] = {};
                }

                tree[id][language] = properties;

                this.setTree(tree)
                .then(() => {
                    callback();
                });
            });
        });
    }
}

module.exports = JsonTreeConnection;
