'use strict';

let path = require('path');

global.appRoot = path.resolve(__dirname);
global.Promise = require('bluebird');

Promise.onPossiblyUnhandledRejection((error, promise) => {
    throw error;
});

require(appRoot + '/src/server/server.js');
