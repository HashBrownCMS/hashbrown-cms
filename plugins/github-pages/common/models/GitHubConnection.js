'use strict';

let yamljs = require('../lib/yamljs/Yaml');
let restler = require('restler');
let fs = require('fs');
let path = require('path');
let glob = require('glob');
let rimraf = require('rimraf');

let Connection = require(appRoot + '/src/common/models/Connection');
let Content = require(appRoot + '/src/common/models/Content');
let Media = require(appRoot + '/src/common/models/Media');

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    }

    /**
     * Gets API URL appendix
     *
     * @returns {String} Appendix
     */
    getAppendix() {
        return 'access_token=' + this.settings.token + '&' + 'ref=' + (this.settings.branch || 'gh-pages');
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
     * Generic get contents method
     *
     * @param {String} path
     * @param {String} type
     *
     * @return {Promise} Promise
     */
    getContents(path, type) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            // Local is set, fetch using filesystem
            if(this.settings.isLocal) {
                switch(type) {
                    default: case 'dir':
                        fs.readdir(this.settings.localPath + path, (err, data) => {
                            if(err) {
                                reject(err);
                            
                            } else {
                                resolve(data);

                            }
                        });
                        break;

                    case 'file':
                        fs.readfile(this.settings.localPath + path, (err, data) => {
                            if(err) {
                                reject(err);
                            
                            } else {
                                resolve(data);

                            }
                        });
                        break;
                }

            // If not, proceed with REST call
            } else {
                restler.get('https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix(), {
                    headers: headers
                }).on('complete', (data, response) => {
                    if(data) {
                        if(data.message) {
                            reject(new Error('Couldn\'t find "' + path + '". GitHub response: ' + JSON.stringify(data.message)));
                        
                        } else {
                            resolve(data);
                        }
                    }
                });
            }
        });
    }
    
    /**
     * Generic post contents method
     *
     * @param {String} path
     * @param {String} content
     *
     * @return {Promise} Promise
     */
    postContents(path, content) {
        return new Promise((resolve, reject) => {
            if(this.settings.isLocal) {
                let dirPath = path.slice(0, path.lastIndexOf('/'));

                MediaHelper.mkdirRecursively(dirPath);

                fs.writeFile(this.settings.localPath + path, content, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                        debug.log('Uploaded file successfully to ' + path, this);
                    }
                });

            } else {
                let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();
                let headers = {
                    'Accept': 'application/json'
                };

                // Fetch first to get the SHA
                debug.log('Getting SHA...', this);
                
                restler.get(apiPath, {
                    headers: headers
                }).on('complete', (data, response) => {
                    let postData = {
                        sha: data.sha,
                        path: path,
                        message: 'Commit from HashBrown CMS',
                        content: new Buffer(content).toString('base64'),
                        branch: this.settings.branch || 'gh-pages'
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
                            debug.log('Committed file successfully to' + path, this);
                            resolve();

                        }
                    });
                });
            }
        });
    }
   
    /**
     * Generic delete contents method
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    deleteContents(path) {
        return new Promise((resolve, reject) => {
            if(this.settings.isLocal) {
                rimraf(this.settings.localPath + path, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });

            } else {
                let getApiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();
                let delApiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();
                let headers = {
                    'Accept': 'application/json'
                };

                debug.log('Removing "' + path + '"...', this);

                // Fetch first to get the SHA
                debug.log('Getting SHA...', this);
                
                restler.get(getApiPath, {
                    headers: headers
                }).on('complete', (data, response) => {
                    let postData = {
                        sha: data.sha,
                        path: path,
                        message: 'Removed by HashBrown CMS',
                        branch: this.settings.branch || 'gh-pages'
                    };

                    // Remove the file
                    debug.log('Removing data...', this);

                    restler.del(delApiPath, {
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
            }
        });
    }

    /**
     * Generic get tree method
     *
     * @param {String} root
     * @param {String} mode
     *
     * @return {Promise} Promise
     */
    getTree(root, mode) {
        return new Promise((resolve, reject) => {
            let headers = {
                'Accept': 'application/json'
            };
            
            // Local is set, fetch using filesystem
            if(this.settings.isLocal) {
                let path = root + '/**/*';
                
                if(mode == 'dir') {
                    path += '/';                
                }

                glob(
                    path,
                    {
                        cwd: this.settings.localPath,
                        nodir: mode != 'dir'
                    }, 
                    (err, files) => {
                        if(err) {
                            reject(err);
                        
                        } else {
                            resolve(files);

                        }     
                    }
                );

            // If not, proceed with REST call
            } else {
                let headers = {
                    'Accept': 'application/json'
                };
               
                let getApiUrl = 'https://api.github.com/repos/' + this.settings.repo + '/git/trees/' + (this.settings.branch || 'gh-pages') + '?recursive=1&access_token=' + this.settings.token;

                restler.get(getApiUrl, {
                    headers: headers
                }).on('complete', (data, response) => {
                    if(data) {
                        if(data.tree) {
                            resolve(data.tree);    
                        
                        } else {
                            reject(new Error('No tree in GitHub response'));

                        }

                    } else {
                        reject(new Error('No data in GitHub response'));
                    }
                });
            }
        });
    }


    /**
     * Gets templates
     *
     * @returns {Promise(Array)} templates
     */
    getTemplates() {
        return this.getContents('_layouts')
        .then((data) => {
            let templates = [];
            
            for(let i  = 0; i < data.length; i++) {
                let file = data[i];

                templates[templates.length] = (file.path || file).replace('_layouts/', '').replace('.html', '');
            }
               
            return new Promise((resolve) => {
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
        return this.getContents('_includes/sections')
        .then((data) => {
            let templates = [];

            for(let i in data) {
                let file = data[i];

                templates[templates.length] = (file.path || file).replace('_includes/sections/', '').replace('.html', '');
            }

            return new Promise((resolve) => {
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
        return this.getTree('media', 'file')
        .then((tree) => {
            let media = [];

            for(let node of tree) {
                let nodePath = this.settings.isLocal ? node : node.path;
                let isFile = this.settings.isLocal ? true : node.mode == '100644';

                let isInMediaDir = nodePath.indexOf('media/') == 0;

                if(isInMediaDir && isFile) {
                    media[media.length] = new Media({
                        name: path.basename(nodePath),
                        id: path.dirname(nodePath).replace('media/', '').replace(this.settings.localPath, ''),
                        url: nodePath
                    });
                }
            }

            return new Promise((resolve) => {
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
        if(id && id != 'undefined' && id != 'null') {
            return this.getContents('media/' + id)
            .then((data) => {
                let media = null;
                
                if(data.length > 0) {
                    let file = data[0];
                   
                    media = new Media({
                        name: file.name || path.basename(file),
                        id: id,
                        url: file.download_url || this.settings.localPath + 'media/' + id + '/' + file,
                        isLocal: this.settings.isLocal == true
                    });

                } else {
                    debug.log('Media folder "' + id + '" was present, but had no content.', this);
        
                }

                return new Promise((resolve) => {
                    resolve(media);
                });
            });
        
        } else {
            return new Promise((resolve) => {
                resolve(null);
            });

        }
    }
   
    /**
     * Gets the media path
     *
     * @returns {String} path
     */
    getMediaPath() {
        return 'https://raw.githubusercontent.com/' + this.settings.repo + '/' + (this.settings.branch || 'gh-pages') + '/media/';
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
        let path = 'media/' + id;

        return new Promise((resolve, reject) => {
            let tempPath = file.path;
            
            debug.log('Uploading content "' + path + '"...', this);

            if(this.settings.isLocal) {
                let newDirPath = this.settings.localPath + path; 
                let newFilePath = newDirPath + '/' + file.filename; 

                MediaHelper.mkdirRecursively(newDirPath);

                fs.rename(tempPath, newFilePath, (err, fileData) => {
                    if(err) {
                        // We couldn't read the temp file, rejecting
                        reject(new Error(err));
                    
                    } else {
                        debug.log('Uploaded file successfully to ' + newFilePath, this);
                        resolve();

                    }
                });

            } else {
                let apiUrl = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path;
                let dirApiPath = apiUrl + '?' + this.getAppendix();
                let fileApiPath = apiUrl + '/' + file.filename + '?' + this.getAppendix();
                
                let headers = {
                    'Accept': 'application/json'
                };

                // Read the file from the temporary storage
                fs.readFile(tempPath, (err, fileData) => {
                    if(err) {
                        // We couldn't read the temp file, rejecting
                        reject(new Error(err));
                    
                    } else {
                        // Remove whatever content already exists in the folder
                        debug.log('Removing existing content if any...', this);
                        
                        this.removeMedia(id)
                        .then(() => {
                            // Define the POST data
                            // SHA is not needed, since we emptied the folder first
                            let postData = {
                                path: path + '/' + file.filename,
                                message: 'Commit from HashBrown CMS',
                                content: new Buffer(fileData).toString('base64'),
                                branch: this.settings.branch || 'gh-pages'
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
                                    debug.log('Committed file successfully to ' + fileApiPath, this);
                                    resolve();
                                
                                }
                            });
                        });
                    }
                });
            }
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
        let path = 'media/' + id;

        return new Promise((resolve, reject) => {
            if(this.settings.isLocal) {
                rimraf(this.settings.localPath + path, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });

            } else {
                let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/';
                let dirApiPath = apiPath + path + '?' + this.getAppendix();
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
                            let fileApiPath = apiPath + path + '/' + data[i].name + '?' + this.getAppendix();
                            let postData = {
                                sha: sha,
                                path: path,
                                message: 'Removed by HashBrown CMS',
                                branch: this.settings.branch || 'gh-pages'
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
                        debug.log('Found no files to remove in ' + path, this);
                        resolve();
                    
                    }
                });
            }
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
        let path = 'content/' + language + '/' + id + '.md';

        return this.deleteContents(path);
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
        let path = 'content/' + language + '/' + id + '.md';
        let createdBy;
        let updatedBy;

        // Get created by user
        return UserHelper.getUserById(meta.createdBy)
        .then((user) => {
            createdBy = user;

            return UserHelper.getUserById(meta.updatedBy);
        })
        // Get updated by user
        .then((user) => {
            updatedBy = user;
            
            // We'll have to a allow unknown authors, as they could disappear between backups
            if(!createdBy) {
                createdBy = {
                    fullName: 'Unknown',
                    username: 'unknown'
                };
            }

            if(!updatedBy) {
                updatedBy = {
                    fullName: 'Unknown',
                    username: 'unknown'
                };
            }

            // Format date string
            let dateString = '';
            
            dateString += meta.createDate.getFullYear() + '-';
            dateString += (meta.createDate.getMonth() + 1) + '-';
            dateString += meta.createDate.getDate();

            // Add meta data to the properties
            properties.meta = {
                id: id,
                parentId: meta.parentId,
                language: language
            };

            // Date and author go in as main properties in Jekyll, not as meta
            properties.date = dateString;
            properties.author = createdBy.fullName || createdBy.username;

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
            
            let fileContent = this.compileForJekyll(properties);

            debug.log('Uploading "' + path + '"...', this);

            return this.postContents(path, fileContent);
        });
    }
}

module.exports = GitHubConnection;
