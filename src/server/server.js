'use strict';

// ----------
// Libs
// ----------
let fs = require('fs');
let markdownToHtml = require('marked');
let express = require('express');
let bodyparser = require('body-parser');
let exec = require('child_process').exec;
let os = require('os');
let cookieparser = require('cookie-parser');

// ----------
// Express app
// ----------
let app = express();

app.set('view engine', 'jade');
app.set('views', appRoot + '/src/server/views');

// ----------
// App middlewares
// ----------
app.use(cookieparser());
app.use(bodyparser.json({limit: '50mb'}));
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
global.LogHelper = require('./helpers/LogHelper');
global.BackupHelper = require('./helpers/BackupHelper');
global.UpdateHelper = require('./helpers/UpdateHelper');
global.AppHelper = require('./helpers/AppHelper');

global.debug = require('./helpers/DebugHelper');
global.debug.verbosity = 2;

PluginHelper.init(app)
    .then(ready);

// ----------
// Controllers
// ----------
let ApiController = require('./controllers/ApiController');
let ConnectionController = require('./controllers/ConnectionController');
let ContentController = require('./controllers/ContentController');
let FormsController = require('./controllers/FormsController');
let MediaController = require('./controllers/MediaController');
let ServerController = require('./controllers/ServerController');
let SettingsController = require('./controllers/SettingsController');
let SchemaController = require('./controllers/SchemaController');
let TemplateController = require('./controllers/TemplateController');
let UserController = require('./controllers/UserController');

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

    console.log('RESTART');
    
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
       
        case 'make-user-admin':
            UserHelper.makeUserAdmin(args.u);
            return;

        case 'revoke-tokens':
            UserHelper.revokeTokens(args.u, args.p);
            return;
    
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
// Catch evil-doers
app.get([ '/wp-admin', '/wp-admin/', '/umbraco', '/umbraco/' ], (req, res) => {
    res.status(200).send('Nice try, but wrong CMS. This incident will be reported.');
});

// Text
app.get('/text/:name', function(req, res) {
    let filename = '';
    let isMarkdown = false;

    switch(req.params.name) {
        case 'readme':
            filename = 'README.md';
            isMarkdown = true;
            break;
        
        case 'license':
            filename = 'LICENSE';
            break;
        
        case 'welcome':
            filename = 'WELCOME.md';
            isMarkdown = true;
            break;
    }

    fs.readFile(appRoot + '/' + filename, (err, file) => {
        if(err) {
            res.status(502).send(e.message);
        } else {
            res.status(200).send(isMarkdown ? markdownToHtml(file.toString()) : file.toString());
        }
    });
});

// Login
app.get('/login/', function(req, res) {
    res.render('login');
});

// Dashboard
app.get('/', function(req, res) {
    ApiController.authenticate(req.cookies.token)
    .then((user) => {
        if(user.isAdmin) {
            return UpdateHelper.check();
        } else {
            return new Promise((resolve) => {
                resolve({});
            });
        }
    })
    .then((update) => {
        res.render('dashboard', {
            os: os,
            update: update
        });
    })
    .catch((e) => {
        debug.log(e.message, this);
        res.status(403).redirect('/login');  
    });
});

// Environment
app.get('/:project/:environment/', function(req, res) {
    ApiController.authenticate(req.cookies.token)
    .then((user) => {
        if(!user.scopes[req.params.project]) {
            debug.error('User "' + user.username + '" doesn\'t have project "' + req.params.project + '" in scopes');
        }  

        return ProjectHelper.setCurrent(req.params.project, req.params.environment);
    })
    .then(() => {
        res.render('environment', {
            currentProject: ProjectHelper.currentProject,
            currentEnvironment: ProjectHelper.currentEnvironment
        });
    })
    .catch((e) => {
        debug.log(e.message, this);
        res.status(403).redirect('/login');  
    });
});
