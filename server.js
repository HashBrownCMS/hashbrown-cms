'use strict';

let octokat = require('octokat');
let express = require('express');
let bodyparser = require('body-parser');
let restler = require('restler');
let app = express();

let env = require('./env.json');

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

/**
 * Routes
 */
// Login
app.get('/', function(req, res) {
    let model = { view: 'login', req: req };

    res.render('index', model);
});

// Repos dashboard
app.get('/repos/:user', function(req, res) {
    let model = { view: 'repos', req: req };

    res.render('index', model);
});

// Deployment dashboard
app.get('/repos/:user/:repo/deployment', function(req, res) {
    let model = { view: 'deployment', req: req };

    res.render('index', model);
});

// Collaborators dashboard
app.get('/repos/:user/:repo/collaborators', function(req, res) {
    let model = { view: 'collaborators', req: req };

    res.render('index', model);
});

// Issues dashboard
app.get('/repos/:user/:repo/issues', function(req, res) {
    let model = { view: 'issues', req: req };

    res.render('index', model);
});

// Settings dashboard
app.get('/repos/:user/:repo/settings', function(req, res) {
    let model = { view: 'settings', req: req };

    res.render('index', model);
});

// CMS
app.get('/repos/:user/:repo/:branch/cms', function(req, res) {
    let model = { view: 'cms', req: req };

    res.render('index', model);
});

/**
 * Redir
 */
// Repo
app.get('/redir/repo/:user/:repo/:branch', function(req, res) {
    res.redirect('https://github.com/' + req.params.user + '/' + req.params.repo + '/tree/' + req.params.branch);

    octo.fromUrl('/repos/' + req.params.user + '/' + req.params.repo + '/branches/' + req.params.branch).fetch(function(err, val) {
        if(err) {
            res.send({ err: err });
        } else {
            res.redirect(val._links.html);
        }
    });
});

/**
 * API
 */
// Generic call
function apiCall(req, res, url) {
    function callback(err, answer) {
        if(err) {
            res.send({ mode: req.params.mode, url: url, err: err });
        } else {
            res.send(answer);
        }
    }
    
    let octo = new octokat({ token: req.body.token });
    
    switch(req.params.mode) {
        case 'set':
            octo.fromUrl(url).create(callback);
            break;
        
        case 'update':
            octo.fromUrl(url).update(callback);
            break;
        
        case 'get': default:
            octo.fromUrl(url).fetch(callback);
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

// Get issues
app.post('/api/:user/:repo/issues', function(req, res) {
    let url = '/repos/' + req.params.user + '/' + req.params.repo + '/issues';
    
    apiCall(req, res, url);
});

// Get/set labels
app.post('/api/:user/:repo/:mode/labels', function(req, res) {
    let url = '/repos/' + req.params.user + '/' + req.params.repo + '/labels';

    apiCall(req, res, url);
});

// Get/set file
app.post('/api/:user/:repo/:mode/file/:path', function(req, res) {
    let url = '/repos/' + req.params.user + '/' + req.params.repo + '/contents/' + req.params.path;

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

let server = app.listen(8000);
