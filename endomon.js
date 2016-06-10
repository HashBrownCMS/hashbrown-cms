'use strict';

let path = require('path');

global.appRoot = path.resolve(__dirname);
global.Promise = require('bluebird');

require(appRoot + '/src/server/server.js');
