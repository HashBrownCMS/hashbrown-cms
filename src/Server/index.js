'use strict';

/**
 * @namespace HashBrown.Server
 */

const HTTP = require('http');
const FileSystem = require('fs');
const Path = require('path');

// Libs
const AppModulePath = require('app-module-path'); 

// Make sure we can require our source files conveniently
AppModulePath.addPath(APP_ROOT);
AppModulePath.addPath(Path.join(APP_ROOT, 'src'));

// Dependencies
require('Common/utilities');

require('Server/Http');
require('Server/Service');
require('Server/Entity');
require('Server/Controller');

// Service shortcuts
global.debug = HashBrown.Service.DebugService;

// State object for storing relevant current values
let state = {};

/**
 * Serves any request
 */
async function serve(request, response) {
    state.request = request;
    state.response = response;

    let result = new HashBrown.Http.Response(`No route matched ${request.method} ${request.url}`, 404);

    for(let name in HashBrown.Controller) {
        let controller = HashBrown.Controller[name];

        let thisResponse = await controller.getResponse(request);

        if(!thisResponse) { continue; }

        result = thisResponse;
        break;
    }

    result.end(response);
}

/**
 * Handles uncaught exceptions
 */
async function exception(error) {
    debug.error(error, 'HashBrown', true);

    if(state.response) {
        let result = new HashBrown.Http.Response(error.stack || error.message || 'Unexpected error', error.code || 500);
    
        result.end(state.response);
    }
}

/**
 * Starts the application
 */
async function main() {
    // Check CLI input
    await HashBrown.Controller.InputController.handle();

    // Register system cleanup event
    for(let signal of [ 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'exit' ]) {
        process.on(signal, (e) => {
            if(e instanceof Error) {
                debug.error(e, 'HashBrown', true);
            }

            HashBrown.Service.EventService.trigger('stop');
        });
    }

    // Handle uncaught exceptions
    process.on('uncaughtException', exception);

    // Perform migration tasks
    await HashBrown.Service.MigrationService.migrate();

    // Init plugins
    await HashBrown.Service.PluginService.init();

    // Start HTTP server
    let port = process.env.NODE_PORT || process.env.PORT || 8080;
    
    HTTP.createServer(serve).listen(port);
        
    debug.log('HTTP server restarted on port ' + port, 'HashBrown');

    // Start watching for file changes
    if(process.env.WATCH) {
        HashBrown.Service.DebugService.startWatching();
    }
    
    // Start watching schedule
    HashBrown.Service.ScheduleService.startWatching();
}

main();
