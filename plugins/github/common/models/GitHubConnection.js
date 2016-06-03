'use strict';

let request = require('../lib/request');
let yamljs = require('../lib/yamljs/Yaml');
let Octokat = require('../lib/octokat');

let Connection = require(appRoot + '/src/common/models/Connection');
let Content = require(appRoot + '/src/common/models/Content');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');
let LanguageHelper = require(appRoot + '/src/common/helpers/LanguageHelper');

let octo;

class GitHubConnection extends Connection {
    constructor(data) {
        super(data);
    
        if(this.settings.token) {
            octo = new Octokat({
                token: this.settings.token
            });  
        }
    }

    /**
     * Gets all root directories
     */
    getRootDirectories() {
        return new Promise((callback) => {
            octo.repos(this.settings.org, this.settings.repo).contents().fetch()
            .then(function(files) {
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
            octo.me.orgs().fetch()
            .then(function(orgs) {
                callback(orgs);
            }); 
        }); 
    }
    
    /**
     * Gets all repositories
     */
    getRepos() {
        return new Promise((callback) => {
            octo.orgs(this.settings.org).repos().fetch()
            .then(function(repos) {
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
        console.log('[GitHub] Uploading "' + properties.title + '"...');

        return new Promise((callback) => {
            let data;
            let path = properties.url + '.md';

            // Compile for Jekyll
            if(this.settings.compileForJekyll) {
                data = this.compileForJekyll(properties);
            } else {
                data = JSON.stringify(properties);
            }

            let repo = octo.repos(this.settings.org, this.settings.repo);

            // Fetch first to get the SHA
            console.log('[GitHub] Getting SHA...');
            repo.contents(path).fetch()
            .then((info) => {
                let sha = info.sha;
           
                let config = {
                    message: 'Commit from Endomon CMS',
                    content: new Buffer(data).toString('base64'),
                    sha: sha        
                };

                console.log('[GitHub] Committing data...');
                repo.contents(path).add(config)
                .then(() => {
                    console.log('[GitHub] Uploaded file sucessfully!');
                    callback();
                });
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
