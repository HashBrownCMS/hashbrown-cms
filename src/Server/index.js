'use strict';

/**
 * @namespace HashBrown.Server
 */
// Libs
const HTTP = require('http');
const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const ExpressWebSockets = require('express-ws');
const FileSystem = require('fs');

// Express app
const app = Express();

app.set('view engine', 'pug');
app.set('views', APP_ROOT + '/src/Server/Views');

// App middlewares
app.use(CookieParser());
app.use(BodyParser.json({limit: '50mb'}));
app.use(Express.static(APP_ROOT + '/public'));
app.use('/storage/plugins', Express.static(APP_ROOT + '/storage/plugins'));

// Dependencies
require('Common');
require('Server/Helpers');
require('Server/Models');
require('Server/Controllers');

global.debug = HashBrown.Helpers.DebugHelper;

// Init
HashBrown.Helpers.PluginHelper.init(app)
.then(ready)
.catch((e) => {
    throw e;
});

// Check args
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
            return HashBrown.Helpers.UserHelper.createUser(args.u, args.p, args.admin === 'true');
       
        case 'make-user-admin':
            return HashBrown.Helpers.UserHelper.makeUserAdmin(args.u);

        case 'revoke-tokens':
            return HashBrown.Helpers.UserHelper.revokeTokens(args.u);
    
        case 'set-user-scopes':
            return HashBrown.Helpers.UserHelper.findUser(args.u)
            .then((user) => {
                let obj = user.getObject();
                
                if(!obj.scopes[args.p]) {
                    obj.scopes[args.p] = [];
                }

                obj.scopes[args.p] = args.s.split(',');

                return HashBrown.Helpers.UserHelper.updateUser(args.u, obj);
            });

        case 'set-user-password':
            return HashBrown.Helpers.UserHelper.findUser(args.u)
            .then((user) => {
                user.setPassword(args.p);

                return HashBrown.Helpers.UserHelper.updateUser(args.u, user.getObject());
            });

        default:
            return Promise.resolve('proceed');  
    }
}

// Ready callback
function ready(files) {
    // Check for args, and close the app if any were run
    checkArgs()
    .then((result) => {
        if(result != 'proceed') {
            process.exit();
            return;
        }
    
        // Check if any migrations are needed
        return HashBrown.Helpers.SettingsHelper.migrationCheck();
    })
    .then(() => {
        // Start HTTP server
        let port = process.env.PORT || 8080;
        
        global.server = HTTP.createServer(app).listen(port);

        debug.log('HTTP server restarted on port ' + port, 'HashBrown');
        
        // Enable WebSockets
        ExpressWebSockets(app, server);

        // Init controllers
        for(let name in HashBrown.Controllers) {
            HashBrown.Controllers[name].init(app);
        }

        // Start schedule helper
        HashBrown.Helpers.ScheduleHelper.startWatching();
        
        // Start Media cache watcher
        HashBrown.Helpers.MediaHelper.startWatchingCache();
        
        // Watch the package.json for changes
        FileSystem.watchFile(APP_ROOT + '/package.json', () => {
            debug.log('package.json changed, reloading...', 'HashBrown');

            process.exit();
        });

        debug.log('Watching package.json for changes', 'HashBrown');

        return Promise.resolve();   
    })

    // Catch errors
    .catch((e) => {
        throw e;
    });
}

