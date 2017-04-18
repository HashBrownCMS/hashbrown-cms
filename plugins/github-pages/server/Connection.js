'use strict';

const yamljs = require('./lib/yamljs/Yaml');
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const rimraf = require('rimraf');

const Connection = require(appRoot + '/src/common/models/Connection');
const Content = require(appRoot + '/src/common/models/Content');
const Media = require(appRoot + '/src/common/models/Media');
const Template = require(appRoot + '/src/common/models/Template');

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    }

    /**
     * Gets the remote URL based on exisintg information
     *
     * @returns {String} URL
     */
    getRemoteUrl() {
        if(this.url) {
            return url;
        }

        if(this.settings.isLocal) {
            return 'http://localhost:4000';
        }

        this.settings.repo = this.settings.repo || '';

        let user = this.settings.repo.slice(0, this.settings.repo.indexOf('/'));
        let repo = this.settings.repo.slice(this.settings.repo.indexOf('/') + 1);

        return 'http://' + user + '.github.io/' + repo;
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
                        fs.readFile(this.settings.localPath + path, (err, data) => {
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
                RequestHelper.get('https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix(), {
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

                MediaHelper.mkdirRecursively(this.settings.localPath + dirPath);

                debug.log('Writing file "' + this.settings.localPath + path + '"...', this);

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
                
                RequestHelper.get(apiPath, {
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

                    RequestHelper.put(apiPath, {
                        headers: headers,
                        data: JSON.stringify(postData)
                    }).on('complete', (data, response) => {
                        if(data.message) {
                            debug.log('Committing file failed: ' + data.message, this);
                            reject(newError(data.message));
                        
                        } else {
                            debug.log('Committed file successfully to ' + path, this);
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

                debug.log('Removing "' + path + '"...', this, 2);

                // Fetch first to get the SHA
                debug.log('Getting SHA...', this, 2);
                
                RequestHelper.get(getApiPath, {
                    headers: headers
                }).on('complete', (data, response) => {
                    // Data wasn't found, nothing needs to be deleted
                    if(!data || !data.sha) {
                        debug.log('No data found!', this, 2);
                        resolve();
                    }

                    let postData = {
                        sha: data.sha,
                        path: path,
                        message: 'Removed by HashBrown CMS',
                        branch: this.settings.branch || 'gh-pages'
                    };

                    // Remove the file
                    debug.log('Removing data...', this, 2);

                    RequestHelper.del(delApiPath, {
                        headers: headers,
                        data: JSON.stringify(postData)
                    }).on('complete', (data, response) => {
                        if(data.message) {
                            debug.log('Removing file failed: ' + data.message, this, 2);
                            reject(new Error(data.message));    

                        } else {
                            debug.log('Removed file successfully!', this, 2);
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

                RequestHelper.get(getApiUrl, {
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
     * Gets template by id
     *
     * @param {String} type
     * @param {String} id
     *
     * @returns {Promise} Template
     */
    getTemplateById(type, id) {
        let path = GitHubConnection.getTemplateRemotePath(type);

        return this.getContents(path)
        .then((files) => {
            for(let i in files) {
                let file = files[i];
                let name = (file.path || file).replace(path + '/', '');
                let template = new Template({
                    name: name,
                    type: type,
                    remotePath: path + '/' + name,
                    remote: this.settings.isLocal != true
                });

                template.updateFromName();
                
                if(id == template.id) {
                    return this.getTemplateMarkup(template);
                }
            }
            
            return Promise.reject(new Error('Template by id "' + id + '" not found'));
        });
    }
   
    /**
     * Gets Template markup
     *
     * NOTE:
     * Previously, Template parents were assigned using the "layout" YAML parameter, but it
     * turned out to be too slow to fetch the entire markup for every Template when getting
     * all of them at once.
     *
     * @param {Template} template
     *
     * @returns {Promise} Promise
     */
    getTemplateMarkup(template) {
        return this.getContents(template.remotePath, 'file')
        .then((markup) => {
            if(markup) {
                // Stringify markup
                if(markup.content && markup.encoding == 'base64') {
                    template.markup = new Buffer(markup.content, 'base64').toString();
                } else {
                    template.markup = markup.toString();
                }
            }

            return Promise.resolve(template);
        });
    }

    /**
     * Deletes template by id
     *
     * @param {String} type
     * @param {String} id
     *
     * @returns {Promise} Callback
     */
    deleteTemplateById(type, id) {
        let oldTemplate;

        // Get original first
        this.getTemplateById(type, id)
        .then((template) => {
            return this.deleteContents(template.remotePath)
        });
    }
    
    /**
     * Sets template by id
     *
     * @param {String} type
     * @param {String} id
     * @param {Template} newTemplate
     *
     * @returns {Promise} Callback
     */
    setTemplateById(type, id, newTemplate) {
        let oldTemplate;

        // Get original first
        this.getTemplateById(type, id)
        .then((template) => {
            oldTemplate = template;

            // Make sure markup is kept if it's not included in the request
            // This would be the case when renaming Templates
            if(!newTemplate.markup) {
                newTemplate.markup = oldTemplate.markup;
            }
        })
        // If template was not found, continue and set appropriate remote paths
        .catch(() => {
            newTemplate.remotePath = GitHubConnection.getTemplateRemotePath(type) + '/' + newTemplate.name;

            return Promise.resolve();
        })
        .then(() => {
            // Old file was not found, create new
            if(!oldTemplate) {
                return this.postContents(newTemplate.remotePath, newTemplate.markup);
            }
            
            // Name was changed
            if(newTemplate.name != oldTemplate.name) {
                newTemplate.remotePath = newTemplate.remotePath.replace(oldTemplate.name, newTemplate.name);
            }

            // Path was changed
            if(newTemplate.remotePath != oldTemplate.remotePath) {
                // Remove old file first
                return this.deleteContents(oldTemplate.remotePath)
                .then(() => {

                    // Post new file
                    return this.postContents(newTemplate.remotePath, newTemplate.markup);
                });
        
            // Markup was changed
            } else if(newTemplate.markup != oldTemplate.markup) {
                return this.postContents(newTemplate.remotePath, newTemplate.markup);

            }

            // Nothing was changed, resolve normally
            return Promise.resolve(); 
        })
        .then(() => {
            return this.getTemplateById(newTemplate.type, newTemplate.id);
        });
    }
   
    /**
     * Gets appropriate Template remote path
     *
     * @param {String} type
     *
     * @returns {String} Remote path
     */
    static getTemplateRemotePath(type) {
        switch(type) {
            case 'page':
                return '_layouts'
            case 'section':
            case 'partial':
                return '_includes/partials'
        }

        return '';
    }

    /**
     * Gets templates
     *
     * @param {String} type
     *
     * @returns {Promise} Array of Templates
     */
    getTemplates(type) {
        let path = GitHubConnection.getTemplateRemotePath(type);

        let templates = [];

        return this.getContents(path)
        .then((files) => {
            for(let file of files) {
                let name = (file.path || file).replace(path + '/', '');

                let template = new Template({
                    name: name,
                    type: type,
                    remotePath: path + '/' + name,
                    remote: this.settings.isLocal != true
                });

                template.updateFromName();

                templates[templates.length] = template;
            }

            return Promise.resolve(templates);
        });
    }

    /**
     * Gets all Media objects
     *
     * @returns {Promise} Array of Media objects
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
                        url: nodePath,
                        remote: this.settings.isLocal != true
                    });
                }
            }

            return Promise.resolve(media);    
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
                        remote: this.settings.isLocal != true
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

        debug.log('Uploading content "' + path + '"...', this);

        // First remove existing media if it exists
        return this.removeMedia(id)
        .then(() => {
            return new Promise((resolve, reject) => {
                let tempPath = file.path;
                
                // Local behaviour        
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

                // Remote behaviour
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
                            RequestHelper.put(fileApiPath, {
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
                        }
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
                
                RequestHelper.get(dirApiPath, {
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

                            RequestHelper.del(fileApiPath, {
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
