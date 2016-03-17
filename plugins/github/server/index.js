'use strict';

let request = require('request');
let config = require('../config.json');
let Promise = require('bluebird');

let credentials = {
    usr: '',
    pwd: ''
};

class GitHub {
    static init(app) {
        app.post('/api/github/login', GitHub.postLogin);
        app.get('/api/github/issues', GitHub.getAllIssues);
    }

    /**
     * Logs in the user
     */
    static postLogin(req, res) {
        let usr = req.body.usr;
        let pwd = req.body.pwd;

        credentials.usr = usr;
        credentials.pwd = pwd;

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

                callback(response);
            });
        });
    }

    /**
     * Gets all issues
     */
    static getAllIssues(req, res) {
        GitHub.apiCall('repos/' + config.org + '/' + config.repo + '/issues')
        .then(function(response) {
            res.send(response.body);
        }); 
   } 
}

module.exports = GitHub;
