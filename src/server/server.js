'use strict';

// ----------
// Libs
// ----------
let fs = require('fs');
let http = require('http');
let https = require('https');
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

app.set('view engine', 'pug');
app.set('views', appRoot + '/src/server/views');

// ----------
// App middlewares
// ----------
app.use(cookieparser());
app.use(bodyparser.json({limit: '50mb'}));
app.use(express.static(appRoot + '/public'));

// ----------
// Global methods
// ----------
global.requiredParam = function(name) {
    throw new Error('Parameter "' + name + '" is required');
}

// ----------
// Helpers
// ----------
let SecurityHelper = require('./helpers/SecurityHelper');

global.ConfigHelper = require('./helpers/ConfigHelper');
global.UserHelper = require('./helpers/UserHelper');
global.RequestHelper = require('./helpers/RequestHelper');
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
global.BackupHelper = require('./helpers/BackupHelper');
global.UpdateHelper = require('./helpers/UpdateHelper');
global.ScheduleHelper = require('./helpers/ScheduleHelper');
global.AppHelper = require('./helpers/AppHelper');
global.SyncHelper = require('./helpers/SyncHelper');

global.debug = require('./helpers/DebugHelper');


// ----------
// Init
// ----------
if(SecurityHelper.isHTTPS()) {
	app.use('/', SecurityHelper.getHandler().middleware());
}

let pluginClientFiles;

PluginHelper.init(app)
.then(ready)
.catch(debug.error);

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
let ScheduleController = require('./controllers/ScheduleController');
let SchemaController = require('./controllers/SchemaController');
let SyncController = require('./controllers/SyncController');
let TemplateController = require('./controllers/TemplateController');
let UserController = require('./controllers/UserController');

ApiController.init(app);
ConnectionController.init(app);
ContentController.init(app);
FormsController.init(app);
MediaController.init(app);
ScheduleController.init(app);
SchemaController.init(app);
ServerController.init(app);
SettingsController.init(app);
SyncController.init(app);
TemplateController.init(app);
UserController.init(app);

// ----------
// Check args
// ----------
function checkArgs() {
    let cmd = process.argv[2];
    let args = {};
    
    for(let k in process.argv) {
        let v = process.argv[k];

        let matches = v.match(/(\w+)=(\w+)/);

        if(matches) {
            args[matches[1]] = matches[2];
        }
    }

    switch(cmd) {
        case 'create-user':
            return UserHelper.createUser(args.u, args.p, args.admin == 'true');
       
        case 'make-user-admin':
            return UserHelper.makeUserAdmin(args.u);

        case 'revoke-tokens':
            return UserHelper.revokeTokens(args.u, args.p);
    
        case 'set-user-scopes':
            return UserHelper.findUser(args.u)
            .then((user) => {
                let obj = user.getObject();
                
                if(!obj.scopes[args.p]) {
                    obj.scopes[args.p] = [];
                }

                obj.scopes[args.p] = args.s.split(',');

                return UserHelper.updateUser(args.u, obj);
            });

        case 'set-user-password':
            return UserHelper.findUser(args.u)
            .then((user) => {
                user.setPassword(args.p);

                return UserHelper.updateUser(args.u, user.getObject());
            });

        default:
            return new Promise((resolve) => {
                resolve('proceed');  
            });
    }
}

// ----------
// Views
// ----------
// Catch evil-doers
app.get([ '/wp-admin', '/wp-admin/', '/umbraco', '/umbraco/' ], (req, res) => {
    res.sendStatus(400);
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
app.get('/login/', SecurityHelper.checkHTTPS, function(req, res) {
    if(req.query.inviteToken) {
        UserHelper.findInviteToken(req.query.inviteToken)
        .then((user) => {
            res.render('login', {
                invitedUser: user
            });
        })
        .catch((e) => {
            res.render('login', {
                message: e.message   
            });
        });

    } else {
        UserHelper.getAllUsers()
        .then((users) => {
            res.render('login', {
                firstTime: !users || users.length < 1
            });
        })
        .catch((e) => {
            res.render('login', {
                message: e.message   
            });
        });

    }
});

// Dashboard
app.get('/', SecurityHelper.checkHTTPS, function(req, res) {
    let user;

    ApiController.authenticate(req.cookies.token)
    .then((result) => {
        user = result;
    })
    .then((update) => {
        res.render('dashboard', {
            os: os,
            user: user,
            app: require(appRoot + '/package.json'),
            pluginClientFiles: pluginClientFiles
        });
    })
    .catch((e) => {
        res.status(403).redirect('/login');  
    });
});

// Environment
app.get('/:project/:environment/', SecurityHelper.checkHTTPS, function(req, res) {
    let user;
  
  	ProjectHelper.environmentExists(req.params.project, req.params.environment)
	.then((exists) => {
    	if(!exists) {
			return Promise.reject(new Error('404: The project and environment "' + req.params.project + '/' + req.params.environment + '" could not be found'));
		}
		
		return ApiController.authenticate(req.cookies.token);
	})
    .then((authUser) => {
        user = authUser;

        if(!user.isAdmin && !user.scopes[req.params.project]) {
            debug.error('User "' + user.username + '" doesn\'t have project "' + req.params.project + '" in scopes');
        }  
        
        res.render('environment', {
            currentProject: req.params.project,
            currentEnvironment: req.params.environment,
            user: user,
            pluginClientFiles: pluginClientFiles
        });
    })
    .catch((e) => {
		if(e.message.indexOf('404') == 0) {
			res.status(404).render('404', { message: e.message });
		} else {
			res.status(403).redirect('/login?path=/' + req.params.project + '/' + req.params.environment);  
		}
    });
});

// ----------
// Ready callback
// ----------
function ready(files) {
    pluginClientFiles = files;

    // Check for args, and close the app if any were run
    checkArgs()
    .then((result) => {
        if(result != 'proceed') {
			process.exit();
			return;
		}
		
		// Start HTTP server
		let port = ConfigHelper.getSync('server').port || process.env.PORT || 80;
		
		global.server = http.createServer(app).listen(port);

		debug.log('HTTP server restarted on port ' + port, 'HashBrown');
				 
		// Start schedule helper
		ScheduleHelper.startWatching();
        
		return Promise.resolve();	
    })

	// Start HTTPS server
	.then(() => {
		if(SecurityHelper.isHTTPS()) {
			return SecurityHelper.register()
			.then((credentials) => {
				https.createServer(credentials, app).listen(443);
		
				debug.log('HTTPS server restarted', 'HashBrown');
				
				return Promise.resolve();
			});
		}

		return Promise.resolve();
	})
	
	// Catch errors
    .catch(debug.error);
}

