'use strict';

// ----------
// Plugins
// ----------
let Promise = require('bluebird');
let express = require('express');
let bodyparser = require('body-parser');

Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(appRoot + '/public'));
app.use('/media', express.static(appRoot + '/media'));

// ----------
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let PluginController = require(appRoot + '/src/server/controllers/PluginController');

PluginController.init();
ApiController.init(app);

// ----------
// View
// ----------
app.get('/', function(req, res) {
    res.render('index');
});

// ----------
// Server
// ----------
let server = app.listen(8000);

console.log('[Putaitu CMS] Running on port 8000');
