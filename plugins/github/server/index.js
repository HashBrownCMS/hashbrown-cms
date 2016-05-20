'use strict';

let request = require('request');
let config = require('./config.json');
let Promise = require('bluebird');

let ConnectionHelper = require(appRoot + '/src/server/helpers/ConnectionHelper');
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
        let content = req.body.content;        
        let media = req.body.media;

        // TODO: Render content to YAML if needed
        // TODO: Push content to repo if needed
        // TODO: Push media to repo if needed

        res.sendStatus(200);
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
