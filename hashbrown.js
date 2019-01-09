'use strict';

/**
 * @namespace HashBrown
 */

/**
 * @namespace HashBrown.Common
 */

const AppModulePath = require('app-module-path'); 
const Path = require('path');

// Set app root
global.APP_ROOT = Path.resolve(__dirname);

// Make sure we can require our source files conveniently
AppModulePath.addPath(__dirname);
AppModulePath.addPath(Path.resolve(__dirname, './src'));

// Use bluebird promise
global.Promise = require('bluebird');

Promise.onPossiblyUnhandledRejection((error, promise) => {
    throw error;
});

// Include main server module
require(APP_ROOT + '/src/Server');
