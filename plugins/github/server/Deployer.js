'use strict';

const FileSystem = require('fs');
const Path = require('path');
const Glob = require('glob');
const RimRaf = require('rimraf');

/**
 * GitHub deployer
 */
class GitHubDeployer extends HashBrown.Models.Deployer {
    // Name and alias
    static get name() { return 'GitHub'; }
    static get alias() { return 'github'; }

    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(Object, 'token');
        this.def(String, 'repo');
        this.def(String, 'branch');
    }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        let path = '';

        if(this.isLocal) {
            return this.localRoot;
        
        } else {
            return 'https://api.github.com/repos/' + this.repo + '/contents/';

        }
        
        return path;
    }

    /**
     * Gets a deployment path
     *
     * @returns {String} Path
     */
    getPath(path) {
        path = super.getPath(path);
        path += '?access_token=' + this.token + '&' + 'ref=' + (this.branch || 'gh-pages');

        return path;
    }

    /**
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    test() {
        return HashBrown.Helpers.RequestHelper.request('get', 'https://api.github.com/user?token=' + this.token)
        .then(() => {
            return Promise.resolve(true);  
        });
    }

    /**
     * Gets a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    getFile(path) {
        // Fetch using filesystem
        if(this.isLocal) {
            return new Promise((resolve, reject) => {
                FileSystem.readFile(path, (err, data) => {
                    if(err) {
                        reject(err);
                    
                    } else {
                        resolve(data);

                    }
                });
            });
        }

        // If not, proceed with API call
        return HashBrown.Helpers.RequestHelper.request('get', path)
        .then((data) => {
            if(!data) { return Promise.resolve(); }
            
            if(data.message) {
                return Promise.reject(new Error('Couldn\'t find "' + path + '". GitHub response: ' + JSON.stringify(data.message)));
            }
            
            return Promise.resolve(data);
        });
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    getFolder(path) {
        // Fetch using filesystem
        if(this.isLocal) {
            return new Promise((resolve, reject) => {
                FileSystem.readDir(path, (err, data) => {
                    if(err) {
                        reject(err);
                    
                    } else {
                        resolve(data);

                    }
                });
            });
        }

        // If not, proceed with API call
        return HashBrown.Helpers.RequestHelper.request('get', path)
        .then((data) => {
            if(!data) { return Promise.resolve(); }
            
            if(data.message) {
                return Promise.reject(new Error('Couldn\'t find "' + path + '". GitHub response: ' + JSON.stringify(data.message)));
            }
            
            return Promise.resolve(data);
        });
    }

    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @return {Promise} Promise
     */
    setFile(path, base64) {
        // Local
        if(this.isLocal) {
            return new Promise((resolve, reject) => {
                let dirPath = path.slice(0, path.lastIndexOf('/'));

                HashBrown.Helpers.MediaHelper.mkdirRecursively(this.getLocalUrl() + dirPath);

                debug.log('Writing file "' + this.getLocalUrl() + path + '"...', this);

                FileSystem.writeFile(path, Buffer.from(base64, 'base64'), (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                        debug.log('Uploaded file successfully to ' + path, this);
                    }
                });
            });
        }

        // Fetch first to get the SHA
        debug.log('Getting SHA...', this);
        
        return HashBrown.Helpers.RequestHelper.request('get', path)
        .catch((e) => {
            // If the file wasn't found, just proceed
            
            return Promise.resolve();
        })
        .then((data) => {
            let postData = {
                sha: data ? data.sha : null,
                path: path,
                message: 'Commit from HashBrown CMS',
                content: base64,
                branch: this.branch || 'gh-pages'
            };

            // Commit the file
            debug.log('Committing data...', this);

            return HashBrown.Helpers.RequestHelper.request('put', path, postData);
        })
        .then((data) => {
            if(data.message) {
                return Promise.reject(new Error(data.message));
            } 
            
            return Promise.resolve();
        });
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    removeFile(path) {
        // Delete content locally
        if(this.isLocal) {
            return new Promise((resolve, reject) => {
                RimRaf(path, (err) => {
                    if(err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }

        // Delete from repo
        debug.log('Removing "' + path + '"...', this, 2);

        // Fetch first to get the SHA
        debug.log('Getting SHA...', this, 2);
        
        return HashBrown.Helpers.RequestHelper.request('get', path)
        .then((data) => {
            // Data wasn't found, nothing needs to be deleted
            if(!data || !data.sha) {
                return Promise.resolve();
            }

            let postData = {
                sha: data.sha,
                path: path,
                message: 'Removed by HashBrown CMS',
                branch: this.branch || 'gh-pages'
            };

            // Remove the file
            debug.log('Removing data...', this, 2);

            return HashBrown.Helpers.RequestHelper.request('delete', path, postData);
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
     * Removes a folder
     *
     * @param {String} path
     *
     * @returns {Promise} Result
     */
    removeFolder(path) {
        return this.removeFile(path);
    }
}

module.exports = GitHubDeployer;
