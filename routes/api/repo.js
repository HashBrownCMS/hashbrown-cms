'use strict';

let octokat = require('octokat');

module.exports = function(app, env) {
    // Generic call
    function apiCall(req, res, url, customCallback) {
        function callback(err, answer) {
            if(err) {
                res.send({ mode: req.params.mode, url: url, err: err, data: req.body });
            } else {
                if(customCallback) {
                    customCallback(answer);

                } else {
                    res.send(answer);
                }
            }
        }
        
        let octo = new octokat({ token: req.body.token });
        
        delete req.body.token;

        switch(req.params.mode) {
            case 'create':
                octo.fromUrl(url).create(req.body, callback);
                break;
            
            case 'update':
                octo.fromUrl(url).update(req.body, callback);
                break;
            
            case 'fetch': default:
                octo.fromUrl(url).fetch(req.body, callback);
                break;
        }
    }

    // Login
    app.post('/api/login/', function(req, res) {
        let octo = new octokat({
            username: req.body.username,
            password: req.body.password
        });

        octo.authorizations.create(
            {
                scopes: [
                    'repo',
                    'user',
                    'admin:org'        
                ],
                note: 'Putaitu CMS token',
                client_id: env.github.client.id,
                client_secret: env.github.client.secret
            },
            function(err, val) {
                if(err) {
                    res.send({ err: err });
                } else {
                    res.send(val);
                }
            }
        );
    });

    // Get organisations
    app.post('/api/orgs', function(req, res) {
        let octo = new octokat({
            username: req.body.username,
            password: req.body.password
        });

        octo.me.orgs.fetch(function(err, val) {
            if(err) {
                res.send({ err: err });
            } else {
                res.send(val);
            }
        });
    });

    // Get repos
    app.post('/api/repos', function(req, res) {
        let octo = new octokat({ token: req.body.token });

        octo.me.repos.fetch(function(err, val) {
            if(err) {
                res.send({ err: err });
            } else {
                res.send(val);
            }
        });
    });

    // Compare branches
    app.post('/api/:user/:repo/compare/:base/:head', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/compare/' + req.params.base + '...' + req.params.head;

        apiCall(req, res, url);
    });

    // Get repos from user
    app.post('/api/:user/repos', function(req, res) {
        let url = '/users/' + req.params.user + '/repos';

        apiCall(req, res, url);
    });

    // Get collaborators
    app.post('/api/:user/:repo/collaborators', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/collaborators';

        apiCall(req, res, url);
    });

    // Get/set issues
    app.post('/api/:user/:repo/:mode/issues', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/issues';
        
        // Updating issues requires a number from the GitHub API
        if(req.params.mode == 'update') {
            url += '/' + req.body.number;
        }

        apiCall(req, res, url);
    });

    // Get refs
    app.post('/api/:user/:repo/:branch/:mode/refs', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/git/refs';

        apiCall(req, res, url);
    });

    // Get tree
    app.post('/api/:user/:repo/:branch/:mode/tree/', function(req, res) {
        let refsUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/git/refs';

        apiCall(req, res, refsUrl, function(refs) {
            let sha = '';

            for(let ref of refs) {
                if(ref.ref == 'refs/heads/' + req.params.branch) {
                    sha = ref.object.sha;
                }
            }

            let treeUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/git/trees/' + sha + '?recursive=1';

            apiCall(req, res, treeUrl);
        });
    });

    // Get/set labels
    app.post('/api/:user/:repo/:mode/labels', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/labels';

        apiCall(req, res, url);
    });

    // Get/set file
    app.post('/api/:user/:repo/:mode/file/*', function(req, res) {
        let baseUrl = '/api/' + req.params.user + '/' + req.params.repo + '/' + req.params.mode + '/file/';
        let apiUrl = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/';
        let path = req.url.replace(baseUrl, '');
        let url = apiUrl + path;

        apiCall(req, res, url);
    });

    // Get issues
    app.post('/api/:user/:repo/milestones', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/milestones';
        
        apiCall(req, res, url);
    });

    // Get repo
    app.post('/api/:user/:repo', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo;
        
        apiCall(req, res, url);
    });

    // Get branches
    app.post('/api/:user/:repo/branches', function(req, res) {
        let octo = new octokat({ token: req.body.token });
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/branches';

        octo.fromUrl(url).fetch(function(err, branches) {
            if(err) {
                res.send({ err: err });
            } else {
                let output = [];

                for(let i = 0; i < branches.length; i++) {
                    let branchUrl = url + '/' + branches[i].name;

                    octo.fromUrl(branchUrl).fetch(function(err, branch) {
                        branch.updated = branch.commit.commit.committer;
                        branch.updated.message = branch.commit.commit.message;

                        output.push(branch);

                        if(output.length == branches.length) {
                            res.send(output);
                        }
                    });
                }
            }
        });
    });

    // Merge
    app.post('/api/:user/:repo/merge', function(req, res) {
        let url = '/repos/' + req.params.user + '/' + req.params.repo + '/merges';

        apiCall(req, res, url);
    });

    // Get page struct
    app.post('/api/:user/:repo/:mode/structs/pages/:struct*', function(req, res) {
        // Get the default struct
        let page = require('../../structs/' + req.params.struct + '.json');

        res.send(page);
    });
    
    // Get field structs
    app.post('/api/:user/:repo/:mode/structs/fields', function(req, res) {
        // Get the default structs
        let page = require('../../structs/fields.json');

        res.send(page);
    });
};
