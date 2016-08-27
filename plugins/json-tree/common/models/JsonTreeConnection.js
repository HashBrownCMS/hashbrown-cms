'use strict';

let restler = require('restler');
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
        return appRoot + '/storage/' + ProjectHelper.currentProject + '/' + ProjectHelper.currentEnvironment + '/json';
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
            // Read from remote
            if(this.settings.remote && this.settings.token) {
                let headers = {
                    'Accept': 'application/json'
                };
                
                restler.get(this.settings.remote + '/hashbrown/api/tree?token=' + this.settings.token, {
                    headers: headers
                }).on('complete', (data, response) => {
                    try {
                        if(typeof data === 'string') {
                            data = JSON.parse(data);
                        }

                        resolve(data);
                    } catch(e) {
                        reject(e);
                    }
                });

            // Read from local
            } else {
                this.ensureLocation();
                    
                let path = this.getPath();

                fs.readFile(path + '/tree.json', 'utf8', (err, data) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        try {
                            let parsed = JSON.parse(data);

                            resolve(parsed);
                        } catch(e) {
                            reject(e);
                        }
                    
                    }
                });
            }
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
            debug.log('Writing remote content tree...', this)

            // Write to remote
            if(this.settings.remote && this.settings.token) {
                let headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };

                restler.post(this.settings.remote + '/hashbrown/api/tree?token=' + this.settings.token, {
                    headers: headers,
                    data: JSON.stringify(json, null, 4)
                }).on('complete', (data, response) => {
                    console.log(data);

                    debug.log('Wrote remote content tree successfully!', this);
                    resolve();
                });

            // Write to local
            } else {
                this.ensureLocation();

                let path = this.getPath();
                
                fs.writeFile(path + '/tree.json', JSON.stringify(json, null, 4), 'utf8', (err, data) => {
                    if(err) {
                        reject(new Error(err));
                    
                    } else {
                        resolve();
                    
                    }
                });
            }
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

        return new Promise((resolve, reject) => {
            this.getTree()
            .then((tree) => {
                tree[id] = null;
                delete tree[id];
                
                this.setTree(tree)
                .then(() => {
                    resolve();
                })
                .catch(reject);
            })
            .catch(reject);
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

                this.setTree(tree)
                .then(() => {
                    resolve();
                })
                .catch(reject);
            })
            .catch(reject);
        });
    }
}

module.exports = JsonTreeConnection;
