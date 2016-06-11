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
    let port = 80;
    let server = app.listen(port);

    console.log('[Endomon CMS] Running on port ' + port);
    
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

                AdminHelper.createAdmin(username, password);
                return;
        }
    }
}

// ----------
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let MediaController = require(appRoot + '/src/server/controllers/MediaController');

MediaController.init(app);
ApiController.init(app);

// ----------
// Helpers
// ----------
let PluginHelper = require(appRoot + '/src/server/helpers/PluginHelper');

PluginHelper.init(app)
    .then(ready);

// ----------
// Views
// ----------
// Project list
app.get('/', function(req, res) {
    res.render('index');
});

// Login
app.get('/login/', function(req, res) {
    res.render('login');
});

// Project
app.get('/:project', function(req, res) {
    res.render('project');
});

// Environment
app.get('/:project/:environment/', function(req, res) {
    let ProjectHelper = require(appRoot + '/src/server/helpers/ProjectHelper');    

    ProjectHelper.setCurrent(req.params.project, req.params.environment)
    .then(() => {
        res.render('environment', {
            currentProject: ProjectHelper.currentProject,
            currentEnvironment: ProjectHelper.currentEnvironment
        });
    });
});
