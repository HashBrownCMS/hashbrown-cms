'use strict';

// ----------
// Libs
// ----------
let express = require('express');
let bodyparser = require('body-parser');
let exec = require('child_process').exec;

Promise.onPossiblyUnhandledRejection((error, promise) => {
//    debug.warning(error, Promise);
    throw error;
});

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');
app.set('views', appRoot + '/src/server/views');

// ----------
// App middlewares
// ----------
app.use(bodyparser.json());
app.use(express.static(appRoot + '/public'));

// ----------
// Helpers
// ----------
global.UserHelper = require('./helpers/UserHelper');
global.ConnectionHelper = require('./helpers/ConnectionHelper');
global.ContentHelper = require('./helpers/ContentHelper');
global.LanguageHelper = require('./helpers/LanguageHelper');
global.MediaHelper = require('./helpers/MediaHelper');
global.FormHelper = require('./helpers/FormHelper');
global.MongoHelper = require('./helpers/MongoHelper');
global.PluginHelper = require('./helpers/PluginHelper');
global.ProjectHelper = require('./helpers/ProjectHelper');
global.SchemaHelper = require('./helpers/SchemaHelper');
global.SettingsHelper = require('./helpers/SettingsHelper');

global.debug = require('../common/helpers/DebugHelper');
global.debug.verbosity = 3;

PluginHelper.init(app)
    .then(ready);

// ----------
// Controllers
// ----------
let ApiController = require(appRoot + '/src/server/controllers/ApiController');
let ConnectionController = require(appRoot + '/src/server/controllers/ConnectionController');
let ContentController = require(appRoot + '/src/server/controllers/ContentController');
let FormsController = require(appRoot + '/src/server/controllers/FormsController');
let MediaController = require(appRoot + '/src/server/controllers/MediaController');
let ServerController = require(appRoot + '/src/server/controllers/ServerController');
let SettingsController = require(appRoot + '/src/server/controllers/SettingsController');
let SchemaController = require(appRoot + '/src/server/controllers/SchemaController');
let TemplateController = require(appRoot + '/src/server/controllers/TemplateController');
let UserController = require(appRoot + '/src/server/controllers/UserController');

ApiController.init(app);
ConnectionController.init(app);
ContentController.init(app);
FormsController.init(app);
MediaController.init(app);
SchemaController.init(app);
ServerController.init(app);
SettingsController.init(app);
TemplateController.init(app);
UserController.init(app);

// ----------
// Ready callback
// ----------
function ready() {
    // Start server
    let port = 80;
    let server = app.listen(port);

    debug.log('RESTART');
    
    // Startup arguments
    let cmd;
    let args = {};

    for(let k in process.argv) {
        let v = process.argv[k];

        if(/--\w+/.test(v)) {
           cmd = v.replace('--', '');
        
        } else if(/\w=\w+/.test(v)) {
            args[v.substring(0, 1)] = v.substring(2);
        
        }
    }

    switch(cmd) {
        case 'create-user':
            UserHelper.createUser(args.u, args.p);
            return;
        
        case 'revoke-tokens':
            UserHelper.revokeTokens(args.u, args.p);
    
        case 'set-user-scopes':
            UserHelper.findUser(args.u)
            .then((user) => {
                let obj = user.getObject();
                
                if(!obj.scopes[args.p]) {
                    obj.scopes[args.p] = [];
                }

                obj.scopes[args.p] = args.s.split(',');

                UserHelper.updateUser(args.u, obj);
            });

            return;
    }
}

// ----------
// Views
// ----------
// Login
app.get('/login/', function(req, res) {
    res.render('login');
});

// Project list
app.get('/', function(req, res) {
    res.render('select-project');
});

// Project
app.get('/:project', function(req, res) {
    res.render('select-environment', { project: req.params.project });
});

// Environment
app.get('/:project/:environment/', function(req, res) {
    ProjectHelper.setCurrent(req.params.project, req.params.environment)
    .then(() => {
        res.render('environment', {
            currentProject: ProjectHelper.currentProject,
            currentEnvironment: ProjectHelper.currentEnvironment
        });
    })
    .catch(() => {
        res.sendStatus(404);  
    });
});
