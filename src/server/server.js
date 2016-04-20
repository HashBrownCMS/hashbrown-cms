'use strict';

// ----------
// Libs
// ----------
let Promise = require('bluebird');
let express = require('express');
let bodyparser = require('body-parser');
let exec = require('child_process').exec;

Promise.onPossiblyUnhandledRejection(function(error){
    throw error;
});

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');
app.set('views', appRoot + '/src/server/views');

app.use(bodyparser.urlencoded({ extended: true }))
app.use(express.static(appRoot + '/public'));

// ----------
// Ready callback
// ----------
function ready() {
    let server = app.listen(8000);

    console.log('[Endomon CMS] Running on port 8000');
}

// ----------
// Watchers
// ----------
let PluginWatcher = require(appRoot + '/src/server/watchers/PluginWatcher');

PluginWatcher.init();

// ----------
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let PluginController = require(appRoot + '/src/server/controllers/PluginController');
let MediaController = require(appRoot + '/src/server/controllers/MediaController');
let AuthController = require(appRoot + '/src/server/controllers/AuthController');

AuthController.init(app);
MediaController.init(app);
ApiController.init(app);
PluginController.init(app)
    .then(ready);

// ----------
// View
// ----------
app.get('/', function(req, res) {
//    res.render('login');
    res.render('index');
});
