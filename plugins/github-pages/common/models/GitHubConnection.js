'use strict';

let yamljs = require('../lib/yamljs/Yaml');
let restler = require('restler');

let Connection = require(appRoot + '/src/common/models/Connection');
let Content = require(appRoot + '/src/common/models/Content');
let Media = require(appRoot + '/src/common/models/Media');

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    }

    /**
     * Compiles content for Jekyll
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    compileForJekyll(properties) {
        debug.log('Compiling "' + properties.title + '" for Jekyll...', this);

        let frontMatter = '';

        frontMatter += '---\n';
        frontMatter += yamljs.stringify(properties, 50); 
        frontMatter += '---';

        return frontMatter;
    }
   
    /**
     * Gets templates
     *
     * @returns {Promise(Array)} templates
     */
    getTemplates() {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/_layouts?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let templates = [];

                if(data) {
                    if(data.message) {
                        debug.log('Couldn\'t find templates. GitHub response: ' + JSON.stringify(data.message), this);
                        reject();
                    
                    } else {
                        for(let i in data) {
                            let file = data[i];

                            templates[templates.length] = file.path.replace('_layouts/', '').replace('.html', '');
                        }
                    }
                }

                resolve(templates);
            });
        });
    }
    
    /**
     * Gets section templates
     *
     * @returns {Promise(Array)} sectionTemplates
     */
    getSectionTemplates() {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/_includes/sections?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let templates = [];

                if(data) {
                    if(data.message) {
                        debug.log('Couldn\'t find section templates. GitHub response: ' + JSON.stringify(data.message), this);
                        reject();

                    } else {
                        for(let i in data) {
                            let file = data[i];

                            templates[templates.length] = file.path.replace('_includes/sections/', '').replace('.html', '');
                        }
                    }
                }

                resolve(templates);
            });
        });
    }

    /**
     * Gets all Media objects
     *
     * @returns {Promise(Array)} media
     */
    getAllMedia() {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/media?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                let media = [];

                if(data) {
                    if(data.message) {
                        debug.log('Couldn\'t find media. GitHub response: ' + JSON.stringify(data.message), this);
                        reject();

                    } else {
                        for(let i in data) {
                            let file = data[i];
                            
                            media[media.length] = new Media({
                                name: file.name,
                                id: file.path.replace('media/', ''),
                                url: file.download_url
                            });
                        }
                    }
                }

                resolve(media);
            });
        });
    }
    
    /**
     * Gets a Media object
     *
     * @param {String} id
     *
     * @returns {Promise(Media)} media
     */
    getMedia(id) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/media/' + id + '?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                if(data) {
                    if(data.message) {
                        debug.log('Couldn\'t find media. GitHub response: ' + JSON.stringify(data.message), this);
                        reject();

                    } else {
                        if(data.length > 0) {
                            let file = data[0];
                            
                            resolve(new Media({
                                name: file.name,
                                id: file.path.replace('media/', ''),
                                url: file.download_url
                            }));

                        } else {
                            debug.log('Media folder "' + id + '" was present, but had no content.', this);
                            reject();
                
                        }
                    }
                }
            });
        });
    }
    
    /**
     * Sets media
     *
     * @param {String} id
     * @param {Object} file
     *
     * @returns {Promise(Array)} media
     */
    setMedia(id, file) {
        return new Promise((resolve, reject) => {
            let path = 'media/' + id + '/' + file.name;

            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?access_token=' + this.settings.token;
            let headers = {
                'Accept': 'application/json'
            };

            debug.log('Uploading "' + path + '"...', this);

            // Fetch first to get the SHA
            debug.log('Getting SHA...', this);
            
            restler.get(apiPath, {
                headers: headers
            }).on('complete', (data, response) => {
                let postData = {
                    sha: data.sha,
                    path: path,
                    message: 'Commit from Endomon CMS',
                    content: file
                };

                // Commit the file
                debug.log('Committing data...', this);

                restler.put(apiPath, {
                    headers: headers,
                    data: JSON.stringify(postData)
                }).on('complete', (data, response) => {
                    if(data.message) {
                        debug.log('Committing file failed', this);
                        debug.log('GitHub response: ' + JSON.stringify(data), this);
                    
                    } else {
                        debug.log('Committed file successfully!', this);

                    }

                    resolve();
                });
            });
        });
    }
    
    /**
     * Removes media
     *
     * @param {String} id
     *
     * @returns {Promise(Array)} media
     */
    removeMedia(id) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            restler.del('https://api.github.com/repos/' + this.settings.repo + '/contents/media/' + id + '?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                if(data.message) {
                    debug.log('Couldn\'t find media. GitHub response: ' + JSON.stringify(data.message), this);
                    reject();

                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Deletes content properties from the remote target
     *
     * @param {String} id
     * @param {String} language
     *
     * @returns {Promise} promise
     */
    deleteContentProperties(id, language) {
        return new Promise((resolve, reject) => {
            let path = 'content/' + language + '/' + id + '.md';

            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?access_token=' + this.settings.token;
            let headers = {
                'Accept': 'application/json'
            };

            debug.log('Removing "' + path + '"...', this);

            // Fetch first to get the SHA
            debug.log('Getting SHA...', this);
            
            restler.get(apiPath, {
                headers: headers
            }).on('complete', (data, response) => {
                let postData = {
                    sha: data.sha,
                    path: path,
                    message: 'Removed by Endomon CMS',
                };

                // Remove the file
                debug.log('Removing data...', this);

                restler.del(apiPath, {
                    headers: headers,
                    data: JSON.stringify(postData)
                }).on('complete', (data, response) => {
                    if(data.message) {
                        debug.log('Removing file failed', this);
                        debug.log('GitHub response: ' + JSON.stringify(data), this);
                    
                    } else {
                        debug.log('Removed file successfully!', this);

                    }

                    resolve();

                });
            });
        });
    }

    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     * @param {String} id
     * @param {String} language
     * @param {Object} meta
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties, id, language, meta) {
        return new Promise((resolve, reject) => {
            let path = 'content/' + language + '/' + id + '.md';

            // Add meta data to the properties
            properties.meta = {
                id: id,
                language: language
            };

            // Remap "url" to "permalink"
            if(properties.url) {
                properties.permalink = properties.url;
                delete properties.url;
            }

            // Remap "template" to "layout"
            if(properties.template) {
                properties.layout = properties.template;
                delete properties.template;
            }

            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?access_token=' + this.settings.token;
            let fileContent = this.compileForJekyll(properties);
            let headers = {
                'Accept': 'application/json'
            };

            debug.log('Uploading "' + path + '"...', this);

            // Fetch first to get the SHA
            debug.log('Getting SHA...', this);
            
            restler.get(apiPath, {
                headers: headers
            }).on('complete', (data, response) => {
                let postData = {
                    sha: data.sha,
                    path: path,
                    message: 'Commit from Endomon CMS',
                    content: new Buffer(fileContent).toString('base64')
                };

                // Commit the file
                debug.log('Committing data...', this);

                restler.put(apiPath, {
                    headers: headers,
                    data: JSON.stringify(postData)
                }).on('complete', (data, response) => {
                    if(data.message) {
                        debug.log('Committing file failed', this);
                        debug.log('GitHub response: ' + JSON.stringify(data), this);
                    
                    } else {
                        debug.log('Committed file successfully!', this);

                    }

                    resolve();

                });
            });
        });
    }
}

module.exports = GitHubConnection;
