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
    // Start server
    let server = app.listen(8000);

    console.log('[Endomon CMS] Running on port 8000');
    
    // Startup arguments
    for(let k in process.argv) {
        let v = process.argv[k];

        switch(v) {
            case 'create-admin':
                let username = process.argv[(parseInt(k) + 1).toString()];
                let password = process.argv[(parseInt(k) + 2).toString()];

                username = username.replace('u=', '');
                password = password.replace('p=', '');

                let AdminHelper = require(appRoot + '/src/server/helpers/AdminHelper');

                console.log(username, password);

                AdminHelper.createAdmin(username, password);
                return;
        }
    }
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

MediaController.init(app);
ApiController.init(app);
PluginController.init(app)
    .then(ready);

// ----------
// View
// ----------
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/login/', function(req, res) {
    res.render('login');
});
