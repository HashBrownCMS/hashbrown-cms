'use strict';

const FileSystem = require('fs');
const Path = require('path');

const RequestHelper = require('Server/Helpers/RequestHelper');

const Connection = require('Common/Models/Connection');
const Media = require('Common/Models/Media');
const Template = require('Common/Models/Template');

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
        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/content/tree?token=' + this.settings.token;

        return RequestHelper.request('get', apiUrl)
        .then((data) => {
            if(!data) {
                return Promise.reject(new Error('Response from driver was null'));
            }

            try {
                let tree = data;
                
                if(typeof data === 'string') {
                    tree = JSON.parse(data);
                }

                return Promise.resolve(tree);
      
            } catch(e) {
                return Promise.reject(e);
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
        debug.log('Posting entire tree to ' + this.getRemoteUrl() + '...', this);
    
        return RequestHelper.request('post', this.getRemoteUrl() + '/hashbrown/api/content/tree?token=' + this.settings.token, json);
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
        
        return RequestHelper.request('delete', this.getRemoteUrl() + '/hashbrown/api/content/' + id + '?token=' + this.settings.token);
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

        let data = {
            language: language,
            properties: properties,
            meta: meta
        };

        return RequestHelper.request('post', this.getRemoteUrl() + '/hashbrown/api/content/' + id + '/properties?token=' + this.settings.token, data);
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

        debug.log('Setting media object "' + id + '" at ' + this.getRemoteUrl() + '...', this);
    
        // First remove any existing media
        return this.removeMedia(id)
        .then(() => {
            return new Promise((resolve, reject) => {
                let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;
              
                FileSystem.readFile(tempPath, (err, fileData) => {
                    if(!fileData || err) {
                        return reject(new Error('Could not read temporary file at "' + tempPath + '"'));
                    }

                    resolve(fileData);
                });
            });
        })
        .then((fileData) => {
            let postData = { 
                filename: file.filename,
                content: new Buffer(fileData).toString('base64')
            };

            return RequestHelper.request('post', apiUrl, postData);
        })
        .then((data, response) => {
            if(!data || data instanceof Error || response.statusCode != 200) {
                return Promise.reject(new Error(data));
            }

            return Promise.resolve(data);
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
        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/templates/' + type + '/' + id + '?token=' + this.settings.token;
        
        return RequestHelper.request('get', apiUrl)
        .then((template) => {
            if(!template) {
                return Promise.reject(new Error('Template "' + id + '" was not found'));
            }
       
            template.remote = true;

            return Promise.resolve(new Template(template));
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
        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/templates/' + type + '?token=' + this.settings.token;
        
        return RequestHelper.request('get', apiUrl)
        .catch((e) => {
            // We only care about server errors
            if(e.message.indexOf('404') < 0) {
                debug.error(e, this);
            }

            return Promise.resolve([]);
        })
        .then((data) => {
            if(!data || !Array.isArray(data)) {
                return Promise.reject(new Error('Templates were not found. Response from remote was: ' + data));
            }
       
            let allTemplates = [];

            for(let template of data) {
                template.remote = true;

                allTemplates.push(new Template(template));
            }
            
            return Promise.resolve(allTemplates);
        });
    }
   
    /**
     * Gets all Media objects
     *
     * @returns {Promise} Array of Media objects
     */
    getAllMedia() {
        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media?token=' + this.settings.token;
        
        return RequestHelper.request('get', apiUrl)
        .then((data) => {
            if(!data || !Array.isArray(data)) {
                return Promise.reject(new Error('Media was not found'));
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
            
            return Promise.resolve(allMedia);
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

        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;

        return RequestHelper.request('get', apiUrl)
        .then((data) => {
            if(!data) {
                return Promise.reject(new Error('Media "' + id + '" was not found'))
            }
        
            let media = new Media({
                name: Path.basename(data),
                id: id,
                url: this.getRemoteUrl() + '/media/' + id + '/' + data,
                remote: true
            });

            return Promise.resolve(media);
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

        debug.log('Deleting media object "' + id + '" from ' + this.getRemoteUrl() + '...', this);
        
        let apiUrl = this.getRemoteUrl() + '/hashbrown/api/media/' + id + '?token=' + this.settings.token;

        return RequestHelper.request('delete', apiUrl);
    }
}

module.exports = HashBrownDriverConnection;
