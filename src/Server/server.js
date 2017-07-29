'use strict';

// ----------
// Libs
// ----------
const FileSystem = require('fs');
const HTTP = require('http');
const HTTPS = require('https');
const Marked = require('marked');
const Express = require('express');
const BodyParser = require('body-parser');
const OS = require('os');
const CookieParser = require('cookie-parser');

// ----------
// Express app
// ----------
const app = Express();

app.set('view engine', 'pug');
app.set('views', appRoot + '/src/Server/Views');

// ----------
// App middlewares
// ----------
app.use(CookieParser());
app.use(BodyParser.json({limit: '50mb'}));
app.use(Express.static(appRoot + '/public'));

// ----------
// Global methods
// ----------
global.requiredParam = function(name) {
    throw new Error('Parameter "' + name + '" is required');
}

global.isServer = true;
global.isClient = false;

// ----------
// Helpers
// ----------
let SecurityHelper = require('Server/Helpers/SecurityHelper');

global.ConfigHelper = require('Server/Helpers/ConfigHelper');
global.UserHelper = require('Server/Helpers/UserHelper');
global.RequestHelper = require('Server/Helpers/RequestHelper');
global.ConnectionHelper = require('Server/Helpers/ConnectionHelper');
global.ContentHelper = require('Server/Helpers/ContentHelper');
global.LanguageHelper = require('Server/Helpers/LanguageHelper');
global.MediaHelper = require('Server/Helpers/MediaHelper');
global.FormHelper = require('Server/Helpers/FormHelper');
global.MongoHelper = require('Server/Helpers/MongoHelper');
global.PluginHelper = require('Server/Helpers/PluginHelper');
global.ProjectHelper = require('Server/Helpers/ProjectHelper');
global.SchemaHelper = require('Server/Helpers/SchemaHelper');
global.SettingsHelper = require('Server/Helpers/SettingsHelper');
global.BackupHelper = require('Server/Helpers/BackupHelper');
global.UpdateHelper = require('Server/Helpers/UpdateHelper');
global.ScheduleHelper = require('Server/Helpers/ScheduleHelper');
global.AppHelper = require('Server/Helpers/AppHelper');
global.SyncHelper = require('Server/Helpers/SyncHelper');

global.debug = require('Server/Helpers/DebugHelper');

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
let ApiController = require('Server/Controllers/ApiController');
let ConnectionController = require('Server/Controllers/ConnectionController');
let ContentController = require('Server/Controllers/ContentController');
let FormsController = require('Server/Controllers/FormsController');
let MediaController = require('Server/Controllers/MediaController');
let ServerController = require('Server/Controllers/ServerController');
let SettingsController = require('Server/Controllers/SettingsController');
let ScheduleController = require('Server/Controllers/ScheduleController');
let SchemaController = require('Server/Controllers/SchemaController');
let SyncController = require('Server/Controllers/SyncController');
let TemplateController = require('Server/Controllers/TemplateController');
let UserController = require('Server/Controllers/UserController');

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

        let matches = v.match(/(\w+)=(.+)/);

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

        case 'eval':
            let val = eval(args.cmd);

            if(val && typeof val.then === 'function') {
                return val;
            }

            return Promise.resolve();

        default:
            return Promise.resolve('proceed');  
    }
}

// ----------
// Views
// ----------
// Catch evil-doers
app.get([ '/wp-admin', '/wp-admin/', '/umbraco', '/umbraco/' ], (req, res) => {
    res.sendStatus(404);
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

    FileSystem.readFile(appRoot + '/' + filename, (err, file) => {
        if(err) {
            res.status(502).send(e.message);
        } else {
            res.status(200).send(isMarkdown ? Marked(file.toString()) : file.toString());
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
            os: OS,
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
	
        // Check if any migrations are needed
        return SettingsHelper.migrationCheck();
    })
    .then(() => {
		// Start HTTP server
		let port = ConfigHelper.getSync('server').port || process.env.PORT || 80;
		
		global.server = HTTP.createServer(app).listen(port);

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
				HTTPS.createServer(credentials, app).listen(443);
		
				debug.log('HTTPS server restarted', 'HashBrown');
				
				return Promise.resolve();
			});
		}

		return Promise.resolve();
	})
	
	// Catch errors
    .catch(debug.error);
}

