'use strict';

let yamljs = require('../lib/yamljs/Yaml');
let restler = require('restler');
let fs = require('fs');
let path = require('path');

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
                        reject(new Error('Couldn\'t find templates. GitHub response: ' + JSON.stringify(data.message)));
                    
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
                        reject(new Error('Couldn\'t find section templates. GitHub response: ' + JSON.stringify(data.message)));

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
           
            // Grab SHA first
            restler.get('https://api.github.com/repos/' + this.settings.repo + '/commits/HEAD?access_token=' + this.settings.token, {
                headers: headers
            }).on('complete', (data, response) => {
                if(data) {
                    let sha = data.sha;

                    restler.get('https://api.github.com/repos/' + this.settings.repo + '/git/trees/' + sha + '?recursive=1&access_token=' + this.settings.token, {
                        headers: headers
                    }).on('complete', (data, response) => {
                        if(data) {
                            let media = [];

                            for(let node of data.tree) {
                                if(node.path.indexOf('media/') == 0 && node.mode == '100644') {
                                    media[media.length] = new Media({
                                        name: path.basename(node.path),
                                        id: path.dirname(node.path).replace('media/', ''),
                                        url: node.path
                                    });
                                }
                            }

                            resolve(media);    
                        
                        } else {
                            debug.log('No data in GitHub response', this);
                            reject();
                        }
                    });

                } else {
                    debug.log('No data in GitHub response', this);
                    reject();
                }
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
            if(id && id != 'undefined' && id != 'null') {
                let headers = {
                    'Accept': 'application/json'
                };
                
                restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/media/' + id + '?access_token=' + this.settings.token, {
                    headers: headers
                }).on('complete', (data, response) => {
                    if(data) {
                        if(data.message) {
                            debug.log('Couldn\'t find media. GitHub response: ' + JSON.stringify(data.message), this);
                            resolve(null);

                        } else {
                            if(data.length > 0) {
                                let file = data[0];
                                
                                resolve(new Media({
                                    name: file.name,
                                    id: path.dirname(file.path).replace('media/', ''),
                                    url: file.download_url
                                }));

                            } else {
                                debug.log('Media folder "' + id + '" was present, but had no content.', this);
                                resolve(null);
                    
                            }
                        }
                    } else {
                        debug.log('No data in GitHub response', this);
                        resolve();
                    }
                });
            } else {
                resolve(null);
            }
        });
    }
   
    /**
     * Gets the media path
     *
     * @returns {String} path
     */
    getMediaPath() {
        return 'https://raw.githubusercontent.com/' + this.settings.repo + '/master/media/';
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
            let tempPath = file.path;
            let apiUrl = 'https://api.github.com/repos/' + this.settings.repo + '/contents/media/' + id;
            let dirApiPath = apiUrl + '?access_token=' + this.settings.token;
            let fileApiPath = apiUrl + '/' + file.filename + '?access_token=' + this.settings.token;
            let headers = {
                'Accept': 'application/json'
            };

            debug.log('Uploading media "' + id + '"...', this);

            // Read the file from the temporary storage
            fs.readFile(tempPath, (err, fileData) => {
                if(err) {
                    // We couldn't read the temp file, rejecting
                    reject(new Error(err));
                
                } else {
                    // Remove whatever media already exists in the folder
                    debug.log('Removing existing content if any...', this);
                    
                    this.removeMedia(id)
                    .then(() => {
                        // Define the POST data
                        // SHA is not needed, since we emptied the folder first
                        let postData = {
                            path: 'media/' + id + '/' + file.filename,
                            message: 'Commit from Endomon CMS',
                            content: new Buffer(fileData).toString('base64')
                        };

                        // Commit the file
                        debug.log('Committing media data to ' + postData.path + '...', this);

                        // PUT the content
                        restler.put(fileApiPath, {
                            headers: headers,
                            data: JSON.stringify(postData)
                        }).on('complete', (data, response) => {
                            if(data.message) {
                                debug.log('Committing file failed: ' + data.message, this);
                                reject(new Error(data.message));
                            
                            } else {
                                debug.log('Committed file successfully!', this);
                                resolve();
                            
                            }
                        });
                    });
                }
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
            let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/';
            let dirApiPath = apiPath + 'media/' + id + '?access_token=' + this.settings.token;
            let headers = {
                'Accept': 'application/json'
            };
            
            // Fetch first to get the SHA
            debug.log('Getting existing files...', this);
            
            restler.get(dirApiPath, {
                headers: headers
            }).on('complete', (data, response) => {
                let removeNext = (i) => {
                    // Check if data object is empty
                    if(data[i] && typeof data[i] !== 'undefined') {
                        let sha = data[i].sha;
                        let fileApiPath = apiPath + 'media/' + id + '/' + data[i].name + '?access_token=' + this.settings.token;
                        let postData = {
                            sha: sha,
                            path: 'media/' + id,
                            message: 'Removed by Endomon CMS',
                        };

                        // Remove the file
                        debug.log('Removing data...', this);

                        restler.del(fileApiPath, {
                            headers: headers,
                            data: JSON.stringify(postData)
                        }).on('complete', (data, response) => {
                            if(data.message) {
                                debug.log('Removing file failed: ' + data.message, this);
                                reject(new Error(data.message));
                                return;
                            
                            } else {
                                debug.log('Removed file successfully!', this);

                            }

                            // Increment index and check if any more files are queued
                            i++;

                            // If not, resolve the promise
                            if(i >= data.length) {
                                resolve();

                            // If there are, process next file
                            } else {
                                removeNext(i);
                            }
                        });

                    // If we got an empty object, resolve
                    } else {
                        resolve();
                    }
                }

                // The response contains 1 or more files, delete them one by one
                if(data && data.length > 0) {
                    removeNext(0);

                // If it doesn't, just return
                } else {
                    debug.log('Found no files to remove in media/' + id, this);
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
                        debug.log('Removing file failed: ' + data.message, this);
                        reject(new Error(data.message));    

                    } else {
                        debug.log('Removed file successfully!', this);
                        resolve();

                    }
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
                parentId: meta.parentId,
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
                        debug.log('Committing file failed: ' + data.message, this);
                        reject(newError(data.message));
                    
                    } else {
                        debug.log('Committed file successfully!', this);
                        resolve();

                    }
                });
            });
        });
    }
}

module.exports = GitHubConnection;
