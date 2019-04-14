'use strict';

/**
 * @namespace HashBrown.Server
 */

const HTTP = require('http');
const FileSystem = require('fs');
const Path = require('path');

// Libs
const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const AppModulePath = require('app-module-path'); 

// Make sure we can require our source files conveniently
AppModulePath.addPath(APP_ROOT);
AppModulePath.addPath(Path.join(APP_ROOT, 'src'));

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

async function init() {
    // Check CLI input
    await HashBrown.Helpers.AppHelper.processInput();
   
    // Init plugins
    await HashBrown.Helpers.PluginHelper.init(app);

    // Start HTTP server
    let port = process.env.PORT || 8080;
    let server = HTTP.createServer(app).listen(port);

    debug.log('HTTP server restarted on port ' + port, 'HashBrown');
    
    // Init controllers
    for(let name in HashBrown.Controllers) {
        if(
            name === 'ResourceController' ||
            name === 'ApiController' ||
            name === 'Controller'
        ) { continue; }

        HashBrown.Controllers[name].init(app);
    }

    // Start watching schedule
    HashBrown.Helpers.ScheduleHelper.startWatching();
    
    // Start watching media cache
    HashBrown.Helpers.MediaHelper.startWatchingCache();
    
    // Start watching for file changes
    if(process.env.WATCH) {
        HashBrown.Helpers.DebugHelper.startWatching();
    }
}

init();
