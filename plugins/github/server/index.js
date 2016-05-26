'use strict';

let request = require('request');
let config = require('./config.json');
let Promise = require('bluebird');
let yaml = require('../common/lib/yamljs/Yaml.js');

let Content = require(appRoot + '/src/common/models/Content');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');
let LanguageHelper = require(appRoot + '/src/common/helpers/LanguageHelper');
let WebFlowHelper = require('./WebFlowHelper');
let NonWebFlowHelper = require('./NonWebFlowHelper');

let oAuthCache = {};

class GitHub {
    static init(app) {
        app.get('/api/github/:org/:repo/publish', GitHub.publish);
        app.get('/api/github/:org/:repo/dirs', GitHub.getRootDirectories);
        app.get('/api/github/templates', GitHub.getAllTemplates);
        app.get('/api/github/orgs', GitHub.getOrgs);
        app.get('/api/github/:org/repos', GitHub.getRepos);

        app.post('/api/github/publish', GitHub.publish);

        WebFlowHelper.init(app);
        NonWebFlowHelper.init(app);
    }

    /**
     * Api call
     *
     * @param {String} path
     * @param {String} token
     *
     * @return {Promise} promise
     */
    static apiCall(path) {
        return new Promise(function(callback) {
            
        });
    }

    /**
     * Gets all root directories
     */
    static getRootDirectories(req, res) {
        GitHub.apiCall('repos/' + req.params.org + '/' + req.params.repo + '/contents/')
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
    }

    /**
     * Gets all organisations
     */
    static getOrgs(req, res) {
        GitHub.apiCall('user/orgs/', req.query.token)
        .then(function(response) {
            let orgs = response.body;

            res.send(orgs);
        }); 
    }
    
    /**
     * Gets all repositories
     */
    static getRepos(req, res) {
        GitHub.apiCall('orgs/' + req.params.org + '/repos/')
        .then(function(response) {
            let repos = response.body;

            res.send(repos);
        }); 
    }

    /**
     * Publishes content
     */
    static publish(req, res) {
        let settings = req.body.settings;
        let contentProperties = req.body.content;

        if(contentProperties) {
            let content = new Content(contentProperties);

            let commitQueue = [];
                
            function commitNext() {
                if(commitQueue.length > 0) {
                    let queueItem = commitQueue.pop();
                    let filePath = '/content' + queueItem.url.substring(0, queueItem.url.length - 1) + '.md';
                    let data = queueItem.data;

                    console.log('[GitHub] Committing data to "' + filePath + '"...');

                    // TODO: Commit to GitHub using path and data

                    commitNext();
                
                } else {
                    console.log(' -> Success');
                    res.sendStatus(200);
                
                }
            }

            LanguageHelper.getLanguages()
            .then((languages) => {
                for(let language of languages) {
                    let properties = content.getProperties(language);

                    // Compile for Jekyll
                    if(settings.compileForJekyll) {
                        console.log('[GitHub] Compiling node "' + properties.title + '" for Jekyll...');

                        let frontMatter = '';

                        frontMatter += '---\n';
                        frontMatter += yaml.stringify(properties); 
                        frontMatter += '\n---';

                        commitQueue[commitQueue.length] = {
                            url: properties.url,
                            data: frontMatter
                        };
                        
                        console.log(' -> Success');
                    }
                }

                if(commitQueue.length <= 0) {
                    console.log('[GitHub] WARNING: Nothing to commit');
                }
                
                commitNext();
            });

        } else {
            console.log('[GitHub] No content found in POST data');

            res.sendStatus(400);
        }
    }

    /**
     * Gets all templates
     */
    static getAllTemplates(req, res) {
        res.send({ templates: ['test.html', 'test2.html'] });
/*
        GitHub.apiCall('repos/' + req.params.org + '/' + req.params.repo + '/contents/')
        .then(function(response) {
            let files = response.body;
            let dirs = [];

            for(let file of files) {
                if(file.type == 'dir' && file.path.indexOf('_layouts') > -1) {
                    dirs[dirs.length] = file.path;
                }
            }

            res.send(dirs);
        }); */
    }

    /**
     * Gets all issues
     */
    static getAllIssues(req, res) {
        GitHub.apiCall('repos/' + config.org + '/' + config.repo + '/issues?state=all')
        .then(function(response) {
            res.send(response.body);
        }); 
   } 
}

module.exports = GitHub;
