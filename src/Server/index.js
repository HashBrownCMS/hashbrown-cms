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
require('Common');
require('Server/Service');
require('Server/Entity');
require('Server/Controller');

// Service shortcuts
global.debug = HashBrown.Service.DebugService;

// HTTP framework
global.HttpError = class HttpError extends Error {
    constructor(message, code, stack) {
        super(message);

        this.code = code || 500;

        if(stack) {
            this.stack = stack;
        }
    }
}

global.HttpResponse = class HttpResponse {
    constructor(data, code, headers) {
        this.data = data || '';
        this.code = isNaN(code) ? 200 : code;
        this.headers = typeof headers === 'object' ? headers || {} : {};

        if(typeof this.data === 'object' && !this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/json';
            this.data = JSON.stringify(this.data);
        }

        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'text/plain';
        }

        if(typeof this.data !== 'string' && this.data instanceof Buffer === false) {
            this.data = Buffer.from(this.data);
        }
    }
}

async function serve(request, response) {
    let result = new HttpResponse(`No route matched ${request.url}`, 404);

    for(let name in HashBrown.Controller) {
        let controller = HashBrown.Controller[name];

        if(!controller.canHandle(request)) { continue; }

        try {
            result = await controller.handle(request, response);
        } catch(e) {
            result = controller.error(e);
        }
        break;
    }
    
    if(result instanceof HttpResponse) {
        response.writeHead(result.code || 200, result.headers || {});
        response.end(result.data);
    
    } else {
        response.writeHead(500, {});
        response.end('Controller response was of an unknown format');

    }
}

async function main() {
    // Check CLI input
    await HashBrown.Controller.InputController.handle();

    // Register system cleanup event
    for(let signal of [ 'SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2', 'uncaughtException', 'exit' ]) {
        process.on(signal, () => { HashBrown.Service.EventService.trigger('stop'); });
    }

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
    
    // Start watching media cache
    HashBrown.Service.MediaService.startWatchingCache();
}

main();
