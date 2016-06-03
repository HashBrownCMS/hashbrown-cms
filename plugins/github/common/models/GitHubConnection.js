'use strict';

let request = require('../lib/request');
let yamljs = require('../lib/yamljs/Yaml');

let Connection = require(appRoot + '/src/common/models/Connection');
let Content = require(appRoot + '/src/common/models/Content');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');
let LanguageHelper = require(appRoot + '/src/common/helpers/LanguageHelper');

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    }

    // ----------
    // Generic API methods
    // ----------
    /**
     * GET method
     *
     * @param {String} url
     *
     * @returns {Promise} promise
     */
    get(url) {
        return new Promise((callback) => {
            request({
                url: 'https://api.github.com' + url + '?access_token=' + this.data.settings.token + '&per_page=100',
                method: 'GET',
                success: (result) => {
                    callback(result);
                },
                error: (e) => {
                    this.error(e);
                }
            });
        });
    }
    
    /**
     * DELETE method
     *
     * @param {String} url
     *
     * @returns {Promise} promise
     */
    delete(url) {
        return new Promise((callback) => {
            request({
                url: 'https://api.github.com' + url + '?access_token=' + this.data.settings.token,
                method: 'DELETE',
                success: (result) => {
                    callback(result);
                },
                error: (e) => {
                    this.error(e);
                }
            });
        });
    }

    /**
     * PATCH method
     *
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} promise
     */
    patch(url, data) {
        if(typeof data === 'object') {
            data = JSON.stringify(data);
        }

        return new Promise((callback) => {
            request({
                url: 'https://api.github.com' + url + '?access_token=' + this.data.settings.token,
                method: 'PATCH',
                postData: data,
                success: (result) => {
                    callback(result);
                },
                error: (e) => {
                    this.error(e);
                }
            });
        });
    }

    /**
     * POST method
     *
     * @param {String} url
     * @param {Object} data
     *
     * @returns {Promise} promise
     */
    post(url, data) {
        if(typeof data === 'object') {
            data = JSON.stringify(data);
        }

        return new Promise((callback) => {
            request({
                url: 'https://api.github.com' + url + '?access_token=' + this.data.settings.token,
                method: 'POST',
                postData: data,
                success: (result) => {
                    callback(result);
                },
                error: (e) => {
                    this.error(e);
                }
            });
        });
    }
    
    /**
     * PUT method
     *
     * @param {String} url
     *
     * @returns {Promise} promise
     */
    put(url) {
        return new Promise((callback) => {
            request({
                url: 'https://api.github.com' + url + '?access_token=' + this.data.settings.token,
                method: 'PUT',
                success: (result) => {
                    callback(result);
                },
                error: (e) => {
                    this.error(e);
                }
            });
        });
    }

    /**
     * Error message
     *
     * @param {Object} error
     */
    error(error) {
        console.log(error);
    }

    // ----------
    // Publishing methods
    // ----------
    /**
     * Gets all root directories
     */
    getRootDirectories() {
        return new Promise((callback) => {
            this.get('repos/' + this.settings.org + '/' + this.settings.repo + '/contents/')
            .then(function(response) {
                let files = response.body;
                let dirs = [];

                for(let file of files) {
                    if(file.type == 'dir') {
                        dirs[dirs.length] = file.path;
                    }
                }

                res.send(dirs);
            }); 
        }); 
    }

    /**
     * Gets all organisations
     */
    getOrgs() {
        return new Promise((callback) => {
            this.get('user/orgs')
            .then(function(response) {
                let orgs = response.body;

                callback(orgs);
            }); 
        }); 
    }
    
    /**
     * Gets all repositories
     */
    getRepos() {
        return new Promise((callback) => {
            this.get('orgs/' + this.settings.org + '/repos')
            .then(function(response) {
                let repos = response.body;

                callback(repos);
            }); 
        }); 
    }

    /**
     * Compiles content for Jekyll
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    compileForJekyll(properties) {
        console.log('[GitHub] Compiling "' + properties.title + '" for Jekyll...');

        let frontMatter = '';

        frontMatter += '---\n';
        frontMatter += yamljs.stringify(properties); 
        frontMatter += '\n---';

        console.log(' -> Success!');

        return frontMatter;
    }
    
    /**
     * Posts content properties to the remote target
     *
     * @param {Object} properties
     *
     * @returns {Promise} promise
     */
    postContentProperties(properties) {
        return new Promise((callback) => {
            let data = properties;

            // Compile for Jekyll
            if(this.settings.compileForJekyll) {
                data = this.compileForJekyll(properties);
            }

            this.post('/contents/' + properties.url + '.md', data)
            .then(() => {
                callback();
            });
        });
    }

    /**
     * Gets all templates
     */
    getTemplates() {
        return new Promise((callback) => {
            this.get('repos/' + this.settings.org + '/' + this.settings.repo + '/contents/')
            .then(function(response) {
                let files = response.body;
                let dirs = [];

                for(let file of files) {
                    if(file.type == 'dir' && file.path.indexOf('_layouts') > -1) {
                        dirs[dirs.length] = file.path;
                    }
                }

                callback(dirs);
            }); 
        }); 
    }
}

module.exports = GitHubConnection;
