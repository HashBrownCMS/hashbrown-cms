'use strict';

const Yaml = require('./lib/yamljs/Yaml');
const FileSystem = require('fs');
const Path = require('path');
const Glob = require('glob');
const RimRaf = require('rimraf');

const Connection = require('Common/Models/Connection');
const Content = require('Common/Models/Content');
const Media = require('Common/Models/Media');
const Template = require('Common/Models/Template');

const RequestHelper = require('Server/Helpers/RequestHelper');
const UserHelper = require('Server/Helpers/UserHelper');
const MediaHelper = require('Server/Helpers/MediaHelper');
const ContentHelper = require('Server/Helpers/ContentHelper');

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
     * Gets whether this connection si serving local content
     *
     * @returns {Boolean} Is local
     */
    isLocal() {
        return this.settings.isLocal !== false;
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
        frontMatter += Yaml.stringify(properties, 50); 
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
        // Local is set, fetch using filesystem
        if(this.settings.isLocal) {
            return new Promise((resolve, reject) => {
                switch(type) {
                    default: case 'dir':
                        FileSystem.readdir(this.settings.localPath + path, (err, data) => {
                            if(err) {
                                debug.error(err, this);
                                resolve([]);
                            
                            } else {
                                resolve(data);

                            }
                        });
                        break;

                    case 'file':
                        FileSystem.readFile(this.settings.localPath + path, (err, data) => {
                            if(err) {
                                debug.error(err, this);
                                resolve([]);
                            
                            } else {
                                resolve(data);

                            }
                        });
                        break;
                }
            });
        }

        // If not, proceed with API call
        return RequestHelper.request('get', 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix())
        .then((data) => {
            if(!data) { return Promise.resolve(); }
            
            if(data.message) {
                return Promise.reject(new Error('Couldn\'t find "' + path + '". GitHub response: ' + JSON.stringify(data.message)));
            }
            
            return Promise.resolve(data);
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
        // Post to local
        if(this.settings.isLocal) {
            return new Promise((resolve, reject) => {
                let dirPath = path.slice(0, path.lastIndexOf('/'));

                MediaHelper.mkdirRecursively(this.settings.localPath + dirPath);

                debug.log('Writing file "' + this.settings.localPath + path + '"...', this);

                FileSystem.writeFile(this.settings.localPath + path, content, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                        debug.log('Uploaded file successfully to ' + path, this);
                    }
                });
            });
        }

        // Post to repo
        let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();

        // Fetch first to get the SHA
        debug.log('Getting SHA...', this);
        
        return RequestHelper.request('get', apiPath)
        .catch((e) => {
            // If the file wasn't found, just proceed
            
            return Promise.resolve();
        })
        .then((data) => {
            let postData = {
                sha: data ? data.sha : null,
                path: path,
                message: 'Commit from HashBrown CMS',
                content: new Buffer(content).toString('base64'),
                branch: this.settings.branch || 'gh-pages'
            };

            // Commit the file
            debug.log('Committing data...', this);

            return RequestHelper.request('put', apiPath, postData);
        })
        .then((data) => {
            if(data.message) {
                return Promise.reject(new Error(data.message));
            } 
            
            return Promise.resolve();
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
        // Delete content locally
        if(this.settings.isLocal) {
            return new Promise((resolve, reject) => {
                RimRaf(this.settings.localPath + path, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        // Delete from repo
        let getApiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();
        let delApiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path + '?' + this.getAppendix();

        debug.log('Removing "' + path + '"...', this, 2);

        // Fetch first to get the SHA
        debug.log('Getting SHA...', this, 2);
        
        return RequestHelper.request('get', getApiPath)
        .then((data) => {
            // Data wasn't found, nothing needs to be deleted
            if(!data || !data.sha) {
                return Promise.resolve();
            }

            let postData = {
                sha: data.sha,
                path: path,
                message: 'Removed by HashBrown CMS',
                branch: this.settings.branch || 'gh-pages'
            };

            // Remove the file
            debug.log('Removing data...', this, 2);

            return RequestHelper.request('delete', delApiPath, postData);
        })
        .then((data) => {    
            if(data.message) {
                debug.log('Removing file failed: ' + data.message, this, 2);
                return Promise.reject(new Error(data.message));    

            }
            
            debug.log('Removed file successfully!', this, 2);
            return Promise.resolve();
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
        // Local is set, fetch using filesystem
        if(this.settings.isLocal) {
            return new Promise((resolve, reject) => {
                let path = root + '/**/*';
                
                if(mode == 'dir') {
                    path += '/';                
                }

                Glob(
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
            });
        }

        // If not, proceed with API call
        let getApiUrl = 'https://api.github.com/repos/' + this.settings.repo + '/git/trees/' + (this.settings.branch || 'gh-pages') + '?recursive=1&access_token=' + this.settings.token;

        return RequestHelper.request('get', getApiUrl)
        .then((data) => {
            if(!data || !data.tree) { 
                return Promise.reject(new Error('No data in GitHub response'));
            }

            return Promise.resolve(data.tree);    
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
        let path = this.getTemplateRemotePath(type);

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
           
            debug.error(new Error('Template by id "' + id + '" not found'), this);
            return Promise.resolve();
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
            newTemplate.remotePath = this.getTemplateRemotePath(type) + '/' + newTemplate.name;

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
    getTemplateRemotePath(type) {
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
        let path = this.getTemplateRemotePath(type);

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
                        name: Path.basename(nodePath),
                        id: Path.dirname(nodePath).replace('media/', '').replace(this.settings.localPath, ''),
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
                        name: file.name || Path.basename(file),
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
     * @returns {Promise} Promise
     */
    setMedia(id, file) {
        let path = 'media/' + id;

        debug.log('Uploading content "' + path + '"...', this);

        // First remove existing media if it exists
        return this.removeMedia(id)
        .then(() => {
                let tempPath = file.path;
                
            // Local behaviour        
            if(this.settings.isLocal) {
                return new Promise((resolve, reject) => {
                    let newDirPath = this.settings.localPath + path; 
                    let newFilePath = newDirPath + '/' + file.filename; 

                    MediaHelper.mkdirRecursively(newDirPath);

                    FileSystem.rename(tempPath, newFilePath, (err, fileData) => {
                        if(err) {
                            // We couldn't read the temp file, rejecting
                            reject(new Error(err));
                        
                        } else {
                            debug.log('Uploaded file successfully to ' + newFilePath, this);
                            resolve();

                        }
                    });
                });
            }

            // Remote behaviour
            let apiUrl = 'https://api.github.com/repos/' + this.settings.repo + '/contents/' + path;
            let dirApiPath = apiUrl + '?' + this.getAppendix();
            let fileApiPath = apiUrl + '/' + file.filename + '?' + this.getAppendix();

            return new Promise((resolve, reject) => {
                // Read the file from the temporary storage
                FileSystem.readFile(tempPath, (err, fileData) => {
                    if(err) {
                        // We couldn't read the temp file, rejecting
                        reject(new Error(err));
                    }

                    resolve(fileData);
                });
            })
            .then((fileData) => {
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
                return RequestHelper.request('put', fileApiPath, postData);
            })
            .then((data) => {
                if(data.message) {
                    debug.log('Committing file failed: ' + data.message, this);
                    return Promise.reject(new Error(data.message));
                }

                debug.log('Committed file successfully to ' + fileApiPath, this);
                return Promise.resolve();
            });
        });
    }
    
    /**
     * Removes media
     *
     * @param {String} id
     *
     * @returns {Promise} Promise
     */
    removeMedia(id) {
        let path = 'media/' + id;

        // Remove file locally
        if(this.settings.isLocal) {
            return new Promise((resolve, reject) => {
                RimRaf(this.settings.localPath + path, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        // Remove file from repo
        let apiPath = 'https://api.github.com/repos/' + this.settings.repo + '/contents/';
        let dirApiPath = apiPath + path + '?' + this.getAppendix();
        
        // Fetch first to get the SHA
        debug.log('Getting existing files...', this);
        
        return RequestHelper.request('get', dirApiPath)
        .catch((e) => {
            // No files found, continue

            return Promise.resolve();
        })
        .then((getResponse) => {
            let removeNext = () => {
                if(!getResponse || !Array.isArray(getResponse)) {
                    return Promise.resolve();
                }

                let media = getResponse.pop();

                // Check if data object is empty
                if(!media || Object.keys(media).length < 1) {
                    return Promise.resolve();
                }

                let fileApiPath = apiPath + path + '/' + media.name + '?' + this.getAppendix();
                let postData = {
                    sha: media.sha,
                    path: path,
                    message: 'Removed by HashBrown CMS',
                    branch: this.settings.branch || 'gh-pages'
                };

                // Remove the file
                debug.log('Removing data...', this);

                return RequestHelper.request('delete', fileApiPath, postData)
                .then((delResponse) => {
                    if(delResponse && delResponse.message) {
                        return Promise.reject(new Error(delResponse.message));
                    }
                    
                    debug.log('Removed file successfully!', this);

                    return removeNext();
                });
            }

            return removeNext();
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
