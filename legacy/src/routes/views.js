'use strict';

module.exports = function(app, env) {
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

    app.get('/repos/:user/:repo/:branch/cms/:root/:path*', function(req, res) {
        let model = { view: 'cms', req: req };

        res.render('index', model);
    });
};
