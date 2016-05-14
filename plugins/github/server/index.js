'use strict';

let request = require('request');
let config = require('./config.json');
let Promise = require('bluebird');

let credentials = {
    usr: '',
    pwd: ''
};

class GitHub {
    static init(app) {
        app.post('/api/github/login', GitHub.postLogin);
        app.get('/api/github/:org/:repo/publish', GitHub.publish);
        app.get('/api/github/:org/:repo/dirs', GitHub.getRootDirectories);
        app.get('/api/github/orgs', GitHub.getOrgs);
        app.get('/api/github/:org/repos', GitHub.getRepos);
    }

    /**
     * Logs in the user
     */
    static postLogin(req, res) {
        // In some cases we might just want to check whether or not we're logged in
        if(req.body) {
            let usr = req.body.usr;
            let pwd = req.body.pwd;

            if(usr) {
                credentials.usr = usr;
            }
             
            if(pwd) {   
                credentials.pwd = pwd;
            }
        }

        GitHub.apiCall('user')
        .then(function(result) {
            res.sendStatus(result.statusCode);
        });
    }

    /**
     * Api call
     *
     * @param {String} path
     *
     * @return {Promise} promise
     */
    static apiCall(path) {
        console.log('[GitHub] Calling API endpoint "' + path + '"...');

        return new Promise(function(callback) {
            request({
                url: 'https://api.github.com/' + path,
                json: true,
                headers: {
                    'User-Agent': 'Endomon-CMS',
                    'Host': 'api.github.com',
                    'Authorization': 'Basic ' + new Buffer(credentials.usr + ':' + credentials.pwd).toString('base64')
                }
            }, function(err, response, body) {
                if(err) {
                    throw err;
                }    

                if(response.body && response.body.message) {
                    console.log('[GitHub] -> ' + response.body.message);
                }

                callback(response);
            });
        });
    }

    /**
     * Gets upload info
     */
    static getUploadInfo(req, res) {
        // TODO: Send relevant info, probably commits
        res.send({});
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
        GitHub.apiCall('user/orgs/')
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
