'use strict';

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

        this.def(String, 'token');
        this.def(String, 'repo');
        this.def(String, 'branch');
    }

    /**
     * Extracts the sub path from a full path
     *
     * @param {String} path
     *
     * @returns {String} Subpath
     */
    extractSubPath(path) {
        if(!path) { return ''; }

        let matches = path.match(/.*\/contents\/([a-zA-Z0-9\/]+)\?access_token/);

        if(matches) {
            return matches[1];
        }

        return '';
    }

    /**
     * Gets the root path
     *
     * @returns {String} Root
     */
    getRootPath() {
        return 'https://api.github.com/repos/' + this.repo + '/contents/';
    }

    /**
     * Gets a deployment path
     *
     * @returns {String} Path
     */
    getPath(path) {
        path = super.getPath(path);
        path += '?access_token=' + this.token + '&' + 'ref=' + (this.branch || 'gh-pages');

        // Remove trailing slashes before access token
        path = path.replace('/?access_token', '?access_token');

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
     * @param {Number} recursions
     *
     * @returns {Promise} Result
     */
    getFolder(path, recursions = 0) {
        // If using recursion, get tree instead
        if(recursions > 0) {
            path = this.extractSubPath(path);

            return HashBrown.Helpers.RequestHelper.request('get', 'https://api.github.com/repos/' + this.repo + '/git/trees/' + (this.branch || 'gh-pages') + '?recursive=1&access_token=' + this.token)
            .then((data) => {
                if(!data || !data.tree) { 
                    return Promise.reject(new Error('No data in GitHub response'));
                }

                return Promise.resolve(data.tree);    
            })
            .then((tree) => {
                for(let i = tree.length -1; i >= 0; i--) {
                    if(tree[i].mode !== '100644' || tree[i].path.indexOf(path) !== 0) {
                        tree.splice(i, 1);
                    }
                }

                return Promise.resolve(tree);
            }); 
        }

        console.log(path);

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
