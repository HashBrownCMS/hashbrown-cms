'use strict';

let path = require('path');
global.appRoot = path.resolve(__dirname);

require(appRoot + '/src/server/server.js');
