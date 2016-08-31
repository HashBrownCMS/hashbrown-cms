'use strict';

let fs = require('fs');
let restler = require('restler');

let Connection = require(appRoot + '/src/common/models/Connection');

/**
 * A connection for interfacing with the HashBrown driver
 */
class HashBrownDriverConnection extends Connection {
    structure() {
        super.structure();

        this.type = 'hashbrown-driver';
        this.tree = {};
    } 
   
    /**
     * Gets the entire JSON tree
     *
     * @returns {Promise(Object)} tree
     */
    getTree() {
        let headers = {
            'Accept': 'application/json'
        };
            
        return new Promise((resolve, reject) => {
            restler.get(this.settings.url + '/hashbrown/content/tree?token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                if(data) {
                    try {
                        let tree = JSON.parse(data);

                        resolve(tree);
              
                    } catch(e) {
                        debug.log(e, this);
                        resolve({});
              
                    }

                } else {
                    reject(new Error('Response from driver was null'));

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
        let headers = {
            'Accept': 'application/json',
            'DataType': 'application/json'
        };
            
        return new Promise((resolve) => {
            restler.post(this.settings.url + '/hashbrown/content/tree?token=' + this.settings.token, {
                headers: headers,
                data: json
            }).on('complete', (data, response) => {
                resolve(response);
            });
        });
    }
    
    /**
     * Deletes content properties from JSON tree
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} promise
     */
    deleteContentProperties(id, language) {
        debug.log('Processing "' + id + '"...', this);

        return new Promise((callback) => {
            this.getTree()
            .then((tree) => {
                delete tree[id];
                
                this.setTree(tree)
                .then(() => {
                    callback();
                });
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

module.exports = HashBrownDriverConnection;
