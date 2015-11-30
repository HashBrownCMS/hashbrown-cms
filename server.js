'use strict';

let octokat = require('octokat');
let express = require('express');
let bodyparser = require('body-parser');
let app = express();

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
app.get('/repos/', function(req, res) {
    let model = { view: 'repos', req: req };

    res.render('index', model);
});

// Deployment dashboard
app.get('/repos/:repo/deployment', function(req, res) {
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

    octo.zen.read(function(err, val) {
        if(err) {
            res.send(err);
        } else {
            res.send(req.body.redirect || '/repos/');
        }
    });
});

// Get repos
app.get('/api/repos', function(req, res) {
    
});

let server = app.listen(8000);
