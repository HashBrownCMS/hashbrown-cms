'use strict';

const fs = require('fs');
const path = require('path');

const Connection = require(appRoot + '/src/common/models/Connection');
const Media = require(appRoot + '/src/common/models/Media');
const Template = require(appRoot + '/src/common/models/Template');

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
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/content/tree?token=' + this.settings.token;

            RequestHelper.get(apiUrl, {
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

        debug.log('Posting entire tree to ' + this.getRemoteUrl() + '...', this);
    
        return new Promise((resolve, reject) => {
            RequestHelper.post(this.getRemoteUrl() + '/hashbrown/api/content/tree?token=' + this.settings.token, {
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
        debug.log('Deleting Content node "' + id + '"...', this);
        
        let headers = {
            'Accept': 'application/json'
        };

        return new Promise((resolve, reject) => {
            RequestHelper.del(this.getRemoteUrl() + '/hashbrown/api/content/' + id + '?token=' + this.settings.token, {
                headers: headers
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
        debug.log('Posting properties of "' + (properties.title || id) + '"...', this);

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        };

        return new Promise((resolve, reject) => {
            RequestHelper.post(this.getRemoteUrl() + '/hashbrown/api/content/' + id + '/properties?token=' + this.settings.token, {
                headers: headers,
                data: JSON.stringify({
                    language: language,
                    properties: properties,
                    meta: meta
                })
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
     * Sets a Media object
     *
     * @param {String} id
     * @param {Object} file
     *
     * @returns {Promise} Media
     */
    setMedia(id, file) {
        if(!id || id == 'undefined' || id == 'null') { return Promise.reject(new Error('Media id was null')); }
            
        let tempPath = file.path;

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf-8'
        };
            
        debug.log('Setting media object "' + id + '" at ' + this.getRemoteUrl() + '...', this);
    
        // First remove any existing media
        return this.removeMedia(id)
        .then(() => {
            return new Promise((resolve, reject) => {
                let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;
              
                fs.readFile(tempPath, (err, fileData) => {
					if(!fileData) {
						return reject(new Error('Could not read temporary file at "' + tempPath + '"'));
					}

                    let postData = { 
                        filename: file.filename,
                        content: new Buffer(fileData).toString('base64')
                    }
                  
                    RequestHelper.post(apiUrl, {
                        headers: headers,
                        data: JSON.stringify(postData), 
                    }).on('complete', (data, response) => {
                        if(!data || data instanceof Error || response.statusCode != 200) {
                            reject(new Error(data))
                            return;
                        }

                        resolve(data);
                    });
                });
            });
        });
    }
   
    /**
     * Gets template by id
     *
     * @param {String} type
     * @param {String} id
     *
     * @returns {Promise} Template
     */
    getTemplateById(type, id) {
        return new Promise((resolve, reject) => {
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/templates/' + type + '/' + id + '?token=' + this.settings.token;
            
            let headers = {
                'Accept': 'application/json'
            };
            
            RequestHelper.get(apiUrl, {
                headers: headers
            }).on('complete', (template, response) => {
                if(!template) {
                    return reject(new Error('Template "' + id + '" was not found'));
                }
           
                template.remote = true;

                resolve(new Template(template));
            });
        });
    }

    /**
     * Gets templates
     *
     * @param {String} type
     *
     * @returns {Promise} Array of Templates
     */
    getTemplates(type) {
        return new Promise((resolve, reject) => {
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/templates/' + type + '?token=' + this.settings.token;
            
            let headers = {
                'Accept': 'application/json'
            };
            
            RequestHelper.get(apiUrl, {
                headers: headers
            }).on('complete', (data, response) => {
                if(!data || !Array.isArray(data)) {
                    return reject(new Error('Templates were not found. Response from remote was: ' + data));
                }
           
                let allTemplates = [];

                for(let template of data) {
                    template.remote = true;

                    allTemplates.push(new Template(template));
                }
                
                resolve(allTemplates);
            });
        });
    }
   
    /**
     * Gets all Media objects
     *
     * @returns {Promise} Array of Media objects
     */
    getAllMedia() {
        let headers = {
            'Accept': 'application/json'
        };
            
        return new Promise((resolve, reject) => {
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media?token=' + this.settings.token;
            
            let headers = {
                'Accept': 'application/json'
            };
            
            RequestHelper.get(apiUrl, {
                headers: headers
            }).on('complete', (data, response) => {
                if(!data || !Array.isArray(data)) {
                    reject(new Error('Media was not found'))
                    return;
                }
           
                let allMedia = [];

                for(let media of data) {
                    allMedia.push(new Media({
                        name: media.name,
                        id: media.id,
                        url: this.getRemoteUrl() + '/media/' + media.id + '/' + media.name,
                        remote: true
                    }));
                }
                
                resolve(allMedia);
            });
        });
    }

    /**
     * Gets a Media object
     *
     * @param {String} id
     *
     * @returns {Promise} Media
     */
    getMedia(id) {
        if(!id || id == 'undefined' || id == 'null') { return Promise.reject(new Error('Media id was null')); }

        let headers = {
            'Accept': 'application/json'
        };
            
        return new Promise((resolve, reject) => {
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;

            RequestHelper.get(apiUrl, {
                headers: headers
            }).on('complete', (data, response) => {
                if(!data) {
                    reject(new Error('Media "' + id + '" was not found'))
                    return;
                }
            
                let media = new Media({
                    name: path.basename(data),
                    id: id,
                    url: this.getRemoteUrl() + '/media/' + id + '/' + data,
                    remote: true
                });

                resolve(media);
            });
        });
    }
    
    /**
     * Deletes a Media object
     *
     * @param {String} id
     *
     * @returns {Promise} Response
     */
    removeMedia(id) {
        if(!id || id == 'undefined' || id == 'null') { return Promise.reject(new Error('Media id was null')); }

        let headers = {
            'Accept': 'application/json'
        };
            
        debug.log('Deleting media object "' + id + '" from ' + this.getRemoteUrl() + '...', this);
        
        return new Promise((resolve, reject) => {
            let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;

            RequestHelper.del(apiUrl, {
                headers: headers
            }).on('complete', (data, response) => {
                resolve();
            });
        });
    }
}

module.exports = HashBrownDriverConnection;
