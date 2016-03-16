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
// Gulp
// ----------
let gulp = exec('cd ' + appRoot + ' && gulp', {
    cdw: appRoot
});

gulp.stdout.on('data', (data) => {
    console.log('[Gulp] ' + data);
});

gulp.stderr.on('data', (data) => {
    console.log('[Gulp] ' + data);
});

gulp.on('close', (data) => {
    console.log('[Gulp] ' + data);
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
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let PluginController = require(appRoot + '/src/server/controllers/PluginController');
let MediaController = require(appRoot + '/src/server/controllers/MediaController');

MediaController.init(app);
ApiController.init(app);
PluginController.init()
    .then(ready);

// ----------
// View
// ----------
app.get('/', function(req, res) {
    res.render('index');
});

