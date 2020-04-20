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

// Register built-in libraries
library('content', 'Content', 'file')
    .add(HashBrown.Entity.Resource.Content)
    .add(HashBrown.Controller.ContentController);

library('forms', 'Forms', 'wpforms')
    .add(HashBrown.Entity.Resource.Form)
    .add(HashBrown.Controller.FormController);

library('media', 'Media', 'file-image-o')
    .add(HashBrown.Entity.Resource.Media)
    .add(HashBrown.Controller.MediaController);

library('publications', 'Publications', 'newspaper-o')
    .add(HashBrown.Entity.Resource.Publication)
    .add(HashBrown.Controller.PublicationController);

library('schemas', 'Schemas', 'cogs')
    .add(HashBrown.Entity.Resource.SchemaBase)
    .add(HashBrown.Entity.Resource.ContentSchema)
    .add(HashBrown.Entity.Resource.FieldSchema)
    .add(HashBrown.Controller.SchemaController);

// Service shortcuts
global.debug = HashBrown.Service.DebugService;

// State object for storing relevant current values
let state = {};

/**
 * Serves any request
 *
 * @param {HashBrown.Http.Request} request
 * @param {HashBrown.Http.Response} response
 */
async function serve(request, response) {
    checkParam(request, 'request', HashBrown.Http.Request, true);
    checkParam(response, 'response', HashBrown.Http.Response, true);

    state.request = request;
    state.response = response;

    response.code = 404;
    response.data = `No route matched ${request.method} ${request.url}`;

    for(let name in HashBrown.Controller) {
        let controller = HashBrown.Controller[name];

        let thisResponse = await controller.getResponse(request);

        if(!thisResponse) { continue; }

        response.adopt(thisResponse.data, thisResponse.statusCode, thisResponse.getHeaders());
        break;
    }

    response.send();
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
    
    HTTP.createServer(
        {
            IncomingMessage: HashBrown.Http.Request,
            ServerResponse: HashBrown.Http.Response
        },
        serve
    ).listen(port);
        
    debug.log('HTTP server restarted on port ' + port, 'HashBrown');

    // Start watching for file changes
    if(process.env.WATCH) {
        HashBrown.Service.DebugService.startWatching();
    }
    
    // Start watching schedule
    HashBrown.Service.ScheduleService.startWatching();
}

main();
