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

// Issues dashboard
app.get('/repos/:repo/issues', function(req, res) {
    let model = { view: 'issues', req: req };

    res.render('index', model);
});

// CMS
app.get('/repos/:repo/:branch/cms', function(req, res) {
    let model = { view: 'cms', req: req };

    res.render('index', model);
});

/**
 * API
 */
// Login
app.post('/api/login/', function(req, res) {
    let octo = new octokat({
        username: req.body.username,
        password: req.body.password
    });

    octo.authorizations.create(
        {
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

// Get repos from user
app.post('/api/:user/repos', function(req, res) {
    let octo = new octokat({ token: req.body.token });

    octo.fromUrl('/users/' + req.params.user + '/repos').fetch(function(err, val) {
        if(err) {
            res.send({ err: err });
        } else {
            res.send(val);
        }
    });
});

// Get repo
app.post('/api/:user/:repo', function(req, res) {
    let octo = new octokat({ token: req.body.token });

    octo.fromUrl('/repos/' + req.params.user + '/' + req.params.repo).fetch(function(err, repo) {
        if(err) {
            res.send({ err: err });
        } else {
            res.send(repo);
        }
    });
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
app.post('/api/:user/:repo/merge/:base/:head', function(req, res) {
    let octo = new octokat({ token: req.body.token });
    let url = '/repos/' + req.params.user + '/' + req.params.repo + '/merges';

    octo.fromUrl(url).create(
        {
            head: req.params.head,
            base: req.params.base
        },
        function(err, merge) {
            if(err) {
                res.send({ err: err });
            } else {
                res.send(merge);
            }
        }
    );
});

let server = app.listen(8000);
