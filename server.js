'use strict';

let express = require('express');
let bodyparser = require('body-parser');
let app = express();

let env = require('./env.json');
let config = require('./config/jekyll.json'); // TODO: Incorporate the config into the necessary calls

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

/**
 * Routes
 */
// Redir repo
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

// Views
require('./routes/views')(app, env);

// API
require('./routes/api/repo')(app, env);

let server = app.listen(8000);
