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
            
        debug.log('Getting entire tree from ' + this.settings.url + '...', this);
        
        return new Promise((resolve, reject) => {
            let apiUrl = this.settings.url + '/hashbrown/api/content/tree?token=' + this.settings.token;

            restler.get(apiUrl, {
                headers: headers
            }).on('complete', (data, response) => {
                if(data) {
                    try {
                        let tree = data;
                        
                        if(typeof data === 'string') {
                            tree = JSON.parse(data);
                        }

                        resolve(tree);
              
                    } catch(e) {
                        reject(e);
                        debug.log('Failed API URL was ' + apiUrl, this);
                        debug.log('Failed API response was ' + data, this);
              
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
            'Content-Type': 'application/json; charset=utf-8'
        };

        if(typeof json === 'object') {
            json = JSON.stringify(json);
        }

        debug.log('Posting entire tree to ' + this.settings.url + '...', this);
    
        return new Promise((resolve, reject) => {
            restler.post(this.settings.url + '/hashbrown/api/content/tree?token=' + this.settings.token, {
                headers: headers,
                data: json
            })
            .on('success', (data, response) => {
                resolve(data);
            })
            .on('fail', (data, response) => {
                reject(data);
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

        return this.getTree()
        .then((tree) => {
            delete tree[id];
            
            return this.setTree(tree);
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

        return new Promise((resolve, reject) => {
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

                return this.setTree(tree);
            })
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = HashBrownDriverConnection;
