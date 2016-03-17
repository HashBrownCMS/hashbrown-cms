'use strict';
let request = require('request');
let config = require('../config.json');

class GitHub {
    static init(app) {
        app.get('/api/github/issues', GitHub.getAllIssues);
    }

    /**
     * Gets all issues
     */
   static getAllIssues(req, res) {
        res.send(['dude']);
   } 
}

module.exports = GitHub;
