'use strict';

const ConnectionHelper = require('Server/Helpers/ConnectionHelper');
const ConfigHelper = require('Server/Helpers/ConfigHelper');
const RequestHelper = require('Server/Helpers/RequestHelper');
const ApiController = require('Server/Controllers/ApiController');

const Connection = require('./server/Connection');

let route = '';

class GitHubPages {
    static init(app) {
        let config = ConfigHelper.getSync('plugins/github');

        ConnectionHelper.registerConnectionType('GitHub Pages', Connection);

        /**
         * Starts the oAuth flow
         */
        app.get('/plugins/github/oauth/start', (req, res) => {
            if(!config || !config.clientId || !config.clientSecret) {
                res.status(502).send('Malformed or non-existent GitHub config file (/config/plugins/github.cfg)');
            }

            route = req.query.route;

            res.redirect('https://github.com/login/oauth/authorize?client_id=' + config.clientId + '&scope=repo read:org');
        });

        /**
         * Ends the oAuth flow
         */
        app.get('/plugins/github/oauth/end', (req, res) => {
            let code = req.query.code;
            let postData = {
                code: code,
                client_id: config.clientId,
                client_secret: config.clientSecret
            };

            RequestHelper.request('post', 'https://github.com/login/oauth/access_token', postData)
            .then((resData) => {
                res.send(resData.access_token);
            })
            .catch((e) => {
                res.status(502).send('');
                
                debug.error(e);
            });
        });

        /**
         * Lists all user repos
         */
        app.get('/plugins/github/repos', (req, res) => {
            let apiUrl = 'https://api.github.com/user/repos';
            
            RequestHelper.getPaginated(apiUrl, { access_token: req.query.token })
            .then((resData) => {
                res.send(resData);
            })
            .catch((e) => {
                res.status(404).send([]);
                
                debug.error(e);
            });
        });

        /**
         * Lists all branches
         */
        app.get('/plugins/github/:owner/:repo/branches', (req, res) => {
            RequestHelper.request('get', 'https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/branches', { access_token: req.query.token })
            .then((resData) => {
                res.send(resData);
            })
            .catch((e) => {
                res.status(404).send([]);
                
                debug.error(e);
            });
        });

        /**
         * Lists all root directories
         */
        app.get('/plugins/github/:owner/:repo/dirs', (req, res) => {
            RequestHelper.getPaginated('https://api.github.com/repos/' + req.params.owner + '/' + req.params.repo + '/contents', { access_token: req.query.token })
            .then((resData) => {
                let dirs = [];

                if(resData) {
                    for(let i in resData) {
                        let file = resData[i];

                        if(file.type == 'dir') {
                            dirs[dirs.length] = file.path;
                        }
                    }
                }

                res.send(dirs);
            })
            .catch((e) => {
                res.send([]);
                
                debug.error(e);
            });
        });
    }
}

module.exports = GitHubPages;
